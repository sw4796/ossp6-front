import React from 'react';
import ReactECharts from 'echarts-for-react';

function HourSlotApplyChart({ data }) {
  // 예시: data = [{ 시간대: '00-02', 응시율: 10 }, ...]
  // x축 라벨과 y축 데이터 모두 원래 순서대로 사용
  const xLabels = data.map((d) => d.시간대);
  const yValues = data.map((d) => d.응시율);

  const option = {
    animation: false,
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    yAxis: {
      type: 'value',
      name: '응시율(%)',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    series: [
      {
        data: yValues,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        lineStyle: { width: 3, color: '#fbbe72' },
        itemStyle: { color: '#fbbe72', borderColor: '#fff', borderWidth: 2 },
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: 260, width: '100%' }} />
  );
}

export default HourSlotApplyChart;
