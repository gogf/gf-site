---
slug: '/docs/core/gcmd-parser'
title: 'Command - Args Parsing'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, Command Line Parsing, gcmd, Parser Parsing, Go Development, Code Example, Option Management, Command Line Options, Development Documentation]
description: "The command line parsing feature of the GoFrame framework, focusing on the Parser parsing method of the gcmd component. By customizing option names and value parsing, it can efficiently manage and parse command line options. Includes code examples and detailed API documentation to help developers understand and apply it in actual projects."
---

## Introduction

The main aspect of command line parsing is option parsing. The `gcmd` component provides a `Parse` method for customizing option parsing, including specifying which option names exist and whether each option has values. With this configuration, all parameters and options can be parsed and categorized.
:::tip
In most cases, we do not need to explicitly create a `Parser` object, as we manage multiple commands through hierarchical management and object management. However, the underlying implementation still uses the `Parser` approach, so understanding the principle in this chapter will suffice.
:::
Related methods:

For more `Parser` methods, please refer to the API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd#Parser](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd#Parser)

```go
func Parse(supportedOptions map[string]bool, option ...ParserOption) (*Parser, error)
func ParseWithArgs(args []string, supportedOptions map[string]bool, option ...ParserOption) (*Parser, error)
func ParserFromCtx(ctx context.Context) *Parser
func (p *Parser) GetArg(index int, def ...string) *gvar.Var
func (p *Parser) GetArgAll() []string
func (p *Parser) GetOpt(name string, def ...interface{}) *gvar.Var
func (p *Parser) GetOptAll() map[string]string
```

Where `ParserOption` is as follows:

```go
// ParserOption manages the parsing options.
type ParserOption struct {
    CaseSensitive bool // Marks options parsing in case-sensitive way.
    Strict        bool // Whether stops parsing and returns error if invalid option passed.
}
```

Parsing example:

```go
parser, err := gcmd.Parse(g.MapStrBool{
    "n,name":    true,
    "v,version": true,
    "a,arch":    true,
    "o,os":      true,
    "p,path":    true,
})
```

As you can see, the option input parameter is actually of `map` type. The key is the option name, with different names for the same option separated by the `,` symbol. For instance, in this example, the `n` and `name` options are the same option. When the user inputs `-n john`, both `n` and `name` options will receive the data `john`.

The value is a boolean type indicating whether the option requires value parsing. This option configuration is crucial, as some options do not need to receive data, serving merely as a flag. For example, with the input `-f force`, if data needs to be parsed, the value for option `f` is `force`; otherwise, `force` is a command line argument rather than an option.

## Usage Example

```go
func ExampleParse() {
    os.Args = []string{"gf", "build", "main.go", "-o=gf.exe", "-y"}
    p, err := gcmd.Parse(g.MapStrBool{
        "o,output": true,
        "y,yes":    false,
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(p.GetOpt("o"))
    fmt.Println(p.GetOpt("output"))
    fmt.Println(p.GetOpt("y") != nil)
    fmt.Println(p.GetOpt("yes") != nil)
    fmt.Println(p.GetOpt("none") != nil)

    // Output:
    // gf.exe
    // gf.exe
    // true
    // true
    // false
}
```