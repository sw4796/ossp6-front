import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
// import Header from './components/Header'
import AdBidPage from './pages/AdBidPage';
import Mainpage from './pages/Mainpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Local from './pages/Local';
import AdPost from './pages/AdPost';
import Bidding from './pages/Bidding';
import AdServingPage from './pages/AdServingPage';
import Adinfo from './pages/Adinfo';
import AdRegistration from './pages/AdRegistration';
import AdSlotRegistration from './pages/AdSlotRegistration';
import { AuthProvider } from './providers/AuthProvider';
import MyadsAdvertiser from './pages/MyadsAdvertiser';
import MyslotsMedia from './pages/MyslotsMedia';
import SlotServingPage from './pages/SlotServingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/ad/:adName" element={<AdPost />} />
          <Route path="/ad/:adName/bidding" element={<Bidding />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/myads" element={<MyadsAdvertiser />} />
          <Route path="/myslots" element={<MyslotsMedia />} />
          <Route path="/Local" element={<Local />} />
          <Route path="/ad-serving/:adId" element={<AdServingPage />} />
          <Route path="/ad-bid/:adslotId" element={<AdBidPage />} />
          <Route path="/adinfo/:adslotid" element={<Adinfo />} />
          <Route path="/ad-registration" element={<AdRegistration />} />
          <Route
            path="/ad-slot-registration"
            element={<AdSlotRegistration />}
          />
          <Route path="/slot-serving/:slotId" element={<SlotServingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
