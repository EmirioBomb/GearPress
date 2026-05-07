---
title: Cheat Sheet
tags:
    - Git
    - Cheat Sheet
    - Commands
createTime: 2026/05/07 10:23:57
permalink: /en/notes/vcs/git/git/
---

## 📌 What is Git

::: note

[`Git`](https://git-scm.com/) is a distributed ==version control system(VCS)== used to track changes in files and support collaborative software development.

It helps developers save versions, view history, and work together without conflicts.

:::

## 🔁 Workflow

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/git-workflow-en.png" />

## 🖥️ Cheat Sheet

::: table title="Cheat Sheet" align="right" full-width

| Command | Description |
| -- | -- |
| 🟢 Initialization 🟢 {colspan=2 rowspan=1 align=center .warning} | |
| git init | Initialize a new Git repository |
| git clone \<repository-url\> | Clone a remote repository to local |
| 🟡 Configuration 🟡 {colspan=6 rowspan=1 align=center .warning} | |
| git config --list | View all Git configuration |
| git config --global user.name \<your name\> | set global username |
| git config --global user.email \<your@email.com\> | set global email |
| git config --global commit.gpgsign true | Enable GPG commit signing in Git |
| git config --global https.proxy 127.0.0.1:7890 | HTTPs proxy for Git traffic |
| git config --global http.proxy 127.0.0.1:7890 | HTTP proxy for Git traffic |
| 🟣 Stage 🟣 {colspan=4 rowspan=1 align=center .warning} | |
| git add \<file\> | Stage a file |
| git add . | Stage all changes |
| git reset \<file\> | Unstage a file <Badge type="danger" text="Git （< 2.23）" /> |
| git restore --staged \<file\> | Remove file from staging area <Badge type="danger" text="Git （>= 2.23）" /> |
| 🔴 Commit 🔴 {colspan=3 rowspan=1 align=center .warning} | |
| git commit -m "message" | Create a commit |
| git commit -am "message" | Same to `git add . && git commit` |
| git commit --amend -m "new message" | Edit last commit message |
| 🟠 Branch 🟠 {colspan=6 rowspan=1 align=center .warning} | |
| git branch | List branches |
| git branch \<branch-name\> | Create branch |
| git switch \<branch-name\> | Switch branch |
| git switch -c \<branch-name\> | Create and switch branch |
| git merge \<branch-name\> | Merge branch into current branch |
| git branch -d \<branch-name\> | Delete branch |
| 🔵 Remote Repository 🔵 {colspan=5 rowspan=1 align=center .warning} | |
| git remote -v | View remote repositories |
| git remote add origin \<url\> | Add remote repository |
| git push origin main | Push commits to remote |
| git pull origin main | Pull and merge remote changes |
| git fetch | Fetch remote updates only |
| 🟩 Recovery 🟩 {colspan=4 rowspan=1 align=center .warning} | |
| git restore \<file\> | Discard local changes |
| git reset --soft HEAD~1 | Undo last commit but keep changes |
| git reset --hard HEAD~1 | Remove commit and changes permanently |
| git revert \<commit\> | Create reverse commit |
| 🟥 Stash 🟥 {colspan=4 rowspan=1 align=center .warning} | |
| git stash | Temporarily save changes |
| git stash list | View stash list |
| git stash pop | Restore latest stash |
| git stash clear | Delete all stash records |
| 🟧 Tag 🟧 {colspan=3 rowspan=1 align=center .warning} | |
| git tag | List tags |
| git tag \<tag-name\> | Create tag |
| git push origin \<tag-name\> | Push tag to remote |

:::
