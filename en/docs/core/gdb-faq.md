# ORM - FAQ

## `driver: bad connection`

If this error occurs during database execution, it may be due to the local database connection pool connections having expired. You can check if the `MaxLifeTime` configuration set on the client exceeds the maximum timeout set by the database server. For more client configurations, please refer to the section: [ORM - Configuration](https://goframe.org/en/docs/core/gdb-config.md)

## `update/insert` operations ineffective

When using `orm`, in the configuration file:

```toml
dryRun = "(optional) ORM dry run (read-only, no write)"
```

This line of configuration must be deleted or set to 0

Otherwise, `update insert` operations will not be effective.

## `cannot find database driver for specified database type "xxx", did you misspell type name "xxx" or forget importing the database driver?`

The program code has not included the dependent database driver. It is important to note that from `GoFrame v2.1` onwards, community drivers need to be manually introduced. Please refer to:

- [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## After enabling `DEBUG` log for the database, `SQL` statements show `WHERE 0=1`

The occurrence of `WHERE 0=1` happens due to the presence of an array condition in the query condition with an array length of `0`. The `ORM` cannot automatically filter out these empty array conditions (such filtering might cause business exceptions). Developers need to explicitly call `OmitEmpty` or `OmitEmptyWhere` based on the business scenario to instruct the `ORM` to filter these empty array conditions.

## Emoji storage in MYSQL tables results in encoding issues

Solution:

In the `config.toml` file, set the database configuration `charset` to `utf8mb4` instead of the default `utf8`.

When storing emojis in `MySQL`, note the following:

- Database encoding is `utf8mb4`
- Table encoding is `utf8mb4`
- Content fields in the table are `utf8mb4`

> Page: https://goframe.org/en/docs/core/gdb-faq
