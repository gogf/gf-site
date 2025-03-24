---
slug: '/docs/core/gcfg-toml'
title: 'Configuration - TOML'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, TOML Configuration, Configuration Management, TOML Syntax, Key-Value Pairs, Table Arrays, Data Serialization, YAML Comparison, JSON Parsing, Open Source Framework]
description: "The use of TOML format in the GoFrame framework, including its comparison with other file formats, basic syntax, numeric and BOOL value processing, date and time, arrays, tables, table arrays, etc., to help users better understand and apply TOML configuration management."
---

## Introduction

`Toml` is a small, easy-to-read language created by the former CEO of `GitHub`, `Tom`. `Tom's Obvious, Minimal Language`.

`TOML` is focused on minimizing and making configuration files easy to read.

1. WIKI Introduction: [https://github.com/toml-lang/toml/wiki](https://github.com/toml-lang/toml/wiki)
2. Official Address: [https://github.com/toml-lang/toml](https://github.com/toml-lang/toml)
3. Chinese Version: [https://github.com/LongTengDao/TOML/blob/%E9%BE%99%E8%85%BE%E9%81%93-%E8%AF%91/toml-v1.0.0.md](https://github.com/LongTengDao/TOML/blob/%E9%BE%99%E8%85%BE%E9%81%93-%E8%AF%91/toml-v1.0.0.md)

## Comparison with Other Formats

`TOML` shares the same characteristics as other file formats like `YAML` and `JSON` used for application configuration and data serialization. Both `TOML` and `JSON` are simple and use ubiquitous data types, making them easy to parse by code or machines. `TOML` and `YAML` both emphasize human readability, such as comments, which make understanding the purpose of a given line easier. The distinct feature of `TOML` is that it supports comments (unlike `JSON`) while maintaining simplicity (unlike `YAML`).

Since `TOML` is explicitly designed as a configuration file format, parsing it is easy, but it is not intended to serialize arbitrary data structures. The top level of a `TOML` file is a hash table which can easily nest data in keys, but it doesn't allow top-level arrays or floating point numbers, so it cannot directly serialize some data. There is no standard to identify the start or end of a `TOML` file, which complicates sending files over streams. These details must be negotiated at the application level.

`INI` files are often compared with `TOML` because of their syntactical similarity and common use as configuration files. However, `INI` files do not have a standardized format and do not handle more than one or two levels of nesting gracefully.

## Basic Syntax

```toml
title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
organization = "GitHub"
bio = "GitHub Cofounder & CEO\nLikes tater tots and beer."
dob = 1979-05-27T07:32:00Z # Date and time are first-class citizens. Why not?

[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
connection_max = 5000
enabled = true

[servers]
  # You can indent as you please. Tabs or spaces. TOML doesn't care.
  [servers.alpha]
  ip = "10.0.0.1"
  dc = "eqdc10"

  [servers.beta]
  ip = "10.0.0.2"
  dc = "eqdc10"

[clients]
data = [ ["gamma", "delta"], [1, 2] ]

# Newlines in arrays are no problem.
hosts = [
  "alpha",
  "omega"
]
```

Features:

- Case sensitive, must be `UTF-8` encoded
- Comments: `#`
- Whitespace: `tab(0x09)` or `space(0x20)`
- Newline: `LF(0x0A)` or `CRLF(0x0D 0x0A)`
- Key-value pairs: single line, keys without a value are not allowed, only one key-value pair per line

`TOML`'s primary structure is key-value pairs, similar to `JSON`. Values must be of the following types: `String`, `Integer`, `Float`, `Boolean`, `Datetime`, `Array`, `Table`

## Comments

Comments are represented with `#`:

```toml
# I am a comment. Hear me roar. Roar.
key = "value" # Yeah, you can do this.
```

## Strings

There are four ways of representing strings in `TOML`: basic, multi-line basic, literal, and multi-line literal.

### 1. Basic String

Enclosed in double quotes, all `Unicode` characters can appear, except double quotes, backslashes, and control characters (`U+0000` to `U+001F`) which need to be escaped.

### 2. Multi-line Basic String

Enclosed in three double quotes, newlines within the string will be preserved, except for the newline at the start of the delimiter:

```toml
str1 = """
Roses are red
Violets are blue"""
```

### 3. Literal String

Enclosed in single quotes, escapes are not allowed within, making it easy to represent content that needs to be escaped in basic strings:

```toml
winpath = 'C:\Users\nodejs\templates'
```

### 4. Multi-line Literal String

Similar to a multi-line basic string:

```toml
str1 = '''
Roses are red
Violets are blue'''
```

## Numbers and BOOL Values

```toml
int1  = +99
flt3  = -0.01
bool1 = true
```

## Date and Time

```toml
date = 1979-05-27T07:32:00Z
```

## Arrays

Arrays are enclosed in square brackets. Spaces are ignored. Elements are separated by commas.

Note that mixing data types within the same array is not allowed.

```toml
array1 = [ 1, 2, 3 ]
array2 = [ "red", "yellow", "green" ]
array3 = [ [ 1, 2 ], [3, 4, 5] ]
array4 = [ [ 1, 2 ], ["a", "b", "c"] ] # This is allowed.
array5 = [ 1, 2.0 ] # Note: This is not allowed.
```

## Tables

Tables (also called hash tables or dictionaries) are collections of key-value pairs. They are their own line enclosed in square brackets. Note the distinction from arrays, which contain only values.

```toml
[table]
```

Below this, until the next `table` or `EOF`, are the key-value pairs of this table. Keys on the left, values on the right, with an equal sign in between. Keys start with a non-space character and end with the last non-space character before the equal sign. Key-value pairs are unordered.

```toml
[table]
key = "value"
```

You can indent however you want, using `Tabs` or `spaces`. Why indent? Because you can nest tables.

Nested tables use the `.` symbol in the table name. You can name your tables as you like, just don't use a dot, as it's reserved.

```toml
[dog.tater]
type = "pug"
```

This is equivalent to the following `JSON` structure:

```
{ "dog": { "tater": { "type": "pug" } } }
```

You don't need to declare all parent tables if you don't want to. TOML knows how to handle it.

```toml
# [x] You
# [x.y] don't need
# [x.y.z] these
[x.y.z.w] # You can write it directly
```

Empty tables are allowed, with no key-value pairs.

As long as a parent table hasn't been defined directly and no specific key has been defined, you can continue writing:

```toml
[a.b]
c = 1

[a]
d = 2
```

However, you cannot redefine keys and tables multiple times. Doing so is illegal.

```toml
# Don't do this!

[a]
b = 1

[a]
c = 2
# Don't do this either

[a]
b = 1

[a.b]
c = 2
```

## Table Arrays

The last type to introduce is table arrays. Table arrays are expressed by enclosing the table name within double square brackets. Tables with the same double bracket names are elements of the same array. Tables are inserted in the order they are written. Double bracket tables without key-value pairs are considered empty tables.

```toml
[[products]]
name = "Hammer"
sku = 738594937

[[products]]

[[products]]
name = "Nail"
sku = 284758393
color = "gray"
```

This is equivalent to the following `JSON` structure:

```
{
  "products": [
    { "name": "Hammer", "sku": 738594937 },
    { },
    { "name": "Nail", "sku": 284758393, "color": "gray" }
  ]
}
```

Table arrays can also be nested. Just use the same double bracket syntax on the child table. Each double-bracketed child table belongs to the most recently defined upper-level table element.

```toml
[[fruit]]
  name = "apple"

  [fruit.physical]
    color = "red"
    shape = "round"

  [[fruit.variety]]
    name = "red delicious"

  [[fruit.variety]]
    name = "granny smith"

[[fruit]]
  name = "banana"

  [[fruit.variety]]
    name = "plantain"
```

This is equivalent to the following `JSON` structure:

```
{
  "fruit": [
    {
      "name": "apple",
      "physical": {
        "color": "red",
        "shape": "round"
      },
      "variety": [
        { "name": "red delicious" },
        { "name": "granny smith" }
      ]
    },
    {
      "name": "banana",
      "variety": [
        { "name": "plantain" }
      ]
    }
  ]
}
```

Attempting to define a regular table using an already defined array name will throw a parse error:

```toml
# Invalid TOML

[[fruit]]
  name = "apple"

  [[fruit.variety]]
    name = "red delicious"

  # Conflicts with above
  [fruit.variety]
    name = "granny smith"
```