# File Watching - System Vars

## Impact of System Variables

In the `linux` system, the `gfsnotify` module uses the system's `inotify` feature to implement file/directory watching. Therefore, this functionality is subject to the limitations of two kernel parameters:

- `fs.inotify.max_user_instances`: Indicates the number of `inotify` watching instances that the current user can create, which is the number of `Watcher` objects created by the `gfsnotify.New` method. Each `Watcher` object corresponds to an `inotify` instance in the system. The default system quantity is: `128`.

- `fs.inotify.max_user_watches`: Indicates the size of the watched file queue that an `inotify` instance can add. If you add watched files to the same `inotify` beyond this limit, it will fail, and there will be system error logs. The default system quantity is usually: `8192` (some systems may have a larger value).

## Viewing and Modifying

Take `fs.inotify.max_user_instances` as an example, in the `linux` system, you can view the current value of `fs.inotify.max_user_instances` with the following command:
```bash
cat /proc/sys/fs/inotify/max_user_instances
```

If you need to modify this value, you can use the following command (for example, to change the value to `1024`):
```bash
sudo sysctl -w fs.inotify.max_user_instances=1024
```

To permanently modify this value, you can add the following content to the `/etc/sysctl.conf` file:
```bash
fs.inotify.max_user_instances=1024
```
Then execute the following command to make the changes take effect:
```bash
sudo sysctl -p
```

> Page: https://goframe.org/en/docs/components/os-gfsnotify-system-variables
