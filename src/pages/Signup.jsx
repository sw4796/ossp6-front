import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { users } from '../data/users';

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

const SignupForm = () => {
  const [role, setRole] = useState('advertiser'); // 권한 선택 상태 추가

  return (
    <>
      {/* 정보 입력란 (Form) */}
      <Container>
        <Title
          style={{
            display: 'flex',
            marginTop: 10,
            marginBottom: 20,
            borderBottom: '2px solid #ddd',
          }}
        >
          정보 입력
        </Title>
        <Input type="text" placeholder="아이디 입력"></Input>
        <Input type="text" placeholder="비밀번호 입력"></Input>
        <Input type="text" placeholder="비밀번호 재입력"></Input>
        <Input type="text" placeholder="닉네임"></Input>
        {/* 권한 선택 라디오 버튼 추가 */}
        <div style={{ marginBottom: 10, width: '100%' }}>
          <label>
            <input
              type="radio"
              name="role"
              value="advertiser"
              checked={role === 'advertiser'}
              onChange={() => setRole('advertiser')}
            />
            광고주
          </label>
          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              name="role"
              value="media"
              checked={role === 'media'}
              onChange={() => setRole('media')}
            />
            매체사
          </label>
        </div>
        <Button>회원가입 하기 </Button>
      </Container>
    </>
  );
};

const Signup = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState('advertiser'); // 권한 선택 상태 추가
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
    // users 데이터에서 유저 찾기 (권한도 함께 비교)
    const found = users.find(
      (u) => u.id === id && u.password === pw && u.role === role
    );
    if (found) {
      login(found);
      navigate('/');
    } else {
      alert('로그인 실패');
    }
  };

  if (user) return null;

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
                value="advertiser"
                checked={role === 'advertiser'}
                onChange={() => setRole('advertiser')}
              />
              광고주
            </label>
            <label style={{ marginLeft: 20 }}>
              <input
                type="radio"
                name="role"
                value="media"
                checked={role === 'media'}
                onChange={() => setRole('media')}
              />
              매체사
            </label>
          </div>
          <Button type="submit">로그인</Button>
        </form>
        <SLink to="/SignupForm">회원가입</SLink>
      </Container>
    </>
  );
};

export default Signup;
