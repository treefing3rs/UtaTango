import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useVocabTooltip - 专门用于控制悬浮弹窗状态与鼠标追随计算的 Hook
 * 支持移动端 3 秒自动淡出、视口边缘防溢出磁吸、滚动差值补偿与高阶防抖优化。
 */
export const useVocabTooltip = () => {
  const [activeVocab, setActiveVocab] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleVocabMouseEnter = useCallback((vocab, e) => {
    setActiveVocab(vocab);
    
    // 基础视口坐标
    let posX = e.clientX;
    let posY = e.clientY;

    const isMobile = window.innerWidth <= 768;
    const wrapper = e.currentTarget.closest('.shikaki-wrapper');
    const isShikaki = !!wrapper;

    // 智能获取对应皮肤的弹窗宽度 (Shikaki 移动端 220px/PC 260px; Dakara 移动端 240px/PC 280px)
    const tooltipWidth = isMobile 
      ? (isShikaki ? 220 : 240) 
      : (isShikaki ? 260 : 280);
    const safeMargin = 16; // 16px 黄金安全呼吸间距

    // 1. 补偿纵向页面滚动 (适用于普通纵向滚动页面，如 Dakara)
    posY += window.scrollY;
    posX += window.scrollX;

    // 2. 补偿横向容器滚动 (针对第一首横卷歌词，如 Shikaki)
    if (wrapper) {
      posX += wrapper.scrollLeft;
    }

    // 3. 【核心物理壁障】：计算当前滚动视口下的 X 轴左右防撞物理区间
    const screenWidth = window.innerWidth;
    let minX = safeMargin;
    let maxX = screenWidth - tooltipWidth - safeMargin;

    if (wrapper) {
      // 如果在横向滚动容器里，边界坐标需要同步平移 scrollLeft 差值
      minX += wrapper.scrollLeft;
      maxX += wrapper.scrollLeft;
    } else {
      // 纵向滚动页面平移 window.scrollX 差值
      minX += window.scrollX;
      maxX += window.scrollX;
    }

    // 将 X 坐标牢牢锁死在安全可视范围内
    posX = Math.max(minX, Math.min(maxX, posX));

    setPopupPos({ x: posX, y: posY });

    // 智能检测是否为移动端环境 (宽度 <= 768px)
    if (isMobile) {
      clearTimer(); // 清除上一次的计时器，完美防抖
      timerRef.current = setTimeout(() => {
        setActiveVocab(null);
      }, 3000); // 爽快的 3 秒自动淡出！
    }
  }, [clearTimer]);

  const handleVocabMouseMove = useCallback((e) => {
    // 只有在非移动端且弹窗激活状态下才跟随鼠标更新坐标，手机端保持定位
    const isMobile = window.innerWidth <= 768;
    if (activeVocab && !isMobile) {
      let posX = e.clientX + window.scrollX;
      let posY = e.clientY + window.scrollY;

      const wrapper = e.currentTarget.closest('.shikaki-wrapper');
      const isShikaki = !!wrapper;
      
      const tooltipWidth = isShikaki ? 260 : 280;
      const safeMargin = 16;

      if (wrapper) {
        posX += wrapper.scrollLeft;
      }
      
      // PC 端鼠标悬悬浮移动时也进行防溢出锁定
      const screenWidth = window.innerWidth;
      let minX = safeMargin + (wrapper ? wrapper.scrollLeft : window.scrollX);
      let maxX = screenWidth - tooltipWidth - safeMargin + (wrapper ? wrapper.scrollLeft : window.scrollX);
      posX = Math.max(minX, Math.min(maxX, posX));

      setPopupPos({ x: posX, y: posY });
    }
  }, [activeVocab]);

  const handleVocabMouseLeave = useCallback(() => {
    // 移动端忽略移出事件，交给 3 秒定时器；电脑端保持移开立即关闭
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      setActiveVocab(null);
    }
  }, []);

  // 组件卸载时安全清理定时器，防内存泄漏
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

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


