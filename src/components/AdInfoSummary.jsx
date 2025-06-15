import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AdInfoSummary({ data }) {
  const navigate = useNavigate();
  const { adslotid } = useParams();

  const handleBidClick = () => {
    if (adslotid) {
      navigate(`/ad-bid/${encodeURIComponent(adslotid)}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-row justify-between md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        <div>
          <h2 className="text-sm font-medium text-gray-500">광고 자리명</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {data.place}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">평균 낙찰 가격</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {data.price}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">광고 노출 기간</h2>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {data.period} ~
          </p>
        </div>
        <div className="flex justify-end items-center"></div>
      </div>
    </div>
  );
}

export default AdInfoSummary;
