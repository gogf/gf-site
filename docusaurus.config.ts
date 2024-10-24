import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'GoFrame',
  tagline: 'GoFrame',
  favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://goframe.org/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/hailaz/gfdoc-md/blob/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    // 搜索
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        // Options here
        // language of your documentation, see next section
        language: 'zh',
      },
    ],
    
    // 快速开始
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'quick',
        path: 'quick',
        routeBasePath: 'quick',
        sidebarPath: './sidebars.ts',
        // ... other options
      },
    ],
    // 常见问题
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'faq',
        path: 'faq',
        routeBasePath: 'faq',
        sidebarPath: './sidebars.ts',
        // ... other options
      },
    ],
    // 版本发布
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'changelog',
        path: 'changelog',
        routeBasePath: 'changelog',
        sidebarPath: './sidebars.ts',
        // ... other options
      },
    ],
    // 支持我们
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'supportus',
        path: 'supportus',
        routeBasePath: 'supportus',
        sidebarPath: './sidebars.ts',
        // ... other options
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'GoFrame',
      logo: {
        alt: 'GoFrame Logo',
        src: 'img/favicon.ico',
      },
      items: [
        {
          "type": "docSidebar",
          "sidebarId": "tutorialSidebar",
          "docsPluginId": "quick",
          "position": "right",
          "label": "快速开始"
        },
        {
          "type": "docSidebar",
          "sidebarId": "tutorialSidebar",
          "position": "right",
          "label": "开发手册"
        },
        {
          "type": "docSidebar",
          "sidebarId": "tutorialSidebar",
          "docsPluginId": "faq",
          "position": "right",
          "label": "常见问题"
        },
        {
          "type": "docSidebar",
          "sidebarId": "tutorialSidebar",
          "docsPluginId": "changelog",
          "position": "right",
          "label": "发布记录"
        },
        {
          "type": "docSidebar",
          "sidebarId": "tutorialSidebar",
          "docsPluginId": "supportus",
          "position": "right",
          "label": "支持我们"
        },
        {
          href: 'https://github.com/gogf/gf',
          position: 'right',
          className: 'header-github-link',
        }
        // {to: '/blog', label: 'Blog', position: 'left'},
      ],
    },
    // toc目录层级显示设置
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    footer: {
      // style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Doc',
      //         to: '/docs',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright ©${new Date().getFullYear()} GoFrame OpenSource Team`,
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.dracula,
      defaultLanguage: 'go',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
