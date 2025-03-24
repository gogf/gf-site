---
slug: '/docs/core/gconv-converter'
title: 'Type Conversion - Converter'
sidebar_position: 6000
hide_title: true
keywords: ['GoFrame', 'GoFrame framework', 'Type Conversion', 'Converter', 'Conversion Object', 'Strict Conversion', 'Error Handling', 'Custom Conversion', 'Type Conversion Interface']
description: 'Implement rigorous type conversion using the gconv.Converter interface in the GoFrame framework, supporting error handling, custom conversion rules, and type registration. Compared to traditional gconv package methods, Converter provides stricter type checking and error handling mechanisms, suitable for scenarios with high data accuracy requirements.'
---

`gconv.Converter` is a type conversion interface newly added in `GoFrame v2.9`, which provides type conversion capabilities through the creation of conversion objects, offering a more rigorous and flexible type conversion mechanism. Unlike traditional `gconv` package methods, the `Converter` interface returns an error when conversion fails, rather than defaulting to zero or empty values.

**Features**:

1. **Rigorous Error Handling**: Returns error information when conversion fails, avoiding potential issues caused by silent failures
2. **Type Safety**: Provides stricter type checking, reducing runtime errors
3. **Extensibility**: Supports registering custom type conversion functions, adapting to complex business scenarios
4. **Consistent API**: All conversion methods follow the same pattern, making usage more consistent
5. **Independent Instances**: Multiple converter instances can be created, each with different configurations and registered conversion functions

## Basic Introduction

The `Converter` interface is a composite interface that includes multiple sub-interfaces, providing comprehensive type conversion capabilities:

```go
type Converter interface {
	ConverterForConvert
	ConverterForRegister
	ConverterForInt
	ConverterForUint
	ConverterForTime
	ConverterForFloat
	ConverterForMap
	ConverterForSlice
	ConverterForStruct
	ConverterForBasic
}
```

These sub-interfaces provide different types of conversion functions, for example:

- `ConverterForBasic`: Basic type conversion (string, boolean, etc.)
- `ConverterForInt`: Integer type conversion
- `ConverterForUint`: Unsigned integer type conversion
- `ConverterForFloat`: Floating-point type conversion
- `ConverterForTime`: Time type conversion
- `ConverterForMap`: Map type conversion
- `ConverterForSlice`: Slice type conversion
- `ConverterForStruct`: Struct type conversion
- `ConverterForConvert`: Custom type conversion
- `ConverterForRegister`: Register custom conversion functions

## Creating a Converter Object

Use the `gconv.NewConverter()` function to create a new `Converter` object:

```go
converter := gconv.NewConverter()
```

## Basic Usage

### Basic Type Conversion

```go
package main

import (
	"fmt"

	"github.com/gogf/gf/v2/util/gconv"
)

func main() {
	// Create a converter object
	converter := gconv.NewConverter()

	// Integer conversion
	intValue, err := converter.Int("123")
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Println("Int conversion result:", intValue) // Output: 123
	}

	// Floating-point conversion
	floatValue, err := converter.Float64("123.456")
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Println("Float64 conversion result:", floatValue) // Output: 123.456
	}

	// Boolean conversion
	boolValue, err := converter.Bool("true")
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Println("Bool conversion result:", boolValue) // Output: true
	}

	// String conversion
	strValue, err := converter.String(123)
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Println("String conversion result:", strValue) // Output: 123
	}
}
```

### Struct Conversion

```go
package main

import (
	"fmt"
    
	"github.com/gogf/gf/v2/util/gconv"
)

type User struct {
	Id   int
	Name string
	Age  int
}

func main() {
	converter := gconv.NewConverter()

	// Map to struct conversion
	data := map[string]interface{}{
		"id":   1,
		"name": "John",
		"age":  30,
	}

	var user User
	err := converter.Struct(data, &user, gconv.StructOption{})
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Printf("Struct conversion result: %+v\n", user) // Output: {Id:1 Name:John Age:30}
	}
}
```

### Custom Type Conversion

> **Note**: Custom type conversion is primarily used for conversion between complex types (such as structs, slices, maps, etc.), and does not support alias types of basic types. This is to improve conversion efficiency and avoid unnecessary performance overhead.

Here is an example of custom conversion using complex types:

```go
package main

import (
	"fmt"
	"time"

	"github.com/gogf/gf/v2/util/gconv"
)

// UserInfo custom type
type UserInfo struct {
	ID       int
	Name     string
	Birthday time.Time
}

type UserDTO struct {
	UserID   string
	UserName string
	Age      int
}

func userInfoT2UserDTO(in UserInfo) (*UserDTO, error) {
	if in.ID <= 0 {
		return nil, fmt.Errorf("invalid user ID: %d", in.ID)
	}
	// Calculate age
	age := time.Now().Year() - in.Birthday.Year()
	return &UserDTO{
		UserID:   fmt.Sprintf("U%d", in.ID),
		UserName: in.Name,
		Age:      age,
	}, nil
}

func main() {
	converter := gconv.NewConverter()
	// Register custom type conversion function - from UserInfo to UserDTO
	err := converter.RegisterTypeConverterFunc(userInfoT2UserDTO)
	if err != nil {
		fmt.Println("Failed to register conversion function:", err)
		return
	}

	// Use custom type conversion
	userInfo := UserInfo{
		ID:       101,
		Name:     "Zhang San",
		Birthday: time.Date(1990, 5, 15, 0, 0, 0, 0, time.Local),
	}

	var userDTO UserDTO
	err = converter.Scan(userInfo, &userDTO)
	if err != nil {
		fmt.Println("Conversion failed:", err)
	} else {
		fmt.Printf("Custom type conversion result: %#v\n", userDTO)
		// Output similar to: Custom type conversion result: main.UserDTO{UserID:"U101", UserName:"Zhang San", Age:35}
	}

	// Test error handling
	invalidUser := UserInfo{ID: -1, Name: "Invalid User"}
	err = converter.Scan(invalidUser, &userDTO)
	if err != nil {
		fmt.Println("Expected error:", err) // Output error message: invalid user ID: -1
	}
}
```

In the example above, we defined two complex types: `UserInfo` (source type) and `UserDTO` (target type), and registered a custom conversion function to convert `UserInfo` to `UserDTO`. This conversion is not just simple field mapping but also includes business logic (such as calculating age).

For more information about custom type conversion, please refer to the chapter: [Type Conversion-Custom Type Conversion](./类型转换-自定义类型转换.md)

## Differences from Traditional `gconv` Package Methods

### Error Handling

Traditional `gconv` package methods default to returning zero or empty values when conversion fails, without returning error information:

```go
// Traditional method
value := gconv.Int("not-a-number") // Returns 0, no error

// Converter method
converter := gconv.NewConverter()
value, err := converter.Int("not-a-number") // Returns 0 and error information
```

### Conversion Options

The methods of the `Converter` interface support more conversion option parameters, allowing for more fine-grained control of conversion behavior:

```go
// Struct conversion options
structOption := gconv.StructOption{
    Mapping:           map[string]string{"ID": "UserId"},
    RecursiveOption:   gconv.RecursiveOptionTrue,
    ContinueOnError:   false,
    PrivateAttribute:  true,
}

// Use options for conversion
converter.Struct(data, &user, structOption)
```
