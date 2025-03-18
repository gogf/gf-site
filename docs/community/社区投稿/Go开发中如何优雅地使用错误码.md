---
slug: "/articles/use-error-code-gracefully-in-golang"
title: "Go开发中如何优雅地使用错误码"
hide_title: true
keywords: ["goframe", "error code", "gerror", "error handling", "go", "best practices"]
description: "本文详细探讨了错误码的发展历史、使用场景及最佳实践，并结合 GoFrame 框架的 gerror 组件进行实践指导"
---

## 错误码的发展历史

错误码的概念可以追溯到计算机系统的早期。在操作系统层面，错误码通常以整数形式存在，如 `Unix` 系统的返回值和 `errno`。

### 从操作系统到应用层

在 `Unix/Linux` 系统中，错误码以 `errno` 的形式存在，每个错误码对应一个特定的错误情况，如 `ENOENT`（文件不存在）、`EPERM`（权限不足）等。这种错误码机制为后来的应用开发建立了基础。

### HTTP 状态码

随着`Web`的发展，`HTTP`协议引入了状态码机制，如 `200 OK`、`404 Not Found`、`500 Internal Server Error`等。这些状态码成为了`Web`应用中错误处理的标准。

### 微服务错误码

在微服务架构中，错误码变得更加复杂和结构化。现代系统通常采用多层次的错误码结构，包含服务标识、模块标识和具体错误码。

## 为什么要使用错误码

在现代软件开发中，错误码已经成为不可或缺的组成部分。使用错误码有以下几个重要原因：

### 1. 标准化错误处理

- **系统化的错误识别**：错误码允许系统快速识别和分类错误，而不需要解析错误消息文本。
  
    ```go
    // 使用错误码进行条件判断
    if err := doSomething(); err != nil {
        if code := gerror.Code(err); code == CodeUserNotFound {
            // 处理用户不存在的情况
        } else if code == CodePermissionDenied {
            // 处理权限不足的情况
        }
    }
    ```

- **自动化处理**：可以基于错误码实现自动化的错误处理和监控策略。

  ```go
  // 中间件中的错误处理
  func ErrorHandlerMiddleware(r *ghttp.Request) {
      r.Middleware.Next()
      if err := r.GetError(); err != nil {
          code := gerror.Code(err)
          // 根据错误码进行分类处理
          switch code {
          case CodeUnauthorized:
              r.Response.WriteStatus(http.StatusUnauthorized)
          case CodeForbidden:
              r.Response.WriteStatus(http.StatusForbidden)
          default:
              r.Response.WriteStatus(http.StatusInternalServerError)
          }
          // 记录错误日志
          g.Log().Error(r.Context(), err)
      }
  }
  ```

### 2. 国际化支持

- **语言无关性**：错误码可以映射到不同语言的错误信息，实现国际化。

  ```go
  // 使用 gi18n 的中间件实现
  func ErrorI18nMiddleware(r *ghttp.Request) {
      r.Middleware.Next()
      // 获取错误
      if err := r.GetError(); err != nil {
          // 获取错误码
          code := gerror.Code(err)
          // 获取请求语言
          lang := r.GetHeader("Accept-Language")
          if lang == "" {
              lang = "en-US" // 默认语言
          }
          ctx := gi18n.WithLanguage(r.Context(), lang)
          // 使用 gi18n 获取本地化错误信息
          message := gi18n.Translate(ctx, code)
          // 返回标准响应
          r.Response.WriteJson(ghttp.DefaultHandlerResponse{
              Code:    code,
              Message: message,
          })
      }
  }
  ```

### 3. 接口契约

- **前后端一致性**：错误码作为前后端交互的标准协议，确保了接口的一致性。前端可以根据后端返回的错误码，在展示层做出不同的交互行为。例如在以下示例中，前端会根据用户未登录的错误码，引导用户进一步去执行登录流程。
  ```json
  // API 响应格式
  {
      "code": 1001,
      "message": "用户未登录",
      "data": null
  }
  ```
  

- **版本兼容**：错误码有助于维护`API`的版本兼容性，即使错误信息发生变化。

### 4. 安全性考量

- **敏感信息隐藏**：错误码可以帮助隐藏敏感信息，避免将内部实现细节暴露给用户，例如数据库SQL执行报错信息。

- **防止信息泄露**：直接返回异常栈信息可能会泄露系统结构，如系统架构、文件路径、代码行号等，而错误码可以避免这一点。


## 整型与字符串错误码

错误码的类型常见有两种：**整型**与**字符串型**。在`Go`开发中，选择使用整型还是字符串作为错误码需要根据具体场景和需求来决定。以下是一些指导原则和最佳实践。

