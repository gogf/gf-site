---
slug: '/docs/components/os-gctx'
title: 'Context'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame framework, gctx, context management, trace tracing, process initialization, context object, component API, New method, GetInitCtx]
description: "The basic concepts and common methods of the gctx component in the GoFrame framework. gctx is used to simplify trace tracing and context object management, facilitating process initialization and context operations. The main content includes how to create and obtain context objects that support trace tracing, as well as its application in processes and init packages. More detailed understanding of the actual application of gctx can be gained with example code and API documentation."
---

## Introduction

The `gctx` component implements encapsulation of context operations to simplify trace tracing and the management of process initialization context objects.

## Common Methods

Here are just a few common methods; for other methods, please refer to the component API documentation or source code.

### `New`

Used to create a context object with trace tracing capabilities.

### `GetInitCtx`

Used in the startup process or init package methods to obtain the current process's context object with trace tracing capabilities, and also for transferring trace tracing information between processes.