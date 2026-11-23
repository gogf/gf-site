# Caching - Interface

The cache component adopts an interface design, providing the `Adapter` interface. Any object implementing the `Adapter` interface can be registered into the cache management object, allowing developers to flexibly customize and extend the cache management object.

## Interface Definition

The `Adapter` interface is defined as follows:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache#Adapter](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache#Adapter)

## Registering Interface Implementation

This method applies the implemented `adapter` to the corresponding `Cache` object:

```go
// SetAdapter changes the adapter for this cache.
// Be very note that, this setting function is not concurrent-safe, which means you should not call
// this setting function concurrently in multiple goroutines.
func (c *Cache) SetAdapter(adapter Adapter)
```

For specific examples, please refer to the [Caching - Redis](https://goframe.org/en/docs/core/gcache-redis.md) section.

## Obtaining Interface Implementation

This method retrieves the currently registered `adapter` interface implementation object:

```go
// GetAdapter returns the adapter that is set in current Cache.
func (c *Cache) GetAdapter() Adapter
```

For specific examples, please refer to the [Caching - Redis](https://goframe.org/en/docs/core/gcache-redis.md) section.

> Page: https://goframe.org/en/docs/core/gcache-interface
