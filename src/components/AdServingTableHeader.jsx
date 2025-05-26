import React from 'react';

function AdServingTableHeader() {
  return (
    <div className="thead">
      <div className="tr">
        <div className="th th-name">광고자리명</div>
        <div className="th th-status">상태</div>
        <div className="th th-price">낙찰 가격</div>
        <div className="th th-time">노출 일시</div>
      </div>
    </div>
  );
}

export default AdServingTableHeader;
