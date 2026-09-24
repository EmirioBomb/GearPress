---
title: Linux 命令速查
icon: lucide:book-open-text
tags:
  - Linux
  - Shell
  - Commands
  - 命令速查
createTime: 2026/09/23 13:22:00
permalink: /notes/linux/commands/
---

## 📖 阅读方式

命令按使用场景分类。示例可直接复制，尖括号中的内容（如 `<path>`、`<pid>`）需替换为实际值；进阶用法可展开查看。

::: tip 平台与安全
示例以 Linux/GNU 为主；涉及删除、权限、进程或抓包的命令，请先确认目标和环境。
:::

## 📁 目录与文件

### `pwd`

显示当前工作目录的绝对路径。

```bash:no-line-numbers
# 显示当前工作目录
pwd

# 显示解析符号链接后的物理路径
pwd -P
```

### `ls`

查看目录内容、文件权限和修改时间。

```bash:no-line-numbers
# 包含隐藏文件
ls -la

# 使用易读单位显示大小
ls -lh

# 按修改时间倒序排列
ls -lt

# 按文件大小倒序排列
ls -lS

# 只查看目录本身，不展开内容
ls -ld <path>
```

::: table title="常用参数" full-width

| 参数 | 作用 |
| -- | -- |
| `-l` | 显示详细信息 |
| `-a` | 包含隐藏文件 |
| `-h` | 使用易读单位 |
| `-t` | 按修改时间排序 |
| `-S` | 按文件大小排序 |

:::

### `cd`

切换当前 Shell 的工作目录。

```bash:no-line-numbers
# 切换到绝对路径
cd /var/log

# 切换到当前目录下的 logs
cd ./logs

# 返回上一级目录
cd ..

# 返回当前用户的主目录
cd ~

# 返回上一次所在的目录
cd -
```

### `mkdir`

创建目录。

```bash:no-line-numbers
# 创建 logs 目录
mkdir logs

# 同时创建不存在的父目录
mkdir -p project/config/prod

# 创建目录并设置权限
mkdir -m 755 public
```

### `rmdir`

删除空目录。

```bash:no-line-numbers
# 删除空目录
rmdir empty-dir
```

### `touch`

创建空文件，或更新文件的访问时间和修改时间。

```bash:no-line-numbers
# 文件不存在时创建空文件
touch app.log

# 文件不存在时不创建
touch -c app.log

# 设置修改时间
touch -t 202609231322 app.log
```

### `cp`

复制文件或目录。

```bash:no-line-numbers
# 复制并重命名文件
cp source.txt backup.txt

# 递归复制目录
cp -r source-dir backup-dir

# 尽量保留文件属性
cp -a source-dir backup-dir
```

### `mv`

移动或重命名文件和目录。

```bash:no-line-numbers
# 重命名文件
mv old-name.txt new-name.txt

# 移动文件到目录
mv report.txt archive/
```

### `ln`

创建硬链接或符号链接。符号链接更常用于引用文件或目录。

```bash:no-line-numbers
# 创建文件的硬链接
ln source.txt source-link.txt

# 创建文件的符号链接
ln -s /opt/app/config.yml config.yml

# 创建目录的符号链接
ln -s /var/log/app logs
```

### `readlink`

查看符号链接指向的目标，或解析规范化路径。

```bash:no-line-numbers
# 查看符号链接记录的目标
readlink config.yml

# 解析为绝对规范路径
readlink -f config.yml
```

::: note 平台差异

`readlink -f` 常见于 GNU/Linux，macOS 自带的 BSD `readlink` 默认不支持该选项。

:::

### `file`

根据文件内容识别类型，而不是只根据扩展名判断。

```bash:no-line-numbers
# 识别文件类型
file archive.bin

# 识别目录下所有条目
file *

# 输出 MIME 类型
file --mime-type image.png
```

### `command -v`

确认命令能否由当前 Shell 找到，并查看它实际解析到的位置或类型。

```bash:no-line-numbers
# 查看命令来源
command -v python

# 同时检查多个命令
command -v git curl node
```

`command -v` 是 Shell 内建的可移植检查方式，通常比只查找可执行文件的 `which` 更可靠。

### `basename` / `dirname`

分别提取路径末尾的文件名部分和父目录部分，常用于 Shell 脚本。

