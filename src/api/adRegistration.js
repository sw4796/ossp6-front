import api from './auth'; // auth.js의 api 인스턴스를 import

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
