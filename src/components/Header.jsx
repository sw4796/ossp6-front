import styled from "styled-components";
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

const Header = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return(
        <header style={{top: 0, display: 'flex', alignItems: 'center', 
            justifyContent: 'space-between', padding: '10px', borderBottom: '2px solid #ddd', marginBottom: '50px'}}>
        <Link to="/">
        <img src="/logo.png" alt="logo" style={{ height: '30px' }} />
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>  
            <Link to="/" className={`main-label ${isActive('/') ? 'active' : ''}`}>광고 입찰</Link>
            <Link to="/Myads" className={`main-label ${isActive('/Myads') ? 'active' : ''}`}>내 광고</Link>
            <Link to="/Local" className={`main-label ${isActive('/Local') ? 'active' : ''}`}>지역 시세 보기</Link>
        </div>
        <Link to="/Signup" className="LoginButton">Log-in</Link>
        </header>
    );

};
export default Header;