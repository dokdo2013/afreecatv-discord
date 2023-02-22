import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import axios from 'axios';
import { SendDto } from './send.dto';
import { WebhookDto } from './webhook.dto';
import { BroadcastInfo } from './broadcast-info.dto';
import { ConfigService } from '@nestjs/config';
import { ImageService } from 'src/image/image.service';
import { TwapiDto } from './twapi.dto';

@Injectable()
export class BroadcastService {
  client: ClientProxy;

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
      },
    });
  }

  async publish(data: SendDto) {
    const sendData: WebhookDto = {
      webhookUrl: data.webhook_url,
      status: 'info',
      message: {
        title: data.broadcast_title,
        description: `${data.alert_message}\nhttps://play.afreecatv.com/${data.broadcaster_id}/${data.broadcast_id}`,
        image: data.broadcast_image,
        url: `https://play.afreecatv.com/${data.broadcaster_id}/${data.broadcast_id}`,
      },
      author: {
        name: data.broadcaster_name,
        icon_url: `https:${data.broadcaster_image}`,
        url: `https://bj.afreecatv.com/${data.broadcaster_id}`,
      },
      text: `@everyone ${data.broadcaster_name}님이 방송을 켰어요!`,
      sender: {
        name: data.sender_name,
        icon_url: `${data.sender_image}`,
      },
    };

    this.client.emit('sendDiscord', sendData);
  }

  /**
   * Cron Job
   */
  async broadcastChecker() {
    console.log(`broadcastChecker start - ${new Date()}`);

    // 체크 필요한 방송국 목록 불러오기
    const broadcastList = await this.getBroadcastList();

    for (let i = 0; i < broadcastList.length; i++) {
      const userId = broadcastList[i];
      console.log(`broadcastChecker check ${i + 1} - ${userId}`);

      const broadcastInfo = await this.getBroadcastInfo(userId);

      // 방송국이 존재하지 않는 경우
      if (!broadcastInfo.userExist) {
        console.log(`broadcastChecker check ${i + 1} - ${userId} not exist`);
        continue;
      }

      // 방송 중이 아닌 경우
      if (!broadcastInfo.onAir) {
        // 방송 중이 아닌데 redis에 방송 중이라고 저장되어 있는 경우
        const isBroadOnAir = await this.redisClient.sismember(
          'afd:broadcastOnAir',
          userId,
        );
        if (isBroadOnAir) {
          // redis에서 방송 중인 목록에서 제거
          await this.redisClient.srem('afd:broadcastOnAir', userId);
        }

        console.log(`broadcastChecker check ${i + 1} - ${userId} not onAir`);
        continue;
      }

      // 방송 중인 경우
      const broadNo = broadcastInfo.broadcastData.broadNo;
      const broadTitle = broadcastInfo.broadcastData.broadTitle;

      // 이미 방송 중인지 확인
      const isBroadOnAir = await this.redisClient.sismember(
        'afd:broadcastOnAir',
        userId,
      );

      // 방송 중이 아닌 경우
      if (!isBroadOnAir) {
        // 방송 중으로 등록
        await this.redisClient.sadd('afd:broadcastOnAir', userId);

        // 알림 정보 가져오기
        const alert_data = await this.getAlertInfo(userId);
        console.log(
          `broadcastChecker check ${i + 1} - ${userId} alert_data`,
          alert_data,
        );

        // 방송 이미지를 클라우드플레어에 올리고 링크 가져오기
        const broadcastImage = await this.imageService.uploadImageFromUrl(
          `https://liveimg.afreecatv.com/h/${broadNo}.webp`,
        );

        // twapi 서버로 메시지 전송
        await this.triggerTwapi(broadcastInfo, broadcastImage);

        // 알림 정보 없는 경우
        if (!alert_data) {
          console.log(
            `broadcastChecker check ${i + 1} - ${userId} no alert data`,
          );
          continue;
        }

        // 방송 시작 알림
        const message: SendDto = {
          webhook_url: alert_data.webhook_url,
          broadcast_id: broadNo,
          broadcast_title: broadTitle,
          broadcast_image: `https://liveimg.afreecatv.com/h/${broadNo}.webp`,
          broadcaster_id: userId,
          broadcaster_name: broadcastInfo.userData.userNick,
          broadcaster_image: broadcastInfo.userData.profileImage,
          alert_message: alert_data.alert_message,
          sender_name: alert_data.sender_name,
          sender_image: alert_data.sender_image,
        };
        console.log(`broadcastChecker check ${i + 1} - ${userId} send message`);

        this.publish(message);

        if (alert_data.webhook_url2) {
          const message2: SendDto = {
            webhook_url: alert_data.webhook_url2,
            broadcast_id: broadNo,
            broadcast_title: broadTitle,
            broadcast_image: `https://liveimg.afreecatv.com/h/${broadNo}.webp`,
            broadcaster_id: userId,
            broadcaster_name: broadcastInfo.userData.userNick,
            broadcaster_image: broadcastInfo.userData.profileImage,
            alert_message: alert_data.alert_message,
            sender_name: alert_data.sender_name,
            sender_image: alert_data.sender_image,
          };
          console.log(`broadcastChecker check ${i + 1} - ${userId} send message`);
  
          this.publish(message2);
        }

        // twapi 서버로 메시지 전송
        await this.triggerTwapi(broadcastInfo, broadcastImage);
      } else {
        // 방송 중인 경우
        console.log(
          `broadcastChecker check ${i + 1} - ${userId} already onAir`,
        );
      }
    }

    console.log(`broadcastChecker end - ${new Date()}`);
  }

  async getBroadcastList() {
    // 방송국 목록 불러오기 from redis
    const broadcastList = await this.redisClient.smembers('afd:broadcastList');
    return broadcastList;
  }

  async getAlertInfo(userId: string): Promise<any> {
    // get alert data
    const alert_data = await this.redisClient.get(`afd:alert:${userId}`);

    if (!alert_data) {
      return null;
    }

    try {
      return JSON.parse(alert_data);
    } catch (e) {
      return null;
    }
  }

  // 방송 상태와 정보 조회
  async getBroadcastInfo(userId: string): Promise<BroadcastInfo> {
    const endpoint = `https://bjapi.afreecatv.com/api/${userId}/station`;
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36';
    const res = await axios
      .get(endpoint, {
        headers: { 'User-Agent': userAgent },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    const data = res;

    // 존재하는 방송국인지 확인 (code 정보가 없어서 추후 예외처리 필요)
    if (data.code == 9000) {
      return {
        userExist: false,
        onAir: false,
        userData: {},
        broadcastData: {},
      };
    }

    // 방송 중인지 확인
    if (data.broad == null) {
      return {
        userExist: true,
        onAir: false,
        userData: {
          userId: data.station.user_id,
          userNick: data.station.user_nick,
          profileImage: data.profile_image,
        },
        broadcastData: {},
      };
    } else {
      return {
        userExist: true,
        onAir: true,
        userData: {
          userId: data.station.user_id,
          userNick: data.station.user_nick,
          profileImage: data.profile_image,
        },
        broadcastData: {
          broadNo: data.broad.broad_no,
          broadTitle: data.broad.broad_title,
          broadDatetime: data.station.broad_start,
          currentSumViewer: data.broad.current_sum_viewer,
        },
      };
    }
  }

  async triggerTwapi(data: BroadcastInfo, broadcastImage: string) {
    const endpoint = 'https://twapi.haenu.com/trigger';
    const apiKey = this.configService.get('TMI_API_SECRET');

    const apiData: TwapiDto = {
      event: {
        stream: {
          id: data.broadcastData.broadNo.toString(),
          title: data.broadcastData.broadTitle,
          started_at: data.broadcastData.broadDatetime,
          viewer_count: data.broadcastData.currentSumViewer.toString(),
          thumbnail_url: broadcastImage,
          game_name: 'AfreecaTV',
        },
        user: {
          display_name: data.userData.userNick,
          login: data.userData.userId,
          profile_image_url: data.userData.profileImage,
          offline_image_url: '',
        },
      },
      subscription: {
        id: `afd-${data.userData.userId}`,
      },
    };

    const res = await axios
      .post(endpoint, JSON.stringify(apiData), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
      })
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);

        return err.response.data;
      });

    return res;
  }
}
