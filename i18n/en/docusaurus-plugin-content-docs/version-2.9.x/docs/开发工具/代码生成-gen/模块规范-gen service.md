---
slug: '/docs/cli/gen-service'
title: 'Service Generating'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,Golang,Business Logic,Module Management,API Definition,Code Generation,Circular Dependencies,Service Registration,Compiler,Microservices]
description: "Encapsulate and manage business logic in the GoFrame framework by generating module API definitions and registration code to simplify the implementation process of separating business logic from interfaces. Improve module transparency through structured coding of logic and interfaces while avoiding circular dependencies. Provides both manual and automated implementation modes suitable for different development environments."
---
:::warning
This feature is an **experimental feature**. It is recommended for developers to focus on module division under `logic`, streamline inter-module relationship, avoid circular dependencies, and fully utilize the circular dependency detection feature of the `Golang` compiler to write higher quality project code.
:::
:::tip
This feature is available from version `v2.1`.
:::

## Introduction

### Design Background

In business project practices, business logic encapsulation is often the most complex part. Meanwhile, dependencies between business modules are very complex and boundaries are vague, making it difficult to use the `Golang` package management form. Effectively managing the encapsulation part of business logic in a project is a challenge that every project developed with `Golang` is bound to encounter.

In a standard software design process, dependencies between modules first clarify API definitions, and then the implementation is done through code during the software development process. However, in most high-paced internet engineering, there isn't a rigorous software design process, and the quality level of developers varies. Most developers first focus on how to implement the functional logic corresponding to the requirements scenario to maximize development efficiency.

### Design Objectives

1. Provide a code management method that can directly generate module API definitions and module registration code through specific module implementation.
2. Simplify the implementation of separating business logic and interfaces, reduce the repetitive operation of module methods and API definitions, and enhance module transparency and ease of invocation between modules.

### Design Implementation

1. Add a `logic` category directory, migrate all business logic code to the `logic` category directory, and manage business modules in the form of package management.
2. Dependencies between business modules are decoupled through interfaces, and the original `service` category is adjusted to an interface directory. Each business module will maintain its own, being more flexible.
3. Based on certain coding specifications, `service` API definition code can be generated from the `logic` business logic code. It also allows for manual maintenance of this part of the `service` interface.

## Things to Note
:::warning
Again, implementing `service` interfaces through `logic` is **not a standardized code management practice** but provides another **optional**, convenient code management method. This management method has both advantages and disadvantages. The advantage is that it is more convenient for business module interface auto-generation in microservice scenarios; the disadvantage is that it cannot recognize syntax inheritance relationships, cannot generate parent nested type methods, and disregards the `Golang` compile-time detection of circular dependencies.
:::
**The framework's project management also supports the standard interface code management approach**, i.e., defining `service` interfaces first, then coding `logic` for concrete implementation. Note that the `service` source code must not contain top comment information used by the tool (the tool uses this comment to determine if the file can be overwritten 😈). Many colleagues kept the comment at the top when copying and pasting files, rendering manual interface file maintenance invalid. See screenshot annotation:

![](/markdown/f4b70fc856dfcb17c4680839e32bb78b.png)

## Command Usage

This command analyzes the code under the given `logic` business logic module directory to automatically generate `service` directory interface code.
:::info
Please note:

