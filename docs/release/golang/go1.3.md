---
title: Go 1.3 (2014-06-18)
sidebar_position: 203
---

Go 1.3 版本于 2014 年 6 月发布，改进了内存模型和栈管理。

## 主要变化

### 运行时

- **栈管理**: 改进了 goroutine 栈的分配方式，从分段栈向连续栈过渡（在 1.4 中完成）。
- **GC**: 垃圾回收器更加精确，减少了内存泄漏的可能性。

### 标准库

- **`sync.Pool`**: 新增 `sync.Pool` 类型，用于复用临时对象，减轻 GC 压力。

### 工具链

- **DragonFly BSD, Plan 9, Solaris**: 增加了对这些操作系统的支持。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.3 Release Notes](https://go.dev/doc/go1.3)
