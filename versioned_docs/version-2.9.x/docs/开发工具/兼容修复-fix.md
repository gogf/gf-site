---
slug: '/docs/cli/fix'
title: '兼容修复-fix'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame框架,兼容修复,CLI使用,代码更新,版本升级,向下兼容,gf fix,命令行工具,自动修正]
description: 'GoFrame框架提供的兼容修复命令gf fix，帮助在框架升级过程中解决向下兼容性问题。该命令自v2.3版本起提供，通过自动更新本地代码，处理较小兼容性问题，并可重复执行以确保无副作用。'
---
:::tip
该命令从框架 `v2.3` 版本开始提供。
:::
## 使用场景

当官方框架版本在升级过程中，会尽最大可能保证向下兼容性。但确实遇到十分困难的场景，难以保证完全向下兼容性的时候，并且是较小的兼容性问题，考虑到新增大版本号的成本较高，那么官方会通过该命令提供自动修正兼容问题。并且官方会保证该指令可重复执行，无副作用。

## 使用方式

```text
$ gf fix -h
USAGE
    gf fix

OPTION
    -/--path     directory path, it uses current working directory in default
    -h, --help   more information about this command
```

用以低版本（当前 `go.mod` 中的 `GoFrame` 版本）升级高版本（当前 `CLI` 使用的 `GoFrame` 版本）自动更新本地代码不兼容变更。

## 注意事项

命令执行前请 `git` 提交本地修改内容或执行目录备份。