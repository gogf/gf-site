---
slug: '/docs/components/crypto-gdes'
title: 'DES算法-gdes'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,DES算法,gdes,crypto,encryption,PKCS5PADDING,NOPADDING,三倍长DES,密钥]
description: '本文档详细介绍了在GoFrame框架中使用DES算法的方式，展示了如何通过gdes包实现加密操作。通过链接至官方接口文档以便开发者获取更多技术细节。在包中支持两种补位方式，并对三倍长DES算法的密钥使用进行了特殊说明，以确保数据安全性。'
---

DES算法。

**使用方式**：

```go
import "github.com/gogf/gf/v2/crypto/gdes"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes)

**关于 `gdes` 包中的补位说明：**

**`gdes` 包中补位方式支持： `PKCS5PADDING`、 `NOPADDING` 两种方式，当使用 `NOPADDING` 方式时需要自定义补位方法。**

**关于gdes包中的密钥的说明：**

**当使用三倍长的DES算法时，密钥为16字节时，key3等于key1。**