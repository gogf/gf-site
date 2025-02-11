---
slug: '/docs/faq'
title: 'Frequently Asked Questions (FAQ)'
sidebar_position: 10
hide_title: true
description: "Common questions and answers when developing with the GoFrame framework and Golang, including how to handle program exceptions, create new goroutines, shield json output fields, solve compatibility issues, configure the environment, and fix glog errors, to help developers optimize and debug applications."
keywords: [GoFrame,GoFrame framework,Golang,program exception handling,goroutine,json output,compatibility issues,environment configuration,glog errors,multi-environment configuration]
---

Message:

- Please use the search function in the upper right corner of the page to quickly search for frequently asked questions.
- Everyone is welcome to actively participate in editing and record how they filled the pits they encountered. **Many hands make light work**

## I. Golang Basics

### 1. Program throws an exception, but the program crashes directly and is not automatically captured by the framework

Using the `GoFrame` framework is rigorous and safe. If a program throws an exception, it will be captured by the framework by default. If it is not automatically captured, it may be due to the program logic opening new `goroutine`s independently, causing an exception in the new `goroutine`. So there are two options for you to choose from:

- It is not recommended to open `goroutine` in a request to handle the request, as this may cause `goroutine` to expand rapidly. When there are too many `goroutine`s, it will also affect the overall scheduling of the program at the `Go` engine level.
- If it is really necessary to start a new `goroutine`, consider using `grpool.AddWithRecover` to create a new `goroutine`, which captures exceptions automatically. For more detailed information, please refer to: [Goroutine](组件列表/系统相关/协程管理-grpool.md).

### 2. Shield some fields in `json` output

You can achieve this through structure nesting using `*struct{}` type with no space usage and the `omitempty` feature, which does not output fields if they are empty.

```go
type User struct {
    Pwd string `json:"pwd"`
    Age int    `json:"age"`
}

type UserOut struct {
    User
    Pwd *struct{} `json:"pwd,omitempty"` // The json name of this field must match the nested field json name, or it will be invalid
}

func TestJson(t *testing.T) {
    u := User{Pwd: "123", Age: 1}
    bb := UserOut{User: u}
    b, _ := json.MarshalIndent(bb, "", "    ")
    t.Log(string(b))
}
```

## II. Compatibility Issues

### 1. `client_tracing.go:73:3: undefined: attribute.Any`

The following error:

```bash
D:\Program Files\Go\bin\pkg\mod\github.com\gogf\gf@v1.16.6\net\ghttp\internal\client\client_tracing.go:73:3: undefined: attribute.Any
D:\Program Files\Go\bin\pkg\mod\github.com\gogf\gf@v1.16.6\net\ghttp\internal\client\client_tracing_tracer.go:150:3: undefined: attribute.Any
D:\Program Files\Go\bin\pkg\mod\github.com\gogf\gf@v1.16.6\net\ghttp\internal\client\client_tracing_tracer.go:151:3: undefined: attribute.Any
```

This error is caused by the `otel` package that `goframe` depends on having too low a version (the `otel` package is a third-party package used by `OpenTelemetry` implemented in `Golang`, commonly used, with many third-party basic components relying on it), while other third-party dependencies in the project have higher versions of the `otel` package. According to the `Golang module` management strategy, the project will use the latest `otel` package, which leads to version incompatibility.

The root cause is the `otel` package having made incompatible upgrades during its iteration. However, the `otel` package has now stabilized, reducing the likelihood of incompatibilities.

The solution is to upgrade the `goframe` version. The latest version of `goframe` has updated to use a stable `otel` package. If you are already using the latest version of `v1` ( `v1.16`), then upgrade to `v2` to resolve this.

### 2. `go mod tidy` failure while using `gf` dependency `v1.16.2`

`found (v0.36.0), but does not contain package go.opentelemetry.io/otel/metric/registry`

![](/markdown/08e4b24634f2819f4e6439c9cf9e08a8.png)

Solution, upgrade `gf` dependency to `v1.16.9` then `go mod tidy`

## III. Database Issues

Please refer to the section: [ORM - FAQ](核心组件/数据库ORM/ORM常见问题.md)

## IV. Usage Issues

### 1. How to load different configuration files for different environments?

Different environments refer to: Development environment / Testing environment / Pre-production environment / Production environment, etc.

- First of all, in some internet projects, especially under distributed or microservice architecture, a configuration management center is often used, corresponding to different environments, so such a problem will not arise.
- Secondly, if it is under the traditional project management method, the configuration files may be managed together in the code repository, which is not recommended. If you still want to do this, you can let the program automatically select the configuration file or specify the configuration directory through system environment variables or command-line startup parameters, reference [Configuration](核心组件/配置管理/配置管理.md) section. For example: `./app --gf.gcfg.file config-prod.toml ` then the default configuration file is modified to `config-prod.toml` file by command-line startup parameters.

