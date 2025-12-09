---
title: Go 1.4 (2014-12-10)
sidebar_position: 204
---

Go 1.4 版本于 2014 年 12 月发布，增加了对 Android 的支持。

## 主要变化

### 语言变化

- **`for-range`**: `for range` 循环现在可以不写变量，直接迭代。

    ```go
    for range ch { ... }
    ```

### 工具链

- **Android 支持**: 支持编写运行在 Android 上的 Go 程序（通过 `golang.org/x/mobile`）。
- **Canonical Import Paths**: 允许包声明其规范导入路径，防止通过其他路径导入。

### 运行时

- **连续栈 (Contiguous Stacks)**: 运行时现在使用连续栈而不是分段栈，消除了“热分裂”问题，提升了性能。

### 标准库

- **`go/generate`**: 引入了 `go generate` 命令，用于自动化代码生成。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.4 Release Notes](https://go.dev/doc/go1.4)
