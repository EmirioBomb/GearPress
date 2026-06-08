---
title: GPG 签名
icon: vscode-icons:file-type-gpg
tags:
    - GPG
    - Git
createTime: 2026/06/04 16:00:00
permalink: /notes/vcs/git/gpg/
---

## 🔐 为什么使用 GPG 签名

::: note
`GPG签名` 能验证 `Commit` 的身份和完整性。验证成功后，GitHub 会在提交记录中显示 **`Verified`** 标识，增强代码的可信度和安全性。
:::

## 📦 安装 GnuPG

::: info 使用 `Homebrew` 安装。参考 [Homebrew 安装教程](/notes/macos/homebrew/)。
:::

```bash:no-line-numbers
$ brew install gnupg
```

## 🔑 生成 GPG 密钥

::: steps

1. **启动生成程序**

    ```bash:no-line-numbers
    $ gpg --full-generate-key
    ```

2. **选择密钥类型**

    ```text:no-line-numbers
    Please select what kind of key you want:
       (1) RSA and RSA (default)
       (2) DSA and Elgamal
       (3) DSA (sign only)
       (4) RSA (sign only)
    Your selection? 1
    ```

3. **设置密钥大小**

    ```text:no-line-numbers
    RSA keys may be between 1024 and 4096 bits long.
    What keysize do you want? (3072) 4096
    ```

4. **设置有效期**

    ```text:no-line-numbers
    Please specify how long the key should be valid.
            0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    ```

5. **输入用户信息**

    ```text:no-line-numbers
    Real name: Your Name
    Email address: your.email@example.com
    Comment: (optional - can be left blank)
    ```

    ::: warning **`Email` 必须与 `GitHub 账号的邮箱`一致**，否则 GitHub 无法验证签名！
    :::

6. **设置密码**

    ```text:no-line-numbers
    Enter passphrase: (输入安全密码)
    Repeat: (重复输入)
    ```

:::

## 🔍 查看密钥

```bash:no-line-numbers
$ gpg --list-secret-keys --keyid-format=long
```

输出示例：

```text::no-line-numbers
sec   rsa4096/3AA5C34371567BD2 2026-06-04 [SC] [expires: 2027-06-04]
      85E38EC66371567BD2E7D6C4216A591059929882
uid   [ultimate] Your Name <your.email@example.com>
ssb   rsa4096/42B317FD4BA89E7A 2026-06-04 [E] [expires: 2027-06-04]
```

::: tip `sec` 行的 `/` 后面提取 **16 位密钥 ID**，如 `3AA5C34371567BD2`
:::

## ⚙️ 使用 GPG 签名

::: steps

### 1️⃣ 全局启用 GPG 签名

```bash:no-line-numbers
$ git config --global commit.gpgsign true
$ git config --global tag.gpgsign true
```

### 2️⃣ 配置签名密钥

```bash:no-line-numbers
$ git config --global user.signingkey 3AA5C34371567BD2
```

### 3️⃣ 配置用户名与邮箱

```bash:no-line-numbers
$ git config --global user.name "yourname"
$ git config --global user.email "your.email@example.com"
```

### 4️⃣ pinentry-mac <Badge type="tip" text="Optional" />

::: tip 如果想在需要输入 `PIN` 或 `密码短语` 时弹出提示，可以先装  `pinentry‑mac`。
:::

```bash:no-line-numbers
$ brew install pinentry-mac
$ echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
$ killall gpg-agent
```

## 🚀 导出公钥并上传到 GitHub

### 🔑 导出公钥

```bash:no-line-numbers
$ gpg --armor --export 3AA5C34371567BD2
```

输出内容：

```text::no-line-numbers
-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EZmfQxQEEALzX2hZ3...（中间省略大量字符）...kMQQA
AKCAKQDfw=
-----END PGP PUBLIC KEY BLOCK-----
```

### 📤 上传到 GitHub

::: steps

1. **打开 GitHub 设置**  
    <LinkCard icon="mdi:web" title="访问 SSH and GPG keys" href="https://github.com/settings/keys" />

2. **添加 GPG 密钥**  
   点击 "`New GPG key`" 按钮

3. **粘贴公钥**  
   将上述完整的公钥内容（从 `-----BEGIN` 到 `-----END` 的所有内容）粘贴到输入框

4. **保存**  
   点击 "`Add GPG key`" 按钮

:::

## ✅ 测试 GPG 签名

::: steps

1. **提交**  

    ```bash:no-line-numbers
    $ git commit -S -m "Test GPG signature"
    ```

    ::: info

    - `-S` 参数强制对此提交签名
    - 如已配置 `commit.gpgsign true`，可省略 `-S`
    - 会提示输入 GPG 密码（即生成密钥时设置的密码）

    :::

2. **推送**  

    ```bash:no-line-numbers
    $ git push
    ```

3. **验证**  
    ::: note 访问你的仓库，查看提交记录，应该看到 **`Verified`** 标识（绿色徽章）
    :::

:::

## 📚 参考资源

- [GitHub 官方文档 - Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [GitHub 官方文档 - Generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [GnuPG 官方文档](https://www.gnupg.org/documentation/)
