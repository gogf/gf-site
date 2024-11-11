---
slug: '/docs/core/gdb-config-faq'
title: 'ORM使用配置-常见问题'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,数据库加密,自定义Driver,mysql,密码解密,配置文件加密,ORM接口开发,数据库账号保护,数据库连接]
description: '在GoFrame框架中实现数据库账号密码在配置文件中的加密，避免敏感信息泄露。用户可以通过自定义Driver的方式，在连接数据库时对加密的字段进行解密处理。以mysql为例，代码示例展示了如何包裹mysql driver并覆盖其Open方法，确保数据库连接的安全性与灵活性。'
---

## 如何实现数据库账号密码在配置文件中加密

在某些场景下，数据库的账号密码无法明文配置到配置文件中，需要进行一定的加密。在连接数据库的时候，
再对配置文件中加密的字段进行解密处理。这种需求可以通过自定义 `Driver` 来实现（关于 `Driver` 的详细介绍请参考章节：
[ORM接口开发](../ORM接口开发/ORM接口开发.md)）。以 `mysql` 为例，我们可以自己编写一个 `Driver`，包裹框架社区组件中的 `mysql driver`，并且覆盖它的 `Open` 方法即可。代码示例：

```go
import (
	"database/sql"

	"github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/database/gdb"
)

type MyBizDriver struct {
	mysql.Driver
}

// Open creates and returns an underlying sql.DB object for mysql.
// Note that it converts time.Time argument to local timezone in default.
func (d *MyBizDriver) Open(config *gdb.ConfigNode) (db *sql.DB, err error) {
	config.User = d.decode(config.User)
	config.Pass = d.decode(config.Pass)
	return d.Driver.Open(config)
}

func (d *MyBizDriver) decode(s string) string {
	// 执行字段解密处理逻辑
	// ...
	return s
}
```