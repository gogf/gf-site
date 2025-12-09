---
title: Go 1.18 (2022-03-15)
sidebar_position: 218
---

Go 1.18 版本于 2022 年 3 月发布，是 Go 语言历史上最重要的版本之一，引入了泛型、模糊测试和工作区模式。

## 主要变化

### 语言变化

- **泛型 (Generics)**: 引入了参数化多态支持，允许编写适用于多种类型的函数和数据结构。

    ```go
    func Min[T constraints.Ordered](x, y T) T {
        if x < y {
            return x
        }
        return y
    }
    ```

### 工具链

- **Fuzzing (模糊测试)**: `go test` 命令内置了模糊测试支持，帮助发现边缘情况下的 bug。
- **Workspaces (工作区)**: 引入 `go.work` 文件，支持多模块工作区开发模式，方便同时修改多个相互依赖的模块。

### 性能

- **性能提升**: 在 Apple M1, ARM64 和 PowerPC64 架构上有显著的性能提升（高达 20%）。

### 标准库

- **`net/netip`**: 新增 IP 地址处理包，比 `net.IP` 更高效、更安全。
- **`strings` / `bytes`**: 新增 `Cut` 函数，简化字符串分割操作。

    ```go
    before, after, found := strings.Cut("hello,world", ",")
    ```

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.18 Release Notes](https://go.dev/doc/go1.18)
