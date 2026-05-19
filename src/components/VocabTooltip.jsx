import React, { useState, useEffect } from 'react';

/**
 * VocabTooltip - 全局通用悬浮单词释义弹窗 (时光留影 + 高性能渐变版)
 */
const VocabTooltip = ({ 
  vocab, 
  position, 
  containerClassName = "vocab-tooltip", // 提供皮肤 className
  bgClassName = "", // 背景特俗效果层的 className
  hintText = "💡 点击单词聆听原声朗读"
}) => {
  const [displayVocab, setDisplayVocab] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (vocab) {
      setDisplayVocab(vocab);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [vocab]);

  // 如果从来没有词被激活过，先不渲染任何东西
  if (!displayVocab) return null;

  return (
    <div 
      className={`${containerClassName} ${visible ? 'active' : ''}`} 
      style={{ 
        top: position.y, 
        left: position.x,
        pointerEvents: visible ? 'auto' : 'none' // 隐藏时禁用鼠标事件
      }}
    >
      {bgClassName && <div className={bgClassName}></div>}
      <h3>
        {displayVocab.text} <span className="popup-ruby">{displayVocab.r}</span>
      </h3>
      <p>{displayVocab.meaning}</p>
      {hintText && <div className="popup-hint">{hintText}</div>}
    </div>
  );
};

export default VocabTooltip;

