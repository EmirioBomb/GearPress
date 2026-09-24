---
title: Linux Command Reference
icon: lucide:book-open-text
tags:
  - Linux
  - Shell
  - Commands
  - Cheat Sheet
createTime: 2026/09/23 13:22:00
permalink: /en/notes/linux/commands/
---

## 📖 How to use this page

Commands are grouped by task. Examples can be copied directly; replace angle-bracketed placeholders such as `<path>` and `<pid>`. Expand sections for advanced usage.

::: tip Platform and safety
Examples target Linux/GNU. Before deleting files, changing permissions, terminating processes, or capturing packets, verify the target and environment.
:::

## 📁 Directories and files

### `pwd`

Print the absolute path of the current working directory.

```bash:no-line-numbers
# print the current working directory
pwd

# print the physical path and resolve symbolic links
pwd -P
```

### `ls`

List directory contents, permissions, and modification times.

```bash:no-line-numbers
# include hidden files
ls -la

# use human-readable sizes
ls -lh

# sort by modification time
ls -lt

# sort by file size
ls -lS

# show the directory entry without listing its contents
ls -ld <path>
```

::: table title="Common options" full-width

| Option | Purpose |
| -- | -- |
| `-l` | Show detailed information |
| `-a` | Include hidden files |
| `-h` | Use human-readable units |
| `-t` | Sort by modification time |
| `-S` | Sort by file size |

:::

### `cd`

Change the current Shell working directory.

```bash:no-line-numbers
# use an absolute path
cd /var/log

# enter logs under the current directory
cd ./logs

# move to the parent directory
cd ..

# move to the current user's home directory
cd ~

# return to the previous directory
cd -
```

### `mkdir`

Create directories.

```bash:no-line-numbers
# create the logs directory
mkdir logs

# create missing parent directories
mkdir -p project/config/prod

# create a directory with permissions
mkdir -m 755 public
```

### `rmdir`

Remove empty directories.

```bash:no-line-numbers
# remove an empty directory
rmdir empty-dir
```

### `touch`

Create an empty file or update its timestamps.

```bash:no-line-numbers
# create an empty file if it does not exist
touch app.log

# do not create a missing file
touch -c app.log

# set the modification time
touch -t 202609231322 app.log
```

### `cp`

Copy files or directories.

```bash:no-line-numbers
# copy and rename a file
cp source.txt backup.txt

# copy a directory recursively
cp -r source-dir backup-dir

# preserve attributes where possible
cp -a source-dir backup-dir
```

### `mv`

Move or rename files and directories.

```bash:no-line-numbers
# rename a file
mv old-name.txt new-name.txt

# move a file into a directory
mv report.txt archive/
```

### `ln`

Create hard links or symbolic links. Symbolic links are more commonly used to reference files or directories.

```bash:no-line-numbers
# create a hard link to a file
ln source.txt source-link.txt

# create a symbolic link to a file
ln -s /opt/app/config.yml config.yml

# create a symbolic link to a directory
ln -s /var/log/app logs
```

### `readlink`

Show a symbolic link's target or resolve a canonical path.

```bash:no-line-numbers
# show the target stored in a symbolic link
readlink config.yml

# resolve an absolute canonical path
readlink -f config.yml
```

::: note Platform differences

`readlink -f` is common on GNU/Linux. The BSD `readlink` included with macOS does not support this option by default.

:::

### `file`

Identify a file by its contents instead of relying only on its extension.

```bash:no-line-numbers
# identify a file type
file archive.bin

# identify every entry in the current directory
file *

# print the MIME type
file --mime-type image.png
```

### `command -v`

Check whether the current Shell can find a command and show what it resolves to.

```bash:no-line-numbers
# show where a command resolves
command -v python

# check several commands
command -v git curl node
```

`command -v` is a portable Shell builtin and is generally more reliable than `which`, which only searches for executable files.

### `basename` / `dirname`

Extract the final file-name component or the parent-directory component of a path, which is useful in Shell scripts.

```bash:no-line-numbers
# extract the file name
basename /var/log/app.log

# remove a specified suffix
basename /var/log/app.log .log

# extract the parent directory
dirname /var/log/app.log
```

### `rm`

Remove files and directories.

```bash:no-line-numbers
# remove a file
rm temporary.txt

# remove a directory recursively
rm -r old-directory
```

::: table title="Common options" full-width

