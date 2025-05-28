import React, { useState } from 'react';
import BidHistoryChart from '../components/BidHistoryChart';
import TimeSlotChart from '../components/TimeSlotChart';
import EfficiencyChart from '../components/EfficiencyChart';
import BidSummaryTable from '../components/BidSummaryTable';
import 'remixicon/fonts/remixicon.css';

const TIME_SLOTS = [
  '00:00 - 02:00',
  '02:00 - 04:00',
  '04:00 - 06:00',
  '06:00 - 08:00',
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
  '22:00 - 24:00',
];
const AVERAGE_BIDS = [
  45000, 40000, 38000, 55000, 85000, 70000, 68000, 65000, 75000, 88000, 65000,
  50000,
];
const COMPETITION = [
  '낮음',
  '매우 낮음',
  '매우 낮음',
  '보통',
  '매우 높음',
  '높음',
  '높음',
  '보통',
  '높음',
  '매우 높음',
  '보통',
  '낮음',
];

const BID_HISTORY_DATA = [
  {
    id: '평균 입찰가',
    color: 'hsl(200, 80%, 60%)',
    data: [
      { x: '4월 1주', y: 52000 },
      { x: '4월 2주', y: 54000 },
      { x: '4월 3주', y: 56000 },
      { x: '4월 4주', y: 58000 },
      { x: '5월 1주', y: 60000 },
      { x: '5월 2주', y: 63000 },
      { x: '5월 3주', y: 65000 },
      { x: '5월 4주', y: 68000 },
    ],
  },
  {
    id: '최고 입찰가',
    color: 'hsl(40, 90%, 60%)',
    data: [
      { x: '4월 1주', y: 58000 },
      { x: '4월 2주', y: 62000 },
      { x: '4월 3주', y: 65000 },
      { x: '4월 4주', y: 67000 },
      { x: '5월 1주', y: 70000 },
      { x: '5월 2주', y: 72000 },
      { x: '5월 3주', y: 75000 },
      { x: '5월 4주', y: 78000 },
    ],
  },
];

const TIMESLOT_CHART_DATA = [
  { 시간대: '00-02', 평균입찰가: 45000, color: 'rgba(141,211,199,1)' },
  { 시간대: '02-04', 평균입찰가: 40000, color: 'rgba(141,211,199,1)' },
  { 시간대: '04-06', 평균입찰가: 38000, color: 'rgba(141,211,199,1)' },
  { 시간대: '06-08', 평균입찰가: 55000, color: 'rgba(141,211,199,1)' },
  { 시간대: '08-10', 평균입찰가: 85000, color: 'rgba(252,141,98,1)' },
  { 시간대: '10-12', 평균입찰가: 70000, color: 'rgba(141,211,199,1)' },
  { 시간대: '12-14', 평균입찰가: 68000, color: 'rgba(141,211,199,1)' },
  { 시간대: '14-16', 평균입찰가: 65000, color: 'rgba(141,211,199,1)' },
  { 시간대: '16-18', 평균입찰가: 75000, color: 'rgba(141,211,199,1)' },
  { 시간대: '18-20', 평균입찰가: 88000, color: 'rgba(252,141,98,1)' },
  { 시간대: '20-22', 평균입찰가: 65000, color: 'rgba(141,211,199,1)' },
  { 시간대: '22-24', 평균입찰가: 50000, color: 'rgba(141,211,199,1)' },
];

const EFFICIENCY_CHART_DATA = [
  {
    id: '노출 점수',
    color: 'hsl(200, 80%, 60%)',
    data: [
      { x: '00-04', y: 30 },
      { x: '04-08', y: 25 },
      { x: '08-12', y: 85 },
      { x: '12-16', y: 70 },
      { x: '16-20', y: 90 },
      { x: '20-24', y: 40 },
    ],
  },
  {
    id: '가격 효율성',
    color: 'hsl(40, 90%, 60%)',
    data: [
      { x: '00-04', y: 80 },
      { x: '04-08', y: 90 },
      { x: '08-12', y: 60 },
      { x: '12-16', y: 70 },
      { x: '16-20', y: 55 },
      { x: '20-24', y: 75 },
    ],
  },
];

export default function AdBidPage() {
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
        : { ...prevBid, [idx]: AVERAGE_BIDS[idx] }
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

  return (
    <div className="font-['Noto Sans KR'] bg-gray-50 min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b w-full flex justify-center">
        <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-['Pacifico'] text-primary">
              logo
            </span>
            <span className="ml-2 text-lg font-semibold">광고 입찰 시스템</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                <i className="ri-notification-3-line text-gray-600"></i>
              </div>
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="ri-user-line text-gray-600"></i>
              </div>
              <span className="ml-2 font-medium">김민준</span>
            </div>
          </div>
        </div>
      </header>
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
                입찰 진행중
              </div>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start gap-6 lg:gap-8">
                <div className="w-full lg:w-7/12">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    강남역 2번 출구 디지털 광고판
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span className="ml-1">서울특별시 강남구 강남대로 396</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        광고판 크기
                      </div>
                      <div className="font-medium">6m x 4m (가로 x 세로)</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        일 평균 노출량
                      </div>
                      <div className="font-medium">약 25,000명</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        광고 형식
                      </div>
                      <div className="font-medium">디지털 이미지/비디오</div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">
                      광고 위치 정보
                    </h2>
                    <p className="text-gray-600 mb-4">
                      강남역 2번 출구 앞에 위치한 프리미엄 디지털 광고판으로,
                      유동인구가 매우 많은 지역입니다. 지하철 이용객 및
                      강남대로를 지나는 차량에서 모두 시야 확보가 가능합니다.
                      특히 20-40대 직장인 및 쇼핑객들의 통행이 많은 위치입니다.
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 mt-6 lg:mt-0">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">입찰 정보</h3>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">입찰 마감까지</span>
                        <span className="font-medium text-red-600">
                          12시간 23분
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: '35%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between">
                        <span className="text-gray-600">광고 게재 기간</span>
                        <span className="font-medium">
                          2025.06.01 - 2025.06.30
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">최소 입찰가</span>
                        <span className="font-medium">시간당 50,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">현재 최고 입찰가</span>
                        <span className="font-medium text-primary">
                          시간당 78,000원
                        </span>
                      </div>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-button font-medium transition-colors whitespace-nowrap">
                      입찰 참여하기
                    </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div className="col-span-2">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">입찰 설정</h2>
                </div>
                {/* 시간대별 입찰 입력 */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  id="timeSlots"
                >
                  {TIME_SLOTS.map((label, idx) => (
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
                      입찰가를 설정할 수 있습니다. 자동 입찰을 설정하면 다음
                      입찰 시 자동으로 입력된 가격으로 입찰됩니다.
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
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          경쟁률
                        </th>
                      </tr>
                    </thead>
                    <BidSummaryTable
                      selectedSlots={selectedSlots}
                      bidValues={bidValues}
                      TIME_SLOTS={TIME_SLOTS}
                      AVERAGE_BIDS={AVERAGE_BIDS}
                      COMPETITION={COMPETITION}
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
            {/* 광고 효율성 지표 */}
            <div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">광고 효율성 지표</h2>
                <EfficiencyChart data={EFFICIENCY_CHART_DATA} />
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        노출 대비 클릭률 (CTR)
                      </span>
                      <span className="font-medium">3.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: '64%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        비용 대비 전환율
                      </span>
                      <span className="font-medium">2.1%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: '42%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        투자수익률 (ROI)
                      </span>
                      <span className="font-medium">145%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: '72%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ...추가 영역 필요시 여기에... */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
