---
title: GPG Signing key
icon: vscode-icons:file-type-gpg
tags:
    - GPG
    - Git
createTime: 2026/06/04 16:00:00
permalink: /en/notes/vcs/git/gpg/
---

## 🔐 Why Use GPG Signature

::: note
`GPG signature` verifies the identity and integrity of your commits. When verified, GitHub displays a **`Verified`** badge on your commits, boosting their credibility and security.
:::

## 📦 Install GnuPG

::: info Install using `Homebrew`. See [Homebrew Setup Guide](/en/notes/macos/homebrew/).
:::

```bash:no-line-numbers
$ brew install gnupg
```

## 🔑 Generate GPG Key

::: steps

1. **Start the key generation**

    ```bash:no-line-numbers
    $ gpg --full-generate-key
    ```

2. **Choose key type**

    ```text:no-line-numbers
    Please select what kind of key you want:
       (1) RSA and RSA (default)
       (2) DSA and Elgamal
       (3) DSA (sign only)
       (4) RSA (sign only)
    Your selection? 1
    ```

3. **Set key size**

    ```text:no-line-numbers
    RSA keys may be between 1024 and 4096 bits long.
    What keysize do you want? (3072) 4096
    ```

4. **Set expiration**

    ```text:no-line-numbers
    Please specify how long the key should be valid.
            0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    ```

5. **Enter your info**

    ```text:no-line-numbers
    Real name: Your Name
    Email address: your.email@example.com
    Comment: (optional - can be left blank)
    ```

    ::: warning **The email must match your GitHub account email**, or verification won't work!
    :::

6. **Set a passphrase**

    ```text:no-line-numbers
    Enter passphrase: (enter a secure password)
    Repeat: (confirm)
    ```

:::

## 🔍 View Your Keys

```bash:no-line-numbers
$ gpg --list-secret-keys --keyid-format=long
```

Example output:

```text::no-line-numbers
sec   rsa4096/3AA5C34371567BD2 2026-06-04 [SC] [expires: 2027-06-04]
      85E38EC66371567BD2E7D6C4216A591059929882
uid   [ultimate] Your Name <your.email@example.com>
ssb   rsa4096/42B317FD4BA89E7A 2026-06-04 [E] [expires: 2027-06-04]
```

::: tip Extract the **16-character key ID** after the `/` on the `sec` line, like `3AA5C34371567BD2`
:::

## ⚙️ Configure Git to Use GPG

::: steps

### 1️⃣ Enable GPG signing globally

```bash:no-line-numbers
$ git config --global commit.gpgsign true
$ git config --global tag.gpgsign true
```

### 2️⃣ Set your signing key

```bash:no-line-numbers
$ git config --global user.signingkey 3AA5C34371567BD2
```

### 3️⃣ Configure name and email

```bash:no-line-numbers
$ git config --global user.name "yourname"
$ git config --global user.email "your.email@example.com"
```

### 4️⃣ pinentry-mac <Badge type="tip" text="Optional" />

::: tip Want a prompt when entering your PIN or passphrase? Install `pinentry‑mac`.
:::

```bash:no-line-numbers
$ brew install pinentry-mac
$ echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
$ killall gpg-agent
```

## 🚀 Export & Upload Public Key to GitHub

### 🔑 Export your public key

```bash:no-line-numbers
$ gpg --armor --export 3AA5C34371567BD2
```

Output:

```text::no-line-numbers
-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EZmfQxQEEALzX2hZ3...（lots of characters in the middle）...kMQQA
AKCAKQDfw=
-----END PGP PUBLIC KEY BLOCK-----
```

### 📤 Add it to GitHub

::: steps

1. **Open GitHub Settings**  
    <LinkCard icon="mdi:web" title="Go to SSH and GPG keys" href="https://github.com/settings/keys" />

2. **Create a new GPG key**  
   Click the "`New GPG key`" button

3. **Paste your public key**  
   Copy the entire key (everything from `-----BEGIN` to `-----END`) into the text box

4. **Save**  
   Click "`Add GPG key`"

:::

## ✅ Test Your GPG Signature

::: steps

1. **Make a commit**  

    ```bash:no-line-numbers
    $ git commit -S -m "Test GPG signature"
    ```

    ::: info

    - The `-S` flag forces signing for this commit
    - If you set `commit.gpgsign true`, you can skip `-S`
    - It'll prompt for your GPG passphrase (the one you set earlier)

    :::

2. **Push it**  

    ```bash:no-line-numbers
    $ git push
    ```

3. **Check on GitHub**  
    ::: note Visit your repo and look at your commit history—you should see the green **`Verified`** badge
    :::

:::

## 📚 References

- [GitHub Docs - Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [GitHub Docs - Generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [GnuPG Documentation](https://www.gnupg.org/documentation/)
