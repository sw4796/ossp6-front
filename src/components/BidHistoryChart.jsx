import React from 'react';
import { ResponsiveLine } from '@nivo/line';

function BidHistoryChart({ data }) {
  const allY = data.flatMap((serie) => serie.data.map((d) => d.y));
  const minY = Math.min(...allY);
  const yMin = Math.max(0, minY - 5000);

  return (
    <div style={{ height: 320 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: yMin,
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: -40,
          legendPosition: 'middle',
          format: (v) => `${v.toLocaleString()}원`,
        }}
        colors={['#57b5e7', '#fbbf72']}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={true}
        areaOpacity={0.15}
        areaBaselineValue={yMin}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateY: 50, // 라벨을 더 아래로
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        tooltip={({ point }) => (
          <span
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '6px 8px',
              color: '#1f2937',
              fontSize: 13,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: 'auto',
              minWidth: 0,
              maxWidth: 'none',
              whiteSpace: 'nowrap',
              height: 'fit-content', // 세로 크기를 내용에 맞게
              lineHeight: 1.8, // 줄 간격을 조금 더 넓게
              boxSizing: 'border-box',
            }}
          >
            <b>{point.serieId}</b>
            <span>
              {point.data.xFormatted}: {point.data.yFormatted.toLocaleString()}
              원
            </span>
          </span>
        )}
      />
    </div>
  );
}

export default BidHistoryChart;
