import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import InfoBox from '../components/InfoBox';
import AdServingTableRow from '../components/AdServingTableRow';
import { useParams } from 'react-router-dom';
import { getSlotServingDetail } from '../api/adServing';
import ads from '../data/ads';
import adslots from '../data/adslots';
import dropdown_icon from '../assets/icon-dropdown.png';
import left_arrow from '../assets/left-arrow.png';
import right_arrow from '../assets/right-arrow.png';

function SlotServingPage() {
  const { slotId } = useParams();

  const [slotDetail, setSlotDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slotId) return;
    setLoading(true);
    getSlotServingDetail(slotId)
      .then((res) => {
        if (res.data && res.data.success) {
          setSlotDetail(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [slotId]);

  // 광고자리 정보
  const slotInfo = adslots.find((slot) => slot.id === slotId);

  // 실제 API 데이터 사용
  const filteredData =
    slotDetail && slotDetail.histories
      ? slotDetail.histories.map((row) => ({
          ...row,
          name: row.adName,
          price: row.bid,
          status:
            row.bidStatus === 0 ? '입찰' : row.bidStatus === 1 ? '낙찰' : '-',
          exposeTime:
            row.bidStartTime && row.bidEndTime
              ? `${row.bidStartTime.replace('T', ' ').slice(0, 16)} ~ ${row.bidEndTime.replace('T', ' ').slice(0, 16)}`
              : '',
        }))
      : [];

  // 광고명 목록 추출 (중복 제거)
  const adNameList = Array.from(
    new Set(
      filteredData.map(
        (row) =>
          row.adName || ads.find((a) => a.id === row.adId)?.name || row.name
      )
    )
  );

  // 드롭다운 필터 적용
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState('');
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

  // 광고명 필터 적용
  const tableData = selectedAd
    ? filteredData.filter((row) => {
        const ad = ads.find((a) => a.id === row.adId);
        return (ad ? ad.name : row.name) === selectedAd;
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

  // 테이블 컬럼 정의
  const columns = ['광고명', '상태', '낙찰가격', '노출일시'];

  const infoBoxData = [
    {
      title: '총 매출',
      maincontent:
        slotDetail && slotDetail.totalRevenue !== undefined
          ? slotDetail.totalRevenue.toLocaleString() + '원'
          : '-',
      subcontent: '',
    },
    {
      title: '평균 입찰 횟수',
      maincontent:
        slotDetail && slotDetail.avgBidCount !== undefined
          ? slotDetail.avgBidCount
          : '-',
      subcontent: '',
    },
    {
      title: '총 노출 시간',
      maincontent:
        slotDetail && slotDetail.totalExposureHour !== undefined
          ? slotDetail.totalExposureHour + '시간'
          : '-',
      subcontent: '',
    },
    {
      title: '노출 점수',
      maincontent:
        slotDetail && slotDetail.exposureScore !== undefined
          ? slotDetail.exposureScore
          : '-',
      subcontent: '',
    },
  ];

  return (
    <>
      <Header />
      <div className="relative w-full min-h-screen flex flex-col items-center bg-gray-50">
        <div className="w-full max-w-[1200px] px-2 sm:px-4 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-gray-900">
                {slotInfo ? `${slotInfo.name} 입찰 내역` : '광고자리 입찰 내역'}
              </h1>
              <p className="text-base text-gray-500">
                광고자리에 대한 입찰/낙찰 내역을 확인하세요.
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
              {slotInfo
                ? `${slotInfo.name}의 입찰/낙찰 내역`
                : '입찰 광고 보기'}
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
                        {selectedAd ? selectedAd : '광고명 필터'}
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
                            setSelectedAd('');
                            setDropdownOpen(false);
                          }}
                        >
                          전체
                        </div>
                        {adNameList.map((adName) => (
                          <div
                            key={adName}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                              selectedAd === adName
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedAd(adName);
                              setDropdownOpen(false);
                            }}
                          >
                            {adName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* 광고명, 상태, 낙찰가격, 노출일시로 헤더 직접 구현 */}
                  <div className="thead bg-white font-['Roboto']">
                    <div className="tr flex items-center min-h-[48px] border-b border-gray-200">
                      {columns.map((col, idx) => (
                        <div
                          key={col}
                          className={`th px-6 py-3 text-gray-500 font-semibold text-sm ${
                            idx === 1
                              ? 'w-56 px-8'
                              : idx === 2
                                ? 'w-56'
                                : 'flex-1 min-w-[180px]'
                          }`}
                        >
                          {col}
                        </div>
                      ))}
                    </div>
                  </div>
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
                      pagedData.map((row, idx) => {
                        // 상태: 3가지(진행중, 낙찰, 낙찰실패)로 임의 분배 (실제 데이터에 맞게 조정)
                        let status = row.status;
                        if (!status) {
                          if (idx % 3 === 1) status = '낙찰';
                          else if (idx % 3 === 2) status = '낙찰실패';
                          else status = '진행중';
                        }
                        return (
                          <AdServingTableRow
                            key={idx}
                            row={{
                              광고명:
                                row.adName ||
                                ads.find((a) => a.id === row.adId)?.name ||
                                row.name,
                              상태: status,
                              낙찰가격: row.price
                                ? `₩${row.price.toLocaleString()}`
                                : '-',
                              노출일시:
                                row.exposeTime ||
                                row.Startdate + ' ~ ' + row.Enddate,
                              status, // for badge color
                            }}
                            columns={columns}
                          />
                        );
                      })
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

export default SlotServingPage;
