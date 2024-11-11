---
slug: '/docs/web/http-client-metrics'
title: 'HTTPClient-监控指标'
sidebar_position: 10
hide_title: true
keywords: [HTTP客户端,监控指标,性能优化,请求时间,GoFrame,连接时间,请求总数,请求大小,GoFrame框架,返回大小]
description: 'HTTP客户端的监控指标功能，默认情况下是关闭状态，以免影响性能。它提供了多种指标供用户参考，如请求执行的时间开销、连接创建时间以及请求的字节总大小等，只有在metric特性全局开启时才会启用这些指标，帮助用户更好地进行性能分析。'
---

`HTTP` 客户端支持监控指标能力，默认是关闭的不影响性能，只有在 `metric` 特性全局开启时该组件才会默认开启监控指标计算和生成功能。

## 指标列表

| **指标名称** | **指标类型** | **指标单位** | **指标描述** |
| --- | --- | --- | --- |
| `http.client.request.duration` | `Histogram` | `ms` | 客户端请求执行的时间开销。 |
| `http.client.request.duration_total` | `Counter` | `ms` | 每个请求使用的总时间开销。 |
| `http.client.connection.duration` | `Histogram` | `ms` | 创建连接所使用的时间开销。 |
| `http.client.request.total` | `Counter` |  | 已经执行完毕的请求总数。 |
| `http.client.request.active` | `Gauge` |  | 当前正在处理的请求数量。 |
| `http.client.request.body_size` | `Counter` | `bytes` | 请求的字节总大小。 |
| `http.client.response.body_size` | `Counter` | `bytes` | 返回的字节总大小。 |

## 属性列表

| **Label名称** | **Label描述** | **Label示例** |
| --- | --- | --- |
| `server.address` | 请求的目标服务地址。可能是域名、IP地址。 | `goframe.org`<br />`10.0.1.132` |
| `server.port` | 请求的目标服务端口。 | `8000` |
| `http.request.method` | 请求的方法名称。 | `GET`; `POST`; `DELETE` |
| `http.response.status_code` | 处理返回的 `HTTP` 状态码。 | `200` |
| `url.schema` | 使用的请求协议。 | `http`<br />`https` |
| `network.protocol.version` | 请求协议版本。 | `1.0`<br />`1.1` |