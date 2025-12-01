// src/effects.js
// 动画效果库 - 所有视觉特效

import { sleep, encoder, ANSI } from "./utils.js";

/**
 * 创建推送函数
 */
export function createPusher(writer) {
  return (text) => writer.write(encoder.encode(text));
}

// ============ 转场效果 ============

/**
 * 故障效果 (Glitch)
 */
export async function glitchTransition(push) {
  const glitchChars = "█▓▒░╔╗╚╝║═@#$%&*";
  const width = 50;

  for (let i = 0; i < 3; i++) {
    let line = "";
    for (let j = 0; j < width; j++) {
      line += glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    await push(`${ANSI.red}${line}${ANSI.reset}\r`);
    await sleep(50);
    await push(
      `${ANSI.brightGreen}${line.split("").reverse().join("")}${ANSI.reset}\r`
    );
    await sleep(40);
  }
  await push(ANSI.clear);
}

/**
 * 扫描线切换效果
 */
export async function scanlineTransition(push) {
  const width = 55;

  for (let i = 0; i < 8; i++) {
    await push(`${ANSI.brightCyan}${"▀".repeat(width)}${ANSI.reset}\n`);
    await sleep(15);
  }
  await sleep(50);
  await push(ANSI.clear);
}

/**
 * 渐隐效果
 */
export async function fadeTransition(push) {
  await sleep(200);
  await push(ANSI.clear);
}

/**
 * 无效果
 */
export async function noTransition(push) {
  // 什么都不做
}

/**
 * 获取转场效果
 */
export function getTransition(name) {
  const transitions = {
    glitch: glitchTransition,
    scanline: scanlineTransition,
    fade: fadeTransition,
    none: noTransition,
  };
  return transitions[name] || noTransition;
}

// ============ 显示效果 ============

/**
 * 光波扫过效果
 */
export async function lightWaveEffect(push, lines, speed = 40) {
  const colors = [
    "\x1b[36m", // cyan (暗)
    "\x1b[96m", // bright cyan
    "\x1b[97m", // bright white (光波中心)
    "\x1b[96m", // bright cyan
    "\x1b[36m", // cyan (暗)
  ];

  const maxWidth = Math.max(...lines.map((l) => l.length));

  for (let wavePos = -4; wavePos <= maxWidth + 4; wavePos += 2) {
    await push(ANSI.clear);

    for (const line of lines) {
      let coloredLine = "";
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === " " || char === "\n") {
          coloredLine += char;
        } else {
          const dist = Math.abs(i - wavePos);
          let colorIdx;
          if (dist <= 1) colorIdx = 2;
          else if (dist <= 3) colorIdx = 1;
          else colorIdx = 0;

          coloredLine += `${colors[colorIdx]}${char}${ANSI.reset}`;
        }
      }
      await push(coloredLine + "\n");
    }
    await sleep(speed);
  }

  // 最后稳定显示
  await push(ANSI.clear);
  for (const line of lines) {
    await push(`${ANSI.brightCyan}${line}${ANSI.reset}\n`);
  }
}

/**
 * 打字机效果
 */
export async function typewriter(push, text, options = {}) {
  const { speed = 12, pauseSpeed = 60, color = "" } = options;

  for (const char of text) {
    await push(color ? `${color}${char}${ANSI.reset}` : char);
    if (char === "\n") {
      await sleep(speed * 2);
    } else if (",.:;，。：；!?！？".includes(char)) {
      await sleep(pauseSpeed);
    } else {
      await sleep(speed);
    }
  }
}

/**
 * 逐行扫描显示
 */
export async function scanDisplay(push, lines, options = {}) {
  const { speed = 20, scanChar = "▌", color = ANSI.brightCyan } = options;

  for (const line of lines) {
    if (line.trim()) {
      await push(`${ANSI.brightGreen}${scanChar}${ANSI.reset}`);
      await sleep(speed);
      await push(`\r${color}${line}${ANSI.reset}\n`);
    } else {
      await push("\n");
    }
    await sleep(speed);
  }
}

/**
 * 进度条效果
 */
export async function progressBar(push, options = {}) {
  const { width = 40, speed = 6, char = "█" } = options;

  await push(`${ANSI.dim}[`);
  for (let i = 0; i < width; i++) {
    await push(`${ANSI.brightGreen}${char}${ANSI.reset}`);
    await sleep(speed);
  }
  await push(`${ANSI.dim}]${ANSI.reset} `);
  await push(`${ANSI.brightGreen}100%${ANSI.reset}\n`);
}

/**
 * 闪烁光标效果
 */
export async function blinkingCursor(push, times = 2, options = {}) {
  const { onTime = 120, offTime = 80, char = "_" } = options;

  for (let i = 0; i < times; i++) {
    await push(`${ANSI.brightGreen}${char}${ANSI.reset}`);
    await sleep(onTime);
    await push(`\r `);
    await sleep(offTime);
  }
}

/**
 * 启动序列效果
 */
export async function bootSequence(push, messages, options = {}) {
  const { speed = 30 } = options;

  await push("\r");
  for (const msg of messages) {
    if (typeof msg === "string") {
      await push(`${ANSI.green}${msg}${ANSI.reset}`);
      await sleep(speed);
    } else {
      await push(`${msg.color || ANSI.green}${msg.text}${ANSI.reset}`);
      await sleep(msg.delay || speed);
    }
  }
  await push("\n");
}

/**
 * 分隔线动画
 */
export async function animatedLine(push, options = {}) {
  const { width = 35, char = "═", speed = 6 } = options;

  await push(`${ANSI.dim}`);
  for (let i = 0; i < width; i++) {
    await push(char);
    await sleep(speed);
  }
  await push(`${ANSI.reset}\n`);
}

/**
 * 结尾光标闪烁
 */
export async function endingBlink(push, times = 3) {
  for (let i = 0; i < times; i++) {
    await push(`${ANSI.brightGreen}▌${ANSI.reset}`);
    await sleep(180);
    await push("\b ");
    await sleep(120);
  }
}

export default {
  createPusher,
  getTransition,
  glitchTransition,
  scanlineTransition,
  fadeTransition,
  lightWaveEffect,
  typewriter,
  scanDisplay,
  progressBar,
  blinkingCursor,
  bootSequence,
  animatedLine,
  endingBlink,
};
