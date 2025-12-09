---
title: Go 1.22 (2024-02-06)
sidebar_position: 222
---

Go 1.22 版本于 2024 年 2 月发布，主要解决了长期存在的循环变量问题，并增强了 HTTP 路由功能。

## 主要变化

### 语言变化

- **循环变量作用域**: `for` 循环中声明的变量现在每次迭代都会创建新的实例。这解决了常见的闭包捕获循环变量的问题。

    ```go
    // 以前需要:
    for _, v := range values {
        v := v // 显式复制
        go func() { fmt.Println(v) }()
    }
    // 现在直接写:
    for _, v := range values {
        go func() { fmt.Println(v) }()
    }
    ```

- **Range over integers**: `for range` 现在支持整数，例如 `for i := range 10` 将迭代 0 到 9。

### 标准库

- **`net/http` 路由增强**: `http.ServeMux` 现在支持方法匹配（如 `GET /items`）和通配符（如 `/items/{id}`）。
- **`math/rand/v2`**: 引入了 `math/rand/v2` 包，提供了更快、更标准的随机数生成器，并清理了旧 API。
- **`go/version`**: 新增 `go/version` 包，用于解析和比较 Go 版本字符串。

### 运行时与性能

- **CPU 性能**: 优化了内存布局和垃圾回收元数据，略微提升了 CPU 性能（约 1-3%）。
- **PGO (Profile-guided Optimization)**: PGO 构建现在更加成熟，能够带来更大的性能提升。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.22 Release Notes](https://go.dev/doc/go1.22)
