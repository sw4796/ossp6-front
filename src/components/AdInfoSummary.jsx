import React from "react";

function AdInfoSummary({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-row justify-between md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        <div>
          <h2 className="text-sm font-medium text-gray-500">광고 자리명</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">{data.place}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">낙찰 납입 가격</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">{data.price}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">광고 노출 기간</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">{data.period} ~</p>
        </div>
        <div className="flex justify-end items-center">
          <button
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-2 rounded-[8px] font-semibold text-base transition-colors"
            style={{ minWidth: 180 }}
          >
            입찰 참여하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdInfoSummary;
