---
slug: '/docs/components/os-gmlock'
title: 'Memory Lock'
sidebar_position: 2
hide_title: true
keywords: [memory lock, dynamic mutex lock, GoFrame, gmlock, concurrency safety, TryLock, Remove method, dynamic creation of mutex locks, GoFrame framework, lock management]
description: "The memory lock module provides dynamic mutex lock functionality based on the GoFrame framework, supporting concurrent safety and the TryLock feature by dynamically generating locks for given key names. Methods provided by GoFrame can be conveniently applied in scenarios requiring dynamic creation of a large number of mutex locks, such as effectively managing locks in multi-goroutine concurrent processing to ensure safe access to resources."
---

The memory lock module, also known as the `dynamic mutex lock` module, supports `dynamically generating mutex locks` based on given key names, ensuring concurrency safety and supporting the `Try*Lock` feature.

> In scenarios where a large number of dynamic mutex locks are maintained, please manually call the `Remove` method to delete mutex lock objects that are no longer in use.

**Usage**:

```go
import "github.com/gogf/gf/v2/os/gmlock"
```

**Usage scenarios**: Scenarios that require `dynamic creation of mutex locks`, or need to maintain `a large number of dynamic locks`;

**Interface documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gmlock](https://pkg.go.dev/github.com/gogf/gf/v2/os/gmlock)

```go
func Lock(key string)
func LockFunc(key string, f func())
func RLock(key string)
func RLockFunc(key string, f func())
func RUnlock(key string)
func Remove(key string)
func TryLock(key string) bool
func TryLockFunc(key string, f func()) bool
func TryRLock(key string) bool
func TryRLockFunc(key string, f func()) bool
func Unlock(key string)
type Locker
    func New() *Locker
    func (l *Locker) Clear()
    func (l *Locker) Lock(key string)
    func (l *Locker) LockFunc(key string, f func())
    func (l *Locker) RLock(key string)
    func (l *Locker) RLockFunc(key string, f func())
    func (l *Locker) RUnlock(key string)
    func (l *Locker) Remove(key string)
    func (l *Locker) TryLock(key string) bool
    func (l *Locker) TryLockFunc(key string, f func()) bool
    func (l *Locker) TryRLock(key string) bool
    func (l *Locker) TryRLockFunc(key string, f func()) bool
    func (l *Locker) Unlock(key string)
```

### Example 1: Basic Usage

```go
package main

import (
    "time"
    "sync"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gmlock"
)

func main() {
    key := "lock"
    wg  := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) {
            gmlock.Lock(key)
            glog.Println(i)
            time.Sleep(time.Second)
            gmlock.Unlock(key)
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

In this example, it simulates opening `10` `goroutines` simultaneously, but at any one time only one `goroutine` can acquire the lock. The `goroutine` with the lock will execute for `1` second before exiting, allowing other `goroutines` to acquire the lock.

After execution, the output is:

```html
2018-10-15 23:57:28.295 9
2018-10-15 23:57:29.296 0
2018-10-15 23:57:30.296 1
2018-10-15 23:57:31.296 2
2018-10-15 23:57:32.296 3
2018-10-15 23:57:33.297 4
2018-10-15 23:57:34.297 5
2018-10-15 23:57:35.297 6
2018-10-15 23:57:36.298 7
2018-10-15 23:57:37.298 8
```

### Example 2: TryLock Non-blocking Lock

The `TryLock` method returns a value, indicating whether the lock was successfully acquired. If successful, it returns `true`; if the lock is already acquired by another `goroutine`, it returns `false`.

```go
package main

import (
    "sync"
    "github.com/gogf/gf/v2/os/glog"
    "time"
    "github.com/gogf/gf/v2/os/gmlock"
)

func main() {
    key := "lock"
    wg  := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) {
            if gmlock.TryLock(key) {
                glog.Println(i)
                time.Sleep(time.Second)
                gmlock.Unlock(key)
            } else {
                glog.Println(false)
            }
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

Similarly, in this example, only `1` `goroutine` can acquire the lock at the same time, and other `goroutines` will exit immediately if `TryLock` fails.

After execution, the output is:

```html
2018-10-16 00:01:59.172 9
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.176 false
```