---
title: Go 1.1 (2013-05-13)
sidebar_position: 201
---

Go 1.1 版本于 2013 年 5 月发布，主要关注性能提升。

## 主要变化

### 语言变化

- **Method Values**: 支持将方法作为值传递（绑定到接收者）。
- **Integer Division**: 整数除以零现在会引发 panic。

### 工具链

- **Race Detector**: 引入了数据竞争检测器 (`go test -race`)，帮助发现并发 bug。

### 性能

- **性能提升**: 相比 Go 1.0，性能有显著提升（通常 30-40%）。
- **Map**: Map 的实现经过重写，性能更好，内存占用更少。

### 标准库

- **`reflect`**: 改进了反射性能。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.1 Release Notes](https://go.dev/doc/go1.1)
