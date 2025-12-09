---
title: Go 1.3 (2014-06-18)
sidebar_position: 197
---

Go 1.3 于 2014 年 6 月发布，主要改进了栈管理、垃圾回收器和工具链性能，并增加了对多个新操作系统的支持。

## 主要变化

### 运行时与性能

- **连续栈 (Contiguous Stacks)**: Go 1.3 将 goroutine 的栈实现从分段模型改为连续模型。当栈空间不足时，运行时会分配一个更大的连续内存块并将旧栈复制过去。这消除了分段栈在段边界反复扩展和收缩导致的"热分裂"性能问题。
- **精确 GC**: 垃圾回收器现在可以精确地识别栈上的指针。这意味着非指针数据（如整数）不会被误认为是指针，从而避免了内存泄漏。
- **Map 迭代**: 恢复了对小 Map (`<= 8` 元素) 的随机迭代顺序，以防止程序依赖特定的迭代顺序（Go 语言规范明确指出 Map 迭代顺序是未定义的）。
- **Defer 性能**: `defer` 的开销降低，每个 defer 调用减少了约 2KB 的内存分配。

### 标准库

- **`sync.Pool`**: 这是一个重要的新增类型，用于存储和复用临时对象。它可以减轻垃圾回收器的压力，特别是在高并发场景下。

  ```go
  var bufPool = sync.Pool{
      New: func() interface{} {
          return new(bytes.Buffer)
      },
  }
  ```

- **TCP Keep-Alive**: HTTP 客户端（`DefaultTransport`）和服务器现在默认启用 TCP Keep-Alive。

### 工具链

- **Godoc**: `godoc` 工具增加了静态分析功能（通过 `-analysis` 标志），可以显示调用图、类型关系等信息。
- **链接器**: 链接器进行了重构，部分指令选择工作移至编译器阶段，显著加快了大型项目的编译速度。
- **新平台支持**: 增加了对 DragonFly BSD, Plan 9, Solaris 和 NaCl (Native Client) 的支持。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.3 Release Notes](https://go.dev/doc/go1.3)
