---
slug: '/docs/core/glog-rotate'
title: 'Logging - Rotatation'
sidebar_position: 13
hide_title: true
keywords: [GoFrame,GoFrame framework,glog,log component,log rotation,log rolling,log compression,log configuration,file format,log backup]
description: "Log rolling rotation feature of the glog component in GoFrame framework, including setting log file names to output by date, rolling rotation with RotateSize and RotateExpire, support for log file compression and backup, configuration examples, considerations, and more. Provides detailed configuration options and example code to help developers better manage log files."
---
:::warning
The rolling rotation is currently an experimental feature; feel free to provide feedback if you encounter issues.
:::
In previous sections, we learned that the `glog` component supports setting log file names to output logs by date. Starting from `GoFrame v1.12`, the `glog` component also supports the rolling rotation feature for log files, which involves the following configuration options in the log object configuration properties:

```go
RotateSize           int64          // Rotate the logging file if its size > 0 in bytes.
RotateExpire         time.Duration  // Rotate the logging file if its mtime exceeds this duration.
RotateBackupLimit    int            // Max backup for rotated files, default is 0, means no backups.
RotateBackupExpire   time.Duration  // Max expire for rotated files, which is 0 in default, means no expiration.
RotateBackupCompress int            // Compress level for rotated files using gzip algorithm. It's 0 in default, means no compression.
RotateCheckInterval  time.Duration  // Asynchronously checks the backups and expiration at intervals. It's 1 hour by default.
```

Brief Explanation:

1. `RotateSize` is used to specify the size-based rotation trigger. This property is in bytes, and the rotation will only be activated when it is greater than 0.
2. `RotateExpire` sets the duration trigger for rotation based on file modification times. The feature is activated only if this property is greater than 0.
3. `RotateBackupLimit` sets the number of backup files kept after rotation, defaulting to 0, which means no backups. It usually should be set greater than 0. Files exceeding this backup number will be deleted from oldest to newest.
4. `RotateBackupExpire` configures the deletion of rotated files based on their age.
5. `RotateBackupCompress` indicates the compression level for rotated files, default is 0, meaning no compression. The range for compression levels is `1-9`, where `9` denotes the maximum compression level.
6. `RotateCheckInterval` sets the interval for asynchronous backup and expiration checks, with a default of 1 hour, which typically does not need configuration.

### Feature Activation

The rolling rotation feature, as indicated by the above configuration options, will only be active if `RotateSize` or `RotateExpire` is configured, and is off by default.

### File Format

The `glog` component outputs logs in a fixed file format `*.log`, using `.log` as the log file name suffix. To standardize and manage easily, the format of rotated files is fixed and not customizable by developers. When files are rotated, they are renamed in the format " `*.rotation_time.log`", where `rotation_time` is formatted as: `YYYYMMDDHHMMSSmmmuuu`, for example:

```html
access.log          -> access.20200326101301899002.log
access.20200326.log -> access.20200326.20200326101301899002.log
```

### Configuration Examples

1. Example 1, rotating based on log file size:

```yaml
logger:
     Path:                  "/var/log"
     Level:                 "all"
     Stdout:                false
     RotateSize:            "100M"
     RotateBackupLimit:     2
     RotateBackupExpire:    "7d"
     RotateBackupCompress:  9
```

Brief Explanation:

   - The `RotateSize` option can be set as a string in the config file, e.g., `100M`, `200MB`, `500KB`, `1Gib`, etc. In this example, we rotate when the log file size exceeds `100M`.
   - Similarly, `RotateBackupExpire` can be string-configured with values like `1h`, `30m`, `1d6h`, `7d`, etc. Here, set to `7d` to automatically delete rotated files after seven days.
   - Setting `RotateBackupCompress` to `9` indicates using the highest compression level for minimized storage of rotated files. Note that rotation and compression are separate actions; file compression is asynchronous, and after auto-rotation, the scheduler periodically compresses the files to `*.gz`. Higher compression levels will consume more CPU resources.

2. Example 2, rotating based on file modification expiration:

```yaml
logger:
     Path:                  "/var/log"
     Level:                 "all"
     Stdout:                false
     RotateExpire:          "1d"
     RotateBackupLimit:     1
     RotateBackupExpire:    "7d"
     RotateBackupCompress:  9
```

Here, `RotateExpire` is set to `1d` meaning if a log file hasn't been modified or written to within a day, the `glog` module will automatically rotate it, compressing it for storage.

### Considerations

Due to differing rolling rotation configurations among log objects, if multiple log objects share the same directory and have rotation enabled, there might be conflicts leading to unexpected outcomes. Thus, we recommend you consider two strategies:

1. Use the global default logging singleton object ( `g.Log()`), specifying different directories or file names using the `Cat` or `File` methods.
2. Set different output directories ( `Path` configuration) for different log objects ( `g.Log(name)`) ensuring no hierarchical overlap among them.

For example, with two types of business log files `order` and `promo` for order and promotion business respectively, within the same service program:

If the log path is `/var/log`, you could:

1. Output order logs via `g.Log().Cat("order").Print(xxx)`, resulting in log files like: `/var/log/order/2020-03-26.log`.
2. Output promotion logs via `g.Log().Cat("promo").Print(xxx)`, resulting in log files like: `/var/log/promo/2020-03-26.log`.

Alternatively:

1. Use `g.Log("order").Print(xxx)` for order logs, creating files like: `/var/log/order.log`.
2. Use `g.Log("promo").Print(xxx)` for promotion logs, creating files like: `/var/log/promo.log`.