### 1. 整型错误码

整型错误码是最常见的选择，在传统的通信业务中，主要是为了通过整型错误码减少网络带宽通信流量，具有以下特点：

- **性能优势**：整型比较比字符串比较更快，在频繁进行错误码判断的场景中能提高性能
- **存储效率**：整型占用内存更少，更适合需要存储大量错误码的场景
- **兼容性**：整型错误码更容易与其他系统进行集成和互操作
- **可排序**：整型错误码可以方便地进行排序和范围判断

```go
// 整型错误码示例
// 使用gcode能够有效做整形与字符串转换映射维护
var (
    CodeSuccess       = gcode.New(0, "success", nil)
    CodeUserNotLogin  = gcode.New(10001, "user not login", nil)
    CodeUserNotFound  = gcode.New(10002, "user not found", nil)
)

func HandleError(err error) {
    if code := gerror.Code(err); code == CodeUserNotLogin {
        // 处理非法输入
    }
}
```

**适用场景**：
- 高性能要求的系统
- 需要与其他系统集成的场景
- 需要存储大量错误码的场景

### 2. 字符串错误码

字符串错误码在某些特定场景下也有其优势：

- **可读性**：字符串错误码更具描述性，方便开发者理解和调试
- **灵活性**：可以包含更多信息，如模块名称、错误类型等
- **扩展性**：无需预先定义所有错误码，适合快速迭代的场景

```go
// 字符串错误码示例
// 使用gcode时忽略整型错误码参数
// 使用字符串描述字段作为错误码，可以选择附加详细描述字段
var (
    ErrInvalidEmail = gcode.New(0, "user.invalid_email", nil)
    ErrUserBlocked  = gcode.New(0, "user.blocked", nil)
)

func ValidateUser(user User) error {
    if !isValidEmail(user.Email) {
        return gerror.NewCode(ErrInvalidEmail)
    }
    return nil
}
```

**适用场景**：
- 需要高度可读性和描述性的场景
- 快速迭代的原型开发
- 需要灵活扩展错误码的场景

### 3. 选择建议

在选择错误码类型时，可以参考以下决策树：

1. 是否需要与其他系统集成？
   - 是 → 优先选择整型错误码
   - 否 → 进入下一步
2. 是否有高性能要求？
   - 是 → 优先选择整型错误码
   - 否 → 进入下一步
3. 是否需要快速迭代和灵活扩展？
   - 是 → 优先选择字符串错误码
   - 否 → 进入下一步
4. 是否需要更好的可读性？
   - 是 → 优先选择字符串错误码
   - 否 → 选择整型错误码

### 4. 最佳实践

- **一致性**：在同一个项目中保持错误码类型的一致性
- **文档化**：无论选择哪种类型，都要有完善的文档说明
- **转换机制**：在需要同时支持两种类型的场景中，可以提供类型转换的方法
- **性能测试**：在性能敏感的场景中，进行基准测试来验证选择


## Go错误处理模式对比

### 1. 预定义错误管理

使用预定义的错误变量来表示特定错误情况的一种模式。这种模式简单明确，适用于基础库中的简单错误。

```go
// 定义 sentinel error
var ErrNotFound = errors.New("not found")

// 使用示例
func FindUser(id int) (*User, error) {
    user, exists := users[id]
    if !exists {
        return nil, ErrNotFound
    }
    return user, nil
}
```

**优点**：
- 简单易用
- 错误判断直接（`err == ErrNotFound`）

**缺点**：
- 缺乏上下文信息
- 难以扩展和组合

**适用场景**：基础库、简单错误场景

### 2. 自定义错误类型

通过定义具体错误类型来携带更丰富的错误信息。这种模式适用于需要传递额外上下文的复杂业务错误。

```go
// 定义错误类型
type NotFoundError struct {
    Resource string
    ID       int
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}

// 使用示例
func FindOrder(id int) (*Order, error) {
    order, exists := orders[id]
    if !exists {
        return nil, &NotFoundError{Resource: "order", ID: id}
    }
    return order, nil
}
```

**优点**：
- 携带丰富上下文信息
- 支持类型断言和错误分类

**缺点**：
- 类型断言和类型检查较为繁琐
- 需要定义较多类型

**适用场景**：复杂业务错误、需要传递上下文的场景

### 3. `pkg/errors`包装

通过第三方库`pkg/errors`实现错误包装和堆栈跟踪，适用于需要错误追踪的场景。

