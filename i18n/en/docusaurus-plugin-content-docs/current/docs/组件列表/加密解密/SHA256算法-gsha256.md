---
slug: '/docs/components/crypto-gsha256'
title: 'SHA256 Algorithm-gsha256'
hide_title: true
keywords: [GoFrame,GoFrame Framework,SHA256 Algorithm,Hash Calculation,gsha256,HMAC-SHA256,Data Digest,Cryptographic Hash,Data Integrity]
description: 'Using SHA256 algorithm for hash calculation in GoFrame framework. The gsha256 component provides complete SHA256 hash functionality, supporting hash calculation for strings, byte arrays, and files, as well as HMAC-SHA256 signature verification, suitable for data integrity verification, password storage, digital signatures and other scenarios.'
---

## Basic Introduction

The `gsha256` component provides a complete implementation of the `SHA-256` hash algorithm for generating `256-bit (32-byte)` hash values of data. This component is available starting from `v2.10.0`.

### Main Features

1. **String Hashing**: Calculate `SHA-256` hash values of strings
2. **Byte Array Hashing**: Calculate `SHA-256` hash values of byte arrays
3. **File Hashing**: Calculate `SHA-256` hash values of file contents
4. **HMAC Signing**: Supports `HMAC-SHA256` message authentication code
5. **Multiple Output Formats**: Supports hexadecimal string and raw byte output

### Application Scenarios

1. **Data Integrity Verification**: Verify whether data has been tampered with during transmission or storage
2. **Password Storage**: Store password hash values rather than plaintext (recommended with salt)
3. **File Verification**: Generate and verify digital fingerprints of files
4. **Digital Signatures**: As the hash part of signature algorithms
5. **Blockchain Applications**: Calculate block hash values
6. **API Signature Verification**: Use `HMAC-SHA256` to verify the authenticity of `API` requests

## Usage

```go
import "github.com/gogf/gf/v2/crypto/gsha256"
```

## API Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gsha256](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gsha256)

## Basic Usage

### String Hashing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    // Calculate SHA-256 hash of string
    text := "Hello, GoFrame!"
    hash := gsha256.Encrypt(text)
    fmt.Println("SHA-256 Hash:", hash)
    // Output: SHA-256 Hash: 8b3d9c5e1a2f4b8d... (64 hexadecimal characters)
}
```

### Byte Array Hashing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    // Calculate SHA-256 hash of byte array
    data := []byte("Hello, GoFrame!")
    hash := gsha256.EncryptBytes(data)
    fmt.Printf("SHA-256 Hash: %x\n", hash)
    // Output: 32-byte hash value
}
```

### File Hashing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    // Calculate SHA-256 hash of file
    filePath := "/path/to/file.txt"
    hash, err := gsha256.EncryptFile(filePath)
    if err != nil {
        panic(err)
    }
    fmt.Println("File SHA-256 Hash:", hash)
}
```

### HMAC-SHA256 Signing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    // Generate HMAC-SHA256 signature using key
    data := "Hello, GoFrame!"
    key := "my-secret-key"
    
    // Generate HMAC signature
    signature := gsha256.MustEncryptHmac(data, key)
    fmt.Println("HMAC-SHA256 Signature:", signature)
    
    // Verify signature (compare hash values)
    expectedSignature := gsha256.MustEncryptHmac(data, key)
    if signature == expectedSignature {
        fmt.Println("Signature is valid!")
    }
}
```

### Byte-Form HMAC Signing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    data := []byte("Hello, GoFrame!")
    key := []byte("my-secret-key")
    
    // Generate byte-form HMAC signature
    signature := gsha256.MustEncryptHmacBytes(data, key)
    fmt.Printf("HMAC-SHA256 Signature: %x\n", signature)
    // Output: 32-byte signature value
}
```

## Practical Application Examples

### Password Hash Storage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
    "github.com/gogf/gf/v2/util/grand"
)

func main() {
    // User password
    password := "myPassword123"
    
    // Generate random salt
    salt := grand.S(16)
    
    // Calculate hash of password+salt
    passwordHash := gsha256.Encrypt(password + salt)
    
    fmt.Println("Salt:", salt)
    fmt.Println("Password Hash:", passwordHash)
    
    // Store salt and passwordHash to database
    
    // When verifying password
    inputPassword := "myPassword123"
    computedHash := gsha256.Encrypt(inputPassword + salt)
    
    if computedHash == passwordHash {
        fmt.Println("Password is correct!")
    } else {
        fmt.Println("Password is incorrect!")
    }
}
```

