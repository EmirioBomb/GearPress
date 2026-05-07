---
title: gitignore
createTime: 2026/05/06 10:10:46
permalink: /notes/vcs/git/gitignore/
---

## 📌 什么是 gitignore

::: note

[`gitignore`](https://git-scm.com/docs/gitignore)  是 Git 用来定义==“忽略规则”==的文件，用于指定哪些文件或目录不需要被纳入版本控制。Git 会根据它跳过这些文件，不把它们作为变更或提交内容处理。

:::

## ✨ 使用场景

* 忽略项目构建或运行时自动生成的目录，如： `dist/`、`build/`、`target/`
* 忽略包管理工具生成的依赖目录，如： `node_modules/`
* 忽略运行日志文件，如： `*.log`、`logs/`
* 忽略本地环境或敏感配置文件，如： `.env`、`.env.local`
* 忽略开发工具生成的配置文件，如： `.idea/`、`.vscode/`

## 🪄 匹配模式

::: table title="匹配模式" align="right" full-width

| 模式 | 匹配 | 不匹配 | 描述 |
| ---- | --- | ---- | ---- |
| foo.* | foo.txt <br> a/foo.gz <br> a/b/c/foo.xml | | 忽略任意目录中所有以 foo. 开头的文件。 |
| /foo.* | /foo.txt <br> /foo.gz | a/foo.txt <br> a/b/foo.log | 仅忽略根目录下以 foo. 开头的文件或目录 |
| foo/ | | | 忽略 foo 目录及其所有内容 |
| foo/* | /foo.txt <br> /foo.gz | a/foo.txt <br> a/b/foo.log | 忽略 foo 目录下一层的所有内容，但不递归子目录 |
| foo/*/a.txt | foo/a/a.txt <br> foo/b/a.txt | foo/a.txt <br> foo/a/b/a.txt | 忽略 foo 目录下一层子目录中的 a.txt |
| !foo/a.txt | | | 保留 foo 目录下的 a.txt 文件 |
| foo/**/a.txt | foo/a.txt <br> foo/a/b/c/a.txt | | 忽略 foo 下任意层级的 a.txt 文件 |
| !foo/**/a.txt | | | 保留 foo 下任意层级的 a.txt 文件 |

:::

## 🚀 配置

### 1️⃣ 手动配置

::: note `.gitignore` 文件通常放在项目的根目录，也就是和 ==.git 文件夹==、==README.md== 同一层级的位置。
:::

::: code-tree title="GearPress" height="400px" entry="GearPress/.gitignore"

```gitignore title="GearPress/.gitignore"
### Intellij+all Patch ###
# Ignore everything but code style settings and run configurations
# that are supposed to be shared within teams.

.idea/*

!.idea/codeStyles
!.idea/runConfigurations

### macOS ###
.DS_Store
.AppleDouble
logs
*.log
```

```markdown title="GearPress/README.md"
This is a README markdown file.
```

:::

### 2️⃣ 在线生成

::: tip 下面列出个人常用的几个标签：
:::

* 🖥️ 操作系统：`Linux`、`macOS`、`Windows`
* 🛠️ 编译工具：`Intellij+all`、`VisualStudioCode`
* 📦 构建依赖：`Node`、`Maven`、`Java`

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/gitignore.io.png" />

<LinkCard title="👉 在线创建 gitignore.io" href="https://www.toptal.com/developers/gitignore" />

### 3️⃣ API

::: info [`gitignore.io API`](https://docs.gitignore.io/use/api) 可让你简单快速生成 .gitignore 文件
:::

::: tabs

@tab:active ⚡ 获取模板

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/linux,windows,macos
```

@tab 🔗 API接口 `（标签不区分大小写）`

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/{tags}
```

:::

::: info 获取所有支持的模板`标签`。
:::

::: tabs

@tab 🧾 JSON 格式

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/list?format=json
```

::: details 点击展开更多关于 `JSON 格式` 的响应信息

```json
"docfx": {
    "contents": "\n### DocFx ###\n.cache\n/**/_site/\n",
    "fileName": "DocFx.gitignore",
    "key": "docfx",
    "name": "DocFx"
},
"visualstudiocode": {
    "contents": "\n### VisualStudioCode ###\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n!.vscode/*.code-snippets\n\n# Local History for Visual Studio Code\n.history/\n\n# Built Visual Studio Code Extensions\n*.vsix\n\n### VisualStudioCode Patch ###\n# Ignore all local history of files\n.history\n.ionide\n",
    "fileName": "VisualStudioCode.gitignore",
    "key": "visualstudiocode",
    "name": "VisualStudioCode"
},
"phpstorm+iml": {
    "contents": "\n### PhpStorm+iml ###\n# Covers JetBrains IDEs: IntelliJ, RubyMine, PhpStorm, AppCode, PyCharm, CLion, Android Studio, WebStorm and Rider\n# Reference: https://intellij-support.jetbrains.com/hc/en-us/articles/206544839\n\n# User-specific stuff\n.idea/**/workspace.xml\n.idea/**/tasks.xml\n.idea/**/usage.statistics.xml\n.idea/**/dictionaries\n.idea/**/shelf\n\n# AWS User-specific\n.idea/**/aws.xml\n\n# Generated files\n.idea/**/contentModel.xml\n\n# Sensitive or high-churn files\n.idea/**/dataSources/\n.idea/**/dataSources.ids\n.idea/**/dataSources.local.xml\n.idea/**/sqlDataSources.xml\n.idea/**/dynamic.xml\n.idea/**/uiDesigner.xml\n.idea/**/dbnavigator.xml\n\n# Gradle\n.idea/**/gradle.xml\n.idea/**/libraries\n\n# Gradle and Maven with auto-import\n# When using Gradle or Maven with auto-import, you should exclude module files,\n# since they will be recreated, and may cause churn.  Uncomment if using\n# auto-import.\n# .idea/artifacts\n# .idea/compiler.xml\n# .idea/jarRepositories.xml\n# .idea/modules.xml\n# .idea/*.iml\n# .idea/modules\n# *.iml\n# *.ipr\n\n# CMake\ncmake-build-*/\n\n# Mongo Explorer plugin\n.idea/**/mongoSettings.xml\n\n# File-based project format\n*.iws\n\n# IntelliJ\nout/\n\n# mpeltonen/sbt-idea plugin\n.idea_modules/\n\n# JIRA plugin\natlassian-ide-plugin.xml\n\n# Cursive Clojure plugin\n.idea/replstate.xml\n\n# SonarLint plugin\n.idea/sonarlint/\n\n# Crashlytics plugin (for Android Studio and IntelliJ)\ncom_crashlytics_export_strings.xml\ncrashlytics.properties\ncrashlytics-build.properties\nfabric.properties\n\n# Editor-based Rest Client\n.idea/httpRequests\n\n# Android studio 3.1+ serialized cache file\n.idea/caches/build_file_checksums.ser\n\n### PhpStorm+iml Patch ###\n# Reason: https://github.com/joeblau/gitignore.io/issues/186#issuecomment-249601023\n\n*.iml\nmodules.xml\n.idea/misc.xml\n*.ipr\n",
    "fileName": "PhpStorm+iml.gitignore",
    "key": "phpstorm+iml",
    "name": "PhpStorm+iml"
},
"inforcms": {
    "contents": "\n### InforCMS ###\n# gitignore template for InforCRM (formerly SalesLogix)\n# website: https://www.infor.com/product-summary/cx/infor-crm/\n#\n# Recommended: VisualStudio.gitignore\n\n# Ignore model files that are auto-generated\nModelIndex.xml\nExportedFiles.xml\n\n# Ignore deployment files\n[Mm]odel/[Dd]eployment\n\n# Force include portal SupportFiles\n!Model/Portal/*/SupportFiles/[Bb]in/\n!Model/Portal/PortalTemplates/*/SupportFiles/[Bb]in\n",
    "fileName": "InforCMS.gitignore",
    "key": "inforcms",
    "name": "InforCMS"
},
...
```

::: table title="响应对象" align="right" full-width

| 属性 | 类型 | 描述 |
| --- | ---- | --- |
| fileName | String | 生成的 `.gitignore` 文件名 |
| key | String | 模板标签 |
| name | String |  模板名称 |
| contents | String | 生成的 `.gitignore` 内容 |

@tab 📄 Lines 格式

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/list?format=lines
```

::: details 点击展开更多关于 `Lines 格式` 的响应信息

```txt
1c
1c-bitrix
a-frame
actionscript
ada
adobe
advancedinstaller
adventuregamestudio
agda
al
...
```

:::

## 📎 其他

### 1️⃣ 提交被忽略的文件

::: note 使用 `git add -f`（或 `--force`）选项，强制提交忽略的文件

```bash
git add -f debug.log
```

:::

### 2️⃣ foo/、foo/*、foo/** 区别

::: important

* `foo/`：忽略整个目录（常用于彻底忽略目录）
* `foo/*`: 仅忽略该目录下第一层内容（不递归子目录）
* `foo/**`：忽略该目录下所有路径（功能上通常等价于 `foo/`，但语义上是路径递归匹配模式，更偏向 `glob 规则表达`，可用于与 `!` 组合实现更精细的控制）

:::
