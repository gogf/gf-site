# ORM使用配置-常见问题

## 如何实现数据库账号密码在配置文件中加密

在某些场景下，数据库的账号密码无法明文配置到配置文件中，需要进行一定的加密。在连接数据库的时候，
再对配置文件中加密的字段进行解密处理。这种需求可以通过自定义 `Driver` 来实现（关于 `Driver` 的详细介绍请参考章节：
[ORM接口开发](https://goframe.org/docs/core/gdb-interface.md)）。以 `mysql` 为例，我们可以自己编写一个 `Driver`，包裹框架社区组件中的 `mysql driver`，并且覆盖它的 `Open` 方法即可。

这里有一个完整的可运行示例代码：https://goframe.org/examples/database/encoded-pass

> 页面: https://goframe.org/docs/core/gdb-config-faq
