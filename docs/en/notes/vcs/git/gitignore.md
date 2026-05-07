---
title: gitignore
createTime: 2026/05/06 10:10:46
permalink: /en/notes/vcs/git/gitignore/
---

## 📌 What is gitignore

::: note

A [`gitignore`](https://git-scm.com/docs/gitignore) file specifies intentionally untracked files that Git should ignore. Files already tracked by Git are not affected.

:::

## ✨ When you use it

* Ignore build or runtime output directories like `dist/`, `build/`, or `target/`
* Ignore dependency folders like `node_modules/`
* Ignore log files like `*.log` or `logs/`
* Ignore local or sensitive environment files like `.env` and `.env.local`
* Ignore IDE or editor configuration folders like `.idea/` and `.vscode/`

## 🪄 Patterns

::: table title="Patterns" align="right" full-width

| Pattern | Matches | Not Match | Explanation |
| ------- | ------- | --------- | ----------- |
| foo.* | foo.txt <br> a/foo.gz <br> a/b/c/foo.xml | | Ignores any file in any directory that starts with foo. regardless of the extension. |
| /foo.* | /foo.txt <br> /foo.gz | a/foo.txt <br> a/b/foo.log | Ignores any file starting with foo. only if it is located in the root directory of your project. |
| foo/ | | | Ignores an entire directory named foo and everything inside it. |
| foo/* | /foo.txt <br> /foo.gz | a/foo.txt <br> a/b/foo.log | Ignores everything inside the directory foo |
| foo/*/a.txt | foo/a/a.txt <br> foo/b/a.txt | foo/a.txt <br> foo/a/b/a.txt | Ignores a.txt exactly one level deep. |
| !foo/a.txt | | | Un-ignore a.txt directly under foo/ |
| foo/**/a.txt | foo/a.txt <br> foo/a/b/c/a.txt | | Ignores a.txt at any depth inside foo. |
| !foo/**/a.txt | | | Un-ignore a.txt in any subdirectory under foo/ (recursive) |

:::

## 🚀 Configuration

### 1️⃣ Manual Configuration

::: note The `.gitignore` file is usually placed in the project root, alongside the ==.git folder== and ==README.md==.
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

### 2️⃣ Online Generator

::: tip My commonly Used Tags:
:::

* 🖥️ OS: `Linux`、`macOS`、`Windows`
* 🛠️ IDEs: `Intellij+all`、`VisualStudioCode`
* 📦 Build: `Node`、`Maven`、`Java`

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/gitignore.io.png" />

<LinkCard title="👉 Create on gitignore.io" href="https://www.toptal.com/developers/gitignore" />

### 3️⃣ API

::: info The [`gitignore.io API`](https://docs.gitignore.io/use/api) allows you to programmatically generate .gitignore
:::

::: tabs

@tab:active ⚡ GET Templates

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/linux,windows,macos
```

@tab 🔗 Endpoints `(tags are case-insensitive)`

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/{tags}
```

:::

::: info Get all supported template `tags`.
:::

::: tabs

@tab 🧾 JSON Format

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/list?format=json
```

::: details Click to see more about `JSON Format`  response

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

::: table title="Response Object" align="right" full-width

| Field | Type | Description |
| ----- | ---- | ----------- |
| fileName | String | Output `.gitignore` file name |
| key | String | Template identifier (tag) |
| name | String |  Template name |
| contents | String | Generated `.gitignore` content |

@tab 📄 Lines Format

```text:no-line-numbers
https://www.toptal.com/developers/gitignore/api/list?format=lines
```

::: details Click to see more about `Lines Format` response

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

## 📚 Notes

### 1️⃣ Committing ignored files

::: note Use` git add -f` (or --force) to include ignored files.

```bash
git add -f debug.log
```

:::

### 2️⃣ Differences between foo/, foo/* and foo/**

::: important

* `foo/`: Ignore the entire directory
* `foo/*`: Ignore everything inside the directory foo
* `foo/**`: Ignore everything under the directory (recursive, often used with `!` for exceptions)

:::
