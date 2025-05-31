import React from 'react';

function AdServingTableHeader({ columns }) {
  // columns가 undefined이거나 배열이 아니면 빈 배열로 처리
  const cols = Array.isArray(columns) ? columns : [];
  return (
    <div className="thead bg-white font-['Roboto']">
      <div className="tr flex items-center min-h-[48px] border-b border-gray-200">
        {cols.map((col, idx) => (
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
  );
}

export default AdServingTableHeader;
