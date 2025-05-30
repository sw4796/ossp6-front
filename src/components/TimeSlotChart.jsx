import React, { useRef, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

function TimeSlotChart({ data }) {
  const chartRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (chartRef.current) {
        setIsNarrow(chartRef.current.offsetWidth < 480);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getShortLabel = (label) => {
    if (!isNarrow) return label;
    return label.split('-')[0];
  };

  const xLabels = data.map((d) => getShortLabel(d.시간대));
  const barData = data.map((d) => ({
    value: d.평균입찰가,
    itemStyle: { color: d.color },
  }));

  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937', fontSize: 13 },
      formatter: (params) =>
        params
          .map(
            (p) =>
              `<b>${p.axisValue}시</b><br/>${p.data.value.toLocaleString()}원`
          )
          .join('<br/>'),
      extraCssText: 'box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:8px;',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
      axisLabel: {
        formatter: '{value}원',
        fontSize: 13,
        fontFamily: 'Roboto, sans-serif',
      },
    },
    series: [
      {
        type: 'bar',
        data: barData,
        barWidth: '60%',
        itemStyle: { borderRadius: 4 },
      },
    ],
  };

  return (
    <div ref={chartRef} style={{ height: 320, width: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: 320, width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}

export default TimeSlotChart;
