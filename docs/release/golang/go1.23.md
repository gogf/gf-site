---
title: Go 1.23 (2024-08-13)
sidebar_position: 223
---

Go 1.23 版本于 2024 年 8 月发布，引入了迭代器支持、遥测功能以及工具链的改进。

## 主要变化

### 语言变化

- **Range-over-func (迭代器)**: `for-range` 循环现在支持用户定义的迭代器函数。这允许开发者为自定义容器创建标准的迭代接口。

    ```go
    for x := range myContainer.All() {
        fmt.Println(x)
    }
    ```

- **别名类型支持**: 改进了对类型别名的处理，特别是在泛型代码中。

### 工具链

- **Go Telemetry**: 引入了可选的遥测系统，帮助 Go 团队了解工具链的使用情况和性能问题。用户可以随时选择加入或退出。
- **`go env -changed`**: 新增标志，仅列出与默认值不同的环境变量。

### 标准库

- **`iter` 包**: 新增 `iter` 包，定义了用于迭代器的基本类型和函数。
- **`slices` 和 `maps`**: 增加了对迭代器的支持，例如 `slices.All` 和 `maps.Keys`。
- **`unique` 包**: 新增 `unique` 包，用于通过驻留（interning）机制对不可变值进行去重。
- **`time`**: `Timer` 和 `Ticker` 的垃圾回收机制得到改进，不再需要显式调用 `Stop` 来防止内存泄漏（在不再引用时）。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.23 Release Notes](https://go.dev/doc/go1.23)
