---
slug: '/docs/install-go/go-module'
title: 'Go Module'
sidebar_position: 1
hide_title: true
keywords: [Go Module,GoFrame,包管理工具,依赖管理,go.mod,Goland IDE,vgo,package,GOPROXY,go get]
description: 'Go Module这一包管理工具的使用方法，涵盖了如何通过Goland IDE和命令行进行依赖管理，并提供了设置go.mod文件及使用代理下载GoFrame框架的实用指导。通过开启Go Module特性和选择适当的Proxy地址，能够高效管理项目包依赖，从而提升开发效率。'
---

`Go Module` 是从Go版本 `1.11.1` 开始官方提供的包管理工具，用于解决Go项目的包管理及依赖，类似于PHP的 `composer`、Nodejs的 `npm`。本章节会对 `Go Module` 的一些常用的实用的命令/设置进行介绍，更详细的介绍请查看官方文档： [https://github.com/golang/go/wiki/Modules](https://github.com/golang/go/wiki/Modules)

## 关于 `go.mod`

`go.mod` 是Go项目的依赖描述文件，该文件主要用来描述两个事情：

1. 当前项目名( `module`)是什么。每个项目都应该设置一个名称，当前项目中的包( `package`)可以使用该名称进行相互调用。
2. 当前项目依赖的第三方包名称。项目运行时会自动分析项目中的代码依赖，生成 `go.sum` 依赖分析结果，随后go编译器会去下载这些第三方包，然后再编译运行。

我们将之前的 `hello world` 项目做一些改变，增加一个 `go.mod` 文件（也可以在项目根目录下使用 `go mod init 项目名称` 命令初始化项目生成该文件），内容如下：

```go
module my-hello
```

其中， `my-hello` 为当前项目的名称，可以随意设置。

就这样简单便完成了项目的 `module` 初始化。

一般情况下， `go.sum` 依赖分析文件应当被添加到版本管理中随着 `go.mod` 文件一起提交。

## 使用 `go.mod`

使用 `go.mod` 意即用 `go.mod` 进行项目依赖管理。我们有两种 `go.mod` 的 **使用方式**： `IDE-vgo` 和 `命令行` 方式。以下我们通过下载使用 `GoFrame` 框架来演示如何使用这两种方式来管理依赖。

> 如果需要 `Goland` IDE支持 `go.mod`，必须要打开 `vgo` 的支持（包括代码依赖检测）。这两种使用方式的区别仅仅是下载依赖包的方式不同。

### 使用Goland IDE vgo（推荐）

`vgo` 是基于 `Go Module` 规范的包管理工具，同官方的 `go mod` 命令工具类似。

1. 设置 `Goland` 启用 `vgo`

![](/markdown/f3f9552ca0703fb4e88ae2958b58815c.png)

如果您本地环境已经有 `VPN` 功能，那么可以忽略 `proxy` 的设置。

其中 `Proxy` 请输入代理地址下载依赖包，如果选择 `direct` 表示不使用代理。可选择的反向代理地址有：


   - `https://goproxy.cn`
   - `https://goproxy.io`
   - `https://mirrors.aliyun.com/goproxy/`

详见Go官网说明： [https://github.com/golang/go/wiki/Modules#are-there-always-on-module-repositories-and-enterprise-proxies](https://github.com/golang/go/wiki/Modules#are-there-always-on-module-repositories-and-enterprise-proxies)

这里请务必选择一个代理地址输入。

2. 手动修改 `go.mod` 文件如下：

```go
module my-hello


require github.com/gogf/gf latest
```

增加 `GoFrame` 框架的依赖，其中 `latest` 表示使用最新版本，IDE将会立即去更新下载框架代码。成功后，IDE将会修改 `go.mod` 文件并生成 `go.sum` 依赖分析文件。

![](/markdown/cb698537b6d68707fb4c1284530d9f90.png)

3. 随后 `go.mod` 文件被自动更新为：

```go
module my-hello


require github.com/gogf/gf v1.6.13
```

其中 `v1.6.13` 表示vgo检测到的最新框架版本。

4. 如果下载最新代码框架后出现下图情况： [https://www.jetbrains.com/help/go/create-a-project-with-vgo-integration.html](https://www.jetbrains.com/help/go/create-a-project-with-vgo-integration.html)

![](/markdown/6c6bad791c9e0eee3c740f9cda0ea5c4.png)

5. 请按快捷键 `⌥(option)+↩(return)` 或者 鼠标右键, 选择 `Sync packages of my-hello`

![](/markdown/cf02717043547f5e1bf0a14b31d40b1c.png)

6. 随后等待几秒钟之后, 可以看到左侧的 `Go Module` 已经有内容，并且中终端自动输出了下载的框架版本

![](/markdown/955367cd46f617411d664c5baa8af9ce.png)


### 使用命令行

1. 打开 `Terminal`，在项目根目录下执行:

```bash
export GO111MODULE=on GOPROXY=https://goproxy.cn; go get -u github.com/gogf/gf
```

该命令将会立即下载最新稳定版本的 `GoFrame` 框架。其中 `export GO111MODULE=on;` 表示开启 `Go Module` 特性（Go `1.11.x` 版本默认关闭，需要手动开启）， `export GOPROXY=https://goproxy.cn` 表示使用代理下载，原因你懂的，并且也能极大提高依赖包下载速度。代理地址也可使用：


   - `https://goproxy.cn`
   - `https://goproxy.io`
   - `https://mirrors.aliyun.com/goproxy`

![](/markdown/2274104a3ec3a6d2ac7ea35ad374c85c.png)

2. 随后 `go.mod` 文件内容被自动更新为：

```go
module my-hello


require github.com/gogf/gf v1.6.13 // indirect
```

且生成了新的 `go.sum` 依赖分析文件，该文件充其量算是一个临时文件，对于我们平时开发工作来说意义不大。


