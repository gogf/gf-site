---
slug: '/docs/components/network-gudp'
title: 'UDP组件'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,UDP组件,UDP协议,无连接协议,gudp.Server,gudp.Conn,接口文档,gudp用法,NewServer,SetAddress]
description: 'GoFrame框架中的UDP组件，使用gudp.Server和gudp.Conn实现UDP协议的简单不可靠信息传送服务。通过示例代码展示如何创建和运行UDP服务器，并提供了相关接口文档链接供参考。'
---

## 基本介绍
`UDP (User Datagram Protocol)` 一种无连接的传输层协议，提供面向事务的简单不可靠信息传送服务。 `UDP` 服务端通过 `gudp.Server` 实现，客户端通过 `gudp.ClientConn` 对象或者工具方法实现。

**使用方式**：

```go
import "github.com/gogf/gf/v2/net/gudp"
```

**接口文档**： [https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp)


## 使用示例

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/net/gudp"
)

func main() {
    handler := func(conn *gudp.ServerConn) {
        defer conn.Close()
        for {
            if data, addr, _ := conn.Recv(-1); len(data) > 0 {
                fmt.Println(string(data), addr.String())
            }
        }
    }
    err := gudp.NewServer("127.0.0.1:8999", handler).Run()
    if err != nil {
        fmt.Println(err)
    }
}
```

`UDPServer` 是阻塞运行的，用户可以在自定义的回调函数中根据读取内容进行并发处理。

在 `Linux` 下可以使用以下命令向服务端发送 `UDP` 数据进行测试，随后查看服务端端是否有输出：

```bash
echo "hello" > /dev/udp/127.0.0.1/8999
```

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />