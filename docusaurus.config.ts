import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '숲 속 개발일지',
  tagline: '공부 블로그',
  favicon: 'img/bird.png',

  // Set the production url of your site here
  url: 'https://yjblog.vercel.app/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'https://github.com/YAE-Joon', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          path: 'docs',
          editUrl:
            'https://github.com/YAE-Joon/blog',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/YAE-Joon/blog',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'project',
        path: 'project',
        routeBasePath: 'project',
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/YAE-Joon/blog',
        includeCurrentVersion: true,
        sidebarCollapsible: true,
        sidebarCollapsed: false,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'icon.jpg',
    navbar: {
      title: 'YJ\'',
      logo: {
        alt: 'Logo',
        src: 'img/bird.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '공부일지',

        },{
          type: 'docSidebar',
          sidebarId: 'projectSidebar',
          docsPluginId: 'project',
          position: 'left',
          label: 'Project',

        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/YAE-Joon/blog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '내 블로그',
          items: [
            {
              label: '공부일지',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Info',
          items: [
            {
              label: 'Resume',
              href: 'https://elice.works/shared-resume/account/6521/publicUuid/42208529-cb6b-4b8d-925e-3be3ea4be8cc',
            },
            {
              label: 'Discord',
              href: 'https://www.discord.com/users/808690565007802448',
            },
            {
              label: 'Kakao',
              href: 'http://qr.kakao.com/talk/aZek.L_29yVBcXbO5Op0Y3VEDtQ-',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Yae-joon',
            },{
              label: 'Notion',
              href: 'https://www.notion.so/19247fcc4aaa8041a8b9c17584201e97',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} YJ'blog`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'kotlin', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
