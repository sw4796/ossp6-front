import React, { useRef, useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../providers/AuthContext';
import { registAd } from '../api/adRegistration';
import { useNavigate } from 'react-router-dom';

const MAX_FILES = 1;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const categories = [
  { value: '', label: '카테고리를 선택해주세요', disabled: true },
  { value: 'fashion', label: '패션/의류' },
  { value: 'beauty', label: '뷰티/화장품' },
  { value: 'food', label: '식품/음료' },
  { value: 'home', label: '가구/인테리어' },
  { value: 'digital', label: '디지털/가전' },
  { value: 'travel', label: '여행/레저' },
  { value: 'education', label: '교육/학습' },
  { value: 'finance', label: '금융/보험' },
  { value: 'etc', label: '기타' },
];

function AdRegistration() {
  const [adName, setAdName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adCategory, setAdCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [termsChecked, setTermsChecked] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const fileInputRef = useRef();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle file selection (from input or drop)
  const handleFiles = (fileList) => {
    let newFiles = Array.from(fileList);
    // Filter invalid files
    newFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return false;
      }
      if (!file.type.match('image/*') && !file.type.match('video/*')) {
        alert('이미지 또는 비디오 파일만 업로드 가능합니다.');
        return false;
      }
      // Prevent duplicates by name+size
      if (files.some((f) => f.name === file.name && f.size === file.size)) {
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

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adName.trim()) {
      alert('광고 이름을 입력해주세요.');
      return;
    }
    if (!adCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (files.length === 0) {
      alert('최소 1개 이상의 미디어 파일을 업로드해주세요.');
      return;
    }
    if (!termsChecked) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    if (!user?.userId) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }
    try {
      const dto = {
        userId: user.userId,
        name: adName,
        description: adDescription,
        category: adCategory,
      };
      const res = await registAd(dto, files[0]);
      if (res.data && res.data.success) {
        alert('광고가 성공적으로 등록되었습니다!');
        navigate('/'); // 메인화면으로 이동
      } else {
        alert(res.data?.message || '광고 등록에 실패했습니다.');
      }
    } catch {
      alert('광고 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">광고 등록</h1>
            <p className="text-gray-600">
              광고 정보를 입력하여 새로운 광고를 등록해주세요.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="adName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                광고 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="adName"
                name="adName"
                required
                className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                placeholder="광고 이름을 입력해주세요"
                value={adName}
                onChange={(e) => setAdName(e.target.value.slice(0, 50))}
              />
              <p className="mt-1 text-xs text-gray-500">
                최대 50자까지 입력 가능합니다.
              </p>
            </div>
            <div>
              <label
                htmlFor="adDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                광고 설명
              </label>
              <textarea
                id="adDescription"
                name="adDescription"
                rows={4}
                className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm resize-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                placeholder="광고에 대한 간단한 설명을 입력해주세요"
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value.slice(0, 200))}
              />
              <p className="mt-1 text-xs text-gray-500">
                최대 200자까지 입력 가능합니다.
              </p>
            </div>
            <div>
              <label
                htmlFor="adCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="adCategory"
                  name="adCategory"
                  required
                  className="appearance-none w-full px-4 py-2 border border-solid border-gray-300 rounded text-gray-900 text-sm pr-8 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none"
                  value={adCategory}
                  onChange={(e) => setAdCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      disabled={cat.disabled}
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
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
            <div className="flex justify-end">
              <input
                type="checkbox"
                id="termsCheck"
                className="custom-checkbox mr-2 mt-1"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
              />
              <label htmlFor="termsCheck" className="text-sm text-gray-700">
                광고 정책 및{' '}
                <a href="#" className="text-primary hover:underline">
                  이용약관
                </a>
                에 동의합니다.
              </label>
            </div>
            <div className="flex justify-end border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 border border-transparent rounded-button text-sm font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
              >
                등록하기
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
        .preview-item img, .preview-item video {
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
        .custom-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          position: relative;
        }
        .custom-checkbox:checked {
          background-color: #4F46E5;
          border-color: #4F46E5;
        }
        .custom-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>
      {/* Remixicon CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css"
        rel="stylesheet"
      />
      {/* Pacifico font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />
      {/* Daum 우편번호 서비스 스크립트 */}
      <script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        async
      ></script>
    </div>
  );
}

export default AdRegistration;
