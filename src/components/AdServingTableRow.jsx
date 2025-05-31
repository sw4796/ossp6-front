import React from 'react';

function AdServingTableRow({ row, columns }) {
  // columns가 undefined일 때 기본값 설정
  const cols = columns || [];

  // 상태별 배지 색상
  let badgeClass =
    'inline-block rounded-[12px] px-2 py-0.5 text-xs font-medium mt-1 leading-[18px] whitespace-nowrap';
  if (row.status === '완료') badgeClass += ' bg-blue-100 text-blue-700';
  else if (row.status === '진행중')
    badgeClass += ' bg-green-100 text-green-700';
  else if (row.status === '입찰중')
    badgeClass += ' bg-yellow-100 text-yellow-700';
  else if (row.status === '입찰완료') badgeClass += ' bg-red-100 text-red-700';
  else if (row.status === '게재중')
    badgeClass += ' bg-green-100 text-green-700';
  else if (row.status === '낙찰')
    badgeClass += ' bg-indigo-100 text-indigo-700';
  else if (row.status === '낙찰실패')
    badgeClass += ' bg-[#fee2e2] text-[#991b1b]'; // 게재중지와 동일
  else badgeClass += ' bg-gray-100 text-gray-700';

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
              {row.status}
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
