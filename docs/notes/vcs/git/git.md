---
title: 命令速查
tags:
    - Git
    - Cheat Sheet
    - Commands
    - 命令速查
createTime: 2026/05/07 11:02:26
permalink: /notes/vcs/git/git/
---

## 📌 什么是 Git

::: note

[`Git`](https://git-scm.com/) 是一个非常流行的 `分布式` ==版本控制系统（Version Control System）==，用于高效地管理文件（尤其是源代码）的变更历史。

它通过记录项目在不同时间点的快照，使开发者能够追踪修改内容、恢复历史版本，并支持多人在不同分支上并行开发，最终将变更合并到统一的代码库中。

:::

## 🔁 工作流程

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/git-workflow-zh.png" />

## 🖥️ 常用命令

::: table title="命令速查" align="right" full-width

| 命令 | 描述 |
| -- | -- |
| 🟢 初始化 🟢 {colspan=2 rowspan=1 align=center .warning} | |
| git init | 初始化 Git 仓库 |
| git clone \<repository-url\> | 将远程仓库克隆到本地 |
| 🟡 配置 🟡 {colspan=6 rowspan=1 align=center .warning} | |
| git config --list | 查看所有 Git 配置 |
| git config --global user.name \<your name\> | 配置全局用户名 |
| git config --global user.email \<your@email.com\> | 配置全局邮箱 |
| git config --global commit.gpgsign true | 启用 Git 中的 GPG 提交签名 |
| git config --global https.proxy 127.0.0.1:7890 | 配置 HTTPS 代理 |
| git config --global http.proxy 127.0.0.1:7890 | 配置 HTTP 代理 |
| 🟣 暂存 🟣 {colspan=4 rowspan=1 align=center .warning} | |
| git add \<file\> | 暂存文件 |
| git add . | 暂存所有文件 |
| git reset \<file\> | 取消暂存，保留更改 <Badge type="danger" text="Git （< 2.23）" /> |
| git restore --staged \<file\> | 取消暂存，保留更改 <Badge type="danger" text="Git （>= 2.23）" /> |
| 🔴 提交 🔴 {colspan=3 rowspan=1 align=center .warning} | |
| git commit -m "message" | 提交信息 |
| git commit -am "message" | 等同于 `git add . && git commit` |
| git commit --amend -m "new message" | 修改上一次提交信息 |
| 🟠 分支 🟠 {colspan=6 rowspan=1 align=center .warning} | |
| git branch | 查看分支 |
| git branch \<branch-name\> | 创建分支 |
| git switch \<branch-name\> | 切换分支 |
| git switch -c \<branch-name\> | 创建并切换到该分支 |
| git merge \<branch-name\> | 合并到当前分支 |
| git branch -d \<branch-name\> | 删除分支 |
| 🔵 远程仓库 🔵 {colspan=5 rowspan=1 align=center .warning} | |
| git remote -v | 查看远程仓库 |
| git remote add origin \<url\> | 新增远程仓库 |
| git push origin main | 推送到远程仓库 |
| git pull origin main | 拉取并合并远程更改 |
| git fetch | 仅获取远程更新（不合并到本地） |
| 🟩 撤销 🟩 {colspan=4 rowspan=1 align=center .warning} | |
| git restore \<file\> | 恢复文件 |
| git reset --soft HEAD~1 | 撤销上一次提交但保留更改 |
| git reset --hard HEAD~1 | 永久删除提交及其更改 |
| git revert \<commit\> | 撤销提交 |
| 🟥 暂存区 🟥 {colspan=4 rowspan=1 align=center .warning} | |
| git stash | 临时保存当前修改 |
| git stash list | 查看所有已保存的 stash |
| git stash pop | 恢复最新的 stash |
| git stash clear | 删除所有 stash |
| 🟧 Tag 🟧 {colspan=3 rowspan=1 align=center .warning} | |
| git tag | 查看标签 |
| git tag \<tag-name\> | 创建标签 |
| git push origin \<tag-name\> | 将标签推送到远程仓库 |

:::
