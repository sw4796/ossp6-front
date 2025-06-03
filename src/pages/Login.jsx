import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../providers/AuthContext';

const LoginButton = styled(Link)`
display: inline-block;
  width: 80px;
  padding: 8px;
  margin-top: 8px;
  text-align: center;
  background-color: #4B89DC;
  color: white;
border-radius: 5px;
font-size: 16px;
  box-sizing: border-box;
  text-decoration: none;

  &:hover {
    background-color: rgb(180, 210, 250);
    color: white;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  box-shadow: 0 4px 12px #ddd;
`;

const Title = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 24px;
  font-weight: 600; //폰트 두께
  white-space: nowrap;
  margin-top: -20px; //공간 여백
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
`;

const SLink = styled(Link)`
display: inline-block;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  text-align: center;
  background-color: #4B89DC;
  color: white;
border-radius: 20px;
font-size: 16px;
  box-sizing: border-box;
  text-decoration: none;

  &:hover {
    background-color: rgb(180, 210, 250);
    color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  background-color: #4b89dc;
  color: white;
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: rgb(180, 210, 250);
    color: white;
  }
`;

const Signup = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState('USER');
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 이미 로그인된 경우 메인으로 이동 (렌더링 중이 아닌 useEffect에서 처리)
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // 서버 로그인 API 호출
    const success = await login(id, pw, role);
    if (success) {
      navigate('/');
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <>
      <Container>
        <Title
          style={{
            display: 'flex',
            marginTop: 10,
            marginBottom: 20,
            borderBottom: '2px solid #ddd',
          }}
        >
          Welcome! ad-in-for
        </Title>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          {/* 권한 선택 라디오 버튼 추가 */}
          <div style={{ marginBottom: 10 }}>
            <label>
              <input
                type="radio"
                name="role"
                value="USER"
                checked={role === 'USER'}
                onChange={() => setRole('USER')}
              />
              광고주
            </label>
            <label style={{ marginLeft: 20 }}>
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={role === 'ADMIN'}
                onChange={() => setRole('ADMIN')}
              />
              매체사
            </label>
          </div>
          <Button type="submit">로그인</Button>
        </form>
        <SLink to="/Signup">회원가입</SLink>
      </Container>
    </>
  );
};

export default Signup;
