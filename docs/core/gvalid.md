# 数据校验

## 基本介绍

GoFrame 框架提供了功能强大、使用便捷、灵活易扩展的数据和表单校验组件，由 `gvalid` 组件实现。`gvalid` 组件实现了非常强大的数据校验功能，内置了数十种常用的校验规则，支持单数据多规则校验、多数据多规则批量校验、自定义错误信息、自定义正则校验、自定义校验规则注册、支持 `i18n` 国际化处理、支持 `struct tag` 规则及提示信息绑定等等特性，是目前功能最强大的 Go 数据校验模块。

**提示**

数据校验设计的灵感来源于经典的 `PHP Laravel` 框架 [https://laravel.com/docs/8.x/validation](https://laravel.com/docs/8.x/validation) 感谢 `Laravel` ❤️

**使用方式**：

```go
import "github.com/gogf/gf/v2/util/gvalid"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid](https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid)

## 组件特性

`gvalid` 组件具有以下显著特性：

- 内置数十种常见数据校验规则，支持大部分业务场景
- 支持 `Server` 层及命令行组件自动化校验
- 支持基础类型及复杂对象类型参数校验
- 支持顺序校验、灵活的校验结果处理
- 支持自定义校验错误提示
- 支持结构体属性递归校验
- 支持自定义校验规则
- 支持 `I18n` 国际化特性

## 相关文档

子页面：

- [数据校验-校验规则](https://goframe.org/docs/core/gvalid-rules.md)
- [数据校验-校验对象](https://goframe.org/docs/core/gvalid-validator.md)
- [数据校验-校验结果](https://goframe.org/docs/core/gvalid-result-handling.md)
- [数据校验-可选校验](https://goframe.org/docs/core/gvalid-optional-rule.md)
- [数据校验-递归校验](https://goframe.org/docs/core/gvalid-recursive-validating.md)
- [数据校验-自定义错误](https://goframe.org/docs/core/gvalid-custom-validating-message.md)
- [数据校验-方法介绍](https://goframe.org/docs/core/gvalid-funcs.md)
- [数据校验-常见问题](https://goframe.org/docs/core/gvalid-faq.md)
- [数据校验-参数类型](https://goframe.org/docs/core/gvalid-parameter-type.md)
- [数据校验-自定义规则](https://goframe.org/docs/core/gvalid-custom-rules.md)

> 页面: https://goframe.org/docs/core/gvalid
