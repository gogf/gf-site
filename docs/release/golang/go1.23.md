---
title: Go 1.23 (2024-08-13)
sidebar_position: 177
---

Go 1.23 版本于 2024 年 8 月发布，引入了迭代器支持、遥测功能以及工具链的改进。

## 主要变化

### 语言

- **Range-over-func (迭代器)**: `for-range` 循环现在支持用户定义的迭代器函数。这允许开发者为自定义容器创建标准的迭代接口。
- **泛型类型别名**: 引入了对泛型类型别名的预览支持（通过 `GOEXPERIMENT=aliastypeparams` 启用）。

### 工具链

- **Go Telemetry**: 引入了可选的遥测系统，帮助 Go 团队了解工具链的使用情况和性能问题。用户可以随时选择加入或退出（`go telemetry on`）。
- **Go 命令**:
  - `go env -changed`: 仅列出与默认值不同的环境变量。
  - `go mod tidy -diff`: 不修改文件，而是打印必要的更改 diff。
  - `godebug` 指令: 在 `go.mod` 和 `go.work` 中声明 GODEBUG 设置。
- **Vet**: 新增 `stdversion` 分析器，标记对当前 Go 版本来说过新的符号引用。
- **Trace**: `trace` 工具现在能更好地容忍部分损坏的跟踪数据，特别是在程序崩溃时。

### 运行时

- **PGO 改进**: 显著降低了启用 PGO 时的构建时间开销。
- **栈使用优化**: 编译器现在可以重叠函数中不相交区域的局部变量栈帧槽，从而减少栈使用。
- **Linker**: 链接器现在禁止使用 `//go:linkname` 引用标准库中未标记为导出的内部符号。

### 标准库

- **`iter`**: 新增 `iter` 包，定义了用于迭代器的基本类型和函数。
- **`slices` 和 `maps`**: 增加了对迭代器的支持，例如 `slices.All`, `slices.Collect`, `maps.Keys`, `maps.Values` 等。
- **`unique`**: 新增 `unique` 包，用于通过驻留（interning）机制对不可变值进行去重。
- **`structs`**: 新增 `structs` 包，提供 `HostLayout` 类型以控制结构体内存布局。
- **`time`**: `Timer` 和 `Ticker` 的垃圾回收机制得到改进，不再需要显式调用 `Stop` 来防止内存泄漏。关联的通道现在是无缓冲的。
- **`net/http`**: `Cookie` 处理改进（保留引号，支持 Partitioned 属性），`ServeMux` 模式支持空格。
- **`reflect`**: 新增 `Value.Seq` 和 `Value.Seq2` 方法，支持反射值的迭代。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.23 Release Notes](https://go.dev/doc/go1.23)
