# GRPC Server Configuration

## Introduction

The server supports configuration files, and all configurations will be automatically mapped to the configuration object. The configuration object is as follows:

```go
// GrpcServerConfig is the configuration for server.
type GrpcServerConfig struct {
    Address          string              // (optional) Address for server listening.
    Name             string              // (optional) Name for current service.
    Logger           *glog.Logger        // (optional) Logger for server.
    LogPath          string              // (optional) LogPath specifies the directory for storing logging files.
    LogStdout        bool                // (optional) LogStdout specifies whether printing logging content to stdout.
    ErrorStack       bool                // (optional) ErrorStack specifies whether logging stack information when error.
    ErrorLogEnabled  bool                // (optional) ErrorLogEnabled enables error logging content to files.
    ErrorLogPattern  string              // (optional) ErrorLogPattern specifies the error log file pattern like: error-{Ymd}.log
    AccessLogEnabled bool                // (optional) AccessLogEnabled enables access logging content to file.
    AccessLogPattern string              // (optional) AccessLogPattern specifies the error log file pattern like: access-{Ymd}.log
}
```

The logic for automatic reading of configuration files is consistent with the framework. For detailed information, please refer to the section: [Configuration](https://goframe.org/en/docs/core/gcfg.md)

## Configuration Template

An example of a complete configuration template:

```yaml
grpc:
  name:             "demo"  # Service name
  address:          ":8000" # Custom service listening address
  logPath:          "./log" # Log storage directory path
  logStdout:        true    # Whether to output logs to the terminal
  errorLogEnabled:  true    # Whether to enable error logging
  accessLogEnabled: true    # Whether to enable access logging
  errorStack:       true    # Whether to log error stacks when errors occur

  # Log extension configuration (parameter log component configuration)
  logger:
    path:                  "/var/log/"   # Log file path. Default is empty, indicating disabled, output to terminal only
    file:                  "{Y-m-d}.log" # Log file format. Default is "{Y-m-d}.log"
    prefix:                ""            # Prefix for log content output. Default is empty
    level:                 "all"         # Log output level
    stdout:                true          # Whether to output logs to terminal simultaneously. Default is true
    rotateSize:            0             # Rotate files based on log file size. Default is 0, indicating disabled
    rotateExpire:          0             # Rotate files based on time intervals. Default is 0, indicating disabled
    rotateBackupLimit:     0             # Limit backup files based on the number of split files, valid when rotation is enabled. Default is 0, meaning no backup, delete when split
    rotateBackupExpire:    0             # Clean up split files based on the expiration period, valid when rotation is enabled. Default is 0, meaning no backup, delete when split
    rotateBackupCompress:  0             # Compression ratio for rotating files (0-9). Default is 0, indicating no compression
    rotateCheckInterval:   "1h"          # Time interval for rotation checks, usually no need to set. Default is 1 hour

```

The log configuration here is consistent with the `http server` and can use independent log component configuration items to configure the `grpc server` logs. For detailed information about the log component configuration, please refer to this document: [Logging - Configuration](https://goframe.org/en/docs/core/glog-config.md)

In case the `address` is not configured, the `grpc server` will start using all `ip` addresses of the local network card with a **random free port** (default configuration `:0`). If you want to specify the `ip` but use a random free port to start the `grpc server`, you can configure the `address` using the format `ip:0`, for example: `192.168.1.1:0, 10.0.1.1:0`.

> Page: https://goframe.org/en/docs/micro-service/config
