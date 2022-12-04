class UserDataDto {
  userId?: string;
  userNick?: string;
  profileImage?: string;
}

class BroadcastDataDto {
  broadNo?: number;
  broadTitle?: string;
  broadDatetime?: string;
  currentSumViewer?: number;
}

export class BroadcastInfo {
  userExist: boolean;
  onAir: boolean;
  userData: UserDataDto;
  broadcastData: BroadcastDataDto;
}
