import api from '@/lib/axios';
import type { Friend } from '@/types/user';

export async function sendFriendRequest(userId: string, message: string) {
  return api.post('/friends/requests', { to: userId, message: message });
}

export async function getAllFriends(): Promise<Friend[]> {
  const res = await api.get('/friends');
  return res.data.friends;
}

