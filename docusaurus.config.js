// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Stellar Wallet Playbook',
  tagline: 'A guide to building wallets on Stellar',
  favicon: 'img/favicon/favicon.ico',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/favicon/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/img/favicon/site.webmanifest',
      },
    },
  ],

  // Set the production url of your site here
  url: 'https://stellarplaybook.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'wallets-playbook', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        // max: 750,
        disableInDev: false,
      },
    ],
    [
      require.resolve('./plugins/fetch-remote-data-plugin.js'),
      {
        // Plugin options can go here
      },
    ],
  ],

  clientModules: [
    require.resolve('./src/clientModules/simpleFeedback.js'),
    require.resolve('./src/clientModules/sidebarIcons.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/', // Set this value to '/'.

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   // editUrl:
        //   //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-3VCRCESQFD',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      algolia: {
        appId: '6E139FK2DL',
        apiKey: 'b748663e725287bb84c84276c9ee696c',
        indexName: 'Wallet Playbook',
        contextualSearch: true,
        searchPagePath: 'search',
      },
      navbar: {
        title: 'Stellar Wallet Playbook',
        logo: {
          alt: 'Stellar Wallet Playbook Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'html',
            position: 'right',
            value: '<button class="feedback-navbar-button"><svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor" style="margin-right: 6px;"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>Leave Feedback</button>',
          },
          {
            href: 'https://github.com/brunomuler/wallets-playbook',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Docs',
          // },
          // {to: '/blog', label: 'Blog', position: 'left'},
        ],
      },
      footer: {
        links: [
          {
            title: 'Resources',
            items: [
              {
                html: '<a href="https://developers.stellar.org/" class="footer__link-item"><span class="icon-[heroicons--document-text]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Stellar Documentation</a>',
              },
              {
                html: '<a href="https://stellar.github.io/js-stellar-sdk/" class="footer__link-item"><span class="icon-[heroicons--code-bracket]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Stellar SDK Reference</a>',
              },
              {
                html: '<a href="https://laboratory.stellar.org/" class="footer__link-item"><span class="icon-[heroicons--beaker]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Stellar Laboratory</a>',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                html: '<a href="https://discord.gg/stellardev" class="footer__link-item"><span class="icon-[simple-icons--discord]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Stellar Developer Discord</a>',
              },
              {
                html: '<a href="https://stellar.stackexchange.com/" class="footer__link-item"><span class="icon-[simple-icons--stackexchange]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Stellar Stack Exchange</a>',
              },
            ],
          },
          {
            title: 'Contribute',
            items: [
              {
                html: '<a href="https://github.com/brunomuler/wallets-playbook" class="footer__link-item"><span class="icon-[simple-icons--github]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>GitHub Repository</a>',
              },
              {
                html: '<a href="#" class="footer__link-item" onclick="document.querySelector(\'.feedback-navbar-button\').click(); return false;"><span class="icon-[heroicons--chat-bubble-left-right]" style="display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: text-bottom;"></span>Leave Feedback</a>',
              },
            ],
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
