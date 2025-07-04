import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import '../App.css';
import { getMyAdSlots } from '../api/getMyAdSlots';
import ReactPaginate from 'react-paginate';
import { AuthContext } from '../providers/AuthContext';
import more_icon from '../assets/icon-dropdown.png';
import { startBidForAdSlot } from '../api/startBidForAdSlot';

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

// 광고자리 상태 enum 라벨 매핑 함수
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
// 광고자리 상태별 스타일 클래스
const getAdSlotStatusClass = (status) => {
  switch (status) {
    case 0:
      return 'status-before'; // 입찰 전
    case 1:
      return 'status-bidding'; // 입찰 진행중
    case 2:
      return 'status-active'; // 광고 게재중
    default:
      return '';
  }
};

function MyslotsMedia() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const [slotList, setSlotList] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    activeCount: 0,
    totalTraffic: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user && user.role !== 'ADMIN') {
      navigate('/myads');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSlots = async () => {
      console.log('AuthContext user:', user); // user 객체 구조 확인
      if (!user?.userId && !user?.id) return;
      setLoading(true);
      try {
        const res = await getMyAdSlots(user.userId || user.id);
        console.log('getMyAdSlots response:', res); // API 응답 전체 확인
        // 응답 구조에 맞게 데이터 매핑
        if (res.success) {
          const slots = (res.data.adSlots || []).map((slot, idx) => ({
            id: slot.adSlotId ?? slot.adSlotId ?? `slot${idx}`,
            name: slot.adSlotName || '-',
            imageUrl: slot.imageUrl || '',
            // 상태: bidStatus가 null이면 '진행중', 아니면 '게재중지'로 가정
            status:
              typeof slot.adSlotStatus === 'number' ? slot.adSlotStatus : 0,
            avgTraffic: slot.viewCount ?? 0,
            avgCompetition:
              typeof slot.competition === 'number'
                ? `${slot.competition}`
                : slot.competition || '-',
            monthlyRevenue: slot.bid ?? 0,
          }));
          setSlotList(slots);
          setStats({
            totalCount: res.data.totalAdSlotCount ?? slots.length,
            activeCount: slots.filter((s) => s.status === '진행중').length,
            totalTraffic:
              res.data.totalViewCount ??
              slots.reduce((sum, s) => sum + (s.avgTraffic || 0), 0),
            totalRevenue:
              res.data.totalBidAmount ??
              slots.reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0),
          });
        }
      } catch {
        // 에러 처리 필요시 추가
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [user]);

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
              {stats.activeCount}
              <Textdetail>&nbsp; / {stats.totalCount}</Textdetail>
            </Text>
          </Container1>
          <Container1>
            <Title>총 통행량</Title>
            <Text>{stats.totalTraffic?.toLocaleString() || '-'}</Text>
          </Container1>
          <Container1>
            <Title>총 매출</Title>
            <Text>{stats.totalRevenue?.toLocaleString() + '원' || '-'}</Text>
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
            <Column></Column> {/* 더보기 아이콘용 빈 컬럼 */}
          </ListHeader>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              로딩 중...
            </div>
          ) : currentPageList.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              광고자리가 없습니다.
            </div>
          ) : (
            currentPageList.map((slot, idx) => (
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
                <Column>
                  <StatusLabel
                    className={`status-label ${getAdSlotStatusClass(slot.status)}`}
                  >
                    {getAdSlotStatusLabel(slot.status)}
                  </StatusLabel>
                </Column>
                <Column>{slot.avgTraffic?.toLocaleString() || '-'}</Column>
                <Column>{slot.avgCompetition || '-'}</Column>
                <Column>
                  {slot.monthlyRevenue?.toLocaleString() + '원' || '-'}
                </Column>
                <Column
                  style={{
                    position: 'relative',
                    width: 40,
                    textAlign: 'center',
                  }}
                >
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                    tabIndex={0}
                  >
                    <img
                      src={more_icon}
                      alt="더보기"
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                  {menuOpen === idx && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                        onClick={async () => {
                          const res = await startBidForAdSlot(slot.id);
                          if (res && res.success) {
                            alert('입찰이 시작되었습니다!');
                          } else {
                            alert(res?.error || '입찰 시작에 실패했습니다.');
                          }
                          setMenuOpen(null);
                        }}
                      >
                        입찰 시작
                      </button>
                    </div>
                  )}
                </Column>
              </List>
            ))
          )}
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
        <Container>
          <Title>최근 활동</Title>
        </Container>
      </Wrapper>
    </>
  );
}

export default MyslotsMedia;