```bash:no-line-numbers
# 提取文件名
basename /var/log/app.log

# 去除指定后缀
basename /var/log/app.log .log

# 提取父目录
dirname /var/log/app.log
```

### `rm`

删除文件和目录。

```bash:no-line-numbers
# 删除文件
rm temporary.txt

# 递归删除目录
rm -r old-directory
```

::: table title="常用参数" full-width

| 参数 | 作用 |
| -- | -- |
| `-i` | 删除前逐项询问 |
| `-I` | 删除大量文件前询问一次（GNU/Linux 常见） |
| `-r` | 递归处理目录 |
| `-f` | 强制删除，不询问 |

:::

::: danger 谨慎使用递归删除
`rm -rf` 会递归删除目标路径且不进行确认。执行前请先使用 `pwd` 和 `ls` 确认当前目录与目标内容。
:::

```bash:no-line-numbers
# 强制递归删除目标路径
rm -rf <path>
```

## 📄 文件内容

### `cat`

输出文件内容，适合查看较小的文件或合并多个文件。

```bash:no-line-numbers
# 输出文件内容
cat config.yml

# 为所有行显示行号
cat -n config.yml

# 只为非空行显示行号
cat -b config.yml

# 合并连续空行
cat -s config.yml

# 合并文件内容
cat file1 file2 > merged.txt
```

### `less`

分页查看文件，适合日志等较大的文件。

```bash:no-line-numbers
# 分页查看文件
less app.log

# 显示行号
less -N app.log

# 从第 100 行附近开始查看
less +100 app.log
```

在 `less` 中可以使用 `Space` 向下翻页、`b` 向上翻页、`/pattern` 搜索、`n` 查看下一个匹配项，使用 `q` 退出。

### `head`

查看文件开头的内容。

```bash:no-line-numbers
# 查看文件开头的 20 行
head -n 20 app.log
```

### `tail`

查看文件结尾，也可以持续跟踪日志。

```bash:no-line-numbers
# 查看文件最后 100 行
tail -n 100 app.log

# 从第 100 行开始查看到文件末尾
tail -n +100 app.log

# 持续跟踪新增内容
tail -f app.log

# 实时筛选包含 ERROR 的新增行
tail -f app.log | grep --line-buffered "ERROR"

# 适配日志轮转，持续跟踪文件名对应的新文件
tail -F app.log

# 同时跟踪多个日志文件
tail -f app.log access.log error.log
```

::: note GNU/Linux 选项

`--line-buffered` 是 GNU `grep` 常用选项。macOS 自带的 BSD `grep` 不支持时，可省略该选项，或使用 GNU grep 提供的 `ggrep`。

:::

### `wc`

统计文件的行数、单词数、字节数或字符数。

```bash:no-line-numbers
# 统计行数
wc -l app.log

# 统计单词数
wc -w document.txt

# 统计字节数
wc -c archive.bin

# 统计字符数
wc -m document.txt
```

## 🔍 文件搜索与文本处理

### `find`

按照名称、类型、大小或修改时间递归查找文件和目录。

```bash:no-line-numbers
# 查找日志文件
find . -type f -name "*.log"

# 忽略大小写查找
find . -type f -iname "readme*"

# 查找目录
find . -type d -name "node_modules"

# 查找大于 100 MB 的文件
find . -type f -size +100M

# 查找最近 7 天内修改的文件
find . -type f -mtime -7
```

::: details 查看更多 find 示例

```bash:no-line-numbers
# 在指定路径中按名称查找文件
find <path> -type f -name "<pattern>"

# 输出找到的临时文件
find . -type f -name "*.tmp" -print

# 批量删除匹配的临时文件
find . -type f -name "*.tmp" -exec rm -f {} +

# 删除空目录
find . -type d -empty -delete

# 限制搜索深度
find . -maxdepth 2 -type f

# 查找大于 100 MB 的文件并显示大小
find /var/log -type f -size +100M -exec ls -lh {} +

# 安全处理包含空格的文件名
find . -type f -print0 | xargs -0 grep -n "ERROR"
```

建议先单独执行带 `-print` 的查找命令，确认结果后再使用 `-delete` 或 `-exec rm`。

:::

### `xargs`

