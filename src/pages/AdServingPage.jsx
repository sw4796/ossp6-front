import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import InfoBox from '../components/InfoBox';
import AdServingTableHeader from '../components/AdServingTableHeader';
import AdServingTableRow from '../components/AdServingTableRow';
import { adServingTableData } from '../data/adServingTableData';
import filter_icon from '../assets/icon-filter.png';
import dropdown_icon from '../assets/icon-dropdown.png';
import left_arrow from '../assets/left-arrow.png';
import right_arrow from '../assets/right-arrow.png';
import static_icon from '../assets/static-icon.png';

function AdServingPage() {
  const infoBoxData = [
    {
      title: '총 노출수',
      maincontent: '25,840',
      subcontent: '전주 대비 12% 증가',
    },
    { title: '클릭수', maincontent: '5,201', subcontent: '전주 대비 7% 증가' },
    { title: 'CTR', maincontent: '20.1%', subcontent: '광고 클릭률' },
    { title: '광고수', maincontent: '12', subcontent: '집행 중 광고' },
  ];

  // 광고 자리명 목록 추출 (중복 제거)
  const placeList = Array.from(
    new Set(adServingTableData.map((row) => row.place))
  );

  // 드롭다운 및 필터 상태
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

  // 필터링된 데이터
  const filteredData = selectedPlace
    ? adServingTableData.filter((row) => row.place === selectedPlace)
    : adServingTableData;

  return (
    <>
      <Header />
      <div className="relative w-full min-h-screen flex flex-col items-center bg-gray-50 pt-[65px]">
        <div className="w-full max-w-[1200px] px-2 sm:px-4 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-gray-900">광고 자리 관리</h1>
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
            <h2 className="font-bold text-xl text-black">입찰 광고 보기</h2>
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
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img src={filter_icon} alt="img" className="w-5 h-5" />
                      </div>
                      <span className="flex-1 text-sm text-center text-black whitespace-nowrap">
                        {selectedPlace ? selectedPlace : '광고 자리 필터'}
                      </span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img src={dropdown_icon} alt="img" className="w-5 h-5" />
                      </div>
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
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-indigo-600 hover:bg-indigo-500 transition"
                    style={{
                      boxSizing: 'border-box',
                      opacity: 1,
                    }}
                  >
                    <img src={static_icon} alt="사진" className="w-5 h-5" />
                    <span className="text-sm text-white whitespace-nowrap">
                      그룹 통계 버튼
                    </span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <AdServingTableHeader />
                  <div>
                    {filteredData.map((row, idx) => (
                      <AdServingTableRow key={idx} row={row} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center h-16">
                <div className="flex items-center gap-2 mr-8">
                  <span className="text-gray-700 text-sm">1/3 페이지</span>
                  <div className="flex gap-1">
                    <button className="w-[30px] h-[30px] p-2 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-300">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={left_arrow}
                          alt="img"
                          className="w-full h-auto"
                        />
                      </div>
                    </button>
                    <button className="w-[30px] h-[30px] p-2 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-300">
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
