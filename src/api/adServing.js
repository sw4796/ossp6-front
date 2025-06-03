import api from './auth';

// 광고 노출 목록 조회
export const getAdServingList = (adid) => api.get('/ad-serving', { adid });

// 광고자리 상세 정보 조회 (week/month)
export const getAdSlotInfo = (adslotId, type) =>
  api.get(`/ads/adslot/infor/${adslotId}`, { params: { type } });

// 광고자리별 입찰/노출 내역 조회
export const getSlotServingDetail = (adslotId) =>
  api.get(`/ads/adslot/${adslotId}`);

// 광고 노출 목록 조회
export const getMyAdDetail = (adId) => api.get(`/ads/my/ad/${adId}`);
