/**
 * 主题切换。
 *
 * 三态模型：light / dark / auto。
 * 默认（auto）= 深海藏蓝工坊（dark）；仅显式选择 light 时进入昼间奶白。
 * 真正的"当前是亮还是暗"由 <html class="dark"> 决定，
 * 用户的显式选择存 localStorage，优先级高于一切。
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export const THEME_KEY = 'shanxi-theme';

/** 读取用户的显式选择；未选择过时返回 auto */
export function getStoredTheme(): ThemeMode {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : 'auto';
  } catch {
    return 'auto';
  }
}

/** 给定模式解析出实际生效的明暗；auto 默认深海藏蓝工坊（dark） */
export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'auto') return mode;
  return 'dark';
}

/** 应用到 DOM：切 class + 同步 theme-color，供移动端浏览器 UI 着色 */
export function applyTheme(mode: ThemeMode): 'light' | 'dark' {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.theme = mode;

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (meta) {
    meta.content = resolved === 'dark' ? '#0F2040' : '#F8F5F0';
  }

  return resolved;
}

/** 持久化并应用 */
export function setTheme(mode: ThemeMode) {
  try {
    if (mode === 'auto') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* 隐私模式下 localStorage 不可用，忽略即可，本次会话仍然生效 */
  }

  const resolved = applyTheme(mode);
  window.dispatchEvent(
    new CustomEvent('themechange', { detail: { mode, resolved } }),
  );
}

/** 在 light / dark 之间切换（当前处于 auto 时，切到与系统相反的一侧） */
export function toggleTheme() {
  const current = resolveTheme(getStoredTheme());
  setTheme(current === 'dark' ? 'light' : 'dark');
}

/** 初始化：应用当前主题（auto 已固定解析为 dark，无需系统监听） */
export function initTheme() {
  applyTheme(getStoredTheme());
}
