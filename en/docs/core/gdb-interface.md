# ORM - Interface

The `gdb` module uses highly flexible and extensible interface design, allowing developers to easily customize implementations and replace any methods defined in the interface.

## `DB` Interface

Interface documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB)

The `DB` interface is the core interface for database operations and the most commonly used interface when using `ORM` to operate on databases. Here, we mainly explain several important methods of the interface:

1. The `Open` method is used to create a specific database connection object, returning the standard library's `*sql.DB` general database object.
2. The first parameter `link` of the `Do*` series methods is a `Link` interface object, which may be a master node object or a slave node object in a `master-slave` mode. Therefore, when using this `link` parameter in inherited driver object implementations, be aware of the current running mode. In most database master-slave modes, `slave` nodes are often not writable.
3. The `HandleSqlBeforeCommit` method will be called for some pre-commit callback processing when each `SQL` is submitted to the database server for execution.
4. For other interface methods, please refer to the interface documentation or source files.

## `DB` Interface Relationships

`GoFrame ORM Relations`

## `Driver` Interface

Interface documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Driver](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Driver)

Custom drivers need to implement the following interface:

```go
// Driver is the interface for integrating sql drivers into package gdb.
type Driver interface {
    // New creates and returns a database object for specified database server.
    New(core *Core, node *ConfigNode) (DB, error)
}
```

The `New` method is used to create a database operation object corresponding to the driver based on the `Core` database base object and the `ConfigNode` configuration object. It should be noted that the returned database object needs to implement the `DB` interface. The database base object `Core` has already implemented the `DB` interface, so developers only need to "inherit" the `Core` object and then override the corresponding interface implementation methods as needed.

## Documentation

Child pages:

- [ORM Interface - Callback](https://goframe.org/en/docs/core/gdb-interface-callback.md)
- [ORM Interface - Driver](https://goframe.org/en/docs/core/gdb-interface-driver.md)

> Page: https://goframe.org/en/docs/core/gdb-interface
