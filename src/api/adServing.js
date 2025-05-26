import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 광고 노출 목록 조회
export const getAdServingList = (adid) => api.get('/ad-serving', { adid });
