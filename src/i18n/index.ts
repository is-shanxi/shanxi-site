import { zh, type TranslationKey } from './zh';

/**
 * i18n 极简实现 —— 预留架构，当前只注册中文。
 *
 * 增加语言的步骤（不需要改任何组件）：
 *   1. 新建 src/i18n/en.ts，导出与 zh.ts 同构的对象
 *   2. 在下方 dictionaries 中注册
 *   3. 把 LOCALES 补全，并在 astro.config.mjs 中打开 i18n 路由
 */

export const DEFAULT_LOCALE = 'zh' as const;

export const LOCALES = ['zh'] as const;
export type Locale = (typeof LOCALES)[number];

const dictionaries: Record<Locale, Record<string, string>> = {
  zh,
};

/** 供 UI 展示的语言名称 */
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '简体中文',
};

export type { TranslationKey };

/**
 * 取得指定语言的翻译函数。
 *
 * @example
 *   const t = useTranslations();
 *   t('nav.blog')                        // "博客"
 *   t('common.readingTime', { n: 6 })    // "约 6 分钟读完"
 */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

  return function t(
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string {
    let text = dict[key];

    if (text === undefined) {
      // 开发期显式暴露缺失的键，避免静默降级成空白
      if (import.meta.env.DEV) {
        console.warn(`[i18n] 缺失翻译键: ${key}`);
      }
      return key;
    }

    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }

    return text;
  };
}

/** 从路径中解析语言（当前恒返回默认语言，多语言启用后在此扩展） */
export function getLocaleFromPath(_pathname: string): Locale {
  return DEFAULT_LOCALE;
}
