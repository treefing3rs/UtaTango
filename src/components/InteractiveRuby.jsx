import React from 'react';
import { useSpeech } from '../hooks/useSpeech';

/**
 * InteractiveRuby - 智能交互注音文本组件
 * 处理带有假名(Furigana) 的渲染逻辑，如果是核心单词还会自动绑定悬浮追踪事件及发音事件。
 */
const InteractiveRuby = ({ 
  word, 
  onMouseEnter, 
  onMouseMove, 
  onMouseLeave,
  onClick,
  className = ""
}) => {
  const { speakText } = useSpeech();

  if (!word) return null;

  // 如果不是被标记的核心词汇(vocab)，则只做最基础的渲染，没有复杂的阻尼跟随或发音特效
  if (word.type !== 'vocab') {
    return (
      <span className={className}>
        {word.r ? <ruby>{word.text}<rt>{word.r}</rt></ruby> : word.text}
      </span>
    );
  }

  // 核心词汇：无缝结合传入的坐标追踪事件和自带的原声发音
  return (
    <span className={className}>
      <ruby 
        onMouseEnter={(e) => onMouseEnter && onMouseEnter(word, e)}
        onMouseMove={(e) => onMouseMove && onMouseMove(e)}
        onMouseLeave={() => onMouseLeave && onMouseLeave()}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick(e);
          } else {
            speakText(word.text, e);
          }
        }}
      >
        {word.text}<rt>{word.r}</rt>
      </ruby>
    </span>
  );
};

export default InteractiveRuby;