将标准输入转换为命令参数，适合批量处理文件或其他列表数据。

```bash:no-line-numbers
# 对输入的每一项执行一次命令
printf '%s\n' file1.log file2.log | xargs -n 1 wc -l

# 使用 4 个并行任务处理输入
printf '%s\n' file1 file2 file3 | xargs -n 1 -P 4 wc -c

# 安全处理包含空格或换行的文件名
find . -type f -name '*.log' -print0 | xargs -0 grep -n "ERROR"
```

::: warning 安全处理输入

普通 `xargs` 按空白字符拆分输入。处理文件名时应优先配合 `find -print0` 和 `xargs -0`，并先确认生成的参数范围。

:::

### `grep`

在文件或目录中搜索匹配的文本。

```bash:no-line-numbers
# 搜索包含 ERROR 的行
grep "ERROR" app.log

# 显示匹配行号
grep -n "ERROR" app.log

# 忽略大小写
grep -i "warning" app.log

# 递归搜索当前目录
grep -R "TODO" .

# 排除匹配行
grep -v "DEBUG" app.log

# 匹配多个关键词
grep -E "ERROR|FATAL" app.log
```

还可以限制搜索的文件类型：

```bash:no-line-numbers
# 只搜索 Java 文件
grep -R --include="*.java" "TODO" src/

# 查看前 20 条异常匹配
grep -n "Exception" app.log | head -n 20
```

::: details 高级搜索示例

```bash:no-line-numbers
# 显示匹配行及其前后各 3 行
grep -C 3 "ERROR" app.log

# 只输出匹配到的内容
grep -oE "https?://[^ ]+" app.log

# 只列出包含匹配内容的文件
grep -Rl "TODO" src/

# 按完整单词匹配
grep -w "ERROR" app.log

# 按固定字符串搜索，不解析正则表达式
grep -F "a.b" app.log
```

:::

::: note GNU/Linux 选项

`-o`、`-R` 和部分长选项在不同系统的 `grep` 实现中可能存在差异。执行 `grep --help` 或 `man grep` 查看本机支持的选项。

:::

### `sort`

对文本行进行排序。

```bash:no-line-numbers
# 按字典顺序排序
sort names.txt

# 排序并去重
sort -u names.txt

# 忽略大小写排序
sort -f names.txt
```

### `uniq`

筛选或统计相邻的重复行，通常与 `sort` 组合使用。

```bash:no-line-numbers
# 统计重复行数量
sort access.log | uniq -c

# 只显示重复行
sort access.log | uniq -d
```

### `cut`

按照分隔符提取文本中的字段。

```bash:no-line-numbers
# 提取冒号分隔的第 1 列
cut -d ':' -f 1 /etc/passwd

# 提取 CSV 的第 1、3 列
cut -d ',' -f 1,3 data.csv
```

### `sed`

筛选、删除或替换文本内容。

```bash:no-line-numbers
# 输出第 100 到 200 行
sed -n '100,200p' app.log

# 删除空行
sed '/^[[:space:]]*$/d' input.txt

# 输出替换后的内容
sed 's/old/new/g' input.txt

# 替换文件后缀
sed 's/\.java$/.class/g' files.txt
```

建议将替换结果写入新文件，避免直接修改原文件：

```bash:no-line-numbers
# 将替换结果写入新文件
sed 's/old/new/g' input.txt > output.txt
```

::: details 高级 sed 示例

```bash:no-line-numbers
# 删除指定范围的行
sed '10,20d' app.log

# 只打印匹配 pattern 的行
sed -n '/pattern/p' app.log
```

:::

::: note 原地编辑的差异

GNU/Linux 通常使用 `sed -i 's/old/new/g' config.txt`；macOS 的 BSD `sed` 通常需要使用 `sed -i '' 's/old/new/g' config.txt`。首次修改前建议先输出到新文件确认结果。

:::

### `awk`

按照字段和记录处理结构化文本。

```bash:no-line-numbers
# 输出第 1 列
awk '{print $1}' access.log

# 输出第 1、3 列
awk '{print $1, $3}' access.log

# 统计行数
awk 'END {print NR}' app.log

# 累加第 1 列
awk '{total += $1} END {print total}' nums.txt

# 提取匹配范围
awk '/10:00:00/,/11:00:00/' app.log
```

