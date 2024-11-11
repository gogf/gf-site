---
slug: '/docs/cli/gen-service'
title: 'Module Specification - Gen Service'
sidebar_position: 2
hide_title: true
---
:::warning
This feature is an **experimental feature**. It is recommended that developers primarily organize module associations under the `logic` directory to avoid circular dependencies and make full use of the Go compiler's circular dependency detection feature to write higher quality project code.
:::
:::tip
This feature has been available since version `v2.1`.
:::


## Basic Introduction

### Design Background

In business project practice, business logic encapsulation is often the most complex part, and the dependencies between business modules are very complex and blurry, making it difficult to manage using Go's package management form. How to effectively manage the business logic encapsulation part in the project is a problem that every Go开发的 project will inevitably encounter.

In the standard software design process, the dependencies between modules are first clearly defined in the interface, and then implemented in the code during the software development process. However, in most high-paced internet projects, there is no rigorous software design process, and even the quality levels of developers are uneven. Most developers first care about how to implement the functional logic corresponding to the demand scenario and try to improve development efficiency as much as possible.

### Design Objectives

1. Provide a code management method that can directly generate module interface definitions and module registration code through specific module implementations.
2. Simplify the implementation of business logic and interface separation, reduce the repetitive operations of module methods and interface definitions, and improve the transparency and convenience between modules.

### Design Implementation

1. Add a `logic` classification directory, move all business logic code to the `logic` classification directory, and manage business modules using package management.
2. The dependencies between business modules are decoupled through interfaces, and the original `service` classification is adjusted to an interface directory. In this way, each business module will maintain itself and be more flexible.
3. According to certain coding specifications, `service` interface definition code can be generated from `logic` business logic code. At the same time, manual maintenance of this `service` interface is also allowed.

## Notes

### Warning

Please note again, generating `service` interfaces through `logic` implementations **is not a standardized practice** in code management; it only provides another **optional** and convenient way to manage code. This management method has its advantages and disadvantages. The advantage is that it is convenient for automatically generating interfaces for business modules in microservices scenarios; the disadvantage is that it cannot recognize syntax inheritance relationships, cannot generate methods for parent-level nested types, and abandons the Go compiler's feature of detecting circular dependencies at compile time.

**The framework's project management also supports standard interface code management methods**, that is, it supports defining `service` interfaces first and then coding `logic` specific implementations. It should be noted that the source code of this `service` should not contain top tool annotation information (the tool relies on this annotation to determine whether the file can be overwritten 😈). Many students copy and paste and retain the file header comments, which can cause manual maintenance of interface files to fail. For details, see the screenshot comments:

![Screenshot Comments](/markdown/f4b70fc856dfcb17c4680839e32bb78b.png)

## Command Usage

This command analyzes the code in the given `logic` business logic module directory and automatically generates `service` directory interface code.

### Info

Please note:

1. Since this command generates `service` interfaces based on business modules, it only parses `go` code files in the second-level directory and does not recursively analyze code files indefinitely. Taking the `logic` directory as an example, the command only parses `logic/xxx/*.go` files. Therefore, the `logic` layer code structure must meet certain specifications.
2. The structure names defined in different business modules may overlap when generating `service` interface names, so it is necessary to ensure that the names do not conflict when designing business modules.

