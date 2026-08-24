# 山兮的小屋 · shanxi-site

> 一个后端方向软件工程学生的自留地 —— 记录代码、生活与那些微小而确定的快乐。

纯静态个人站点，Astro 从零搭建，零后端、零动画库。古典洛丽塔视觉风格，海军蓝与鎏金双主题，把「代码、生活、二次元」装进同一栋房子。

**线上地址**: [shanxi.dev](https://shanxi.dev)

---

## 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | [Astro 7](https://astro.build) | 内容驱动型静态站点框架，Islands 架构 |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com) | 原子化 CSS，Vite 插件模式集成 |
| 语言 | TypeScript 5.7+ | strict 模式全量启用 |
| 内容 | Astro Content Collections + MDX | Zod schema 构建期校验 |
| 搜索 | [Pagefind](https://pagefind.app) | 构建后生成静态索引，零运行时成本 |
| 字体 | Quicksand + Playfair Display + Noto Serif SC | Google Fonts CDN，display=swap |
| 代码高亮 | Shiki | github-light / night-owl 双主题 |
| SEO | @astrojs/sitemap + @astrojs/rss + OpenGraph | 全套元信息 |

---

## 功能特性

### 核心架构

- **纯静态零后端**：构建产物为纯 HTML/CSS/JS，可部署到任意静态托管
- **单一配置源**：站点身份、导航、社交链接、功能开关集中在 `src/config.ts`，改一个文件即改全站
- **内容集合建模**：Blog / Projects / Notes 三类内容各自独立 schema，Zod 构建期校验，字段写错直接构建失败
- **内容查询层**：`src/lib/content.ts` 统一封装草稿过滤、排序规则、派生字段，页面组件不直接调用 `getCollection`
- **i18n 预留架构**：所有界面文案走 `src/i18n/` 字典，组件内不写死中文；当前只注册 zh-CN，增加语言只需新建字典文件

### 视觉与交互

- **双主题**：日光水晶大厅（light） / 深海夜色（dark），`.dark` 类策略 + 阻塞式预置脚本，杜绝主题闪烁
- **零动画库**：滚动揭示、阅读进度条、视差全部用 CSS scroll-driven animations 原生实现，IntersectionObserver 仅作不支持时的兜底
- **View Transitions**：页面切换用浏览器原生 API，淡入上移动画
- **打字机标语**：首页 Hero 标语轮播，纯 JS 实现，尊重 `prefers-reduced-motion`
- **气泡氛围粒子**：纯 CSS 气泡上浮效果，无性能负担
- **代码块一键复制**：渐进增强注入，hover 显示
- **目录高亮**：文章页 TOC 随滚动自动高亮当前章节
- **交互月历**：侧边栏日历组件，有文章的日期可点击跳转归档

### 布局

- **双侧边栏**：桌面端三栏布局（左栏 250px / 主内容 / 右栏 264px）
  - 左栏：站长名片 / 公告 / 分类 / 标签
  - 右栏：运行状态 / 站点信息 / 交互月历 / 最近碎碎念
- **响应式断点**：≥1100px 三栏 → 860–1099px 两栏（右栏收起） → <860px 单栏（侧栏隐藏，走抽屉 + 底部标签栏）
- **移动端底部标签栏**：5 个核心导航入口
- **无障碍**：skip-link、ARIA 标签、`prefers-reduced-motion` 全量尊重

### 内容

- **博客**：长文，支持分类、标签、置顶、草稿、封面图、阅读时长估算、相关文章推荐（标签交集打分）
- **作品集**：项目卡片，技术栈标签、状态标记、精选、手动排序、便签色板主视觉
- **日志（碎碎念）**：短内容动态流，便签墙渲染，心情 emoji、便签颜色由内容哈希稳定派生
- **归档**：按时间线回溯全部文章，支持日期筛选
- **RSS 订阅**：`/rss.xml`
- **站内搜索**：Pagefind 构建期索引，`/search` 对话框

### SEO

- OpenGraph + Twitter Card 元信息
- Canonical URL
- Sitemap（自动过滤 404 页面）
- JSON-LD 结构化数据
- `theme-color` 跟随主题切换

---

## 项目结构

```
shanxi-site/
├── astro.config.mjs          # Astro 配置（站点 URL、集成、Shiki、预取）
├── package.json
├── tsconfig.json             # strict 模式 + 路径别名
├── scripts/
│   ├── build.mjs             # 程序化构建入口（绕过沙箱 safe-delete 拦截）
│   ├── serve.mjs             # 本地预览服务器
│   ├── screenshot*.mjs        # 截图验证脚本
│   └── verify-*.mjs          # 视觉回归验证
├── public/                   # 静态资源（favicon、OG 图、吉祥物）
└── src/
    ├── config.ts             # 站点全局配置 —— 单一真源
    ├── content.config.ts     # 内容集合 schema 定义
    ├── layouts/
    │   ├── BaseLayout.astro  # HTML 骨架 + SEO 元信息 + 主题预置
    │   └── PageLayout.astro  # 双侧边栏框架
    ├── components/
    │   ├── home/             # 首页 Hero
    │   ├── layout/           # Header / Footer / Drawer / MobileTabBar / SearchDialog
    │   ├── sidebar/          # 侧边栏卡片组件群
    │   └── ui/               # 通用 UI 组件（Icon / Card / TOC / BackToTop 等）
    ├── content/
    │   ├── blog/             # 博客文章（Markdown）
    │   ├── projects/         # 项目卡片（Markdown）
    │   └── notes/            # 碎碎念便签（Markdown）
    ├── lib/
    │   ├── content.ts        # 内容查询层
    │   └── utils.ts          # 工具函数（日期格式化 / 阅读时长 / 哈希等）
    ├── i18n/
    ├── scripts/
    │   ├── enhance.ts        # 渐进增强 —— 全站唯一客户端逻辑入口
    │   └── theme.ts         # 主题切换逻辑
    ├── styles/
    │   └── global.css        # 设计令牌 + 全局样式
    └── pages/
        ├── index.astro       # 首页
        ├── blog/             # 博客列表 + 文章详情
        ├── projects/         # 作品集列表 + 项目详情
        ├── notes/            # 碎碎念便签墙
        ├── about.astro       # 关于我
        ├── contact.astro     # 联系方式
        ├── archive.astro     # 归档
        ├── 404.astro
        └── rss.xml.ts        # RSS 生成
```

---

## 设计系统

视觉主题为「鲸鱼娘·深海女仆工坊」，古典洛丽塔风格：

| 主题 | 名称 | 色调 |
|------|------|------|
| 浅色 | 日光水晶大厅 | 瓷白 `#f8f6f0` + 长春花蓝 `#526aa8` + 鎏金 `#c5a468` |
| 深色 | 深海夜色 | 深海军蓝 `#080F27` + 月白 + 鎏金 |

设计令牌全部定义在 `src/styles/global.css` 的 `:root` 与 `.dark` 中，语义化命名（`--brand` / `--gold` / `--surface` / `--shadow` 等），组件内不写死色值。

便签调色板（洛丽塔互补色系）：奶油 / 瓷蓝 / 玫瑰 / 丁香 / 鼠尾草。

---

## 快速开始

### 环境要求

- Node.js 18+ （推荐 22+）
- npm

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview

# 类型检查
npm run check
```

构建产物输出到 `dist/`，构建后自动运行 Pagefind 生成搜索索引。

### 自定义配置

修改 `src/config.ts` 一个文件即可完成全站定制：

- `SITE`：站点标题、描述、URL、主题色、语言
- `AUTHOR`：站长信息、标语、简介
- `SOCIALS`：社交链接
- `NAV`：导航菜单
- `FEATURES`：功能开关（气泡粒子 / 阅读进度 / 搜索 / 评论 / View Transitions）
- `PAGE_SIZE`：列表分页大小

### 添加内容

```bash
# 新建博客文章
# 在 src/content/blog/ 下创建 YYYY-title.md
# frontmatter 需包含 title / description / published / category / tags

# 新建项目卡片
# 在 src/content/projects/ 下创建 name.md

# 新建碎碎念
# 在 src/content/notes/ 下创建 YYYY-MM-DD-title.md
```

---

## 许可协议

- 代码部分：MIT License
- 文章内容：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## 作者

**山兮** · 软件工程 · 后端开发

- GitHub: [@is-shanxi](https://github.com/is-shanxi)
- Email: shanxi413@gmail.com
- Site: [shanxi.dev](https://shanxi.dev)

> 用代码看世界，视 AI 为并肩开拓的伙伴。
