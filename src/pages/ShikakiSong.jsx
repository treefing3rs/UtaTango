import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shikaki.css';
import { useSpeech } from '../hooks/useSpeech';
import { useVocabTooltip } from '../hooks/useVocabTooltip';
import VocabTooltip from '../components/VocabTooltip';
import InteractiveRuby from '../components/InteractiveRuby';

const fullLyricsData = [
  { id: "l1", ja: "最低限の生活で小さな部屋の六畳で", zh: "在这六畳大的狭小房间  过着最底线的生活", ruby: [{text: "最低限"}, {text: "の"}, {text: "生活"}, {text: "で"}, {text: "小"}, {text: "さな"}, {text: "部屋"}, {text: "の"}, {text: "六畳", r: "ろくじょう", type: "vocab", meaning: "六畳 (名词): 六叠榻榻米大小"}, {text: "で"}] },
  { id: "l2", ja: "君と暮らせれば良かった それだけ考えていた", zh: "要是能与你一同生活该有多好 我就只是想着这样的事", ruby: [{text: "君と"}, {text: "暮らせれば", r: "くらせれば", type: "vocab", meaning: "暮らす (动词): 生活、度日"}, {text: "良かった それだけ考えていた"}] },
  { id: "l3", ja: "幸せの色は準透明 なら見えない方が良かった", zh: "幸福的颜色是准透明 这样的话看不见的话该有多好", ruby: [{text: "幸せの色は"}, {text: "準透明", r: "じゅんとうめい", type: "vocab", meaning: "準透明 (名词): 半透明的"}, {text: " なら見えない方が良かった"}] },
  { id: "l4", ja: "何も出来ないのに今日が終わる", zh: "明明还什么都没干今天又结束了", ruby: [{text: "何も出来ないのに今日が"}, {text: "終わる", r: "おわる"}] },
  { id: "l5", ja: "最低限の生活で小さな部屋の六畳で", zh: "在这六畳大的狭小房间  过着最底线的生活", ruby: [{text: "最低限の生活で小さな部屋の六畳で"}] },
  { id: "l6", ja: "天井を眺める毎日 何かを考えていた", zh: "就只是每日望着这片天花板 呆呆地想着某些事情", ruby: [{text: "天井", r: "てんじょう", type: "vocab", meaning: "天井 (名词): 天花板"}, {text: "を"}, {text: "眺める", r: "ながめる"}, {text: "毎日 何かを考えていた"}] },
  { id: "l7", ja: "幸せの価値は60000円", zh: "幸福的价值是60000円", ruby: [{text: "幸せの"}, {text: "価値", r: "かち", type: "vocab", meaning: "価値 (名词): 价值"}, {text: "は60000円"}] },
  { id: "l8", ja: "家賃が引かれて4000円", zh: "去除房租就剩下4000円", ruby: [{text: "家賃", r: "やちん", type: "vocab", meaning: "家賃 (名词): 房租"}, {text: "が引かれて4000円"}] },
  { id: "l9", ja: "ぼやけた頭で想い出を漁る", zh: "在乱糟糟一片的脑海中捕捉着回忆", ruby: [{text: "ぼやけた頭で"}, {text: "想い出", r: "おもいで"}, {text: "を"}, {text: "漁る", r: "あさる", type: "vocab", meaning: "漁る (动词): 翻找、搜寻"}] },
  { id: "l10", ja: "冷めた目で愛を語るようになっていた", zh: "冷却的眼神变得仿佛像是要述说爱语一般", ruby: [{text: "冷めた", r: "さめた", type: "vocab", meaning: "冷める (动词): 冷却、冷淡"}, {text: "目で愛を語るようになっていた"}] },
  { id: "l11", ja: "冷めたコーヒーも相変わらずそうなんだ", zh: "冷却的咖啡也还是如往日依旧", ruby: [{text: "冷めたコーヒーも相変わらずそうなんだ"}] },
  { id: "l12", ja: "嫌いだ", zh: "好讨厌啊", ruby: [{text: "嫌い", r: "きらい"}, {text: "だ"}] },
  { id: "l13", ja: "わかんないよ わかんないよ", zh: "搞不懂啊 搞不懂啊", ruby: [{text: "わかんないよ わかんないよ"}] },
  { id: "l14", ja: "想い出になる 君が邪魔になっていく", zh: "一切成为回忆 而你成为障碍", ruby: [{text: "想い出になる 君が"}, {text: "邪魔", r: "じゃま", type: "vocab", meaning: "邪魔 (名词): 妨碍、累赘"}, {text: "になっていく"}] },
  { id: "l15", ja: "わかんないよ わかんないよ", zh: "搞不懂啊 搞不懂啊", ruby: [{text: "わかんないよ わかんないよ"}] },
  { id: "l16", ja: "上手な歩き方も", zh: "继续前进的方法也好", ruby: [{text: "上手な歩き方も"}] },
  { id: "l17", ja: "さよならの言い方も", zh: "说出再见的方法也好", ruby: [{text: "さよならの言い方も"}] },
  { id: "l18", ja: "最小限の音量で 少し大きくなった部屋で", zh: "在稍稍变大了一点的房间 用最小量的音量", ruby: [{text: "最小限の音量で 少し大きくなった部屋で"}] },
  { id: "l19", ja: "止まったガスも思い出もシャワーの冷たさも書き殴った", zh: "将终止的暖气、糟乱的回忆、冰冷的水浴 这些统统乱写一气", ruby: [{text: "止まったガスも思い出もシャワーの冷たさも"}, {text: "書き殴った", r: "かきなぐった", type: "vocab", meaning: "書き殴る (动词): 乱涂、乱写一气"}] },
  { id: "l20", ja: "寿命を売るなら残り二年", zh: "如果是在贩卖寿命的话那还剩下两年", ruby: [{text: "寿命", r: "じゅみょう", type: "vocab", meaning: "寿命 (名词): 生命、寿命"}, {text: "を売るなら残り二年"}] },
  { id: "l21", ja: "それだけ残してあの街へ", zh: "就只剩下这点了啊 那就去到那条街道", ruby: [{text: "それだけ残してあの街へ"}] },
  { id: "l22", ja: "余った寿命で思い出を漁る", zh: "用剩余的寿命去搜寻那些回忆", ruby: [{text: "余った寿命で思い出を漁る"}] },
  { id: "l23", ja: "晴れも夜祭りも関町の街灯も", zh: "晴天也好、夜晚的祭典也好、或是关町的路灯也好", ruby: [{text: "晴れも夜祭りも関町の街灯も"}] },
  { id: "l24", ja: "雲も逃げ水も斜に構えた歌詞観も", zh: "云朵也好、海市蜃楼也好、或是歌词中讽刺性的观念也好", ruby: [{text: "雲も逃げ水も斜に構えた歌詞観も"}] },
  { id: "l25", ja: "詭弁だ", zh: "都是无理狡辩啊", ruby: [{text: "詭弁", r: "きべん", type: "vocab", meaning: "詭弁 (名词): 诡辩"}, {text: "だ"}] },
  { id: "l26", ja: "わかんないよ わかんないよ", zh: "搞不懂啊 搞不懂啊", ruby: [{text: "わかんないよ わかんないよ"}] },
  { id: "l27", ja: "想い出になる 君が詩に成っていく", zh: "一切成为回忆 而你化作诗行", ruby: [{text: "想い出になる 君が詩に成っていく"}] },
  { id: "l28", ja: "わかんないよ、忘れられる方法も", zh: "搞不懂啊 忘却一切的方法也好", ruby: [{text: "わかんないよ、忘れられる方法も"}] },
  { id: "l29", ja: "これからの使い方も", zh: "今后度日的方法也好", ruby: [{text: "これからの使い方も"}] },
  { id: "l30", ja: "冷めた目の中で君の詩を書いていた", zh: "在冷却掉的眼神里书写着你的诗行", ruby: [{text: "冷めた目の中で君の詩を書いていた"}] },
  { id: "l31", ja: "僕のこの日々は君の為の人生だ", zh: "我这些日子都是为你而活的人生啊", ruby: [{text: "僕のこの日々は君の為の人生だ"}] },
  { id: "l32", ja: "夢も儚さも君の口も目もその指先も忘れながら", zh: "梦想也好飘渺也好 你的嘴也好眼也好指尖也好 统统随着这首诗一并忘却", ruby: [{text: "夢も"}, {text: "儚さ", r: "はかなさ", type: "vocab", meaning: "儚い (形容词): 虚幻的、无常的"}, {text: "も君の口も目もその指先も忘れながら"}] },
  { id: "l33", ja: "ほら、そろそろ詩も終わる時間だ", zh: "啊啊 差不多也到了这首诗该结束的时间了", ruby: [{text: "ほら、そろそろ詩も終わる時間だ"}] },
  { id: "l34", ja: "やっと君の番だからさ", zh: "终于轮到你了啊", ruby: [{text: "やっと君の番だからさ"}] },
  { id: "l35", ja: "想い出になれ 君よ詩に成って往け", zh: "都给我封做回想 而你啊就化为诗行", ruby: [{text: "想い出になれ 君よ詩に成って往け"}] },
  { id: "l36", ja: "人は歩けるんだとか", zh: "人总能前进什么的也好", ruby: [{text: "人は歩けるんだとか"}] },
  { id: "l37", ja: "それが当たり前だとかわかんないさ", zh: "一切都如此理所当然也好 搞不懂的啦", ruby: [{text: "それが"}, {text: "当たり前", r: "あたりまえ", type: "vocab", meaning: "当たり前 (名词/形动): 理所当然"}, {text: "だとかわかんないさ"}] },
  { id: "l38", ja: "わかんないよ", zh: "搞不懂啊", ruby: [{text: "わかんないよ"}] }
];