1. Since this command generates `service` interfaces based on business modules, it only parses `go` code files in secondary directories and does not recursively analyze code files indefinitely. Taking `logic` directory as an example, this command only parses `logic/xxx/*.go` files. Thus, the `logic` layer code structure needs to meet specific specifications.
2. Struct names defined in different business modules may overlap when generating `service` interface names, so it is necessary to ensure that names do not conflict when designing business modules.
:::
For a sample project using this command, please refer to: [https://github.com/gogf/gf-demo-user](https://github.com/gogf/gf-demo-user)

### Manual Mode

If executing the command manually, simply execute `gf gen service` in the project root directory.

```text
$ gf gen service -h
USAGE
    gf gen service [OPTION]

OPTION
    -s, --srcFolder         source folder path to be parsed. default: internal/logic
    -d, --dstFolder         destination folder path storing automatically generated go files. default: internal/service
    -f, --dstFileNameCase   destination file name storing automatically generated go files, cases are as follows:
                            | Case            | Example            |
                            |---------------- |--------------------|
                            | Lower           | anykindofstring    |
                            | Camel           | AnyKindOfString    |
                            | CamelLower      | anyKindOfString    |
                            | Snake           | any_kind_of_string | default
                            | SnakeScreaming  | ANY_KIND_OF_STRING |
                            | SnakeFirstUpper | rgb_code_md5       |
                            | Kebab           | any-kind-of-string |
                            | KebabScreaming  | ANY-KIND-OF-STRING |
    -w, --watchFile         used in file watcher, it re-generates all service go files only if given file is under
                            srcFolder
    -a, --stPattern         regular expression matching struct name for generating service. default: ^s([A-Z]\w+)$
    -p, --packages          produce go files only for given source packages
    -i, --importPrefix      custom import prefix to calculate import path for generated importing go file of logic
    -l, --clear             delete all generated go files that are not used any further
    -h, --help              more information about this command

EXAMPLE
    gf gen service
    gf gen service -f Snake
```
:::tip
If using the framework's recommended project scaffold and the `make` tool is installed on the system, the `make service` shortcut command can also be used.
:::
Parameter Description:

| Name | Required | Default | Meaning |
| --- | --- | --- | --- |
| `srcFolder` | Yes | `internal/logic` | Points to the logic code directory address |
| `dstFolder` | Yes | `internal/service` | Points to the directory where the generated interface files are stored |
| `dstFileNameCase` | No | `Snake` | The format of the generated filename |
| `stPattern` | No | `s([A-A]\w+)` | Use regular expression to specify the business module struct definition format for easy parsing of business API definition names. Under the default regex, all structs starting with lowercase `s` followed by uppercase letters will be treated as business module interface names. For example:

| Logic Struct Name | Service Interface Name |
| --- | --- |
| `sUser` | `User` |
| `sMetaData` | `MetaData` | |
| `watchFile` |  |  | Used in code file watching, represents the current changing code file path |
| `packages` |  |  | Only generate interface files for specified package names, given as a string array, JSON string when passed through command line, automatically converted by the command line component |
| `importPrefix` |  |  | Specifies the reference package name prefix in the generated business reference file |
| `overwrite` |  | `true` | Whether to overwrite existing files when generating code files |
| `clear` |  | `false` | Automatically deletes interface files that do not exist in `logic` (only deletes automatically maintained files) |

### Automatic Mode

#### `Goland/Idea`

If you are using `GolandIDE`, you can use the configuration file we provide: [watchers.xml](gen-service-watchers.xml) to automatically monitor code file modifications and automatically generate interface files. Usage is shown in the picture below:

![](/markdown/447830160c7c3f14c1ce09b34906047f.png)

#### `Visual Studio Code`

If you are using `Visual Studio Code`, you can install the plugin [RunOnSave](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) and then configure the plugin:

```json
"emeraldwalk.runonsave": {
    "commands": [
        {
            "match": ".*logic.*go",
            "isAsync": true,
            "cmd": "gf gen service"
        }
    ]
}
```

## Specific Usage: Step by Step

### Step1: Include the Configuration We Provide

We recommend using the configuration file: [watchers.xml](gen-service-watchers.xml) when using `Goland IDE`.

### Step2: Write Your Business Logic Code

![](/markdown/84a59977f8a236410b20573a9377ed9b.png)

### Step3: Generate Interface and Service Registration Files

If you have done the configuration in `Step1`, you can ignore this step. Because when you write code, `service` will generate the API definition file at the same time.

Otherwise, every time you finish developing/updating the `logic` business module, you need to manually execute the `gf gen service` command.

![](/markdown/8f5ee2dc2c553ee9dd169930ff50003d.png)

### Step4: Pay Attention to the Service Implementation Injection Part (Only Once)

Only after the interface files are generated can you add the specific implementation injection of the interface in each business module. This method is added once per business module.

![](/markdown/aebae0b3b3055119b3818da0515e0c28.png)

### Step5: Reference Interface Implementation Registration in the Startup File (Only Once)

It can be noticed that besides generating interface files, this command also generates an interface implementation registration file. This file is used to register the specific implementation of the interface during program startup.

![](/markdown/ceddac49d9a4585f334902157d542e0d.png)

The introduction of this file needs to be at the top of the `main` package import, and note the order of `import`, placing it at the top with a blank line behind. If the `packed` package is also imported, place it after the `packed` package. Like this:

![](/markdown/864c4ad138cca78ac03d7e2d3fbf7a02.png)

### Step6: Start & Enjoy

Simply start `main.go`.

## Common Issues FAQ

### When a structure in `logic` has nested types, methods for the nested types cannot be automatically generated

In such cases, it is recommended to manually maintain the `service` API definitions and not use the automatic generation tool. The manually maintained API definition files will not be overwritten by the tool, and both manual and automatic methods can be used together.

### Quickly Locate Specific Implementations of Interfaces

**After adopting interface-based decoupling for project business modules, the experience is fantastic! But if I want to quickly find the specific implementations of specified interfaces during development and debugging, it's a bit challenging. Any guiding thoughts?**

\> Here, I recommend using `Goland IDE`, which has an excellent interface implementation locating feature, as shown in the figure. After finding the API definition, click the small icon on the left to quickly locate the specific implementations. If Goland doesn't show the small icon, try upgrading to the latest version of `Goland`.

![](/markdown/bbcc72eb46954b60c49be42a8ecebe35.png)

Alternatively, if there is no small icon on the left, you can right-click to select `Go To → Implementation(s)`.

![](/markdown/4168ae8d0afee067e885e603eda37ccf.png)