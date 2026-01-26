---
slug: '/docs/components/container-gring'
title: 'Concurrency-Safe Ring-gring'
sidebar_position: 9
hide_title: true
keywords: [Concurrency-Safe Ring,GoFrame,GoFrame Framework,gring,Ring Buffer,Circular Linked List,Concurrency Safety,Ring,Data Structure,Buffer]
description: 'The concurrency-safe ring gring in GoFrame framework, including basic features and use cases such as ring buffers and circular doubly linked lists. gring is used in low-level development scenarios like concurrency lock control and buffer control. It supports fixed-size ring structures where new values overwrite old ones when data exceeds capacity.'
---

## Basic Introduction

A ring structure with concurrency-safe switch support, implemented as a circular doubly linked list.

**Use Cases**:

The `ring` data structure is commonly used in low-level development scenarios such as: concurrency lock control, buffer control, circular buffers, sliding windows, etc. The characteristic of `ring` is that it must have a fixed size. When continuously appending data to the `ring`, if the data size exceeds the capacity, new values will overwrite old values.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/gring"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gring](https://pkg.go.dev/github.com/gogf/gf/v2/container/gring)

:::tip
`gring` supports chainable operations.
:::

## Generic Support

:::tip
Version requirement: `v2.10.0`
:::

Starting from `v2.10.0`, `gring` provides the generic type `TRing[T]`, offering type-safe ring queue operations.

### Basic Usage

Use `NewTRing[T]` to create a generic ring:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gring"
)

func main() {
    // Create an integer ring with capacity 10
    r := gring.NewTRing[int](10)
    
    // Add elements to the ring
    for i := 0; i < 5; i++ {
        r.Put(i)
    }
    
    fmt.Println("Len:", r.Len()) // Output: Len: 5
    fmt.Println("Cap:", r.Cap()) // Output: Cap: 10
    
    // Move to starting position and get value
    r.Move(-5)
    fmt.Println("Val:", r.Val()) // Output: Val: 0
}
```

### Type Safety Advantages

The generic version provides compile-time type checking, avoiding type assertions:

```go
// Traditional approach (requires type assertion)
r := gring.New(10)
r.Put(1)
val := r.Val().(int) // Type assertion needed

// Generic approach (type-safe)
r := gring.NewTRing[int](10)
r.Put(1)
val := r.Val() // val is directly int type, no assertion needed
```

### Custom Type Example

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gring"
)

type Player struct {
    Position int    // Position
    Name     string // Name
    Alive    bool   // Is alive
}

func main() {
    // Create a player ring
    r := gring.NewTRing[*Player](10)
    
    // Add players
    for i := 1; i <= 10; i++ {
        r.Put(&Player{
            Position: i,
            Name:     fmt.Sprintf("Player%d", i),
            Alive:    true,
        })
    }
    
    // Traverse all players in the ring
    r.Move(-10) // Move to starting position
    r.RLockIteratorNext(func(player *Player) bool {
        fmt.Printf("Position: %d, Name: %s, Alive: %v\n", 
            player.Position, player.Name, player.Alive)
        return true
    })
}
```

### Concurrency-Safe Generic Ring

```go
package main

import (
    "fmt"
    "sync"
    "github.com/gogf/gf/v2/container/gring"
)

func main() {
    // Create a concurrency-safe generic ring
    r := gring.NewTRing[int](10, true)
    
    var wg sync.WaitGroup
    
    // Concurrent writes
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(n int) {
            defer wg.Done()
            r.Put(n * 10)
        }(i)
    }
    
    wg.Wait()
    
    fmt.Println("Len:", r.Len())
    fmt.Println("Values:", r.SliceNext())
}
```

### Common Methods for Generic Ring

Generic ring `TRing[T]` provides the following common methods:

| Method | Description |
| --- | --- |
| `Val() T` | Get the element value at current position, no type assertion needed |
| `Set(value T) *TRing[T]` | Set the value at current position |
| `Put(value T) *TRing[T]` | Set the value at current position and move to next position |
| `Len() int` | Get the number of used elements in the ring |
| `Cap() int` | Get the capacity of the ring |
| `Move(n int) *TRing[T]` | Move n positions |
| `Next() *TRing[T]` | Move to next position |
| `Prev() *TRing[T]` | Move to previous position |
| `Link(s *TRing[T]) *TRing[T]` | Link two rings |
| `Unlink(n int) *TRing[T]` | Remove n elements from the ring |
| `SliceNext() []T` | Get all elements slice from current position forward |
| `SlicePrev() []T` | Get all elements slice from current position backward |
| `RLockIteratorNext(f func(value T) bool)` | Iterate forward (read lock) |
| `RLockIteratorPrev(f func(value T) bool)` | Iterate backward (read lock) |

### Type-Safe Iteration

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gring"
)

func main() {
    r := gring.NewTRing[string](5)
    words := []string{"GoFrame", "is", "awesome", "and", "powerful"}
    
    for _, word := range words {
        r.Put(word)
    }
    
    // Iterate forward - type-safe, no assertion needed
    r.Move(-5)
    r.RLockIteratorNext(func(word string) bool {
        fmt.Printf("Word: %s\n", word)
        return true
    })
}
```

## Performance Notes

- `gring` is implemented based on the standard library `container/ring`, with added concurrency-safe control and more utility methods
- Ring structure performs excellently in fixed-size buffer scenarios, avoiding frequent memory allocations
- The generic version provides better type safety while maintaining the same performance
- Recommended for use in scenarios requiring circular buffers, sliding windows, etc.
