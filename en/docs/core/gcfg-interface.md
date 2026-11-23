# Configuration - Interface

The `gcfg` component adopts an interface design to achieve high scalability. Through interface design, users can customize configuration retrieval methods, such as `etcd, zookeeper, consul, kubernetes configmap, apollo`, etc.

## Interface Definition

[https://github.com/gogf/gf/blob/master/os/gcfg/gcfg\_adaper.go](https://github.com/gogf/gf/blob/master/os/gcfg/gcfg_adaper.go)

```go
// Adapter is the interface for configuration retrieving.
type Adapter interface {
    // Available checks and returns the configuration service is available.
    // The optional parameter `resource` specifies certain configuration resource.
    //
    // It returns true if configuration file is present in default AdapterFile, or else false.
    // Note that this function does not return error as it just does simply check for backend configuration service.
    Available(ctx context.Context, resource ...string) (ok bool)

    // Get retrieves and returns value by specified `pattern`.
    Get(ctx context.Context, pattern string) (value interface{}, err error)

    // Data retrieves and returns all configuration data as map type.
    // Note that this function may lead lots of memory usage if configuration data is too large,
    // you can implement this function if necessary.
    Data(ctx context.Context) (data map[string]interface{}, err error)
}
```

## Setting Interface Implementation

The configuration object can set the currently used interface implementation through the `SetAdapter` method.

```go
// SetAdapter sets the adapter of current Config object.
func (c *Config) SetAdapter(adapter Adapter)
```

## Retrieving Interface Implementation

The configuration object can retrieve the currently used interface implementation through the `GetAdapter` method.

```go
// GetAdapter returns the adapter of current Config object.
func (c *Config) GetAdapter() Adapter
```

## Documentation

Child pages:

- [Configuration - AdapterFile](https://goframe.org/en/docs/core/gcfg-interface-adapter-file.md)
- [Configuration - AdapterContent](https://goframe.org/en/docs/core/gcfg-interface-adapter-content.md)

> Page: https://goframe.org/en/docs/core/gcfg-interface
