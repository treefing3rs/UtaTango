import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { albums } from '../songsConfig';
import '../styles/album.css';

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  
  const album = albums.find(a => a.id === albumId);
  
  if (!album) {
    return <div style={{ color: 'white', padding: '50px' }}>404 - 找不到该专辑信息。</div>;
  }

  // 每次进入专辑页，确保自动滚动回顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [albumId]);

  return (
    <div className="album-page-container">
      {/* 顶部导航 */}
      <nav className="album-nav">
        <button onClick={() => navigate('/')} className="back-to-home-btn">
          ← 返回大厅
        </button>
      </nav>

      <div className="album-content-wrapper">
        {/* 左侧：专辑海报展示与半露出的黑胶唱片特效 */}
        <div className="album-cover-section">
          <div className="album-cover-3d">
            <img src={album.coverImage} alt={album.title} className="cover-img" />
            <div className="vinyl-record-deco"></div>
          </div>
          <div className="album-meta">
            <h1>{album.title}</h1>
            <p className="artist">{album.artist}</p>
            <p className="release-year">RELEASE: {album.releaseYear}</p>
            <p className="vibe-desc">{album.vibe}</p>
          </div>
        </div>

        {/* 右侧：曲目列表复古面板 */}
        <div className="album-tracks-section">
          <h2 className="tracklist-title">TRACKLIST 收录曲目</h2>
          <div className="track-list">
            {album.songs.map((song, index) => (
              <div 
                key={song.id} 
                className="track-item"
                onClick={() => navigate(song.route)}
              >
                <div className="track-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="track-info">
                  <h3 className="track-title">{song.title}</h3>
                  <p className="track-vibe">{song.vibe}</p>
                </div>
                <div className="track-badges">
                  <span className="level-badge">{song.level}</span>
                  <span className="words-badge">{song.wordsCount} Words</span>
                </div>
                <div className="track-play-icon">▶</div>
              </div>
            ))}
            
            {/* 待解锁的占位 */}
            <div className="track-item locked">
              <div className="track-number">??</div>
              <div className="track-info">
                <h3 className="track-title">待添加的新曲目</h3>
                <p className="track-vibe">敬请期待导演的下一次即兴发挥</p>
              </div>
              <div className="track-play-icon">🔒</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
