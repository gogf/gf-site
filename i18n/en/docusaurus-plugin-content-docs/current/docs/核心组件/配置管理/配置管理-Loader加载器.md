---
slug: '/docs/core/gcfg-loader'
title: 'Configuration - Loader'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,Configuration Management,Loader,Config Loader,Auto Binding,Config Watching,Type Safety,Generic Config,Spring Boot,ConfigurationProperties]
description: "The Loader configuration loader of the GoFrame framework provides functionality similar to Spring Boot's @ConfigurationProperties, supporting automatic configuration binding, configuration watching, and updates. Uses Go generics to implement type-safe configuration management, supporting custom converters and callback handling, making it a powerful tool for managing application configurations."
---

`Loader` is a universal configuration manager provided by the `gcfg` component, available starting from version `v2.10.0`. It provides configuration loading, monitoring, updating, and management functionality similar to Spring Boot's `@ConfigurationProperties`.

## Features

- **Generic Support**: Uses Go generics to provide type-safe configuration binding
- **Configuration Loading**: Loads data from configuration sources and automatically binds to structs
- **Configuration Monitoring**: Automatically monitors configuration changes and updates in real-time
- **Custom Converters**: Supports custom data conversion functions
- **Callback Handling**: Supports callback functions for configuration changes
- **Error Handling**: Provides flexible error handling mechanisms

## Basic Usage

### Method 1: Using Global Configuration Object

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

type AppConfig struct {
    Name     string       `json:"name"`
    Version  string       `json:"version"`
    Server   ServerConfig `json:"server"`
    Database DBConfig     `json:"database"`
}

type ServerConfig struct {
    Host string `json:"host"`
    Port int    `json:"port"`
}

type DBConfig struct {
    Host     string `json:"host"`
    Port     int    `json:"port"`
    Username string `json:"username"`
    Password string `json:"password"`
}

func main() {
    ctx := gctx.New()
    
    // Create Loader instance using global configuration
    loader := gcfg.NewLoader[AppConfig](g.Cfg(), "")
    
    // Load and watch configuration
    loader.MustLoadAndWatch(ctx, "app-config-watcher")
    
    // Get configuration
    config := loader.Get()
    fmt.Printf("Application Name: %s\n", config.Name)
    fmt.Printf("Server Address: %s:%d\n", config.Server.Host, config.Server.Port)
}
```

### Method 2: Using Independent Configuration Adapter

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

type AppConfig struct {
    Name     string       `json:"name"`
    Version  string       `json:"version"`
    Server   ServerConfig `json:"server"`
}

type ServerConfig struct {
    Host string `json:"host"`
    Port int    `json:"port"`
}

func main() {
    ctx := gctx.New()
    
    // Create independent configuration file adapter
    adapter, err := gcfg.NewAdapterFile("config.yaml")
    if err != nil {
        panic(err)
    }
    
    // Use adapter to create Loader
    loader := gcfg.NewLoaderWithAdapter[AppConfig](adapter, "")
    
    // Load and watch configuration
    loader.MustLoadAndWatch(ctx, "app-watcher")
    
    // Get configuration
    config := loader.Get()
    fmt.Printf("Application: %s v%s\n", config.Name, config.Version)
}
```

## Configuration File Example

Here is an example of the configuration file `config.yaml`:

```yaml
name: "MyApp"
version: "1.0.0"
server:
  host: "127.0.0.1"
  port: 8080
database:
  host: "localhost"
  port: 3306
  username: "root"
  password: "123456"
```

## Advanced Features

### Monitoring Specific Configuration Keys

If you only want to monitor a specific part of the configuration file, you can specify the `propertyKey` parameter:

```go
// Only monitor and load server configuration section
loader := gcfg.NewLoader[ServerConfig](g.Cfg(), "server")
loader.MustLoadAndWatch(ctx, "server-watcher")

config := loader.Get()
fmt.Printf("Server Configuration: %s:%d\n", config.Host, config.Port)
```

Corresponding configuration file:

```yaml
server:
  host: "127.0.0.1"
  port: 8080
database:
  host: "localhost"
  port: 3306
```

