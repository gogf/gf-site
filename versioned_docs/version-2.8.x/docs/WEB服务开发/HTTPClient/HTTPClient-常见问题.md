---
slug: '/docs/web/http-client-faq'
title: 'HTTPClient-常见问题'
sidebar_position: 9
hide_title: true
keywords: [HTTPClient,GoFrame,GoFrame框架,gclient.Client,连接池,高效,资源使用,短连接请求,表单请求,ContentType]
description: '解释如何有效使用GoFrame框架中的gclient.Client对象，以提高效率和降低资源使用。包含gclient.Client对象复用的建议以及如何处理非法字符问题，通过示例演示设置正确的ContentType。'
---

## 是否需要保存复用创建的 `gclient.Client` 对象

无论是通过 `g.Client` 或者 `gclient.New` 方法创建 `gclient.Client` 对象，该对象都应该保存下来复用，而不是每一次都新建 `Client` 对象，这样可以提高效率、降低资源使用、使用方式对 `GC` 友好。该对象内建连接池设计，可充分管理大量的短连接请求。由于 `Client` 对象对资源消耗不是很高，所以很多同学可能都没太注意这个点。

什么情况下我应该新建 `gclient.Client` 对象而不是复用呢？你可以按照业务模块的解耦设计，每个业务模块单独管理维护自己的 `gclient.Client` 对象。也可以当针对不同的场景，使用 `Client` 的配置不同时，那么可以新建不同的 `Client` 来使用。

## `invalid semicolon separator in query`

**问题原因**：默认 **表单请求** 中带 `;` 字符是非法的（需要 `urlencode`）。具体请参考讨论： [https://github.com/golang/go/issues/25192](https://github.com/golang/go/issues/25192)

**错误示例**：

```bash
curl localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```

**修复示例**：

提交请求的时候需要注明 `ContentType`，例如这里应当标明是 `JSON` 请求。

```bash
curl -X POST -H "Content-Type: application/json" localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```