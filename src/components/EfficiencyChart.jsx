import React from 'react';
import ReactECharts from 'echarts-for-react';

function EfficiencyChart({ data }) {
  const xLabels = data[0]?.data.map((d) => d.x);

  const series = [
    {
      name: '노출 점수',
      type: 'line',
      smooth: true,
      data: data.find((d) => d.id === '노출 점수')?.data.map((d) => d.y) || [],
      lineStyle: {
        width: 3,
        color: 'rgba(87, 181, 231, 1)',
      },
      symbol: 'circle',
      itemStyle: {
        color: 'rgba(87, 181, 231, 1)',
        borderColor: '#fff',
        borderWidth: 2,
      },
    },
    {
      name: '가격 효율성',
      type: 'line',
      smooth: true,
      data:
        data.find((d) => d.id === '가격 효율성')?.data.map((d) => d.y) || [],
      lineStyle: {
        width: 3,
        color: 'rgba(251, 191, 114, 1)',
      },
      symbol: 'circle',
      itemStyle: {
        color: 'rgba(251, 191, 114, 1)',
        borderColor: '#fff',
        borderWidth: 2,
      },
    },
  ];

  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#1f2937', fontSize: 13 },
      formatter: (params) =>
        params
          .map((p) => `<b>${p.seriesName}</b><br/>${p.axisValue}: ${p.data}`)
          .join('<br/>'),
      extraCssText: 'box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:8px;',
    },
    legend: {
      data: ['노출 점수', '가격 효율성'],
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle',
      textStyle: {
        fontWeight: 500,
        fontSize: 14,
        fontFamily: 'Roboto, sans-serif',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '20%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    series,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 256, width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

export default EfficiencyChart;