### File Integrity Verification

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
    "github.com/gogf/gf/v2/os/gfile"
)

func main() {
    filePath := "/path/to/important/file.dat"
    
    // Calculate hash of original file
    originalHash, err := gsha256.EncryptFile(filePath)
    if err != nil {
        panic(err)
    }
    fmt.Println("Original Hash:", originalHash)
    
    // Save hash for subsequent verification
    gfile.PutContents(filePath+".sha256", originalHash)
    
    // Later verify file integrity
    currentHash, err := gsha256.EncryptFile(filePath)
    if err != nil {
        panic(err)
    }
    
    savedHash := gfile.GetContents(filePath + ".sha256")
    
    if currentHash == savedHash {
        fmt.Println("File integrity verified!")
    } else {
        fmt.Println("File has been modified!")
    }
}
```

### API Request Signing

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/util/gconv"
    "sort"
    "strings"
)

func main() {
    // API request parameters
    params := map[string]interface{}{
        "user_id":   "12345",
        "timestamp": "1609459200",
        "action":    "get_user_info",
    }
    
    // API secret key
    apiSecret := "my-api-secret-key"
    
    // Generate signature
    signature := generateSignature(params, apiSecret)
    fmt.Println("API Signature:", signature)
    
    // Verify signature
    receivedSignature := signature // Get from request
    computedSignature := generateSignature(params, apiSecret)
    
    if receivedSignature == computedSignature {
        fmt.Println("Signature is valid!")
    } else {
        fmt.Println("Signature is invalid!")
    }
}

// generateSignature generates API signature
func generateSignature(params map[string]interface{}, secret string) string {
    // 1. Sort parameters by key name
    keys := make([]string, 0, len(params))
    for k := range params {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    
    // 2. Concatenate parameter string
    var parts []string
    for _, k := range keys {
        parts = append(parts, fmt.Sprintf("%s=%s", k, gconv.String(params[k])))
    }
    signString := strings.Join(parts, "&")
    
    // 3. Generate signature using HMAC-SHA256
    return gsha256.MustEncryptHmac(signString, secret)
}
```

### Data Deduplication (Using Hash as Unique Identifier)

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/crypto/gsha256"
)

func main() {
    // Deduplicate large amounts of data using hash values
    seen := make(map[string]bool)
    
    data := []string{
        "data1",
        "data2",
        "data1", // Duplicate
        "data3",
        "data2", // Duplicate
    }
    
    var uniqueData []string
    
    for _, item := range data {
        // Calculate hash of data
        hash := gsha256.Encrypt(item)
        
        // Check if already exists
        if !seen[hash] {
            seen[hash] = true
            uniqueData = append(uniqueData, item)
        }
    }
    
    fmt.Println("Unique Data:", uniqueData)
    // Output: Unique Data: [data1 data2 data3]
}
```

## Important Notes

### SHA-256's Irreversibility

`SHA-256` is a one-way hash function, **it is impossible to restore original data from the hash value**. This makes it suitable for storing hash values of sensitive information (such as passwords), but not suitable for scenarios requiring recovery of original data.

### Password Storage Recommendations

For password storage, it is recommended to:

1. **Use Salt**: Generate a random salt for each password to prevent rainbow table attacks
2. **Use Dedicated Algorithms**: Consider using algorithms designed specifically for passwords like `bcrypt`, `scrypt`, or `Argon2`
3. **Multiple Hashing**: Can hash the result again (like `PBKDF2`), increasing the difficulty of cracking

### Collision Resistance

Although `SHA-256` has strong collision resistance (the difficulty of finding two different inputs that produce the same hash value is extremely high), in scenarios with extremely high security requirements, you can consider using `SHA-384` or `SHA-512`.

### Performance Considerations

- File hash calculation time is proportional to file size
- For large files, consider chunked calculation or asynchronous processing
- `HMAC` operations are slightly slower than regular hashing because additional key processing is required

## Comparison with Other Hash Algorithms

| Algorithm | Output Length | Security | Speed | Use Cases |
|-----------|--------------|----------|-------|-----------|
| `MD5` | `128 bits` | Broken | Fast | Only for non-security checksums |
| `SHA-1` | `160 bits` | Theoretically broken | Faster | Not recommended for security scenarios |
| **`SHA-256`** | **`256 bits`** | **Secure** | **Medium** | **Recommended for most scenarios** |
| `SHA-512` | `512 bits` | Very secure | Slightly slower | High security requirement scenarios |
