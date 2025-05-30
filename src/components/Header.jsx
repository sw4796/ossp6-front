import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '2px solid #ddd',
        marginBottom: '50px',
      }}
    >
      <Link to="/">
        <img src="/logo.png" alt="logo" style={{ height: '30px' }} />
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" className={`main-label ${isActive('/') ? 'active' : ''}`}>
          광고 입찰
        </Link>
        <Link
          to="/Myads"
          className={`main-label ${isActive('/Myads') ? 'active' : ''}`}
        >
          내 광고
        </Link>
        <Link
          to="/Local"
          className={`main-label ${isActive('/Local') ? 'active' : ''}`}
        >
          지역 시세 보기
        </Link>
      </div>
      {user ? (
        <button
          onClick={handleLogout}
          className="LoginButton"
          style={{
            background: '#4B89DC',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            fontSize: '16px',
            cursor: 'pointer',
            minWidth: '80px', // 최소 너비 고정
            width: 'auto', // 내용에 따라 자동 확장
            whiteSpace: 'nowrap', // 줄바꿈 방지
          }}
        >
          Log-out
        </button>
      ) : (
        <Link
          to="/Signup"
          className="LoginButton"
          style={{
            minWidth: '80px',
            width: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          Log-in
        </Link>
      )}
    </header>
  );
};
export default Header;
