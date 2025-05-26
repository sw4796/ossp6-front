import {useParams} from 'react-router-dom';
import styled from "styled-components";
import { Link, useLocation } from 'react-router-dom';
import '../App.css';
import ads from '../data/ads';

const Wrapper = styled.div`
  display: flex;
  align-items: center; 
  height: 100vh;
  flex-direction: column;
  `;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 40px;
  width: 60%;  
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px #ddd;
`;

const Title = styled.div`
 display: flex;
  align-items: flex-start;
  font-size: 28px;
  font-weight: 500; //폰트 두께
  white-space: nowrap;
  margin-top: 20px; //공간 여백
`;

const Text = styled.div`
 display: flex;
  align-items: flex-start;
  font-size: 15px;
  white-space: nowrap;
  margin-top: 15px; //공간 여백
  margin-bottom:10px;
color: gray;
`;

const Textdetail = styled.div`
 display: flex;
  align-items: flex-start;
  font-size: 20px;
  white-space: nowrap;
  margin-bottom: 25px;
color: black;
`;

const BiddingButton = styled(Link)`
display: inline-block;
width: 120px;
padding: 8px;
margin-top: 8px;
text-align: center;
background-color: #4B89DC;
color: white;
border-radius: 5px;
font-size: 16px;
box-sizing: border-box;
text-decoration: none;
  cursor: pointer;
&:hover{
background-color: rgb(180, 210, 250);
}
`;

const AdPost = () => {
    const {adName} = useParams();
    const ad = ads.find(ad => ad.name === adName);

if(!ad) return <div>광고 정보를 찾을 수 없습니다.</div>;

return(
     <>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '10px', borderBottom: '2px solid #ddd', marginBottom: '50px'}}>
                      <Link to="/">
                      <img src="/logo.png" alt="logo" style={{ height: '30px' }} />
                      </Link>
                      <div style={{ display: 'flex', gap: '20px' }}>   
                  <Link to="/" className="main-label">광고 입찰</Link>
                  <Link to="/Myads" className="main-label">내 광고</Link>
                  <Link to="/Local" className="main-label">지역 시세 보기</Link>
                  </div>
                  <Link to="/Signup" className="LoginButton">Log-in</Link>
            </header>
            <Wrapper>
            <Container>
                <img src="/logo512.png" alt="logo" style={{ height: '300px', marginBottom: '20px'}} />
    <div style={{ flex: 2 }}>
      <Title>{ad.name}</Title>
      <Text>입찰 기간:{ad.Startdate} ~ {ad.Enddate}</Text>
      <Text>평균 입찰 가격</Text>
      <Textdetail></Textdetail>
      <Text>직전 입찰 가격</Text>
      <Textdetail></Textdetail>
      <Text>이전 광고사</Text>
      <Textdetail></Textdetail>
      <Text>예상 통행량</Text>
      <Textdetail>{ad.traffic?.toLocaleString() || '-'}</Textdetail>
      <BiddingButton to={`/ad/${encodeURIComponent(ad.name)}/bidding`}>입찰하러 가기</BiddingButton>
      </div>
      </Container>
      </Wrapper>
      </>
);
};
export default AdPost;