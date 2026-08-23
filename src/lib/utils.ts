/** 通用工具函数集合 —— 保持纯函数、零副作用，方便单测与复用。 */

/**
 * 合并 class 名，自动过滤 falsy 值。
 * 比引入 clsx 更轻，且对本项目的使用场景足够。
 */
export function cx(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/** 格式化日期为 "2026年8月10日" */
export function formatDate(date: Date, locale = 'zh-CN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** 格式化为紧凑形式 "08-10" */
export function formatDateShort(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

/** 机器可读的 ISO 日期，用于 <time datetime> */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/** 相对时间："3 天前" / "刚刚" */
export function formatRelative(date: Date, now = new Date()): string {
  const diff = now.getTime() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))} 个月前`;
  return `${Math.floor(diff / (365 * day))} 年前`;
}

/**
 * 估算中文为主内容的阅读时长。
 * 中文按 350 字/分钟，英文单词按 220 词/分钟，取两者之和。
 */
export function readingTime(content: string): { minutes: number; words: number } {
  const cjk = (content.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) ?? []).length;
  const latin = (content.match(/[A-Za-z0-9]+/g) ?? []).length;
  const minutes = Math.max(1, Math.round(cjk / 350 + latin / 220));
  return { minutes, words: cjk + latin };
}

/** 站点已运行天数 */
export function daysSince(year: number): number {
  const start = new Date(year, 0, 1).getTime();
  return Math.max(1, Math.floor((Date.now() - start) / 86_400_000));
}

/** 根据当前小时返回问候语的 i18n 键 */
export function greetingKey(hour = new Date().getHours()) {
  if (hour < 5) return 'home.greeting.night' as const;
  if (hour < 11) return 'home.greeting.morning' as const;
  if (hour < 13) return 'home.greeting.noon' as const;
  if (hour < 18) return 'home.greeting.afternoon' as const;
  if (hour < 23) return 'home.greeting.evening' as const;
  return 'home.greeting.night' as const;
}

/**
 * 由字符串派生一个稳定的整数（FNV-1a 变体）。
 * 用于给便签分配"随机但固定"的颜色与倾斜角 —— 必须稳定，
 * 否则服务端渲染与客户端水合会出现视觉抖动。
 */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** 从数组中按稳定哈希取一项 */
export function pickByHash<T>(items: readonly T[], seed: string): T {
  return items[hashString(seed) % items.length]!;
}

/** 数组去重并按出现频次降序 */
export function countBy(items: string[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

/** 按年份分组 */
export function groupByYear<T>(
  items: T[],
  getDate: (item: T) => Date,
): { year: number; items: T[] }[] {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const year = getDate(item).getFullYear();
    const bucket = map.get(year);
    if (bucket) bucket.push(item);
    else map.set(year, [item]);
  }
  return [...map.entries()]
    .map(([year, list]) => ({ year, items: list }))
    .sort((a, b) => b.year - a.year);
}

/** 生成 URL 安全的 slug，兼容中文（中文直接保留，仅做空白与符号清理） */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 截断文本并补省略号（按显示宽度粗略估算，中文算 2） */
export function truncate(text: string, maxWidth = 120): string {
  let width = 0;
  let i = 0;
  for (; i < text.length; i++) {
    width += /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(text[i]!) ? 2 : 1;
    if (width > maxWidth) break;
  }
  return i < text.length ? text.slice(0, i).trimEnd() + '…' : text;
}
