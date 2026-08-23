/**
 * 简体中文文案字典。
 *
 * 约定：所有出现在界面上的固定文案都必须走这里，组件内不写死中文。
 * 未来增加英文只需新建 en.ts 并在 index.ts 注册，无需改动任何组件。
 */
export const zh = {
  // ── 导航 ─────────────────────────────
  'nav.home': '首页',
  'nav.blog': '博客',
  'nav.projects': '作品集',
  'nav.notes': '日志',
  'nav.about': '关于我',
  'nav.contact': '联系',
  'nav.archive': '归档',

  // ── 通用 ─────────────────────────────
  'common.readMore': '继续阅读',
  'common.more': '更多',
  'common.all': '全部',
  'common.back': '返回',
  'common.backToTop': '回到顶部',
  'common.loading': '加载中',
  'common.empty': '这里暂时空空如也',
  'common.emptyHint': '内容正在路上，先去别处逛逛？',
  'common.copy': '复制',
  'common.copied': '已复制',
  'common.words': '字',
  'common.minutes': '分钟',
  'common.readingTime': '约 {n} 分钟读完',
  'common.publishedOn': '发布于',
  'common.updatedOn': '更新于',
  'common.prev': '上一篇',
  'common.next': '下一篇',
  'common.page': '第 {n} 页',

  // ── 主题 ─────────────────────────────
  'theme.toggle': '切换主题',
  'theme.light': '浅色',
  'theme.dark': '深色',
  'theme.auto': '跟随系统',

  // ── 首页 ─────────────────────────────
  'home.greeting.morning': '早上好',
  'home.greeting.noon': '中午好',
  'home.greeting.afternoon': '下午好',
  'home.greeting.evening': '晚上好',
  'home.greeting.night': '夜深了',
  'home.scrollHint': '向下滚动',
  'home.latestPosts': '最新文章',
  'home.featuredProjects': '精选作品',
  'home.recentNotes': '最近碎碎念',
  'home.skills': '技能树',
  'home.viewAll': '查看全部',

  // ── 侧边栏 ───────────────────────────
  'sidebar.profile': '关于站长',
  'sidebar.categories': '分类',
  'sidebar.tags': '标签',
  'sidebar.announcement': '公告',
  'sidebar.announcementText': '欢迎来到我的小屋 🌿 这里会随手记录一些代码、生活，和那些微小而确定的快乐。',
  'sidebar.toc': '目录',
  'sidebar.stats': '小统计',
  'sidebar.stats.posts': '文章',
  'sidebar.stats.notes': '碎碎念',
  'sidebar.stats.projects': '作品',
  'sidebar.stats.days': '运行天数',
  'sidebar.nowPlaying': '此刻',
  'sidebar.runtime': '运行状态',
  'sidebar.runtime.uptime': '运行时长',
  'sidebar.runtime.lastActive': '最后活动',
  'sidebar.siteInfo': '站点信息',
  'sidebar.siteInfo.platform': '构建平台',
  'sidebar.siteInfo.version': '博客版本',
  'sidebar.siteInfo.license': '文章许可',
  'sidebar.unit.day': '天',
  'sidebar.unit.daysAgo': '{n} 天前',

  // ── 博客 ─────────────────────────────
  'blog.title': '博客',
  'blog.subtitle': '把踩过的坑写下来，就变成了路',
  'blog.pinned': '置顶',
  'blog.draft': '草稿',
  'blog.category': '分类',
  'blog.tags': '标签',
  'blog.postCount': '共 {n} 篇文章',
  'blog.tocTitle': '本文目录',
  'blog.relatedPosts': '相关文章',
  'blog.license': '本文采用 CC BY-NC-SA 4.0 许可协议，转载请注明出处。',

  // ── 作品集 ───────────────────────────
  'projects.title': '作品集',
  'projects.subtitle': '一些做出来了、并且还在跑着的东西',
  'projects.status.active': '维护中',
  'projects.status.archived': '已归档',
  'projects.status.wip': '开发中',
  'projects.viewSource': '源码',
  'projects.viewLive': '预览',
  'projects.stack': '技术栈',
  'projects.featured': '精选',

  // ── 日志 / 碎碎念 ────────────────────
  'notes.title': '日志',
  'notes.subtitle': '一些不值得写成文章、但舍不得丢掉的瞬间',
  'notes.count': '共 {n} 条',
  'notes.mood': '心情',

  // ── 关于 ─────────────────────────────
  'about.title': '关于我',
  'about.subtitle': '你好，很高兴在这里遇见你',
  'about.timeline': '时间线',
  'about.skills': '技能',
  'about.nowSection': '最近在做',

  // ── 联系 ─────────────────────────────
  'contact.title': '联系方式',
  'contact.subtitle': '有任何想聊的，都欢迎找我',
  'contact.emailMe': '给我写信',
  'contact.responseTime': '通常 24 小时内回复',
  'contact.copyEmail': '复制邮箱地址',

  // ── 归档 ─────────────────────────────
  'archive.title': '归档',
  'archive.subtitle': '按时间回溯的全部文章',
  'archive.yearCount': '{n} 篇',
  'archive.filteredBy': '仅看 {date} 的更新',
  'archive.clearFilter': '清除筛选',

  // ── 侧栏日历组件 ─────────────────────
  'calendar.title': '日历',
  'calendar.prevMonth': '上个月',
  'calendar.nextMonth': '下个月',
  'calendar.backToToday': '回到今天',
  'calendar.hasPost': '这天有更新',

  // ── 搜索 ─────────────────────────────
  'search.placeholder': '搜索文章…',
  'search.open': '搜索',
  'search.noResult': '没有找到匹配的内容',
  'search.hint': '试试换个关键词',

  // ── 404 ──────────────────────────────
  'notFound.title': '走丢了',
  'notFound.desc': '这个页面可能已经被搬走，或者从来就没存在过。',
  'notFound.action': '回首页',

  // ── 页脚 ─────────────────────────────
  'footer.builtWith': '由 Astro 驱动',
  'footer.copyright': '© {since}–{year} {author}',
  'footer.poweredBy': '内容采用 CC BY-NC-SA 4.0 协议',
} as const;

export type TranslationKey = keyof typeof zh;
