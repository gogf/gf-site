#!/usr/bin/env node
/**
 * Generate llms.txt and one Markdown file per doc page.
 *
 * The index follows https://llmstxt.org/ : agents read /llms.txt first, then
 * fetch only the linked Markdown. Output is the current docs (not historical
 * versions) for zh-Hans and en. Issue: https://github.com/gogf/gf-site/issues/330
 *
 *   node scripts/generate-llms.mjs --out build
 */

import fs from 'node:fs';
import path from 'node:path';
import posix from 'node:path/posix';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SECTIONS = [
  {
    titles: { 'zh-Hans': '快速开始', en: 'Quick Start' },
    dirs: ['quick/preface', 'quick/快速开始'],
  },
  {
    titles: { 'zh-Hans': '项目脚手架', en: 'Project Scaffold' },
    dirs: ['quick/项目脚手架'],
  },
  {
    titles: { 'zh-Hans': '核心组件', en: 'Core Components' },
    dirs: ['docs/核心组件'],
  },
  {
    titles: { 'zh-Hans': 'WEB 服务开发', en: 'Web Server' },
    dirs: ['docs/WEB服务开发'],
  },
  {
    titles: { 'zh-Hans': '微服务开发', en: 'Microservice' },
    dirs: ['docs/微服务开发'],
  },
  {
    titles: { 'zh-Hans': '服务可观测性', en: 'Observability' },
    dirs: ['docs/服务可观测性'],
  },
  {
    titles: { 'zh-Hans': '组件列表', en: 'Components' },
    dirs: ['docs/组件列表'],
  },
  {
    titles: { 'zh-Hans': '框架设计', en: 'Framework Design' },
    dirs: ['docs/框架设计'],
  },
  {
    titles: { 'zh-Hans': '开发工具', en: 'Development Tools' },
    dirs: ['docs/开发工具'],
  },
  {
    titles: { 'zh-Hans': '项目部署', en: 'Deployment' },
    dirs: ['docs/项目部署'],
  },
  {
    titles: { 'zh-Hans': 'AI 辅助开发', en: 'AI Assisted Development' },
    dirs: ['ai'],
  },
  {
    titles: { 'zh-Hans': '示例项目', en: 'Examples' },
    dirs: ['examples'],
  },
  {
    titles: { 'zh-Hans': '其他资料', en: 'References' },
    dirs: ['docs/其他资料'],
  },
  {
    titles: { 'zh-Hans': '常见问题', en: 'FAQ' },
    files: ['docs/常见问题-FAQ.md'],
  },
];

const START_SLUGS = [
  '/preface',
  '/quick/install',
  '/quick/hello-world',
  '/docs/core/g',
  '/docs/core/gdb',
  '/docs/web/router-registering-strict-router',
  '/docs/cli/gen',
  '/ai/goframe-skills',
];

const LOCALES = [
  {
    id: 'zh-Hans',
    source: 'docs',
    out: '',
    origin: 'https://goframe.org',
    admonitions: {
      tip: '提示',
      note: '备注',
      info: '说明',
      warning: '注意',
      danger: '警告',
      caution: '注意',
    },
    copy: {
      title: 'GoFrame',
      summary:
        'GoFrame 是 Go 语言的模块化应用开发框架。本文件是当前最新版本文档的入口索引。AI Agent 先按章节定位，再请求对应的 Markdown 链接，不必一次读完全部文档。',
      detail:
        'GoFrame 既可以作为完整项目框架使用，也可以按需引入 `github.com/gogf/gf/v2` 中的独立组件。每条链接指向该页面的 Markdown 原文。',
      order:
        '推荐阅读顺序：快速开始，核心组件，WEB 服务开发，数据库 ORM，组件列表。需要生成代码时先读 GoFrame Skills。',
      start: '从这里开始',
      external: '外部资源',
      childLead: '子页面：',
      hubLead: '本页为目录页，子页面如下：',
      source: '页面',
    },
  },
  {
    id: 'en',
    source: 'i18n/en/docusaurus-plugin-content-docs/current',
    out: 'en',
    origin: 'https://goframe.org/en',
    admonitions: {
      tip: 'Tip',
      note: 'Note',
      info: 'Info',
      warning: 'Warning',
      danger: 'Danger',
      caution: 'Caution',
    },
    copy: {
      title: 'GoFrame',
      summary:
        'GoFrame is a modular application framework for Go. This file indexes the latest documentation. An AI agent should locate a topic here, then fetch that page\'s Markdown instead of reading the whole site.',
      detail:
        'GoFrame can be used as a full project framework, or as individual components from `github.com/gogf/gf/v2`. Each link points at the Markdown source of that page.',
      order:
        'Suggested order: Quick Start, Core Components, Web Server, Database ORM, Components. Read GoFrame Skills before generating code.',
      start: 'Start here',
      external: 'External resources',
      childLead: 'Child pages:',
      hubLead: 'This page is a section index:',
      source: 'Page',
    },
  },
];

