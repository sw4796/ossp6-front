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
        if (!data) {
          // If data itself is null or undefined, treat as an error or no data scenario
          setSummaryData(null);
          setEffectData(null);
          setHourSlotApplyData([]);
          setChartData(null);
          setStayTimeData([]);
          throw new Error('데이터 없음'); // Ensure catch block is triggered for consistent handling
        }
        // 요약 정보
        setSummaryData({
          place: data.navigateResponseDto?.adName || '',
          price: data.navigateResponseDto?.avgBidMoney
            ? `₩ ${data.navigateResponseDto.avgBidMoney.toLocaleString()}`
            : '-',
          period: data.navigateResponseDto?.startAdTime?.slice(0, 10) || '',
          status: '-', // API 응답에 따라 실제 상태 값으로 변경 필요
        });
        // 효과 정보
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
        } else {
          setHourSlotApplyData([]);
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
        } else {
          setStayTimeData([]);
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
          months: ['3월', '4월', '5월'], // 이 부분은 API 응답에 따라 동적으로 설정하는 것이 좋을 수 있습니다.
        });
      })
      .catch(() => {
        setSummaryData(null);
        setEffectData(null);
        setHourSlotApplyData([]);
        setChartData(null);
        setStayTimeData([]); // Ensure stayTimeData is also reset
      })
      .finally(() => setLoading(false));
  }, [adslotid, unit]);

  // 입찰 참여하기 버튼 클릭 시 해당 광고자리의 입찰 페이지로 이동
  const handleBidClick = () => {
    if (adslotid) {
      navigate(`/ad-bid/${encodeURIComponent(adslotid)}`);
    }
  };

  // Removed early return: if (!summaryData) return <div>데이터 없음</div>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        {/* <Header />  네비게이션 바 제거 */}
        <p className="text-xl text-gray-700 mt-10">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

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

          {/* 입찰 참여하기 버튼 항상 노출 */}
          <div className="flex justify-end mb-4">
            <button
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-2 rounded-[8px] font-semibold text-base transition-colors"
              style={{ minWidth: 180 }}
              onClick={handleBidClick}
            >
              입찰 참여하기
            </button>
          </div>

          {summaryData ? (
            <AdInfoSummary data={summaryData} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 mb-8">
              요약 정보가 존재하지 않습니다.
            </div>
          )}

          {effectData && effectData.length > 0 ? (
            <AdInfoEffectSection data={effectData} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 mb-8">
              효과 정보가 존재하지 않습니다.
            </div>
          )}

          {chartData &&
          (chartData.trafficDataByUnit[unit]?.x?.length > 0 ||
            chartData.exposureData?.length > 0) ? (
            <AdInfoChartSection
              chartData={chartData}
              unit={unit}
              setUnit={setUnit}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 mb-8">
              차트 데이터가 존재하지 않습니다.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">시간대별 응시율</h2>
              {hourSlotApplyData && hourSlotApplyData.length > 0 ? (
                <HourSlotApplyChart data={hourSlotApplyData} />
              ) : (
                <p className="text-center text-gray-500 py-10">
                  데이터가 존재하지 않습니다.
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">응시율 데이터</h2>
              {effectData &&
              effectData.length > 0 &&
              effectData[0]?.value !== undefined &&
              !isNaN(parseInt(effectData[0].value)) ? (
                <GazeRateChart value={parseInt(effectData[0].value) || 0} />
              ) : (
                <p className="text-center text-gray-500 py-10">
                  데이터가 존재하지 않습니다.
                </p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 my-8">
            <h2 className="text-lg font-semibold mb-2">시간대별 체류시간</h2>
            {stayTimeData && stayTimeData.length > 0 ? (
              <StayTimeBoxPlotChart data={stayTimeData} />
            ) : (
              <p className="text-center text-gray-500 py-10">
                데이터가 존재하지 않습니다.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Adinfo;
