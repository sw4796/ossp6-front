import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import '../App.css';
import adslots from '../data/adslots';
import ReactPaginate from 'react-paginate';
import { AuthContext } from '../providers/AuthContext';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;
// ...기존 스타일 컴포넌트 그대로 복사...
const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 60%;
  gap: 20px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px #ddd;
`;
const Container1 = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
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
  font-weight: 500;
  white-space: nowrap;
  margin-top: 0px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  align-items: center;
  letter-spacing: 0px;
  color: #000000;
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

// 게재중지 상태 스타일 추가
const StatusLabel = styled.span`
  white-space: nowrap;
  display: inline-block;
  box-sizing: border-box;
  &.status-active {
    /* 진행중: 기본 스타일 */
  }
  &.status-stop {
    color: #991b1b !important;
    background-color: #fee2e2;
    border-radius: 8px;
    padding: 4px 12px;
    font-weight: 600;
    min-width: 0;
    max-width: 100%;
    overflow: visible;
  }
`;
const Column = styled.div`
  flex: 2;
  text-align: center;
  font-weight: 500;
  &:first-child {
    text-align: left;
    flex: 4;
  }
`;
const Text = styled.div`
  display: flex;
  font-size: 28px;
  white-space: nowrap;
  color: black;
  font-weight: 600;
`;
const Textdetail = styled.div`
  display: flex;
  font-size: 25px;
  white-space: nowrap;
  color: gray;
  font-weight: 400;
`;

function MyslotsMedia() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user && user.role !== 'media') {
      navigate('/myads');
    }
  }, [user, navigate]);

  // 광고자리 데이터에 필요한 필드 추가 (mock 데이터)
  const slotList = adslots
    .filter((slot) => slot.ownerId === user?.id)
    .map((slot, idx) => ({
      ...slot,
      // 상태: 2가지(진행중, 게재중지)만 사용
      status: idx % 2 === 0 ? '진행중' : '게재중지',
      avgTraffic: 12000 + idx * 1000,
      avgCompetition: ['낮음', '보통', '높음', '매우 높음'][idx % 4],
      monthlyRevenue: 1000000 + idx * 200000,
    }));

  const totalCount = slotList.length;
  const activeCount = slotList.filter(
    (slot) => slot.status === '진행중'
  ).length;
  const totalTraffic = slotList.reduce(
    (sum, slot) => sum + (slot.avgTraffic || 0),
    0
  );
  const totalRevenue = slotList.reduce(
    (sum, slot) => sum + (slot.monthlyRevenue || 0),
    0
  );

  const handlePageChange = (page) => {
    setPage(page.selected);
  };
  const pageCount = Math.ceil(slotList.length / itemsPerPage);
  const current = page * itemsPerPage;
  const currentPageList = slotList.slice(current, current + itemsPerPage);

  const handleSlotClick = (slotId) => {
    navigate(`/slot-serving/${slotId}`);
  };

  return (
    <>
      <Header />
      <Wrapper>
        <RowWrapper>
          <Container1>
            <Title>활성 광고자리 수</Title>
            <Text>
              {activeCount}
              <Textdetail>&nbsp; / {totalCount}</Textdetail>
            </Text>
          </Container1>
          <Container1>
            <Title>총 통행량</Title>
            <Text>{totalTraffic?.toLocaleString() || '-'}</Text>
          </Container1>
          <Container1>
            <Title>총 매출</Title>
            <Text>{totalRevenue?.toLocaleString() + '원' || '-'}</Text>
          </Container1>
        </RowWrapper>
        <Container>
          <Title>광고자리 보기</Title>
          <ListHeader>
            <Column>광고자리명</Column>
            <Column>상태</Column>
            <Column>평균 통행량</Column>
            <Column>평균 경쟁률</Column>
            <Column>이번달 매출</Column>
          </ListHeader>
          {currentPageList.map((slot, index) => (
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
              </Column>
              <Column>
                <StatusLabel
                  className={`status-label ${
                    slot.status === '진행중'
                      ? 'status-active'
                      : slot.status === '게재중지'
                        ? 'status-stop'
                        : ''
                  }`}
                >
                  {slot.status}
                </StatusLabel>
              </Column>
              <Column>{slot.avgTraffic?.toLocaleString() || '-'}</Column>
              <Column>{slot.avgCompetition || '-'}</Column>
              <Column>
                {slot.monthlyRevenue?.toLocaleString() + '원' || '-'}
              </Column>
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
        <Container>
          <Title>최근 활동</Title>
        </Container>
      </Wrapper>
    </>
  );
}

export default MyslotsMedia;