const EXTERNAL = {
  'zh-Hans': [
    ['官方网站', 'https://goframe.org'],
    ['英文站点', 'https://goframe.org/en'],
    ['源码仓库', 'https://github.com/gogf/gf'],
    ['Go 包文档', 'https://pkg.go.dev/github.com/gogf/gf/v2'],
    ['GoFrame Skills 仓库', 'https://github.com/gogf/skills'],
    ['文档源码仓库', 'https://github.com/gogf/gf-site'],
  ],
  en: [
    ['Website', 'https://goframe.org'],
    ['English site', 'https://goframe.org/en'],
    ['Source code', 'https://github.com/gogf/gf'],
    ['Go package docs', 'https://pkg.go.dev/github.com/gogf/gf/v2'],
    ['GoFrame Skills', 'https://github.com/gogf/skills'],
    ['Documentation source', 'https://github.com/gogf/gf-site'],
  ],
};

const IMAGE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)(\?.*)?$/i;
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;

function arg(name, fallback) {
  const index = process.argv.indexOf('--' + name);
  return index > -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function unquote(value) {
  const text = value.trim();
  if (
    (text.startsWith("'") && text.endsWith("'")) ||
    (text.startsWith('"') && text.endsWith('"'))
  ) {
    return text.slice(1, -1);
  }
  return text;
}

function normSlug(slug) {
  if (!slug) return '';
  let text = slug.trim();
  if (!text.startsWith('/')) text = '/' + text;
  if (text.length > 1 && text.endsWith('/')) text = text.slice(0, -1);
  return text.replace(/\.md$/, '');
}

function cleanTitle(raw) {
  return raw
    .replace(EMOJI, '')
    .replace(/[（(]\s*重点\s*[)）]/g, '')
    .replace(/[（(]\s*[)）]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function oneLine(text, max = 180) {
  let value = text.replace(EMOJI, '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1).replace(/\s+\S*$/, '');
  return (cut || value.slice(0, max - 1)) + '…';
}

function escapeLinkText(text) {
  return text.replace(/[\[\]]/g, '');
}

function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  let key = null;
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      meta[key] = unquote(kv[2]);
      continue;
    }
    if (key && line.trim()) meta[key] += ' ' + unquote(line.trim());
  }
  return { meta, body: text.slice(match[0].length) };
}

function walkMarkdown(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function proseSegments(text) {
  const segments = [];
  let buffer = [];
  let fence = null;
  const flush = () => {
    if (buffer.length) {
      segments.push({ code: false, lines: buffer });
      buffer = [];
    }
  };
  for (const line of text.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (!fence && marker) {
      flush();
      fence = marker[1];
      segments.push({ code: true, lines: [line] });
      continue;
    }
    if (fence) {
      segments[segments.length - 1].lines.push(line);
      if (line.trim().startsWith(fence) && line.trim().length >= fence.length) fence = null;
      continue;
    }
    buffer.push(line);
  }
  flush();
  return segments;
}

function transformProse(text, fn) {
  return proseSegments(text)
    .map((segment) => {
      const content = segment.lines.join('\n');
      return segment.code ? content : fn(content);
    })
    .join('\n');
}

function splitHash(target) {
  const index = target.indexOf('#');
  if (index === -1) return [target, ''];
  return [target.slice(0, index), target.slice(index)];
}

function sectionOwns(rel) {
  for (const section of SECTIONS) {
    if ((section.files || []).includes(rel)) return true;
    for (const dir of section.dirs || []) {
      if (rel === dir + '.md' || rel.startsWith(dir + '/')) return true;
    }
  }
  return false;
}

function loadPages(locale) {
  const sourceRoot = path.join(ROOT, locale.source);
  if (!fs.existsSync(sourceRoot)) {
    throw new Error('docs source not found: ' + locale.source);
  }
  const bySlug = new Map();
  const byRel = new Map();
  const pages = [];
  const files = walkMarkdown(sourceRoot).sort();
  for (const file of files) {
    const rel = path.relative(sourceRoot, file).split(path.sep).join('/');
    const { meta, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
    if (meta.draft === 'true') continue;
    const slug = normSlug(meta.slug || '');
    if (!slug) continue;
    const position = Number.parseInt(meta.sidebar_position ?? '', 10);
    const page = {
      rel,
      slug,
      title: cleanTitle(meta.title || path.basename(file, '.md')),
      description: (meta.description || '').trim(),
      position: Number.isFinite(position) ? position : 1000,
      body,
      published: sectionOwns(rel),
    };
    if (bySlug.has(slug)) {
      console.warn(`${locale.id} duplicate slug ${slug}; keep ${bySlug.get(slug).rel}; skip ${rel}`);
      continue;
    }
    pages.push(page);
    bySlug.set(slug, page);
    byRel.set(rel, page);
  }
  return { pages, bySlug, byRel };
}

function resolveLink(raw, page, locale, maps) {
  if (!raw) return raw;
  const [pathPart, hash] = splitHash(raw);
  if (!pathPart) return raw;
  if (/^(https?:|mailto:|tel:)/i.test(pathPart)) return raw;
  if (IMAGE.test(pathPart) || pathPart.includes('/markdown/')) return null;

  let decoded = pathPart;
  try {
    decoded = decodeURIComponent(pathPart);
  } catch {
    decoded = pathPart;
  }

  let target = null;
  if (decoded.startsWith('/')) {
    target = maps.bySlug.get(normSlug(decoded)) || null;
  } else {
    const resolved = posix.normalize(posix.join(posix.dirname(page.rel), decoded));
    target = maps.byRel.get(resolved) || maps.byRel.get(resolved.endsWith('.md') ? resolved : resolved + '.md') || null;
  }
  if (!target) {
    if (decoded.startsWith('/')) return locale.origin + decoded + hash;
    return raw;
  }
  const base = target.published ? locale.origin + target.slug + '.md' : locale.origin + target.slug;
  return base + hash;
}

function collapseBlankLines(text) {
  return proseSegments(text)
    .map((segment) => {
      const content = segment.lines.join('\n');
      return segment.code ? content : content.replace(/\n{3,}/g, '\n\n');
    })
    .join('\n');
}

function cleanBody(page, locale, maps) {
  let body = page.body.replace(/\r\n/g, '\n');
  body = body.replace(/^import\s.+from\s+['"]@theme\/.+['"];?\s*$/gm, '');
  body = body.replace(/^[ \t]*<DocCardList\b[^>]*\/?>\s*$/gm, '');
  body = transformProse(body, (part) =>
    part
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<img\b[^>]*>/gi, '')
      .replace(/^[ \t]*<Tabs\b[^>]*>\s*$/gm, '')
      .replace(/^[ \t]*<\/Tabs>\s*$/gm, '')
      .replace(/^[ \t]*<TabItem\b([^>]*)>\s*$/gm, (_match, attrs) => {
        const label = (attrs.match(/label="([^"]*)"/) || [])[1] || '';
        return label ? `\n**${label}**\n` : '';
      })
      .replace(/^[ \t]*<\/TabItem>\s*$/gm, '')
      .replace(/^[ \t]*:::[ \t]*(\w+)[ \t]*(.*)$/gm, (_match, kind, label) => {
        const name = locale.admonitions[kind.toLowerCase()];
        if (!name) return _match;
        const text = label.trim();
        const sep = locale.id === 'en' ? ': ' : '：';
        return '\n' + (text && text !== name ? `**${name}**${sep}${text}` : `**${name}**`) + '\n';
      })
      .replace(/^[ \t]*:::[ \t]*$/gm, '')
      .replace(/\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match, text, target) => {
        const resolved = resolveLink(target, page, locale, maps);
        if (resolved === null) return text;
        if (resolved === target) return match;
        return `[${text}](${resolved})`;
      }),
  );
  body = body.replace(/^#{1,6}[ \t]*$/gm, '');
  body = body.replace(/[ \t]+$/gm, '');
  body = collapseBlankLines(body);
  body = body.replace(/^\s*#\s+[^\n]*\n+/, '');
  return body.trim();
}

function makeTree(pages) {
  const tree = { dirs: new Map(), pages: [] };
  for (const page of pages) {
    let node = tree;
    const dir = posix.dirname(page.rel);
    if (dir !== '.') {
      for (const part of dir.split('/')) {
        if (!node.dirs.has(part)) node.dirs.set(part, { dirs: new Map(), pages: [] });
        node = node.dirs.get(part);
      }
    }
    node.pages.push(page);
  }
  return tree;
}

function nodeAt(tree, dirRel) {
  let node = tree;
  for (const part of dirRel.split('/')) {
    node = node && node.dirs.get(part);
  }
  return node || null;
}

function findHub(node, dirRel) {
  if (!node) return null;
  const base = posix.basename(dirRel);
  return node.pages.find((page) => posix.basename(page.rel, '.md') === base) || null;
}

function sortPages(pages, hub) {
  return [...pages].sort((a, b) => {
    if (hub && a === hub) return -1;
    if (hub && b === hub) return 1;
    return a.position - b.position || a.title.localeCompare(b.title, 'zh-Hans');
  });
}

function dirPosition(node, dirRel) {
  const hub = findHub(node, dirRel);
  if (hub) return hub.position;
  const positions = node.pages.map((page) => page.position);
  return positions.length ? Math.min(...positions) : 1000;
}

function indexable(node, dirRel) {
  const hub = findHub(node, dirRel);
  return sortPages(node.pages, hub).filter((page) => !(hub && page === hub && page.hubOnly));
}

function sortedDirs(node, dirRel) {
  return [...node.dirs.entries()].sort((a, b) => {
    const left = dirPosition(a[1], posix.join(dirRel, a[0]));
    const right = dirPosition(b[1], posix.join(dirRel, b[0]));
    return left - right || a[0].localeCompare(b[0], 'zh-Hans');
  });
}

function allIndexable(node, dirRel, out = []) {
  out.push(...indexable(node, dirRel));
  for (const [name, child] of sortedDirs(node, dirRel)) {
    allIndexable(child, posix.join(dirRel, name), out);
  }
  return out;
}

function bullet(page, locale) {
  return `- [${escapeLinkText(page.title)}](${locale.origin}${page.slug}.md)`;
}

function renderDir(node, dirRel, headingLevel, lines, order, locale) {
  for (const page of indexable(node, dirRel)) {
    order.push(page);
    lines.push(bullet(page, locale));
  }
  for (const [name, child] of sortedDirs(node, dirRel)) {
    const childRel = posix.join(dirRel, name);
    const leaves = indexable(child, childRel);
    if (child.dirs.size === 0 && leaves.length === 1) {
      order.push(leaves[0]);
      lines.push(bullet(leaves[0], locale));
      continue;
    }
    if (headingLevel > 4) {
      for (const page of allIndexable(child, childRel)) {
        order.push(page);
        lines.push(bullet(page, locale));
      }
      continue;
    }
    const sub = [];
    renderDir(child, childRel, headingLevel + 1, sub, order, locale);
    if (sub.length === 0) continue;
    const hub = findHub(child, childRel);
    const title = hub ? hub.title : name;
    if (lines.length && lines[lines.length - 1] !== '') lines.push('');
    lines.push('#'.repeat(headingLevel) + ' ' + title);
    lines.push('');
    lines.push(...sub);
  }
}

function renderSection(section, tree, locale, order) {
  const lines = [];
  let blurb = '';
  for (const rel of section.files || []) {
    const page = findPageByRel(tree, rel);
    if (!page || page.hubOnly) continue;
    order.push(page);
    lines.push(bullet(page, locale));
  }
  for (const dir of section.dirs || []) {
    const node = nodeAt(tree, dir);
    if (!node) continue;
    const hub = findHub(node, dir);
    if (!blurb && hub && hub.hubOnly && hub.description) blurb = oneLine(hub.description, 140);
    renderDir(node, dir, 3, lines, order, locale);
  }
  if (lines.length === 0) return [];
  const out = ['## ' + section.titles[locale.id], ''];
  if (blurb) out.push(blurb, '');
  out.push(...lines, '');
  return out;
}

function findPageByRel(tree, rel) {
  const dir = posix.dirname(rel);
  const node = dir === '.' ? tree : nodeAt(tree, dir);
  if (!node) return null;
  return node.pages.find((page) => page.rel === rel) || null;
}

function isHub(page) {
  return posix.basename(page.rel, '.md') === posix.basename(posix.dirname(page.rel));
}

function directChildren(page, tree) {
  if (!isHub(page)) return [];
  const dirRel = posix.dirname(page.rel);
  const node = nodeAt(tree, dirRel);
  if (!node) return [];
  const children = indexable(node, dirRel).filter((child) => child !== page);
  for (const [name, child] of sortedDirs(node, dirRel)) {
    const childRel = posix.join(dirRel, name);
    const hub = findHub(child, childRel);
    if (hub) children.push(hub);
  }
  return children;
}

function buildLocale(locale, outRoot) {
  const maps = loadPages(locale);
  const published = maps.pages.filter((page) => page.published);
  for (const page of published) {
    page.clean = cleanBody(page, locale, maps);
    page.hubOnly = page.clean.replace(/\s/g, '').length < 80;
  }

  const tree = makeTree(published);
  for (const page of published) {
    const children = directChildren(page, tree);
    if (!children.length) continue;
    const lead = page.hubOnly || page.clean.length < 10 ? locale.copy.hubLead : locale.copy.childLead;
    const list = children.map((child) => `- [${escapeLinkText(child.title)}](${locale.origin}${child.slug}.md)`).join('\n');
    page.clean = (page.clean ? page.clean + '\n\n' : '') + lead + '\n\n' + list;
  }

  const order = [];
  const lines = [
    '# ' + locale.copy.title,
    '',
    '> ' + locale.copy.summary,
    '',
    locale.copy.detail,
    '',
    '## ' + locale.copy.start,
    '',
  ];
  for (const slug of START_SLUGS) {
    const page = maps.bySlug.get(slug);
    if (page && page.published) lines.push(bullet(page, locale));
  }
  lines.push('', locale.copy.order, '');

  for (const section of SECTIONS) {
    lines.push(...renderSection(section, tree, locale, order));
  }

  lines.push('## ' + locale.copy.external, '');
  for (const [title, url] of EXTERNAL[locale.id]) lines.push(`- [${title}](${url})`);
  lines.push('');

  const index = lines.join('\n').replace(/\n{3,}/g, '\n\n');

  const localeOut = path.join(outRoot, locale.out);
  fs.mkdirSync(localeOut, { recursive: true });
  const written = new Set();
  for (const page of published) {
    const dest = path.join(localeOut, page.slug.slice(1) + '.md');
    if (written.has(dest)) throw new Error('duplicate output path ' + dest);
    written.add(dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const content = collapseBlankLines(
      `# ${page.title}\n\n${page.clean}\n\n> ${locale.copy.source}: ${locale.origin}${page.slug}\n`,
    );
    fs.writeFileSync(dest, content.endsWith('\n') ? content : content + '\n');
  }
  fs.writeFileSync(path.join(localeOut, 'llms.txt'), index.endsWith('\n') ? index : index + '\n');

  const missing = [];
  for (const page of order) {
    const dest = path.join(localeOut, page.slug.slice(1) + '.md');
    if (!fs.existsSync(dest)) missing.push(page.slug);
  }
  if (missing.length) {
    throw new Error(locale.id + ' index links missing files: ' + missing.slice(0, 10).join(', '));
  }
  if (order.length === 0) throw new Error(locale.id + ' produced an empty llms.txt index');

  return {
    locale: locale.id,
    pages: published.length,
    indexed: order.length,
    hubs: published.filter((page) => page.hubOnly).length,
    llmsBytes: fs.statSync(path.join(localeOut, 'llms.txt')).size,
  };
}

const outRoot = path.resolve(arg('out', 'build'));
fs.mkdirSync(outRoot, { recursive: true });
const stats = LOCALES.map((locale) => buildLocale(locale, outRoot));
console.log(JSON.stringify({ out: outRoot, locales: stats }, null, 2));