::: details 高级 awk 示例

```bash:no-line-numbers
# 使用冒号作为分隔符，输出第 1、7 列
awk -F ':' '{print $1, $7}' /etc/passwd

# 统计每个状态码出现的次数
awk '{count[$9]++} END {for (code in count) print code, count[code]}' access.log

# 筛选第 9 列为 500 的请求
awk '$9 == 500 {print}' access.log
```

:::

### `diff`

比较文本文件的内容差异。

```bash:no-line-numbers
# 输出统一格式的差异
diff -u old.conf new.conf

# 并列显示差异
diff -y old.conf new.conf

# 只显示是否存在差异
diff -q old.conf new.conf
```

### `cmp`

逐字节比较文件，常用于比较二进制文件。

```bash:no-line-numbers
# 逐字节比较两个文件
cmp file1.bin file2.bin
```

## 💾 磁盘空间

### `df`

查看文件系统整体的容量、剩余空间和 inode 使用情况。

```bash:no-line-numbers
# 以易读单位显示所有文件系统的容量
df -h

# 查看指定路径所在文件系统的容量
df -h /var/log

# 查看 inode 使用情况
df -ih
```

### `du`

查看具体文件或目录占用的空间。

```bash:no-line-numbers
# 查看目录总大小
du -sh <path>

# 查看下一层目录大小（GNU/Linux）
du -h --max-depth=1 <path>

# 查看占用最大的 10 项
du -ah <path> | sort -rh | head -n 10

# 限制在当前文件系统并查看下一层目录（GNU/Linux）
du -xhd 1 /var

# 查看当前目录中占用最大的 20 项
du -ah . | sort -rh | head -n 20
```

::: note 平台差异

GNU `du` 使用 `--max-depth=1` 或 `-d 1` 控制深度；macOS 的 BSD `du` 通常使用 `-d 1`。`-x` 可避免遍历其他挂载的文件系统。

:::

`df` 关注文件系统整体剩余空间，`du` 关注具体文件或目录占用空间。

### `lsblk`

以树形结构查看块设备、分区、文件系统和挂载点。

```bash:no-line-numbers
# 查看块设备树
lsblk

# 同时显示文件系统和挂载信息
lsblk -f

# 自定义输出字段
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS
```

::: note 平台差异

`lsblk` 主要由 Linux 的 util-linux 提供，macOS 默认不包含该命令，可使用 `diskutil list` 查看磁盘和分区。

:::

## 🔐 权限与用户

### `chmod`

修改文件或目录的访问权限。权限通常分为用户、用户组和其他用户，每组包含读（`r`）、写（`w`）和执行（`x`）。

```bash:no-line-numbers
# 用户可读写，其他用户只读
chmod 644 file.txt

# 用户可读写执行，其他用户可读执行
chmod 755 script.sh

# 为当前用户增加执行权限
chmod u+x script.sh

# 移除组用户和其他用户的写权限
chmod go-w file.txt
```

::: details 精确批量修改权限

```bash:no-line-numbers
# 只为 Shell 脚本增加当前用户的执行权限
find scripts -type f -name '*.sh' -exec chmod u+x {} +

# 递归移除其他用户的写权限
chmod -R o-w project/
```

:::

::: warning 谨慎递归修改

`chmod -R` 会修改目录中的所有条目。执行前应使用 `find` 或 `ls -l` 确认范围，并优先分别处理文件和目录所需的权限。

:::

### `chown`

修改文件或目录的所有者，也可以同时修改所属用户组。

```bash:no-line-numbers
# 修改文件所有者
chown <user> file.txt

# 同时修改所有者和所属组
chown <user>:<group> file.txt

# 递归修改目录及其内容
chown -R <user>:<group> project/
```

### `chgrp`

修改文件或目录所属的用户组。

```bash:no-line-numbers
# 修改文件所属组
chgrp <group> file.txt
```

### `umask`

查看或设置新建文件和目录的默认权限掩码。

```bash:no-line-numbers
# 以数字形式查看当前权限掩码
umask

# 以符号形式查看当前权限掩码
umask -S

# 设置当前 Shell 的权限掩码
umask 022
```

### `whoami`

显示当前有效用户名称。

