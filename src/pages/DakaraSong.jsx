import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dakara.css';
import { useSpeech } from '../hooks/useSpeech';
import { useVocabTooltip } from '../hooks/useVocabTooltip';
import VocabTooltip from '../components/VocabTooltip';
import InteractiveRuby from '../components/InteractiveRuby';

// 歌词数据映射
const lyricsData = [
  { id: 1, ja: "考えたってわからないし", zh: "想过之后依然搞不懂", ruby: [{text: "考", r: "かんが"}, {text: "えたってわからないし"}] },
  { id: 2, ja: "青空の下、君を待った", zh: "在蔚蓝的天空下等待着你", ruby: [{text: "青空", r: "あおぞら"}, {text: "の"}, {text: "下", r: "した"}, {text: "、"}, {text: "君", r: "きみ"}, {text: "を"}, {text: "待", r: "ま"}, {text: "った"}] },
  { id: 3, ja: "風が吹いた正午、昼下がりを抜け出す想像", zh: "吹着风的正午 午后的思绪逐渐飘离", ruby: [{text: "風", r: "かぜ"}, {text: "が"}, {text: "吹", r: "ふ"}, {text: "いた"}, {text: "正午", r: "しょうご"}, {text: "、"}, {text: "昼下がり", r: "ひるさがり", type: "vocab", meaning: "昼下がり (名词): 刚过正午，下午刚开始的时段"}, {text: "を"}, {text: "抜", r: "ぬ"}, {text: "け"}, {text: "出", r: "だ"}, {text: "す"}, {text: "想像", r: "そうぞう"}] },
  { id: 4, ja: "ねぇ、これからどうなるんだろうね", zh: "呐，今后该如何是好呢", ruby: [{text: "ねぇ、これからどうなるんだろうね"}] },
  { id: 5, ja: "進め方教わらないんだよ", zh: "向前迈进的方法没有学过啊", ruby: [{text: "進", r: "すす"}, {text: "め"}, {text: "方", r: "かた"}, {text: "教", r: "おそ"}, {text: "わらないんだよ"}] },
  { id: 6, ja: "君の目を見た　何も言えず僕は歩いた", zh: "看着你的双眼 什么也没说的就走了", ruby: [{text: "君", r: "きみ"}, {text: "の"}, {text: "目", r: "め"}, {text: "を"}, {text: "見", r: "み"}, {text: "た　"}, {text: "何", r: "なに"}, {text: "も"}, {text: "言", r: "い"}, {text: "えず"}, {text: "僕", r: "ぼく"}, {text: "は"}, {text: "歩", r: "ある"}, {text: "いた"}] },
  { id: 7, ja: "考えたってわからないし", zh: "想过之后依然搞不懂", ruby: [{text: "考", r: "かんが"}, {text: "えたってわからないし"}] },
  { id: 8, ja: "青春なんてつまらないし", zh: "青春什麽的无聊透顶", ruby: [{text: "青春", r: "せいしゅん"}, {text: "なんてつまらないし"}] },
  { id: 9, ja: "辞めた筈のピアノ、机を弾く癖が抜けない", zh: "理当放弃了的钢琴 却改不掉弹奏桌面的习惯", ruby: [{text: "辞", r: "や"}, {text: "めた"}, {text: "筈", r: "はず"}, {text: "のピアノ、"}, {text: "机", r: "つくえ"}, {text: "を"}, {text: "弾", r: "ひ"}, {text: "く"}, {text: "癖", r: "くせ", type: "vocab", meaning: "癖 (名词): 习惯、怪癖、习性"}, {text: "が"}, {text: "抜", r: "ぬ"}, {text: "けない"}] },
  { id: 10, ja: "ねぇ、将来何してるだろうね", zh: "呐，将来要做什麽好呢", ruby: [{text: "ねぇ、"}, {text: "将来", r: "しょうらい"}, {text: "何", r: "なに"}, {text: "してるだろうね"}] },
  { id: 11, ja: "音楽はしてないといいね", zh: "要是不做音乐就好了", ruby: [{text: "音楽", r: "おんがく"}, {text: "はしてないといいね"}] },
  { id: 12, ja: "困らないでよ", zh: "不要让我困扰啊", ruby: [{text: "困", r: "こま"}, {text: "らないでよ"}] },
  { id: 13, ja: "心の中に一つ線を引いても", zh: "就算与我隔开", ruby: [{text: "心", r: "こころ"}, {text: "の"}, {text: "中", r: "なか"}, {text: "に"}, {text: "一", r: "ひと"}, {text: "つ"}, {text: "線", r: "せん"}, {text: "を"}, {text: "引", r: "ひ"}, {text: "いても"}] },
  { id: 14, ja: "どうしても消えなかった", zh: "它也依然不会消失", ruby: [{text: "どうしても"}, {text: "消", r: "き"}, {text: "えなかった"}] },
  { id: 15, ja: "今更なんだから", zh: "事到如今", ruby: [{text: "今更", r: "いまさら"}, {text: "なんだから"}] },
  { id: 16, ja: "なぁ、もう思い出すな", zh: "喂，别再回想了", ruby: [{text: "なぁ、もう"}, {text: "思", r: "おも"}, {text: "い"}, {text: "出", r: "だ"}, {text: "すな"}] },
  { id: 17, ja: "間違ってるんだよ", zh: "这样错了", ruby: [{text: "間違", r: "まちが"}, {text: "ってるんだよ"}] },
  { id: 18, ja: "わかってないよ、", zh: "根本不懂嘛", ruby: [{text: "わかってないよ、"}] },
  { id: 19, ja: "あんたら人間も", zh: "你们这些人", ruby: [{text: "あんたら"}, {text: "人間", r: "にんげん"}, {text: "も"}] },
  { id: 20, ja: "本当も愛も世界も苦しさも人生もどうでもいいよ", zh: "真相啊 爱啊 世界啊 痛苦啊 人生啊 怎麽样都好啦", ruby: [{text: "本当", r: "ほんとう"}, {text: "も"}, {text: "愛", r: "あい"}, {text: "も"}, {text: "世界", r: "せかい"}, {text: "も"}, {text: "苦", r: "くる"}, {text: "しさも"}, {text: "人生", r: "じんせい"}, {text: "もどうでもいいよ"}] },
  { id: 21, ja: "正しいかどうか知りたいのだって防衛本能だ", zh: "想知道是否正确只是防卫本能啊", ruby: [{text: "正", r: "ただ"}, {text: "しいかどうか"}, {text: "知", r: "し"}, {text: "りたいのだって"}, {text: "防衛本能", r: "ぼうえいほんのう", type: "vocab", meaning: "防衛本能 (名词): 面对心理或生理威胁时的防御机制"}, {text: "だ"}] },
  { id: 22, ja: "考えたんだ", zh: "思考过之后", ruby: [{text: "考", r: "かんが"}, {text: "えたんだ"}] },
  { id: 23, ja: "あんたのせいだ", zh: "都是你的错啊", ruby: [{text: "あんたのせいだ"}] },
  { id: 24, ja: "考えたってわからないが、", zh: "想过之后依然搞不懂", ruby: [{text: "考", r: "かんが"}, {text: "えたってわからないが、"}] },
  { id: 25, ja: "本当に年老いたくないんだ", zh: "真的是不想变老啊", ruby: [{text: "本当", r: "ほんとう"}, {text: "に"}, {text: "年老いたくない", r: "としおいたくない", type: "vocab", meaning: "年老いる (动词): 衰老，变老"}, {text: "んだ"}] },
  { id: 26, ja: "いつか死んだらって", zh: "只是想着什麽时候会死掉", ruby: [{text: "いつか"}, {text: "死", r: "し"}, {text: "んだらって"}] },
  { id: 27, ja: "思うだけで胸が空っぽになるんだ", zh: "心中就空了一块", ruby: [{text: "思", r: "おも"}, {text: "うだけで"}, {text: "胸", r: "むね"}, {text: "が"}, {text: "空っぽ", r: "からっぽ", type: "vocab", meaning: "空っぽ (名词/形动): 空无一物、空虚"}, {text: "になるんだ"}] },
  { id: 28, ja: "将来何してるだろうって", zh: "将来我会做什麽呢", ruby: [{text: "将来何", r: "しょうらいなに"}, {text: "してるだろうって"}] },
  { id: 29, ja: "大人になったらわかったよ", zh: "成为大人之后就会知道了吧", ruby: [{text: "大人", r: "おとな"}, {text: "になったらわかったよ"}] },
  { id: 30, ja: "何もしてないさ", zh: "什麽也没做啊", ruby: [{text: "何", r: "なに"}, {text: "もしてないさ"}] },
  { id: 31, ja: "幸せな顔した人が憎いのは", zh: "那些脸上洋溢着幸福的人们该如何停止厌恶他们呢", ruby: [{text: "幸", r: "しあわ"}, {text: "せな"}, {text: "顔", r: "かお"}, {text: "した"}, {text: "人", r: "ひと"}, {text: "が"}, {text: "憎い", r: "にくい", type: "vocab", meaning: "憎い (形容词): 可恨的、令人憎恶的"}, {text: "のは"}] },
  { id: 32, ja: "どう割り切ったらいいんだ", zh: "该如何停止厌恶他们呢", ruby: [{text: "どう"}, {text: "割り切ったら", r: "わりきったら", type: "vocab", meaning: "割り切る (动词): 想通、干脆地划分界限"}, {text: "いいんだ"}] },
  { id: 33, ja: "満たされない頭の奥の", zh: "空虚的脑中", ruby: [{text: "満", r: "み"}, {text: "たされない"}, {text: "頭", r: "あたま"}, {text: "の"}, {text: "奥", r: "おく"}, {text: "の"}] },
  { id: 34, ja: "化け物みたいな劣等感", zh: "充满怪物般的劣等感", ruby: [{text: "化", r: "ば"}, {text: "け"}, {text: "物", r: "もの"}, {text: "みたいな"}, {text: "劣等感", r: "れっとうかん", type: "vocab", meaning: "劣等感 (名词): 感觉自己不如别人的自卑心理"}] },
  { id: 35, ja: "間違ってないよ", zh: "没有错啊", ruby: [{text: "間違", r: "まちが"}, {text: "ってないよ"}] },
  { id: 36, ja: "なぁ、何だかんだあんたら人間だ", zh: "各式各样的人们", ruby: [{text: "なぁ、"}, {text: "何", r: "なん"}, {text: "だかんだあんたら"}, {text: "人間", r: "にんげん"}, {text: "だ"}] },
  { id: 37, ja: "愛も救いも優しさも根拠がないなんて", zh: "没有来由的爱人、帮助人、与温柔", ruby: [{text: "愛", r: "あい"}, {text: "も"}, {text: "救", r: "すく"}, {text: "いも"}, {text: "優", r: "やさ"}, {text: "しさも"}, {text: "根拠", r: "こんきょ", type: "vocab", meaning: "根拠 (名词): 事实的根据、基础"}, {text: "がないなんて"}] },
  { id: 38, ja: "気味が悪いよ", zh: "真是恶心啊", ruby: [{text: "気味が悪いよ", r: "きみがわるいよ", type: "vocab", meaning: "気味が悪い (惯用语): 令人毛骨悚然的、感觉恶心的"}] },
  { id: 39, ja: "ラブソングなんかが痛いのだって防衛本能だ", zh: "情歌之类感到痛心只是防卫本能啊", ruby: [{text: "ラブソングなんかが"}, {text: "痛", r: "いた"}, {text: "いのだって"}, {text: "防衛本能", r: "ぼうえいほんのう"}, {text: "だ"}] },
  { id: 40, ja: "どうでもいいか", zh: "怎样都好", ruby: [{text: "どうでもいいか"}] },
  { id: 41, ja: "あんたのせいだ", zh: "都是你的错", ruby: [{text: "あんたのせいだ"}] },
  { id: 42, ja: "考えたってわからないし", zh: "想过之后依然搞不懂", ruby: [{text: "考", r: "かんが"}, {text: "えたってわからないし"}] },
  { id: 43, ja: "生きてるだけでも苦しいし", zh: "光是活着就很痛苦了", ruby: [{text: "生", r: "い"}, {text: "きてるだけでも"}, {text: "苦", r: "くる"}, {text: "しいし"}] },
  { id: 44, ja: "音楽とか儲からないし", zh: "音乐什麽的根本赚不到钱", ruby: [{text: "音楽", r: "おんがく"}, {text: "とか"}, {text: "儲からないし", r: "もうからないし", type: "vocab", meaning: "儲かる (动词): 赚钱、获利"}] },
  { id: 45, ja: "歌詞とか適当でもいいよ", zh: "歌词随意写写就好", ruby: [{text: "歌詞", r: "かし"}, {text: "とか"}, {text: "適当", r: "てきとう", type: "vocab", meaning: "適当 (形容动词): 这里指随意、敷衍、马虎"}, {text: "でもいいよ"}] },
  { id: 46, ja: "どうでもいいんだ", zh: "已经无所谓了啦", ruby: [{text: "どうでもいいんだ"}] },
  { id: 47, ja: "間違ってないだろ", zh: "没有错吧", ruby: [{text: "間違", r: "まちが"}, {text: "ってないだろ"}] },
  { id: 48, ja: "間違ってないよな", zh: "应该没有错吧", ruby: [{text: "間違", r: "まちが"}, {text: "ってないよな"}] },
  { id: 49, ja: "間違ってないよな", zh: "这样应该没错吧", ruby: [{text: "間違", r: "まちが"}, {text: "ってないよな"}] },
  { id: 50, ja: "間違ってるんだよ　わかってるんだ", zh: "全都错了啊 早就知道了啊", ruby: [{text: "間違", r: "まちが"}, {text: "ってるんだよ　わかってるんだ"}] },
  { id: 51, ja: "あんたら人間も", zh: "你们这些人", ruby: [{text: "あんたら"}, {text: "人間", r: "にんげん"}, {text: "も"}] },
  { id: 52, ja: "本当も愛も救いも優しさも人生も", zh: "真相啊 爱啊 救赎啊 温柔啊 人生啊", ruby: [{text: "本当", r: "ほんとう"}, {text: "も"}, {text: "愛", r: "あい"}, {text: "も"}, {text: "救", r: "すく"}, {text: "いも"}, {text: "優", r: "やさ"}, {text: "しさも"}, {text: "人生", r: "じんせい"}, {text: "も"}] },
  { id: 53, ja: "どうでもいいんだ", zh: "怎样都好啦", ruby: [{text: "どうでもいいんだ"}] },
  { id: 54, ja: "正しい答えが言えないのだって防衛本能だ", zh: "正确的答案说不出口只是防卫本能啊", ruby: [{text: "正", r: "ただ"}, {text: "しい"}, {text: "答", r: "こた"}, {text: "えが"}, {text: "言", r: "い"}, {text: "えないのだって"}, {text: "防衛本能", r: "ぼうえいほんのう"}, {text: "だ"}] },
  { id: 55, ja: "どうでもいいや", zh: "不管了啦", ruby: [{text: "どうでもいいや"}] },
  { id: 56, ja: "あんたのせいだ", zh: "反正都是你害的", ruby: [{text: "あんたのせいだ"}] },
  { id: 57, ja: "僕だって信念があった", zh: "我也曾经是有信念的", ruby: [{text: "僕", r: "ぼく"}, {text: "だって"}, {text: "信念", r: "しんねん", type: "vocab", meaning: "信念 (名词): 坚信不疑的想法或主张"}, {text: "があった"}] },
  { id: 58, ja: "今じゃ塵みたいな想いだ", zh: "但现在早已不重要了", ruby: [{text: "今", r: "いま"}, {text: "じゃ"}, {text: "塵", r: "ちり", type: "vocab", meaning: "塵 (名词): 灰尘、垃圾。引申为毫无价值的执念"}, {text: "みたいな"}, {text: "想", r: "おも"}, {text: "いだ"}] },
  { id: 59, ja: "何度でも君を書いた", zh: "花了多少次来描写你", ruby: [{text: "何度", r: "なんど"}, {text: "でも"}, {text: "君", r: "きみ"}, {text: "を"}, {text: "書", r: "か"}, {text: "いた"}] },
  { id: 60, ja: "売れることこそがどうでもよかったんだ", zh: "热卖这种事从来都没在意过", ruby: [{text: "売", r: "う"}, {text: "れることこそがどうでもよかったんだ"}] },
  { id: 61, ja: "本当だ　本当なんだ　昔はそうだった", zh: "真的啦 是真的啦 曾经是这样的", ruby: [{text: "本当", r: "ほんとう"}, {text: "だ　"}, {text: "本当", r: "ほんとう"}, {text: "なんだ　"}, {text: "昔", r: "むかし"}, {text: "はそうだった"}] },
  { id: 62, ja: "だから僕は", zh: "所以我呢", ruby: [{text: "だから"}, {text: "僕", r: "ぼく"}, {text: "は"}] },
  { id: 63, ja: "だから僕は音楽を辞めた", zh: "所以我放弃了音乐", ruby: [{text: "だから"}, {text: "僕", r: "ぼく"}, {text: "は"}, {text: "音楽", r: "おんがく"}, {text: "を"}, {text: "辞", r: "や"}, {text: "めた"}] },
];

