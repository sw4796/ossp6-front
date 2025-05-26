import React from 'react';
import '../styles/InfoBox.css'; // 스타일 분리형

function InfoBox({ imgurl, title, maincontent, subcontent, w, h }) {
  const boxStyle = {
    width: typeof w === 'number' ? `${w}px` : w,
    height: typeof h === 'number' ? `${h}px` : h,
  };

  return (
    <div className="info-box" style={boxStyle}>
      <div className="header">
        <img src={imgurl} alt="img" />
        <h3>{title}</h3>
      </div>
      <span className="main">{maincontent}</span>
      <span>{subcontent}</span>
    </div>
  );
}

export default InfoBox;
