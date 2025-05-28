import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

function AdInfoChartSection({ chartData, unit, setUnit }) {
  const trafficRef = useRef(null);
  const exposureRef = useRef(null);
  const gazeRateRef = useRef(null);
  const dwellTimeRef = useRef(null);

  const { trafficDataByUnit, hours, days, weeks, months, exposureDataByUnit } =
    chartData;

  // 각각의 차트별 단위 상태
  const [trafficUnit, setTrafficUnit] = useState(unit);
  const [exposureUnit, setExposureUnit] = useState(unit);

  useEffect(() => {
    setTrafficUnit(unit);
    setExposureUnit(unit);
  }, [unit]);

  // 평균 통행량 차트
  useEffect(() => {
    const trafficChart = echarts.init(trafficRef.current);
    const traffic = trafficDataByUnit[trafficUnit];
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
        data: traffic.x,
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
  }, [trafficUnit, trafficDataByUnit]);

  // 노출 점수 차트
  useEffect(() => {
    const exposureChart = echarts.init(exposureRef.current);
    let yAxisData, exposureTooltipDays;
    if (exposureUnit === 'day') {
      yAxisData = days;
      exposureTooltipDays = days;
    } else if (exposureUnit === 'week') {
      yAxisData = weeks;
      exposureTooltipDays = weeks;
    } else {
      yAxisData = months;
      exposureTooltipDays = months;
    }
    exposureChart.setOption({
      animation: false,
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return `${exposureTooltipDays[params.value[1]]} ${hours[params.value[0]]}<br>노출 점수: ${params.value[2]}`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
      },
      grid: { top: 10, right: 10, bottom: 60, left: 50 },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: { show: true },
        axisLabel: { color: '#6b7280', interval: 1, fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        splitArea: { show: true },
        axisLabel: { color: '#6b7280' },
      },
      visualMap: {
        min: 50,
        max: 100,
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
          data: exposureDataByUnit[exposureUnit],
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
  }, [exposureUnit, exposureDataByUnit, hours, days, weeks, months]);

  // 응시율/체류시간 차트(기존과 동일)
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
              value: 42.8,
              name: '응시함',
              itemStyle: { color: 'rgba(87, 181, 231, 1)' },
            },
            {
              value: 57.2,
              name: '응시하지 않음',
              itemStyle: { color: 'rgba(141, 211, 199, 1)' },
            },
          ],
        },
      ],
    });
    const dwellTimeChart = echarts.init(dwellTimeRef.current);
    dwellTimeChart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
      },
      grid: { top: 10, right: 10, bottom: 30, left: 50 },
      xAxis: {
        type: 'category',
        data: ['0-1초', '1-2초', '2-3초', '3-4초', '4-5초', '5초 이상'],
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', fontSize: 10, interval: 0 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
      },
      series: [
        {
          name: '체류 시간',
          type: 'bar',
          data: [12, 18, 25, 20, 15, 10],
          itemStyle: {
            color: 'rgba(251, 191, 114, 1)',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    });
    function handleResize() {
      gazeRateChart.resize();
      dwellTimeChart.resize();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      gazeRateChart.dispose();
      dwellTimeChart.dispose();
    };
  }, []);

  // 단위 버튼 렌더 함수
  const renderUnitButtons = (currentUnit, setUnitFunc) => (
    <div className="flex gap-2 mb-2">
      <button
        className={`px-3 py-1 rounded-full text-s font-medium ${
          currentUnit === 'day'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
        style={{ minWidth: 48 }}
        onClick={() => setUnitFunc('day')}
      >
        일별
      </button>
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
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 실시간 통행량 그래프 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">평균 통행량</h2>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="ri-more-2-fill text-gray-500"></i>
            </div>
          </div>
          {/* 단위 버튼 */}
          {renderUnitButtons(trafficUnit, setTrafficUnit)}
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">8,742</div>
              <div className="text-sm text-gray-500">오늘 총 통행량</div>
            </div>
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <i className="ri-arrow-up-line mr-1"></i>
              <span className="text-sm font-medium">12.4%</span>
            </div>
          </div>
          <div ref={trafficRef} className="w-full h-64" />
        </div>
        {/* 시간대별 노출 점수 */}
        <div
          className="bg-white rounded-lg shadow-sm p-6"
          style={{ minHeight: 400 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">노출 점수</h2>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="ri-more-2-fill text-gray-500"></i>
            </div>
          </div>
          {/* 단위 버튼 */}
          {renderUnitButtons(exposureUnit, setExposureUnit)}
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">87.6</div>
              <div className="text-sm text-gray-500">평균 노출 점수</div>
            </div>
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <i className="ri-arrow-up-line mr-1"></i>
              <span className="text-sm font-medium">5.2%</span>
            </div>
          </div>
          <div ref={exposureRef} className="w-full" style={{ height: 320 }} />
        </div>
        {/* 응시율 데이터 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              응시율 데이터
            </h2>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="ri-more-2-fill text-gray-500"></i>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">42.8%</div>
              <div className="text-sm text-gray-500">평균 응시율</div>
            </div>
            <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <i className="ri-arrow-down-line mr-1"></i>
              <span className="text-sm font-medium">2.1%</span>
            </div>
          </div>
          <div ref={gazeRateRef} className="w-full h-64" />
        </div>
        {/* 체류 시간 분석 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              체류 시간 분석
            </h2>
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="ri-more-2-fill text-gray-500"></i>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">3.2초</div>
              <div className="text-sm text-gray-500">평균 체류 시간</div>
            </div>
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <i className="ri-arrow-up-line mr-1"></i>
              <span className="text-sm font-medium">0.5초</span>
            </div>
          </div>
          <div ref={dwellTimeRef} className="w-full h-64" />
        </div>
      </div>
    </>
  );
}

export default AdInfoChartSection;
