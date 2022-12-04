import axios from 'axios';
import * as FormData from 'form-data';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  token: string;
  accountId: string;
  apiUrl: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {
    // get key from config service
    this.token = this.configService.get('CLOUDFLARE_API_TOKEN');
    this.accountId = this.configService.get('CLOUDFLARE_ACCOUNT_ID');
    this.apiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`;
  }

  async uploadImageFromUrl(url: string): Promise<any> {
    const hashUrl = await this.getUniqueHashUrl();

    // import formdata with nodejs
    const frm = new FormData();
    frm.append('url', url);
    frm.append('requireSignedURLs', 'false');
    frm.append('id', hashUrl);

    const response = await axios
      .post(`${this.apiUrl}`, frm, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        throw new Error('Could not upload image to cloudflare');
      });

    // add hash url to cache
    const cacheKey = 'cfimage:url';
    await this.redisClient.sadd(cacheKey, hashUrl);

    const imageUrl = `https://cdn.haenu.com/cdn-cgi/imagedelivery/lR-z0ff8FVe1ydEi9nc-5Q/${hashUrl}/public`;

    return imageUrl;
  }

  async getUniqueHashUrl() {
    // get hash url
    let hashUrl = this.getHashUrl();
    // check if url is already in cache
    // if exists, get new hash url up to 10 times
    let i = 0;
    while (!(await this.verifyUrl(hashUrl))) {
      hashUrl = this.getHashUrl();
      i++;
      if (i > 10) {
        throw new Error('Could not generate unique hash url');
      }
    }
    return hashUrl;
  }

  getHashUrl() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < 10; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
  }

  async verifyUrl(url: string) {
    const cacheKey = 'cfimage:url';
    const cache = await this.redisClient.sismember(cacheKey, url);
    return cache === 0;
  }
}
