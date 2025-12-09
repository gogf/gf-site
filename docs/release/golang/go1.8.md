---
title: Go 1.8 (2017-02-16)
sidebar_position: 192
---

Go 1.8 于 2017 年 2 月 16 日发布。此版本在保持 Go 1 兼容性承诺的同时，带来了显著的性能提升（特别是 GC 和 defer），以及 HTTP/2 Server Push、HTTP Server 优雅关闭、插件系统等重要功能。

## 主要变化

### 运行时与性能

- **垃圾回收 (GC)**：GC 停顿时间进一步缩短，通常低于 **100 微秒**，甚至低至 10 微秒。这得益于消除了 "stop-the-world" 栈重新扫描。
- **Defer 开销**：`defer` 函数调用的开销减少了约一半。
- **Cgo 开销**：Go 调用 C 代码的开销也减少了约一半。
- **`mutex` Profiling**：支持对互斥锁争用进行性能分析 (`go test -mutexprofile`)。

### 标准库

- **HTTP/2 Server Push**: `net/http` 包新增了对 HTTP/2 Server Push 的支持。这允许服务器在客户端请求之前主动推送资源。`http.ResponseWriter` 现在实现了 `Pusher` 接口。

  ```go
  if pusher, ok := w.(http.Pusher); ok {
      // Push is supported.
      if err := pusher.Push("/style.css", nil); err != nil {
          log.Printf("Failed to push: %v", err)
      }
  }
  ```

- **HTTP Server 优雅关闭**: `http.Server` 新增了 `Shutdown` 方法，支持优雅关闭服务器。`Shutdown` 会停止监听新请求，但允许正在处理的请求完成，然后关闭服务器。

  ```go
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
      log.Fatal("Server Shutdown:", err)
  }
  ```

- **`sort.Slice`**: `sort` 包新增了 `Slice` 函数，使得对切片进行排序变得更加简单，无需定义新的类型来实现 `sort.Interface`。

  ```go
  sort.Slice(people, func(i, j int) bool {
      return people[i].Name < people[j].Name
  })
  ```

- **Context 支持扩展**: `context.Context` 的支持扩展到了更多标准库：
  - **`database/sql`**：新增了 `QueryContext`, `ExecContext`, `PrepareContext` 等方法，允许通过 Context 取消数据库操作。
  - **`net.Resolver`**：DNS 查询方法现在接受 Context。
- **`encoding/base64`**：新增 `Strict` 模式，严格检查填充位。
- **`encoding/json`**：`Marshal` 现在支持浮点数格式与 ES6 保持一致。

### 工具链

- **插件系统 (Plugins)**: Go 1.8 引入了对动态加载共享库的初步支持（目前仅限 Linux）。`plugin` 包允许 Go 程序在运行时加载编译为插件的 Go 包（`.so` 文件），并查找导出的符号（变量或函数）。

  ```go
  p, err := plugin.Open("myplugin.so")
  f, err := p.Lookup("MyFunction")
  ```

- **默认 GOPATH**: 如果未设置 `GOPATH` 环境变量，Go 现在会使用默认值：
  - Unix: `$HOME/go`
  - Windows: `%USERPROFILE%\go`

### 语言变化

- **结构体转换忽略 Tag**: 当显式转换一个结构体类型到另一个结构体类型时，如果两者仅在字段 Tag 上不同，现在允许直接转换，而不再需要字段 Tag 完全一致。

  ```go
  type T1 struct {
      X int `json:"foo"`
  }
  type T2 struct {
      X int `json:"bar"`
  }
  var v1 T1
  var v2 T2
  v1 = T1(v2) // Go 1.8 之前是非法的，现在合法
  ```

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.8 Release Notes](https://go.dev/doc/go1.8)
