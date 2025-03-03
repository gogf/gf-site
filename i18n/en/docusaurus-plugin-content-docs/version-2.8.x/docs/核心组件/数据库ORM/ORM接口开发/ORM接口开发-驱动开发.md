---
slug: '/docs/core/gdb-interface-driver'
title: 'ORM Interface - Driver'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame framework, database driver, custom driver, interface development, driver development, database component, gdb module, Driver interface, ORM]
description: "ORM interface development in the GoFrame framework, specifically for database driver development and registration. By implementing the interface of the gdb module, you can add third-party database drivers not supported by GoFrame by default or customize existing drivers, ensuring consistency in upper-layer business operations. This document provides detailed steps and sample code to help developers get started quickly."
---

The significance of the framework's database component driver is that the various methods of upper-layer business operations with the database do not change, and you can switch to a new database by simply modifying the database type in the configuration.

We can achieve the design of interfaces in the database component to add third-party database drivers not supported by the framework by default or customize existing drivers. The development of a driver is not about fully developing a database protocol implementation code, but rather using an existing third-party database driver and integrating it with the framework's database component by implementing its interface, ensuring consistency in upper-layer operations.

## Driver Registration

We previously mentioned the `Driver` interface. After implementing this interface, we can register a custom driver to the `gdb` module through the following method:

```go
// Register registers custom database driver to gdb.
func Register(name string, driver Driver) error
```

The driver name `name` can be an existing driver name, such as `mysql`, `mssql`, `pgsql`, etc. When a driver with the same name is registered, the new driver will overwrite the old one.

## Driver Implementation

Developing a custom driver and registering it to the `gdb` module is very simple. You can refer to the database type code examples already connected in the `gdb` module source code: [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

It should be noted that the most common way to develop or modify a driver is to directly inherit from the existing `*Core` type, as the `Driver` interface will pass this type of object, for example:

```go
// DriverMysql is the driver for mysql database.
type DriverMysql struct {
    *Core
}

// New creates and returns a database object for mysql.
// It implements the interface of gdb.Driver for extra database driver installation.
func (d *DriverMysql) New(core *Core, node *ConfigNode) (DB, error) {
    return &DriverMysql{
        Core: core,
    }, nil
}
```

## Considerations

A new driver should at least implement the following interface methods:

| Interface Method | Description |
| --- | --- |
| `Open` | Used to create a database connection. |
| `GetChars` | Used to get the safety/escape symbols of the database. |
| `Tables` | Returns the list of tables in the current/specified database. |
| `TableFields` | Returns field list information for the specified table. |