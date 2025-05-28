import React from 'react';
import { ResponsiveLine } from '@nivo/line';

function EfficiencyChart({ data }) {
  return (
    <div style={{ height: 256, marginBottom: 16 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
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
        }}
        colors={['#57b5e7', '#fbbf72']}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={false}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateY: 50,
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        tooltip={({ point }) => (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '6px 16px',
              color: '#1f2937',
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: 'auto',
              minWidth: 0,
              maxWidth: 220,
              whiteSpace: 'nowrap',
              height: 'auto', // 세로 크기 자동
              lineHeight: 1.6, // 줄 간격 조정
              boxSizing: 'border-box',
            }}
          >
            <b>{point.serieId}</b>
            <span>
              {point.data.xFormatted}: {point.data.yFormatted}
            </span>
          </div>
        )}
      />
    </div>
  );
}

export default EfficiencyChart;