| Option | Purpose |
| -- | -- |
| `-i` | Ask before each removal |
| `-I` | Ask once before removing many files (common on GNU/Linux) |
| `-r` | Process directories recursively |
| `-f` | Force removal without prompting |

:::

::: danger Be careful with recursive removal
`rm -rf` recursively removes the target path without prompting. Use `pwd` and `ls` first to confirm the current directory and target contents.
:::

```bash:no-line-numbers
# force recursive removal of the target path
rm -rf <path>
```

## 📄 Reading file contents

### `cat`

Print file contents. It is useful for small files or concatenating several files.

```bash:no-line-numbers
# print file contents
cat config.yml

# number every line
cat -n config.yml

# number non-empty lines
cat -b config.yml

# squeeze repeated blank lines
cat -s config.yml

# concatenate files
cat file1 file2 > merged.txt
```

### `less`

View a file page by page, which is useful for large logs.

```bash:no-line-numbers
# view a file page by page
less app.log

# show line numbers
less -N app.log

# start near line 100
less +100 app.log
```

In `less`, use `Space` to move down, `b` to move up, `/pattern` to search, `n` to find the next match, and `q` to quit.

### `head`

View the beginning of a file.

```bash:no-line-numbers
# show the first 20 lines
head -n 20 app.log
```

### `tail`

View the end of a file or follow a growing log.

```bash:no-line-numbers
# show the last 100 lines
tail -n 100 app.log

# show from line 100 to the end
tail -n +100 app.log

# follow newly appended content
tail -f app.log

# filter new lines containing ERROR
tail -f app.log | grep --line-buffered "ERROR"

# continue following the file name after log rotation
tail -F app.log

# follow multiple log files
tail -f app.log access.log error.log
```

::: note GNU/Linux options

`--line-buffered` is a commonly used GNU `grep` option. If the BSD `grep` included with macOS does not support it, omit the option or use GNU grep as `ggrep`.

:::

### `wc`

Count lines, words, bytes, or characters.

```bash:no-line-numbers
# count lines
wc -l app.log

# count words
wc -w document.txt

# count bytes
wc -c archive.bin

# count characters
wc -m document.txt
```

## 🔍 Searching and text processing

### `find`

Recursively find files and directories by name, type, size, or modification time.

```bash:no-line-numbers
# find log files
find . -type f -name "*.log"

# ignore case
find . -type f -iname "readme*"

# find directories
find . -type d -name "node_modules"

# find files larger than 100 MB
find . -type f -size +100M

# find files modified within the last 7 days
find . -type f -mtime -7
```

::: details More find examples

```bash:no-line-numbers
# find files by name under a path
find <path> -type f -name "<pattern>"

# print matching temporary files
find . -type f -name "*.tmp" -print

# remove matching temporary files in batches
find . -type f -name "*.tmp" -exec rm -f {} +

# remove empty directories
find . -type d -empty -delete

# limit the search depth
find . -maxdepth 2 -type f

# find files larger than 100 MB and show their sizes
find /var/log -type f -size +100M -exec ls -lh {} +

# safely handle file names containing spaces
find . -type f -print0 | xargs -0 grep -n "ERROR"
```

Run the search with `-print` first. Add `-delete` or `-exec rm` only after confirming the result.

:::

### `xargs`

Convert standard input into command arguments for batch processing files or other list data.

```bash:no-line-numbers
# run one command for each input item
printf '%s\n' file1.log file2.log | xargs -n 1 wc -l

# process input with four parallel jobs
printf '%s\n' file1 file2 file3 | xargs -n 1 -P 4 wc -c

# safely process file names containing spaces or newlines
find . -type f -name '*.log' -print0 | xargs -0 grep -n "ERROR"
```

::: warning Handle input safely

Plain `xargs` splits input on whitespace. For file names, prefer `find -print0` with `xargs -0`, and confirm the generated argument set before running a destructive command.

:::

### `grep`

Search files or directories for matching text.

```bash:no-line-numbers
# search for lines containing ERROR
grep "ERROR" app.log

# show matching line numbers
grep -n "ERROR" app.log

# ignore case
grep -i "warning" app.log

# search the current directory recursively
grep -R "TODO" .

# exclude matching lines
grep -v "DEBUG" app.log

# match multiple patterns
grep -E "ERROR|FATAL" app.log
```

Limit the search to a file type when needed:

