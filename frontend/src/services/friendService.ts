import axios from '@/lib/axios';

export async function sendFriendRequest(userId: string, message: string) {
  return axios.post('/friends/requests', { to: userId, message: message });
}

