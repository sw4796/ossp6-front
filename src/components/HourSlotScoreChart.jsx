import React from 'react';
import ReactECharts from 'echarts-for-react';

function HourSlotScoreChart({ data }) {
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
      name: '노출 점수',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    series: [
      {
        data: data.map((d) => d.점수),
        type: 'bar',
        barWidth: '60%',
        itemStyle: { color: '#57b5e7', borderRadius: 4 },
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: 260, width: '100%' }} />
  );
}

export default HourSlotScoreChart;