```bash:no-line-numbers
# search Java files only
grep -R --include="*.java" "TODO" src/

# show the first 20 exception matches
grep -n "Exception" app.log | head -n 20
```

::: details Advanced search examples

```bash:no-line-numbers
# show matching lines and three lines of context on each side
grep -C 3 "ERROR" app.log

# output only the matching text
grep -oE "https?://[^ ]+" app.log

# list only files containing the match
grep -Rl "TODO" src/

# match a complete word
grep -w "ERROR" app.log

# search a fixed string without interpreting regular expressions
grep -F "a.b" app.log
```

:::

::: note GNU/Linux options

`-o`, `-R`, and some long options may differ between `grep` implementations. Run `grep --help` or `man grep` to check the local options.

:::

### `sort`

Sort text lines.

```bash:no-line-numbers
# sort in dictionary order
sort names.txt

# sort and remove duplicates
sort -u names.txt

# sort without case sensitivity
sort -f names.txt
```

### `uniq`

Count or filter adjacent duplicate lines. It is commonly used after `sort`.

```bash:no-line-numbers
# count duplicate lines
sort access.log | uniq -c

# show only duplicate lines
sort access.log | uniq -d
```

### `cut`

Extract fields from delimited text.

```bash:no-line-numbers
# extract field 1 from colon-separated data
cut -d ':' -f 1 /etc/passwd

# extract fields 1 and 3 from CSV data
cut -d ',' -f 1,3 data.csv
```

### `sed`

Filter, delete, or replace text.

```bash:no-line-numbers
# print lines 100 through 200
sed -n '100,200p' app.log

# remove blank lines
sed '/^[[:space:]]*$/d' input.txt

# print the replaced output
sed 's/old/new/g' input.txt

# replace a file suffix
sed 's/\.java$/.class/g' files.txt
```

Writing to a new file is safer than editing the original in place:

```bash:no-line-numbers
# write the replaced output to a new file
sed 's/old/new/g' input.txt > output.txt
```

::: details Advanced sed examples

```bash:no-line-numbers
# delete a selected range of lines
sed '10,20d' app.log

# print only lines matching pattern
sed -n '/pattern/p' app.log
```

:::

::: note In-place editing differs by platform

GNU/Linux commonly uses `sed -i 's/old/new/g' config.txt`; macOS BSD `sed` commonly requires `sed -i '' 's/old/new/g' config.txt`. Preview the output in a new file before editing in place.

:::

### `awk`

Process structured text by fields and records.

```bash:no-line-numbers
# print field 1
awk '{print $1}' access.log

# print fields 1 and 3
awk '{print $1, $3}' access.log

# count lines
awk 'END {print NR}' app.log

# sum field 1
awk '{total += $1} END {print total}' nums.txt

# extract a matching range
awk '/10:00:00/,/11:00:00/' app.log
```

::: details Advanced awk examples

```bash:no-line-numbers
# use a colon as the delimiter and print fields 1 and 7
awk -F ':' '{print $1, $7}' /etc/passwd

# count occurrences of each status code
awk '{count[$9]++} END {for (code in count) print code, count[code]}' access.log

# print requests whose ninth field is 500
awk '$9 == 500 {print}' access.log
```

:::

### `diff`

Compare text files.

```bash:no-line-numbers
# show a unified diff
diff -u old.conf new.conf

# show files side by side
diff -y old.conf new.conf

# only report whether files differ
diff -q old.conf new.conf
```

### `cmp`

Compare files byte by byte, which is useful for binary files.

```bash:no-line-numbers
# compare two files byte by byte
cmp file1.bin file2.bin
```

## 💾 Disk usage

### `df`

View capacity, free space, and inode usage for filesystems.

```bash:no-line-numbers
# show all filesystem sizes in human-readable units
df -h

# show the filesystem containing the specified path
df -h /var/log

# show inode usage
df -ih
```

### `du`

View the space used by specific files or directories.

```bash:no-line-numbers
# show the total size
du -sh <path>

# show one directory level (GNU/Linux)
du -h --max-depth=1 <path>

# show the largest 10 entries
du -ah <path> | sort -rh | head -n 10

# stay on the current filesystem and show one directory level (GNU/Linux)
du -xhd 1 /var

# show the largest 20 entries in the current directory
du -ah . | sort -rh | head -n 20
```

::: note Platform differences

