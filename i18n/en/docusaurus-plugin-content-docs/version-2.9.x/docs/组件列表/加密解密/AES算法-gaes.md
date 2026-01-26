---
slug: '/docs/components/crypto-gaes'
title: 'AES'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, AES Algorithm, Encryption and Decryption, gaes, Go Language, Data Encoding, base64, Encryption and Decryption Guide, GoFrame Tutorial]
description: "Use AES algorithm for data encryption and decryption in the GoFrame framework. By importing the go package and calling related functional functions, users can achieve secure data transmission and storage. Pay special attention to accurately decoding and encoding if the data is encoded in other forms such as base64 during the encryption and decryption process to ensure data integrity and security."
---

AES Algorithm.

**Usage:**

```go
import "github.com/gogf/gf/v2/crypto/gaes"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes)

**Kind Reminder:**

If the data to be decrypted has been encoded in other forms, it should be decoded first before decryption, such as base64.decode

The same applies in reverse

If you wish to encode the encrypted data, you can simply encode the result, such as base64.encode