We do not recommend distinguishing and reading different environment configuration files through code logic in the program.


### 2. `glog with "ERROR: logging before flag.Parse"`

There is a simple logging library package from `Golang` also called `glog`, check the package name at the top of your file `import`, change `github.com/golang/glog` to the framework's logging component, please refer to: [Logging](核心组件/日志组件/日志组件.md)

### 3. How to use `gcron` and `http` at the same time?

```go
func main() {
    // Scheduled task 1
    gcron.AddSingleton("*/5 * * * * *", func() {
        task.Test()
        glog.Debug("gcron1")
    })

    // Scheduled task 2
    gcron.AddSingleton("*/10 * * * * *", func() {
        glog.Debug("gcron2")
    })

    // Receive http requests
    g.Server().Run()
}
```

Note, `gcron` must be before `g.Server().Run`.

### 4. What `struct tag`s does `GoFrame` have?

Parameter requests, data validation, `OpenAPIv3`, command management, database ORM.

| Tag (Abbreviation) | Full Name | Description | Documents |
| --- | --- | --- | --- |
| `v` | `valid` | Data validation tag. | [Struct Validation - Example](核心组件/数据校验/数据校验-参数类型/数据校验-Struct校验/Struct校验-基本使用.md) |
| `p` | `param` | Custom request parameter matching. | [Request - Parameter Binding](WEB服务开发/请求输入/请求输入-对象处理.md) |
| `d` | `default` | Default value binding for request parameters. | [Request - Default Value](WEB服务开发/请求输入/请求输入-默认值绑定.md) |
| `orm` | `orm` | ORM tag, used to specify table name, association relationships. | [Dao/Do/Entity Generating](开发工具/代码生成-gen/数据规范-gen%20dao.md)<br />[Model Association - With](核心组件/数据库ORM/ORM链式操作/ORM链式操作-模型关联/模型关联-静态关联-With特性.md) |
| `dc` | `description` | Generic struct property description, used by both ORM and interfaces. Belongs to the framework's default property description tag. |  |

Others:

- Command-line structured management parameters: [Command - Structure](核心组件/命令管理/命令管理-结构化参数.md)
- Framework commonly used tag labels are centrally managed under the `gtag` component: [https://github.com/gogf/gf/blob/master/util/gtag/gtag.go](https://github.com/gogf/gf/blob/master/util/gtag/gtag.go)
- In the interface documentation section, as the label form is used to generate the `OpenAPI` documentation, there are many tags, please refer to the section: [API Document](WEB服务开发/接口文档/接口文档.md)

### 5. `HTTP Server` throws `context cancel` error

From version `v2.5` of the framework, the `Request` object of the framework's `HTTP Server` will directly inherit from the standard library's `http.Request` object, which includes the `context` object. When the client, such as a browser or `HTTP Client`, cancels the request, the server will receive a `context cancel` operation (`context.Done`), but the server will not directly report a `context cancel` error. This error often occurs when business logic calls underlying components such as databases or messaging, where these components recognize the `context cancel` operation, stop execution, and pass the `context cancel` error up to notify the upper layer that execution has already terminated.

This behavior is in line with the standard library design. There is no need for the server to continue execution after the client terminates the request.

[Frequent server context cancel errors](https://wiki.goframe.org/pages/viewpage.action?pageId=124387603#id-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%A2%91%E7%B9%81%E5%87%BA%E7%8E%B0contextcancel%E9%94%99%E8%AF%AF)

## V. Environment Related

### 1. `go build main.go` on `Linux` hints connection time out `connection timed out`

```bash
go: github.com/gogf/gf@v1.14.6-0.20201214132204-c685876e6f67: Get "https://proxy.golang.org/github.com/gogf/gf/@v/v1.14.6-0.20201214132204-c685876e6f67.mod":
dial tcp 172.217.160.113:443:
connect: connection timed out
```

Solution:

```bash
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
```

Please refer to:

- [Go Module](其他资料/准备开发环境/Go%20Module.md)
- [https://goproxy.cn](https://goproxy.cn)

### 2. `gf` command not found on `Linux`

```bash
./gf install
After installation
execute gf -v
gf: command not found
and there is no gf file in the /usr/bin directory

Solution:
Copy the sh file to the /usr/bin directory
cp gf /usr/bin

Then execute
gf -v

You will see
GoFrame CLI Tool v1.15.4, https://goframe.org
Install Path: /bin/gf
Build Detail:
Go Version: go1.16.2
GF Version: v1.15.3
Git Commit: 22011e76dc3e14006936164cc89e2d4c9190a36d
Build Time: 2021-03-30 15:43:22
```

### 3. `gf` command not found on `Win10`

Solution: Install `gf.exe` Refer to: [CLI Tool](开发工具/开发工具.md)