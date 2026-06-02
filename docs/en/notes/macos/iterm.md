---
title: iterm
createTime: 2026/06/01 16:43:36
permalink: /en/notes/macos/iterm/
---

## 📌 What is iTerm2

::: note

`iTerm2` is a replacement for `Terminal` and the successor to iTerm. It works on Macs with ==macOS 12.4 or newer==. `iTerm2` brings the terminal into the modern age with features you never knew you always wanted.

:::

## 🚀 Install iTerm2

<LinkCard icon="gg:website" title="Download and Install iTerm2" href="https://iterm2.com/" />

## ✨ iTerm2 Appearance Customization

### 👀 Preview  <Badge type="tip" text="Argonaut Color Preset" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-preview.png" />

### 1️⃣ Install Oh My Zsh

::: warning When installing [Oh My Zsh](https://ohmyz.sh/#install) , the installer automatically backs up the original `.zshrc` to `.zshrc.pre-oh-my-zsh`. As a result, existing shell configurations may no longer be applied.

To retain your previous configuration, append the contents of `.zshrc.pre-oh-my-zsh` to the end of the new `.zshrc` file.
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

### 2️⃣ Install Powerlevel10k

::: note [Powerlevel10k](https://github.com/romkatv/powerlevel10k) is a fast and feature-rich ==Zsh theme==. It provides extensive prompt customization and detailed information display, enhancing both terminal readability and usability.
:::

#### 🎨 Install Font {#meslo-nerd-font}

::: note Download and Install [MesloLGS NF Font](https://github.com/romkatv/dotfiles-public/tree/master/.local/share/fonts/NerdFonts), Choose one of the available variants based on your preference.
:::

#### 🎛️ Install Powerlevel10k <Badge type="tip" text="Homebrew" />

```bash:no-line-numbers
$ brew install powerlevel10k
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
```

### 3️⃣ Restart Zsh

```bash:no-line-numbers
$ exec zsh
```

### 4️⃣ Configure Powerlevel10k

::: note After restarting `iTerm2`, `Powerlevel10k` may automatically start the configuration wizard. Follow the prompts to complete the setup.
To run the configuration wizard again, execute:
:::

```bash:no-line-numbers
$ p10k configure
```

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-p10k-config.png" />

### ⚙️ Configure iTerm2

::: info Press `⌘ + ,` to open the `Settings...` panel in iTerm2.
:::

#### 1️⃣ Create and Set a Default Profile

::: details Open `Settings > Profiles > General`. After creating a new profile, make sure to select `Set as Default`to set it as the default profile.
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-profile-new.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-default-profile.png" />
:::

#### 2️⃣ Disable Login Shell <Badge type="tip" text="Optional" />

::: details Open `Settings > Profiles > General > Command` , to prevent the following message from appearing on every `iTerm2` launch:
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-login-shell-zsh.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-login-shell.png" />
:::

#### 3️⃣ Font

::: details Open `Settings > Profiles > Text > Font`， see: [Meslo Nerd Font](#meslo-nerd-font)
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-font.png" />
:::

#### 4️⃣ Color Preset

::: note Download [Iterm2-color-schemes](https://iterm2colorschemes.com/) and import it into iTerm2. `Bulk import` is supported.

::: details My Favour `Color Preset`

* [Argonaut](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Argonaut.itermcolors)
* [Aura](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Aura.itermcolors)
* [Banana Blueberry](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Banana%20Blueberry.itermcolors)
* [Cool Night](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Cool%20Night.itermcolors)
* [Dark Pastel](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Dark%20Pastel.itermcolors)
* [Duckbones](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Duckbones.itermcolors)
* [Fahrenheit](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Fahrenheit.itermcolors)
* [Floraverse](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Floraverse.itermcolors)
* [Glacier](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Glacier.itermcolors)

⚠️`Notice`： For instructions on removing color schemes in bulk, see: [Bulk remove iTerm2 color schemes](https://gist.github.com/dedy-purwanto/11312110)
:::

::: details Open `Settings > Profiles > Colors > Color Preset`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-color-preset.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-color-import.png" />
:::

#### 5️⃣ Status Bar  <Badge type="tip" text="Optional" />

::: details Open `Settings > Profiles > Sessions > Status Bar`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-00.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-01.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-statusbar-02.png" />
:::

#### 6️⃣ Enable Minimal Theme

::: details Open `Settings > Appearance > General > Theme`，Change `Regular` to `Minimal`
<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-window-regular.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-window-bar.png" />

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-preview.png" />
:::

#### 7️⃣ Install zsh-syntax-highlighting <Badge type="tip" text="Optional" />

::: note [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/tree/master) provides `syntax highlighting` for the shell zsh. It enables highlighting of commands whilst they are typed at a zsh prompt into an interactive terminal
:::

```bash:no-line-numbers
# 1. install
$  brew install zsh-syntax-highlighting

# 2. configure profile
$ echo "source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 3. restart zsh
$ exec zsh
```

#### 8️⃣ Install zsh-autosuggestions <Badge type="tip" text="Optional" />

::: note [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) It `suggests commands` as you type based on history and completions.
:::

```bash:no-line-numbers
# 1. install
$  brew install zsh-autosuggestions

# 2. configure profile
$ echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 3. restart zsh
$ exec zsh
```

#### 9️⃣ Install fastfetch <Badge type="tip" text="Optional" />

::: note [fastfetch](https://github.com/fastfetch-cli/fastfetch) is a `neofetch-like` tool for fetching system information and displaying it in a visually appealing way.
:::

```bash:no-line-numbers
$  brew install fastfetch
```

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-fastfetch.png" />

### 🔧 Visual Studio Code Font

Press `⌘ + ,` to open the `Settings` panel in iTerm2.

::: note Press `⌘ + ,` to open the `Settings` and search `terminal.integrated.font`
⚠️`Notice`: The Font Family is `MesloLGS NF`
:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/iterm2/iterm-vscode-fonts.png" />
