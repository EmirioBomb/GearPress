export type NavigationLocale = "zh" | "en"

export type NavigationPlatform = "web" | "windows" | "macos" | "linux" | "mobile"

export type NavigationCategory =
  | "productivity"
  | "development"
  | "design"
  | "utilities"
  | "knowledge"

export interface LocalizedText {
  zh: string
  en: string
}

export interface NavigationItem {
  id: string
  name: string
  description: LocalizedText
  url: string
  icon: string
  platforms: NavigationPlatform[]
  category: NavigationCategory
  tags: string[]
  accent: string
  featured?: "wide" | "tall"
}

export interface NavigationFilter {
  id: NavigationPlatform | "all"
  label: LocalizedText
  icon: string
}

export const platformFilters: NavigationFilter[] = [
  { id: "all", label: { zh: "全部", en: "All" }, icon: "lucide:orbit" },
  { id: "web", label: { zh: "常用网站", en: "Web" }, icon: "lucide:globe-2" },
  { id: "windows", label: { zh: "Windows", en: "Windows" }, icon: "ri:windows-fill" },
  { id: "macos", label: { zh: "macOS", en: "macOS" }, icon: "wpf:macos" },
  { id: "linux", label: { zh: "Linux", en: "Linux" }, icon: "mdi:linux" },
  { id: "mobile", label: { zh: "移动端", en: "Mobile" }, icon: "lucide:smartphone" },
]

export const categoryLabels: Record<NavigationCategory, LocalizedText> = {
  productivity: { zh: "效率", en: "Productivity" },
  development: { zh: "开发", en: "Development" },
  design: { zh: "设计", en: "Design" },
  utilities: { zh: "工具", en: "Utilities" },
  knowledge: { zh: "知识", en: "Knowledge" },
}

export const navigationItems: NavigationItem[] = [
  {
    id: "raycast",
    name: "Raycast",
    description: { zh: "用键盘快速启动应用、搜索文件与执行自动化。", en: "Launch apps, find files, and run automations from the keyboard." },
    url: "https://www.raycast.com/",
    icon: "simple-icons:raycast",
    platforms: ["macos", "windows"],
    category: "productivity",
    tags: ["Launcher", "Workflow"],
    accent: "#ff6363",
    featured: "wide",
  },
  {
    id: "powertoys",
    name: "PowerToys",
    description: { zh: "微软为 Windows 提供的窗口、键盘和文件效率工具集。", en: "Microsoft's collection of window, keyboard, and file utilities." },
    url: "https://learn.microsoft.com/windows/powertoys/",
    icon: "simple-icons:windows11",
    platforms: ["windows"],
    category: "utilities",
    tags: ["Microsoft", "Open Source"],
    accent: "#4aa7ff",
    featured: "tall",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: { zh: "以本地 Markdown 文件构建可连接的个人知识库。", en: "Build a connected personal knowledge base with local Markdown files." },
    url: "https://obsidian.md/",
    icon: "simple-icons:obsidian",
    platforms: ["windows", "macos", "linux", "mobile"],
    category: "knowledge",
    tags: ["Notes", "Markdown"],
    accent: "#a88bfa",
    featured: "wide",
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    description: { zh: "轻量、可扩展并支持多平台的代码编辑器。", en: "A lightweight, extensible code editor available across platforms." },
    url: "https://code.visualstudio.com/",
    icon: "devicon:vscode",
    platforms: ["windows", "macos", "linux"],
    category: "development",
    tags: ["Editor", "Microsoft"],
    accent: "#3aa7e8",
  },
  {
    id: "localsend",
    name: "LocalSend",
    description: { zh: "无需账户，在局域网内跨平台传输文件。", en: "Transfer files across nearby devices without an account." },
    url: "https://localsend.org/",
    icon: "lucide:send",
    platforms: ["windows", "macos", "linux", "mobile"],
    category: "utilities",
    tags: ["Transfer", "Open Source"],
    accent: "#36c9a0",
  },
  {
    id: "iterm2",
    name: "iTerm2",
    description: { zh: "面向 macOS 的高可配置终端模拟器。", en: "A highly configurable terminal emulator for macOS." },
    url: "https://iterm2.com/",
    icon: "simple-icons:iterm2",
    platforms: ["macos"],
    category: "development",
    tags: ["Terminal", "Shell"],
    accent: "#7d8b98",
  },
  {
    id: "everything",
    name: "Everything",
    description: { zh: "在 Windows 上近乎即时地按名称查找文件。", en: "Find files by name almost instantly on Windows." },
    url: "https://www.voidtools.com/",
    icon: "lucide:search-code",
    platforms: ["windows"],
    category: "utilities",
    tags: ["Search", "Files"],
    accent: "#f0c44f",
  },
  {
    id: "github",
    name: "GitHub",
    description: { zh: "托管代码、协作开发并发现开源项目。", en: "Host code, collaborate, and discover open-source projects." },
    url: "https://github.com/",
    icon: "simple-icons:github",
    platforms: ["web"],
    category: "development",
    tags: ["Git", "Open Source"],
    accent: "#8b949e",
    featured: "wide",
  },
  {
    id: "excalidraw",
    name: "Excalidraw",
    description: { zh: "用手绘风格快速制作流程图和协作草图。", en: "Create hand-drawn diagrams and collaborative sketches quickly." },
    url: "https://excalidraw.com/",
    icon: "simple-icons:excalidraw",
    platforms: ["web"],
    category: "design",
    tags: ["Diagram", "Canvas"],
    accent: "#7b61ff",
    featured: "tall",
  },
  {
    id: "photopea",
    name: "Photopea",
    description: { zh: "可在浏览器直接使用的图像编辑器，支持 PSD。", en: "A browser-based image editor with PSD support." },
    url: "https://www.photopea.com/",
    icon: "lucide:image",
    platforms: ["web"],
    category: "design",
    tags: ["Image", "PSD"],
    accent: "#27b88d",
  },
  {
    id: "iconify",
    name: "Iconify",
    description: { zh: "统一搜索和使用多个开源图标集合。", en: "Search and use many open-source icon sets through one interface." },
    url: "https://icon-sets.iconify.design/",
    icon: "simple-icons:iconify",
    platforms: ["web"],
    category: "design",
    tags: ["Icons", "Frontend"],
    accent: "#1769aa",
  },
  {
    id: "mdn",
    name: "MDN Web Docs",
    description: { zh: "面向 Web 开发者的标准、API 与实践文档。", en: "Standards, API references, and guides for web developers." },
    url: "https://developer.mozilla.org/",
    icon: "simple-icons:mdnwebdocs",
    platforms: ["web"],
    category: "knowledge",
    tags: ["Docs", "Web"],
    accent: "#ff6d91",
  },
  {
    id: "caniuse",
    name: "Can I use",
    description: { zh: "查询 Web 特性在各浏览器中的兼容情况。", en: "Check browser support for web platform features." },
    url: "https://caniuse.com/",
    icon: "simple-icons:caniuse",
    platforms: ["web"],
    category: "development",
    tags: ["Compatibility", "CSS"],
    accent: "#e5a33d",
  },
  {
    id: "tinypng",
    name: "TinyPNG",
    description: { zh: "在线压缩 WebP、PNG 和 JPEG 图片。", en: "Compress WebP, PNG, and JPEG images online." },
    url: "https://tinypng.com/",
    icon: "lucide:images",
    platforms: ["web"],
    category: "utilities",
    tags: ["Compress", "Image"],
    accent: "#59b875",
  },
]
