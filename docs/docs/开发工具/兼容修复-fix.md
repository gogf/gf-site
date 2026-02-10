---
slug: '/docs/cli/fix'
title: '兼容修复-fix'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame框架,兼容修复,CLI使用,代码更新,版本升级,向下兼容,gf fix,命令行工具,自动修正]
description: 'GoFrame提供的gf fix命令用于自动修复GoFrame版本升级过程中的代码兼容性问题。该命令从v2.3版本开始提供，可自动检测项目中使用的GoFrame版本，并应用相应的兼容性修复规则，支持重复执行且无副作用。在框架难以保证完全向下兼容时，此命令可有效帮助开发者快速完成代码更新。'
---
:::tip
该命令从框架 `v2.3` 版本开始提供。
:::
## 使用场景

GoFrame框架在版本升级时会尽最大努力保证向下兼容性。当遇到以下情况时，可使用 `gf fix` 命令自动修复兼容性问题：

1. 框架升级涉及较小的不兼容变更
2. 新增大版本号成本较高的场景
3. 需要批量更新代码适配新版本

该命令可重复执行，不会产生副作用。

## 使用方式

```text
$ gf fix -h
USAGE
    gf fix

OPTION
    -/--path     directory path, it uses current working directory in default
    -h, --help   more information about this command
```

用于在低版本（当前 `go.mod` 中的 `GoFrame` 版本）升级到高版本（当前 `CLI` 使用的 `GoFrame` 版本）时，自动更新本地代码的不兼容变更。

命令会自动检测项目中使用的GoFrame版本，并应用相应的修复规则。主要修复内容包括：
- 结构体到接口的类型变更（如 `*gdb.TX` 到 `gdb.TX`）
- 函数名称变更（如网络包函数重命名）
- API调整和废弃接口替换

## 注意事项

**执行命令前务必做好代码备份：**
- 使用 `git` 提交本地修改内容
- 或对执行目录进行完整备份

该命令会直接修改源代码文件，虽然可重复执行，但建议在有版本控制的情况下使用。