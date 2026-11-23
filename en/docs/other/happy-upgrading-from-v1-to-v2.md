# Happily Upgrade from v1 to v2

## Preliminary Remarks

The `GoFrame` framework has released version `v2`, marking a milestone with numerous new features and significant improvements, as well as some pioneering features.

For new users, please start directly with `v2`. For existing users, it's highly recommended to upgrade from `v1` to `v2`, for greater stability and reliability.

Key points to note for the `v2` upgrade:

1. To ensure compatibility and in accordance with the official `Golang` module management norms, we have changed the `import` paths, hence a global replacement of `import` paths is required.
2. Given this is a major upgrade, some methods have been removed or updated, rest assured that better alternatives are provided.
3. Generally, after upgrading, simply recompile and modify the code according to the compilation error messages to complete the upgrade.
4. The `gredis` component supports clustering, thus changes in configuration need attention.

We have not provided an upgrade tool as we believe that a guide is sufficient.

## Compatibility Between v1 and v2

To ensure project compatibility, it is possible to simultaneously depend on both `v1` and `v2` versions. Therefore, we have released the last version `v1.16.7` of `v1`, which you can upgrade to if needed. This release addresses the common issue of `client_tracing.go:73:3: undefined: attribute.Any`. However, depending on both versions of `GoFrame` might reduce project maintainability, and it's suggested to upgrade to `v2` as soon as possible.

## Replace Dependencies with v2

Globally replace the source code as follows:

```go
"github.com/gogf/gf/ => "github.com/gogf/gf/v2/
```

Like this:

## Download the Latest v2 Version

```bash
go get -u github.com/gogf/gf/v2@latest
```

## Project Directory Adjustments

If you are using the officially recommended project directory structure of `GoFrame`, you can manually adjust to the latest directory structure: [Project Structure🔥](https://goframe.org/en/docs/design/project-structure.md)

Note that the latest `cli` tool no longer supports the creation of projects with the old directory structure.

## Compilation and Running Modifications

Run your project, and if you encounter compilation problems, manually modify them according to the error messages, iterating as necessary.

If you're unsure how to modify, leave a comment on this document, and our community team will assist you with the upgrade.

## Important Changes to the CLI

1. The `swagger` command has been removed. In the `v1` version, the `gf swagger` command automatically installed a third-party `swag` tool to parse annotations in source code to generate `swagger` documents. This method of document management and maintenance has issues: it only supports the `Swagger2.0` protocol, has a poor usage experience, and maintaining annotations in sync with code is difficult, leading to inconsistencies between interface documentation and code. With standard routes in the new version, this command is discarded. If you need to continue using this function, manually install the third-party `swag` tool: [https://github.com/swaggo/swag](https://github.com/swaggo/swag)
2. The `update` command has been removed. Starting from version `v2`, the installation and download of the `CLI` tool are unified via `github`, reducing maintenance workload. The command may be reintroduced in the future.

## Some Important Notes

1. The `gf-cli` repository has been moved to the main `gf` repository for maintenance, ensuring tools and framework versions are in sync. The original repository is no longer maintained. For details, see: [https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)
2. Core framework components adopt an interface design to ensure wide applicability of interfaces, with some minor reductions in exposed methods.
3. Extensive use of the `gvar` generic in core framework components enhances usability, masking specific type implementations at the lower level. For stability and usability, the framework will not consider using the official `Golang` generics within the next `2-3` years. The official generics have value for modification in certain features of some framework components.

> Page: https://goframe.org/en/docs/other/happy-upgrading-from-v1-to-v2
