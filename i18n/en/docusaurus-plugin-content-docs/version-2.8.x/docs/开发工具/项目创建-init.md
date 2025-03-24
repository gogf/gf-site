---
slug: '/docs/cli/init'
title: 'Project Scaffold'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame Framework, Project Creation, gf init, MonoRepo, GoFrame Empty Framework, Code Layer Design, go module, Resource Management, Microservice Monorepo Management Mode]
description: "Use the gf init command provided by the GoFrame framework to create a project. Starting from version v2, project creation is faster and no longer relies on remote sources; templates are built into the binary files. You can choose to initialize a single repository or monorepo project mode and flexibly adjust the generated directory structure to suit actual business needs."
---
:::tip
Starting from version `v2`, project creation no longer relies on remote retrieval. The repository templates are embedded into the tool's binary files via [Resource](../核心组件/资源管理/资源管理.md), making project creation very fast.
:::
## Usage

```text
$ gf init -h
USAGE
    gf init ARGUMENT [OPTION]

ARGUMENT
    NAME    The project name, creating a folder named NAME in the current directory, and the module name will also be NAME

OPTION
    -m, --mono    Initialize monorepo mode
    -a, --monoApp Initialize a small repository under monorepo
    -u, --update  Use the latest framework version after initialization
    -g, --module  Customize module
    -h, --help    More help

EXAMPLE
    gf init my-project
    gf init my-mono-repo -m
```

We can use the `init` command to generate a sample `GoFrame` empty framework project in the current directory and provide a project name parameter. The generated project directory structure is for reference only and can be adjusted according to the specific situation of the business project. For the generated directory structure, please refer to the [Code Layering](../框架设计/工程开发设计/代码分层设计.md) section.
:::note
The `GoFrame` framework development recommends the unified use of the official `go module` feature for dependency package management, so there is also a `go.mod` file in the root directory of the empty project.
:::
:::tip
The project directory uses a generalized design, and in actual projects, you can increase or decrease the directories given by the template as needed. For example, in scenarios where there is no need for `kubernetes` deployment, simply delete the corresponding `deploy` directory.
:::

## Examples of Use

### Initialize a project in the current directory

```bash
$ gf init .
initializing...
initialization done!
you can now run 'gf run main.go' to start your journey, enjoy!
```

### Create a project with a specified name

```bash
$ gf init myapp
initializing...
initialization done!
you can now run 'cd myapp && gf run main.go' to start your journey, enjoy!
```

### Create a `MonoRepo` project

By default, a `SingleRepo` project is created, but if needed, you can also create a `MonoRepo` project by using the `-m` option.

```bash
$ gf init mymono -m
initializing...
initialization done!
```

For an introduction to monorepos, please refer to the section: [Mono-Repo Management](../框架设计/工程开发设计/微服务大仓管理模式.md)

#### Create a `MonoRepoApp` project

If you need to create a small repository under a `MonoRepo`, specify the project path to be generated in the root directory of the repository project and use the `-a` option.

```bash
$ gf init app/user -a
initializing...
initialization done!
```