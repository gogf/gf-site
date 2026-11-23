# 类型转换

## 基本介绍

`GoFrame` 框架提供了非常强大易用的类型转换包 `gconv`，可以实现将常用数据类型转换为指定的数据类型，对常用基本数据类型之间的无缝转换，同时也支持任意类型到 `struct` 对象的转换。由于 `gconv` 模块内部大量优先使用了断言而非反射，因此执行的效率非常高。

**注意事项：**

`gconv` 包的主要目标是提供简便且高效的类型转换功能，开发者应当注意转换的输入参数以及当前使用的业务场景，部分方法如果转换失败，那么方法并不会返回错误原因，也不会产生 `panic`，而是直接以转换失败后的数值返回。因此，开发者往往需要结合返回值以及当前使用的业务场景来综合判断结果的正确性。

**使用方式：**

```go
import "github.com/gogf/gf/v2/util/gconv"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)

**方法列表：**

方法列表可能滞后于代码，详情请查看接口文档。

## 相关文档

子页面：

- [类型转换-基本类型](https://goframe.org/docs/core/gconv-basic.md)
- [类型转换-Map转换](https://goframe.org/docs/core/gconv-map.md)
- [类型转换-Struct转换](https://goframe.org/docs/core/gconv-struct.md)
- [类型转换-Structs转换](https://goframe.org/docs/core/gconv-structs.md)
- [类型转换-Scan转换](https://goframe.org/docs/core/gconv-scan.md)
- [类型转换-Converter](https://goframe.org/docs/core/gconv-converter.md)
- [类型转换-自定义类型转换](https://goframe.org/docs/core/gconv-register-converter-func.md)
- [类型转换-UnmarshalValue](https://goframe.org/docs/core/gconv-unmarshal-value.md)
- [类型转换-性能测试](https://goframe.org/docs/core/gconv-benchmark.md)

> 页面: https://goframe.org/docs/core/gconv
