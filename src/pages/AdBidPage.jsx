import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import BidHistoryChart from '../components/BidHistoryChart';
import TimeSlotChart from '../components/TimeSlotChart';
import EfficiencyChart from '../components/EfficiencyChart';
import BidSummaryTable from '../components/BidSummaryTable';
import { getAdBidDetail } from '../api/adServing';
import 'remixicon/fonts/remixicon.css';

export default function AdBidPage() {
  // 광고자리 id 파싱
  const { adslotId } = useParams();

  // API 데이터 상태
  const [apiData, setApiData] = useState(null);
  useEffect(() => {
    if (!adslotId) return;
    getAdBidDetail(adslotId).then((res) => {
      if (res.data && res.data.success) {
        setApiData(res.data.data);
      }
    });
  }, [adslotId]);

  // 데이터 분리
  const slotData = apiData?.navigateBidResponseDto || {};
  const bidInfo = apiData?.adInforBidResponseDto || {};

  // 입찰 마감까지 남은 시간 계산
  let bidEndText = '-';
  let bidEndPercent = 0;
  if (slotData.startDate && slotData.endDate) {
    const now = new Date();
    const start = new Date(slotData.startDate);
    const end = new Date(slotData.endDate);
    const total = end - start;
    const remain = end - now;
    if (remain > 0 && total > 0) {
      const hours = Math.floor(remain / (1000 * 60 * 60));
      const minutes = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));
      bidEndText = `${hours}시간 ${minutes}분 남음`;
      bidEndPercent = Math.max(
        0,
        Math.min(100, ((total - remain) / total) * 100)
      );
    } else if (remain <= 0) {
      bidEndText = '마감';
      bidEndPercent = 100;
    }
  }

  // 시간대별 선택 및 입찰가 상태
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bidValues, setBidValues] = useState({});
  const [termsChecked, setTermsChecked] = useState(false);

  // 시간대 토글 핸들러
  const handleSlotToggle = (idx) => {
    const isSelected = selectedSlots.includes(idx);
    const nextSlots = isSelected
      ? selectedSlots.filter((s) => s !== idx)
      : [...selectedSlots, idx];

    setSelectedSlots(nextSlots);

    setBidValues((prevBid) =>
      isSelected
        ? { ...prevBid, [idx]: undefined }
        : { ...prevBid, [idx]: bidInfo.avgTimeBidMoney[idx] }
    );

    if (!termsChecked && !isSelected) {
      setTermsChecked(true);
    }
  };

  // 입찰가 입력 핸들러
  const handleBidInput = (idx, value) => {
    setBidValues((prev) => ({ ...prev, [idx]: Number(value) }));
  };

  // 요약 계산
  const totalHours = selectedSlots.length * 2;
  const dailyCost = selectedSlots.reduce(
    (sum, idx) => sum + (bidValues[idx] || 0),
    0
  );
  const totalCost = dailyCost * 30;

  // 제출 버튼 활성화
  const canSubmit = selectedSlots.length > 0 && termsChecked;

  // 입찰 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    alert('입찰이 성공적으로 제출되었습니다!');
  };

  // slotData, 입찰 마감까지, 그래프 데이터 등 API 데이터 기반으로 렌더링
  // slotData: 광고자리 정보
  // bidInfo: 입찰 기록 정보

  // 시간대 라벨(2시간 단위 12개)
  const TIME_SLOTS = [
    '00:00~02:00',
    '02:00~04:00',
    '04:00~06:00',
    '06:00~08:00',
    '08:00~10:00',
    '10:00~12:00',
    '12:00~14:00',
    '14:00~16:00',
    '16:00~18:00',
    '18:00~20:00',
    '20:00~22:00',
    '22:00~24:00',
  ];

  // 시간대별 평균 입찰가
  const TIMESLOT_CHART_DATA = (bidInfo.avgTimeBidMoney || []).map((v, i) => ({
    시간대: TIME_SLOTS[i],
    평균입찰가: v,
    color: 'rgba(141,211,199,1)',
  }));
  // 평균 입찰가/최고 입찰가 (그래프용)
  const BID_HISTORY_DATA = [
    {
      id: '평균 입찰가',
      color: 'hsl(200, 80%, 60%)',
      data: (bidInfo.avgBidMoney || []).map((v, i) => ({
        x: `${i + 1}회`,
        y: v,
      })),
    },
    {
      id: '최고 입찰가',
      color: 'hsl(40, 90%, 60%)',
      data: (bidInfo.maxBidMoney || []).map((v, i) => ({
        x: `${i + 1}회`,
        y: v,
      })),
    },
  ];

  return (
    <div className="font-['Noto Sans KR'] bg-gray-50 min-h-screen flex flex-col w-full">
      <Header />
      {/* Main */}
      <main className="flex flex-row justify-center w-full">
        <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-8">
          {/* 광고 정보 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="h-48 sm:h-56 md:h-64 bg-gray-200 relative">
              <img
                src="https://readdy.ai/api/search-image?query=A%20modern%20digital%20advertising%20billboard%20in%20a%20busy%20urban%20setting%2C%20high-quality%20professional%20photograph%2C%20clean%20background%2C%20showing%20a%20vibrant%20advertisement%20display%2C%20perfect%20for%20showcasing%20ad%20space%2C%20high%20resolution%2C%20commercial%20photography%20style%2C%20realistic&width=1200&height=400&seq=ad1&orientation=landscape"
                alt="광고 자리 이미지"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                {slotData.bidStatus}
              </div>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start gap-6 lg:gap-8">
                <div className="w-full lg:w-7/12">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {slotData.adSlotName}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span className="ml-1">{slotData.address}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        광고판 크기
                      </div>
                      <div className="font-['Roboto'] text-base font-medium leading-6 tracking-normal text-black">
                        {slotData.width && slotData.height ? (
                          <>
                            {slotData.width} x {slotData.height} m (가로 x 세로)
                          </>
                        ) : (
                          '정보 없음'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">광고판 설명</h2>
                    <p className="text-gray-600 mb-4">{slotData.description}</p>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 mt-6 lg:mt-0">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">입찰 정보</h3>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">입찰 마감까지</span>
                        <span className="font-medium text-red-600">
                          {bidEndText}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${bidEndPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between">
                        <span className="text-gray-600">광고 게재 기간</span>
                        <span className="font-medium">{slotData.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">평균 입찰가</span>
                        <span className="font-medium">{slotData.avgBid}</span>
                      </div>
                    </div>
                    {/* 입찰 참여하기 버튼 제거됨 */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 차트 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm col-span-2">
              <h2 className="text-xl font-semibold mb-4">과거 입찰 기록</h2>
              <BidHistoryChart data={BID_HISTORY_DATA} />
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                시간대별 평균 입찰가
              </h2>
              <TimeSlotChart data={TIMESLOT_CHART_DATA} />
            </div>
          </div>
          {/* 입찰 설정 및 요약 */}
          <div>
            <div
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-8"
              style={{ width: '100%' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">입찰 설정</h2>
              </div>
              {/* 시간대별 입찰 입력 */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                id="timeSlots"
              >
                {TIME_SLOTS?.map((label, idx) => (
                  <div
                    key={idx}
                    className="h-[112px] flex flex-col p-4 rounded-[16px] bg-transparent border border-solid border-gray-200 opacity-100 box-border"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-['Roboto'] text-base font-medium leading-6 tracking-normal text-black">
                        {label}
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={selectedSlots.includes(idx)}
                          onChange={() => handleSlotToggle(idx)}
                        />
                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full h-[42px] pl-[40px] pr-3 py-2 rounded-[8px] bg-[#efefef]/30 border border-[#D1D5DB] opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bid-input"
                        placeholder="입찰가 입력"
                        disabled={!selectedSlots.includes(idx)}
                        value={bidValues[idx] ?? ''}
                        onChange={(e) => handleBidInput(idx, e.target.value)}
                        min={0}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₩</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <div className="w-5 h-5 flex items-center justify-center text-primary">
                    <i className="ri-information-line"></i>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    선택한 시간대에만 광고가 노출됩니다. 시간대별로 다른
                    입찰가를 설정할 수 있습니다. 자동 입찰을 설정하면 다음 입찰
                    시 자동으로 입력된 가격으로 입찰됩니다.
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-yellow-500">
                    <i className="ri-lightbulb-line"></i>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    피크 시간대(8-10시, 18-20시)는 경쟁이 치열합니다. 평균보다
                    10-15% 높은 입찰가를 권장합니다.
                  </span>
                </div>
              </div>
            </div>
            {/* 입찰 요약 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">입찰 요약</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        시간대
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        입찰가
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        평균 입찰가
                      </th>
                    </tr>
                  </thead>
                  <BidSummaryTable
                    selectedSlots={selectedSlots}
                    bidValues={bidValues}
                    TIME_SLOTS={TIME_SLOTS}
                    AVERAGE_BIDS={bidInfo.avgTimeBidMoney}
                    COMPETITION={bidInfo.COMPETITION}
                  />
                </table>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">총 선택 시간</span>
                  <span>{totalHours}시간</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">일일 예상 비용</span>
                  <span>₩{dailyCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">30일 총 예상 비용</span>
                  <span className="text-lg font-bold text-primary">
                    ₩{totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <label className="custom-checkbox flex items-center">
                    <input
                      type="checkbox"
                      checked={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span className="ml-2 text-sm text-gray-600">
                      입찰 규정 및 약관에 동의합니다
                    </span>
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-button font-medium transition-colors mr-3 whitespace-nowrap"
                    type="button"
                  >
                    임시 저장
                  </button>
                  <button
                    id="submitBidBtn"
                    className={`bg-indigo-600 hover:bg-primary/90 text-white py-2 px-4 rounded-button font-medium transition-colors whitespace-nowrap ${canSubmit ? '' : 'opacity-50 cursor-not-allowed'}`}
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    입찰 제출하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
