---
applyTo: '**/golang/**.md'
---

# 发布说明规范

## 内容来源

编写发布说明时，主要内容应参考对应版本的 Go 官方 Release Notes，例如：

- Go 1.25：https://go.dev/doc/go1.25
- Go 1.24：https://go.dev/doc/go1.24
- Go 1: https://go.dev/doc/go1
- 以此类推，替换版本号即可获得对应版本的官方文档，没有的话通过 [Go 官方发布历史](https://go.dev/doc/devel/release) 查找。

## 文档结构规范

按照 Release Notes 更新内容，并按照 Release Notes 结构重新排版

并在最后添加 **`## 参考资源`** 统一放在每篇文档末尾，用于链接官方发布说明或相关 Issue/Proposal。
