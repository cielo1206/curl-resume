// src/pageRenderer.js
// 页面渲染器 - 根据配置渲染不同类型的页面

import { sleep, ANSI } from "./utils.js";
import { generateAscii } from "./asciiGenerator.js";
import * as effects from "./effects.js";

/**
 * 渲染启动页面
 */
async function renderBootPage(push, page, config) {
  const { content } = page;
  const speed = config.speed || {};

  await push(ANSI.clear);

  // 闪烁光标
  await effects.blinkingCursor(push, 2);

  // 启动序列
  if (content.messages) {
    const messages = content.messages.map((msg, i) => {
      if (i === content.messages.length - 1) {
        return { text: msg, color: ANSI.brightGreen, delay: 30 };
      }
      return { text: msg, delay: i === 0 ? 30 : 80 };
    });
    await effects.bootSequence(push, messages);
  }

  // 进度条
  if (content.progressBar) {
    await effects.progressBar(push, { speed: speed.transition || 6 });
  }

  await sleep(200);
}

/**
 * 渲染 Logo 页面
 */
async function renderLogoPage(push, page, config) {
  const { content } = page;
  const speed = config.speed || {};

  // 获取 Logo
  let logoText;
  if (content.customAscii) {
    logoText = content.customAscii;
  } else {
    // 使用配置中的自定义 logo 或生成
    const { customLogo } = await import("./config.js");
    logoText = customLogo || generateAscii(config.name || "HELLO");
  }

  // 添加标题和副标题
  const fullLogo =
    logoText +
    `\n> ${config.title || ""}\n> ${config.subtitle || ""}`;

  const logoLines = fullLogo.split("\n");

  // 扫描显示
  await effects.scanDisplay(push, logoLines, {
    speed: 15,
    color: ANSI.brightCyan,
  });

  await sleep(300);

  // 光波效果
  if (content.showLightWave !== false) {
    await effects.lightWaveEffect(push, logoLines, speed.transition || 40);
  }

  await sleep(speed.logoDisplay || 800);
}

/**
 * 渲染内容页面
 */
async function renderContentPage(push, page, config) {
  const { content } = page;
  const speed = config.speed || {};

  // 关于我
  if (content.about) {
    await effects.typewriter(push, content.about, {
      speed: speed.typing || 12,
      pauseSpeed: speed.typingPause || 60,
    });
  }

  await sleep(80);

  // 联系方式
  if (content.contacts && content.contacts.length > 0) {
    await push(`\n${ANSI.brightCyan}## ${ANSI.bold}CONTACT${ANSI.reset}\n\n`);

    for (const c of content.contacts) {
      await push(`  ${ANSI.brightGreen}◈${ANSI.reset} `);
      await push(`${ANSI.yellow}${c.label}${ANSI.reset} `);
      await push(`${ANSI.dim}→${ANSI.reset} `);

      for (const char of c.value) {
        await push(`${ANSI.white}${char}${ANSI.reset}`);
        await sleep(6);
      }
      await push("\n");
      await sleep(40);
    }
  }

  // 结尾
  await sleep(100);
  await effects.animatedLine(push);

  // Slogan
  if (content.slogan) {
    await effects.typewriter(push, content.slogan, {
      speed: 50,
      color: `${ANSI.red}${ANSI.bold}`,
    });
    await effects.endingBlink(push);
  }

  await push("\n\n");
}

/**
 * 渲染单个页面
 */
async function renderPage(push, page, config) {
  const renderers = {
    boot: renderBootPage,
    logo: renderLogoPage,
    content: renderContentPage,
  };

  const renderer = renderers[page.type];
  if (renderer) {
    await renderer(push, page, config);
  }
}

/**
 * 渲染所有页面
 */
export async function renderAllPages(push, config) {
  const pages = config.pages || [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // 渲染页面
    await renderPage(push, page, config);

    // 执行转场效果（除了最后一页）
    if (i < pages.length - 1 && page.transition) {
      const transition = effects.getTransition(page.transition);
      await transition(push);
    }
  }
}

export default { renderAllPages, renderPage };
