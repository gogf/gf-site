---
slug: '/docs/web/session'
title: 'Session'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,GoFrame framework,Session management,gsession,HTTP service,SessionId,Concurrency safety,ghttp.Request,gsession module,Session storage]
description: "The Session management features in the GoFrame framework, including the basic concepts of Session, the implementation of the gsession module, and its applications in different scenarios. The document discusses in detail the methods of SessionId transmission, initialization, destruction, and provides four common Session storage implementations and their characteristics, offering a rich set of tools for developers in Session management in HTTP and other service environments."
---

The `GoFrame` framework provides comprehensive `Session` management capabilities, implemented by the `gsession` component. Since the `Session` mechanism is most commonly used in `HTTP` services, the subsequent chapters will focus on the use of `Session` in the context of `HTTP` services.

## Introduction

API Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/os/gsession](https://pkg.go.dev/github.com/gogf/gf/v2/os/gsession)

You can obtain a `Session` object at any time through `ghttp.Request` since both `Cookie` and `Session` are related to request sessions and thus are part of the `Request` member objects and are publicly accessible. The default expiration time for `Session` in the `GoFrame` framework is `24 hours`.

The `SessionId` is transmitted by default through `Cookie`, but it also supports transmission via `Header` from the client. The identification name of `SessionId` can be modified through the `SetSessionIdName` of `ghttp.Server`. The operations of `Session` are concurrency-safe, which is why the framework does not operate data directly in a `map` form in its `Session` design. During the `HTTP` request flow, we can obtain the `Session` object through the `ghttp.Request` object and perform the corresponding data operations.

In addition, the `SessionId` in `ghttp.Server` is generated using the client's `RemoteAddr + Header` request information via the `guid` module, ensuring randomness and uniqueness: [https://github.com/gogf/gf/blob/master/net/ghttp/ghttp_request.go](https://github.com/gogf/gf/blob/master/net/ghttp/ghttp_request.go)

## `gsession` Module

The management functionality of `Session` is implemented by the independent `gsession` module and is perfectly integrated into `ghttp.Server`. Since this module is decoupled and independent, it can be applied to more different scenarios, such as `TCP` communication, `gRPC` API services, etc. The `gsession` module has three important objects/APIs:

1. `gsession.Manager`: Manages `Session` objects, `Storage` persistence storage objects, and expiration time control.
2. `gsession.Session`: A single `Session` management object, used for CRUD operations on `Session` parameters and other data management operations.
3. `gsession.Storage`: This is an API definition used for the persistent storage of `Session` objects, data writing/reading, and survival updates. Developers can implement customized persistent storage features based on this API. For the API definition, see: [https://github.com/gogf/gf/blob/master/os/gsession/gsession_storage.go](https://github.com/gogf/gf/blob/master/os/gsession/gsession_storage.go)

## Storage Implementations

`gsession` implements and provides developers with four common `Session` storage implementations:

| Storage | Distributed Support | Persistence Support | Memory Usage | Execution Efficiency | Brief Introduction |
| --- | --- | --- | --- | --- | --- |
| `StorageFile` | No | Yes | Medium | Medium | Based on file storage (default). A more efficient persistent storage method under single-node deployment: [Session - File](Session-File.md) |
| `StorageMemory` | No | No | High | High | Based on pure memory storage. Single-node deployment, highest performance, but cannot be persisted, and is lost on restart: [Session - Memory](Session-Memory.md) |
| `StorageRedis` | Yes | Yes | Medium | Medium | Based on `Redis` storage (`Key-Value`). Remote `Redis` node stores `Session` data, supporting multi-node deployment: [Session - Redis-KeyValue](Session-Redis-KeyValue.md) |
| `StorageRedisHashTable` | Yes | Yes | Low | Low | Based on `Redis` storage (`HashTable`). Remote `Redis` node stores `Session` data, supporting multi-node deployment: [Session - Redis-HashTable](Session-Redis-HashTable.md) |

Each method has its advantages and disadvantages. For detailed introductions, please refer to the corresponding sections.

## Initialization of `Session`

Taking a common HTTP request as an example, the `Session` object in `ghttp.Request` adopts a "**Lazy Initialization**" design approach. By default, there is a `Session` property object in the `Request`, but it is not initialized (an empty object). The initialization is only executed when methods of the `Session` property object are used. This design ensures that the execution performance of requests not utilizing the `Session` feature is maintained, while also ensuring the ease of use of the component.

## Destruction/Logout of `Session`

When a user's `Session` is no longer needed, for instance, when a user logs out, the session needs to be hard-deleted from storage. This can be done by calling the `RemoveAll` method.

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />