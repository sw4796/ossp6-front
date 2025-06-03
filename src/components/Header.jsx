import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthContext';
import { logout as apiLogout } from '../api/auth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    apiLogout();
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
        marginBottom: '30px',
      }}
    >
      <Link to="/">
        <img
          src="/logo.png"
          alt="logo"
          style={{ height: '30px', marginLeft: '30px' }}
        />
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" className={`main-label ${isActive('/') ? 'active' : ''}`}>
          광고 입찰
        </Link>
        {user && user.role === 'USER' && (
          <Link
            to="/myads"
            className={`main-label ${isActive('/myads') ? 'active' : ''}`}
          >
            내 광고
          </Link>
        )}
        {user && user.role === 'ADMIN' && (
          <Link
            to="/myslots"
            className={`main-label ${isActive('/myslots') ? 'active' : ''}`}
          >
            내 광고자리
          </Link>
        )}
        {!user && (
          <Link
            to="/myads"
            className={`main-label ${isActive('/myads') ? 'active' : ''}`}
          >
            내 광고
          </Link>
        )}
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
            marginRight: '30px', // 오른쪽 여백 추가
          }}
        >
          Log-out
        </button>
      ) : (
        <Link
          to="/Login"
          className="LoginButton"
          style={{
            minWidth: '80px',
            width: 'auto',
            whiteSpace: 'nowrap',
            marginRight: '30px', // 오른쪽 여백 추가
          }}
        >
          Log-in
        </Link>
      )}
    </header>
  );
};
export default Header;
