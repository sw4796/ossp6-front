import React from 'react';

function AdServingTableRow({ row }) {
  // 상태별 배지 색상 및 padding 조정 (글자 가로크기만큼만)
  let badgeClass =
    'inline-block rounded-[12px] px-2 py-0.5 text-xs font-medium mt-1 leading-[18px] whitespace-nowrap';
  if (row.status === '완료') {
    badgeClass += ' bg-blue-100 text-blue-700';
  } else if (row.status === '진행중') {
    badgeClass += ' bg-green-100 text-green-700';
  } else if (row.status === '입찰중') {
    badgeClass += ' bg-yellow-100 text-yellow-700';
  } else if (row.status === '입찰완료') {
    badgeClass += ' bg-red-100 text-red-700';
  } else if (row.status === '게재중') {
    badgeClass += ' bg-green-100 text-green-700';
  } else {
    badgeClass += ' bg-gray-100 text-gray-700';
  }

  return (
    <div className="tr flex items-center min-h-[56px] border-b border-gray-200 bg-white">
      <div className="td flex-1 min-w-[180px] flex flex-col justify-center px-6 py-4">
        <div className="text-[14px] font-medium leading-5 tracking-[0px] text-[#111827] font-['Roboto'] decoration-none">
          {row.place}
        </div>
        <div className="sub text-xs text-gray-400 mt-1">{row.sub}</div>
      </div>
      <div className="td w-56 flex flex-col justify-center px-6 py-4">
        <span
          className={`w-fit px-3 py-1 inline-flex text-xs font-medium rounded-full ${badgeClass}`}
        >
          {row.status}
        </span>
      </div>
      <div className="td w-56 flex flex-col justify-center px-6 py-4">
        <span>{row.price}</span>
      </div>
      <div className="td flex-1 min-w-[180px] flex flex-col justify-center px-6 py-4">
        <span>{row.date}</span>
      </div>
    </div>
  );
}

export default AdServingTableRow;
