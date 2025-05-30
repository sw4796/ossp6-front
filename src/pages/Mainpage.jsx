import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactPaginate from 'react-paginate';
import '../App.css';
import ads from '../data/ads';
import adslots from '../data/adslots';
import adslotInfo from '../data/adslotInfo';
import Header from '../components/Header';

const region = [
  '서울',
  '경기',
  '광주',
  '전북',
  '경남',
  '경북',
  '충남',
  '대전',
  '부산',
  '충북',
  '대구',
  '전남',
  '전체',
];
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

  &:first-child {
    text-align: left;
    flex: 5;
  }
`;

const handleCheckbox = (value, selectList, setList) => {
  if (selectList.includes(value)) {
    setList(selectList.filter((v) => v !== value));
  } else setList([...selectList, value]);
};

const CheckboxGroupSection = ({ items, selectItem, setItem }) => {
  return (
    <div className="checkbox-group">
      {items.map((item) => (
        <label className="checkbox-label" key={item}>
          <input
            type="checkbox"
            className="hidden-checkbox"
            checked={selectItem.includes(item)}
            onChange={() => handleCheckbox(item, selectItem, setItem)}
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

  // 광고자리 리스트에 평균 통행량, 평균 노출점수, 평균 낙찰가 임의 데이터 추가
  const adslotList = adslots.map((slot, idx) => {
    const info = adslotInfo[slot.id] || {};
    // 예시: 평균 통행량, 평균 노출점수, 평균 낙찰가
    return {
      ...slot,
      avgTraffic: info.avgExposure || `${15000 + idx * 1000}명`,
      avgScore: info.avgScore || 80 - idx * 2,
      avgPrice: info.price || `₩ ${(1500000 + idx * 100000).toLocaleString()}`,
    };
  });

  // 필터 적용 (지역, 상태 등)
  const filterSlots = adslotList.filter((slot) => {
    const matchRegion =
      selectRegion.length === 0 ||
      selectRegion.includes(slot.region) ||
      selectRegion.includes('전체');
    // 광고자리에는 상태가 없으므로 상태 필터는 생략 또는 필요시 info.status 사용
    return matchRegion;
  });

  const pageCount = Math.ceil(filterSlots.length / itemsPerPage);
  const current = page * itemsPerPage;
  const currentPageSlots = filterSlots.slice(current, current + itemsPerPage);

  const handlePageChange = (page) => {
    setPage(page.selected);
  };

  // 광고자리 클릭 시 Adinfo로 이동
  const handleSlotClick = (slotId) => {
    window.location.href = `/adinfo/${slotId}`;
  };

  return (
    <>
      <Header />
      <Wrapper>
        <Container>
          <Title>지역을 선택하세요.</Title>
          <CheckboxGroupSection
            items={region}
            selectItem={selectRegion}
            setItem={setRegion}
            label="지역"
          />
        </Container>

        <Container>
          <Title>광고 상태</Title>
          <CheckboxGroupSection
            items={adStatus}
            selectItem={selectadStatus}
            setItem={setadStatus}
            label="광고 상태"
          />
          <Title>기간</Title>
          <div style={{ display: 'flex', gap: '10px' }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="시작일"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="종료일"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <Title>예산 범위</Title>
          <Slider
            min={0}
            max={5000000}
            step={10000}
            value={budget}
            marks={{ 0: '0원', 2700000: '270만원', 5000000: '500만원' }}
            included={true}
            onChange={setBudget}
          />
          <div>선택된 예산: 0원 ~ {budget / 10000}만원</div>
        </Container>

        <Container>
          <Title>입찰 광고 보기</Title>
          <ListHeader>
            <Column>광고자리명</Column>
            <Column>평균 통행량</Column>
            <Column>평균 노출점수</Column>
            <Column>평균 낙찰가</Column>
          </ListHeader>
          {currentPageSlots.map((slot, index) => (
            <List key={index}>
              <Column>
                <span
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSlotClick(slot.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {slot.name || '-'}
                </span>
                {/* 날짜 제거 */}
              </Column>
              <Column>{slot.avgTraffic}</Column>
              <Column>{slot.avgScore}</Column>
              <Column>{slot.avgPrice}</Column>
            </List>
          ))}
          <ReactPaginate
            pageCount={pageCount}
            previousLabel={'<'}
            nextLabel={'>'}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </Container>
      </Wrapper>
    </>
  );
};
export default Mainpage;