```go
// 错误包装示例
func ProcessOrder(orderID int) error {
    order, err := FindOrder(orderID)
    if err != nil {
        return errors.Wrap(err, "failed to process order")
    }
    // ...
}

// 使用示例
func main() {
    err := ProcessOrder(123)
    if err != nil {
        fmt.Printf("%+v\n", err)  // 打印完整堆栈信息
    }
}
```

**优点**：
- 保留完整错误堆栈
- 支持错误链式追踪

**缺点**：
- 需要依赖第三方库
- 增加额外内存开销

**适用场景**：需要错误追踪和调试的场景

### 4. `gerror`错误码体系

`gerror`错误码体系是`GoFrame`框架提供的结构化错误处理机制，提供了灵活且丰富的错误处理能力，适用于企业级应用开发。

```go
// 错误码定义
var (
    CodeOrderNotFound = gcode.New(2001, "order not found", nil)
)

// 使用示例
func GetOrder(orderID int) (*Order, error) {
    order, exists := orders[orderID]
    if !exists {
        return nil, gerror.NewCode(CodeOrderNotFound)
    }
    return order, nil
}

// 错误处理
func HandleError(err error) {
    if code := gerror.Code(err); code == CodeOrderNotFound {
        // 处理订单不存在的情况
    }
}
```

**优点**：
- 结构化错误处理
- 支持错误码分类和管理
- 支持保留完整错误堆栈
- 支持错误链式追踪

**缺点**：
- 需要框架集成
- 增加额外内存开销

**适用场景**：需要错误追踪和调试、企业级应用开发、需要统一错误管理的场景


## 错误码的工程管理方式

以`GoFrame`框架官方推荐的项目工程结构为例。
- 业务模块独立的错误码需要由业务模块自身闭环维护。例如：
    - **用户**相关的错误码维护到`logic/user/user_errcode.go`中。
    - **订单**相关的错误码维护到`logic/order/order_errcode.go`中。  
- **通用**的错误码维护到`logic/errcode/errcode.go`中，便于各个业务模块复用。





### 1. 单体项目

```text
project
├── api             # 接口定义
├── internal        # 内部实现
│   ├── logic       # 业务逻辑
│   │   ├── errcode # 通用错误码定义
│   │   ├── user
│   │   └── order
...
```

### 2. 大仓项目

```text
monorepo
├── app         # 服务目录
│   ├── app1    # 服务1
│   ├── app2    # 服务2
├── utility     # 工具包
│   ├── errcode # 通用错误码定义
│   ├── utils   # 通用工具函数
...
```
需要注意，在`GoFrame`的大仓设计中，`utility` 目录并非严格区分业务和非业务代码。
我们推荐循序演进的项目架构设计，业务项目维护者可根据需要自行做区分。







## 错误码的最佳实践

设计一个好的错误码系统对于项目的可维护性和可扩展性至关重要。以下是一些实用的最佳实践。

### 1. 错误码设计原则

- **唯一性**：每个错误码应具有唯一性，避免冲突和混淆。
  
- **可读性**：错误码应具有一定的语义，便于开发者理解和记忆。
  
- **分层结构**：采用分层结构的错误码设计，例如「服务-模块-错误」的形式。例如：
  ```go
  错误码格式： AABBBCCC
  AA: 服务标识，如 10 表示用户服务
  BBB: 模块标识，如 001 表示认证模块
  CCC: 具体错误码，如 001 表示用户未登录
  例如：10001001 表示用户服务中的认证模块的用户未登录错误
  ```

- **可扩展性**：错误码体系应能支持后续扩展，预留足够的空间供未来使用。

### 2. 错误码分类与定义

在`GoFrame`项目中，我们可以将错误码分为不同的层级，可以通过不同的分类代码文件来维护。
我们只需要定义和维护错误码即可，**不建议定义具体的错误对象**，原因如下：
- 错误码与错误对象是一对多关系，不同的错误对象可以带有不同的错误信息，例如：```gerror.NewCodef(1001, `user "%s" not found`, userName)```。
- 错误对象应当在运行时动态创建，包含当前错误位置完整的错误堆栈，利于代码链式跟踪调试。
- 错误码利于在不同的服务间、层级间进行自然的传递，而错误对象仅适用于进程内。
- 当然，针对于一些不带错误码的基础库产生的错误对象，使用错误对象判断仍然具有意义，例如：`errors.Is(err, sql.ErrNoRows)`。需要开发者根据场景合理选择方案。

