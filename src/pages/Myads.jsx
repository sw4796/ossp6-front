import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import '../App.css';
import ads from '../data/ads';
import adslots from '../data/adslots';
import ReactPaginate from 'react-paginate';
// 유저 context import
import { AuthContext } from '../providers/AuthProvider';
import myBidData from '../data/bid';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

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
  font-weight: 500; //폰트 두께
  white-space: nowrap;
  margin-top: 0px; //공간 여백
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

function Myads() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 내 광고만 필터링 (user.id 기준)
  const myAdsList = ads.filter((ad) => ad.ownerId === user?.id);

  const handlePageChange = (page) => {
    setPage(page.selected);
  };
  const pageCount = Math.ceil(myAdsList.length / itemsPerPage);
  const current = page * itemsPerPage;
  const currentPageAds = myAdsList.slice(current, current + itemsPerPage);

  // 내 광고의 입찰/낙찰 데이터
  const activeAd = myAdsList.filter((ad) => ad.status === '게재중').length;
  const totalAd = myAdsList.length;
  const totalPrice = myAdsList.reduce((sum, ad) => sum + (ad.price || 0), 0);
  const totalTraffic = myAdsList.reduce(
    (sum, ad) => sum + (ad.traffic || 0),
    0
  );

  // 광고 클릭 시 해당 광고의 입찰/낙찰 데이터 페이지로 이동
  const handleAdClick = (adId) => {
    // AdServingPage로 이동, 쿼리로 adId 전달
    navigate(`/ad-serving?adId=${adId}`);
  };

  return (
    <>
      <Header />
      <Wrapper>
        <RowWrapper>
          <Container1>
            <Title>활성 광고 수</Title>
            <Text>
              {activeAd}
              <Textdetail>&nbsp; / {totalAd}</Textdetail>
            </Text>
          </Container1>
          <Container1>
            <Title>총 예상 통행량</Title>
            <Text>{totalTraffic?.toLocaleString() || '-'}</Text>
          </Container1>
          <Container1>
            <Title>총 비용</Title>
            <Text>{totalPrice?.toLocaleString() + '원' || '-'}</Text>
          </Container1>
        </RowWrapper>
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
              <Column>
                <span
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleAdClick(ad.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {ad.name || '-'}
                </span>
                {/* 날짜 제거 */}
              </Column>
              <Column>
                <span
                  className={`status-label ${
                    ad.status === '입찰중'
                      ? 'status-bidding'
                      : ad.status === '입찰완료'
                        ? 'status-done'
                        : ad.status === '게재중'
                          ? 'status-active'
                          : ''
                  }`}
                >
                  {ad.status}
                </span>
              </Column>
              <Column>{ad.traffic?.toLocaleString() || '-'}</Column>
              <Column>{ad.score ?? '-'}</Column>
              <Column>{ad.price?.toLocaleString() + '원' || '-'}</Column>
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

export default Myads;
