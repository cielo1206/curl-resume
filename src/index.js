// src/index.js
// Cloudflare Worker 入口文件 - 支持流式动画

import { config } from "./config.js";
import { streamResume } from "./streamHandler.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const params = url.searchParams;

    // 获取 User-Agent 检测是否为 curl
    const userAgent = request.headers.get("User-Agent") || "";
    const isCurl = userAgent.toLowerCase().includes("curl");

    // 非 curl 访问 - 显示 HTML 页面
    if (!isCurl) {
      const htmlResponse = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${config.name} - ${config.title}</title>
  <style>
    body {
      background: #0d1117;
      color: #c9d1d9;
      font-family: 'Fira Code', 'Courier New', monospace;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container { text-align: center; padding: 2rem; }
    h1 { color: #58a6ff; }
    code {
      background: #161b22;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: #7ee787;
      display: inline-block;
      margin: 0.5rem;
    }
    .slogan { color: #f85149; font-style: italic; margin-top: 1rem; }
    .hint { color: #8b949e; font-size: 0.9rem; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.name} - ${config.title}</h1>
    <p class="slogan">${config.pages[2]?.content?.slogan || ""}</p>
    <p>请使用 curl 访问:</p>
    <code>curl -N me.pdjjq.org</code>
    <p class="hint">-N 参数开启流式动画效果</p>
  </div>
</body>
</html>`;
      return new Response(htmlResponse, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // 流式动画模式
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // 启动异步流式输出
    ctx.waitUntil(
      (async () => {
        try {
          await streamResume(writer);
        } catch (e) {
          console.error("Stream error:", e);
          await writer.abort(e);
        }
      })()
    );

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
