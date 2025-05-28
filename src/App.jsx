import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdServingPage from './pages/Adserving/AdServingPage';
import AdBidPage from './pages/AdBid/AdbidPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ad-serving" element={<AdServingPage />} />
        <Route path="/ad-bid" element={<AdBidPage />} />
        {/* ...다른 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
