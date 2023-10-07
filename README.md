# afreecatv-discord

아프리카TV 뱅온알림봇 서비스 API

## Tech Stack

- Nest.js
- MariaDB
- Redis

## Deployment

- Github -> Jenkins -> AWS EC2 (PM2)

## Deployment using Docker

```
$ sudo docker-compose up -d
```

## MicroServices

- [afreecatv-discord-sender](https://github.com/dokdo2013/afreecatv-discord-sender)
