import React from 'react';
import { useNavigate } from 'react-router-dom';
import { albums } from '../songsConfig';
import '../styles/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* 顶部数据面板 */}
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>UtaTango <span>歌単語</span></h1>
          <p className="subtitle">Lyric-based Japanese Learning Anthology</p>
        </div>
        <div className="stats-panel">
          <div className="stat-box">
            <span className="stat-value">{albums.length}</span>
            <span className="stat-label">Albums</span>
          </div>
          <div className="stat-box highlight">
            <span className="stat-value">{albums.reduce((acc, album) => acc + album.songs.reduce((sum, song) => sum + song.wordsCount, 0), 0)}</span>
            <span className="stat-label">Words Collected</span>
          </div>
        </div>
      </header>

      {/* 画廊区域 */}
      <section className="gallery-section">
        <h2 className="section-title">Anthology Albums</h2>
        <div className="song-grid">
          {albums.map(album => (
            <div 
              key={album.id} 
              className="song-card"
              style={{ 
                background: album.coverImage ? `url(${album.coverImage}) center/cover no-repeat` : album.themeColor 
              }}
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="card-glass-overlay">
                <div className="card-top">
                  <span className="level-badge">{album.songs.length} Tracks</span>
                </div>
                
                {/* 悬浮弹出的复古黑胶装饰 */}
                <div className="vinyl-record">
                  <div className="vinyl-center"></div>
                </div>

                <div className="card-bottom">
                  <p className="song-artist">{album.artist}</p>
                  <h3 className="song-title">{album.title}</h3>
                  <p className="song-vibe">{album.vibe}</p>
                  <button className="play-btn">BROWSE ALBUM ▶</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 背景光晕装饰 */}
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
    </div>
  );
};

export default Homepage;
