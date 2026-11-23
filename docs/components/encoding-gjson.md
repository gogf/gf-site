# 通用编解码-gjson

`gjson` 模块实现了强大的数据编码/解析功能，支持数据层级检索、动态创建修改 `Json` 对象，并支持常见数据格式的解析和转换等特点。

特点：

1. 支持数据层级检索；
2. 支持运行时数据修改；
3. 支持动态创建层级数据结构，并转换为支持的数据格式；
4. 支持 `JSON`、 `XML`、 `INI`、 `YAML/YML`、 `TOML`、 `PROPERTIES`、 `Struct` 数据格式相互转换；

**说明**

需要注意 `gjson` 包支持多种数据格式的读取、写入和转换，不仅仅针对 `json` 格式。

## **使用方式**：

```go
import "github.com/gogf/gf/v2/encoding/gjson"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson)

## 相关文档

子页面：

- [通用编解码-对象创建](https://goframe.org/docs/components/encoding-gjson-creation.md)
- [通用编解码-层级访问](https://goframe.org/docs/components/encoding-gjson-nested-visiting.md)
- [通用编解码-Struct转换](https://goframe.org/docs/components/encoding-gjson-struct-converting.md)
- [通用编解码-动态创建修改](https://goframe.org/docs/components/encoding-gjson-dynamic-creating-and-editing.md)
- [通用编解码-数据格式转换](https://goframe.org/docs/components/encoding-gjson-format-converting.md)
- [通用编解码-方法介绍](https://goframe.org/docs/components/encoding-gjson-funcs.md)
- [通用编解码-FAQ](https://goframe.org/docs/components/encoding-gjson-faq.md)

> 页面: https://goframe.org/docs/components/encoding-gjson
