---
slug: '/docs/components/os-gfsnotify'
title: 'File Watching'
sidebar_position: 13
hide_title: true
keywords: [GoFrame, GoFrame framework, gfsnotify, file watching, Go framework, file operations, watching module, Go development, system watching, directory watching]
description: "Use the gfsnotify module in the GoFrame framework to implement the watching of files and directories. gfsnotify can detect changes such as addition, deletion, modification, and renaming of files, and provides convenient interface functions like Add and Remove for watching and unwatching operations. Applicable to the inotify mechanism of *nix systems, and usage may be limited by system kernel parameters. Through example code, it demonstrates how to set, remove watching, and perform file operation watching."
---

## Introduction

`gfsnotify` can watch changes in specified files/directories, such as additions, deletions, modifications, and renaming of files.

**Usage:**

```go
import "github.com/gogf/gf/v2/os/gfsnotify"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify)

It is recommended to use the `Add` and `Remove` module methods provided by the `gfsnotify` module for adding and canceling watching. The reasons for this recommendation are explained in the following sections.

Additionally, you can also create a watching management object using the `New` method and then perform watching management. When adding watching, you need to provide a callback function that triggers during watching, with the parameter type being a `*gfsnotify.Event` object pointer.

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />