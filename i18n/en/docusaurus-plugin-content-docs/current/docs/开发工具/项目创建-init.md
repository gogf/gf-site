---
slug: '/docs/cli/init'
title: 'Project Creation - Init'
sidebar_position: 3
hide_title: true
---

:::tip
Starting from version `v2`, project creation no longer relies on remote retrieval; the repository templates have been built into the tool's binary file through [Resource Management](/docs/core/gres), making the project creation process extremely fast.

:::
## Usage

```bash
$ gf init -h
USAGE
    gf init ARGUMENT [OPTION]

ARGUMENT
    NAME    Project name, creates a folder named NAME in the current directory, and the module name is also NAME.

OPTION
    -m, --mono    Initialize a mono-repo
    -a, --monoApp Initialize a sub-repo within a mono-repo
    -u, --update  Use the latest framework version after initialization
    -g, --module  Customize module
    -h, --help    More help

EXAMPLE
    gf init my-project
    gf init my-mono-repo -m
```

We can use the `init` command to generate a sample `GoFrame` empty framework project in the current directory and provide a project name argument. The generated project directory structure is for reference only and can be adjusted according to the specific needs of the business project. For the generated directory structure, please refer to the [Code Layer Design](/docs/design/project-layer) section.

:::note
`GoFrame` framework development recommends using the official `go module` feature for dependency package management, so there is also a `go.mod` file in the root directory of the empty project.
:::

:::tip
The engineering directory adopts a universal design, and the actual project can appropriately increase or decrease the directories provided by the template according to project needs. For example, if there is no `kubernetes` deployment requirement, simply delete the corresponding `deploy` directory.
:::

## Usage Examples

### Initialize a Project in the Current Directory

```bash
$ gf init .
initializing...
initialization done!
you can now run 'gf run main.go' to start your journey, enjoy!
```

### Create a Project with a Specified Name

```bash
$ gf init myapp
initializing...
initialization done!
you can now run 'cd myapp && gf run main.go' to start your journey, enjoy!
```

### Create a MonoRepo Project

By default, a `SingleRepo` project is created. If needed, a `MonoRepo` (mono-repo) project can also be created by using the `-m` option.

```bash
$ gf init mymono -m
initializing...
initialization done!
```

For more information about mono-repos, please refer to the section: [Microservice MonoRepo Management Model](/docs/design/project-mono-repo)

#### Create a MonoRepoApp Project

If you need to create a sub-repo within a `MonoRepo` (mono-repo), you can use the `-a` option.

```bash
$ gf init app/user -a
initializing...
initialization done!
```