```bash:no-line-numbers
# 显示当前有效用户名称
whoami
```

### `id`

显示用户 ID、主要用户组和附加用户组。

```bash:no-line-numbers
# 查看当前用户的身份和用户组信息
id

# 查看指定用户的身份和用户组信息
id <user>
```

### `groups`

显示当前用户或指定用户所属的用户组。

```bash:no-line-numbers
# 查看当前用户所属的用户组
groups

# 查看指定用户所属的用户组
groups <user>
```

### `sudo`

以更高权限执行单条命令。

```bash:no-line-numbers
# 以高权限查看 nginx 服务状态
sudo systemctl status nginx

# 以高权限查看受限目录
sudo ls -la /var/log

# 以指定用户身份执行命令
sudo -u <user> <command>
```

::: details sudo 常用检查

```bash:no-line-numbers
# 查看当前用户允许执行的 sudo 命令
sudo -l

# 更新 sudo 认证凭据
sudo -v
```

:::

::: warning 重定向不会继承 sudo 权限

Shell 会在运行 `sudo` 前处理 `>`，因此 `sudo echo "text" > /protected/file` 仍可能因权限不足而失败。需要提升写入权限时，可使用：

```bash:no-line-numbers
echo "text" | sudo tee /protected/file > /dev/null
```

:::

::: note 平台差异

`systemctl` 主要用于使用 systemd 的 Linux 发行版。容器、WSL、macOS 或使用其他初始化系统的环境，服务管理命令可能不同。

:::

优先使用限定范围的 `sudo <command>`，不要长时间保持 root Shell。

## ⚙️ 进程与任务

### `systemctl`

查看和管理 systemd 服务。

```bash:no-line-numbers
# 查看服务状态
systemctl status nginx

# 启动、停止或重启服务
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# 设置服务开机启动
sudo systemctl enable nginx

# 查看启动失败的服务
systemctl --failed
```

::: note 平台差异

`systemctl` 仅适用于使用 systemd 的系统。执行服务变更前，应先使用 `status` 确认服务名称和当前状态。

:::

### `ps`

查看当前运行的进程及其资源信息。

```bash:no-line-numbers
# 查看当前 Shell 的进程
ps

# 查看所有用户的进程及资源信息
ps aux

# 以完整格式查看所有进程
ps -ef

# 按名称筛选 Java 进程
ps aux | grep "[j]ava"

# 查看指定进程的关键字段
ps -p <pid> -o pid,ppid,user,%cpu,%mem,etime,command
```

::: details 高级进程筛选

```bash:no-line-numbers
# 按 CPU 使用率降序排列
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu

# 显示进程树（GNU/Linux）
ps --forest -eo pid,ppid,cmd

# 按名称和完整命令行查找进程
pgrep -af "java"
```

:::

::: note 输出格式差异

`ps aux` 使用 BSD 风格，`ps -ef` 使用 System V 风格，两者的输出字段并不完全相同。

:::

### `top`

实时查看进程的 CPU、内存和运行状态。

```bash:no-line-numbers
# 实时查看进程和资源使用情况
top

# 只监控指定进程
top -p <pid>

# 按 CPU 使用率排序
top -o %CPU

# 输出一次采样结果，适合记录或脚本
top -b -n 1

# 每隔 2 秒采样一次，共采样 3 次
top -b -n 3 -d 2
```

::: note 平台差异

不同发行版的 `top` 参数和交互方式可能不同。执行 `top --help` 或 `man top` 查看本机支持的选项；`-b` 批处理模式主要适用于 GNU/Linux。

:::

::: table title="常用交互按键" full-width

| 按键 | 作用 |
| -- | -- |
| `P` | 按 CPU 使用率排序 |
| `M` | 按内存使用率排序 |
| `k` | 向指定进程发送信号 |
| `q` | 退出 `top` |

:::

### `jobs`

查看当前 Shell 会话中的后台或已暂停任务。

```bash:no-line-numbers
# 查看任务编号和进程号
jobs -l

# 只显示运行中的任务
jobs -r

# 只显示已暂停的任务
jobs -s
```

### `bg`

在后台继续运行已暂停的任务。

```bash:no-line-numbers
# 在后台继续运行编号为 1 的任务
bg %1
```

### `fg`

将后台或已暂停的任务切换到前台。

