// src/content.js
// 简历数据 - 简洁版

import { logo } from "./ascii-logo.js";

export const resume = {
  header: logo,

  about: `
🐟🐠🐡🐋🐬🦈🐙🦐🐳🦞
钓鱼是我最喜欢的活动, 在河边能够感受到一种真正的平静.
钓鱼是付出和等待的艺术, 这是很少有人具备的品质.
`,
  contact: `
## 联系方式

- GitHub: https://github.com/Disdjj
- Blog: https://blog.pdjjq.org
- Email: shuaiqijianhao@qq.com

`,

  footer: `
---
> 反抗吧，朋友！
`,
};

// 固定引言
export function getQuote() {
  return "反抗吧，朋友！";
}
