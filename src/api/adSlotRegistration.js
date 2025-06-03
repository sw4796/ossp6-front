import api from './auth';

// 광고자리 등록 (multipart/form-data)
export const registAdSlot = async (dto, file) => {
  const formData = new FormData();
  formData.append('dto', JSON.stringify(dto));
  if (file) {
    formData.append('image', file);
  }
  return api.post('/ads/adslot/regist', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default registAdSlot;
