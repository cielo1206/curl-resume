// src/streamHandler.js
// 流式动画处理器 - 主入口

import { encoder } from "./utils.js";
import { config } from "./config.js";
import { renderAllPages } from "./pageRenderer.js";

/**
 * 流式输出简历 - 基于配置渲染
 */
export async function streamResume(writer) {
  const push = (text) => writer.write(encoder.encode(text));

  try {
    await renderAllPages(push, config);
  } catch (error) {
    console.error("Render error:", error);
  }

  await writer.close();
}

export default { streamResume };
