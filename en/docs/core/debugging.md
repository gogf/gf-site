# Debug Mode

## Introduction

The various components of the `goframe` framework print out some debug information at key functional nodes, originally only for internal developers to use during the development phase. Due to its powerful capabilities, starting from version `v1.10.0` of the `goframe` framework, it is fully open to all framework users.

In debug mode, the debug information printed by the framework will be prefixed with `[INTE]` log level and output to the terminal standard output, and it will print the name of the source file and the line number of the code, for example:

```html
2021-04-14 15:24:52.954 [INTE] gdb_driver_mysql.go:49 Open: root:12345678@tcp(127.0.0.1:3306)/test
2021-04-14 15:24:52.954 [INTE] gdb.go:492 open new connection success, master:false, config:&gdb.ConfigNode{Host:"", Port:"", User:"", Pass:"", Name:"", Type:"mysql", Role:"", Debug:false, Prefix:"", DryRun:false, Weight:0, Charset:"", LinkInfo:"root:12345678@tcp(127.0.0.1:3306)/test", MaxIdleConnCount:0, MaxOpenConnCount:0, MaxConnLifeTime:0, QueryTimeout:0, ExecTimeout:0, TranTimeout:0, PrepareTimeout:0, CreatedAt:"", UpdatedAt:"", DeletedAt:"", TimeMaintainDisabled:false}, node:&gdb.ConfigNode{Host:"", Port:"", User:"", Pass:"", Name:"", Type:"mysql", Role:"", Debug:false, Prefix:"", DryRun:false, Weight:0, Charset:"utf8", LinkInfo:"root:12345678@tcp(127.0.0.1:3306)/test", MaxIdleConnCount:0, MaxOpenConnCount:0, MaxConnLifeTime:0, QueryTimeout:0, ExecTimeout:0, TranTimeout:0, PrepareTimeout:0, CreatedAt:"", UpdatedAt:"", DeletedAt:"", TimeMaintainDisabled:false}
```

## Features Enabling

By default, this debug information is turned off and does not affect the framework's performance. Framework developers and users can enable it through the following methods:

1. Command line startup parameter \- `gf.debug=true`.
2. Specified environment variable \- `GF_DEBUG=true`.
3. After `GoFrame v1.14.0`, use the `g.SetDebug` method in the program startup `boot` package to manually toggle on/off. This method is not thread-safe, which means you cannot call this method dynamically in asynchronous multi-coroutines at runtime to set the debug mode.

**Tip**

You can find that many functional modules of the `goframe` framework are also configured in the form of **command line startup parameters + environment variables** according to certain rules 🐸.

**Info**

It is important to note that key debug information of each module of the framework will only output to the **terminal standard output** and is not supported for output to log files.

## Usage Example

### Enable Debug Mode via Environment Variables

Take `Goland IDE` as an example, just add the `GF_DEBUG` environment variable in the running template.

### Enable Debug Mode via Command Line Parameters

Simply start the program with `--gf.debug=true`, for example:

```bash
$ ./app --gf.debug=true
```

```bash
$ ./app --gf.debug true
```

Alternatively,

```bash
$ ./app --gf.debug=1
```

```bash
$ ./app --gf.debug 1
```

> Page: https://goframe.org/en/docs/core/debugging
