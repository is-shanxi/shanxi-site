/**
 * 渐进增强脚本 —— 全站唯一的客户端逻辑入口。
 *
 * 设计原则：这里的每一行都是"锦上添花"，禁用 JS 后页面必须依然完整可读。
 * 滚动动画优先交给 CSS scroll-driven animations，
 * 只有在浏览器不支持时才启用 IntersectionObserver 兜底。
 */

import { initTheme, toggleTheme, getStoredTheme, resolveTheme } from './theme';

/** 浏览器是否原生支持滚动驱动动画 */
const supportsScrollTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. 入场揭示兜底 ───────────────────────────────────
let revealObserver: IntersectionObserver | null = null;

function setupReveal() {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');

  // 原生支持或用户要求减少动效时，直接放行，不做任何 JS 工作
  if (supportsScrollTimeline || prefersReducedMotion()) {
    if (prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add('is-visible'));
    }
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );

  targets.forEach((el) => revealObserver!.observe(el));
}

// ── 2. 阅读进度条兜底 ─────────────────────────────────
function setupReadingProgress() {
  const bar = document.querySelector<HTMLElement>('.reading-progress');
  if (!bar || supportsScrollTimeline) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

// ── 3. 主题切换按钮 ───────────────────────────────────
function setupThemeToggles() {
  document
    .querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')
    .forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        // 支持时用 View Transition 做一次柔和的主题渐变
        if (document.startViewTransition && !prefersReducedMotion()) {
          document.startViewTransition(() => toggleTheme());
        } else {
          toggleTheme();
        }
      });
    });

  syncThemeButtonLabel();
  window.addEventListener('themechange', syncThemeButtonLabel);
}

function syncThemeButtonLabel() {
  const resolved = resolveTheme(getStoredTheme());
  document
    .querySelectorAll<HTMLElement>('[data-theme-toggle]')
    .forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        resolved === 'dark' ? '切换到浅色主题' : '切换到深色主题',
      );
      btn.setAttribute('aria-pressed', String(resolved === 'dark'));
    });
}

