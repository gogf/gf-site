---
title: Go 1.5 (2015-08-19)
sidebar_position: 205
---

Go 1.5 版本于 2015 年 8 月发布，这是一个里程碑版本，Go 编译器和运行时完全用 Go 语言重写（自举）。

## 主要变化

### 编译器与运行时

- **自举 (Self-hosting)**: 移除了所有 C 代码，编译器、链接器和运行时现在完全由 Go 和少量汇编语言编写。
- **并发 GC**: 垃圾回收器经过重新设计，主要阶段并发运行，显著降低了 STW (Stop-The-World) 时间。
- **GOMAXPROCS**: `GOMAXPROCS` 的默认值现在是 CPU 核心数（之前默认为 1）。

### 工具链

- **Vendor (实验性)**: 引入了 vendor 机制的实验性支持（通过 `GO15VENDOREXPERIMENT=1` 开启）。
- **Internal packages**: 支持 `internal` 包，限制包的导入范围。

### 语言变化

- **Map 字面量**: 简化了 Map 字面量的写法，省略了键值对中的类型名。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.5 Release Notes](https://go.dev/doc/go1.5)
