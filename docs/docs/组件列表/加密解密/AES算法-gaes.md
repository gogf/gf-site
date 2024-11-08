---
slug: '/docs/components/crypto-gaes'
title: 'AES算法-gaes'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,GoFrame框架,AES算法,加解密,gaes,Go语言,数据编码,base64,加密解密指南,GoFrame教程]
description: '本文档介绍了如何在GoFrame框架中使用AES算法进行数据加解密。通过引入go包以及调用相关功能函数，用户可以实现安全的数据传输和存储。特别注意在加解密过程中如果数据经过其他编码如base64，则需要准确解码和编码，以确保数据的完整性和安全性。'
---

AES算法。

**使用方式**：

```go
import "github.com/gogf/gf/v2/crypto/gaes"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes)

**温馨提示：**

如果待解密数据经过其它编码，则要先解码再解密，如base64.decode

反过来也一样

如果希望加密完的数据编码，则将结果编码即可，如base64.encode