### Configuration Change Callback

When the configuration file changes, you can execute custom logic through a callback function:

```go
loader := gcfg.NewLoader[AppConfig](g.Cfg(), "")

// Set configuration change callback
loader.OnChange(func(updated AppConfig) error {
    fmt.Printf("Configuration updated, new application name: %s\n", updated.Name)
    
    // Additional logic can be executed here, such as:
    // - Reconnect to database
    // - Update cache
    // - Notify other services
    
    return nil
})

// Load and watch
loader.MustLoadAndWatch(ctx, "my-watcher")
```

### Custom Converter

If you need to perform custom processing on configuration data, you can set a converter:

```go
loader := gcfg.NewLoader[AppConfig](g.Cfg(), "")

// Set custom converter
loader.SetConverter(func(data any, target *AppConfig) error {
    // Custom conversion logic
    // For example: decrypt encrypted configuration items, format special fields, etc.
    
    // Use default conversion
    if err := gconv.Scan(data, target); err != nil {
        return err
    }
    
    // Additional processing
    if target.Server.Port == 0 {
        target.Server.Port = 8080 // Set default port
    }
    
    return nil
})

loader.MustLoadAndWatch(ctx, "custom-converter-watcher")
```

### Error Handling

During monitoring, if configuration loading fails, you can handle it through an error handler:

```go
loader := gcfg.NewLoader[AppConfig](g.Cfg(), "")

// Set error handler
loader.SetWatchErrorHandler(func(ctx context.Context, err error) {
    g.Log().Errorf(ctx, "Configuration loading failed: %v", err)
    // Can send alert notifications, etc.
})

loader.MustLoadAndWatch(ctx, "error-handler-watcher")
```

### Using Default Values

You can provide a struct with default values when creating a `Loader`:

```go
// Create configuration struct with default values
defaultConfig := &AppConfig{
    Name:    "DefaultApp",
    Version: "0.0.1",
    Server: ServerConfig{
        Host: "0.0.0.0",
        Port: 8080,
    },
}

// Create Loader with default configuration
loader := gcfg.NewLoader(g.Cfg(), "", defaultConfig)
loader.MustLoad(ctx)

// If some fields are missing in the configuration file, default values will be used
config := loader.Get()
```

## API Reference

### NewLoader

Creates a new `Loader` instance.

```go
func NewLoader[T any](config *Config, propertyKey string, targetStruct ...*T) *Loader[T]
```

**Parameters:**
- `config`: Configuration instance
- `propertyKey`: Configuration key to monitor (use `""` or `"."` to monitor all configurations)
- `targetStruct`: Optional target struct pointer (for setting default values)

### NewLoaderWithAdapter

Creates a `Loader` instance using an adapter.

```go
func NewLoaderWithAdapter[T any](adapter Adapter, propertyKey string, targetStruct ...*T) *Loader[T]
```

### Load

Loads data from the configuration source and binds it to a struct.

```go
func (l *Loader[T]) Load(ctx context.Context) error
```

### MustLoad

Similar to `Load`, but panics on error.

```go
func (l *Loader[T]) MustLoad(ctx context.Context)
```

### Watch

Starts monitoring configuration changes and automatically updates the struct.

```go
func (l *Loader[T]) Watch(ctx context.Context, name string) error
```

### MustWatch

Similar to `Watch`, but panics on error.

```go
func (l *Loader[T]) MustWatch(ctx context.Context, name string)
```

### MustLoadAndWatch

Convenience method that executes both `MustLoad` and `MustWatch`.

```go
func (l *Loader[T]) MustLoadAndWatch(ctx context.Context, name string)
```

### Get

Returns the current configuration struct (value copy).

```go
func (l *Loader[T]) Get() T
```

### GetPointer

Returns a pointer to the current configuration struct.

```go
func (l *Loader[T]) GetPointer() *T
```

### OnChange

Sets a callback function for configuration changes.

```go
func (l *Loader[T]) OnChange(fn func(updated T) error)
```

### SetConverter

Sets a custom conversion function.

```go
func (l *Loader[T]) SetConverter(converter func(data any, target *T) error)
```

