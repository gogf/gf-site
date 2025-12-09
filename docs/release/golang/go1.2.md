---
title: Go 1.2 (2013-12-01)
sidebar_position: 202
---

Go 1.2 版本于 2013 年 12 月发布，引入了测试覆盖率工具。

## 主要变化

### 语言变化

- **Slice 容量**: 切片操作现在支持指定容量（三索引切片）。

    ```go
    s[i:j:k]
    ```

### 工具链

- **Test Coverage**: `go test` 新增 `-cover` 标志，用于计算代码覆盖率。
- **Goroutine 抢占**: 调度器现在可以在函数调用时抢占 goroutine，防止死循环阻塞整个程序。

### 标准库

- **`encoding/xml`**: 改进了 XML 解析性能。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.2 Release Notes](https://go.dev/doc/go1.2)
