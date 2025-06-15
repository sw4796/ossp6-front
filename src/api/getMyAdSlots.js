import api from './auth';

// 내 광고자리 목록 및 통계 조회 API
// adminId: 관리자(미디어) 유저의 id
export async function getMyAdSlots(adminId) {
  const response = await api.get(`/ads/adslot/admin/${adminId}`);
  return response.data;
}
