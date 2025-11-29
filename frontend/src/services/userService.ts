import axios from '@/lib/axios';
import type { User } from '@/types/user';

export async function searchUsers(key: string): Promise<User[]> {
  const res = await axios.get('/users/search', { params: { key } });
  return res.data.users;
}

