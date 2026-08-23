import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPostsByDate } from '@/lib/content';

/**
 * RSS 订阅源。
 * 只输出摘要不输出全文 —— 让订阅者知道更新了什么，正文回站点读。
 */
export async function GET(context: APIContext) {
  const posts = await getPostsByDate();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/blog/${post.id}`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
