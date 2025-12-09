---
title: Go 1.7 (2016-08-15)
sidebar_position: 207
---

Go 1.7 版本于 2016 年 8 月发布，引入了 `context` 包和 SSA 后端。

## 主要变化

### 语言变化

- **无变化**: Go 1.7 没有语言规范的变更。

### 编译器

- **SSA 后端**: x86-64 架构的编译器后端切换到了 SSA (Static Single Assignment) 形式，生成的代码更高效，二进制文件更小。

### 标准库

- **`context` 包**: `golang.org/x/net/context` 被移入标准库 `context` 包。这是 Go 并发模式中的重要组成部分。
- **`net/http`**: `Request` 结构体增加了 `Context` 方法。

### 工具链

- **Vendor**: Vendor 目录的支持现在默认启用。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.7 Release Notes](https://go.dev/doc/go1.7)
