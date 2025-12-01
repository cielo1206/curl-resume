// src/utils.js
// 工具函数

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const encoder = new TextEncoder();

// ANSI 转义码
export const ANSI = {
  // 控制
  reset: "\x1b[0m",
  clear: "\x1b[2J\x1b[0;0H", // 清屏并移动光标到左上角
  clearLine: "\r\x1b[K", // 清除当前行
  hideCursor: "\x1b[?25l",
  showCursor: "\x1b[?25h",

  // 样式
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // 颜色
  green: "\x1b[32m",
  brightGreen: "\x1b[92m",
  cyan: "\x1b[36m",
  brightCyan: "\x1b[96m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};
