// src/config.js
// 用户配置文件 - 修改这里来定制你的终端简历

export const config = {
  // ============ 基本信息 ============
  name: "DJJ",
  title: "Department of Joke Justice",
  subtitle: "说烂笑话必遭审判",

  // ============ 页面配置 ============
  pages: [
    // 第一页: 开场动画
    {
      type: "boot",
      content: {
        messages: ["> SYSTEM BOOT", ".", ".", ".", " OK"],
        progressBar: true,
      },
      transition: "glitch", // 切换效果: glitch, scanline, fade, none
    },

    // 第二页: Logo 展示
    {
      type: "logo",
      content: {
        // 使用自定义 ASCII 或自动生成
        // 设置为 null 则使用 name 自动生成
        customAscii: null,
        showLightWave: true, // 是否显示光波效果
      },
      transition: "none",
    },

    // 第三页: 正文内容
    {
      type: "content",
      content: {
        about: `
🐟🐠🐡🐋🐬🦈🐙🦐🐳🦞
钓鱼是我最喜欢的活动, 在河边能够感受到一种真正的平静.
钓鱼是付出和等待的艺术, 这是很少有人具备的品质.
`,
        contacts: [
          { label: "GitHub", value: "https://github.com/Disdjj" },
          { label: "Blog  ", value: "https://blog.pdjjq.org" },
          { label: "Email ", value: "shuaiqijianhao@qq.com" },
        ],
        slogan: "反抗吧，朋友！",
      },
      transition: "none",
    },
  ],

  // ============ 动画速度配置 ============
  speed: {
    typing: 12, // 打字速度 (ms)
    typingPause: 60, // 标点停顿 (ms)
    transition: 40, // 切换动画速度 (ms)
    logoDisplay: 800, // Logo 显示时长 (ms)
  },

  // ============ 颜色主题 ============
  theme: {
    primary: "brightCyan",
    secondary: "green",
    accent: "yellow",
    highlight: "brightGreen",
    slogan: "red",
  },
};

// ============ 自定义 ASCII Logo ============
// 如果你想使用自定义 Logo，在这里定义
export const customLogo = `
██████╗      ██╗     ██╗
██╔══██╗     ██║     ██║
██║  ██║     ██║     ██║
██║  ██║██   ██║██   ██║
██████╔╝╚█████╔╝╚█████╔╝
╚═════╝  ╚════╝  ╚════╝
`;
