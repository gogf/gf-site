---
slug: '/docs/cli/pack'
title: 'Resource Packing'
sidebar_position: 7
hide_title: true
keywords: [GoFrame, GoFrame framework, resource packaging, CLI tools, gf pack, resource files, go code files, file packaging, command line tools, source code management]
description: "This document introduces how to use the gf pack command in the GoFrame framework to package any file into a resource file or Go code file. Through this tool, users can achieve resource packaging and distribute it along with the executable file. Additionally, the gf pack command can be combined with the build command to achieve packaging and compiling in one step. The document provides a detailed list of usage methods and option explanations to help users better understand and use this feature."
--- 

## Usage

```text
$ gf pack -h
USAGE
    gf pack SRC DST

ARGUMENT
    SRC    source path for packing, which can be multiple source paths.
    DST    destination file path for packed file. if extension of the filename is ".go" and "-n" option is given,
           it enables packing SRC to go file, or else it packs SRC into a binary file.

OPTION
    -n, --name       package name for output go file, it's set as its directory name if no name passed
    -p, --prefix     prefix for each file packed into the resource file
    -k, --keepPath   keep the source path from system to resource file, usually for relative path
    -h, --help       more information about this command

EXAMPLE
    gf pack public data.bin
    gf pack public,template data.bin
    gf pack public,template packed/data.go
    gf pack public,template,config packed/data.go
    gf pack public,template,config packed/data.go -n=packed -p=/var/www/my-app
    gf pack /var/www/public packed/data.go -n=packed
```

This command is used to package any file into a resource file or a `Go` code file, allowing any file to be packaged and distributed along with the executable file. Additionally, the `build` command supports packaging and compiling in one step; please refer to the `build` command help for details. For an introduction to resource management, please refer to the [Resource](../核心组件/资源管理/资源管理.md) section.

## Examples

```text
$ gf pack public,template packed/data.go
done!
$ ll packed
total 184
-rw-r--r--  1 john  staff    89K Dec 31 00:44 data.go
```

## Further Reading

- [Resource - Best Practices](../核心组件/资源管理/资源管理-最佳实践.md)