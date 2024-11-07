const LATEST_VERSION_LABEL = '2.7.x(Latest)';

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
// https://docusaurus.io/zh-CN/docs/api/docusaurus-config
const config: Config = {
  title: 'GoFrame官网 - 类似PHP-Laravel,Java-SpringBoot的Go企业级开发框架',
  tagline:
    'GoFrame is a modular, powerful, high-performance and enterprise-class application development framework of Golang.',
  favicon: '/img/favicon.ico',
  url: 'https://goframe.org/',
  baseUrl: '/',
  trailingSlash: false,
  organizationName: 'gogf',
  projectName: 'gf',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  // 多语言配置
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },
  presets: [
    [
      'classic',
      {
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          lastVersion: 'current',
          // https://docusaurus.io/docs/versioning
          versions: {
            current: {
              label: LATEST_VERSION_LABEL,
            },
          },
          // 编辑当前页面的配置
          editUrl: 'https://github.com/gogf/gf-site/blob/main/',
          // 显示更新时间和作者
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {},
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        pages: {},
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'GoFrame Logo',
        src: '/img/logo2.png',
      },
      items: [
        {
          sidebarId: 'quickSidebar',
          position: 'left',
          label: '快速开始',
          to: '/quick/install',
        },
        {
          position: 'left',
          label: '开发手册',
          sidebarId: 'mainSidebar',
          to: '/docs/design',
          items: [
            {
              label: '框架设计',
              to: '/docs/design',
            },
            {
              label: '开发工具',
              to: '/docs/cli',
            },
            {
              label: '组件手册',
              to: '/docs/core',
            },
            {
              label: '微服务开发',
              to: '/docs/micro-service',
            },
            {
              label: 'WEB服务开发',
              to: '/docs/web',
            },
            {
              label: '服务可观测性',
              to: '/docs/obs',
            },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'releaseSidebar',
          position: 'left',
          label: '发布记录',
        },

        {
          type: 'docSidebar',
          sidebarId: 'shareSidebar',
          position: 'left',
          label: '技术交流',
        },
        {
          type: 'docSidebar',
          sidebarId: 'supportusSidebar',
          position: 'left',
          label: '支持我们',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/gogf/gf/issues',
          position: 'right',
          label: '问题反馈',
        },
        {
          href: 'https://wiki.goframe.org/',
          position: 'right',
          label: '返回旧版',
        },
        {
          href: 'https://github.com/gogf/gf',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    // toc目录层级显示设置
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    footer: {
      copyright: `Copyright ©${new Date().getFullYear()} GoFrame OpenSource Team`,
    },
    // 代码块配置
    prism: {
      theme: prismThemes.okaidia,
      darkTheme: prismThemes.dracula,
      defaultLanguage: 'go',
      additionalLanguages: ['bash', 'javascript', 'toml', 'ini'], // 添加语言
      // 默认支持的语言 https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L23
      // 默认支持的语言 "markup","jsx","tsx","swift","kotlin","objectivec","js-extras","reason","rust","graphql","yaml","go","cpp","markdown","python","json"
    },
    // 搜索配置
    algolia: {
      // The application ID provided by Algolia
      appId: 'ZQUL8VI47R',

      // Public API key: it is safe to commit it
      apiKey: '35fbd44a6d7dfae18587c435bc6a0d01',

      indexName: 'goframe',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
  scripts: [
    {
      src: 'https://hm.baidu.com/hm.js?38f38a0626fd7805722db06243cd0fa7',
      async: true,
    },
  ],
};

export default config;