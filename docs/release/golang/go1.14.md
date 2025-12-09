---
title: Go 1.14 (2020-02-25)
sidebar_position: 186
---

Go 1.14 版本于 2020 年 2 月发布，标志着 Go Modules 可以在生产环境中使用了，并带来了显著的运行时性能提升。

## 主要变化

### 工具链

- **Modules 生产就绪**: Go Modules 的实现已经足够成熟，官方鼓励所有用户在生产环境中使用它进行依赖管理。
  - **Vendor 行为**: 如果主模块包含 `vendor` 目录，`go` 命令现在默认使用 `-mod=vendor`。
  - **GOINSECURE**: 新增环境变量 `GOINSECURE`，用于在不验证证书的情况下通过 HTTP 获取模块（主要用于企业内部私有仓库）。

### 语言变化

- **接口重叠**: 允许嵌入的接口定义重叠的方法。这解决了在复杂的接口嵌入结构（如菱形继承）中常见的问题。

  ```go
  type ReadWriteCloser interface {
      io.ReadCloser
      io.WriteCloser
  }
  // 即使 ReadCloser 和 WriteCloser 都包含 Close() 方法，现在也是合法的。
  ```

### 运行时

- **Defer 性能**: `defer` 语句的开销大幅降低，现在几乎可以忽略不计。开发者可以在性能敏感的代码中放心使用 `defer` 进行资源清理。
- **Goroutine 异步抢占**: 实现了基于信号的异步抢占调度。这意味着紧密循环（tight loops，如没有任何函数调用的 `for` 循环）不再会阻塞 GC 或调度器，大大减少了 STW (Stop-The-World) 的延迟，并避免了潜在的死锁。
- **Timer 效率**: 内部计时器实现更高效，减少了锁竞争和上下文切换。

### 标准库

- **`hash/maphash`**: 新增 `hash/maphash` 包，提供用于哈希表的高性能哈希函数（注意：生成的哈希值在进程间不一致，不可持久化）。
- **`testing`**:
  - `T.Cleanup` / `B.Cleanup`: 注册在测试或基准测试结束后执行的清理函数（类似于 `defer`，但更灵活）。
- **`math`**:
  - `math.FMA`: 新增 Fused Multiply-Add (x*y+z) 运算，利用硬件指令提高精度和性能。
- **`sync`**:
  - `Mutex`: 改进了高竞争下的 `Mutex` 性能，直接将 CPU 让给等待的 Goroutine。
- **TLS**: 移除了对 SSLv3 的支持。TLS 1.3 无法再通过 `GODEBUG` 禁用。
- **HTTP/2**: `net/http` 的测试服务器 (`httptest`) 现在支持 HTTP/2。

---

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.14 Release Notes](https://go.dev/doc/go1.14)
