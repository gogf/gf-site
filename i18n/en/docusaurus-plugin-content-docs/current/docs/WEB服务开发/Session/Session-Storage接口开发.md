---
slug: '/docs/web/session-storage'
title: 'Session - Storage Interface'
sidebar_position: 4
hide_title: true
keywords: [GoFrame, GoFrame Framework, gsession, Session-Storage, custom storage, interface development, Storage interface, TTL, gmap, session management]
description: "Developing Session-Storage interfaces using the gsession component in the GoFrame framework. The built-in Storage implementation within the component can meet the needs of most business scenarios. Developers can also customize session storage according to specific cases. The article describes in detail the definition of the Storage interface and its invocation timing. To improve session performance, it is recommended to use the gmap container type. This guide will help developers better implement and optimize storage interfaces."
---

In most scenarios, the common `Storage` implementations provided by the built-in `gsession` component are sufficient to meet requirements. If there are special scenarios that require the customization of `Storage`, it is certainly supported, as the functionality of `gsession` is designed with interfaces in mind.

## Storage Definition

[https://github.com/gogf/gf/blob/master/os/gsession/gsession_storage.go](https://github.com/gogf/gf/blob/master/os/gsession/gsession_storage.go)

```go
// Storage is the interface definition for session storage.
type Storage interface {
    // New creates a custom session id.
    // This function can be used for custom session creation.
    New(ctx context.Context, ttl time.Duration) (id string, err error)

    // Get retrieves and returns session value with given key.
    // It returns nil if the key does not exist in the session.
    Get(ctx context.Context, id string, key string) (value interface{}, err error)

    // GetMap retrieves all key-value pairs as map from storage.
    GetMap(ctx context.Context, id string) (data map[string]interface{}, err error)

    // GetSize retrieves and returns the size of key-value pairs from storage.
    GetSize(ctx context.Context, id string) (size int, err error)

    // Set sets one key-value session pair to the storage.
    // The parameter `ttl` specifies the TTL for the session id.
    Set(ctx context.Context, id string, key string, value interface{}, ttl time.Duration) error

    // SetMap batch sets key-value session pairs as map to the storage.
    // The parameter `ttl` specifies the TTL for the session id.
    SetMap(ctx context.Context, id string, data map[string]interface{}, ttl time.Duration) error

    // Remove deletes key with its value from storage.
    Remove(ctx context.Context, id string, key string) error

    // RemoveAll deletes all key-value pairs from storage.
    RemoveAll(ctx context.Context, id string) error

    // GetSession returns the session data as `*gmap.StrAnyMap` for given session id from storage.
    //
    // The parameter `ttl` specifies the TTL for this session.
    // The parameter `data` is the current old session data stored in memory,
    // and for some storage it might be nil if memory storage is disabled.
    //
    // This function is called ever when session starts. It returns nil if the TTL is exceeded.
    GetSession(ctx context.Context, id string, ttl time.Duration, data *gmap.StrAnyMap) (*gmap.StrAnyMap, error)

    // SetSession updates the data for specified session id.
    // This function is called ever after session, which is changed dirty, is closed.
    // This copy all session data map from memory to storage.
    SetSession(ctx context.Context, id string, data *gmap.StrAnyMap, ttl time.Duration) error

    // UpdateTTL updates the TTL for specified session id.
    // This function is called ever after session, which is not dirty, is closed.
    UpdateTTL(ctx context.Context, id string, ttl time.Duration) error
}
```

The timing of each method's invocation is explained in detail within the comments, and developers can fully refer to the several built-in `Storage` implementations when implementing custom `Storage`.

## Considerations

- In the `Storage` interface, not all interface methods need to be implemented. Developers only need to implement some interfaces according to the specific invocation timing required by their business needs.
- To enhance the execution performance of `Session`, the interface uses the `gmap.StrAnyMap` container type. During development, you can refer to this section: [Map](../../组件列表/数据结构/字典类型-gmap/字典类型-gmap.md)