const DakaraSong = () => {
  const navigate = useNavigate();
  // 语速放缓，音调略微降低，营造安静、遗憾的文学氛围
  const { speakText } = useSpeech('ja-JP', 0.85, 0.95); 
  const { activeVocab, popupPos, tooltipHandlers } = useVocabTooltip();
  
  // 记录已被“显影”的词汇
  const [revealedWords, setRevealedWords] = useState(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReveal = (word) => {
    if (word.type !== 'vocab') return;
    if (!revealedWords.has(word.text)) {
      setRevealedWords(prev => new Set(prev).add(word.text));
    }
  };

  return (
    <div className="dakara-container">
      <div className="dakara-overlay"></div>
      
      <nav className="dakara-nav">
        <button onClick={() => navigate('/album/dakara-boku-wa')} className="dakara-back-btn">
          ← 离开信笺
        </button>
      </nav>

      <main className="dakara-content">
        <h1 className="dakara-title">だから僕は音楽を辞めた</h1>
        
        <div className="lyrics-flow">
          {lyricsData.map((line) => (
            <div key={line.id} className="dakara-line">
              <div className="lyric-ja">
                {line.ruby.map((word, idx) => {
                  if (word.type === 'vocab') {
                    const isRevealed = revealedWords.has(word.text);
                    return (
                      <span 
                        key={idx} 
                        className={`faded-vocab ${isRevealed ? 'revealed' : ''}`}
                        onMouseEnter={(e) => {
                          handleReveal(word);
                          tooltipHandlers.onMouseEnter(word, e);
                        }}
                        onMouseMove={(e) => {
                          if (isRevealed) tooltipHandlers.onMouseMove(e);
                        }}
                        onMouseLeave={() => {
                          tooltipHandlers.onMouseLeave();
                        }}
                        onClick={(e) => {
                          if (isRevealed) speakText(word.text, e);
                        }}
                      >
                        <InteractiveRuby word={word} />
                      </span>
                    );
                  }
                  
                  // 非核心词
                  return <InteractiveRuby key={idx} word={word} />;
                })}
              </div>
              <div className="dakara-zh">{line.zh}</div>
            </div>
          ))}
        </div>
      </main>

      {/* 夏日玻璃卡片弹窗 */}
      <VocabTooltip 
        vocab={activeVocab} 
        position={popupPos} 
        containerClassName="glass-popup"
        hintText="轻轻点击，聆听遗憾"
      />
    </div>
  );
};

export default DakaraSong;