### SetWatchErrorHandler

Sets an error handler for the monitoring process.

```go
func (l *Loader[T]) SetWatchErrorHandler(errorFunc func(ctx context.Context, err error))
```

### SetReuseTargetStruct

Sets whether to reuse the target struct (default is true).

```go
func (l *Loader[T]) SetReuseTargetStruct(reuse bool)
```

### StopWatch

Stops monitoring configuration changes.

```go
func (l *Loader[T]) StopWatch(ctx context.Context) (bool, error)
```

### IsWatching

Returns whether configuration changes are being monitored.

```go
func (l *Loader[T]) IsWatching() bool
```

## Complete Example

Here is a complete application example demonstrating how to use `Loader` to manage application configuration:

```go
package main

import (
    "context"
    "fmt"
    "time"
    
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

// AppConfig application configuration
type AppConfig struct {
    App      AppInfo      `json:"app"`
    Server   ServerConfig `json:"server"`
    Database DBConfig     `json:"database"`
    Redis    RedisConfig  `json:"redis"`
}

type AppInfo struct {
    Name    string `json:"name"`
    Version string `json:"version"`
    Debug   bool   `json:"debug"`
}

type ServerConfig struct {
    Host string `json:"host"`
    Port int    `json:"port"`
}

type DBConfig struct {
    Host     string `json:"host"`
    Port     int    `json:"port"`
    Database string `json:"database"`
    Username string `json:"username"`
    Password string `json:"password"`
}

type RedisConfig struct {
    Host     string `json:"host"`
    Port     int    `json:"port"`
    Database int    `json:"database"`
}

func main() {
    ctx := gctx.New()
    
    // Create Loader
    loader := gcfg.NewLoader[AppConfig](g.Cfg(), "")
    
    // Set configuration change callback
    loader.OnChange(func(updated AppConfig) error {
        g.Log().Infof(ctx, "Configuration updated: %s v%s", updated.App.Name, updated.App.Version)
        return nil
    })
    
    // Set error handler
    loader.SetWatchErrorHandler(func(ctx context.Context, err error) {
        g.Log().Errorf(ctx, "Configuration loading failed: %v", err)
    })
    
    // Load and watch configuration
    loader.MustLoadAndWatch(ctx, "app-config")
    
    // Get and use configuration
    config := loader.Get()
    
    fmt.Printf("Application Info:\n")
    fmt.Printf("  Name: %s\n", config.App.Name)
    fmt.Printf("  Version: %s\n", config.App.Version)
    fmt.Printf("  Debug Mode: %v\n", config.App.Debug)
    
    fmt.Printf("\nServer Configuration:\n")
    fmt.Printf("  Address: %s:%d\n", config.Server.Host, config.Server.Port)
    
    fmt.Printf("\nDatabase Configuration:\n")
    fmt.Printf("  Address: %s:%d\n", config.Database.Host, config.Database.Port)
    fmt.Printf("  Database: %s\n", config.Database.Database)
    
    // Keep program running to monitor configuration changes
    select {}
}
```

Corresponding configuration file `config.yaml`:

```yaml
app:
  name: "MyApplication"
  version: "1.0.0"
  debug: true

server:
  host: "0.0.0.0"
  port: 8080

database:
  host: "localhost"
  port: 3306
  database: "mydb"
  username: "root"
  password: "123456"

redis:
  host: "localhost"
  port: 6379
  database: 0
```

## Usage Recommendations

1. **Type Safety**: Using `Loader` provides compile-time type checking, avoiding runtime type conversion errors.

2. **Configuration Monitoring**: Using configuration monitoring in production environments enables hot configuration updates without restarting the application.

3. **Error Handling**: Always set an error handler to ensure timely detection and handling of configuration loading failures.

4. **Configuration Separation**: For complex applications, it's recommended to separate configuration for different modules under different keys, using the `propertyKey` parameter to load separately.

5. **Default Values**: Set reasonable default values for critical configuration items to improve application robustness.

6. **Callback Functions**: Execute necessary resource update operations in configuration change callbacks, such as rebuilding connection pools, clearing caches, etc.
