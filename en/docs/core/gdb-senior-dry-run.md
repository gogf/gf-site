# ORM Senior - Dry Run

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

> Page: https://goframe.org/en/docs/core/gdb-senior-dry-run
