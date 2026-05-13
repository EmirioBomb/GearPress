export interface ToolItem {
  name: string
  icon?: string
  description?: string
  url?: string
  tags?: string[]
}

export const toolsData: ToolItem[] = [
  {
    name: 'VS Code',
    icon: "skill-icons:vscode-light",
    description: 'Lightweight code editor',
    url: 'https://code.visualstudio.com',
    tags: ['editor']
  },
  {
    name: 'IntelliJ IDEA',
    icon: "skill-icons:idea-light",
    description: 'Java IDE',
    url: 'https://www.jetbrains.com/idea',
    tags: ['ide']
  },
  {
    name: 'Git',
    icon: "skill-icons:git",
    description: 'Version control system',
    url: 'https://git-scm.com',
    tags: ['vcs']
  },
  {
    name: 'SVN',
    icon: "file-icons:tortoisesvn",
    description: 'Version control system',
    url: 'https://tortoisesvn.net/',
    tags: ['vcs']
  },
  {
    name: 'Postman',
    icon: "skill-icons:postman",
    description: 'API testing tool',
    url: 'https://www.postman.com',
    tags: ['api']
  },
  {
    name: 'RabbitMQ',
    icon: "skill-icons:rabbitmq-light" ,
    description: 'Message broker system',
    url: 'https://www.rabbitmq.com',
    tags: ['middleware']
  },
  {
    name: 'Redis',
    icon: "skill-icons:redis-light",
    description: 'In-memory data store',
    url: 'https://redis.io',
    tags: ['database']
  },
  {
    name: 'iTerm2',
    icon: "simple-icons:iterm2",
    description: 'Terminal emulator for macOS',
    url: 'https://iterm2.com',
    tags: ['terminal']
  },
  {
    name: 'Docker',
    icon: "skill-icons:docker",
    description: 'Containerization platform',
    url: 'https://www.docker.com',
    tags: ['devops']
  },
  {
    name: 'Tomcat',
    icon: "devicon:tomcat-wordmark",
    description: 'Java application server',
    url: 'https://tomcat.apache.org',
    tags: ['devops']
  },
  {
    name: 'Nginx',
    icon: "skill-icons:nginx",
    description: 'Web server and reverse proxy',
    url: 'https://www.nginx.com',
    tags: ['devops']
  },
  {
    name: 'Cloudflare',
    icon: "skill-icons:cloudflare-light",
    description: 'Content delivery network',
    url: 'https://www.cloudflare.com',
    tags: ['devops']
  },
  {
    name: 'macOS',
    icon: "skill-icons:apple-light",
    description: 'macOS operating system',
    url: 'https://www.apple.com/',
    tags: ['os']
  },
  {
    name: 'Windows',
    icon: "skill-icons:windows-light",
    description: 'Windows operating system',
    url: 'https://www.microsoft.com/en-us/windows',
    tags: ['os']
  },
  {
    name: 'Ubuntu',
    icon: "skill-icons:ubuntu-light",
    description: 'Ubuntu operating system',
    url: 'https://ubuntu.com',
    tags: ['os']
  },
  {
    name: 'Redhat ',
    icon: "skill-icons:redhat-light",
    description: 'Redhat operating system',
    url: 'https://www.centos.org',
    tags: ['os']
  },
]