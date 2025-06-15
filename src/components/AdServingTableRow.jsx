import React from 'react';

// 입찰 상태 enum 라벨 매핑 함수 (AdServingPage와 동일하게 유지)
const getBidStatusLabel = (status) => {
  switch (status) {
    case 0:
      return '입찰 전';
    case 1:
      return '입찰 중';
    case 2:
      return '입찰 성공';
    case 3:
      return '입찰 실패';
    default:
      return '-';
  }
};

function AdServingTableRow({ row, columns }) {
  // columns가 undefined일 때 기본값 설정
  const cols = columns || [];

  // 상태별 배지 색상 (enum 기준으로 보완)
  let badgeClass =
    'inline-block rounded-[12px] px-2 py-0.5 text-xs font-medium mt-1 leading-[18px] whitespace-nowrap';
  switch (row.status) {
    case 0:
      badgeClass += ' bg-blue-100 text-blue-700'; // 입찰 전
      break;
    case 1:
      badgeClass += ' bg-yellow-100 text-yellow-700'; // 입찰 중
      break;
    case 2:
      badgeClass += ' bg-green-100 text-green-700'; // 입찰 성공
      break;
    case 3:
      badgeClass += ' bg-[#fee2e2] text-[#991b1b]'; // 입찰 실패
      break;
    default:
      badgeClass += ' bg-gray-100 text-gray-700';
  }

  return (
    <div className="tr flex items-center min-h-[56px] border-b border-gray-200 bg-white">
      {cols.map((col, idx) => (
        <div
          key={col}
          className={`td ${
            idx === 1
              ? 'w-56 px-8'
              : idx === 2
                ? 'w-56'
                : 'flex-1 min-w-[180px]'
          } flex flex-col justify-center px-6 py-4`}
        >
          {col === '상태' ? (
            <span
              className={`w-fit px-3 py-1 inline-flex text-xs font-medium rounded-full ${badgeClass}`}
            >
              {row['상태']}
            </span>
          ) : (
            row[col]
          )}
        </div>
      ))}
    </div>
  );
}

export default AdServingTableRow;
