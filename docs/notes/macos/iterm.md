---
title: iterm
createTime: 2026/06/01 16:43:47
permalink: /notes/macos/iterm/
---


## 📌 什么是 iTerm2

::: note

`iTerm2` 是 macOS 平台上一款功能强大的 ==终端模拟器（Terminal Emulator）==，被广泛认为是系统自带 `Terminal` 的增强版。它提供了丰富的终端功能、更高的可定制性以及更优秀的开发体验，是许多开发者在 macOS 上的首选终端工具。

:::

## 🚀 安装 iTerm2

<LinkCard icon="gg:website" title="下载并安装 iTerm2" href="https://iterm2.com/" />

## ✨ 增强美化 iTerm2

### 👀 最终效果  <Badge type="tip" text="Argonaut 主题" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-preview.png" />

### 1️⃣ 安装 Oh My Zsh

::: warning 在安装  [Oh My Zsh](https://ohmyz.sh/#install)  时，会自动备份原始 `.zshrc` 为 `.zshrc.pre-oh-my-zsh`，这可能导致原有环境配置丢失。为了保留原配置，可以将 `.zshrc.pre-oh-my-zsh` 的内容追加到新 `.zshrc` 文件的末尾。
:::

::: tabs

@tab 📥 curl

```bash:no-line-numbers
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

@tab ⚡ wget

```bash:no-line-numbers
$ sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

:::

### 2️⃣ 安装 Powerlevel10k

::: note [Powerlevel10k](https://github.com/romkatv/powerlevel10k) 是一款高性能的 ==Zsh 主题==，支持丰富的提示符信息展示和高度自定义配置，可帮助提升终端的可读性与使用体验。
:::

#### 🎨 安装字体 {#meslo-nerd-font}

::: note 下载并安装 [MesloLGS NF Font 字体](https://github.com/romkatv/dotfiles-public/tree/master/.local/share/fonts/NerdFonts)，可根据需要选择其中一个版本
:::

#### 🎛️ 安装 Powerlevel10k <Badge type="tip" text="Homebrew" />

```bash:no-line-numbers
$ brew install powerlevel10k
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
```

### 3️⃣ 重启 Zsh

```bash:no-line-numbers
$ exec zsh
```

### 4️⃣ 配置 Powerlevel10k

::: note 重启 `iTerm2` 后，`Powerlevel10k` 可能会自动启动配置向导，按照提示完成配置即可。
如果需要重新配置，可执行以下命令再次启动向导：
:::

```bash:no-line-numbers
$ p10k configure
```

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-p10k-config.png" />

### ⚙️ 配置iTerm2

::: info 可以通过快捷键 `⌘ + ,` 打开`设置（Settings...）`
:::

#### 1️⃣ 新建 Profile 并设为默认

::: details 打开菜单 `Settings > Profiles > General`，新建配置后，务必勾选 `Set as Default`，将其设为默认。
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-profile-new.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-default-profile.png" />
:::

#### 2️⃣ 禁用 Login Shell <Badge type="tip" text="Optional" />

::: details 打开菜单 `Settings > Profiles > General > Command`，避免每次启动 `iTerm2` 时输出如下信息：
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-login-shell-zsh.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-login-shell.png" />
:::

#### 3️⃣ 设置字体

::: details 打开菜单 `Settings > Profiles > Text > Font`， 请参照： [Meslo Nerd Font 字体](#meslo-nerd-font)
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-font.png" />
:::

#### 4️⃣ 设置配色

::: note 下载 [Iterm2-color-schemes](https://iterm2colorschemes.com/) 配色方案，并将其导入到 iTerm2，支持 `批量导入`。

::: details 个人偏好的 `配色`

* [Argonaut](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Argonaut.itermcolors)
* [Aura](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Aura.itermcolors)
* [Banana Blueberry](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Banana%20Blueberry.itermcolors)
* [Cool Night](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Cool%20Night.itermcolors)
* [Dark Pastel](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Dark%20Pastel.itermcolors)
* [Duckbones](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Duckbones.itermcolors)
* [Fahrenheit](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Fahrenheit.itermcolors)
* [Floraverse](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Floraverse.itermcolors)
* [Glacier](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Glacier.itermcolors)

⚠️`注`： 若想批量删除配色方案，可参考 [Bulk remove iTerm2 color schemes](https://gist.github.com/dedy-purwanto/11312110)
:::

::: details 打开菜单 `Settings > Profiles > Colors > Color Preset`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-color-preset.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-color-import.png" />
:::

#### 5️⃣ 设置状态栏  <Badge type="tip" text="Optional" />

::: details 打开菜单 `Settings > Profiles > Sessions > Status Bar`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-00.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-01.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-02.png" />
:::

#### 6️⃣ 启用 Minimal 主题

::: details 打开菜单 `Settings > Appearance > General > Theme`，将 `Regular` 更改为 `Minimal`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-window-regular.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-window-bar.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-preview.png" />
:::

#### 7️⃣ 安装 zsh-syntax-highlighting <Badge type="tip" text="Optional" />

::: note [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/tree/master) 是一个 `Zsh` 插件，可在命令行中 `实时高亮` 输入的命令，提高可读性并减少错误。
:::

```bash:no-line-numbers
# 1. 安装
$  brew install zsh-syntax-highlighting

# 2. 设置环境变量
$ echo "source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 3. 重启 zsh
$ exec zsh
```

#### 8️⃣ 安装 zsh-autosuggestions <Badge type="tip" text="Optional" />

::: note [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 是一个 `Zsh` 插件，可根据历史命令 `实时提供输入建议`，提高命令行输入效率。
:::

```bash:no-line-numbers
# 1. 安装
$  brew install zsh-autosuggestions

# 2. 设置环境变量
$ echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 3. 重启 zsh
$ exec zsh
```

#### 9️⃣ 安装 fastfetch <Badge type="tip" text="Optional" />

::: note [fastfetch](https://github.com/fastfetch-cli/fastfetch)是一个类似 `Neofetch` 的轻量级命令行工具，用于在终端快速显示系统信息和硬件配置。
:::

```bash:no-line-numbers
$  brew install fastfetch
```

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-fastfetch.png" />

### 🔧 Visual Studio Code 字体

::: note 可以通过快捷键 `⌘ + ,` 打开`设置`，并查询 `terminal.integrated.font`
⚠️`注`: 字体名为 `MesloLGS NF`
:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-vscode-fonts.png" />
