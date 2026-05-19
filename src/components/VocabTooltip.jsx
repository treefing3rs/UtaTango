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

  // 始终渲染 outer div 以保证 DOM 稳定性与平滑的入场动画，始终使用 pointer-events: 'none' 防止悬浮窗遮挡鼠标导致触发 leave 从而一动即逝的 Bug
  return (
    <div 
      className={`${containerClassName} ${visible && displayVocab ? 'active' : ''}`} 
      style={{ 
        top: position.y, 
        left: position.x,
        pointerEvents: 'none' // 禁用鼠标交互以解决 PC 端一动即逝和静态固定的 Bug
      }}
    >
      {displayVocab && (
        <>
          {bgClassName && <div className={bgClassName}></div>}
          <h3>
            {displayVocab.text} <span className="popup-ruby">{displayVocab.r}</span>
          </h3>
          <p>{displayVocab.meaning}</p>
          {hintText && <div className="popup-hint">{hintText}</div>}
        </>
      )}
    </div>
  );
};

export default VocabTooltip;

