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

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 419)
    ) {
      // 토큰 만료 또는 인증 오류 시 로그아웃 및 로그인 페이지로 이동
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 로그인
export const login = async (id, password, authStatus) => {
  const res = await api.post('/login', {
    loginId: id,
    password,
    authStatus,
  });
  if (res.data.success) {
    const { accessToken } = res.data.data;
    localStorage.setItem('jwtToken', accessToken);
    // JWT 토큰에서 userId, auth만 추출
    let payload = {};
    try {
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      payload = { userId: decoded.userId, role: decoded.auth };
    } catch {
      // 파싱 실패 시 payload는 빈 객체
    }
    // user 객체에 userId, auth만 포함
    return { ...payload };
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
