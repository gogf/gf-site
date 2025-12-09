---
title: Go 1.16 (2021-02-16)
sidebar_position: 184
---

Go 1.16 版本于 2021 年 2 月发布，引入了文件嵌入 (`embed`) 支持，并默认启用了 Go Modules。

## 主要变化

### 工具链

- **Go Modules 默认开启**: `GO111MODULE` 环境变量的默认值现在是 `on`。无论当前目录是否包含 `go.mod` 文件，Go 命令默认都在 Module 模式下运行。
  - `go install` 命令现在支持 `pkg@version` 语法，用于安装指定版本的可执行文件，而不会影响当前项目的依赖。例如：`go install golang.org/x/tools/gopls@latest`。
  - `go build` 和 `go test` 不再自动修改 `go.mod` 和 `go.sum`。如果需要更新依赖，需显式运行 `go mod tidy` 或 `go get`。
- **嵌入静态文件 (Embed)**: 引入了 `//go:embed` 指令，允许将静态文件（如 HTML、CSS、图片等）直接嵌入到编译后的 Go 二进制文件中。

  ```go
  package main

  import (
      "embed"
      "fmt"
  )

  //go:embed hello.txt
  var f embed.FS

  func main() {
      data, _ := f.ReadFile("hello.txt")
      fmt.Print(string(data))
  }
  ```

- **链接器优化**: 链接器速度提升 20-25%，内存占用减少 5-15%。
- **`go build -overlay`**: 支持 `-overlay` 标志，主要用于编辑器工具（如 gopls）。
- **`go vet`**: 增加了对 `goroutine` 中错误使用 `testing.T` 的检查。

### 运行时

- **Apple Silicon (M1) 支持**: 新增 `darwin/arm64` 移植，正式支持在 Apple Silicon (M1) 芯片的 Mac 上原生运行 Go 程序。
- **`runtime/metrics`**: 新增包，提供更稳定、更通用的运行时指标读取接口。
- **`GODEBUG=inittrace=1`**: 设置此环境变量可以追踪 `init` 函数的执行时间和内存分配，帮助分析启动性能。
- **Linux 内存释放**: 在 Linux 上，运行时现在默认使用 `MADV_DONTNEED` 迅速向操作系统释放内存，而不是 `MADV_FREE`。

### 标准库

- **`io/fs`**: 引入了 `fs.FS` 接口，定义了只读文件系统的抽象。标准库中的许多包（如 `net/http`, `html/template`）已适配该接口。
- **`embed`**: 新增 `embed` 标准库包，提供了访问嵌入文件的方法。
- **`io/ioutil` 弃用**: `io/ioutil` 包被标记为弃用（虽然仍可使用，但建议迁移）。其功能已迁移到 `io` 和 `os` 包中：
  - `ioutil.Discard` -> `io.Discard`
  - `ioutil.NopCloser` -> `io.NopCloser`
  - `ioutil.ReadAll` -> `io.ReadAll`
  - `ioutil.ReadDir` -> `os.ReadDir` (返回 `os.DirEntry` 切片)
  - `ioutil.ReadFile` -> `os.ReadFile`
  - `ioutil.WriteFile` -> `os.WriteFile`
  - `ioutil.TempDir` -> `os.MkdirTemp`
  - `ioutil.TempFile` -> `os.CreateTemp`
- **`os/signal`**: 新增 `NotifyContext` 函数，创建一个在接收到信号时取消的 Context。
- **`path/filepath`**: 新增 `WalkDir` 函数，比 `Walk` 更高效（避免了对每个文件调用 `os.Lstat`）。
- **`net/http`**: `SameSite` cookie 属性默认行为调整。
- **`strconv`**: `ParseFloat` 使用了更快的 Eisel-Lemire 算法。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.16 Release Notes](https://go.dev/doc/go1.16)
