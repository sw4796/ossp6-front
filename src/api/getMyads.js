import api, { getUSerToken } from './auth';

export const getMyads = async () => {
  const user = getUSerToken();
  if (!user || !user.userId) {
    return { success: false, error: 'Invalid or no token found' };
  }

  try {
    const res = await api.get(`/ads/my/user/${user.userId}`);
    return res.data;
   }catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};
export default getMyads;