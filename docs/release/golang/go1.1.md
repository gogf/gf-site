---
title: Go 1.1 (2013-05-13)
sidebar_position: 199
---

## 主要变化

### 性能提升

Go 1.1 在编译器、垃圾回收器、Map 实现和网络库等方面进行了大量优化，性能普遍提升 30%-40%。

### 语言特性

- **Method Values**：支持将特定接收者的方法赋值给变量作为函数值

  ```go
  w := os.Stdout
  f := w.Write // f 是一个函数，绑定了 w
  f([]byte("hello"))
  ```

- **整数除零**：整数除以常量 0 现在是编译错误（之前是运行时 panic）
- **Return 语句**：放宽了函数末尾必须有 `return` 的限制，只要所有执行路径都有终止语句即可

### 工具链与运行时

- **Race Detector**：引入数据竞争检测工具，通过 `go test -race` 可在运行时检测并发读写问题
- **int 类型**：在 64 位平台上，`int` 和 `uint` 从 32 位变为 64 位，支持超过 20 亿元素的切片
- **堆大小**：64 位平台上的最大堆大小显著增加，支持数十 GB 的内存使用

### 标准库

- **`bufio.Scanner`**：提供简单易用的接口来读取数据流

  ```go
  scanner := bufio.NewScanner(os.Stdin)
  for scanner.Scan() {
      fmt.Println(scanner.Text()) // 逐行读取
  }
  ```

- **`reflect`**：功能大幅增强，支持 `MakeFunc`、`Select`、`ChanOf`、`MapOf` 和 `SliceOf` 等
- **`time`**：在 Linux、FreeBSD、OS X 等系统上，时间精度从微秒提升到纳秒

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.1 Release Notes](https://go.dev/doc/go1.1)
