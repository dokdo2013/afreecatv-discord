export class TwapiStream {
  id: string;
  title: string;
  started_at: string;
  viewer_count: string;
  thumbnail_url: string;
  game_name: string;
}

export class TwapiUser {
  display_name: string;
  login: string;
  profile_image_url: string;
  offline_image_url: string;
}

export class TwapiEvent {
  stream: TwapiStream;
  user: TwapiUser;
}

export class TwapiSubscription {
  id: string;
}

export class TwapiDto {
  event: TwapiEvent;
  subscription: TwapiSubscription;
}
