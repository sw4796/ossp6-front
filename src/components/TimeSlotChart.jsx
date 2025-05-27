import React, { useRef, useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';

function TimeSlotChart({ data }) {
  // 차트 컨테이너의 실제 가로 길이 기준으로 라벨 축약
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

  return (
    <div ref={chartRef} style={{ height: 320, width: '100%' }}>
      <ResponsiveBar
        data={data}
        keys={['평균입찰가']}
        indexBy="시간대"
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        colors={({ data }) => data.color}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: getShortLabel,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (v) => `${v.toLocaleString()}원`,
        }}
        enableLabel={false}
        tooltip={({ indexValue, value }) => (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '6px 24px',
              color: '#1f2937',
              fontSize: 13,
              minWidth: 120,
              maxWidth: 220,
            }}
          >
            <b>{indexValue}시</b>
            <br />
            {value.toLocaleString()}원
          </div>
        )}
        borderRadius={4}
      />
    </div>
  );
}

export default TimeSlotChart;
