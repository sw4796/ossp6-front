import React from 'react';

function AdServingTableRow({ row }) {
  // 상태에 따라 색을 다르게 하고 싶으면 아래처럼 조건부 클래스 사용
  // const statusClass = row.status === '완료' ? 'status complete' : 'status in-progress';

  return (
    <div className="tr">
      <div className="td">
        <div>{row.place}</div>
        <div className="sub" style={{ color: '#888', fontSize: '0.92em' }}>
          {row.sub}
        </div>
      </div>
      <div className="td">
        <span>{row.status}</span>
      </div>
      <div className="td">
        <span>{row.price}</span>
      </div>
      <div className="td">
        <span>{row.date}</span>
      </div>
    </div>
  );
}

export default AdServingTableRow;
