import { useState, useCallback } from 'react';

/**
 * useVocabTooltip - 专门用于控制悬浮弹窗状态与鼠标追随计算的 Hook
 * 避免每个页面手动管理 x/y 坐标状态。
 */
export const useVocabTooltip = () => {
  const [activeVocab, setActiveVocab] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const handleVocabMouseEnter = useCallback((vocab, e) => {
    setActiveVocab(vocab);
    setPopupPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleVocabMouseMove = useCallback((e) => {
    // 只有在弹窗激活状态下才跟随鼠标更新坐标
    if (activeVocab) {
      setPopupPos({ x: e.clientX, y: e.clientY });
    }
  }, [activeVocab]);

  const handleVocabMouseLeave = useCallback(() => {
    setActiveVocab(null);
  }, []);

  return {
    activeVocab,
    popupPos,
    tooltipHandlers: {
      onMouseEnter: handleVocabMouseEnter,
      onMouseMove: handleVocabMouseMove,
      onMouseLeave: handleVocabMouseLeave
    }
  };
};
