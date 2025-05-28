import React, { useState } from "react";
import AdInfoHeader from "../components/AdInfoHeader";
import AdInfoSummary from "../components/AdInfoSummary";
import AdInfoChartSection from "../components/AdInfoChartSection";
import AdInfoEffectSection from "../components/AdInfoEffectSection";
import "remixicon/fonts/remixicon.css";

// 더미 데이터 (나중에 API로 대체)
const summaryData = {
  place: "강남역 2번 출구 디지털 패널",
  price: "₩ 2,450,000",
  period: "2025.05.01 ~ 2025.05.31",
  status: "진행중",
};

const effectData = [
  {
    label: "예상 도달 인원",
    value: "248,560명",
    desc: "광고 기간 동안 예상되는 총 도달 인원",
    icon: "ri-group-line",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "인당 노출 비용",
    value: "₩ 9.86",
    desc: "1인당 평균 광고 노출 비용",
    icon: "ri-money-dollar-circle-line",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "효율성 점수",
    value: "92.4점",
    desc: "유사 광고 대비 효율성 점수",
    icon: "ri-bar-chart-grouped-line",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

// 차트 데이터 (나중에 API로 대체)
const chartDummy = {
  trafficDataByUnit: {
    day: {
      x: ["05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25"],
      y: [7200, 6800, 7500, 8100, 7900, 8300, 8742],
    },
    week: {
      x: ["5월 1주", "5월 2주", "5월 3주", "5월 4주"],
      y: [22000, 24500, 26000, 27800],
    },
    month: {
      x: ["2025-03", "2025-04", "2025-05"],
      y: [90000, 102000, 110000],
    },
  },
  hours: [
    "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
    "12:00", "14:00", "16:00", "18:00", "20:00", "22:00",
  ],
  days: ["월", "화", "수", "목", "금", "토", "일"],
  weeks: ["1주", "2주", "3주", "4주"],
  months: ["3월", "4월", "5월"],
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

function Adinfo() {
  const [unit, setUnit] = useState("day");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdInfoHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-row justify-center">
        <div className="w-full">
            <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">광고 노출 상세 정보</h1>
          <p className="mt-2 text-sm text-gray-600">
            입찰한 광고 자리의 노출 정보와 성과를 확인하세요.
          </p>
        </div>
        <AdInfoSummary data={summaryData} />
        <AdInfoChartSection
          chartData={chartDummy}
          unit={unit}
          setUnit={setUnit}
        />
        <AdInfoEffectSection data={effectData} />
        </div>
      </main>
    </div>
  );
}

export default Adinfo;
