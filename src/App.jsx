import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdServingPage from './pages/Adserving/AdServingPage';
import AdBidPage from './pages/AdBid/AdBidPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ad-serving" element={<AdServingPage />} />
        <Route path="/ad-bid" element={<AdBidPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
