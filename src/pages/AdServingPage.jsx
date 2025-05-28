import InfoBox from '../components/InfoBox';
import AdServingTableHeader from '../components/AdServingTableHeader';
import AdServingTableRow from '../components/AdServingTableRow';
import { adServingTableData } from '../data/adServingTableData';
import '../styles/AdServingPage.css';
import filter_icon from '../assets/icon-filter.png';
import dropdown_icon from '../assets/icon-dropdown.png';
import left_arrow from '../assets/left-arrow.png';
import right_arrow from '../assets/right-arrow.png';

function AdServingPage() {
    const infoBoxData = [
      {
        title: '총 노출수',
        maincontent: '25,840',
        subcontent: '전주 대비 12% 증가',
        w: 260,
        h: 100,
      },
      // 필요한 만큼 객체 추가!
      {
        title: '클릭수',
        maincontent: '5,201',
        subcontent: '전주 대비 7% 증가',
        w: 260,
        h: 100,
      },
      {
        title: 'CTR',
        maincontent: '20.1%',
        subcontent: '광고 클릭률',
        w: 260,
        h: 100,
      },
      {
        title: '광고수',
        maincontent: '12',
        subcontent: '집행 중 광고',
        w: 260,
        h: 100,
      },
    ];
    return (
      <div className="body">
        <div className="summary">
          <div className="info-title">
            <h1>광고 자리 관리</h1>
            <p>효과적인 광고 위치 관리와 성과를 한눈에 확인하세요</p>
          </div>
          <div className="info-boxlist">
            {infoBoxData.map((item, idx) => (
              <InfoBox
                key={idx}
                title={item.title}
                maincontent={item.maincontent}
                subcontent={item.subcontent}
                w={item.w}
                h={item.h}
              />
            ))}
          </div>
        </div>
        <main>
          <h2>입찰 광고 보기</h2>
          <div className="adList">
            <div className="list-header">
              <button className="filter-button">
                <div>
                  <img src={filter_icon} alt="img" />
                </div>
                <span>광고 자리 필터</span>
                <div>
                  <img src={dropdown_icon} alt="img" />
                </div>
              </button>
            </div>
            <div className="table">
              <AdServingTableHeader />
              <div>
                {adServingTableData.map((row, idx) => (
                  <AdServingTableRow key={idx} row={row} />
                ))}
              </div>
            </div>
            <div className="list-footer">
              <div className="page-info">
                <span>1/3 페이지</span>
                <div>
                  <button>
                    <div>
                      <img src={left_arrow} alt="img" />
                    </div>
                  </button>
                  <button>
                    <div>
                      <img src={right_arrow} alt="img" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default AdServingPage;
  