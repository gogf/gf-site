---
slug: '/docs/cli/gen-service'
title: '模块规范-gen service'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,Golang,业务逻辑,模块管理,接口定义,代码生成,循环依赖,服务注册,编译器,微服务]
description: '本指南介绍了如何在GoFrame框架中对业务逻辑进行封装管理，通过生成模块接口定义和注册代码来简化业务逻辑与接口分离的实现过程。通过逻辑与接口的结构化编码提高模块透明性，并避免循环依赖。提供手动与自动两种实现模式，适用于不同开发环境。'
---
:::warning
该功能特性为 **实验性特性**。建议开发者以 `logic` 下的模块划分为主，梳理模块间关联关系，避免循环依赖，充分利用 `Golang` 编译器的循环依赖检测特性编写更高质量的项目代码。
:::
:::tip
该功能特性从 `v2.1` 版本开始提供。
:::


## 基本介绍

### 设计背景

在业务项目实践中，业务逻辑封装往往是最复杂的部分，同时，业务模块之间的依赖十分复杂、边界模糊，较难采用 `Golang` 包管理的形式。如何有效管理项目中的业务逻辑封装部分，对于每个采用 `Golang` 开发的项目都是必定会遇到的难题。

在标准的软件设计流程中，模块与模块之间的依赖会先明确接口定义，在软件开发的实施过程中再通过代码来具体实现。但在大部分高节奏的互联网工程下，并没有严谨的软件设计流程，甚至开发人员的质量水平也参差不齐，大部分开发人员首先关心的是如何去实现需求场景对应的功能逻辑，尽可能地提高开发效率。

### 设计目标

1. 提供一种代码管理方式，可以通过具体模块实现直接生成模块接口定义、模块注册代码。
2. 简化业务逻辑实现与接口分离的实现，降低模块方法与接口定义的重复操作，提高模块与模块之间的透明度与调用便捷性。

### 设计实现

1. 增加 `logic` 分类目录，将所有业务逻辑代码迁移到 `logic` 分类目录下，采用包管理形式来管理业务模块。
2. 业务模块之间的依赖通过接口化解耦，将原有的 `service` 分类调整为接口目录。这样每个业务模块将会各自维护、更加灵活。
3. 可以按照一定的编码规范，从 `logic` 业务逻辑代码生成 `service` 接口定义代码。同时，也允许人工维护这部分 `service` 接口。

## 注意事项
:::warning
再次提醒，通过 `logic` 实现去生成 `service` 接口 **并不是一个代码管理的标准化做法**，只是提供另一个 **可供选择的**、便捷的代码管理方式。这种管理方式有优点也有缺点，优点是针对微服务场景的业务模块的接口自动生成比较方便；缺点是无法识别语法继承关系、无法生成父级嵌套类型的方法、抛弃了 `Golang` 编译时检测循环依赖的特性。
:::
**框架的工程管理当然也支持标准的接口代码管理方式**，即支持先定义 `service` 接口，再编码 `logic` 具体实现。需要注意的是，这个 `service` 的源代码中不能出现顶部工具的注释信息（工具依靠这个注释来判断该文件是否可覆盖😈），很多同学复制粘贴的时候把文件顶部注释保留了，就会引起手动维护接口文件失效。具体见截图注释：

![](/markdown/f4b70fc856dfcb17c4680839e32bb78b.png)

## 命令使用

该命令通过分析给定的 `logic` 业务逻辑模块目录下的代码，自动生成 `service` 目录接口代码。
:::info
需要注意：

