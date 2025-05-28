import styled from "styled-components";
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Local() {
const location = useLocation();
        const isActive = location.pathname === '/Local';
  return (
    <>
    <header style={{ position:'fixed', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '10px', borderBottom: '2px solid #ddd', marginBottom: '50px'}}>
                  <Link to="/">
                  <img src="/logo.png" alt="logo" style={{ height: '30px' }} />
                  </Link>
                  <div style={{ display: 'flex', gap: '20px' }}>    
              <Link to="/" className="main-label">광고 입찰</Link>
              <Link to="/Myads" className="main-label">내 광고</Link>
              <Link to="/Local" className={`main-label ${isActive ? 'active' : ''}`}>지역 시세 보기</Link>
              </div>
              <Link to="/Signup" className="LoginButton">Log-in</Link>
        </header>
        </>
  );
}

export default Local;