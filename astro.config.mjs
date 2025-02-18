import path from 'path'
import { fileURLToPath } from 'url'
import svgr from 'vite-plugin-svgr'

import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import compress from '@playform/compress'
import react from '@astrojs/react' // Import the React integration

import astrowind from './vendor/integration'

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const hasExternalScripts = false
const whenExternalScripts = (items = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : []

export default defineConfig({
  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
      config: './tailwind.config.cjs',
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),

    react({
      include: ['src/components/**/*.tsx', 'src/react/**/*.tsx', 'src/components/**/*.jsx', 'src/react/**/*.jsx'],
      experimentalReactChildren: true,
    }),
  ],

  image: {
    service: undefined,
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    plugins: [svgr()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
})