GNU `du` uses `--max-depth=1` or `-d 1` to limit depth; BSD `du` on macOS commonly uses `-d 1`. The `-x` option avoids traversing other mounted filesystems.

:::

`df` describes free space for a filesystem, while `du` describes space consumed by specific files or directories.

### `lsblk`

Show block devices, partitions, filesystems, and mount points as a tree.

```bash:no-line-numbers
# show the block-device tree
lsblk

# include filesystem and mount information
lsblk -f

# select output columns
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS
```

::: note Platform differences

`lsblk` is mainly provided by util-linux on Linux. It is not included with macOS by default; use `diskutil list` there to inspect disks and partitions.

:::

## 🔐 Permissions and users

### `chmod`

Change file or directory permissions. Permissions are commonly divided into user, group, and other, with read (`r`), write (`w`), and execute (`x`) access for each class.

```bash:no-line-numbers
# user can read/write; others can read
chmod 644 file.txt

# user can read/write/execute; others can read/execute
chmod 755 script.sh

# add execute permission for the user
chmod u+x script.sh

# remove write permission for group and others
chmod go-w file.txt
```

::: details Precise batch permission changes

```bash:no-line-numbers
# add user execute permission only to Shell scripts
find scripts -type f -name '*.sh' -exec chmod u+x {} +

# recursively remove write permission for others
chmod -R o-w project/
```

:::

::: warning Be careful with recursive changes

`chmod -R` changes every entry under a directory. Confirm the scope with `find` or `ls -l` first, and prefer applying the required permissions separately to files and directories.

:::

### `chown`

Change the owner of a file or directory, optionally together with its group.

```bash:no-line-numbers
# change the file owner
chown <user> file.txt

# change both owner and group
chown <user>:<group> file.txt

# apply recursively to a directory
chown -R <user>:<group> project/
```

### `chgrp`

Change the group associated with a file or directory.

```bash:no-line-numbers
# change the file group
chgrp <group> file.txt
```

### `umask`

View or set the default permission mask for newly created files and directories.

```bash:no-line-numbers
# show the current mask in numeric form
umask

# show the current mask in symbolic form
umask -S

# set the mask for the current Shell
umask 022
```

### `whoami`

Print the current effective user name.

```bash:no-line-numbers
# print the current effective user name
whoami
```

### `id`

Print user IDs, the primary group, and supplementary groups.

```bash:no-line-numbers
# show identity and group information for the current user
id

# show identity and group information for a specified user
id <user>
```

### `groups`

Print the groups for the current or specified user.

```bash:no-line-numbers
# show groups for the current user
groups

# show groups for a specified user
groups <user>
```

### `sudo`

Run one command with elevated privileges.

```bash:no-line-numbers
# inspect the nginx service with elevated privileges
sudo systemctl status nginx

# inspect a restricted directory
sudo ls -la /var/log

# run a command as a specified user
sudo -u <user> <command>
```

::: details Common sudo checks

```bash:no-line-numbers
# list commands the current user may run with sudo
sudo -l

# refresh the sudo authentication credentials
sudo -v
```

:::

::: warning Redirection does not inherit sudo privileges

The Shell processes `>` before running `sudo`, so `sudo echo "text" > /protected/file` can still fail with insufficient permissions. To elevate the write operation, use:

```bash:no-line-numbers
echo "text" | sudo tee /protected/file > /dev/null
```

:::

::: note Platform differences

`systemctl` is mainly used by Linux distributions that use systemd. Containers, WSL, macOS, and systems using another init system may use different service-management commands.

:::

Prefer a narrowly scoped `sudo <command>` instead of keeping a root Shell open.

## ⚙️ Processes and jobs

### `systemctl`

Inspect and manage systemd services.

```bash:no-line-numbers
# inspect a service
systemctl status nginx

# start, stop, or restart a service
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# enable a service at boot
sudo systemctl enable nginx

# list services that failed to start
systemctl --failed
```

::: note Platform differences

`systemctl` applies only to systems using systemd. Before changing a service, use `status` to confirm its name and current state.

:::

### `ps`

List running processes and their resource information.

```bash:no-line-numbers
# list processes for the current Shell
ps

# list processes for all users with resource information
ps aux

# list all processes in full format
ps -ef

# filter Java processes by name
ps aux | grep "[j]ava"

# show key fields for one process
ps -p <pid> -o pid,ppid,user,%cpu,%mem,etime,command
```

