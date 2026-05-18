import React from 'react';

/**
 * VocabTooltip - 全局通用悬浮单词释义弹窗 (Headless 架构)
 * 仅负责渲染内容架构和相对鼠标的坐标定位，视觉表现 (皮肤) 完全由传入的 className 决定。
 */
const VocabTooltip = ({ 
  vocab, 
  position, 
  containerClassName = "vocab-tooltip", // 提供皮肤 className
  bgClassName = "", // 背景特俗效果层的 className
  hintText = "💡 点击单词聆听原声朗读"
}) => {
  if (!vocab) return null;

  return (
    <div className={containerClassName} style={{ top: position.y, left: position.x }}>
      {bgClassName && <div className={bgClassName}></div>}
      <h3>
        {vocab.text} <span className="popup-ruby">{vocab.r}</span>
      </h3>
      <p>{vocab.meaning}</p>
      {hintText && <div className="popup-hint">{hintText}</div>}
    </div>
  );
};

export default VocabTooltip;
