import React, { useRef, useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import { registAdSlot } from '../api/adSlotRegistration';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';

const TIME_SLOTS = [
  '00:00 - 02:00',
  '02:00 - 04:00',
  '04:00 - 06:00',
  '06:00 - 08:00',
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
  '22:00 - 00:00',
];

const MAX_FILES = 1;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 지역명 매핑 테이블
const regionMap = [
  { keyword: '서울', region: '서울' },
  { keyword: '경기', region: '경기' },
  { keyword: '광주', region: '광주' },
  { keyword: '전북', region: '전북' },
  { keyword: '경남', region: '경남' },
  { keyword: '경북', region: '경북' },
  { keyword: '충남', region: '충남' },
  { keyword: '대전', region: '대전' },
  { keyword: '부산', region: '부산' },
  { keyword: '충북', region: '충북' },
  { keyword: '대구', region: '대구' },
  { keyword: '전남', region: '전남' },
];

// 주소에서 지역 추출 함수
function extractRegion(address) {
  if (!address) return '';
  for (const { keyword, region } of regionMap) {
    if (address.startsWith(keyword)) return region;
    if (address.includes(keyword)) return region;
  }
  return '';
}

function AdSlotRegistration() {
  const [adSpaceName, setAdSpaceName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [minPrices, setMinPrices] = useState(Array(TIME_SLOTS.length).fill(''));
  const [files, setFiles] = useState([]);
  const [highlight, setHighlight] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 이미지 업로드
  const handleFiles = (fileList) => {
    let newFiles = Array.from(fileList);
    newFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return false;
      }
      if (!file.type.match('image/*')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return false;
      }
      return true;
    });
    // 항상 1개만 유지
    if (newFiles.length > 0) {
      setFiles([newFiles[0]]);
    }
  };

  // Drag & drop handlers
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e) => {
    preventDefaults(e);
    setHighlight(false);
    handleFiles(e.dataTransfer.files);
  };

  // Remove file
  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // 최소가격 입력
  const handleMinPriceChange = (idx, value) => {
    // 빈 값 허용
    if (value === '') {
      setMinPrices((prev) => {
        const arr = [...prev];
        arr[idx] = '';
        return arr;
      });
      return;
    }
    // 숫자만 허용, 0 이상만
    let num = Number(value);
    if (isNaN(num) || num < 0) return;
    // 100원 단위만 허용: 입력값이 100의 배수가 아니면 입력값 그대로 두고, 제출 시 반올림
    setMinPrices((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  // 주소 검색(daum 우편번호 서비스)
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const fullAddr = data.roadAddress || data.jibunAddress;
          setAddress(fullAddr);
        },
      }).open();
    } else {
      alert('주소 검색 서비스를 불러올 수 없습니다.');
    }
  };

  // 카카오맵 스크립트 동적 로드 및 지도 표시
  useEffect(() => {
    if (!address) return;

    function drawMap() {
      const container = document.getElementById('kakao-map');
      if (!container) return;
      container.innerHTML = '';
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const options = {
            center: coords,
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);
          new window.kakao.maps.Marker({
            position: coords,
            map,
          });
        }
      });
    }

    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      drawMap();
      return;
    }

    const scriptId = 'kakao-map-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          drawMap();
        });
      };
      document.body.appendChild(script);
    } else {
      const checkLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          clearInterval(checkLoaded);
          drawMap();
        }
      }, 100);
    }
  }, [address]);

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adSpaceName.trim()) {
      alert('광고 자리 이름을 입력해주세요.');
      return;
    }
    if (files.length === 0) {
      alert('최소 1개 이상의 이미지를 업로드해주세요.');
      return;
    }
    if (!address.trim()) {
      alert('주소를 입력해주세요.');
      return;
    }
    if (!user?.userId) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }
    if (!width || !height) {
      alert('광고판 가로/세로 길이를 입력해주세요.');
      return;
    }
    // 최소 가격 필수 입력 체크 및 100원 단위 반올림
    const minPriceList = TIME_SLOTS.map((slot, i) => {
      let price = minPrices[i];
      if (price === '' || price === null || isNaN(Number(price))) {
        alert('모든 시간대별 최소 가격을 입력해주세요.');
        throw new Error('가격 미입력');
      }
      price = Math.round(Number(price) / 100) * 100;
      const [startTime, endTime] = slot.split(' - ');
      return { startTime, endTime, price };
    });
    // dto 생성
    const dto = {
      slotName: adSpaceName,
      description,
      address,
      width: Number(width),
      height: Number(height),
      adminId: user.userId, // 로그인 사용자 id
      minPriceList,
    };
    try {
      const res = await registAdSlot(dto, files[0]);
      if (res.data && res.data.success == true && res.data.error == null) {
        alert('광고 자리가 성공적으로 등록되었습니다.');
        navigate('/');
      } else {
        alert(res.data?.error || '광고 자리 등록에 실패했습니다.');
      }
    } catch {
      // 가격 미입력 등으로 throw된 경우는 이미 alert됨
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              광고 자리 등록
            </h1>
            <p className="text-gray-600">
              광고 자리 정보를 입력하여 새로운 광고 자리를 등록해주세요.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 기본 정보 섹션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                광고 자리 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="adSpaceName"
                className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                placeholder="광고 자리 이름을 입력하세요"
                value={adSpaceName}
                onChange={(e) => setAdSpaceName(e.target.value.slice(0, 50))}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                최대 50자까지 입력 가능합니다.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm resize-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                placeholder="광고 자리에 대한 상세 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              />
              <p className="mt-1 text-xs text-gray-500">
                최대 200자까지 입력 가능합니다.
              </p>
              {/* 광고판 가로/세로 입력란 추가 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 pt-4">
                  광고판 가로 길이 (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                  placeholder="가로(cm)"
                  value={width}
                  onChange={(e) =>
                    setWidth(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 pt-4">
                  광고판 세로 길이 (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                  placeholder="세로(cm)"
                  value={height}
                  onChange={(e) =>
                    setHeight(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                미디어 업로드 <span className="text-red-500">*</span>
              </label>
              <div
                className={`file-drop-area p-8 text-center ${highlight ? 'highlight' : ''}`}
                onDragEnter={(e) => {
                  preventDefaults(e);
                  setHighlight(true);
                }}
                onDragOver={(e) => {
                  preventDefaults(e);
                  setHighlight(true);
                }}
                onDragLeave={(e) => {
                  preventDefaults(e);
                  setHighlight(false);
                }}
                onDrop={onDrop}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <i className="ri-upload-cloud-line text-2xl text-gray-500"></i>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  파일을 이곳에 끌어다 놓거나
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-button text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                  onClick={() => fileInputRef.current.click()}
                >
                  파일 선택
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="file-input"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
                <p className="mt-2 text-xs text-gray-500">
                  지원 형식: JPG, PNG, GIF, MP4, MOV (최대 10MB)
                </p>
              </div>
              {/* 미리보기는 아래 한 번만 렌더 */}
              <div className="preview-container flex flex-wrap gap-3 mt-4">
                {files.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      className="preview-item relative w-[120px] h-[120px] rounded overflow-hidden shadow"
                      key={idx}
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <video
                          src={url}
                          muted
                          controls
                          className="w-full h-full object-cover object-top"
                        />
                      )}
                      <div
                        className="remove-btn absolute right-1 top-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-red-500"
                        onClick={() => removeFile(idx)}
                      >
                        <i className="ri-close-line"></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 위치 정보 섹션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                광고판 위치(주소) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                  placeholder="주소를 검색해주세요"
                  value={address}
                  readOnly
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 border border-gray-300 text-white rounded-button text-sm font-medium hover:bg-indigo-700 whitespace-nowrap"
                  onClick={handleAddressSearch}
                >
                  주소 검색
                </button>
              </div>
              {/* 상세 주소 입력란 추가 */}
              <input
                type="text"
                className="w-full mt-2 px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                placeholder="상세 주소를 입력해주세요 (예: 3층 301호)"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value.slice(0, 100))}
              />
              <p className="mt-1 text-xs text-gray-500">
                상세 주소는 선택 입력입니다. (최대 100자)
              </p>
              {/* 지역명 추출 */}
              {address && (
                <p className="mt-1 text-xs text-gray-500">
                  지역: {extractRegion(address) || '알 수 없음'}
                </p>
              )}
              <div
                className="mt-3 rounded-lg overflow-hidden border border-gray-200"
                style={{ width: '100%', height: '300px' }}
              >
                <div
                  id="kakao-map"
                  style={{ width: '100%', height: '300px' }}
                ></div>
              </div>
            </div>
            {/* 시간대별 가격 설정 섹션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시간대별 최소 가격 설정
              </label>
              <p className="text-sm text-gray-500 mb-4">
                각 시간대별 최소 가격을 설정해주세요. 광고주는 이 가격
                이상으로만 입찰할 수 있습니다.
              </p>
              <div className="rounded-lg overflow-hidden bg-gray-50">
                <div className="grid grid-cols-2 gap-4 p-3 border-b border-gray-200">
                  <div className="font-medium text-gray-700">시간대</div>
                  <div className="font-medium text-gray-700">
                    최소 가격 (원)
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {TIME_SLOTS.map((slot, idx) => (
                    <div
                      className="time-block grid grid-cols-2 gap-4 p-4"
                      key={slot}
                    >
                      <div className="flex items-center text-gray-700">
                        {slot}
                      </div>
                      <div>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-solid border-gray-300 rounded focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                          placeholder="최소 가격"
                          min={0}
                          step={100}
                          required
                          value={minPrices[idx]}
                          onChange={(e) =>
                            handleMinPriceChange(idx, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 하단 버튼 */}
            <div className="flex justify-end border-t border-gray-200 pt-6 space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-button whitespace-nowrap hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 border border-transparent rounded-button text-sm font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Tailwind custom config and styles */}
      <style>{`
        :where([class^="ri-"])::before { content: "\\f3c2"; }
        .file-drop-area {
          position: relative;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .file-drop-area.highlight {
          border-color: #4F46E5;
          background-color: rgba(79, 70, 229, 0.05);
        }
        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }
        .remove-btn {
          position: absolute;
          right: 4px;
          top: 4px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ef4444;
        }
        .time-block:nth-child(odd) {
          background-color: #f8fafc;
        }
        .time-block:nth-child(even) {
          background-color: #f1f5f9;
        }
      `}</style>
      {/* Daum 우편번호 서비스 스크립트 */}
      <script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        async
      ></script>
    </div>
  );
}

export default AdSlotRegistration;