::: details Advanced process filtering

```bash:no-line-numbers
# sort by CPU usage in descending order
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu

# show the process tree (GNU/Linux)
ps --forest -eo pid,ppid,cmd

# find a process by name and show its full command line
pgrep -af "java"
```

:::

::: note Output formats differ

`ps aux` uses BSD-style options, while `ps -ef` uses System V-style options. Their output fields are not identical.

:::

### `top`

Monitor CPU, memory, and process status in real time.

```bash:no-line-numbers
# monitor processes and resource usage in real time
top

# monitor one process only
top -p <pid>

# sort by CPU usage
top -o %CPU

# print one sample for logging or scripting
top -b -n 1

# take three samples two seconds apart
top -b -n 3 -d 2
```

::: note Platform differences

`top` options and interactive controls differ between distributions. Run `top --help` or `man top` to check the local options; `-b` batch mode is mainly available on GNU/Linux.

:::

::: table title="Common interactive keys" full-width

| Key | Purpose |
| -- | -- |
| `P` | Sort by CPU usage |
| `M` | Sort by memory usage |
| `k` | Send a signal to a process |
| `q` | Quit `top` |

:::

### `jobs`

List background or suspended jobs in the current Shell session.

```bash:no-line-numbers
# show job and process IDs
jobs -l

# show running jobs only
jobs -r

# show suspended jobs only
jobs -s
```

### `bg`

Continue a suspended job in the background.

```bash:no-line-numbers
# continue job 1 in the background
bg %1
```

### `fg`

Bring a background or suspended job to the foreground.

```bash:no-line-numbers
# bring job 1 to the foreground
fg %1
```

Pressing `Ctrl + Z` suspends the current foreground job. Use `jobs -l` to find its job number.

### `kill`

Send a signal to a process. The default is `TERM`, which requests a graceful exit.

```bash:no-line-numbers
# request a graceful process exit
kill <pid>

# explicitly send the TERM signal
kill -TERM <pid>
```

### `pkill`

Match processes by name or command-line pattern and send them a signal.

```bash:no-line-numbers
# inspect matching processes first
pgrep -af "<pattern>"

# send TERM to processes matching the command line
pkill -TERM -f "<pattern>"
```

Use `KILL` only when a process cannot exit normally. Confirm the match before any bulk operation.

### `lsof`

Inspect open files and identify the process using a port.

```bash:no-line-numbers
# inspect files opened by a process
lsof -p <pid>

# find the process using a port
lsof -i :<port>

# find a TCP listener on a port
lsof -iTCP:<port> -sTCP:LISTEN
```

## 📋 Log troubleshooting

A common log investigation flow looks like this:

```bash:no-line-numbers
# show the log file size
du -h app.log

# count log lines
wc -l app.log

# inspect the last 500 lines
tail -n 500 app.log

# search errors and show line numbers
grep -n -E "ERROR|Exception|FATAL" app.log

# export a selected line range
sed -n '10000,10200p' app.log > excerpt.log
```

Follow a service log in real time:

```bash:no-line-numbers
# follow the log and filter errors and warnings
tail -f app.log | grep --line-buffered -E "ERROR|WARN"
```

Check exported excerpts for accounts, tokens, internal addresses, and personal information before sharing them.

### `journalctl`

Read systemd logs and filter them by service, time, priority, or boot.

```bash:no-line-numbers
# show nginx service logs
journalctl -u nginx

# follow service logs in real time
journalctl -u nginx -f

# show logs from the last hour
journalctl --since "1 hour ago"

# show error-level logs and above
journalctl -p err

# show logs since the current boot
journalctl -b
```

::: note Platform differences

`journalctl` reads systemd logs and is mainly available on Linux systems that use systemd.

:::

## 🌐 Network diagnostics

### `curl`

Send HTTP requests or test HTTP, HTTPS, and TCP connectivity.

```bash:no-line-numbers
# send a GET request and show the response
curl https://example.com

# show response headers only
curl -I https://example.com

# follow redirects and save the response
curl -L -o output.html https://example.com

# send form data
curl -X POST -d 'name=value' https://example.com/api

# add an authorization header
curl -H 'Authorization: Bearer <token>' https://example.com/api

# test TCP connectivity
curl -v telnet://<host>:<port>
```

::: details Advanced HTTP checks

