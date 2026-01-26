---
slug: '/docs/design/context-variable'
title: 'Context Shared Variables'
sidebar_position: 10
hide_title: true
keywords: [GoFrame, GoFrame Framework, Context, Context Variables, Shared Variables, Asynchronous IO, HTTP Requests, Session Management, User Information, Middleware]
description: "Transmitting and managing shared variables in context flow using Context from the GoFrame framework. In Go network applications, especially in HTTP/RPC services, Context is a key tool for transmitting asynchronous IO control and context variables. Through the sharing of structured objects, this article demonstrates how to achieve variable transmission during the request process, ensuring consistency and flexibility of variables in the request chain."
---

`Context` refers to the standard library `context.Context`, which is an interface object commonly used for **asynchronous IO control** and **transmission of context flow variables**. This article aims to demonstrate how to use `Context` to transmit inter-process shared variables.

In the execution flow of `Go`, especially in `HTTP/RPC` execution flows, there is no "global variable" method to obtain request parameters; instead, context `Context` variables are passed to subsequent process methods, and `Context` variables contain all the shared variables needed. Moreover, the shared variables in this `Context` should be agreed upon in advance and are often stored in the form of object pointers.

Sharing variables through `Context` is very simple. Here, we demonstrate how to transmit and use general shared variables in a practical project through an example in a project.

## 1. Structure Definition

Context objects often store some variables that need to be shared, and these variables are usually stored in structured objects for easy maintenance. For example, we define shared variables in the `model` in a context:

```go
const (
    // Key name to store context variables, shared by front and back systems
    ContextKey = "ContextKey"
)

// Request context structure
type Context struct {
    Session *ghttp.Session // Current Session management object
    User    *ContextUser   // Context user information
    Data    g.Map          // Custom KV variables set according to business module needs, not fixed
}

// User information in the request context
type ContextUser struct {
    Id       uint   // User ID
    Passport string // User account
    Nickname string // User name
    Avatar   string // User avatar
}
```

Where:

1. `model.ContextKey` constant represents the key name stored in the `context.Context` variable, used to store/retrieve business custom shared variables from the transmitted `context.Context` variable.
2. `Session` in `model.Context` structure represents the `Session` object of the current request. In the `GoFrame` framework, each `HTTP` request object has an empty `Session` object, which adopts lazy initialization design and is initialized only when real read and write operations are performed.
3. `User` in `model.Context` structure represents the basic information of the currently logged-in user, with data available only after user login; otherwise, it is `nil`.
4. `Data` attribute in `model.Context` structure is used to store custom `KV` variables, so developers generally do not need to add custom key-value pairs to `context.Context`, but directly use this `Data` attribute of the `model.Context` object. See details in later sections.

## 2. Logical Encapsulation

The context object is also related to business logic, so we need to encapsulate the context variables with a `service` object for easy use by other modules.

```go
// Context management service
var Context = new(contextService)

type contextService struct{}

// Initialize context object pointer into context object for subsequent request flow modifications.
func (s *contextService) Init(r *ghttp.Request, customCtx *model.Context) {
    r.SetCtxVar(model.ContextKey, customCtx)
}

// Get context variables, return nil if not set
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

// Set context information into context request, note it's complete overwrite
func (s *contextService) SetUser(ctx context.Context, ctxUser *model.ContextUser) {
    s.Get(ctx).User = ctxUser
}
```

## 3. Context Variable Injection

Context variables must be injected into the request flow at the very beginning of the request to be available for other method calls. In `HTTP` requests, we can achieve this with `GoFrame` middleware. For `GRPC` requests, interceptors can be used. We can define this in the `middleware` management object in the `service` layer as follows:

```go
// Custom context object
func (s *middlewareService) Ctx(r *ghttp.Request) {
    // Initialize, must be executed first
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
    // Pass the custom context object to template variables for use
    r.Assigns(g.Map{
        "Context": customCtx,
    })
    // Execute the next request logic
    r.Middleware.Next()
}
```

This middleware initializes a user-executed flow shared object, and the object stored in the `context.Context` variable is a pointer type `*model.Context`. By fetching this pointer anywhere, you can both access and modify the data within.

If there is stored user login information in `Session`, the required shared user basic information will also be written into `*model.Context`.

## 4. Context Variable Usage

### Method Definition

By convention, the first input parameter of a method is often reserved for `context.Context` type parameters to accept context variables, especially in the `service` layer methods. For example:

```go
// Execute user login
func (s *userService) Login(ctx context.Context, loginReq *define.UserServiceLoginReq) error {
    ...
}

// Query content list
func (s *contentService) GetList(ctx context.Context, r *define.ContentServiceGetListReq) (*define.ContentServiceGetListRes, error) {
    ...
}

// Create reply content
func (s *replyService) Create(ctx context.Context, r *define.ReplyServiceCreateReq) error {
    ...
}
```

Moreover, by convention, the last return parameter of a method is often of `error` type. If you are sure that there will never be an `error` inside this method, you can ignore it.

### `Context` Object Retrieval

Using the following method encapsulated in `service`, you can pass the `context.Context` variable. In the `GoFrame` framework's `HTTP` request, you can get the `context.Context` variable through the `r.Context()` method, and in `GRPC` requests, the first parameter of the methods generated in the compiled `pb` files is fixed as `context.Context`.

```go
service.Context.Get(ctx)
```

### Custom Key-Value

Set/Get custom key-value pairs via:

```go
// Set custom key-value pair
service.Context.Get(ctx).Data[key] = value

...

// Get custom key-value pair
service.Context.Get(ctx).Data[key]
```

## 5. Precautions

1. Only pass required link parameter data in context variables, don't put everything in them. Especially for some method argument passing data, not everything should be put into them; instead, explicit parameter transmission should be used.
2. Context variables should only be used for temporary runtime use and not for long-term persistent storage. For example, serializing `ctx` and storing it in a database, then deserializing it for use in the next request is incorrect.