import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdServingPage from './pages/Adserving/AdServingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ad-serving" element={<AdServingPage />} />
        {/* ...다른 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
