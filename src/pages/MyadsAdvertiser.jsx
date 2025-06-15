import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, use } from 'react';
import Header from '../components/Header';
import '../App.css';
import ads from '../data/ads';
import ReactPaginate from 'react-paginate';
import { AuthContext } from '../providers/AuthContext';
import {getMyads} from '../api/getMyads';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9fafb;
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

function MyadsAdvertiser() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({
    totalAdCount: 0,
    completedBidCount: 0,
    totalViewCount: 0,
    totalBidMoney: 0,
  })

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user && user.role !== 'USER') {
      navigate('/myslots');
    }
  }, [user, navigate]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return '입찰중';
      case 1: return '입찰완료';
      case 2: return '게재중';
      default: return '-';
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      const res = await getMyads();
      if (res.success) {
        const mappedAds = res.data.adList.map((ad, index) => ({
        id: ad.adId ?? `ad${index}`, 
        name: ad.adName || '-',
        status: ad.bidStatus,  
        traffic: ad.viewCount ?? 0,
        score: ad.exposureScore ?? 0,
        price: ad.bid ?? 0,
        imageUrl: ad.adImageUrl || '',
      }));

      setAds(mappedAds);

      setStats({
        totalAdCount: res.data.totalAdCount,
        completedBidCount: res.data.completedBidCount,
        totalViewCount: res.data.totalViewCount,
        totalBidMoney: res.data.totalBidMoney,
      });
      }
    };
    fetchAds();
  }, []);

  const handlePageChange = ({selected}) => {
    setPage(selected);
  };
  const pageCount = Math.ceil(ads.length / itemsPerPage);
  const current = page * itemsPerPage;
  const currentPageList = ads.slice(current, current + itemsPerPage);

  const handleAdClick = (adId) => {
    navigate(`/ad-serving/${adId}`);
  };

  return (
    <>
      <Header />
      <Wrapper>
        <RowWrapper>
          <Container1>
            <Title>활성 광고 수</Title>
            <Text>
              {stats.completedBidCount}
              <Textdetail>&nbsp; / {stats.totalAdCount}</Textdetail>
            </Text>
          </Container1>
          <Container1>
            <Title>총 예상 통행량</Title>
            <Text>{stats.totalViewCount !== null ? stats.totalViewCount.toLocaleString() : '-'}</Text>
          </Container1>
          <Container1>
            <Title>총 비용</Title>
            <Text>{stats.totalBidMoney !== null ? stats.totalBidMoney.toLocaleString() + '원' : '-'}</Text>
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
          {currentPageList.map((ad) => (
            <List key={ad.id}>
              <Column>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <img 
                src = {ad.imageUrl}
                alt = {ad.name}
                style={{width: '35px', height: 'auto', borderRadius: '5px'}}
                />
                <span
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => ad.id && handleAdClick(ad.id)}
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
                </div>
              </Column>
              <Column>
                <span
                  className={`status-label ${
                    ad.status === 0
                      ? 'status-bidding'
                      : ad.status === 1
                        ? 'status-done'
                        : ad.status === 2
                          ? 'status-active'
                          : ''
                  }`}
                >
                  {getStatusLabel(ad.status)}
                </span>
              </Column>
              <Column>{ad.traffic != null ? ad.traffic.toLocaleString():'-'}</Column>
              <Column>{ad.score ?? '-'}</Column>
              <Column>{ad.price?.toLocaleString() + '원' || '-'}</Column>
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
        <Container>
          <Title>최근 활동</Title>
        </Container>
      </Wrapper>
    </>
  );
}

export default MyadsAdvertiser;
