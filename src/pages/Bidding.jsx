import {useParams} from 'react-router-dom';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import {useState} from 'react';
import '../App.css';
import ads from '../data/ads';

const time = ['00~02시', '02~04시','04~06시','06~08시','08~10시','10~12시','12~14시',
                '14~16시','16~18시','18~20시','20~22시','22~00시'];

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

const Title1 = styled.div`
 display: flex;
  align-items: flex-start;
  font-size: 18px;
  font-weight: 500; //폰트 두께
  white-space: nowrap;
  margin-top: 20px; //공간 여백
  margin-bottom: 25px;
`;

const BiddingButton = styled(Link)`
display: inline-block;
width: 120px;
padding: 8px;
margin-top: 8px;
margin-left: 20px;
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
color: white;
}
`;

const BidInput = styled.input`
width: 300px;
padding: 10px;
font-size: 16px;
border-radius: 5px;
text-decoration: none;
border: 2px solid #ccc;
`;

const CheckboxGroupSection = ({ items, selectItem, handleCheckbox}) => {
    return(
        <div className="checkbox-group">
            {items.map((item) => (
                <label className="checkbox-label" key={item}>
                    <input type="checkbox" className="hidden-checkbox" checked={selectItem.includes(item)}
                    onChange={() => handleCheckbox(item)
                    }
                    />
                    <span className="style-checkbox" />
                    {item}
                </label>
            ))}
        </div>
    );
};

const Bidding = () => {
    const {adName} = useParams();
    const ad = ads.find(ad => ad.name === adName);
    const [bidPrice, setbidPrice] = useState('');
    const [selectTime, setadTime] = useState([]);

const handleCheckbox = (times) => {
    if(selectTime.includes(times)){
        setadTime(selectTime.filter((t) => t !== times));
    }else
    setadTime([...selectTime, times]);
};

const onChange = (e) =>{
    setbidPrice(e.target.value);
};

if(!ad) return <div>광고 정보를 찾을 수 없습니다.</div>;

return(
     <>
            <Wrapper>
            <Container>
                <img src="/logo512.png" alt="logo" style={{ height: '300px', marginBottom: '20px'}} />
    <div style={{ flex: 2 }}>
      <Title>{ad.name}</Title>
      <Text>입찰 기간:{ad.Startdate} ~ {ad.Enddate}</Text>
      </div>
      </Container>

      <Container style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
        <Title1>희망하는 입찰 시간을 선택해주세요.</Title1>
        <CheckboxGroupSection
        items={time} selectItem={selectTime} handleCheckbox={handleCheckbox} label="시간" />
      <div>
        <BidInput type="text" placeholder='입찰 금액' value={bidPrice} 
        onChange={(e) => setbidPrice(e.target.value)}/>
        <BiddingButton>입찰하기</BiddingButton>
      </div>
      </Container>
      </Wrapper>
      </>
);
};
export default Bidding;