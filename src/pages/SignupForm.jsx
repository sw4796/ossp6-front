import styled from "styled-components";
import { Link } from 'react-router-dom';
import '../App.css';

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
background-color: #4B89DC;
color: white;
border-radius: 20px;
font-size: 16px;
box-sizing: border-box;
  cursor: pointer;
&:hover {
    background-color:rgb(180, 210, 250);
    color: white;
  }
`;

const SignupForm = () => {

  return (
    <>
            {/* 정보 입력란 (Form) */}
            <Container>
              <Title style={{display: 'flex', marginTop: 10, marginBottom: 20, borderBottom: '2px solid #ddd'}}>정보 입력</Title>
              <Input type="text" placeholder="아이디 입력"></Input>
              <Input type="text" placeholder="비밀번호 입력"></Input>
              <Input type="text" placeholder="비밀번호 재입력"></Input>
              <Input type="text" placeholder="닉네임"></Input>
              <Button>회원가입 하기 </Button>
            </Container>
    </>
  );
};

export default SignupForm;
