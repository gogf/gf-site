---
slug: '/docs/components/crypto-grsa'
title: 'RSA Algorithm-grsa'
hide_title: true
keywords: [GoFrame,GoFrame Framework,RSA Algorithm,Encryption and Decryption,grsa,Public Key Encryption,Private Key Decryption,Digital Signature,PKCS1,PKCS8,OAEP]
description: 'Using RSA algorithm for encryption and decryption in GoFrame framework. The grsa component provides complete RSA encryption support, including key pair generation, public key encryption, private key decryption, multiple padding modes (PKCS1, OAEP), and key formats (PEM, DER, Base64), suitable for secure data transmission and digital signature scenarios.'
---

## Basic Introduction

The `grsa` component provides a complete implementation of the `RSA` asymmetric encryption algorithm, supporting key pair generation, data encryption and decryption. This component is available starting from `v2.10.0`.

### Main Features

1. **Key Pair Generation**: Supports generating key pairs in `PKCS#1` and `PKCS#8` formats
2. **Multiple Encryption Modes**: Supports both `PKCS#1 v1.5` and `OAEP` padding modes
3. **Flexible Key Formats**: Supports multiple formats including `PEM`, `DER`, `Base64`
4. **Automatic Format Detection**: Automatically recognizes and processes keys in different formats
5. **Security Considerations**: Provides the recommended `OAEP` padding mode while maintaining backward compatibility

### Security Recommendations

The component provides two padding schemes:

1. **PKCS#1 v1.5 (Traditional)**: Used by functions like `Encrypt*`, `DecryptPKCS1*`, `DecryptPKCS8*`. This scheme is considered less secure and vulnerable to padding oracle attacks, but is still provided for backward compatibility.

2. **OAEP (Recommended)**: Used by functions like `EncryptOAEP*`, `DecryptOAEP*`. `OAEP` (Optimal Asymmetric Encryption Padding) is the recommended padding scheme for new applications, providing better security guarantees.

**For new projects, it is recommended to prioritize using OAEP functions (`EncryptOAEP`, `DecryptOAEP`, etc.).**

## Usage

```go
import "github.com/gogf/gf/v2/crypto/grsa"
```

## API Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/grsa](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/grsa)

## Basic Usage

### Key Pair Generation

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate default 2048-bit PKCS#1 format key pair
    privateKey, publicKey, err := grsa.GenerateDefaultKeyPair()
    if err != nil {
        panic(err)
    }
    
    fmt.Println("Private Key:", string(privateKey))
    fmt.Println("Public Key:", string(publicKey))
    
    // Generate key pair with specified bit length in PKCS#1 format
    privateKey, publicKey, err = grsa.GenerateKeyPair(4096)
    if err != nil {
        panic(err)
    }
    
    // Generate PKCS#8 format key pair
    privateKey, publicKey, err = grsa.GenerateKeyPairPKCS8(2048)
    if err != nil {
        panic(err)
    }
}
```

### Basic Encryption/Decryption (PKCS#1 v1.5)

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate key pair
    privateKey, publicKey, err := grsa.GenerateDefaultKeyPair()
    if err != nil {
        panic(err)
    }
    
    // Data to encrypt
    plainText := []byte("Hello, GoFrame!")
    
    // Encrypt with public key (automatic format detection)
    cipherText, err := grsa.Encrypt(plainText, publicKey)
    if err != nil {
        panic(err)
    }
    fmt.Println("Encrypted:", cipherText)
    
    // Decrypt with private key (automatic format detection)
    decrypted, err := grsa.Decrypt(cipherText, privateKey)
    if err != nil {
        panic(err)
    }
    fmt.Println("Decrypted:", string(decrypted))
}
```

### OAEP Encryption/Decryption (Recommended)

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate key pair
    privateKey, publicKey, err := grsa.GenerateDefaultKeyPair()
    if err != nil {
        panic(err)
    }
    
    // Data to encrypt
    plainText := []byte("Hello, GoFrame!")
    
    // Encrypt using OAEP mode (recommended)
    cipherText, err := grsa.EncryptOAEP(plainText, publicKey)
    if err != nil {
        panic(err)
    }
    fmt.Println("Encrypted with OAEP:", cipherText)
    
    // Decrypt using OAEP mode
    decrypted, err := grsa.DecryptOAEP(cipherText, privateKey)
    if err != nil {
        panic(err)
    }
    fmt.Println("Decrypted:", string(decrypted))
}
```

### Base64 Encoding Support

```go
package main

