export interface LangItem {
  name: string
  icon?: string
  description?: string
  url?: string
}

export const langsData: LangItem[] = [
  {
    name: 'Java',
    icon: 'skill-icons:java-light',
    description: 'General-purpose programming language',
    url: 'https://www.oracle.com/java',
  },
  {
    name: 'Python',
    icon: 'skill-icons:python-light',
    description: 'General-purpose programming language',
    url: 'https://www.python.org',
  },
  {
    name: 'Markdown',
    icon: 'skill-icons:markdown-light',
    description: 'Lightweight markup language',
    url: 'https://www.markdownguide.org',
  },
  {
    name: 'Shell',
    icon: 'skill-icons:bash-light',
    description: 'Command-line interpreter',
    url: 'https://www.gnu.org/software/bash/',
  },
  {
    name: 'Node.js',
    icon: 'skill-icons:nodejs-light',
    description: 'JavaScript runtime',
    url: 'https://nodejs.org',
  },
  {
    name: 'JavaScript',
    icon: 'skill-icons:javascript',
    description: 'Web programming language',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    name: 'HTML',
    icon: 'skill-icons:html',
    description: 'Markup language for creating web pages',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  {
    name: 'CSS',
    icon: 'skill-icons:css',
    description: 'Styling language for web pages',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  {
    name: 'Vue',
    icon: 'skill-icons:vuejs-light',
    description: 'Progressive frontend framework',
    url: 'https://vuejs.org',
  },
  {
    name: 'MySQL',
    icon: 'skill-icons:mysql-light',
    description: 'Relational database',
    url: 'https://www.mysql.com',
  },
  {
    name: 'Oracle DB',
    icon: 'streamline-logos:oracle-logo-block',
    description: 'Enterprise database system',
    url: 'https://www.oracle.com/database',
  },
]