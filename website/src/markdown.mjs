/**
 * Markdown twin of every page, for agents and answer engines.
 *
 * The HTML is generated, so its shape is known: one <main>, headings, short
 * paragraphs, lists, definition lists and disclosure FAQs. This turns that
 * into plain Markdown with absolute links, a YAML front matter with the page
 * facts, and nothing decorative. llms.txt links to these files, and
 * llms-full.txt concatenates them, as the llms.txt convention suggests.
 */

import { absolute } from './html.mjs';
import site from '../content/site.mjs';

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#183;/g, '·');

const strip = (s) => decode(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const abs = (href) => (href.startsWith('/') ? absolute(site.origin, href) : href);

export function pageToMarkdown(page, html) {
  let main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';

  main = main
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<video[\s\S]*?<\/video>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/<button[\s\S]*?<\/button>/gi, '')
    /* Decorative images carry an empty alt and say nothing in text. */
    .replace(/<img[^>]*alt=""[^>]*>/gi, '')
    /* Decorative duplicates (marquee copies, glare spans, tab strips). */
    .replace(/<(ul|div|span|li|figure)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<picture>[\s\S]*?(<img[^>]*>)[\s\S]*?<\/picture>/gi, '$1')
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/gi, (m, alt, src) => `![${alt}](${abs(src)})`)
    .replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, (m, src, alt) => `![${alt}](${abs(src)})`)
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
      const label = strip(text);
      return label ? `[${label}](${abs(href)})` : '';
    })
    /* A list item that is a titled block becomes one bold-led line. */
    .replace(/<li[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi, (m, t, b) => `\n- **${strip(t)}:** ${strip(b)}`)
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m, t) => `\n# ${strip(t)}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (m, t) => `\n## ${strip(t)}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (m, t) => `\n### ${strip(t)}\n`)
    .replace(/<summary[^>]*>([\s\S]*?)<\/summary>/gi, (m, t) => `\n**${strip(t)}**\n`)
    .replace(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi, (m, t, d) => `\n- **${strip(t)}:** ${strip(d)}`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, t) => `\n- ${strip(t)}`)
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, t) => `\n${strip(t)}\n`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**');

  const body = decode(main.replace(/<[^>]+>/g, '\n'))
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const front = [
    '---',
    `title: "${page.title.replace(/"/g, '\\"')}"`,
    `description: "${page.description.replace(/"/g, '\\"')}"`,
    `url: ${absolute(site.origin, page.path)}`,
    `language: ${site.lang}`,
    page.datePublished ? `published: ${page.datePublished}` : null,
    page.dateModified ? `updated: ${page.dateModified}` : null,
    `publisher: ${site.legalName}`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  return `${front}\n\n${body}\n`;
}
