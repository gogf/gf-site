---
slug: '/docs/core/gdb-senior-dry-run'
title: 'ORM Senior - Dry Run'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Dry Run Feature, DryRun, SQL, Debug Mode, Log Output, Database, Configuration Example]
description: "The ORM dry run feature in the GoFrame framework can be enabled through the DryRun configuration, which allows developers to debug SQL statements without executing actual write, update, or delete operations. This article provides detailed configuration examples and demonstrates how to globally modify this feature's usage through command-line arguments and environment variables, assisting developers in verifying the correctness of SQL execution during development."
---

The `ORM` dry run can be enabled through the `DryRun` configuration option, and it is disabled by default. When the `ORM` dry run feature is enabled, read operations will be committed, while write, update, and delete operations will be ignored. This feature is often used in conjunction with debug mode and log output to verify whether the `SQL` executed by the current program (especially scripts) meets expectations. Below is a configuration example with the dry run feature enabled:

```yaml
database:
  default:
  - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug:  true
    dryRun: true
```

The dry run feature can also be globally modified via command-line parameters or environment variables:

1. Command-line startup parameter - `gf.gdb.dryrun=true`.
2. Specific environment variable - `GF_GDB_DRYRUN=true`.

For example:

```bash
$ ./app --gf.gdb.dryrun=true
```

```bash
$ ./app --gf.gdb.dryrun true
```