---
slug: '/docs/components/crypto-gdes'
title: 'DES'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame framework, DES algorithm, gdes, crypto, encryption, PKCS5PADDING, NOPADDING, Triple DES, key]
description: "The usage of the DES algorithm in the GoFrame framework, demonstrating how to perform encryption operations through the gdes package. Links to the official API documentation to allow developers to obtain more technical details. The package supports two padding methods and provides special instructions for the use of keys in the Triple DES algorithm to ensure data security."
---

DES Algorithm.

**Usage**:

```go
import "github.com/gogf/gf/v2/crypto/gdes"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes)

**About Padding in the `gdes` Package:**

**The `gdes` package supports padding methods: `PKCS5PADDING` and `NOPADDING`. When using `NOPADDING`, a custom padding method is required.**

**About Keys in the gdes Package:**

**When using the Triple DES algorithm, with a 16-byte key, key3 is equal to key1.**