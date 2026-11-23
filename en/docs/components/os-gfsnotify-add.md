# File Watching - Add

## Add Watch

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfsnotify"
)

func main() {
    var (
        path     = "/home/john/temp"
        ctx      = context.Background()
        logger   = g.Log()
        callback = func(event *gfsnotify.Event) {
            if event.IsCreate() {
                logger.Debug(ctx, "Create file: ", event.Path)
            }
            if event.IsWrite() {
                logger.Debug(ctx, "Write file: ", event.Path)
            }
            if event.IsRemove() {
                logger.Debug(ctx, "Delete file: ", event.Path)
            }
            if event.IsRename() {
                logger.Debug(ctx, "Rename file: ", event.Path)
            }
            if event.IsChmod() {
                logger.Debug(ctx, "Change permissions: ", event.Path)
            }
            logger.Debug(ctx, event)
        }
    )
    _, err := gfsnotify.Add(path, callback, gfsnotify.WatchOption{})
    if err != nil {
        logger.Fatal(ctx, err)
    } else {
        select {}
    }
}
```

The `/home/john` parameter is a directory. When we create/delete/modify files in the `/home/john` directory, `gfsnotify` detects the file modifications and outputs the corresponding event information.

## Recursive Watching

We can use `gfsnotify.WatchOption` to set some options for watching, such as whether to enable recursive watching. By default, the `Add` method performs recursive watching, meaning that changes to files within the directory (including those in subdirectories) will also trigger the file watching callback.

If we create new directories under the watched directory and continue to create new directories or files within them, and so on, the newly created directories or files will also be automatically watched.

> Page: https://goframe.org/en/docs/components/os-gfsnotify-add
