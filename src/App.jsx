import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

// 懒加载我们的每一集（单曲页面）保证页面切换极度丝滑
const AlbumPage = lazy(() => import('./pages/AlbumPage'));
const ShikakiSong = lazy(() => import('./pages/ShikakiSong'));
const DakaraSong = lazy(() => import('./pages/DakaraSong'));

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div style={{color:'var(--text-muted)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-jp)'}}>Now Loading...</div>}>

        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* 专辑展示层级 */}
          <Route path="/album/:albumId" element={<AlbumPage />} />
          {/* 每一集独立的沙盒实验页面 */}
          <Route path="/song/shikaki-to-coffee" element={<ShikakiSong />} />
          <Route path="/song/dakara-boku-wa" element={<DakaraSong />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