```bash:no-line-numbers
# 将编号为 1 的任务切换到前台
fg %1
```

按下 `Ctrl + Z` 会暂停当前前台任务。任务编号可通过 `jobs -l` 查看。

### `kill`

向指定进程发送信号。默认发送 `TERM`，请求进程正常退出。

```bash:no-line-numbers
# 请求进程正常退出
kill <pid>

# 显式发送 TERM 信号
kill -TERM <pid>
```

### `pkill`

根据进程名称或命令行模式匹配并发送信号。

```bash:no-line-numbers
# 先确认匹配到的进程
pgrep -af "<pattern>"

# 向命令行匹配的进程发送 TERM 信号
pkill -TERM -f "<pattern>"
```

仅在进程无法正常退出时考虑 `KILL` 信号。批量操作前务必检查匹配范围。

### `lsof`

查看进程打开的文件，以及端口被哪个进程占用。

```bash:no-line-numbers
# 查看指定进程打开的文件
lsof -p <pid>

# 查找占用指定端口的进程
lsof -i :<port>

# 查找指定 TCP 监听端口
lsof -iTCP:<port> -sTCP:LISTEN
```

## 📋 日志排查

常见的日志排查流程：

```bash:no-line-numbers
# 查看日志文件大小
du -h app.log

# 统计日志行数
wc -l app.log

# 查看最后 500 行
tail -n 500 app.log

# 搜索异常并显示行号
grep -n -E "ERROR|Exception|FATAL" app.log

# 导出指定行区间
sed -n '10000,10200p' app.log > excerpt.log
```

实时查看日志：

```bash:no-line-numbers
# 实时跟踪并筛选错误和警告
tail -f app.log | grep --line-buffered -E "ERROR|WARN"
```

如果日志包含账号、令牌、内网地址或个人信息，分享导出片段前应先进行脱敏。

### `journalctl`

读取 systemd 日志，可按服务、时间、优先级或启动次数筛选。

```bash:no-line-numbers
# 查看 nginx 服务日志
journalctl -u nginx

# 实时跟踪服务日志
journalctl -u nginx -f

# 查看最近一小时的日志
journalctl --since "1 hour ago"

# 只显示错误及以上级别
journalctl -p err

# 查看本次启动以来的日志
journalctl -b
```

::: note 平台差异

`journalctl` 用于读取 systemd 日志，主要适用于使用 systemd 的 Linux 系统。

:::

## 🌐 网络诊断

### `curl`

发送 HTTP 请求，或测试 HTTP、HTTPS 和 TCP 连接。

```bash:no-line-numbers
# 发起 GET 请求并显示响应内容
curl https://example.com

# 只查看响应头
curl -I https://example.com

# 跟随重定向并保存响应
curl -L -o output.html https://example.com

# 发送表单数据
curl -X POST -d 'name=value' https://example.com/api

# 添加认证请求头
curl -H 'Authorization: Bearer <token>' https://example.com/api

# 测试 TCP 端口连通性
curl -v telnet://<host>:<port>
```

::: details 高级 HTTP 检查

```bash:no-line-numbers
# 只输出 HTTP 状态码
curl -sS -o /dev/null -w '%{http_code}\n' https://example.com

# 设置连接和整体超时时间
curl --connect-timeout 5 --max-time 15 https://example.com

# HTTP 错误时返回非零退出状态
curl --fail-with-body https://example.com/api

# 显示请求总耗时
curl -sS -o /dev/null -w 'Total: %{time_total}s\n' https://example.com
```

:::

::: note 版本说明

`--fail-with-body` 需要 curl 7.76.0 或更高版本；旧版本可使用 `--fail`，但不会保留错误响应体。

:::

不要把真实令牌、密码或 Cookie 写入会提交到 Git 的命令记录或文档中。

### `ss`

查看套接字和监听端口，是现代 Linux 中常用的网络诊断工具。

```bash:no-line-numbers
# 查看监听中的 TCP 端口及对应进程
ss -lntp

# 查看所有 TCP 连接
ss -ant
```

::: details 过滤套接字

```bash:no-line-numbers
# 查看监听 8080 端口的 TCP 套接字
ss -lntp 'sport = :8080'

# 查看连接到 443 端口的连接
ss -ant 'dport = :443'

# 查看套接字统计摘要
ss -s
```

