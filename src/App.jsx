import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AdBidPage from './pages/AdBid/AdBidPage';
import Mainpage from './pages/Mainpage';
import Signup from './pages/Signup';
import SignupForm from './pages/SignupForm';
import Myads from './pages/Myads';
import Local from './pages/Local';
import AdPost from './pages/AdPost';
import Bidding from './pages/Bidding';
import AdServingPage from './pages/AdServingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/ad/:adName" element={<AdPost />} />
        <Route path="/ad/:adName/bidding" element={<Bidding />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/SignupForm" element={<SignupForm />} />
        <Route path="/Myads" element={<Myads />} />
        <Route path="/Local" element={<Local />} />
        <Route path="/ad-serving" element={<AdServingPage />} />
        <Route path="/ad-bid" element={<AdBidPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
