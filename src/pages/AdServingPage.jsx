import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import InfoBox from '../components/InfoBox';
import AdServingTableHeader from '../components/AdServingTableHeader';
import AdServingTableRow from '../components/AdServingTableRow';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyAdDetail } from '../api/adServing';
import ads from '../data/ads';
import adslots from '../data/adslots';
import dropdown_icon from '../assets/icon-dropdown.png';
import left_arrow from '../assets/left-arrow.png';
import right_arrow from '../assets/right-arrow.png';

function AdServingPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const adId = query.get('adId');
  const navigate = useNavigate();

  const [myAdDetail, setMyAdDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adId) return;
    setLoading(true);
    getMyAdDetail(adId)
      .then((res) => {
        if (res.data && res.data.success) {
          setMyAdDetail(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [adId]);

  // 광고 정보
  const adInfo = ads.find((ad) => ad.id === adId);

  // 광고에 연결된 입찰/낙찰 데이터만 필터링 (data 폴더에서)
  // const filteredData = adId ? myads.filter((row) => row.adId === adId) : myads;
  // 실제 API 데이터 사용
  const filteredData =
    myAdDetail && myAdDetail.slotList
      ? myAdDetail.slotList.map((slot) => ({
          ...slot,
          // 기존 row 구조와 맞추기 위한 변환
          name: slot.adSlotName,
          price: slot.bidMoney,
          status:
            slot.bidStatus === 0 ? '입찰' : slot.bidStatus === 1 ? '낙찰' : '-',
          // exposeTime, Startdate, Enddate 등은 필요시 추가
        }))
      : [];

  // 지출대비 노출점수(임의: 평균 노출점수 / 평균 입찰가)
  const avgScore =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, row) => sum + (row.score || 0), 0) /
          filteredData.length
        ).toLocaleString(undefined, { maximumFractionDigits: 0 })
      : '-';
  const avgPrice =
    filteredData.length > 0
      ? filteredData.reduce((sum, row) => sum + (row.price || 0), 0) /
        filteredData.length
      : 0;
  const scorePerCost =
    avgPrice > 0 && avgScore !== '-'
      ? (Number(avgScore) / avgPrice).toFixed(4)
      : '-';

  // 총 지불가격
  const totalPaid =
    filteredData.length > 0
      ? filteredData
          .reduce((sum, row) => sum + (row.price || 0), 0)
          .toLocaleString() + '원'
      : '-';

  // 평균 노출 시간 (exposeTime이 없으면 2시간씩 가정)
  const avgExposeHours =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, row) => {
            if (row.exposeTime) {
              const match = row.exposeTime.match(
                /(\d{2}):(\d{2})~(\d{2}):(\d{2})/
              );
              if (match) {
                const start = parseInt(match[1], 10);
                const end = parseInt(match[3], 10);
                let diff = end - start;
                if (diff < 0) diff += 24;
                return sum + diff;
              }
            }
            return sum + 2;
          }, 0) / filteredData.length
        ).toLocaleString(undefined, { maximumFractionDigits: 1 }) + '시간'
      : '-';

  const infoBoxData = [
    {
      title: '총 노출수',
      maincontent:
        myAdDetail && myAdDetail.totalViewCount !== undefined
          ? myAdDetail.totalViewCount.toLocaleString()
          : '-',
      subcontent: '',
    },
    {
      title: '평균 노출 점수',
      maincontent:
        myAdDetail && myAdDetail.avgExposureScore !== undefined
          ? myAdDetail.avgExposureScore
          : '-',
      subcontent: '',
    },
    {
      title: '총 지출 비용',
      maincontent:
        myAdDetail && myAdDetail.totalBidMoney !== undefined
          ? myAdDetail.totalBidMoney.toLocaleString() + '원'
          : '-',
      subcontent: '',
    },
    {
      title: '평균 노출 시간',
      maincontent:
        myAdDetail &&
        myAdDetail.overallMidTimeAvg !== undefined &&
        myAdDetail.overallMidTimeAvg !== null
          ? myAdDetail.overallMidTimeAvg + '시간'
          : '-',
      subcontent: '',
    },
  ];

  // 드롭다운 필터 적용
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // place 필터 적용
  const tableData = selectedPlace
    ? filteredData.filter((row) => {
        const slot = adslots.find((s) => s.id === row.slotId);
        return (slot ? slot.name : row.name) === selectedPlace;
      })
    : filteredData;

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(0);

  // 페이지네이션 데이터
  const totalPages = Math.max(1, Math.ceil(tableData.length / ITEMS_PER_PAGE));
  const pagedData = tableData.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };
  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // 광고 자리 클릭 시 adinfo로 이동
  const handleSlotClick = (slotId) => {
    navigate(`/adinfo/${slotId}`);
  };

  // 테이블 컬럼 정의
  const columns = ['광고자리명', '상태', '입찰가', '노출일시'];

  // placeList: 광고자리명 목록 (API 데이터 기반)
  const placeList =
    myAdDetail && myAdDetail.slotList
      ? Array.from(new Set(myAdDetail.slotList.map((slot) => slot.adSlotName)))
      : [];

  return (
    <>
      <Header />
      <div className="relative w-full min-h-screen flex flex-col items-center bg-gray-50">
        <div className="w-full max-w-[1200px] px-2 sm:px-4 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-gray-900">
                광고 자리 관리
              </h1>
              <p className="text-base text-gray-500">
                효과적인 광고 위치 관리와 성과를 한눈에 확인하세요
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {infoBoxData.map((item, idx) => (
                <div key={idx} className="flex-1 min-w-[180px]">
                  <InfoBox
                    title={item.title}
                    maincontent={item.maincontent}
                    subcontent={item.subcontent}
                  />
                </div>
              ))}
            </div>
          </div>
          <main className="flex flex-col gap-6 w-full">
            <h2 className="font-bold text-xl text-black">
              {adInfo ? `${adInfo.name}의 입찰/낙찰 내역` : '입찰 광고 보기'}
            </h2>
            <div className="w-full bg-white rounded-xl shadow p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2" ref={dropdownRef}>
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-3 py-1 min-w-[120px] w-auto h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition font-normal text-sm text-black"
                      style={{
                        boxSizing: 'border-box',
                        opacity: 1,
                      }}
                      onClick={() => setDropdownOpen((v) => !v)}
                    >
                      <span className="flex-1 text-sm text-center text-black whitespace-nowrap">
                        {selectedPlace ? selectedPlace : '광고 자리 필터'}
                      </span>
                      <img
                        src={dropdown_icon}
                        alt="▼"
                        style={{ width: 18, height: 18, marginLeft: 4 }}
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 z-10 mt-1 w-full min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div
                          className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSelectedPlace('');
                            setDropdownOpen(false);
                          }}
                        >
                          전체
                        </div>
                        {placeList.map((place) => (
                          <div
                            key={place}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                              selectedPlace === place
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedPlace(place);
                              setDropdownOpen(false);
                            }}
                          >
                            {place}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <AdServingTableHeader columns={columns} />
                  <div>
                    {pagedData.length === 0 ? (
                      <div
                        style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: '#888',
                        }}
                      >
                        입찰 정보가 없습니다.
                      </div>
                    ) : (
                      pagedData.map((row, idx) => (
                        <AdServingTableRow
                          key={idx}
                          row={{
                            광고자리명: (
                              <span
                                style={{
                                  color: 'black',
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                  transition: 'color 0.15s',
                                }}
                                onClick={() =>
                                  navigate(
                                    `/adinfo/${row.slotId || row.slot_id || ''}`
                                  )
                                }
                                onMouseOver={(e) => {
                                  e.currentTarget.style.color = '#2563eb';
                                  e.currentTarget.style.textDecoration =
                                    'underline';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.color = 'black';
                                  e.currentTarget.style.textDecoration = 'none';
                                }}
                              >
                                {adslots.find((s) => s.id === row.slotId)
                                  ?.name || row.name}
                              </span>
                            ),
                            상태: row.status,
                            입찰가: row.price
                              ? `₩${row.price.toLocaleString()}`
                              : '-',
                            노출일시:
                              row.exposeTime ||
                              row.Startdate + ' ~ ' + row.Enddate,
                            status: row.status,
                          }}
                          columns={columns}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center h-16">
                <div className="flex items-center gap-2 mr-8">
                  <span className="text-gray-700 text-sm">
                    {page + 1}/{totalPages} 페이지
                  </span>
                  <div className="flex gap-1">
                    <button
                      className="w-[30px] h-[30px] p-2 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-300"
                      onClick={handlePrevPage}
                      disabled={page === 0}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={left_arrow}
                          alt="img"
                          className="w-full h-auto"
                        />
                      </div>
                    </button>
                    <button
                      className="w-[30px] h-[30px] p-2 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-300"
                      onClick={handleNextPage}
                      disabled={page >= totalPages - 1}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={right_arrow}
                          alt="img"
                          className="w-full h-auto"
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdServingPage;
