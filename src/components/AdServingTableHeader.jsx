import React from 'react';

function AdServingTableHeader() {
  return (
    <div className="thead bg-white font-['Roboto']">
      <div className="tr flex items-center min-h-[48px] border-b border-gray-200">
        <div className="th flex-1 min-w-[180px] px-6 py-3 text-gray-500 font-semibold text-sm">
          광고자리명
        </div>
        <div className="th w-56 px-8 py-3 text-gray-500 font-semibold text-sm">
          상태
        </div>
        <div className="th w-56 px-6 py-3 text-gray-500 font-semibold text-sm">
          낙찰 가격
        </div>
        <div className="th flex-1 min-w-[180px] px-6 py-3 text-gray-500 font-semibold text-sm">
          노출 일시
        </div>
      </div>
    </div>
  );
}

export default AdServingTableHeader;
