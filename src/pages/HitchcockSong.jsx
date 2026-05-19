import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hitchcock.css';
import { useSpeech } from '../hooks/useSpeech';

const lyricsSections = [
  {
    id: "scene-rain-window",
    lines: [
      {
        id: 1, ja: "「雨の匂いに懐かしくなるのは何でなんでしょうか。", zh: "「对雨的味道感到很熟悉是为什么呢。」",
        ruby: [{ text: "「" }, { text: "雨", r: "あめ" }, { text: "の" }, { text: "匂", r: "にお" }, { text: "いに" }, { text: "懐", r: "なつ" }, { text: "かしくなるのは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 2, ja: "夏が近づくと胸が騒めくのは何でなんでしょうか。", zh: "「夏天接近心中就会躁动是为什么呢。」",
        ruby: [{ text: "夏", r: "なつ" }, { text: "が" }, { text: "近", r: "ちか" }, { text: "づくと" }, { text: "胸", r: "むね" }, { text: "が" }, { text: "騒めく", r: "ざわめく", type: "vocab", meaning: "騒めく (自五动词): 骚动、喧嚣、因情绪激动而躁动不安", footnote: "夏日将至，比温度更早喧哗的是那颗因迷茫而躁热不安的心。" }, { text: "のは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 3, ja: "人に笑われたら涙が出るのは何でなんでしょうか。", zh: "「被人嘲笑眼泪会掉下来是为什么呢。」",
        ruby: [{ text: "人", r: "ひと" }, { text: "に" }, { text: "笑", r: "わら" }, { text: "われたら" }, { text: "涙", r: "なみだ" }, { text: "が" }, { text: "出", r: "で" }, { text: "るのは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 4, ja: "それでもいつか報われるからと思えばいいんでしょうか。」", zh: "「只要想着即使那样也总有一天会得到回报就可以了吗。」",
        ruby: [{ text: "それでもいつか" }, { text: "報われる", r: "むくわれる", type: "vocab", meaning: "報われる (自下一被动): 得到回报、付出有了成效", footnote: "只要固执地相信未来终会得到补偿，当下的无力感是不是就会减轻一些？" }, { text: "からと" }, { text: "思", r: "おも" }, { text: "えばいいんでしょうか。」" }]
      },
      {
        id: 5, ja: "さよならって言葉でこんなに胸を裂いて", zh: "「再见这句话这样让人撕心裂肺」",
        ruby: [{ text: "さよならって" }, { text: "言葉", r: "ことば" }, { text: "でこんなに" }, { text: "胸", r: "むね" }, { text: "を" }, { text: "裂いて", r: "さいて", type: "vocab", meaning: "裂く (他五动词): 撕裂、割裂、切断、强行割开", footnote: "短短的一声“再见”，却拥有能将心脏生生割开的锋利痛楚。" }]
      },
      {
        id: 6, ja: "今もたった数瞬の夕焼けに足が止まっていた", zh: "「现在也在只有瞬间的晚霞前停下脚步」",
        ruby: [{ text: "今", r: "いま" }, { text: "もたった" }, { text: "数瞬", r: "すうしゅん", type: "vocab", meaning: "数瞬 (名词): 极短的瞬间、转瞬即逝的刹那", footnote: "晚霞只在天空中停留数瞬，却美得让逃避现实的脚步不甘地停驻。" }, { text: "之" }, { text: "夕焼け", r: "ゆうやけ" }, { text: "に" }, { text: "足", r: "あし" }, { text: "が" }, { text: "止まっていた", r: "とまっていた", type: "vocab", meaning: "立ち止まる (自五动词) / 止まる: 停下脚步、伫立在原地", footnote: "在落日余晖的照耀下停下，其实是在给疲惫的心灵寻找短暂的避难所。" }]
      }
    ]
  },
  {
    id: "scene-chalkboard",
    lines: [
      {
        id: 7, ja: "「先生、人生相談です。この先どうなら楽ですか。", zh: "「老师、我想谈谈人生。在这之后怎样才能感到轻松呢。」",
        ruby: [{ text: "「" }, { text: "先生", r: "せんせい" }, { text: "、" }, { text: "人生相談", r: "じんせいそうだん" }, { text: "です。この" }, { text: "先", r: "さき" }, { text: "どうなら" }, { text: "楽", r: "らく" }, { text: "ですか。" }]
      },
      {
        id: 8, ja: "そんなの誰もわかりはしないよなんて言われますか。", zh: "「会被说那种事情谁也不知道之类的吗。」",
        ruby: [{ text: "そんなの" }, { text: "誰", r: "だれ" }, { text: "もわかりはしないよなんて" }, { text: "言", r: "い" }, { text: "われますか。" }]
      },
      {
        id: 9, ja: "ほら、苦しさなんて欲しいわけない。何もしないで生きていたい。", zh: "「看啊、并不是想要得到痛苦。想要什么都不做地活下去。」",
        ruby: [{ text: "ほら、" }, { text: "苦", r: "くる" }, { text: "しさなんて" }, { text: "欲", r: "ほつ" }, { text: "しいわけない。" }, { text: "何", r: "なに" }, { text: "もしない对" }, { text: "生", r: "い" }, { text: "きていたい。" }]
      },
      {
        id: 10, ja: "青空だけが見たいのは我儘ですか。」", zh: "「只想看着蓝天是一种任性吗。」",
        ruby: [{ text: "青空", r: "あおぞら" }, { text: "だけが" }, { text: "見", r: "み" }, { text: "たいのは" }, { text: "我儘", r: "わがまま", type: "vocab", meaning: "我儘 (名形/名词): 任性、恣意、随心所欲、放肆", footnote: "只是渴望一片没有虚伪的澄澈蓝天，这也算是一种无法被原谅的任性吗？" }, { text: "ですか。」" }]
      }
    ]
  },
  {
    id: "scene-subway-tile",
    lines: [
      {
        id: 11, ja: "「胸が痛んでも嘘がつけるのは何でなんでしょうか。", zh: "「即使心中很痛也要撒谎是为什么呢。」",
        ruby: [{ text: "「" }, { text: "胸", r: "むね" }, { text: "が" }, { text: "痛", r: "いた" }, { text: "んでも" }, { text: "嘘", r: "うそ" }, { text: "がつけるのは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 12, ja: "悪い人ばかりが得をしてるのは何でなんでしょうか。", zh: "「总是坏人得到好处是为什么呢。」",
        ruby: [{ text: "悪", r: "わる" }, { text: "い" }, { text: "人", r: "ひと" }, { text: "ばかりが" }, { text: "得", r: "とく" }, { text: "をしてるのは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 13, ja: "幸せの文字がお金を含むのは何でなんでしょうか。", zh: "「幸福的字眼里包含金钱是为什么呢。」",
        ruby: [{ text: "幸", r: "しあわ" }, { text: "せの" }, { text: "文字", r: "もじ" }, { text: "がお" }, { text: "金", r: "かね" }, { text: "を" }, { text: "含", r: "ふく" }, { text: "むのは" }, { text: "何", r: "なん" }, { text: "でなんでしょうか。" }]
      },
      {
        id: 14, ja: "一つ線を抜けば辛さになるのはわざとなんでしょうか。」", zh: "「去掉一条线就会变成辛苦是故意设计的吗。」",
        ruby: [{ text: "一", r: "ひと" }, { text: "つ" }, { text: "線", r: "せん" }, { text: "を" }, { text: "抜", r: "ぬ" }, { text: "けば" }, { text: "辛さ", r: "つらさ", type: "vocab", meaning: "辛さ (名词): 痛苦、辛酸、艰辛。源于形容词「辛い」", footnote: "命运最残忍的玩笑莫过于，只要在“幸福”上抽掉一笔，就变成了“辛苦”。" }, { text: "になるのはわざとなんでしょうか。」" }]
      },
      {
        id: 15, ja: "青春って値札が背中に贴られていて", zh: "「后背被贴上了名为青春的价签」",
        ruby: [{ text: "青春", r: "せいしゅん" }, { text: "って" }, { text: "値札", r: "ねふだ", type: "vocab", meaning: "値札 (名词): 价格标签、估价单", footnote: "后背上贴着名为青春的价签，我们在浑浑噩噩中被社会明码标价地售卖。" }, { text: "が" }, { text: "背中", r: "せなか" }, { text: "に" }, { text: "貼", r: "は" }, { text: "られていて" }]
      },
      {
        id: 16, ja: "ヒッチコックみたいなサスペンスをどこか期待していた", zh: "「内心某处期待着希区柯克般的悬疑戏剧」",
        ruby: [{ text: "ヒッチコックみたいなサスペンスをどこか" }, { text: "期待", r: "きたい" }, { text: "していた" }]
      }
    ]
  },
  {
    id: "scene-void-room",
    lines: [
      {
        id: 17, ja: "「先生、どうでもいいんですよ。生きてるだけで痛いんですよ。", zh: "「老师、怎样都无所谓了。只是活着就已经很痛了啊。」",
        ruby: [{ text: "「" }, { text: "先生", r: "せんせい" }, { text: "、どうでもいいんですよ。" }, { text: "生", r: "い" }, { text: "きてるだけで" }, { text: "痛", r: "いた" }, { text: "いんですよ。" }]
      },
      {
        id: 18, ja: "ニーチェもフロイトもこの穴の埋め方は书かないんだ。", zh: "「尼采和弗洛伊德都没有写填补这个黑洞的方法啊。」",
        ruby: [{ text: "ニーチェもフロイトもこの" }, { text: "穴", r: "あな" }, { text: "の" }, { text: "埋め方", r: "うめかた", type: "vocab", meaning: "埋める (他下一): 填平、填满。此处埋め方指填满黑洞的方法", footnote: "伟大的哲学家和心理学家，也从未在书本里写下过如何填补青春虚无黑洞的方法。" }, { text: "は" }, { text: "書", r: "か" }, { text: "かないんだ。" }]
      },
      {
        id: 19, ja: "ただ夏の匂いに目を瞑って、雲の高さを指で描こう。", zh: "「只想在夏天的气息中闭上双眼、用手指向天空描绘云的高度。」",
        ruby: [{ text: "ただ" }, { text: "夏", r: "なつ" }, { text: "の" }, { text: "匂", r: "にお" }, { text: "いに" }, { text: "目を瞑って", r: "めをつむって", type: "vocab", meaning: "目を瞑る (惯用短语): 闭上双眼、装作看不见、默许", footnote: "在这个刺眼的世界里，闭上双眼，才能闻到风里夹杂的纯粹夏天。" }, { text: "、" }, { text: "雲", r: "くも" }, { text: "の" }, { text: "高", r: "たか" }, { text: "さを" }, { text: "指", r: "ゆび" }, { text: "で" }, { text: "描", r: "えが" }, { text: "こう。" }]
      },
      {
        id: 20, ja: "想い出だけが見たいのは我儘ですか。」", zh: "「只想沉溺于回忆之中也是一种任性吗。」",
        ruby: [{ text: "想", r: "おも" }, { text: "い" }, { text: "出", r: "で" }, { text: "だけが" }, { text: "見", r: "み" }, { text: "たいのは" }, { text: "我儘", r: "わがまま" }, { text: "ですか。」" }]
      }
    ]
  },
  {
    id: "scene-summer-sky",
    lines: [
      {
        id: 21, ja: "「ドラマチックに人が死ぬストーリーって売れるじゃないですか。", zh: "「那种人戏剧性死去的故事，不是很畅销吗。」",
        ruby: [{ text: "「ドラマチックに" }, { text: "人", r: "ひと" }, { text: "が" }, { text: "死", r: "し" }, { text: "ぬストーリーって" }, { text: "売", r: "う" }, { text: "れるじゃないですか。" }]
      },
      {
        id: 22, ja: "花の散り際にすら値が付くのも嫌になりました。", zh: "「对连花朵凋谢的一瞬间都被标上价码的事，感到无比作呕了。」",
        ruby: [{ text: "花", r: "はな" }, { text: "の" }, { text: "散り際", r: "ちりぎわ", type: "vocab", meaning: "散り際 (名词): 花朵凋落、凋谢的一瞬间；亦指生命终结之时", footnote: "连花朵飘落那一刹那的壮烈美感都被赋予了商业价值，这令人无比作呕。" }, { text: "にすら" }, { text: "値", r: "ね" }, { text: "が" }, { text: "付", r: "つ" }, { text: "くのも" }, { text: "嫌", r: "いや" }, { text: "になりました。" }]
      },
      {
        id: 23, ja: "先生の夢は何だったんですか。大人になると忘れちゃうものなんですか。」", zh: "「老师你以前的梦想是什么呢。变成大人后，真的就会全部忘光吗。」",
        ruby: [{ text: "先生", r: "せんせい" }, { text: "の" }, { text: "夢", r: "ゆめ" }, { text: "は" }, { text: "何", r: "なん" }, { text: "だったんですか。" }, { text: "大人", r: "おとな" }, { text: "になると" }, { text: "忘", r: "わす" }, { text: "れちゃうものなんですか。」" }]
      },
      {
        id: 24, ja: "「先生、人生相談です。この先どうなら楽ですか。", zh: "「老师、我想谈谈人生。在这之后怎样才能感到轻松呢。」",
        ruby: [{ text: "「" }, { text: "先生", r: "せんせい" }, { text: "、" }, { text: "人生相談", r: "じんせいそうだん" }, { text: "です。この" }, { text: "先", r: "さき" }, { text: "どうなら" }, { text: "楽", r: "らく" }, { text: "ですか。" }]
      },
      {
        id: 25, ja: "涙が人を強くするなんて全部詭弁でした。", zh: "「眼泪会让人坚强之类的话，全部都是狡辩罢了。」",
        ruby: [{ text: "涙", r: "なみだ" }, { text: "が" }, { text: "人", r: "ひと" }, { text: "を" }, { text: "強", r: "つよ" }, { text: "くするなんて" }, { text: "全部", r: "ぜんぶ" }, { text: "詭弁", r: "きべん", type: "vocab", meaning: "詭弁 (名词): 诡辩、狡辩、毫无根据的歪理", footnote: "那些“眼泪能让人坚强”的大道理，其实只是大人用来搪塞痛苦的漂亮谎言罢了。" }, { text: "でした。" }]
      },
      {
        id: 26, ja: "あぁ、この先どうでもいいわけなくて、現実だけがちらついて、夏が遠くて。", zh: "「啊啊、往后怎样根本无法无所谓，残酷现实老在眼前闪烁，夏天遥不可及。」",
        ruby: [{ text: "あぁ、この" }, { text: "先", r: "さき" }, { text: "どうでもいいわけなくて、" }, { text: "現実", r: "げんじつ" }, { text: "だけが" }, { text: "ちらついて", r: "ちらついて", type: "vocab", meaning: "ちらつく (自五动词): 闪烁、若隐若现、飘忽晃动", footnote: "夏日渐行渐远，而冰冷刺骨的残酷现实，却开始在眼前飘忽闪烁，无处可躲。" }, { text: "、" }, { text: "夏", r: "なつ" }, { text: "が" }, { text: "遠", r: "とお" }, { text: "くて。" }]
      },
      {
        id: 27, ja: "これでも本当にいいんですか。このまま生きてもいいんですか。", zh: "「真的就这样就好了吗。就这样浑浑噩噩活下去也可以吗。」",
        ruby: [{ text: "これでも" }, { text: "本当", r: "ほんとう" }, { text: "にいいんですか。このまま" }, { text: "生", r: "い" }, { text: "きてもいいんですか。" }]
      },
      {
        id: 28, ja: "そんなの君にしかわからないよなんて言われますか。", zh: "「会被冷漠地回复那种事情只有你才懂之类的吗。」",
        ruby: [{ text: "そんなの" }, { text: "君", r: "きみ" }, { text: "にしかわからないよなんて" }, { text: "言", r: "い" }, { text: "われますか。" }]
      },
      {
        id: 29, ja: "ただ夏の匂いに目を瞑りたい。いつまでも風に吹かれたい。", zh: "「只想在夏天的气息中闭上双眼。无论何时都想被长风吹拂着。」",
        ruby: [{ text: "ただ" }, { text: "夏", r: "なつ" }, { text: "の" }, { text: "匂", r: "にお" }, { text: "いに" }, { text: "目", r: "め" }, { text: "を" }, { text: "瞑", r: "つむ" }, { text: "りたい。いつまでも" }, { text: "風", r: "かぜ" }, { text: "に" }, { text: "吹", r: "ふ" }, { text: "かれたい。" }]
      },
      {
        id: 30, ja: "青空だけが見たいのは我儘ですか。」", zh: "「只想看着蓝天也是一种任性吗。」",
        ruby: [{ text: "青空", r: "あおぞら" }, { text: "だけが" }, { text: "見", r: "み" }, { text: "たいのは" }, { text: "我儘", r: "わがまま" }, { text: "ですか。」" }]
      },
      {
        id: 31, ja: "あなただけを知りたいのは我儘ですか", zh: "「只想知道你的事情，真的是一种任性吗。」",
        ruby: [{ text: "あなただけを" }, { text: "知", r: "し" }, { text: "りたいのは" }, { text: "我儘", r: "わがまま" }, { text: "ですか" }]
      }
    ]
  }
];

function HitchcockSong() {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  
  const [activeScene, setActiveScene] = useState("scene-rain-window");
  const [revealedVocabs, setRevealedVocabs] = useState(new Set());
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [activeSubtitle, setActiveSubtitle] = useState("「对雨的味道感到很熟悉是为什么呢。」");

  const panelRef = useRef(null);
  const sectionRefs = useRef({});

  // 1. 动态监听横向滚轮：将用户的竖向滚轮偏移转化为横向列滚动，完美解决 PC 端操作困难
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    
    const onWheel = (e) => {
      // 排除垂直滚轮无法滑动的问题，进行横向滚动映射
      e.preventDefault();
      panel.scrollLeft += e.deltaY * 1.3;
    };
    
    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => panel.removeEventListener('wheel', onWheel);
  }, []);

  // 2. 利用 IntersectionObserver 进行场景切换与默认字幕更新
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let targetScene = null;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          targetScene = entry.target.dataset.scene;
        }
      });
      if (targetScene) {
        setActiveScene(targetScene);
        // 自动更新底部翻译为该幕第一句歌词的翻译
        const sectionObj = lyricsSections.find(s => s.id === targetScene);
        if (sectionObj && sectionObj.lines.length > 0) {
          setActiveSubtitle(sectionObj.lines[0].zh);
        }
      }
    }, {
      root: panelRef.current,
      rootMargin: '0px -30% 0px -30%',
      threshold: [0.1, 0.2, 0.4, 0.6, 0.8]
    });

    Object.values(sectionRefs.current).forEach(node => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const totalVocabCount = 13;
  const revealedCount = revealedVocabs.size;

  const handleLineClick = (line, e) => {
    if (e.target.closest('.vocab-tape-vert')) return;
    speak(line.ja.replace(/[「」『』]/g, ''));
    // 点击该行时，同步更新电影字幕
    setActiveSubtitle(line.zh);
  };

  const handleVocabClick = (vocab, e, lineZh) => {
    e.stopPropagation();
    setRevealedVocabs(prev => {
      const next = new Set(prev);
      next.add(vocab.text);
      return next;
    });
    speak(vocab.text);
    // 展示卡片
    setSelectedInfo(vocab);
    // 更新电影字幕
    setActiveSubtitle(lineZh);
  };

  return (
    <div className="hitchcock-wrapper">
      
      {/* ==================== 左侧：电影放映幕布 ==================== */}
      <div className="hitchcock-mv-canvas">
        
        {/* 1. 雨の窓辺 */}
        <div className={`mv-scene scene-rain-window ${activeScene === 'scene-rain-window' ? 'active-scene' : ''}`}>
          <div className="rain-window-frame"></div>
          <div className="rain-particles"></div>
        </div>

        {/* 2. 深青の黒板 */}
        <div className={`mv-scene scene-chalkboard ${activeScene === 'scene-chalkboard' ? 'active-scene' : ''}`}>
        </div>

        {/* 3. 地下道の階段 */}
        <div className={`mv-scene scene-subway-tile ${activeScene === 'scene-subway-tile' ? 'active-scene' : ''}`}>
          <div className="subway-grid"></div>
          <div className="subway-handrail"></div>
        </div>

        {/* 4. 教室の虚無 */}
        <div className={`mv-scene scene-void-room ${activeScene === 'scene-void-room' ? 'active-scene' : ''}`}>
          <div className="void-windows">
            <div className="void-window"></div>
            <div className="void-window"></div>
            <div className="void-window"></div>
            <div className="void-window"></div>
          </div>
          <div className="black-hole-container">
            <div className="black-hole"></div>
          </div>
        </div>

        {/* 5. 憧れの青空 */}
        <div className={`mv-scene scene-summer-sky ${activeScene === 'scene-summer-sky' ? 'active-scene' : ''}`}>
          <div className="sky-clouds"></div>
        </div>

        {/* 贯穿全场景的手绘 SVG 极简线稿人物 */}
        <svg viewBox="0 0 100 200" className="svg-character svg-ghost">
          <path d="M 20 200 L 25 80 C 25 70, 20 20, 25 10 C 30 0, 40 5, 45 30 L 50 60 L 55 30 C 60 5, 70 0, 75 10 C 80 20, 75 70, 75 80 L 80 200" />
          <ellipse cx="38" cy="80" rx="4" ry="10" />
          <ellipse cx="62" cy="80" rx="4" ry="10" />
          <rect x="46" y="95" width="8" height="12" />
          <path d="M 30 115 Q 50 120, 70 115" strokeDasharray="3 3" />
        </svg>

        <svg viewBox="0 0 100 200" className="svg-character svg-girl">
          <path d="M 30 200 L 35 100 C 35 90, 65 90, 65 100 L 70 200" />
          <path d="M 25 60 C 25 30, 75 30, 75 60 C 75 80, 65 85, 60 80 C 55 75, 45 75, 40 80 C 35 85, 25 80, 25 60 Z" />
          <path d="M 35 60 C 35 90, 65 90, 65 60" />
          <path d="M 40 68 Q 45 65, 48 68" />
          <path d="M 52 68 Q 55 65, 60 68" />
          <circle cx="50" cy="78" r="1" fill="#e2e8f0" />
        </svg>

        {/* 🎬 还原官方 MV 中文字幕的横排浮动框 (Movie Subtitle) */}
        {activeSubtitle && (
          <div className="hitchcock-movie-subtitle">
            {activeSubtitle}
          </div>
        )}

        {/* 哲学释义通知卡 */}
        {selectedInfo && (
          <div className="hitchcock-info-overlay" key={selectedInfo.text}>
            <div className="info-word">
              <ruby>
                {selectedInfo.text}
                <rt>{selectedInfo.r}</rt>
              </ruby>
            </div>
            <div className="info-meaning">{selectedInfo.meaning}</div>
            <div className="info-footnote">💡 {selectedInfo.footnote}</div>
          </div>
        )}
      </div>

      {/* ==================== 右侧：温润灰色纵书歌词面板 ==================== */}
      <div className="hitchcock-lyrics-panel" ref={panelRef}>
        {lyricsSections.map((section) => (
          <div 
            key={section.id}
            data-scene={section.id}
            ref={el => sectionRefs.current[section.id] = el}
            className={`lyric-section ${activeScene === section.id ? 'active' : ''}`}
          >
            {section.lines.map((line) => (
              <div 
                key={line.id} 
                className="lyric-line-vert"
                onClick={(e) => handleLineClick(line, e)}
                onMouseEnter={() => setActiveSubtitle(line.zh)}
              >
                {/* 纯净日文列 (绝对不折行) */}
                <div className="lyric-jp-vert">
                  {line.ruby.map((part, index) => {
                    if (part.type === "vocab") {
                      const isRevealed = revealedVocabs.has(part.text);
                      return (
                        <span 
                          key={index}
                          className={`vocab-tape-vert ${isRevealed ? 'revealed' : ''}`}
                          onClick={(e) => handleVocabClick(part, e, line.zh)}
                        >
                          <ruby>
                            {isRevealed ? part.text : "　　"}
                            {isRevealed && <rt>{part.r}</rt>}
                          </ruby>
                        </span>
                      );
                    }
                    if (part.r) {
                      return (
                        <ruby key={index}>
                          {part.text}
                          <rt>{part.r}</rt>
                        </ruby>
                      );
                    }
                    return <span key={index}>{part.text}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 固定状态与导航 */}
      <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/album/dakara-boku-wa'); }} className="hitchcock-back-float">
        さよなら
      </a>

      <div className="hitchcock-status-float">
        胶片解析进度：{revealedCount} / {totalVocabCount}
      </div>

    </div>
  );
}

export default HitchcockSong;
