import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 内容集合定义。
 *
 * 三类内容各自独立建模，schema 用 zod 做构建期校验 ——
 * 写错字段名会直接让构建失败，而不是在页面上渲染出 undefined。
 * 这是内容型站点最重要的一道可维护性防线。
 */

/** 博客：长文，支持分类、标签、置顶、草稿 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(200),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      /** 单一分类，用于侧边栏归类 */
      category: z.string().default('未分类'),
      /** 多标签，用于标签云与相关文章 */
      tags: z.array(z.string()).default([]),
      /** 置顶到列表最前 */
      pinned: z.boolean().default(false),
      /** 草稿不会出现在生产构建中 */
      draft: z.boolean().default(false),
      /** 封面图，缺省时由标题生成渐变占位 */
      cover: image().optional(),
      /** 封面图无障碍描述 */
      coverAlt: z.string().optional(),
    }),
});

/** 作品集：项目卡片，强调技术栈与产出 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(220),
    /** 起止时间，如 "2026.03 – 至今" */
    period: z.string(),
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    /** 技术栈标签，按重要性排列 */
    stack: z.array(z.string()).min(1),
    /** 我在项目中的角色 */
    role: z.string().default('独立开发'),
    /** 三条以内的关键产出，卡片上直接展示 */
    highlights: z.array(z.string()).max(4).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    /** 手动排序权重，越小越靠前 */
    order: z.number().default(99),
    /** 卡片主视觉色调，取值对应设计系统的便签色板 */
    accent: z
      .enum(['mint', 'sky', 'lemon', 'peach', 'lilac'])
      .default('mint'),
  }),
});

/** 日志（碎碎念）：短内容动态流，渲染为便签墙 */
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    date: z.coerce.date(),
    /** 心情 emoji，展示在便签角标 */
    mood: z.string().default('🌿'),
    tags: z.array(z.string()).default([]),
    /** 置顶到便签墙最前 */
    pinned: z.boolean().default(false),
    /** 便签颜色，留空则由内容哈希稳定派生 */
    color: z.enum(['mint', 'sky', 'lemon', 'peach', 'lilac']).optional(),
  }),
});

export const collections = { blog, projects, notes };
