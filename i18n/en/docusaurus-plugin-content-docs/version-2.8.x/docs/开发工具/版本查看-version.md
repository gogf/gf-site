---
slug: '/docs/cli/version'
title: 'Version Check'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame framework, gf command line, version check, gf version, CLI tool, Golang version, technical documentation, code compilation, environment configuration]
description: "Use GoFrame command line tool to check version information, including usage of gf -v and gf version. The content covers examples of different version uses, showing specific version information of GoFrame in projects, explaining CLI compilation details and notes, to help users accurately understand the relationship between GoFrame version and Golang and related technologies."
---

## Usage

- `gf -v`
- `gf version`

Used to check the version information compiled at the current `gf` command line tool.

## Usage Example

### `>= v2.5.7`

```text
$ gf version
v2.7.2
Welcome to GoFrame!
Env Detail:
  Go Version: go1.22.2 linux/amd64
  GF Version(go.mod):
    github.com/gogf/gf/contrib/drivers/mysql/v2@v2.7.2
    github.com/gogf/gf/v2@v2.7.2
CLI Detail:
  Installed At: /data/home/v_hlaghuang/go/bin/gf
  Built Go Version: go1.20.8
  Built GF Version: v2.7.2
  Git Commit: 2024-06-26 10:08:04 b11caba5b03ed54fbb1415151f7d62b6d913179d
  Built Time: 2024-06-26 10:09:50
Others Detail:
  Docs: https://goframe.org
  Now : 2024-07-17T15:48:57+08:00
```

### `< v2.5.6`

```text
$ gf version
GoFrame CLI Tool v2.0.0, https://goframe.org
GoFrame Version: v2.0.0-beta.0.20211214160159-19c9f0a48845 in current go.mod
CLI Installed At: /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf-cli/main
CLI Built Detail:
  Go Version:  go1.16.3
  GF Version:  v2.0.0-beta
  Git Commit:  2021-12-15 22:43:12 7884058b5df346d34ebab035224e415afb556c19
  Build Time:  2021-12-15 23:00:43
```

## Notes

The version information printed automatically detects the `GoFrame` version used by the current project (automatically parses `go.mod`) and prints it as `GoFrame Version`.

The `CLI Built Detail` information displays various `Golang` version and `GoFrame` version information used at the time of the current binary compilation, the `Git` commit version at the time of compilation, and the compilation time of the current binary file.
:::warning
Please do not confuse the `GoFrame Version` with the `GF Version` in the `CLI Built Detail`.
:::