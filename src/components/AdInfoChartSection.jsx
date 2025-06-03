import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// --- 차트별 컴포넌트 분리 ---
function TrafficChart({ data, unit, setUnit }) {
  const trafficRef = useRef(null);
  useEffect(() => {
    const trafficChart = echarts.init(trafficRef.current);
    const traffic = data || { x: [], y: [] };
    // x축 라벨 변환
    let xLabels = traffic.x;
    if (unit === 'week') {
      xLabels = traffic.x.map((_, i) => `${i + 1}일전`);
    } else if (unit === 'month') {
      xLabels = traffic.x.map((_, i) => `${i + 1}주전`);
    }
    trafficChart.setOption({
      animation: false,
      grid: { top: 10, right: 10, bottom: 30, left: 50 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
      },
      series: [
        {
          data: traffic.y,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3, color: 'rgba(87, 181, 231, 1)' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(87, 181, 231, 0.2)' },
              { offset: 1, color: 'rgba(87, 181, 231, 0.05)' },
            ]),
          },
        },
      ],
    });
    function handleResize() {
      trafficChart.resize();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      trafficChart.dispose();
    };
  }, [data, unit]);
  // 평균 통행량 계산
  const avgViewCount =
    data && data.y && data.y.length > 0 ? data.y.reduce((a, b) => a + b, 0) : 0;
  // 단위 버튼 렌더 함수
  const renderUnitButtons = (currentUnit, setUnitFunc) => (
    <div>
      <div className="flex gap-2 mb-2">
        {/* <button
        className={`px-3 py-1 rounded-full text-s font-medium ${
          currentUnit === 'day'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
        style={{ minWidth: 48 }}
        onClick={() => setUnitFunc('day')}
      >
        일별
      </button> */}
        <button
          className={`px-3 py-1 rounded-full text-s font-medium ${
            currentUnit === 'week'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          style={{ minWidth: 48 }}
          onClick={() => setUnitFunc('week')}
        >
          주별
        </button>
        <button
          className={`px-3 py-1 rounded-full text-s font-medium ${
            currentUnit === 'month'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          style={{ minWidth: 48 }}
          onClick={() => setUnitFunc('month')}
        >
          월별
        </button>
      </div>
      <div className="flex flex-col items-start mb-2 pl-2 pb-2">
        <span className="text-3xl font-extrabold text-gray-900">
          {avgViewCount.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 font-semibold mt-1">
          총 통행량
        </span>
      </div>
    </div>
  );
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">평균 통행량</h2>
        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
          <i className="ri-more-2-fill text-gray-500"></i>
        </div>
      </div>

      {renderUnitButtons(unit, setUnit)}

      <div ref={trafficRef} className="w-full h-64" />
    </div>
  );
}

function ExposureScoreChart({ data, hours, yAxis, title }) {
  const exposureRef = useRef(null);
  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    // data: [일자별][시간별] 구조 (예: [ [12개], [12개], ... ])
    // y축: 최근 n일(오늘-1, 오늘-2, ...), x축: 시간 구간(0~2, 2~4, ... 22~24)
    const days = data.length;
    const timeSlots = (data[0] || []).length;
    // y축 라벨: '1일전', '2일전', ...
    const yLabels = Array.from({ length: days }, (_, i) => `${i + 1}일전`);
    // x축 라벨: hours 배열을 '00:00~02:00', '02:00~04:00' ... 형식으로 변환
    const xLabels = hours.map((h, i) => {
      const start = h;
      let endHour = (parseInt(h.split(':')[0], 10) + 2) % 24;
      const end = endHour.toString().padStart(2, '0') + ':00';
      return `${start}~${end}`;
    });
    // 히트맵 데이터: [x, y, value] 형태로 변환
    const heatmapData = [];
    for (let day = 0; day < days; day++) {
      for (let t = 0; t < timeSlots; t++) {
        heatmapData.push([t, day, data[day][t]]);
      }
    }
    const exposureChart = echarts.init(exposureRef.current);
    // visualMap min/max를 데이터에서 동적으로 계산
    const allValues = data.flat().filter((v) => typeof v === 'number');
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    exposureChart.setOption({
      animation: false,
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return `${yLabels[params.value[1]]} ${xLabels[params.value[0]]}<br>노출 점수: ${params.value[2]}`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
      },
      grid: { top: 10, right: 10, bottom: 60, left: 50 },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: {
          color: '#6b7280',
          interval: 0,
          fontSize: 10,
          formatter: function (value) {
            // 0, 4, 8, 12, 16, 20시에만 라벨 표시
            const hour = parseInt(value.split('~')[0], 10);
            return hour % 4 === 0 ? value : '';
          },
        },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { color: '#6b7280' },
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: -10,
        inRange: {
          color: ['rgba(141, 211, 199, 0.3)', 'rgba(87, 181, 231, 1)'],
        },
        textStyle: { color: '#6b7280' },
      },
      series: [
        {
          name: '노출 점수',
          type: 'heatmap',
          data: heatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
    function handleResize() {
      exposureChart.resize();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      exposureChart.dispose();
    };
  }, [data, hours, yAxis]);
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-center"
      style={{ minHeight: 400 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {title || '노출 점수'}
        </h2>
        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
          <i className="ri-more-2-fill text-gray-500"></i>
        </div>
      </div>
      <div
        className="flex justify-center items-center w-full"
        style={{ height: 320 }}
      >
        <div
          ref={exposureRef}
          className="w-full"
          style={{ height: 320, maxWidth: 600 }}
        />
      </div>
    </div>
  );
}

function GazeRateChart({ value = 0 }) {
  const gazeRateRef = useRef(null);
  useEffect(() => {
    const gazeRateChart = echarts.init(gazeRateRef.current);
    gazeRateChart.setOption({
      animation: false,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
      },
      legend: {
        orient: 'vertical',
        right: 0,
        bottom: 0,
        itemGap: 8,
        padding: [0, 16, 16, 0],
        textStyle: { color: '#1f2937' },
      },
      series: [
        {
          name: '응시율 데이터',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' },
          },
          labelLine: { show: false },
          data: [
            {
              value: value,
              name: '응시함',
              itemStyle: { color: 'rgba(87, 181, 231, 1)' },
            },
            {
              value: 100 - value,
              name: '응시하지 않음',
              itemStyle: { color: 'rgba(141, 211, 199, 1)' },
            },
          ],
        },
      ],
    });
    function handleResize() {
      gazeRateChart.resize();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      gazeRateChart.dispose();
    };
  }, [value]);
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div ref={gazeRateRef} className="w-full h-56" />
    </div>
  );
}

function AdInfoChartSection({ chartData, unit, setUnit }) {
  const { trafficDataByUnit, exposureData, hours, weeks } = chartData;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <TrafficChart
        data={trafficDataByUnit[unit]}
        unit={unit}
        setUnit={setUnit}
      />
      <ExposureScoreChart
        data={exposureData}
        hours={hours}
        yAxis={weeks}
        title="노출 점수"
      />
    </div>
  );
}

export { GazeRateChart };
export default AdInfoChartSection;
