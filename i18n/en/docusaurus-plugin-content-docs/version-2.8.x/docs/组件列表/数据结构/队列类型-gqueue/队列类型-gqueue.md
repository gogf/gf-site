---
slug: '/docs/components/container-gqueue'
title: 'Queue'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame framework, gqueue, queue, concurrency safe, dynamic queue, fixed queue, goroutine, data communication, Go language]
description: "The dynamic size concurrency-safe queue gqueue in the GoFrame framework supports both fixed and dynamic size queue features, achieving efficiency comparable to the standard library channel. gqueue is particularly suitable for data communication between multiple goroutines and provides developers with simple yet powerful concurrency handling capabilities."
---

## Introduction

A dynamic size concurrency-safe queue. At the same time, `gqueue` also supports fixed queue size, achieving efficiency comparable to the standard library's `channel` when using a fixed queue size.

**Usage Scenarios**:

This queue is concurrency safe and is often used in scenarios where multiple `goroutine` data communication and dynamic queue size are supported.

**How to Use**:

```go
import "github.com/gogf/gf/v2/container/gqueue"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gqueue](https://pkg.go.dev/github.com/gogf/gf/v2/container/gqueue)

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />