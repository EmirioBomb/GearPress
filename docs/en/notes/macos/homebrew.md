---
title: Homebrew
createTime: 2026/05/29 17:03:07
permalink: /en/notes/macos/homebrew/
---


## 📌 What is Homebrew

::: note

[`Homebrew`](https://brew.sh/) The Missing Package Manager for `macOS (or Linux)`

:::

## 🚀 Install Homebrew

<LinkCard icon="gg:website" title="Homebrew" href="https://brew.sh/" />

```bash:no-line-numbers
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## ✅ Check Homebrew status

```bash:no-line-numbers
# check Homebrew version
$ brew --version

# check your system for potential problems.
$ brew doctor 

```

## ⚠️ Fix Homebrew

::: warning If `brew: command not found` appears, restore the Homebrew environment:

```bash:no-line-numbers
$ echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
$ source ~/.zshrc
```

:::

## 📦 Common Packages

### 1. Git

::: note [`Git`](https://git-scm.com/) is a distributed ==version control system(VCS)== used to track changes in files and support collaborative software development.
:::

```bash:no-line-numbers
$ brew install git
```

### 2. nvm

::: note `nvm` is a ==version manager for node.js==, designed to be installed per-user, and invoked per-shell.
:::

::: details Click to see more

::: steps

1. Install

    ```bash:no-line-numbers
    $ brew install nvm
    ```

2. Configure

    ::: info Now add these lines to your `~/.bashrc, ~/.profile, or ~/.zshrc` file to have it automatically sourced upon login: (you may have to add to more than one of the above files)
    :::

    ```bash:no-line-numbers
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    ```

3. Usage

    ```bash:no-line-numbers
    # check NVM version
    $ nvm --version

    # check Node.js version
    $ nvm current

    # list available Node.js versions
    $ nvm ls-remote

    # list installed Node.js versions
    $ nvm list

    # install a specific version
    $ nvm install 22.22.3

    # install the latest LTS version
    $ nvm install --lts

    # uninstall a specific version
    $ nvm uninstall 24

    # use a specific version
    $ nvm use 22.22.3

    ```

:::

### 3. Pnpm

::: note `Pnpm` is a fast and efficient ==package manager for Node.js== that saves disk space through a shared dependency store.
:::

```bash:no-line-numbers
$ brew install pnpm
```

### 4. Python

::: note `Python` is a ==programming language== that lets you work quickly and integrate systems more effectively.
:::

```bash:no-line-numbers
$ brew install python@3.14
```
