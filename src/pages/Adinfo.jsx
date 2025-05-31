import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdInfoSummary from '../components/AdInfoSummary';
import AdInfoChartSection from '../components/AdInfoChartSection';
import AdInfoEffectSection from '../components/AdInfoEffectSection';
import HourSlotScoreChart from '../components/HourSlotScoreChart';
import HourSlotApplyChart from '../components/HourSlotApplyChart';
import 'remixicon/fonts/remixicon.css';
import adslotInfo from '../data/adslotInfo';

// 더미 데이터 (나중에 API로 대체)
const summary_mMckData = {
  place: '강남역 2번 출구 디지털 패널',
  price: '₩ 2,450,000',
  period: '2025.05.01',
  status: '진행중',
};

const effect_MockData = [
  {
    label: '예상 도달 인원',
    value: '248,560명',
    desc: '광고 기간 동안 예상되는 총 도달 인원',
    icon: 'ri-group-line',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: '인당 노출 비용',
    value: '₩ 9.86',
    desc: '1인당 평균 광고 노출 비용',
    icon: 'ri-money-dollar-circle-line',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    label: '효율성 점수',
    value: '92.4점',
    desc: '유사 광고 대비 효율성 점수',
    icon: 'ri-bar-chart-grouped-line',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

// 차트 데이터 (나중에 API로 대체)
const chartDummy = {
  trafficDataByUnit: {
    day: {
      x: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      y: [7200, 6800, 7500, 8100, 7900, 8300, 8742],
    },
    week: {
      x: ['5월 1주', '5월 2주', '5월 3주', '5월 4주'],
      y: [22000, 24500, 26000, 27800],
    },
    month: {
      x: ['2025-03', '2025-04', '2025-05'],
      y: [90000, 102000, 110000],
    },
  },
  hours: [
    '00:00',
    '02:00',
    '04:00',
    '06:00',
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
  ],
  days: ['월', '화', '수', '목', '금', '토', '일'],
  weeks: ['1주', '2주', '3주', '4주'],
  months: ['3월', '4월', '5월'],
  exposureDataByUnit: {
    day: (() => {
      const arr = [];
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 12; j++) {
          let weight = 1;
          if (j >= 4 && j <= 5) weight = 1.5;
          if (j >= 9 && j <= 10) weight = 1.8;
          if (i >= 5) weight = 0.8;
          arr.push([j, i, Math.floor(Math.random() * 50 * weight) + 50]);
        }
      }
      return arr;
    })(),
    week: (() => {
      const arr = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 12; j++) {
          let weight = 1;
          if (j >= 4 && j <= 5) weight = 1.5;
          if (j >= 9 && j <= 10) weight = 1.8;
          arr.push([j, i, Math.floor(Math.random() * 50 * weight) + 60]);
        }
      }
      return arr;
    })(),
    month: (() => {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 12; j++) {
          let weight = 1;
          if (j >= 4 && j <= 5) weight = 1.5;
          if (j >= 9 && j <= 10) weight = 1.8;
          arr.push([j, i, Math.floor(Math.random() * 50 * weight) + 70]);
        }
      }
      return arr;
    })(),
  },
};

// 시간대별 노출 점수/응시율 예시 데이터 추가
const hourSlotScoreData = [
  { 시간대: '00-02', 점수: 30 },
  { 시간대: '02-04', 점수: 25 },
  { 시간대: '04-06', 점수: 20 },
  { 시간대: '06-08', 점수: 40 },
  { 시간대: '08-10', 점수: 85 },
  { 시간대: '10-12', 점수: 70 },
  { 시간대: '12-14', 점수: 68 },
  { 시간대: '14-16', 점수: 65 },
  { 시간대: '16-18', 점수: 75 },
  { 시간대: '18-20', 점수: 90 },
  { 시간대: '20-22', 점수: 60 },
  { 시간대: '22-24', 점수: 40 },
];
const hourSlotApplyData = [
  { 시간대: '00-02', 응시율: 2.1 },
  { 시간대: '02-04', 응시율: 1.8 },
  { 시간대: '04-06', 응시율: 1.5 },
  { 시간대: '06-08', 응시율: 2.5 },
  { 시간대: '08-10', 응시율: 4.2 },
  { 시간대: '10-12', 응시율: 3.8 },
  { 시간대: '12-14', 응시율: 3.5 },
  { 시간대: '14-16', 응시율: 3.2 },
  { 시간대: '16-18', 응시율: 4.0 },
  { 시간대: '18-20', 응시율: 4.5 },
  { 시간대: '20-22', 응시율: 3.0 },
  { 시간대: '22-24', 응시율: 2.2 },
];

function Adinfo() {
  const { adslotid } = useParams();
  const navigate = useNavigate();

  // 광고자리 상세 데이터 가져오기
  const slotData = adslotInfo[adslotid];

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [effectData, setEffectData] = useState(null);
  const [unit, setUnit] = useState('day');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (slotData) {
        setSummaryData({
          place: slotData.place,
          price: slotData.price,
          period: slotData.period,
          status: slotData.status,
        });
        setChartData(chartDummy);
        setEffectData(effect_MockData);
      }
      setLoading(false);
    }, 300);
  }, [adslotid, slotData]);

  // 입찰 참여하기 버튼 클릭 시 해당 광고자리의 입찰 페이지로 이동
  const handleBidClick = () => {
    if (adslotid) {
      navigate(`/ad-bid?slotId=${encodeURIComponent(adslotid)}`);
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (!summaryData) return <div>데이터 없음</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-row justify-center">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              광고 노출 상세 정보
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              광고 자리에 대한 상세 정보입니다.
            </p>
          </div>
          {summaryData && <AdInfoSummary data={summaryData} />}
          {chartData && (
            <AdInfoChartSection
              chartData={chartData}
              unit={unit}
              setUnit={setUnit}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">시간대별 응시율</h2>
              <HourSlotApplyChart data={hourSlotApplyData} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">시간대별 노출 점수</h2>
              <HourSlotScoreChart data={hourSlotScoreData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Adinfo;