const ShikakiSong = () => {
  const navigate = useNavigate();
  // 语速适中，仿佛一边思考一边落笔
  const { speakText } = useSpeech('ja-JP', 0.9, 1.0); 
  const { activeVocab, popupPos, tooltipHandlers } = useVocabTooltip();
  
  // 记录已被“落墨”填空的词汇
  const [filledWords, setFilledWords] = useState(new Set());
  const wrapperRef = useRef(null);

  // 核心：添加阻尼惯性平滑滚动 (Lerp Smooth Scroll)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let targetScroll = wrapper.scrollLeft;
    let currentScroll = wrapper.scrollLeft;
    let rafId = null;

    const smoothScroll = () => {
      currentScroll += (targetScroll - currentScroll) * 0.08; // 0.08 为阻尼系数，越小越滑，0.08 是黄金比例
      wrapper.scrollLeft = currentScroll;

      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        rafId = null;
      }
    };

    const handleWheelNative = (e) => {
      e.preventDefault(); // 禁用浏览器默认生硬滚动
      
      // 放大一点滚动步长，让滑动手感更轻盈
      targetScroll -= e.deltaY * 1.5; 
      
      // 边界限制：在 vertical-rl 竖排中，向左深处滚动是负值，最大也就是回到原点 0
      const minScroll = -(wrapper.scrollWidth - wrapper.clientWidth);
      const maxScroll = 0;
      targetScroll = Math.max(minScroll, Math.min(maxScroll, targetScroll));

      if (!rafId) {
        currentScroll = wrapper.scrollLeft; // 每次重新触发滚动时校准当前位置
        smoothScroll();
      }
    };

    // 必须用原生监听并设置 passive: false，因为 React 默认的 onWheel 无法 preventDefault
    wrapper.addEventListener('wheel', handleWheelNative, { passive: false });
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheelNative);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleFill = (word) => {
    if (word.type !== 'vocab') return;
    if (!filledWords.has(word.text)) {
      setFilledWords(prev => new Set(prev).add(word.text));
    }
  };

  return (
    <div 
      className="shikaki-wrapper" 
      ref={wrapperRef}
    >


      {/* 动态抽象 SVG 咖啡渍，替代具象背景图 */}
      <svg className="svg-coffee-stain stain-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.5,9.5 C68.5,-3.5 98.5,15.5 97.5,45.5 C96.5,75.5 73.5,96.5 45.5,95.5 C17.5,94.5 -3.5,69.5 2.5,41.5 C8.5,13.5 16.5,22.5 42.5,9.5 Z" />
      </svg>
      <svg className="svg-coffee-stain stain-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M51,10 C83,-5 105,30 92,60 C79,90 40,105 15,80 C-10,55 0,20 25,12 C35,8 40,15 51,10 Z" />
      </svg>

      <nav className="shikaki-nav">
        <button onClick={() => navigate('/album/dakara-boku-wa')} className="shikaki-back-btn">
          离开原稿纸
        </button>
      </nav>

      <main className="shikaki-content">
        <h1 className="shikaki-title">詩書きとコーヒー</h1>
        
        <div className="lyrics-flow">
          {fullLyricsData.map((line) => (
            <div key={line.id} className="shikaki-line">
              <div className="lyric-ja">
                {line.ruby.map((word, idx) => {
                  if (word.type === 'vocab') {
                    const isFilled = filledWords.has(word.text);
                    return (
                      <span 
                        key={idx} 
                        className={`blank-vocab ${isFilled ? 'filled' : ''}`}
                        onMouseEnter={(e) => {
                          handleFill(word);
                          tooltipHandlers.onMouseEnter(word, e);
                        }}
                        onMouseMove={(e) => {
                          if (isFilled) tooltipHandlers.onMouseMove(e);
                        }}
                        onMouseLeave={() => {
                          tooltipHandlers.onMouseLeave();
                        }}
                        onClick={(e) => {
                          if (isFilled) speakText(word.text, e);
                        }}
                      >
                        {isFilled ? <InteractiveRuby word={word} /> : '　'}
                      </span>
                    );
                  }
                  return <InteractiveRuby key={idx} word={word} />;
                })}
              </div>
              <div className="shikaki-zh">{line.zh}</div>
            </div>
          ))}
        </div>
      </main>

      {/* 稿纸批注条风格的弹窗 */}
      <VocabTooltip 
        vocab={activeVocab} 
        position={popupPos} 
        containerClassName="memo-popup"
        hintText="✏️ 补全了这句诗"
      />
    </div>
  );
};

export default ShikakiSong;
