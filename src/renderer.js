// src/renderer.js
// ANSI 颜色渲染器 - 将 Markdown 转换为终端彩色输出

// ANSI 转义码
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // 前景色
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // 亮色
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

// 主题配置
const themes = {
  default: {
    h1: ANSI.bold + ANSI.brightMagenta,
    h2: ANSI.bold + ANSI.brightCyan,
    h3: ANSI.bold + ANSI.brightYellow,
    strong: ANSI.bold + ANSI.yellow,
    em: ANSI.italic + ANSI.brightWhite,
    link: ANSI.underline + ANSI.brightBlue,
    code: ANSI.brightGreen,
    quote: ANSI.dim + ANSI.cyan,
    list: ANSI.brightWhite,
    text: ANSI.white,
  },
  matrix: {
    h1: ANSI.bold + ANSI.brightGreen,
    h2: ANSI.bold + ANSI.green,
    h3: ANSI.bold + ANSI.brightGreen,
    strong: ANSI.bold + ANSI.brightGreen,
    em: ANSI.italic + ANSI.green,
    link: ANSI.underline + ANSI.brightGreen,
    code: ANSI.brightGreen,
    quote: ANSI.dim + ANSI.green,
    list: ANSI.green,
    text: ANSI.green,
  },
  hacker: {
    h1: ANSI.bold + ANSI.brightRed,
    h2: ANSI.bold + ANSI.red,
    h3: ANSI.bold + ANSI.brightYellow,
    strong: ANSI.bold + ANSI.brightRed,
    em: ANSI.italic + ANSI.yellow,
    link: ANSI.underline + ANSI.brightRed,
    code: ANSI.brightYellow,
    quote: ANSI.dim + ANSI.red,
    list: ANSI.brightWhite,
    text: ANSI.white,
  },
  ocean: {
    h1: ANSI.bold + ANSI.brightCyan,
    h2: ANSI.bold + ANSI.blue,
    h3: ANSI.bold + ANSI.brightBlue,
    strong: ANSI.bold + ANSI.brightCyan,
    em: ANSI.italic + ANSI.cyan,
    link: ANSI.underline + ANSI.brightBlue,
    code: ANSI.brightCyan,
    quote: ANSI.dim + ANSI.blue,
    list: ANSI.brightCyan,
    text: ANSI.cyan,
  },
};

/**
 * 简单的 Markdown 渲染器
 * 由于 Cloudflare Workers 环境限制，我们实现一个轻量级的解析器
 */
export function render(markdown, options = {}) {
  const themeName = options.theme || 'default';
  const theme = themes[themeName] || themes.default;

  let output = markdown;

  // 处理 H1 标题 (# ...)
  output = output.replace(/^# (.+)$/gm, (_, text) => {
    return `${theme.h1}${text}${ANSI.reset}`;
  });

  // 处理 H2 标题 (## ...)
  output = output.replace(/^## (.+)$/gm, (_, text) => {
    return `\n${theme.h2}${text}${ANSI.reset}`;
  });

  // 处理 H3 标题 (### ...)
  output = output.replace(/^### (.+)$/gm, (_, text) => {
    return `${theme.h3}${text}${ANSI.reset}`;
  });

  // 处理粗体 (**text**)
  output = output.replace(/\*\*([^*]+)\*\*/g, (_, text) => {
    return `${theme.strong}${text}${ANSI.reset}`;
  });

  // 处理斜体 (*text* 或 _text_)
  output = output.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (_, text) => {
    return `${theme.em}${text}${ANSI.reset}`;
  });
  output = output.replace(/_([^_]+)_/g, (_, text) => {
    return `${theme.em}${text}${ANSI.reset}`;
  });

  // 处理行内代码 (`code`)
  output = output.replace(/`([^`]+)`/g, (_, text) => {
    return `${theme.code}${text}${ANSI.reset}`;
  });

  // 处理链接 [text](url) - 只显示 URL
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    return `${theme.link}${url}${ANSI.reset}`;
  });

  // 处理引用 (> ...)
  output = output.replace(/^> (.+)$/gm, (_, text) => {
    return `${theme.quote}  │ ${text}${ANSI.reset}`;
  });

  // 处理无序列表 (* ... 或 - ...)
  output = output.replace(/^[\*\-] (.+)$/gm, (_, text) => {
    return `${theme.list}  • ${text}${ANSI.reset}`;
  });

  // 处理分隔线 (---)
  output = output.replace(/^---$/gm, () => {
    return `${ANSI.dim}${'─'.repeat(50)}${ANSI.reset}`;
  });

  return output;
}

/**
 * 获取可用主题列表
 */
export function getAvailableThemes() {
  return Object.keys(themes);
}
