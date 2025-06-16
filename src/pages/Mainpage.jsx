import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactPaginate from 'react-paginate';
import '../App.css';
import adslots from '../data/adslots';
import adslotInfo from '../data/adslotInfo';
import Header from '../components/Header';
import { getAdSlots } from '../api/getAds';

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
const adStatus = ['전체', '입찰 전', '입찰 중', '입찰 완료'];

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9fafb;
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

// 광고자리 상태 라벨 함수 (AdSlotStatus Enum에 맞춤, 숫자 매핑)
const getAdSlotStatusLabel = (status) => {
  switch (status) {
    case 0:
      return '입찰 전';
    case 1:
      return '입찰 진행중';
    case 2:
      return '광고 게재중';
    default:
      return '-';
  }
};

const Mainpage = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const [adSlots, setAdslots] = useState([]);
  const [selectRegion, setRegion] = useState(['전체']);
  const [selectadStatus, setadStatus] = useState(['전체']);
  const [budget, setBudget] = useState(2700000);
  const navigate = useNavigate();

  const fetchFilterSlots = useCallback(async () => {
    // Wrapped in useCallback
    let apiBidStatus = null;
    if (
      selectadStatus &&
      !selectadStatus.includes('전체') &&
      selectadStatus.length > 0
    ) {
      const firstSelectedStatus = selectadStatus[0];
      if (firstSelectedStatus === '입찰 전') {
        apiBidStatus = '입찰 전';
      } else if (firstSelectedStatus === '입찰 중') {
        apiBidStatus = '입찰 중';
      } else if (firstSelectedStatus === '입찰 완료') {
        apiBidStatus = '입찰 종료';
      }
    }

    const body = {
      regions: selectRegion.includes('전체') ? null : selectRegion,
      bidStatus: apiBidStatus,
      price: budget,
    };

    const res = await getAdSlots(body); // POST 요청
    if (res?.success && Array.isArray(res.data)) {
      const SlotData = res.data.map((slot) => {
        // bidStatus가 null이면 '-'로, 0/1/2면 상태명으로 변환
        let statusLabel = '-';
        if (slot.bidStatus === 0) statusLabel = '입찰 전';
        else if (slot.bidStatus === 1) statusLabel = '입찰 진행중';
        else if (slot.bidStatus === 2) statusLabel = '광고 게재중';
        return {
          ...slot,
          name: slot.SlotName,
          id: slot.adSlotId,
          address: slot.address,
          status: statusLabel,
          avgPrice: `₩ ${(slot.bid || 0).toLocaleString()}`,
        };
      });
      setAdslots(SlotData);
    }
  }, [selectRegion, selectadStatus, budget]); // Dependencies for useCallback

  useEffect(() => {
    fetchFilterSlots();
  }, [fetchFilterSlots]); // useEffect now depends on the memoized fetchFilterSlots

  // 날짜 관련 로직 제거
  //const filterSlots = adSlots;
  const filterSlots = adSlots.filter((slot) => {
    const numericPrice = parseInt(slot.avgPrice.replace(/[^\d]/g, ''), 10);
    const matchBudget = numericPrice <= budget;

    const matchStatus =
      selectadStatus.includes('전체') || selectadStatus.includes(slot.status);

    return matchBudget && matchStatus;
  }); // API에서 받아온 데이터를 그대로 사용

  const pageCount = Math.ceil(filterSlots.length / itemsPerPage);
  const current = page * itemsPerPage;
  const currentPageSlots = filterSlots.slice(current, current + itemsPerPage);

  const handlePageChange = (e) => {
    setPage(e.selected);
  };

  // 광고자리 클릭 시 Adinfo로 이동
  const handleSlotClick = (id) => {
    navigate(`/adinfo/${id}`);
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
          {/* 기간 선택 UI 제거 */}
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
            <Column>주소</Column>
            <Column>입찰 상태</Column>
            <Column>평균 낙찰가</Column>
          </ListHeader>
          {currentPageSlots.map((slot) => (
            <List key={slot.id}>
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
              </Column>
              <Column>{slot.address || '-'}</Column>
              <Column>
                {/* 입찰 상태 라벨 스타일 통일 */}
                <span
                  className={
                    slot.status.includes('입찰 전')
                      ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700'
                      : slot.status.includes('입찰 진행중')
                      ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'
                      : slot.status.includes('광고 게재중')
                      ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700'
                      : 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-500'
                  }
                  style={{ minWidth: 80, textAlign: 'center' }}
                >
                  {slot.status}
                </span>
              </Column>
              <Column>{slot.avgPrice}</Column>
            </List>
          ))}
          {pageCount > 1 && (
            <ReactPaginate
              pageCount={pageCount}
              previousLabel={'<'}
              nextLabel={'>'}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          )}
        </Container>
      </Wrapper>
    </>
  );
};
export default Mainpage;
