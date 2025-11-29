export interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  to: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FriendRequests {
  sent: FriendRequest[];
  received: FriendRequest[];
}

