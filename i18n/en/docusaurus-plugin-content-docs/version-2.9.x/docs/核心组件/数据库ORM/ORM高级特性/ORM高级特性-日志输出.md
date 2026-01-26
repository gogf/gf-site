---
slug: '/docs/core/gdb-senior-logging'
title: 'ORM Senior - Logging'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM Logging, SQL Debugging, Log Configuration, Transaction ID, Database Driver, SQL Statement, Log Output, Debugging Tool]
description: "The log output functionality of the ORM component in the GoFrame framework is highlighted, explaining how to set logs using SetLogger and GetLogger methods, and how to enable log output in configuration files. The examples in the text demonstrate the SQL statement debugging process, including log level, execution time, SQL statements, and other detailed information, helping users better understand and debug database operations in applications."
---
:::danger
The output of `ORM` logs is formatted and displayed for reading and debugging before submitting to the underlying database `driver`. It formats and prints the chain operations or templates and execution parameters composed of `SQL`. Since the underlying `driver` may perform a secondary conversion of the submitted parameters, the log output here is for reference only and does not fully represent the actual SQL statements executed by the underlying layer.
:::
Log output often prints some debugging or `SQL` statements. The log object can be set via the `SetLogger/GetLogger` methods or configured in a configuration file. Please refer to the [ORM - Configuration](../ORM使用配置/ORM使用配置.md) section for log configuration. Below is a configuration example with log output enabled:

```yaml
database:
  logger:
  - path:   "/var/log/gf-app/sql"
    level:  "all"
    stdout: true
  default:
  - link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug: true
```
:::warning
Note that the keyword `logger` is used here as the name of the `ORM` log configuration item, so you cannot use this name as a database configuration group.
:::
The logs output by the `ORM` component are quite detailed. Let's look at an example:

```html
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  4 ms] [default] [rows:0  ] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:0  ] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [ 13 ms] [default] [rows:8  ] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith')
2021-05-22 21:12:10.792 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] COMMIT
```

As you can see, the log contains the following parts of information:

1. Date and time, accurate to the millisecond.
2. Log level. Since `SQL` logs are mainly used for function debugging/problem troubleshooting, it is often necessary to turn them off in a production environment. Therefore, the log level is fixed to the `DEBUG` level.
3. The execution time of the current `SQL`, from when the client makes a request to when the data is received, in milliseconds. If the execution time is less than `1` millisecond, it is displayed as `0` milliseconds.
4. The database configuration group where the current `SQL` is located, default is `default`. For an introduction to configuration groups, please refer to the section: [ORM - Configuration](../ORM使用配置/ORM使用配置.md).
5. The **Transaction ID** to which the current `SQL` belongs. If the current `SQL` does not belong to a transaction operation, this field is not present. For an introduction to Transaction IDs, please refer to the section: [ORM - Transaction](../ORM事务处理/ORM事务处理.md).
6. The specific `SQL` statement executed. It should be noted that since `SQL` pre-processing is used at the bottom, the `SQL` statement here is the result of automatic splicing by the component and is for reference only.