---
slug: '/docs/core/gdb-senior-debugging'
title: 'ORM Senior - Debug Mode'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Debug Mode, SQL, Log, Database, Configuration Example, SetDebug, Debug Configuration]
description: "Using debugging mode with ORM advanced features in GoFrame framework. During development, you can enable debugging mode through the Debug configuration file option or SetDebug configuration method, allowing database SQL operation statements to be output at DEBUG level to the terminal or log file, facilitating developers in troubleshooting and performance optimization."
---

To facilitate debugging during the development phase, `GoFrame ORM` supports debugging mode, which can be enabled through the `Debug` configuration file option or the `SetDebug` configuration method. Subsequently, any database `SQL` operation statements will be output at the `DEBUG` level to the terminal or log files by the built-in log object. Below is a configuration example with debugging mode enabled:

```yaml
database:
  default:
  - link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug: true
```

Example of output log content:

```html
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  4 ms] [default] [rows:0  ] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:0  ] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [ 13 ms] [default] [rows:8  ] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith')
2021-05-22 21:12:10.792 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] COMMIT
```