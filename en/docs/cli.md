# CLI Tool

The `GoFrame` framework provides a powerful `gf` command line development assistance tool, which is an important part of the framework's development. Tool link:

- [https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

Please refer to the repository page for tool installation. Once the tool is successfully installed, you can view all supported commands with `gf` or `gf -h`. For complex commands, you can view more detailed usage information with `gf COMMAND -h`, for example: `gf gen -h`.

## Tool Responsibilities

1. Simplify project development and improve development efficiency.
2. Support the accurate implementation of framework project design specifications.

## Considerations

1. Some commands require you to have a basic development environment for `Golang` installed. Please refer to the chapter [Installation](https://goframe.org/en/docs/install-go/index.md) for details on environment installation.
2. The latest version of the `CLI` tool will follow the latest version of the framework.

## Configuration Support

**All commands of the tool support configuration parameters through both command line and configuration file simultaneously to improve usability. Command line parameters take precedence; if they are not provided, the tool automatically reads the corresponding parameter names from the configuration file.**

The configuration file path prioritizes the `hack` directory in the current directory (`hack/config.yaml`), and then the framework's default configuration path. For the framework's default configuration file retrieval path, please refer to the chapter: [Configuration - File](https://goframe.org/en/docs/core/gcfg-file.md).

Example configuration file format:

```yaml
# GoFrame CLI tool configuration.
gfcli:
  gen:
    dao:
    - link:            "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
      tables:          "user"
      removePrefix:    "gf_"
      descriptionTag:  true
      noModelComment:  true

  docker:
    build: "-a amd64 -s linux -p temp"
    tagPrefixes:
    - ccr.ccs.tencentyun.com/xxx
    - hkccr.ccs.tencentyun.com/xxx
    - sgccr.ccs.tencentyun.com/xxx
```

Note that the above configuration example is for reference only. Please refer to specific command help for specific configuration items.

## Tool Debugging

When encountering issues during the tool's usage, you can try enabling the tool's debug mode to obtain more detailed execution log information. The debug mode can be enabled with the `debug` command line option, for example:

```bash
gf build main.go --debug
```

Since the `gf` tool is also developed using the `GoFrame` framework, the enabling of debug information is consistent with the framework method. For a more detailed introduction, please refer to the framework introduction document: [Debug Mode](https://goframe.org/en/docs/core/debugging.md)

## Command Overview

This help document uses `gf cli v2.0.0` as an example for a brief introduction. For detailed introduction information, please refer to the command line help. The information in this chapter may be delayed, so please refer to the tool help for the latest specific introductions.

```text
$ gf
USAGE
   gf COMMAND [OPTION]

COMMAND
   env        show current Golang environment variables
   run        running go codes with hot-compiled-like feature
   gen        automatically generate go files for dao/dto/entity/pb/pbentity...
   init       create and initialize an empty GoFrame project
   pack       packing any file/directory to a resource file, or a go file
   build      cross-building go project for lots of platforms
   docker     build docker image for current GoFrame project
   install    install gf binary to system (might need root/admin permission)
   version    show version information of current binary

OPTION
   -y, --yes        all yes for all command without prompt ask
   -v, --version    show version information of current binary
   -d, --debug      show internal detailed debugging information
   -h, --help       more information about this command

ADDITIONAL
    Use "gf COMMAND -h" for details about a command.
```

## Documentation

Child pages:

- [Installation](https://goframe.org/en/docs/cli/install.md)
- [Version Check](https://goframe.org/en/docs/cli/version.md)
- [Version Upgrade](https://goframe.org/en/docs/cli/up.md)
- [Project Scaffold](https://goframe.org/en/docs/cli/init.md)
- [Cross-Compiling](https://goframe.org/en/docs/cli/build.md)
- [Auto Compiling](https://goframe.org/en/docs/cli/run.md)
- [Resource Packing](https://goframe.org/en/docs/cli/pack.md)
- [Image Building](https://goframe.org/en/docs/cli/docker.md)
- [Compatibility Fix](https://goframe.org/en/docs/cli/fix.md)
- [Help Info](https://goframe.org/en/docs/cli/help.md)
- [Code Generating](https://goframe.org/en/docs/cli/gen.md)

> Page: https://goframe.org/en/docs/cli
