import React from 'react';
import '../styles/InfoBox.css';

function InfoBox({ imgurl, title, maincontent, subcontent }) {
  return (
    <div className="info-box">
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