:::

### `netstat`

查看网络连接和监听端口，常见于较旧的 Linux 环境。

```bash:no-line-numbers
# 查看监听中的 TCP 端口及对应进程
netstat -lntp

# 查看所有连接和监听端口
netstat -an
```

端口对应的进程也可以通过前文的 `lsof -i :<port>` 查询。

### `ip`

查看网卡地址和路由信息，是现代 Linux 推荐的网络配置工具。

```bash:no-line-numbers
# 查看网络接口地址
ip addr

# 查看路由表
ip route
```

### `ifconfig`

查看或配置网络接口，部分系统仍通过 `net-tools` 提供。

```bash:no-line-numbers
# 查看所有网络接口
ifconfig

# 查看指定网络接口
ifconfig <interface>
```

### `ping`

发送 ICMP 回显请求，检查主机是否可达并观察往返延迟。

```bash:no-line-numbers
# 持续测试连通性，按 Ctrl + C 停止
ping example.com

# 发送 4 个请求后停止
ping -c 4 example.com
```

::: note 结果说明

目标禁用 ICMP 或中间设备过滤数据包时，`ping` 失败不一定表示 HTTP、SSH 等应用服务不可达。

:::

### `nc`

使用 Netcat 测试 TCP 或 UDP 端口，也可以监听临时端口。

```bash:no-line-numbers
# 测试 TCP 端口，不发送数据
nc -vz example.com 443

# 设置 5 秒连接超时
nc -vz -w 5 example.com 22

# 在本机监听 9000 端口
nc -l 9000
```

::: note 平台差异

不同 Netcat 实现的监听、超时和 UDP 参数可能不同，请使用 `nc -h` 或 `man nc` 查看本机语法。

:::

### `tracepath` / `traceroute`

查看数据包到目标主机经过的网络路径，用于定位延迟或路由异常。

```bash:no-line-numbers
# Linux 中通常无需 root 权限
tracepath example.com

# 使用 traceroute 查看路径
traceroute example.com
```

::: note 工具来源

部分系统需要单独安装 `tracepath` 或 `traceroute`。网络设备可能屏蔽探测报文，因此超时节点不一定表示实际连接中断。

:::

### `dig`

查询 DNS 记录，用于排查域名解析问题。

```bash:no-line-numbers
# 查询域名解析
dig example.com

# 查询指定 DNS 记录
dig example.com A
dig example.com MX
```

::: note 工具来源

`dig` 通常由 DNS 工具包提供。查询结果取决于指定或系统配置的 DNS 服务器。

:::

### `getent`

通过系统名称服务配置查询主机、用户和用户组；主机查询会同时考虑 `/etc/hosts` 和 DNS 等来源。

```bash:no-line-numbers
# 查询主机地址
getent hosts example.com

# 查询指定用户
getent passwd <user>

# 查询指定用户组
getent group <group>
```

### `resolvectl`

查看或查询 systemd-resolved 管理的 DNS 状态。

```bash:no-line-numbers
# 查看各网络接口的 DNS 配置
resolvectl status

# 查询域名
resolvectl query example.com
```

::: note 平台差异

`getent` 常见于 Linux；`resolvectl` 仅适用于启用了 systemd-resolved 的系统。其他环境可查看 `/etc/resolv.conf`，并结合 `dig` 排查。

:::

### `tcpdump`

抓取网络数据包，用于诊断连接和协议问题。

```bash:no-line-numbers
# 抓取经过 8080 端口的数据包
sudo tcpdump -nn -i any port 8080

# 抓取与指定主机相关的数据包
sudo tcpdump -nn -i any host <server-ip>
```

::: details 高级抓包示例

```bash:no-line-numbers
# 抓取 100 个数据包并保存到文件
sudo tcpdump -nn -i any -c 100 -w capture.pcap port 8080

# 读取已有抓包文件
tcpdump -nn -r capture.pcap

# 只抓取 TCP SYN 包
sudo tcpdump -nn -i any 'tcp[tcpflags] & tcp-syn != 0'
```

:::

抓包可能包含账号、令牌或业务数据，只能在获得授权的环境中使用，并妥善保护生成的文件。

## 📦 压缩与归档

