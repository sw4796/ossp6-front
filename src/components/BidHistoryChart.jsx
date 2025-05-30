import React from 'react';
import ReactECharts from 'echarts-for-react';

function BidHistoryChart({ data }) {
  // x축 라벨
  const xLabels = data[0]?.data.map((d) => d.x);

  // 각 시리즈 데이터 변환
  const series = [
    {
      name: '평균 입찰가',
      type: 'line',
      smooth: true,
      data:
        data.find((d) => d.id === '평균 입찰가')?.data.map((d) => d.y) || [],
      lineStyle: {
        width: 3,
        color: 'rgba(87, 181, 231, 1)',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(87, 181, 231, 0.2)' },
            { offset: 1, color: 'rgba(87, 181, 231, 0.05)' },
          ],
        },
      },
      symbol: 'circle',
      itemStyle: {
        color: 'rgba(87, 181, 231, 1)',
        borderColor: '#fff',
        borderWidth: 2,
      },
    },
    {
      name: '최고 입찰가',
      type: 'line',
      smooth: true,
      data:
        data.find((d) => d.id === '최고 입찰가')?.data.map((d) => d.y) || [],
      lineStyle: {
        width: 3,
        color: 'rgba(251, 191, 114, 1)',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(251, 191, 114, 0.2)' },
            { offset: 1, color: 'rgba(251, 191, 114, 0.05)' },
          ],
        },
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
          .map(
            (p) =>
              `<b>${p.seriesName}</b><br/>${p.axisValue}: ${p.data.toLocaleString()}원`
          )
          .join('<br/>'),
      extraCssText: 'box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:8px;',
    },
    legend: {
      data: ['평균 입찰가', '최고 입찰가'],
      bottom: 10,
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
      bottom: '15%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xLabels,
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}원',
        fontSize: 13,
        fontFamily: 'Roboto, sans-serif',
      },
      min: (value) => Math.max(0, value.min - 5000),
    },
    series,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 320, width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

export default BidHistoryChart;
