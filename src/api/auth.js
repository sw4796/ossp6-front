import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 프록시 해제: 직접 서버 주소로 요청
});

// JWT 토큰을 localStorage에서 가져와서 요청에 자동으로 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 로그인
export const login = async (id, password, role) => {
  const authStatus = role === 'advertiser' ? 'USER' : 'ADMIN';
  // axios POST 요청으로 변경
  const res = await api.post('/login', {
    loginId: id,
    password,
    authStatus,
  });
  if (res.data.success) {
    const { accessToken, grantType } = res.data.data;
    localStorage.setItem('jwtToken', accessToken);
    return { id, role, grantType };
  } else {
    throw new Error('로그인 실패');
  }
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('user');
};

export default api;
