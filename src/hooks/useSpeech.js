import { useCallback } from 'react';

/**
 * useSpeech - 全局原生语音引擎 Hook
 * 剥离底层 Web Speech API，使得任何组件只需调用 speakText 即可让浏览器发音。
 */
export const useSpeech = (lang = 'ja-JP', defaultRate = 0.9, defaultPitch = 1) => {
  const speakText = useCallback((text, e = null) => {
    if (e) e.stopPropagation();
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = defaultRate;
    utterance.pitch = defaultPitch;

    // 尝试获取高质量的特定语言声音
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => v.lang === lang || v.lang.includes(lang.split('-')[0]));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, [lang, defaultRate, defaultPitch]);

  return { speakText };
};
