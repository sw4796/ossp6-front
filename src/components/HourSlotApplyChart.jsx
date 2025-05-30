import React from 'react';
import ReactECharts from 'echarts-for-react';

function HourSlotApplyChart({ data }) {
  const option = {
    animation: false,
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.시간대),
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    yAxis: {
      type: 'value',
      name: '응시율(%)',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    series: [
      {
        data: data.map((d) => d.응시율),
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
