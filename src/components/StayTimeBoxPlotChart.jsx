import React from 'react';
import ReactECharts from 'echarts-for-react';

function StayTimeBoxPlotChart({ data }) {
  // data: array of { time, minTime, q1Time, midTime, q3Time, maxTime }
  // 시간 오름차순(01:00~23:00, 00:00은 마지막)으로 정렬
  const sortedData = [...data].sort((a, b) => {
    const getHour = (t) => parseInt(t.split(':')[0], 10);
    const hourA = getHour(a.time);
    const hourB = getHour(b.time);
    // 00시는 24로 간주해서 마지막에 오도록
    const sortA = hourA === 0 ? 24 : hourA;
    const sortB = hourB === 0 ? 24 : hourB;
    return sortA - sortB;
  });
  const xData = sortedData.map((d) => d.time);
  const boxData = sortedData.map((d) => [
    d.minTime,
    d.q1Time,
    d.midTime,
    d.q3Time,
    d.maxTime,
  ]);
  const option = {
    animation: false,
    tooltip: {
      trigger: 'item',
      formatter: function (param) {
        const d = sortedData[param.dataIndex];
        return `시간: ${d.time}<br/>최소: ${d.minTime}<br/>Q1: ${d.q1Time}<br/>중앙값: ${d.midTime}<br/>Q3: ${d.q3Time}<br/>최대: ${d.maxTime}`;
      },
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: true,
      name: '시간',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    yAxis: {
      type: 'value',
      name: '체류시간(분)',
      axisLabel: { fontSize: 13, fontFamily: 'Roboto, sans-serif' },
    },
    series: [
      {
        name: '체류시간',
        type: 'boxplot',
        data: boxData,
        itemStyle: { color: '#a5d6a7', borderColor: '#388e3c' },
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: 260, width: '100%' }} />
  );
}

export default StayTimeBoxPlotChart;
