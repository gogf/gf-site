---
slug: '/preface'
title: 'Preface'
sidebar_position: 0
hide_title: true
---

Friend, you're a bit late, but that's okay. Our story begins now, and we've prepared some guides to help you quickly understand `GoFrame`.

- [First Encounter](#first-encounter)
  - [Language Basics](#language-basics)
  - [Technology Selection](#technology-selection)
- [Getting Started](#getting-started)
  - [Introduction](#introduction)
  - [Module Usage](#module-usage)
  - [Tools](#tools)
  - [Advanced](#advanced)
- [Participate in Improvement](#participate-in-improvement)
  - [Feature Suggestions and Bug Reports](#feature-suggestions-and-bug-reports)
  - [Joint Development](#joint-development)

## First Encounter

### Language Basics

For `Go` language beginners, we strongly recommend learning the basics of the `Go` language first. As the saying goes, a thousand-mile journey begins with a single step. Only with a solid foundation can you avoid detours and achieve twice the result with half the effort.

Here we recommend some learning resources. Before development, you can refer to [Prepare Development Environment](/docs/install-go):

- [Go Official Website](https://go.dev/)([China Mirror](https://golang.google.cn/))
  - [A Tour of Go](https://tour.go-zh.org/) — Interactive tutorial, quick to get started
- Book Recommendations
  - [The Go Programming Language](http://books.studygolang.com/gopl-zh/) — Must-read
  - [Design and Implementation of Go](https://draven.co/golang/)
  - [High Performance Go Programming](https://geektutu.com/post/high-performance-go.html)
  - [Advanced Go Programming](https://chai2010.cn/advanced-go-programming-book/)
  - [Go 101](https://gfw.go101.org/)
  - [Go Standard Library](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/)
  - [Data Structures and Algorithms](https://github.com/yezihack/algo)
  - [Go Design Patterns - senghoo](https://github.com/senghoo/golang-design-pattern)
  - [Go Design Patterns - lee501](https://github.com/lee501/go-patterns)

### Technology Selection

Still hesitating? We recommend reading the user-contributed [Framework Comparison: GoFrame, Beego, Iris, Gin](/articles/framework-comparison-goframe-beego-iris-gin), and we've also collected some [Community Cases](/showcase).

## Getting Started

From here, we assume you've already mastered the basics of the `Go` language. Although getting started with `GoFrame` is incredibly easy, frankly, our documentation is very extensive and detailed, and reading it all at once might be overwhelming.

So we suggest you read the following documents first, and then selectively read corresponding documents based on your needs. Let's begin the development journey with `GoFrame`!

### Introduction

Everyone starts learning programming with `Hello World`, and `GoFrame` is no exception. Let's start with [Hello World](/quick/install).

Next, we'll further understand the use of `GoFrame` through an example of a [web service](/quick/hello-world).

### Module Usage

`GoFrame` provides many independent modules that can also be used separately without using the framework. You can learn more through the [Module List](/docs/components).

:::info Note
The `Go` language compiles on demand, so modules that are not used will not be compiled into the target file.
:::

### Tools

To improve development efficiency, we've also developed a [scaffold tool](/quick/scaffold) that can help you quickly generate project templates.

### Advanced

After getting started, selectively read the following documents based on your development needs:

- [WEB Service Development](/docs/web)
- [Microservice Development](/docs/micro-service)
- [Database ORM](/docs/core/gdb)
- [Feature Examples](/examples/grpc)

At the same time, the community has contributed some [Community Tutorials](/course) for complete projects, and we've collected some [Community Cases](https://goframe.org/showcase).

## Participate in Improvement

### Feature Suggestions and Bug Reports

If you encounter problems or have better suggestions during use, you're welcome to [submit them](https://github.com/gogf/gf/issues).

### Joint Development

Want to develop the `GoFrame` framework with us? Welcome to join! Before you start, read the [Contribution Guide](/supportus/pr).
