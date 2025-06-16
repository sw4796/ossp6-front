import api from './auth';

// 광고자리 입찰 시작 API
export async function startBidForAdSlot(adSlotId) {
  try {
    const res = await api.post('ads/adslot/change', { adSlotId });
    return res.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