1. 由于该命令是根据业务模块生成 `service` 接口，因此只会解析二级目录下的 `go` 代码文件，并不会无限递归分析代码文件。以 `logic` 目录为例，该命令只会解析 `logic/xxx/*.go` 文件。因此，需要 `logic` 层代码结构满足一定规范。
2. 不同业务模块中定义的结构体名称在生成的 `service` 接口名称时可能会重复覆盖，因此需要在设计业务模块时保证名称不能冲突。
:::
该命令的示例项目请参考： [https://github.com/gogf/gf-demo-user](https://github.com/gogf/gf-demo-user)

### 手动模式

如果是手动执行命令行，直接在项目根目录下执行 `gf gen service` 即可。

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
:::tip
如果使用框架推荐的项目工程脚手架，并且系统安装了 `make` 工具，也可以使用 `make service` 快捷指令。
:::
参数说明：

| 名称 | 必须 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `srcFolder` | 是 | `internal/logic` | 指向logic代码目录地址 |
| `dstFolder` | 是 | `internal/service` | 指向生成的接口文件存放目录 |
| `dstFileNameCase` | 否 | `Snake` | 生成的文件名名称格式 |
| `stPattern` | 否 | `s([A-A]\w+)` | 使用正则指定业务模块结构体定义格式，便于解析业务接口定义名称。在默认的正则下，所有小写 `s` 开头，大写字母随后的结构体都将被当做业务模块接口名称。例如：

| logic结构体名称 | service接口名称 |
| --- | --- |
| `sUser` | `User` |
| `sMetaData` | `MetaData` | |
| `watchFile` |  |  | 用在代码文件监听中，代表当前改变的代码文件路径 |
| `packages` |  |  | 仅生成指定包名的接口文件，给定字符串数组，通过命令行传参则给定 `JSON` 字符串，命令行组件自动转换数据类型 |
| `importPrefix` |  |  | 指定生成业务引用文件中的引用包名前缀 |
| `overwrite` |  | `true` | 生成代码文件时是否覆盖已有文件 |
| `clear` |  | `false` | 自动删除 `logic` 中不存在的接口文件（仅删除自动维护的文件） |

### 自动模式

#### `Goland/Idea`

如果您是使用的 `GolandIDE`，那么可以使用我们提供的配置文件： [watchers.xml](gen-service-watchers.xml)  自动监听代码文件修改时自动生成接口文件。使用方式，如下图：

![](/markdown/447830160c7c3f14c1ce09b34906047f.png)

#### `Visual Studio Code`

如果您是使用的 `Visual Studio Code`，那么可以安装插件 [RunOnSave](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) 随后配置插件：

```
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

## 具体使用手摸手

### Step1：引入我们提供的配置

我们建议您在使用 `Goland IDE` 时，使用我们提供的配置文件： [watchers.xml](gen-service-watchers.xml)

### Step2：编写您的业务逻辑代码

![](/markdown/84a59977f8a236410b20573a9377ed9b.png)

### Step3：生成接口及服务注册文件

如果您已经按照 `Step1` 做好了配置，那么这一步可以忽略。因为在您编写代码的时候， `service` 便同时生成了接口定义文件。

否则，每一次在您开发/更新完成 `logic` 业务模块后，您需要手动执行一下 `gf gen service` 命令。

![](/markdown/8f5ee2dc2c553ee9dd169930ff50003d.png)

### Step4：注意服务的实现注入部分（仅一次）

只有在生成完成接口文件后，您才能在每个业务模块中加上接口的具体实现注入。该方法每个业务模块加一次即可。

![](/markdown/aebae0b3b3055119b3818da0515e0c28.png)

### Step5：在启动文件中引用接口实现注册（仅一次）

可以发现，该命令除了生成接口文件之外，还生成了一个接口实现注册文件。该文件用于在程序启动时，将接口的具体实现在启动时执行注册。

![](/markdown/ceddac49d9a4585f334902157d542e0d.png)

该文件的引入需要在 `main` 包的最顶部引入，需要注意 `import` 的顺序，放到最顶部，后面加一个空行。如果同时存在 `packed` 包的引入，那么放到 `packed` 包后面。像这样：

![](/markdown/864c4ad138cca78ac03d7e2d3fbf7a02.png)

### Step6：Start&Enjoy

启动 `main.go` 即可。

## 常见问题FAQ

### 当 `logic` 中的结构体存在嵌套时，无法自动生成嵌套类型的方法

这种场景建议手动维护 `service` 接口定义，不使用工具的自动生成。手动维护的接口定义文件不会被工具覆盖，手动和自动可以同时使用。

### 快速定位接口的具体实现

**项目业务模块采用接口化解耦后体验非常棒！但是我在开发和调试过程中，想要快速找到指定接口的具体实现有点困难，能给点指导思路吗？**

\> 这里我推荐使用 `Goland IDE`，有个很棒的接口实现定位功能，具体如图。找到接口定义后，点击左边的小图标可快速定位具体的实现。如果Goland不显示小图标，可以尝试升级使用最新版本的 `Goland` 哈。

![](/markdown/bbcc72eb46954b60c49be42a8ecebe35.png)

或者在左侧没有小图标的时候，可以右键选择 `Go To → Implementation(s)`

![](/markdown/4168ae8d0afee067e885e603eda37ccf.png)