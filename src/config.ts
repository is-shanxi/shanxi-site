/**
 * 站点全局配置 —— 单一真源。
 *
 * 所有页面、组件、SEO 元信息都从这里读取，避免文案与配置散落在组件内部。
 * 想改站点身份、导航、社交链接、功能开关，只需要动这一个文件。
 */

export interface NavItem {
  /** i18n 字典中的键，渲染时经 t() 翻译 */
  key: string;
  href: string;
  icon: IconName;
  /** 是否在移动端底部标签栏中展示（空间有限，只放最核心的 5 个） */
  primary?: boolean;
}

export type IconName =
  | 'home'
  | 'book'
  | 'sparkles'
  | 'user'
  | 'mail'
  | 'note'
  | 'tag'
  | 'archive'
  | 'search'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'refresh'
  | 'github'
  | 'wechat'
  | 'rss'
  | 'clock'
  | 'calendar'
  | 'link'
  | 'copy'
  | 'check'
  | 'code'
  | 'database'
  | 'cloud'
  | 'layers'
  | 'terminal'
  | 'heart'
  | 'pin'
  | 'quote'
  | 'list';

export const SITE = {
  /** 站点绝对地址，需与 astro.config.mjs 中的 site 保持一致 */
  url: 'https://shanxi.dev',
  title: '山兮的小屋',
  /** 短标题，用于 Logo 与移动端 */
  shortTitle: '山兮',
  description:
    '一个后端方向软件工程学生的自留地 —— 记录代码、生活与那些微小而确定的快乐。',
  /** 站点主题色，用于 <meta name="theme-color"> 与 PWA：日光水晶大厅 / 深海夜色 */
  themeColor: { light: '#DCE6F5', dark: '#080F27' },
  lang: 'zh-CN',
  /** OpenGraph 语言标记 */
  ogLocale: 'zh_CN',
  /** 建站时间，页脚展示 */
  since: 2026,
} as const;

export const AUTHOR = {
  name: '山兮',
  /** 英文名/ID，用于圆体字点缀 */
  handle: 'shanxi',
  avatar: '/avatar.svg',
  /** 一句话身份 */
  role: '软件工程 · 后端开发',
  location: '中国 · 江西',
  /** 首页 Banner 打字机轮播的标语（英文一一对应原中文四句） */
  taglines: [
    'See the world through code.',
    'Leave the complex to the system, the simple to the user.',
    'Building, side by side with AI.',
    'Slow is steady, steady is fast.',
  ],
  bio: '喜欢把想法拆成一行行可以运行的逻辑。日常在 Go 与 Java 之间来回，也会为了一个动画曲线调上半小时。',
} as const;

export interface SocialLink {
  key: string;
  label: string;
  icon: IconName;
  href: string;
  /** 为 true 时只展示图标、不跳转（例如微信只展示不外链） */
  displayOnly?: boolean;
  /** displayOnly 时 hover 展示的提示文本 */
  hint?: string;
}

export const SOCIALS: SocialLink[] = [
  {
    key: 'github',
    label: 'GitHub',
    icon: 'github',
    href: 'https://github.com/is-shanxi',
  },
  {
    key: 'email',
    label: '邮箱',
    icon: 'mail',
    href: 'mailto:shanxi413@gmail.com',
  },
  {
    key: 'wechat',
    label: '微信',
    icon: 'wechat',
    href: '#',
    displayOnly: true,
    hint: '微信号请通过邮件索取',
  },
  {
    key: 'rss',
    label: 'RSS',
    icon: 'rss',
    href: '/rss.xml',
  },
];

export const NAV: NavItem[] = [
  { key: 'nav.home', href: '/', icon: 'home', primary: true },
  { key: 'nav.blog', href: '/blog', icon: 'book', primary: true },
  { key: 'nav.projects', href: '/projects', icon: 'sparkles', primary: true },
  { key: 'nav.notes', href: '/notes', icon: 'note', primary: true },
  { key: 'nav.about', href: '/about', icon: 'user', primary: true },
  { key: 'nav.contact', href: '/contact', icon: 'mail' },
  { key: 'nav.archive', href: '/archive', icon: 'archive' },
];

/**
 * 功能开关 —— 所有"可选增强"集中在此，方便按需裁剪。
 * 关掉任何一项都不应该让站点报错，这是可维护性的底线。
 */
export const FEATURES = {
  /** Live2D 看板娘：默认关闭，开启需另行安装 pixi-live2d-display 与模型资源 */
  live2d: false,
  /** 上浮气泡氛围粒子（海洋主题，纯 CSS，无性能负担） */
  fireflies: true,
  /** 阅读进度条（CSS scroll-driven，无 JS） */
  readingProgress: true,
  /** Pagefind 站内搜索（构建后生成索引） */
  search: true,
  /** 文章评论（Giscus）—— 填入下方配置后置 true */
  comments: false,
  /** 页面切换动画（View Transitions API） */
  viewTransitions: true,
} as const;

/** Giscus 评论配置，FEATURES.comments 为 true 时生效 */
export const GISCUS = {
  repo: 'is-shanxi/blog-comments',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
} as const;

/** 列表分页大小 */
export const PAGE_SIZE = {
  blog: 8,
  projects: 9,
  notes: 20,
} as const;