For a sample project of this command, please refer to: [https://github.com/gogf/gf-demo-user](https://github.com/gogf/gf-demo-user)

### Manual Mode

If you are executing the command manually, simply run `gf gen service` in the project root directory.

```bash
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
    -a, --stPattern         regular expression matching struct name for generating service. default: ^s([A-Z]\\w+)$
    -p, --packages          produce go files only for given source packages
    -i, --importPrefix      custom import prefix to calculate import path for generated importing go file of logic
    -l, --clear             delete all generated go files that are not used any further
    -h, --help              more information about this command

EXAMPLE
    gf gen service
    gf gen service -f Snake
```

### Tip

If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make service` shortcut command.

Parameter Description:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `srcFolder` | Yes | `internal/logic` | Points to the logic code directory address |
| `dstFolder` | Yes | `internal/service` | Points to the directory where the generated interface files are stored |
| `dstFileNameCase` | No | `Snake` | The format of the generated file name |
| `stPattern` | No | `s([A-Z]\w+)` | Uses regular expressions to specify the business module structure definition format, which is convenient for parsing business interface definition names. Under the default regular expression, all structures that start with a lowercase `s` and are followed by uppercase letters will be considered as business module interface names. For example: |
| Logic Structure Name | Service Interface Name |
| --- | --- |
| `sUser` | `User` |
| `sMetaData` | `MetaData` |
| `watchFile` |  |  | Used in code file listening, representing the current changed code file path |
| `packages` |  |  | Only generate interface files for specified package names, given as a string array, passed through the command line as a `JSON` string, the command line component automatically converts data types |
| `importPrefix` |  |  | Specifies the prefix of the reference package name in the generated business reference file |
| `overwrite` |  | `true` | Whether to overwrite existing files when generating code files |
| `clear` |  | `false` | Automatically delete interface files that do not exist in `logic` (only delete automatically maintained files) |

### Automatic Mode

#### `Goland/Idea`

If you are using `GolandIDE`, you can use our provided configuration file: [watchers.xml](https://wiki.goframe.org/download/attachments/49770772/watchers.xml?version=1&modificationDate=1655298456643&api=v2) to automatically generate interface files when code files are modified. The usage method is as follows:

![GolandIDE Configuration](/markdown/447830160c7c3f14c1ce09b34906047f.png)

#### `Visual Studio Code`

If you are using `Visual Studio Code`, you can install the plugin [RunOnSave](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) and then configure the plugin:

```json
{
    "emeraldwalk.runonsave": {
        "commands": [
            {
                "match": ".*logic.*go",
                "isAsync": true,
                "cmd": "gf gen service"
            }
        ]
    }
}
```

## Step-by-Step Guide

### Step1: Import Our Provided Configuration

We recommend using our provided configuration file when using `Goland IDE`: [watchers.xml](https://wiki.goframe.org/download/attachments/49770772/watchers.xml?version=1&modificationDate=1655298456643&api=v2)

### Step2: Write Your Business Logic Code

![Business Logic Code](/markdown/84a59977f8a236410b20573a9377ed9b.png)

### Step3: Generate Interfaces and Service Registration Files

If you have already made the configuration as per `Step1`, you can skip this step. Because when you write the code, the `service` will generate the interface definition file at the same time.

Otherwise, after each development/update of the `logic` business module, you need to manually execute the `gf gen service` command.

![Generate Interfaces](/markdown/8f5ee2dc2c553ee9dd169930ff50003d.png)

### Step4: Note the Service Implementation Injection Part (Only Once)

Only after the interface files are generated can you add the specific implementation injection of the interface in each business module. This method needs to be added only once per business module.

![Service Implementation Injection](/markdown/aebae0b3b3055119b3818da0515e0c28.png)

### Step5: Reference Interface Implementation Registration in the Startup File (Only Once)

It can be found that in addition to generating interface files, the command also generates an interface implementation registration file. This file is used to register the specific implementation of the interface at startup.

![Interface Implementation Registration](/markdown/ceddac49d9a4585f334902157d542e0d.png)

The introduction of this file needs to be at the top of the `main` package, pay attention to the order of `import`, put it at the top, and add a blank line later. If there is also an introduction to the `packed` package, then put it after the `packed` package. Like this:

![Import Order](/markdown/864c4ad138cca78ac03d7e2d3fbf7a02.png)

### Step6: Start & Enjoy

Start `main.go` to begin.

## Frequently Asked Questions (FAQ)

### When there are nested structures in `logic`, methods for nested types cannot be automatically generated

In this scenario, it is recommended to manually maintain the `service` interface definition and not use the tool's automatic generation. Manually maintained interface definition files will not be overwritten by the tool, and manual and automatic maintenance can be used simultaneously.

### Quickly locate the specific implementation of the interface

**The project business module uses interface decoupling, and the experience is great! But during development and debugging, I want to quickly find the specific implementation of a specified interface, and it's a bit difficult. Can you give some guidance?**

> Here I recommend using `Goland IDE`, which has a great interface implementation location feature, as shown in the figure. After finding the interface definition, click on the small icon on the left to quickly locate the specific implementation. If Goland does not display the small icon, try upgrading to the latest version of `Goland`.

![Interface Implementation Location](/markdown/bbcc72eb46954b60c49be42a8ecebe35.png)

Or when there is no small icon on the left, you can right-click and select `Go To → Implementation(s)`

![Go To Implementation](/markdown/4168ae8d0afee067e885e603eda37ccf.png)