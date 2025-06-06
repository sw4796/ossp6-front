import api from './auth';

export const getAdSlots = async () => {
    try{
        const res = await api.get('/ads/adslot');
        if(res.data.success){
            return res.data.data;
        }else{
            throw new Error('광고 자리 데이터를 불러오는데 실패했습니다.');
        }
    }catch(error){
        console.error(error);
        return [];
    }
};