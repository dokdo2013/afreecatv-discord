export class SenderDto {
  name: string;
  icon_url: string;
}

export class MessageDto {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export class AuthorDto {
  name: string;
  icon_url: string;
  url: string;
}

export class WebhookDto {
  webhookUrl: string;
  status: string;
  message: MessageDto;
  author: AuthorDto;
  sender: SenderDto;
  text?: string;
}
