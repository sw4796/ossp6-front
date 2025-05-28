import styled from "styled-components";
import { Link, useLocation } from 'react-router-dom';
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactPaginate from 'react-paginate';
import '../App.css';
import ads from '../data/ads';

const region = ['서울', '경기', '광주', '전북', '경남', '경북', '충남', '대전', '부산', '충북', '대구', '전남', '전체'];
const adStatus = ['전체', '입찰중', '게재중', '입찰완료'];

const Wrapper = styled.div`
  display: flex;
  align-items: center; 
  height: 100vh;
  flex-direction: column;
  `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;  
  max-width: 900px;
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
  font-size: 18px;
  font-weight: 500; //폰트 두께
  white-space: nowrap;
  margin-top: 20px; //공간 여백
  margin-bottom: 25px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;  
  font-size: 15px;
  color: gray;
`;

const List = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;  
  font-size: 17px;
  color: black;
  padding: 25px 0;
  border-top: 1px solid #ddd;
`;

const Column = styled.div`
flex: 2;
text-align: center;

&:first-child{
text-align: left;
flex: 5;
}
`;

const handleCheckbox = (value, selectList, setList) => {

    if(selectList.includes(value)){
        setList(selectList.filter((v) => v !== value));
    }else
    setList([...selectList, value]);

};

const CheckboxGroupSection = ({ items, selectItem, setItem}) => {
    return(
        <div className="checkbox-group">
            {items.map((item) => (
                <label className="checkbox-label" key={item}>
                    <input type="checkbox" className="hidden-checkbox" checked={selectItem.includes(item)}
                    onChange={() => handleCheckbox(item, selectItem, setItem)
                    }
                    />
                    <span className="style-checkbox" />
                    {item}
                </label>
            ))}
        </div>
    );
};

const Mainpage = () => {
    const [page, setPage] = useState(0);
    const itemsPerPage = 4;

    const [selectRegion, setRegion] = useState(['전체']);
    const [selectadStatus, setadStatus] = useState(['전체']);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [budget, setBudget] = useState(2700000);

    const filterAds = ads.filter((ad) => {
        const matchRegion = selectRegion.length === 0 || selectRegion.includes(ad.region) || selectRegion.includes('전체');
        const matchStatus = selectadStatus.length === 0 || selectadStatus.includes(ad.status) || selectadStatus.includes('전체');
        
        const adStart = new Date(ad.Startdate);
        const adEnd = new Date(ad.Enddate);
        const matchDate = (!startDate || adEnd >= startDate) &&
        (!endDate || adStart <= endDate);
        const matchPrice = (budget >= ad.price);

        return  matchRegion && matchStatus && matchDate && matchPrice;
    })

    const pageCount = Math.ceil(filterAds.length / itemsPerPage);
    const current = page * itemsPerPage;
    const currentPageAds = filterAds.slice(current, current + itemsPerPage);

    const handlePageChange = (page) => {
            setPage(page.selected);
        };
  
  return (
    <>
        <Wrapper>
        <Container>
            <Title>지역을 선택하세요.</Title>
            <CheckboxGroupSection
            items={region} selectItem={selectRegion} setItem={setRegion} label="지역" />
        </Container>

        <Container>
            <Title>광고 상태</Title>
             <CheckboxGroupSection
            items={adStatus} selectItem={selectadStatus} setItem={setadStatus} label="광고 상태" />
            <Title>기간</Title>
            <div style={{ display: "flex", gap: "10px" }}>
            <DatePicker
            selected={startDate} onChange={(date) => setStartDate(date)} selectsStart
            startDate={startDate} endDate={endDate} placeholderText="시작일" dateFormat="yyyy-MM-dd" />
            <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate}
            endDate={endDate} minDate={startDate} placeholderText="종료일" dateFormat="yyyy-MM-dd" />
        </div>
        <Title>예산 범위</Title>
        <Slider min={0} max={5000000} step={10000} value={budget} 
        marks={{0: '0원', 2700000: '270만원', 5000000: '500만원'}}included={true} onChange={setBudget}/>
         <div>선택된 예산: 0원 ~ {budget / 10000}만원</div>
        </Container>

        <Container>
            <Title>입찰 광고 보기</Title>
            <ListHeader>
            <Column>광고명</Column>
            <Column>상태</Column>
            <Column>예상 통행량</Column>
            <Column>노출 점수</Column>
            <Column>가격</Column>
            </ListHeader>

            {currentPageAds.map((ad, index) => (
            <List key={index}>
            <Column><Link to={`/ad/${encodeURIComponent(ad.name)}`} 
            className="link-style">
            {ad.name || '-'}</Link> 
            <span style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginLeft: '5px' }}>
            {ad.Startdate} ~ {ad.Enddate}</span>
            </Column>
            <Column><span className={`status-label ${
                ad.status === '입찰중' ? 'status-bidding' :
                ad.status === '입찰완료' ? 'status-done' :
                ad.status === '게재중' ? 'status-active' : ''
            }`}>
            {ad.status}</span></Column>
            <Column>{ad.traffic?.toLocaleString() || '-'}</Column>
            <Column>{ad.score ?? '-'}</Column>
            <Column>{ad.price?.toLocaleString() + '원' || '-'}</Column>
            </List>
            ))}
            <ReactPaginate
                    pageCount={pageCount} previousLabel={"<"} nextLabel={">"}
                    onPageChange={handlePageChange} containerClassName={"pagination"} activeClassName={"active"}/>
        </Container>
        </Wrapper>
    </>
  );
}; 
export default Mainpage;