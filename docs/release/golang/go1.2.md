---
title: Go 1.2 (2013-12-01)
sidebar_position: 198
---

## 主要变化

### 语言

- **三索引切片**：支持 `s[i:j:k]` 语法以指定新切片的容量，防止新切片访问原数组中超出指定容量的部分

  ```go
  // slice 的长度为 2 (4-2)，容量为 5 (7-2)
  slice = array[2:4:7]
  ```

- **Nil 指针安全**：语言规范明确保证对 nil 指针的解引用（访问字段、数组索引等）必定会触发 panic

### 工具链

- **调度器抢占**：调度器现在可以在函数调用时抢占 goroutine，防止死循环阻塞整个程序，实现了协作式抢占
- **测试覆盖率**：`go test` 新增 `-cover` 标志用于计算代码覆盖率，配合 `go tool cover` 可生成详细的 HTML 报告
- **线程限制**：运行时默认将最大操作系统线程数限制为 10,000，可通过 `debug.SetMaxThreads` 修改
- **栈大小调整**：goroutine 的初始栈大小从 4KB 增加到 8KB，减少栈分裂带来的性能开销

### 标准库

- **`encoding`**：新增 `encoding` 包，定义 `BinaryMarshaler`、`TextMarshaler` 等通用接口
- **`fmt`**：`Printf` 系列函数现在支持通过索引引用参数

  ```go
  fmt.Printf("%[2]d %[1]d\n", 11, 22) // 输出 "22 11"
  ```

- **`text/template`**：增加了 `eq`、`ne`、`lt`、`le`、`gt`、`ge` 等比较函数

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.2 Release Notes](https://go.dev/doc/go1.2)