```bash:no-line-numbers
# output only the HTTP status code
curl -sS -o /dev/null -w '%{http_code}\n' https://example.com

# set connection and total timeouts
curl --connect-timeout 5 --max-time 15 https://example.com

# return a non-zero status for HTTP errors
curl --fail-with-body https://example.com/api

# show the total request time
curl -sS -o /dev/null -w 'Total: %{time_total}s\n' https://example.com
```

:::

::: note Version requirement

`--fail-with-body` requires curl 7.76.0 or later. On older versions, use `--fail`, which does not preserve the error response body.

:::

Do not place real tokens, passwords, or cookies in commands that may be committed to Git or shared with others.

### `ss`

Inspect sockets and listening ports with the commonly preferred tool on modern Linux.

```bash:no-line-numbers
# show listening TCP ports and owning processes
ss -lntp

# show all TCP connections
ss -ant
```

::: details Filter sockets

```bash:no-line-numbers
# show TCP sockets listening on port 8080
ss -lntp 'sport = :8080'

# show connections to port 443
ss -ant 'dport = :443'

# show a socket statistics summary
ss -s
```

:::

### `netstat`

Inspect network connections and listening ports on older Linux environments.

```bash:no-line-numbers
# show listening TCP ports and owning processes
netstat -lntp

# show all connections and listening ports
netstat -an
```

You can also identify the process using a port with `lsof -i :<port>` as shown earlier.

### `ip`

Inspect network addresses and routes with the preferred tool on modern Linux.

```bash:no-line-numbers
# show network interface addresses
ip addr

# show the routing table
ip route
```

### `ifconfig`

Inspect or configure network interfaces. Some systems still provide it through `net-tools`.

```bash:no-line-numbers
# show all network interfaces
ifconfig

# show a specified network interface
ifconfig <interface>
```

### `ping`

Send ICMP echo requests to test reachability and observe round-trip latency.

```bash:no-line-numbers
# test continuously; press Ctrl + C to stop
ping example.com

# stop after four requests
ping -c 4 example.com
```

::: note Interpreting results

A failed `ping` does not necessarily mean that HTTP, SSH, or another application service is unreachable; the target or an intermediate device may block ICMP traffic.

:::

### `nc`

Use Netcat to test TCP or UDP ports or listen on a temporary local port.

```bash:no-line-numbers
# test a TCP port without sending data
nc -vz example.com 443

# use a five-second connection timeout
nc -vz -w 5 example.com 22

# listen on local port 9000
nc -l 9000
```

::: note Platform differences

Listen, timeout, and UDP options differ between Netcat implementations. Run `nc -h` or `man nc` to inspect the local syntax.

:::

### `tracepath` / `traceroute`

Inspect the network path to a host to diagnose latency or routing problems.

```bash:no-line-numbers
# commonly works without root privileges on Linux
tracepath example.com

# inspect the path with traceroute
traceroute example.com
```

::: note Tool availability

Some systems require `tracepath` or `traceroute` to be installed separately. Network devices may block probes, so a timed-out hop does not always indicate a broken connection.

:::

### `dig`

Query DNS records when diagnosing name-resolution problems.

```bash:no-line-numbers
# query DNS records for a domain
dig example.com

# query specific DNS record types
dig example.com A
dig example.com MX
```

::: note Tool availability

`dig` is usually provided by a DNS utilities package. Results depend on the configured or explicitly selected DNS server.

:::

### `getent`

Query hosts, users, and groups through the system name-service configuration. Host lookups account for sources such as `/etc/hosts` and DNS.

```bash:no-line-numbers
# look up host addresses
getent hosts example.com

# look up a user
getent passwd <user>

# look up a group
getent group <group>
```

### `resolvectl`

Inspect or query DNS state managed by systemd-resolved.

```bash:no-line-numbers
# inspect DNS settings for each network interface
resolvectl status

# query a domain
resolvectl query example.com
```

::: note Platform differences

`getent` is common on Linux, while `resolvectl` applies only to systems using systemd-resolved. In other environments, inspect `/etc/resolv.conf` and use `dig` for diagnosis.

:::

### `tcpdump`

Capture packets to diagnose connection and protocol issues.

```bash:no-line-numbers
# capture packets passing through port 8080
sudo tcpdump -nn -i any port 8080

# capture packets involving a host
sudo tcpdump -nn -i any host <server-ip>
```

::: details Advanced packet-capture examples

