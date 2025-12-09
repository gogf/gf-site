---
title: Go 1.13 (2019-09-03)
sidebar_position: 213
---

Go 1.13 版本于 2019 年 9 月发布，改进了数字字面量和错误处理。

## 主要变化

### 语言变化

- **数字字面量**:
  - 支持二进制字面量 (例如 `0b1011`)。
  - 支持八进制字面量前缀 `0o` (例如 `0o660`)。
  - 支持十六进制浮点数 (例如 `0x1.0p-1021`)。
  - 支持在数字字面量中使用下划线分隔符 (例如 `1_000_000`)。
- **移位操作**: 移位操作的右操作数现在可以是任何有符号整数类型。

### 标准库

- **错误包装 (Error Wrapping)**: `errors` 包新增了 `Is`, `As` 和 `Unwrap` 函数，支持错误链和错误检查。`fmt.Errorf` 支持 `%w` 动词来包装错误。

    ```go
    if errors.Is(err, os.ErrNotExist) {
        // handle error
    }
    ```

### 工具链

- **GOPROXY**: `GOPROXY` 环境变量默认设置为 `https://proxy.golang.org,direct`。
- **GOSUMDB**: 默认启用 `sum.golang.org` 校验和数据库，用于验证模块内容的完整性。

### 运行时

- **Out of range panic**: 运行时 panic 消息现在包含导致越界的索引值。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.13 Release Notes](https://go.dev/doc/go1.13)
