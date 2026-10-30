<p align="center">
  <a href="https://emiriobaan.top/">
    <img src="./docs/.vuepress/public/logo.svg" alt="GearPress 渐变 Logo" width="180">
  </a>
</p>

<p align="center">
  <img src="./.github/assets/gearpress-title.svg" alt="GearPress" width="320">
</p>

<p align="center">日积月累，终见其深</p>

<p align="center">
  <a href="https://github.com/EmirioBomb">
    <img src="https://img.shields.io/badge/author-EmirioBomb-7096C2?style=flat-square&labelColor=0D1B2A" alt="作者 EmirioBomb">
  </a>
   <img alt="version" src="https://img.shields.io/badge/version-v2.13.3-7096C2?style=flat-square&labelColor=0D1B2A">
  <a href="https://emiriobomb.github.io/GearPress/">
    <img src="https://img.shields.io/badge/HomePage-GearPress-7096C2?style=flat-square&labelColor=0D1B2A" alt="访问 GearPress">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-7096C2?style=flat-square&labelColor=0D1B2A" alt="MIT 许可证">
  </a>
</p>

---

> [!NOTE]
> **GearPress** 是我长期维护的个人笔记与博客。这里记录开发过程中真正遇到的问题、使用过的工具，以及一些值得留下来的想法。内容不追求面面俱到，更重视真实。
>

## 🧭 从这里开始

- 📝 **[博客](https://emiriobaan.top/blog/)**：相对完整的文章、组件实践与阶段性总结。
- 🧭 **[导航](https://emiriobaan.top/navigation/)**：经过筛选并持续整理的网站、应用与开发资源。
- 📒 **[随记](https://emiriobaan.top/notes/)**：记录配置步骤、排查过程与使用经验。
- 👤 **[关于我](https://emiriobaan.top/notes/about-me/)**：个人技术方向、常用工具，以及游戏和其他偏好。

## 💻 本地运行

<table>
  <thead>
    <tr>
      <th scope="col">运行环境</th>
      <th scope="col">包管理器</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://nodejs.org/">Node.js 24 LTS</a></td>
      <td>pnpm 8.10.0</td>
    </tr>
  </tbody>
</table>

### 安装与启动

<details open>
<summary><strong>pnpm</strong></summary>

```bash
npm install --global pnpm@8.10.0

git clone https://github.com/EmirioBomb/GearPress.git
cd GearPress
pnpm install --frozen-lockfile
pnpm docs:dev
```

</details>

## 💬 阅读与反馈

> [!TIP]
> 如果内容对你有所帮助，欢迎收藏或分享。发现信息过时、链接失效或表达不清，也可以通过 [Issues](https://github.com/EmirioBomb/GearPress/issues) 告诉我。
>
> 查看本站的 [更新记录](./CHANGELOG.md)。

## 🛠️ 关于本站

**GearPress** 使用 [VuePress 2](https://v2.vuepress.vuejs.org/) 与 [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume) 构建，并在此基础上加入了个人主页、工具导航和自定义交互组件。

感谢所有为本站提供灵感与能力的开源项目。
