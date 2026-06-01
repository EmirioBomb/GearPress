---
title: Homebrew
createTime: 2026/05/29 17:03:37
permalink: /notes/macos/homebrew/
---

## 📌 什么是 Homebrew

::: note

[`Homebrew`](https://brew.sh/)  是 `macOS`（以及 `Linux`）的 ==包管理器（package manager）==

:::

## 🚀 安装 Homebrew

<LinkCard icon="gg:website" title="Homebrew 官网" href="https://brew.sh/" />

```bash:no-line-numbers
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## ✅ Homebrew 状态检查

```bash:no-line-numbers
# 查看版本
$ brew --version

# 系统环境是否准备就绪
$ brew doctor 

```

## ⚠️ 修复 Homebrew

::: warning 当终端提示 `brew: command not found` 时，说明 `Homebrew` 的环境变量未正确配置或已被破坏。
可通过以下方法重新设置 `Homebrew` 环境变量：

```bash:no-line-numbers
$ echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
$ source ~/.zshrc
```

:::

## 📦 常用软件包

### 1. Git

::: note [`Git`](https://git-scm.com/) 是一个非常流行的 `分布式` ==版本控制系统（Version Control System）==，用于高效地管理文件（尤其是源代码）的变更历史。
:::

```bash:no-line-numbers
$ brew install git
```

### 2. nvm

::: note `NVM（Node Version Manager）` 是 ==Node.js 的版本管理工具==，它可以让你在同一台电脑上灵活地安装、切换和管理多个 Node.js 版本。
:::

::: details 点击展开详情

::: steps

1. 安装

    ```bash:no-line-numbers
    $ brew install nvm
    ```

2. 配置

    ::: info 将以下内容添加到 `~/.bashrc`、`~/.profile` 或 `~/.zshrc` 配置文件中，以便在每次登录终端时自动加载 nvm
    :::

    ```bash:no-line-numbers
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    ```

3. 用法

    ```bash:no-line-numbers
    # 查看 nvm 版本
    $ nvm --version

    # 查看当前 Node.js 版本
    $ nvm current

    # 查看可安装的 Node.js 版本
    $ nvm ls-remote

    # 查看当前已安装的 Node.js 版本
    $ nvm list

    # 安装指定版本
    $ nvm install 22.22.3

    # 安装最新 LTS 版本
    $ nvm install --lts

    # 卸载指定版本
    $ nvm uninstall 24

    # 使用指定版本
    $ nvm use 22.22.3

    ```

:::

### 3. Pnpm

::: note `Pnpm（Performant Node.js Package Manager）` 是一个高性能的 ==Node.js 包管理器==，功能类似 npm 或 yarn，但在性能、磁盘占用和依赖管理上有显著优势。
:::

```bash:no-line-numbers
$ brew install pnpm
```

### 4. Python

::: note `Python` 是一种 ==编程语言==，可以帮助你快速完成开发任务，并轻松连接和集成不同系统。
:::

```bash:no-line-numbers
$ brew install python@3.14
```
