const LATEST_VERSION_LABEL = '2.8.x(Latest)';

import type { Options as IdealImageOptions } from '@docusaurus/plugin-ideal-image';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

function geti18nTitle() {
  switch(process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case "en": return "GoFrame - A powerful framework for faster, easier, and more efficient project development";
    default: return "GoFrame官网 - 类似PHP-Laravel,Java-SpringBoot的Go语言开发框架";
  }
}

// https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
// https://docusaurus.io/zh-CN/docs/api/docusaurus-config
const config: Config = {
  title: geti18nTitle(),
  tagline:
    'A powerful framework for faster, easier, and more efficient project development',
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
  // https://www.docusaurus.cn/blog/releases/3.6#docusaurus-faster
  future: {
    experimental_faster: true,
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
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      } satisfies IdealImageOptions,
    ],
  ],
  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content:
          'GoFrame, Go开发框架, Golang企业框架, 高性能Go框架, 微服务开发, 开箱即用组件, 数据校验, 跨平台支持, 开发文档, 社区支持',
      },
      {
        name: 'description',
        content:
          'GoFrame是一款高性能、模块化的Go语言企业级开发框架，提供丰富的组件支持，可快速构建稳定的Web应用和微服务。具备出色的跨平台兼容性和详尽的使用文档，支持团队高效开发与交付。',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
      },
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
          to: '/docs/core',
        },
        {
          sidebarId: 'courseSidebar',
          position: 'left',
          label: '社区教程',
          to: '/course',
          items: [
            {
              sidebarId: 'courseSidebar',
              label: '视频入门教程',
              to: '/course/bilibili-video',
            },
            {
              sidebarId: 'courseStarBookSidebar',
              label: '入门实战教程-星辰英语本',
              to: '/course/starbook',
            },
            {
              sidebarId: 'courseProximaBookSidebar',
              label: '微服务实战教程-比邻英语本',
              to: '/course/proxima-book',
            },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'examplesSidebar',
          position: 'left',
          label: '代码示例',
        },
        {to: 'showcase', label: '案例展示', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'releaseSidebar',
          position: 'left',
          label: '发布记录',
        },
        {
          sidebarId: 'communitySidebar',
          position: 'left',
          label: '开源社区',
          to: '/share/group',
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
      copyright: `Copyright ${new Date().getFullYear()} GoFrame OpenSource Team`,
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
    // {
    //   src: '/ad.js',
    //   async: true,
    // },
  ],
};

export default config;