```bash:no-line-numbers
# capture 100 packets and save them to a file
sudo tcpdump -nn -i any -c 100 -w capture.pcap port 8080

# read an existing capture file
tcpdump -nn -r capture.pcap

# capture TCP SYN packets only
sudo tcpdump -nn -i any 'tcp[tcpflags] & tcp-syn != 0'
```

:::

Packet captures may contain credentials, tokens, or business data. Use this only in authorized environments and protect the resulting files.

## 📦 Archives and compression

### `tar`

Create, inspect, and extract archive files.

```bash:no-line-numbers
# create a gzip archive
tar -czf backup.tar.gz project/

# list archive contents
tar -tzf backup.tar.gz

# extract in the current directory
tar -xzf backup.tar.gz

# extract to a target directory
tar -xzf backup.tar.gz -C /tmp/restore
```

::: details Advanced archive examples

```bash:no-line-numbers
# exclude dependency and cache directories
tar --exclude='node_modules' --exclude='.cache' -czf backup.tar.gz project/

# extract only a selected directory from the archive
tar -xzf backup.tar.gz project/config/

# print one text file from the archive
tar -xOf backup.tar.gz project/config/app.yml
```

:::

::: warning Inspect before extracting

For an archive from an untrusted source, inspect paths with `tar -tf backup.tar.gz` first and extract into a new empty directory to avoid overwriting existing files.

:::

### `zip`

Create a ZIP archive.

```bash:no-line-numbers
# create a ZIP archive recursively
zip -r project.zip project/
```

### `unzip`

Inspect or extract a ZIP archive.

```bash:no-line-numbers
# list archive contents
unzip -l project.zip

# extract to a target directory
unzip project.zip -d restore/
```

## 🖥️ System information

### `date`

Inspect the current date and time.

```bash:no-line-numbers
# show the local date and time
date

# show UTC time
date -u

# format the time explicitly
date '+%Y-%m-%d %H:%M:%S'
```

### `uptime`

Show how long the system has been running, the current user count, and the 1-, 5-, and 15-minute load averages.

```bash:no-line-numbers
# show uptime and load averages
uptime

# print uptime in a human-readable form
uptime -p
```

### `watch`

Run a command repeatedly at a fixed interval to observe changing metrics.

```bash:no-line-numbers
# inspect disk space every two seconds
watch -n 2 df -h

# highlight changes between runs
watch -d 'free -h'
```

::: note Platform differences

`uptime -p` is common on GNU/Linux; the macOS `uptime` command does not support it by default. `watch` is common on Linux and is not included with macOS by default. Press `Ctrl + C` to stop monitoring.

:::

### `uname`

Inspect operating system and hardware information.

```bash:no-line-numbers
# show complete system and hardware information
uname -a

# show the kernel version
uname -r

# show the hardware architecture
uname -m
```

### `hostnamectl`

Inspect the hostname, operating system, and hardware information. This command is commonly provided by systemd.

```bash:no-line-numbers
# show the hostname, operating system, and hardware information
hostnamectl
```

::: note Without systemd

Use `hostname` for the host name, `cat /etc/os-release` for Linux distribution information, and `uname -a` for kernel and hardware information.

:::

### `free`

Inspect memory and swap usage.

```bash:no-line-numbers
# show memory and swap usage in human-readable units
free -h
```

### `vmstat`

Inspect memory, processes, I/O, CPU, and other system activity.

```bash:no-line-numbers
# sample every 2 seconds, five times total
vmstat 2 5
```

### `dmesg`

Inspect boot, driver, and hardware messages in the kernel ring buffer.

```bash:no-line-numbers
# show kernel messages with human-readable timestamps
sudo dmesg --human

# show errors and warnings only
sudo dmesg --level=err,warn

# wait for new kernel messages
sudo dmesg --follow
```

::: note Platform and permissions

These long options mainly apply to the util-linux implementation of `dmesg`. Some systems restrict kernel-log access for unprivileged users; run `dmesg --help` or `man dmesg` to confirm local options and permission requirements.

:::

`free` and `vmstat` are common on Linux and are not included by default on macOS.

## 📚 Further reading

- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)
- [Linux man-pages](https://man7.org/linux/man-pages/)
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/)

Read local command help with:

```bash:no-line-numbers
# read the detailed manual for a command
man <command>

# show the command's brief help
<command> --help
```
