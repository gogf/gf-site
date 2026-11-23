# 链表类型-glist

## 基本介绍

带并发安全开关的双向列表。

**使用场景**：

双向链表。

**使用方式：**

```go
import "github.com/gogf/gf/v2/container/glist"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/glist](https://pkg.go.dev/github.com/gogf/gf/v2/container/glist)

**泛型支持**：

从 `v2.10` 版本开始，`glist` 提供了泛型链表类型：
- `TList[T]`：泛型双向链表，提供类型安全的链表操作
- 支持高效的首尾插入、删除操作
- 推荐在新项目中使用泛型链表，享受编译时类型检查带来的安全性

## 相关文档

子页面：

- [链表类型-基本使用](https://goframe.org/docs/components/container-glist-example.md)
- [链表类型-性能测试](https://goframe.org/docs/components/container-glist-benchmark.md)

> 页面: https://goframe.org/docs/components/container-glist
