/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', icon: 'codicon:home', link: '/' },
  { text: '博客', icon: 'codicon:book', link: '/blog/' },
  { 
    text: '随记', 
    icon: 'codicon:notebook', 
    items: [
      { 
        text: 'macOS',
        icon: 'wpf:macos', 
        items: [
          {
            text: 'Homebrew',
            icon: 'devicon:homebrew',
            link: '/notes/macos/homebrew/'
          },
          {
            text: 'iTerm2',
            icon: 'simple-icons:iterm2',
            link: '/notes/macos/iterm/'
          }
        ]
      },
      { 
        text: '网络',
        icon: 'mdi:network-outline', 
        items: [
          {
            text: 'CDN 服务',
            icon: 'mdi:cloud-outline',
            link: '/notes/network/cdn/js-delivr/'
          },
        ]
      },
      { 
        text: '版本控制',
        icon: 'mdi:source-branch', 
        items: [
          {
            text: 'Git',
            icon: 'mdi:git',
            link: '/notes/vcs/git/git/'
          },
        ]
      },
    ]
  },
  { 
    text: '更多', 
    icon: 'mdi:information-outline', 
    items: [
      { 
        text: '关于我',
        icon: 'cib:about-me', 
        link: '/notes/about-me/'
      },
    ]
  },
  { 
    text: `v${version}`, 
    icon: 'codicon:versions', 
    badge: '新', 
    items: [
      { 
        text: '更新日志',
        icon: 'codicon:versions', 
        link: 'CHANGELOG.md'
      }
    ]
  }
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', icon: 'codicon:home', link: '/en/' },
  { text: 'Blog', icon: 'codicon:book', link: '/en/blog/' },
  { 
    text: 'Notes', 
    icon: 'codicon:notebook', 
    items: [
      { 
        text: 'macOS',
        icon: 'wpf:macos', 
        items: [
          {
            text: 'Homebrew',
            icon: 'devicon:homebrew',
            link: '/en/notes/macos/homebrew/'
          },
          {
            text: 'iTerm2',
            icon: 'simple-icons:iterm2',
            link: '/en/notes/macos/iterm/'
          }
        ]
      },
      { 
        text: 'Network',
        icon: 'mdi:network-outline', 
        items: [
          {
            text: 'CDN',
            icon: 'mdi:cloud-outline',
            link: '/en/notes/network/cdn/js-delivr/'
          },
        ]
      },
      { 
        text: 'VCS',
        icon: 'mdi:source-branch', 
        items: [
          {
            text: 'Git',
            icon: 'mdi:git',
            link: '/en/notes/vcs/git/git/'
          },
        ]
      },
    ]
  },
  { 
    text: 'More', 
    icon: 'mdi:information-outline', 
    items: [
      { 
        text: 'About Me',
        icon: 'cib:about-me', 
        link: '/en/notes/about-me/'
      },
    ]
  },
  { 
    text: `v${version}`, 
    icon: 'codicon:versions', 
    badge: 'New', 
    items: [
      { 
        text: 'Changelog',
        icon: 'codicon:versions', 
        link: '/en/CHANGELOG.md'
      }
    ]
  },
])

