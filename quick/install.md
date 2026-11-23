# 下载与使用

大家好，欢迎访问 `GoFrame` 框架的快速开始章节！
由于 `GoFrame` 是一款模块化、低耦合设计的开发框架，包含了常用的基础组件和开发工具，既可以作为完整的业务项目框架使用也可以作为独立的组件库使用。

我们本章节从框架的下载安装使用开始，到指导大家完成一个较完善的`Web Server`接口开发。

**说明**

如果您还未准备好`Go`开发环境，建议您在进一步开始之前，先查阅环境安装文档：[环境安装](https://goframe.org/docs/install-go.md)
了解一些基础的`Go`语言知识再进行下一步。

如果您在快速开始的任何章节中遇到任何问题，欢迎在评论区留言💬，我们将尽可能及时为您提供解答🌟🌟。

## 限制

为保证框架的稳定性和安全性，`GoFrame`框架要求的最低的基础`Go`语言版本通常会比最新的`Go`语言版本低`1~3`个版本。

当前最新框架版本要求的最低`Go`语言版本：
```bash
golang版本 >= 1.20
```

## 安装
初始化`go.mod`：
```bash
go mod init hello
```

下载框架最新版本：
```bash
go get -u -v github.com/gogf/gf/v2
```

## 运行

我们尝试运行以下代码：
```go title="main.go"
package main

import (
    "fmt"

    "github.com/gogf/gf/v2"
)

func main() {
    fmt.Println("Hello GoFrame:", gf.VERSION)
}
```
这段简单的代码示例是打印当前引入的`GoFrame`框架版本。通过以下命令执行：
```bash
go run main.go
```
您将会在终端看到：
```bash
Hello GoFrame: v2.8.3
```

恭喜您！这表示您已经成功引用了`GoFrame`到当前项目中。

下一步，我们将使用`GoFrame`开发一个简单的`HTTP Server`服务。

> 页面: https://goframe.org/quick/install