### `tar`

创建、查看和解压归档文件。

```bash:no-line-numbers
# 创建 gzip 压缩包
tar -czf backup.tar.gz project/

# 查看压缩包内容
tar -tzf backup.tar.gz

# 解压到当前目录
tar -xzf backup.tar.gz

# 解压到指定目录
tar -xzf backup.tar.gz -C /tmp/restore
```

::: details 高级归档示例

```bash:no-line-numbers
# 排除依赖和缓存目录
tar --exclude='node_modules' --exclude='.cache' -czf backup.tar.gz project/

# 只解压归档中的指定目录
tar -xzf backup.tar.gz project/config/

# 查看归档中的单个文件
tar -xOf backup.tar.gz project/config/app.yml
```

:::

::: warning 解压前检查内容

处理来源不可信的归档时，先使用 `tar -tf backup.tar.gz` 查看路径，并解压到新建的空目录，避免覆盖现有文件。

:::

### `zip`

创建 ZIP 压缩文件。

```bash:no-line-numbers
# 递归创建 ZIP 压缩包
zip -r project.zip project/
```

### `unzip`

查看或解压 ZIP 文件。

```bash:no-line-numbers
# 查看压缩包内容
unzip -l project.zip

# 解压到指定目录
unzip project.zip -d restore/
```

## 🖥️ 系统信息

### `date`

查看当前日期和时间。

```bash:no-line-numbers
# 查看本地日期和时间
date

# 查看 UTC 时间
date -u

# 按指定格式显示时间
date '+%Y-%m-%d %H:%M:%S'
```

### `uptime`

查看系统运行时长、当前用户数和最近 1、5、15 分钟的平均负载。

```bash:no-line-numbers
# 查看运行时长和平均负载
uptime

# 使用易读格式显示运行时长
uptime -p
```

### `watch`

按固定间隔重复执行命令，适合观察指标变化。

```bash:no-line-numbers
# 每 2 秒查看一次磁盘空间
watch -n 2 df -h

# 高亮两次输出之间的变化
watch -d 'free -h'
```

::: note 平台差异

`uptime -p` 常见于 GNU/Linux；macOS 的 `uptime` 默认不支持该选项。`watch` 常见于 Linux，macOS 默认不提供。停止监控时按 `Ctrl + C`。

:::

### `uname`

查看操作系统和硬件信息。

```bash:no-line-numbers
# 查看完整的系统和硬件信息
uname -a

# 查看内核版本
uname -r

# 查看硬件架构
uname -m
```

### `hostnamectl`

查看主机名、操作系统和硬件信息。该命令通常由 systemd 提供。

```bash:no-line-numbers
# 查看主机名、操作系统和硬件信息
hostnamectl
```

::: note 不使用 systemd 时

可以使用 `hostname` 查看主机名、`cat /etc/os-release` 查看 Linux 发行版信息，并使用 `uname -a` 查看内核和硬件信息。

:::

### `free`

查看内存和交换空间使用情况。

```bash:no-line-numbers
# 以易读单位查看内存和交换空间
free -h
```

### `vmstat`

查看内存、进程、I/O 和 CPU 等系统运行状态。

```bash:no-line-numbers
# 每 2 秒采样一次，共采样 5 次
vmstat 2 5
```

### `dmesg`

查看内核环形缓冲区中的启动、驱动和硬件消息。

```bash:no-line-numbers
# 使用易读的时间格式查看内核消息
sudo dmesg --human

# 只查看错误和警告
sudo dmesg --level=err,warn

# 持续等待新的内核消息
sudo dmesg --follow
```

::: note 平台与权限

上述长选项主要适用于 util-linux 提供的 `dmesg`。部分系统限制普通用户读取内核日志，请使用 `dmesg --help` 或 `man dmesg` 确认本机选项和权限要求。

:::

`free` 和 `vmstat` 常见于 Linux，macOS 默认不提供这两个命令。

## 📚 延伸阅读

- [GNU Coreutils 手册](https://www.gnu.org/software/coreutils/manual/)
- [Linux man-pages](https://man7.org/linux/man-pages/)
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/)

查看本机命令帮助：

```bash:no-line-numbers
# 查看命令的详细手册
man <command>

# 查看命令的简要帮助
<command> --help
```
