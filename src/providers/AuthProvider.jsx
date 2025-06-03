import { AuthContext } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import React, { useState, useEffect } from 'react';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 함수 (API 연동)
  const login = async (id, password, role) => {
    try {
      // role은 advertiser면 USER, media면 ADMIN으로 변환해서 전달
      const mappedRole = role === 'advertiser' ? 'USER' : 'ADMIN';
      const userInfo = await apiLogin(id, password, mappedRole);
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
    } catch {
      return false;
    }
  };

  // 로그아웃 함수 (API 연동)
  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 앱 시작 시 localStorage에서 유저 정보 복원
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    setInitialized(true);
  }, []);

  // 로그인 안 했으면 로그인 페이지로 리다이렉트 (로그인/회원가입 페이지 제외)
  useEffect(() => {
    if (!initialized) return;
    const publicPaths = ['/login', '/signup'];
    // 대소문자 구분 없이 비교
    const currentPath = location.pathname.toLowerCase();
    if (!user && !publicPaths.includes(currentPath)) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, location.pathname, navigate, initialized]);

  // 초기화 전에는 아무것도 렌더링하지 않음(깜빡임 방지)
  if (!initialized) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