import (
    "encoding/base64"
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate key pair
    privateKey, publicKey, err := grsa.GenerateDefaultKeyPair()
    if err != nil {
        panic(err)
    }
    
    // Convert keys to Base64 format (convenient for storage and transmission)
    privateKeyBase64 := base64.StdEncoding.EncodeToString(privateKey)
    publicKeyBase64 := base64.StdEncoding.EncodeToString(publicKey)
    
    // Data to encrypt
    plainText := []byte("Hello, GoFrame!")
    
    // Encrypt with Base64 format public key, returns Base64 format ciphertext
    cipherTextBase64, err := grsa.EncryptBase64(plainText, publicKeyBase64)
    if err != nil {
        panic(err)
    }
    fmt.Println("Encrypted (Base64):", cipherTextBase64)
    
    // Decrypt Base64 format ciphertext with Base64 format private key
    decrypted, err := grsa.DecryptBase64(cipherTextBase64, privateKeyBase64)
    if err != nil {
        panic(err)
    }
    fmt.Println("Decrypted:", string(decrypted))
}
```

### Encryption with Specified Key Format

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate key pairs in different formats
    privateKeyPKCS1, publicKeyPKCS1, _ := grsa.GenerateKeyPair(2048)
    
    // Generate PKCS#8 format key pair
    privateKeyPKCS8, publicKeyPKCS8, _ := grsa.GenerateKeyPairPKCS8(2048)
    
    plainText := []byte("Hello, GoFrame!")
    
    // Encrypt with PKCS#1 format public key
    cipherText1, _ := grsa.EncryptPKCS1(plainText, publicKeyPKCS1)
    decrypted1, _ := grsa.DecryptPKCS1(cipherText1, privateKeyPKCS1)
    fmt.Println("PKCS#1:", string(decrypted1))
    
    // Encrypt with PKCS#8 format public key
    cipherText2, _ := grsa.EncryptPKCS8(plainText, publicKeyPKCS8)
    decrypted2, _ := grsa.DecryptPKCS8(cipherText2, privateKeyPKCS8)
    fmt.Println("PKCS#8:", string(decrypted2))
    
    // Encrypt with PKIX format public key (standard format)
    cipherText3, _ := grsa.EncryptPKIX(plainText, publicKeyPKCS8)
    decrypted3, _ := grsa.DecryptPKCS8(cipherText3, privateKeyPKCS8)
    fmt.Println("PKIX:", string(decrypted3))
}
```

### Key Type Detection

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/grsa"
)

func main() {
    // Generate keys in different formats
    privateKeyPKCS1, _, _ := grsa.GenerateKeyPair(2048)
    privateKeyPKCS8, _, _ := grsa.GenerateKeyPairPKCS8(2048)
    
    // Detect key types
    keyType1, _ := grsa.GetPrivateKeyType(privateKeyPKCS1)
    fmt.Println("Key Type 1:", keyType1) // Output: PKCS#1
    
    keyType2, _ := grsa.GetPrivateKeyType(privateKeyPKCS8)
    fmt.Println("Key Type 2:", keyType2) // Output: PKCS#8
}
```

## Important Notes

### Encrypted Data Size Limit

`RSA` encryption has limits on plaintext size, depending on key length and padding mode:

- **PKCS#1 v1.5 padding**: `Maximum plaintext length = key bytes - 11`
  - For example: `2048-bit` key can encrypt up to `245 bytes`
- **OAEP padding**: `Maximum plaintext length = key bytes - 2 * hash length - 2`
  - For example: `2048-bit` key using `SHA-256` can encrypt up to `190 bytes`

For encrypting large amounts of data, it's recommended to use hybrid encryption: use `RSA` to encrypt a symmetric key, and use the symmetric key (such as `AES`) to encrypt the actual data.

### Key Format Description

- **PKCS#1**: Traditional `RSA` key format, PEM header is `RSA PRIVATE KEY` and `RSA PUBLIC KEY`
- **PKCS#8**: Universal private key format, PEM header is `PRIVATE KEY`, public key format is `PKIX` (PEM header is `PUBLIC KEY`)
- The component's `Encrypt` and `Decrypt` methods can automatically recognize and handle both formats

### Security Recommendations

1. **Key Length**: Recommended to use at least 2048-bit keys, 4096-bit is more secure
2. **Padding Mode**: Use `EncryptOAEP` and `DecryptOAEP` for new projects
3. **Key Protection**: Private keys must be properly secured, do not hardcode in code
4. **Key Rotation**: Regularly rotate key pairs to improve security
5. **Certificate Verification**: In production applications, it's recommended to combine with digital certificates for identity verification
