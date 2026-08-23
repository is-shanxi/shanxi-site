import { getCollection, type CollectionEntry } from 'astro:content';
import { countBy, readingTime } from './utils';

/**
 * 内容查询层 —— 页面组件不直接调用 getCollection。
 *
 * 好处：草稿过滤、排序规则、派生字段（阅读时长）只在这里实现一次，
 * 任何页面拿到的数据形状与排序都保证一致。
 */

export type BlogPost = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;
export type Note = CollectionEntry<'notes'>;

const isProd = import.meta.env.PROD;

// ── 博客 ──────────────────────────────────────────────

/** 全部可见文章，置顶优先、其次按发布时间倒序 */
export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    isProd ? !data.draft : true,
  );

  return posts.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.published.getTime() - a.data.published.getTime();
  });
}

/** 纯按时间倒序（归档页用，置顶不参与） */
export async function getPostsByDate(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    isProd ? !data.draft : true,
  );
  return posts.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime(),
  );
}

/** 文章阅读时长（基于原始 Markdown 正文估算） */
export function getReadingTime(post: BlogPost) {
  return readingTime(post.body ?? '');
}

/** 上一篇 / 下一篇（按时间序，跳过置顶影响） */
export async function getAdjacentPosts(id: string) {
  const posts = await getPostsByDate();
  const index = posts.findIndex((p) => p.id === id);
  return {
    prev: index > 0 ? posts[index - 1]! : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1]! : null,
  };
}

/**
 * 相关文章推荐 —— 标签交集打分，同分时同分类优先。
 * 不引入向量模型，静态站点上这个启发式已经足够好用。
 */
export async function getRelatedPosts(post: BlogPost, limit = 3) {
  const posts = await getPosts();
  const tags = new Set(post.data.tags);

  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const overlap = p.data.tags.filter((t) => tags.has(t)).length;
      const sameCategory = p.data.category === post.data.category ? 0.5 : 0;
      return { post: p, score: overlap + sameCategory };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.published.getTime() - a.post.data.published.getTime(),
    )
    .slice(0, limit)
    .map((x) => x.post);
}

/** 分类统计 */
export async function getCategories() {
  const posts = await getPosts();
  return countBy(posts.map((p) => p.data.category));
}

/** 标签统计 */
export async function getTags() {
  const posts = await getPosts();
  return countBy(posts.flatMap((p) => p.data.tags));
}

// ── 作品集 ────────────────────────────────────────────

/** 按 order 升序，其次精选优先 */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.order - b.data.order;
  });
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.data.featured).slice(0, limit);
}

// ── 日志 / 碎碎念 ─────────────────────────────────────

/** 置顶优先，其次按时间倒序 */
export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes');
  return notes.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

// ── 汇总统计（侧边栏用） ──────────────────────────────

export async function getSiteStats() {
  const [posts, notes, projects] = await Promise.all([
    getPosts(),
    getNotes(),
    getProjects(),
  ]);

  const words = posts.reduce(
    (sum, p) => sum + readingTime(p.body ?? '').words,
    0,
  );

  return {
    posts: posts.length,
    notes: notes.length,
    projects: projects.length,
    words,
  };
}
