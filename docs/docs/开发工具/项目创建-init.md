---
slug: '/docs/cli/init'
title: '项目创建-init'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,项目创建,gf init,MonoRepo,GoFrame空框架,代码分层设计,go module,资源管理,微服务大仓管理模式]
description: '本文介绍如何使用GoFrame框架提供的gf init命令创建项目。自v2版本起，项目创建更快速，不再依赖远端，模板已内置于二进制文件中。您可以按照需要选择初始化单仓或大仓项目模式，并灵活调整生成的目录结构以适应实际业务需求。'
---
:::tip
从 `v2` 版本开始，项目的创建不再依赖远端获取，仓库模板已经通过 [资源管理](../核心组件/资源管理/资源管理.md) 的方式内置到了工具二进制文件中，因此项目创建速度非常迅速。
:::
## 使用方式

```bash
$ gf init -h
USAGE
    gf init ARGUMENT [OPTION]

ARGUMENT
    NAME    项目名称，在当前目录下创建名为 NAME 的文件夹，并且 module 名称也为 NAME

OPTION
    -m, --mono    初始化大仓模式 mono-repo
    -a, --monoApp 初始化大仓下的一个小仓 mono-repo-app
    -u, --update  初始化后使用最新的框架版本
    -g, --module  自定义 module
    -h, --help    更多帮助

EXAMPLE
    gf init my-project
    gf init my-mono-repo -m
```

我们可以使用 `init` 命令在当前目录生成一个示例的 `GoFrame` 空框架项目，并可给定项目名称参数。生成的项目目录结构仅供参考，根据业务项目具体情况可自行调整。生成的目录结构请参考 [代码分层设计](../框架设计/工程开发设计/代码分层设计.md) 章节。
:::note
`GoFrame` 框架开发推荐统一使用官方的 `go module` 特性进行依赖包管理，因此空项目根目录下也有一个 `go.mod` 文件。
:::
:::tip
工程目录采用了通用化的设计，实际项目中可以根据项目需要适当增减模板给定的目录。例如，没有 `kubernetes` 部署需求的场景，直接删除对应 `deploy` 目录即可。
:::

## 使用示例

### 在当前目录下初始化项目

```bash
$ gf init .
initializing...
initialization done!
you can now run 'gf run main.go' to start your journey, enjoy!
```

### 创建一个指定名称的项目

```bash
$ gf init myapp
initializing...
initialization done!
you can now run 'cd myapp && gf run main.go' to start your journey, enjoy!
```

### 创建一个 `MonoRepo` 项目

默认情况下创建的是 `SingleRepo` 项目，若有需要也可以创建一个 `MonoRepo`（大仓）项目，通过使用 `-m` 选项即可。

```bash
$ gf init mymono -m
initializing...
initialization done!
```

关于大仓的介绍请参考章节： [微服务大仓管理模式](../框架设计/工程开发设计/微服务大仓管理模式.md)

#### 创建一个 `MonoRepoApp` 项目

若需要在 `MonoRepo`（大仓）下的创建一个小仓，通过使用 `-a` 选项即可。

```bash
$ gf init app/user -a
initializing...
initialization done!
```