---
slug: '/docs/cli/fix'
title: '兼容修复-fix'
sidebar_position: 9
hide_title: true
---
:::tip
该命令从框架 `v2.3` 版本开始提供。
:::
## 使用场景

当官方框架版本在升级过程中，会尽最大可能保证向下兼容性。但确实遇到十分困难的场景，难以保证完全向下兼容性的时候，并且是较小的兼容性问题，考虑到新增大版本号的成本较高，那么官方会通过该命令提供自动修正兼容问题。并且官方会保证该指令可重复执行，无副作用。

## 使用方式

```bash
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