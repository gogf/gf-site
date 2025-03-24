---
slug: '/docs/components/encoding-gjson'
title: '通用编解码-gjson'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,GoFrame框架,gjson,数据编码,数据解析,数据格式转换,JSON,XML,动态创建,数据层级检索]
description: 'GoFrame框架中的gjson模块，它提供了强大的数据编码和解析功能，支持多种数据格式的相互转换，包括JSON、XML、INI、YAML、TOML等。gjson模块特别适合需要进行数据层级检索和动态创建或修改数据对象的场景，同时它还支持运行时的数据修改功能，是构建网站时的理想选择。'
---

`gjson` 模块实现了强大的数据编码/解析功能，支持数据层级检索、动态创建修改 `Json` 对象，并支持常见数据格式的解析和转换等特点。

特点：

1. 支持数据层级检索；
2. 支持运行时数据修改；
3. 支持动态创建层级数据结构，并转换为支持的数据格式；
4. 支持 `JSON`、 `XML`、 `INI`、 `YAML/YML`、 `TOML`、 `PROPERTIES`、 `Struct` 数据格式相互转换；
:::info
需要注意 `gjson` 包支持多种数据格式的读取、写入和转换，不仅仅针对 `json` 格式。
:::
## **使用方式**：

```go
import "github.com/gogf/gf/v2/encoding/gjson"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson)

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />