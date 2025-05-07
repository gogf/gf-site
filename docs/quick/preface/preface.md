---
slug: '/preface'
title: '写在最前'
sidebar_position: 0
hide_title: true
---

朋友，你来晚了，不过没关系，我们的故事从现在开始，我们准备了一些使用指南，助你快速了解 `GoFrame`。

## 初次见面

### 语言入门

对于 `Go` 语言新手，我们强烈建议先学习 `Go` 语言的基础知识，所谓万丈高楼平地起，只有打好基础，才能少走弯路，事半功倍。

这里我们推荐一些学习资料，开发前可以参考[准备开发环境](/docs/install-go)：

- [Go 官网](https://go.dev/)([国内镜像](https://golang.google.cn/))
  - [《Go 之旅》](https://tour.go-zh.org/)— 交互式教程，快速上手
- 书籍推荐
  - [《Go 语言圣经》](http://books.studygolang.com/gopl-zh/)— 必读
  - [《Go 语言设计与实现》](https://draven.co/golang/)
  - [《Go 语言高性能编程》](https://geektutu.com/post/high-performance-go.html)
  - [《Go 语言高级编程》](https://chai2010.cn/advanced-go-programming-book/)
  - [《Go 语言 101》](https://gfw.go101.org/)
  - [《Go 语言标准库》](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/)
  - [《数据结构与算法》](https://github.com/yezihack/algo)
  - [《Go 语言设计模式》- senghoo](https://github.com/senghoo/golang-design-pattern)
  - [《Go 语言设计模式》- lee501](https://github.com/lee501/go-patterns)

### 技术选型

还在犹豫？推荐阅读来自用户投稿的[框架比较选型](/articles/framework-comparison-goframe-beego-iris-gin)，我们也收集了一些[社区案例](/showcase)。

## 开始使用

从这里开始我们默认你已经掌握 `Go` 语言基础，虽然上手 `GoFrame` 简直易如反掌，但说实话我们的文档太多太详细了，直接阅读估计头大。

所以我们建议你先阅读下面的文档，然后再根据自己的需求选择性地阅读对应的文档，下面让我们开始 `GoFrame` 的开发之旅！

### 入门

大家学习编程都是从 `Hello World` 开始的，`GoFrame` 也不例外，我们先从[Hello World](/quick/install)开始。

接下来通过一个[web 服务](/quick/hello-world)的例子，进一步了解 `GoFrame` 的使用。

### 模块使用

`GoFrame` 提供了很多独立的模块，在不使用框架的情况下也是可以单独使用，可以通过[模块列表](/docs/components)了解。

:::info 注意
`Go` 语言是按需编译的，没有使用的模块不会被编译进去目标文件。
:::

### 工具

为了提高开发效率，我们也开发了一个[脚手架工具](/quick/scaffold)，可以帮助你快速生成项目模板。

### 进阶

在入门之后，根据你的开发需求选择性地阅读下面的文档：

- [WEB 服务开发](/docs/web)
- [微服务开发](/docs/micro-service)
- [数据库 ORM](/docs/core/gdb)
- [功能示例](/examples/grpc)

同时社区也贡献了一些完整项目的[社区教程](/course)，另外我们收集了一些[社区案例](/showcase)。

## 遇到问题

在使用的过程中遇到问题，可以通过以下方式获取帮助：

1. 查看文档，在文档右上方进行搜索，每页文档的底部有留言板。
2. [社区交流](/share/group)
3. [查看源码](https://github.com/gogf/gf)

## 参与改进

### 功能建议和 bug 提交

在使用过程中遇到问题或是有更好的建议欢迎[提交](https://github.com/gogf/gf/issues)。

### 共同开发

想跟我们一起开发 `GoFrame` 框架吗？欢迎你的加入！在你开始之前，先阅读[贡献指南](/supportus/pr)。
