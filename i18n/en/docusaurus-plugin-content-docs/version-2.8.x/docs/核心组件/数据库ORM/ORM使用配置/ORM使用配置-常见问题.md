---
slug: '/docs/core/gdb-config-faq'
title: 'ORM Configuration - FAQ'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame framework, database encryption, custom Driver, mysql, password decryption, configuration file encryption, ORM interface development, database account protection, database connection]
description: "Implement database account password encryption in configuration files within the GoFrame framework to prevent the leakage of sensitive information. Users can decrypt the encrypted fields when connecting to the database by customizing a Driver. Using mysql as an example, the code examples demonstrate how to wrap the mysql driver and override its Open method to ensure the security and flexibility of database connections."
---

## How to Implement Database Account Password Encryption in Configuration Files

In certain scenarios, database account passwords cannot be configured in plaintext within configuration files and must be encrypted. During the database connection, the encrypted fields in the configuration file need to be decrypted. This requirement can be achieved by customizing a `Driver` (for detailed information about `Driver`, please refer to the chapter: [ORM - Interface](../ORM接口开发/ORM接口开发.md)). Taking `mysql` as an example, we can write our own `Driver`, wrap the `mysql driver` from the framework community components, and override its `Open` method. Code example:

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
    // Execute field decryption logic
    // ...
    return s
}
```