import api from './auth';

export const getAdSlots = async (body) => {
  // body를 인자로 받도록 수정
  try {
    const res = await api.post('/ads/adslot', body); // body를 요청에 포함
    if (res.data.success) {
      return res.data; // data 전체를 반환하도록 수정 (Mainpage.jsx 로직과 일치시키기 위해)
    } else {
      throw new Error('광고 자리 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error: error.message }; // 실패 시 응답 형식 통일
  }
};
