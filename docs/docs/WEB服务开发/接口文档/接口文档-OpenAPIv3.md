---
slug: '/docs/web/api-document-openapiv3'
title: '接口文档-OpenAPIv3'
sidebar_position: 0
hide_title: true
keywords: [OpenAPIv3,GoFrame,接口文档,规范路由,g.Meta,swagger,API,框架,元数据,协议]
description: '在GoFrame框架中使用OpenAPIv3协议来规范接口文档的生成。通过嵌入g.Meta元数据结构体，可以自动生成包含协议标签的接口信息。此外，文中还展示了如何自定义扩展标签和手动完善接口文档。'
---
:::tip
`OpenAPIv3` 协议主要使用在规范路由中，阅读接口文档协议介绍之前，请先了解一下规范路由： [路由注册-规范路由](../路由管理/路由管理-路由注册/路由注册-规范路由/路由注册-规范路由.md)
:::
## 一、 `OpenAPIv3`

详细的 `OpenAPIv3` 协议介绍请参考： [https://swagger.io/specification/](https://swagger.io/specification/)

## 二、 `g.Meta` 元数据

接口的元数据信息可以通过为输入结构体`embedded`方式嵌入`g.Meta`结构，并通过`g.Meta`的属性标签方式来实现。

关于元数据组件的介绍，详情请参考章节： [元数据-gmeta](../../组件列表/实用工具/元数据-gmeta.md)

## 三、常用协议标签

输入输出结构体中的属性的标签完整支持 `OpenAPIv3` 协议，因此只要增加了对应的协议标签，那么生成的 `OpenAPIv3` 接口信息中将会自动包含该属性。

大部分的标签属性已经被 `Server` 组件自动生成，开发者需要手动设置的标签不多。

### 1、基础标签

常见的基础标签包括：

| 常见OpenAPIv3标签 | 说明 | 备注 |
| --- | --- | --- |
| `path` | 结合注册时的前缀共同构成接口URI路径 | 用于 `g.Meta` 标识接口元数据 |
| `tags` | 接口所属的标签，用于接口分类 | 用于 `g.Meta` 标识接口元数据 |
| `method` | 接口的请求方式： `GET/PUT/POST/DELETE...(不区分大小写)` | 用于 `g.Meta` 标识接口元数据 |
| `deprecated` | 标记该接口废弃 | 用于 `g.Meta` 标识接口元数据 |
| `summary` | 接口/参数概要描述 | 缩写 `sm` |
| `description` | 接口/参数详细描述 | 缩写 `dc` |
| `in` | 参数的提交方式 | `header/path/query/cookie` |
| `default` | 参数的默认值 | 缩写 `d` |
| `mime` | 接口的 `MIME` 类型，例如 `multipart/form-data` 一般是全局设置，默认为 `application/json`。 | 用于 `g.Meta` 标识接口元数据 |
| `type` | 参数的类型，一般不需要设置，特殊参数需要手动设置，例如 `file` | 仅用于参数属性 |
:::tip
更多标签请参考标准的 `OpenAPIv3` 协议： [https://swagger.io/specification/](https://swagger.io/specification/)
:::
### 2、扩展标签

在 `OpenAPI` 规范里面，所有名称以 `x-` 开头的标签是开发者可自定义的扩展标签。扩展标签可以在任意的接口、属性中以 `Golang struct tag` 的形式定义，在接口文档生成时，将会作为独立的字段返回。例如：

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/errors/gcode"
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type GetListReq struct {
    g.Meta `path:"/user" tags:"User" method:"get" x-group:"User/Info" summary:"Get user list with basic info."`
    Page   int `dc:"Page number" d:"1" x-sort:"1"`
    Size   int `dc:"Size for per page." d:"10" x-sort:"2"`
}
type GetListRes struct{}

type Controller struct{}

func (c *Controller) GetList(ctx context.Context, req *GetListReq) (res *GetListRes, err error) {
    return nil, gerror.NewCode(gcode.CodeNotImplemented)
}

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(new(Controller))
    })
    s.SetOpenApiPath("/api.json")
    s.SetSwaggerPath("/swagger")
    s.SetPort(8199)
    s.Run()
}
```

执行后，访问地址 [http://127.0.0.1:8199/swagger](http://127.0.0.1:8199/swagger) 可以查看 `swagger ui`，访问 [http://127.0.0.1:8199/api.json](http://127.0.0.1:8199/api.json) 可以查看对应的 `OpenAPIv3` 接口文档。其中生成的 `OpenAPIv3` 接口文档如下：

```
{
    "openapi": "3.0.0",
    "components": {
        "schemas": {
            "main.GetListReq": {
                "properties": {
                    "Page": {
                        "default": 1,
                        "description": "Page number",
                        "format": "int",
                        "properties": {},
                        "type": "integer",
                        "x-sort": "1"
                    },
                    "Size": {
                        "default": 10,
                        "description": "Size for per page.",
                        "format": "int",
                        "properties": {},
                        "type": "integer",
                        "x-sort": "2"
                    }
                },
                "type": "object",
                "x-group": "User/Info"
            },
            "main.GetListRes": {
                "properties": {},
                "type": "object"
            }
        }
    },
    "info": {
        "title": "",
        "version": ""
    },
    "paths": {
        "/user": {
            "get": {
                "parameters": [
                    {
                        "description": "Page number",
                        "in": "query",
                        "name": "Page",
                        "schema": {
                            "default": 1,
                            "description": "Page number",
                            "format": "int",
                            "properties": {},
                            "type": "integer",
                            "x-sort": "1"
                        },
                        "x-sort": "1"
                    },
                    {
                        "description": "Size for per page.",
                        "in": "query",
                        "name": "Size",
                        "schema": {
                            "default": 10,
                            "description": "Size for per page.",
                            "format": "int",
                            "properties": {},
                            "type": "integer",
                            "x-sort": "2"
                        },
                        "x-sort": "2"
                    }
                ],
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/main.GetListRes"
                                }
                            }
                        },
                        "description": ""
                    }
                },
                "summary": "Get user list with basic info.",
                "tags": [
                    "User"
                ],
                "x-group": "User/Info"
            },
            "x-group": "User/Info"
        }
    }
}
```

可以看到，扩展标签已经生成到了接口文档中。

## 四、扩展 `OpenAPIv3` 信息

核心的接口信息已经自动生成，如果开发者想要更进一步完善接口信息，可以通过 `s.GetOpenApi()` 接口获取到 `OpenAPIv3` 的结构体对象，并手动填充对应的属性内容即可。我们来看一个示例，在该示例中，我们设计每个接口外层公共的数据结构：

![](/markdown/452372a121db73abd8c5027077b3026e.png)

我们可以发现通过通用的 `OpenAPIv3` 对象我们可以自定义修改其内容，并且根据它生成其他各种自定义类型的接口文档。