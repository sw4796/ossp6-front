import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 광고 등록 (multipart/form-data)
export const registAd = async (dto, file) => {
  const formData = new FormData();
  formData.append('dto', JSON.stringify(dto));
  if (file) {
    formData.append('image', file);
  }
  return api.post('/ads/regist', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
