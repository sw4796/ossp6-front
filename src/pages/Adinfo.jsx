import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdInfoSummary from '../components/AdInfoSummary';
import AdInfoChartSection from '../components/AdInfoChartSection';
import AdInfoEffectSection from '../components/AdInfoEffectSection';
import HourSlotApplyChart from '../components/HourSlotApplyChart';
import StayTimeBoxPlotChart from '../components/StayTimeBoxPlotChart';
import 'remixicon/fonts/remixicon.css';
import { getAdSlotInfo } from '../api/adServing';
import { GazeRateChart } from '../components/AdInfoChartSection';

function Adinfo() {
  const { adslotid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [effectData, setEffectData] = useState(null);
  const [unit, setUnit] = useState('week'); // 기본 week로
  const [hourSlotApplyData, setHourSlotApplyData] = useState([]);
  const [stayTimeData, setStayTimeData] = useState([]);

  useEffect(() => {
    if (!adslotid) return;
    setLoading(true);
    getAdSlotInfo(adslotid, unit)
      .then((res) => {
        const data = res.data?.data;
        if (!data) throw new Error('데이터 없음');
        // 요약 정보
        setSummaryData({
          place: data.navigateResponseDto?.adName || '',
          price: data.navigateResponseDto?.avgBidMoney
            ? `₩ ${data.navigateResponseDto.avgBidMoney.toLocaleString()}`
            : '-',
          period: data.navigateResponseDto?.startAdTime?.slice(0, 10) || '',
          status: '-',
        });
        // 효과 정보 (예시)
        setEffectData([
          {
            label: '평균 응시율',
            value: `${Math.round((data.attentionRateResponseDto?.avgAttentionRate || 0) * 100)}%`,
            desc: '광고 평균 응시율',
            icon: 'ri-eye-line',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            label: '평균 노출 점수',
            value:
              data.exposureScoreResponseDto?.avgExposureScore?.toFixed(1) ||
              '-',
            desc: '평균 노출 점수',
            icon: 'ri-bar-chart-grouped-line',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
          },
        ]);
        // 시간대별 응시율
        if (data.attentionRateResponseDto?.attentionRations) {
          setHourSlotApplyData(
            data.attentionRateResponseDto.attentionRations.map((v, i) => ({
              시간대: `${String(i * 2).padStart(2, '0')}-${String(i * 2 + 2).padStart(2, '0')}`,
              응시율: Math.round(v * 1000) / 10,
            }))
          );
        }
        // 체류시간 박스플롯
        if (data.stayTimeResponseDto?.stayTimes) {
          setStayTimeData(
            data.stayTimeResponseDto.stayTimes.map((d) => ({
              time: d.time,
              minTime: d.minTime,
              q1Time: d.q1Time,
              midTime: d.midTime,
              q3Time: d.q3Time,
              maxTime: d.maxTime,
            }))
          );
        }
        // 차트 데이터 (통행량, 노출점수 등)
        setChartData({
          trafficDataByUnit: {
            [unit]: {
              x:
                data.viewCountResponseDto?.timeViewCount?.map(
                  (_, i) => `구간${i + 1}`
                ) || [],
              y: data.viewCountResponseDto?.timeViewCount || [],
            },
          },
          exposureData: data.exposureScoreResponseDto?.exposureScores || [],
          hours: [
            '00:00',
            '02:00',
            '04:00',
            '06:00',
            '08:00',
            '10:00',
            '12:00',
            '14:00',
            '16:00',
            '18:00',
            '20:00',
            '22:00',
          ],
          weeks: ['1주', '2주', '3주', '4주'],
          months: ['3월', '4월', '5월'],
        });
      })
      .catch(() => {
        setSummaryData(null);
        setEffectData(null);
        setHourSlotApplyData([]);
        setChartData(null);
      })
      .finally(() => setLoading(false));
  }, [adslotid, unit]);

  // 입찰 참여하기 버튼 클릭 시 해당 광고자리의 입찰 페이지로 이동
  const handleBidClick = () => {
    if (adslotid) {
      navigate(`/ad-bid?slotId=${encodeURIComponent(adslotid)}`);
    }
  };

  if (!summaryData) return <div>데이터 없음</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-row justify-center">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              광고 노출 상세 정보
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              광고 자리에 대한 상세 정보입니다.
            </p>
          </div>
          {summaryData && <AdInfoSummary data={summaryData} />}
          {effectData && <AdInfoEffectSection data={effectData} />}
          {chartData && (
            <AdInfoChartSection
              chartData={chartData}
              unit={unit}
              setUnit={setUnit}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">시간대별 응시율</h2>
              <HourSlotApplyChart data={hourSlotApplyData} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">응시율 데이터</h2>
              <GazeRateChart
                value={
                  effectData && effectData[0]
                    ? parseInt(effectData[0].value)
                    : 0
                }
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 my-8">
            <h2 className="text-lg font-semibold mb-2">시간대별 체류시간</h2>
            <StayTimeBoxPlotChart data={stayTimeData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Adinfo;
