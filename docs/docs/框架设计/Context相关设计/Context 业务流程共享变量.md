---
slug: '/docs/design/context-variable'
title: 'Context: 业务流程共享变量'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,GoFrame框架,Context,上下文变量,共享变量,异步IO,HTTP请求,Session管理,用户信息,中间件]
description: '如何通过使用GoFrame框架中的Context传递和管理上下文流程中的共享变量。在Go网络应用中，尤其是HTTP/RPC服务中，Context是传递异步IO控制和上下文变量的关键工具。通过结构化对象的共享，本文展示了如何在请求过程中实现变量传递，确保请求链路中变量的一致性和灵活性。'
---

`Context` 指的是标准库的 `context.Context`，是一个接口对象，常用于 **异步 `IO` 控制** 以及 **上下文流程变量的传递**。本文将要介绍的，是如何使用 `Context` 传递流程间共享变量。

在 `Go` 的执行流程中，特别是 `HTTP/RPC` 执行流程中，不存在”全局变量”获取请求参数的方式，只有将上下文 `Context` 变量传递到后续流程的方法中，而 `Context` 上下文变量即包含了所有需要传递的共享变量。并且该 `Context` 中的共享变量应当是事先约定的，并且往往存储为对象指针形式。

通过 `Context` 上下文共享变量非常简单，以下我们通过一个项目中的示例来展示如何在实战化项目中传递和使用通用的共享变量。

## 一、结构定义

上下文对象中往往存储一些需要共享的变量，这些变量通常使用结构化的对象来存储，以方便维护。例如，我们在 `model` 定义一个上下文中的共享变量：

```go
const (
    // 上下文变量存储键名，前后端系统共享
    ContextKey = "ContextKey"
)

// 请求上下文结构
type Context struct {
    Session *ghttp.Session // 当前Session管理对象
    User    *ContextUser   // 上下文用户信息
    Data    g.Map          // 自定KV变量，业务模块根据需要设置，不固定
}

// 请求上下文中的用户信息
type ContextUser struct {
    Id       uint   // 用户ID
    Passport string // 用户账号
    Nickname string // 用户名称
    Avatar   string // 用户头像
}
```

其中：

1. `model.ContextKey` 常量表示存储在 `context.Context` 上下文变量中的键名，该键名用于从传递的 `context.Context` 变量中存储/获取业务自定义的共享变量。
2. `model.Context` 结构体中的 `Session` 表示当前请求的 `Session` 对象，在 `GoFrame` 框架中每个 `HTTP` 请求对象中都会有一个空的 `Session` 对象，该对象采用了懒初始化设计，只有在真正执行读写操作时才会初始化。
3. `model.Context` 结构体中的 `User` 表示当前登录的用户基本信息，只有在用户登录后才有数据，否则是 `nil`。
4. `model.Context` 结构体中的 `Data` 属性用于存储自定义的 `KV` 变量，因此一般来说开发者无需再往 `context.Context` 上下文变量中增加自定义的键值对，而是直接使用 `model.` `Context` 对象的这个 `Data` 属性即可。详见后续介绍。

## 二、逻辑封装

由于该上下文对象也是和业务逻辑相关的，因此我们需要通过 `service` 对象将上下文变量封装起来以方便其他模块使用。

```go
// 上下文管理服务
var Context = new(contextService)

type contextService struct{}

// 初始化上下文对象指针到上下文对象中，以便后续的请求流程中可以修改。
func (s *contextService) Init(r *ghttp.Request, customCtx *model.Context) {
    r.SetCtxVar(model.ContextKey, customCtx)
}

// 获得上下文变量，如果没有设置，那么返回nil
func (s *contextService) Get(ctx context.Context) *model.Context {
    value := ctx.Value(model.ContextKey)
    if value == nil {
        return nil
    }
    if localCtx, ok := value.(*model.Context); ok {
        return localCtx
    }
    return nil
}

// 将上下文信息设置到上下文请求中，注意是完整覆盖
func (s *contextService) SetUser(ctx context.Context, ctxUser *model.ContextUser) {
    s.Get(ctx).User = ctxUser
}
```

## 三、上下文变量注入

上下文的变量必须在请求一开始便注入到请求流程中，以便于其他方法调用。在 `HTTP` 请求中我们可以使用 `GoFrame` 的中间件来实现。在 `GRPC` 请求中我们也可以使用拦截器来实现。在 `service` 层的 `middleware` 管理对象中，我们可以这样来定义：

```go
// 自定义上下文对象
func (s *middlewareService) Ctx(r *ghttp.Request) {
    // 初始化，务必最开始执行
    customCtx := &model.Context{
        Session: r.Session,
        Data:    make(g.Map),
    }
    service.Context.Init(r, customCtx)
    if userEntity := Session.GetUser(r.Context()); userEntity != nil {
        customCtx.User = &model.ContextUser{
            Id:       userEntity.Id,
            Passport: userEntity.Passport,
            Nickname: userEntity.Nickname,
            Avatar:   userEntity.Avatar,
        }
    }
    // 将自定义的上下文对象传递到模板变量中使用
    r.Assigns(g.Map{
        "Context": customCtx,
    })
    // 执行下一步请求逻辑
    r.Middleware.Next()
}
```

该中间件初始化了用户执行流程共享的对象，并且存储到 `context.Context` 变量中的对象是指针类型 `*model.Context`。这样任何一个地方获取到这个指针，既可以获取到里面的数据，也能够直接修改里面的数据。

其中，如果 `Session` 中存在用户登录后的存储信息，那么也会将需要共享的用户基本信息写入到 `*model.Context` 中。

## 四、上下文变量使用

### 方法定义

约定俗成的，方法定义的第一个输入参数往往预留给 `context.Context` 类型参数使用，以便接受上下文变量，特别是 `service` 层的方法。例如：

```go
// 执行用户登录
func (s *userService) Login(ctx context.Context, loginReq *define.UserServiceLoginReq) error {
    ...
}

// 查询内容列表
func (s *contentService) GetList(ctx context.Context, r *define.ContentServiceGetListReq) (*define.ContentServiceGetListRes, error) {
    ...
}

// 创建回复内容
func (s *replyService) Create(ctx context.Context, r *define.ReplyServiceCreateReq) error {
    ...
}

```

此外，约定俗成的，方法的最后一个返回参数往往是 `error` 类型。如果您确定此方法内部永不会产生 `error`，那么可以忽略。

### `Context` 对象获取

通过 `service` 中封装的以下方法，将 `context.Context` 上下文变量传递进去即可。 `context.Context` 上下文变量在 `GoFrame` 框架的 `HTTP` 请求中可以通过 `r.Context()` 方法获取，在 `GRPC` 请求中，编译生成的 `pb` 文件中执行方法的第一个参数即固定是 `context.Context`。

```go
service.Context.Get(ctx)
```

### 自定义 `Key-Value`

通过以下方式设置/获取自定义的 `key-value` 键值对。

```go
// 设置自定义键值对
service.Context.Get(ctx).Data[key] = value

...

// 获取自定义键值对
service.Context.Get(ctx).Data[key]
```

## 五、注意事项

1. 上下文变量只传递必须的链路参数数据，不要什么参数都往里面塞。特别是一些方法参数传参的数据，别往里面塞，而应当显示传递方法参数。
2. 上下文变量仅用作运行时临时使用，不可持久化存储长期使用。例如将 `ctx` 序列化后存储到数据库，并再下一次请求中读取出来反序列化使用是错误做法。