以下为错误码文件组织，以及错误码代码定义示例。
其中，我们通过`gcode`来创建错误码，并维护错误码整型数值与字符串描述信息的映射关系。
```go
// internal/logic/errors/errors_code.go

// 系统级别错误码
var (
    CodeSuccess       = gcode.New(0, "success", nil)          // 成功
    CodeUnknownError  = gcode.New(1, "unkhown", nil)          // 未知错误
    CodeNotAuthorized = gcode.New(401, "not authorized", nil) // 未授权
    CodeForbidden     = gcode.New(403, "forbidden", nil)      // 禁止访问
    CodeNotFound      = gcode.New(404, "not found", nil)      // 资源不存在
    CodeServerError   = gcode.New(500, "internal error", nil) // 服务器错误
    // ...
)
```

```go
// internal/logic/errors/errors_code_user.go

// 用户模块错误码 (10xx)
var (
    CodeUserNotFound    = gcode.New(1001, "user not found", nil)   // 用户不存在
    CodePasswordInvalid = gcode.New(1002, "invalid password", nil) // 密码错误
    CodeTokenExpired    = gcode.New(1003, "token expired", nil)    // 令牌过期
    CodeUserDisabled    = gcode.New(1004, "user disabled", nil)    // 用户已禁用
    CodeUserExists      = gcode.New(1005, "user exists", nil)      // 用户已存在
    // ...
)
```

```go
// internal/logic/errors/errors_code_order.go

// 订单模块错误码 (20xx)
var (
    CodeOrderNotFound  = gcode.New(2001, "order not found", nil) // 订单不存在
    CodeOrderPaid      = gcode.New(2002, "order paid", nil)      // 订单已支付
    CodeOrderCancelled = gcode.New(2003, "order cancelled", nil) // 订单已取消
    CodePaymentFailed  = gcode.New(2004, "payment failed", nil)  // 支付失败
    // ...
)
```

### 3. 实际使用示例

在业务逻辑中创建和处理错误：

```go
// internal/logic/user/user.go

// Login 用户登录
func (l *User) Login(ctx context.Context, username, password string) (string, error) {
    // 检查用户是否存在
    user, err := l.GetUserByUsername(ctx, username)
    if err != nil {
        return "", err
    }
    if user == nil {
        return "", gerror.NewCode(errors.CodeUserNotFound)
    }
    // 验证密码
    if !l.validatePassword(password, user.Password) {
        return "", gerror.NewCode(errors.CodePasswordInvalid)
    }
    // 生成令牌
    token, err := l.generateToken(user.Id)
    if err != nil {
        return "", gerror.Wrap(err, "generate token failed")
    }
    return token, nil
}
```

### 4. 在`API`层统一处理错误

在控制器中实现接口处理，并直接返回错误：

```go
// api/user/v1/user.go

// LoginReq 登录请求
type LoginReq struct {
    g.Meta `path:"/user/login" method:"post" tags:"user" summary:"用户登录"`
    Username string `v:"required#用户名不能为空"`
    Password string `v:"required#密码不能为空"`
}

// LoginRes 登录响应
type LoginRes struct {
    Token string `json:"token"`
}
```

```go
// internal/controller/user/user.go

// Login 用户登录接口
func (c *Controller) Login(ctx context.Context, req *v1.LoginReq) (*v1.LoginRes, error) {
    token, err := c.user.Login(ctx, req.Username, req.Password)
    if err != nil {
        return nil, err
    }
    return &v1.LoginRes{Token: token}, nil
}
```

在中间件中拦截错误，并做统一的错误封装返回：
```go
// internal/logic/middleware/middleware_response.go

// 中间件中的统一拦截处理
func (l *Logic) Response(r *ghttp.Request) {
    r.Middleware.Next()
    var (
        err  = r.GetError()
        res  = r.GetHandlerResponse()
        msg  = err.Error()
        code = gerror.Code(err)
    )
    r.Response.WriteJson(ghttp.DefaultHandlerResponse{
        Code:    code.Code(),
        Message: msg,
        Data:    res,
    })
}
```

## 分布式系统中的错误码实践

### 1. 跨服务错误传播

在微服务架构中，错误码需要穿越服务边界：

```go
// 错误码传播示例
type RpcError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Service string `json:"service"`
}

func WrapRpcError(code int, service string) error {
    return gerror.NewCode(code, gerror.Map{
        "service": service,
    })
}

// 网关层错误处理
func HandleUpstreamError(err error) {
    if gerror.HasCode(err, CodeServiceUnavailable) {
        // 触发熔断机制
        circuitBreaker.Trip()
    }
}
```

### 2. 错误码与重试策略

基于错误码制定智能重试策略：

| 错误码范围 | 重试策略               | 等待时间       |
|------------|------------------------|----------------|
| `500-599`    | 指数退避重试`3`次      | `100ms, 1s, 10s` |
| `400-499`    | 不重试                | -              |
| `100-199`    | 立即重试最多`5`次      | `50ms`          |

