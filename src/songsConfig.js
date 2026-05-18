// 全局曲库注册表 (专辑层级版)
// 包含每张专辑的数据及其收录的单曲页路由信息

export const albums = [
  {
    id: "dakara-boku-wa",
    title: "だから僕は音楽を辞めた",
    artist: "ヨルシカ (Yorushika)",
    coverImage: "/cover-shikaki.jpg", // 暂时复用这张街景图片作为专辑封面
    vibe: "关于逃避、辞呈与无力感的音乐诗集",
    releaseYear: "2019",
    themeColor: "linear-gradient(135deg, #4A3320 0%, #1A120B 100%)",
    songs: [
      {
        id: "shikaki-to-coffee",
        title: "詩書きとコーヒー",
        level: "N3",
        vibe: "纯代码视觉 | 横卷排版艺术",
        wordsCount: 12,
        route: "/song/shikaki-to-coffee",
        component: "ShikakiSong"
      },
      {
        id: "dakara-boku-wa",
        title: "だから僕は音楽を辞めた",
        level: "N1",
        vibe: "夏日遗憾 | 褪色的信笺",
        wordsCount: 14,
        route: "/song/dakara-boku-wa",
        component: "DakaraSong"
      }
    ]
  }
];
