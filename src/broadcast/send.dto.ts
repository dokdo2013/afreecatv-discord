export class SendDto {
  webhook_url: string;
  broadcast_id: number;
  broadcast_title: string;
  broadcast_image: string;
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_image: string;
  alert_message: string;
  sender_name: string;
  sender_image: string;
  webhook_url2?: string;
}