// ── 4. 移动端抽屉导航 ─────────────────────────────────
function setupDrawer() {
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  const openBtn = document.querySelector<HTMLElement>('[data-drawer-open]');
  const closeEls = document.querySelectorAll<HTMLElement>('[data-drawer-close]');
  if (!drawer || !openBtn) return;

  const setOpen = (open: boolean) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  openBtn.addEventListener('click', () => setOpen(true));
  closeEls.forEach((el) => el.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// ── 5. 目录高亮（文章页） ─────────────────────────────
let tocObserver: IntersectionObserver | null = null;

function setupTOC() {
  const toc = document.querySelector<HTMLElement>('[data-toc]');
  if (!toc) return;

  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  if (links.length === 0) return;

  const headings = links
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter((el): el is HTMLElement => el !== null);

  tocObserver?.disconnect();
  tocObserver = new IntersectionObserver(
    (entries) => {
      // 取当前视口内最靠上的标题作为激活项
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;

      const id = visible.target.id;
      links.forEach((link) => {
        const active = decodeURIComponent(link.hash.slice(1)) === id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-72px 0px -70% 0px', threshold: 0 },
  );

  headings.forEach((h) => tocObserver!.observe(h));
}

// ── 6. 代码块一键复制 ─────────────────────────────────
function setupCodeCopy() {
  document.querySelectorAll<HTMLPreElement>('.prose pre').forEach((pre) => {
    if (pre.dataset.copyBound === '1') return;
    pre.dataset.copyBound = '1';
    pre.style.position = 'relative';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', '复制代码');
    btn.textContent = '复制';

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制';
        btn.classList.add('is-done');
        setTimeout(() => {
          btn.textContent = '复制';
          btn.classList.remove('is-done');
        }, 1600);
      } catch {
        btn.textContent = '复制失败';
        setTimeout(() => (btn.textContent = '复制'), 1600);
      }
    });

    pre.appendChild(btn);
  });
}

// ── 7. 回到顶部 ───────────────────────────────────────
function setupBackToTop() {
  const btn = document.querySelector<HTMLElement>('[data-back-to-top]');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('is-shown', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });
  toggle();
}

// ── 8.5 侧栏数字时钟（实时，每秒） ─────────────────────
const clockTimers = new WeakMap<HTMLElement, number>();

function setupClock() {
  const roots = document.querySelectorAll<HTMLElement>('[data-clock]');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  roots.forEach((root) => {
    const timeEl = root.querySelector<HTMLElement>('[data-clock-time]');
    const dateEl = root.querySelector<HTMLElement>('[data-clock-date]');
    if (!timeEl || !dateEl) return;

    const pad = (n: number) => String(n).padStart(2, '0');
    const update = () => {
      const d = new Date();
      timeEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      dateEl.textContent = `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 星期${weekdays[d.getDay()]}`;
    };

    update();
    // 每个根节点仅持有一个定时器，避免 astro:page-load 重复创建
    if (!clockTimers.has(root)) {
      clockTimers.set(root, window.setInterval(update, 1000));
    }
  });
}

// ── 8.6 侧栏交互月历 ─────────────────────────────────
function setupCalendar() {
  const roots = document.querySelectorAll<HTMLElement>('[data-calendar]');

  roots.forEach((root) => {
    const grid = root.querySelector<HTMLElement>('[data-cal-grid]');
    const monthLabel = root.querySelector<HTMLElement>('[data-cal-month]');
    if (!grid || !monthLabel) return;

    let postDates: string[] = [];
    try {
      postDates = JSON.parse(root.dataset.postDates || '[]');
    } catch {
      postDates = [];
    }
    const hasPost = (iso: string) => postDates.includes(iso);
    const hasPostTitle = root.dataset.haspostTitle ?? '这天有更新';

    const realNow = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

    // 视图状态持久化在元素 dataset，跨 astro:page-load 不会重置
    let viewYear: number;
    let viewMonth: number;
    if (root.dataset.calYear && root.dataset.calMonth) {
      viewYear = Number(root.dataset.calYear);
      viewMonth = Number(root.dataset.calMonth);
    } else {
      viewYear = realNow.getFullYear();
      viewMonth = realNow.getMonth();
    }
    const todayIso = isoOf(realNow.getFullYear(), realNow.getMonth(), realNow.getDate());

    const buildCells = (year: number, month: number): string => {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();

      let html = '';
      for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="cal-cell is-out"><span>${prevDays - i}</span></div>`;
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const iso = isoOf(year, month, d);
        const isToday = iso === todayIso;
        const post = hasPost(iso);
        const cls = `cal-cell${isToday ? ' is-today' : ''}${post ? ' has-post' : ''}`;
        const inner = post
          ? `<a class="cal-link" href="/archive?date=${iso}" title="${hasPostTitle}">${d}</a>`
          : `<span>${d}</span>`;
        html += `<div class="${cls}">${inner}</div>`;
      }
      const total = firstDay + daysInMonth;
      const trail = (7 - (total % 7)) % 7;
      for (let i = 1; i <= trail; i++) {
        html += `<div class="cal-cell is-out"><span>${i}</span></div>`;
      }
      return html;
    };

    const render = () => {
      monthLabel!.textContent = `${viewYear}年${viewMonth + 1}月`;
      grid!.innerHTML = buildCells(viewYear, viewMonth);
      root.dataset.calYear = String(viewYear);
      root.dataset.calMonth = String(viewMonth);
    };

    // 每元素仅绑定一次（dataset.bound 守卫，兼容 View Transitions 换页）
    root
      .querySelectorAll<HTMLButtonElement>('[data-cal-prev], [data-cal-next], [data-cal-today]')
      .forEach((btn) => {
        if (btn.dataset.bound === '1') return;
        btn.dataset.bound = '1';
        btn.addEventListener('click', () => {
          if (btn.hasAttribute('data-cal-prev')) {
            viewMonth--;
            if (viewMonth < 0) {
              viewMonth = 11;
              viewYear--;
            }
          } else if (btn.hasAttribute('data-cal-next')) {
            viewMonth++;
            if (viewMonth > 11) {
              viewMonth = 0;
              viewYear++;
            }
          } else {
            viewYear = realNow.getFullYear();
            viewMonth = realNow.getMonth();
          }
          render();
        });
      });

    if (monthLabel.dataset.bound !== '1') {
      monthLabel.dataset.bound = '1';
      monthLabel.addEventListener('click', () => {
        viewYear = realNow.getFullYear();
        viewMonth = realNow.getMonth();
        render();
      });
    }

    render();
  });
}

// ── 8. 首页标语打字机 ─────────────────────────────────
function setupTypewriter() {
  const el = document.querySelector<HTMLElement>('[data-typewriter]');
  if (!el) return;

  let lines: string[] = [];
  try {
    lines = JSON.parse(el.dataset.typewriter || '[]');
  } catch {
    return;
  }
  if (lines.length === 0) return;

  // 减少动效时直接展示第一句，不做动画
  if (prefersReducedMotion()) {
    el.textContent = lines[0]!;
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const line = lines[lineIndex % lines.length]!;
    charIndex += deleting ? -1 : 1;
    el.textContent = line.slice(0, charIndex);

    let delay = deleting ? 45 : 110;
    if (!deleting && charIndex === line.length) {
      delay = 1900;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      lineIndex++;
      delay = 420;
    }
    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 700);
}

// ── 初始化编排 ────────────────────────────────────────
function init() {
  setupReveal();
  setupReadingProgress();
  setupThemeToggles();
  setupDrawer();
  setupTOC();
  setupCodeCopy();
  setupBackToTop();
  setupTypewriter();
  setupClock();
  setupCalendar();
}

initTheme();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

// View Transitions 导航后需要重新绑定（DOM 已被替换）
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', () => {
  // 换页后立刻恢复主题，避免主题闪烁
  initTheme();
});
