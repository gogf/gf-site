---
slug: '/docs/core/gcfg-yaml'
title: 'Configuration - YAML'
sidebar_position: 4
hide_title: true
keywords: [Configuration Management, YAML Format, GoFrame, Data Serialization, Mapping, Array, Scalar, Object, Composite Structure, JavaScript Conversion]
description: "Configuration management using YAML format in the GoFrame framework. YAML is a data serialization format that is easy for humans to read and write and supports data structures like objects, arrays, and scalars. The article also provides examples of conversion between YAML and JavaScript to help readers better understand the application and implementation of YAML format."
---

### I. Introduction

The design goal of the YAML language (pronounced /ˈjæməl/) is to facilitate human readability and writability. It is essentially a general-purpose data serialization format.

The basic syntax rules are as follows.

> - Case sensitive
> - Use indentation to represent hierarchical relationships
> - Tabs are not allowed for indentation, only spaces are permitted.
> - The number of spaces for indentation is not important, as long as elements at the same level are aligned to the left

`#` indicates a comment, from this character to the end of the line will be ignored by the parser.

YAML supports three data structures.

> - Object: A collection of key-value pairs, also known as mapping/hashes/dictionary
> - Array: An ordered sequence of values, also known as sequence/list
> - Scalars: Single, indivisible values

These three structures are described below.

### II. Object

A set of key-value pairs in an object is represented using a colon structure.

> ```javascript
> animal: pets
> ```

Converted to JavaScript as follows.

> ```javascript
> { animal: 'pets' }
> ```

YAML also allows another notation, writing all key-value pairs as an inline object.

> ```javascript
> hash: { name: Steve, foo: bar }
> ```

Converted to JavaScript as follows.

> ```javascript
> { hash: { name: 'Steve', foo: 'bar' } }
> ```

### III. Array

A set of lines starting with a hyphen constitutes an array.

> ```javascript
> - Cat
> - Dog
> - Goldfish
> ```

Converted to JavaScript as follows.

> ```javascript
> [ 'Cat', 'Dog', 'Goldfish' ]
> ```

If the sub-member of the data structure is an array, you can indent a space under that item.

> ```javascript
> -
>  - Cat
>  - Dog
>  - Goldfish
> ```

Converted to JavaScript as follows.

> ```javascript
> [ [ 'Cat', 'Dog', 'Goldfish' ] ]
> ```

Arrays can also be represented using inline notation.

> ```javascript
> animal: [Cat, Dog]
> ```

Converted to JavaScript as follows.

> ```javascript
> { animal: [ 'Cat', 'Dog' ] }
> ```

### IV. Composite Structures

Objects and arrays can be combined to form composite structures.

> ```javascript
> languages:
>  - Ruby
>  - Perl
>  - Python
> websites:
>  YAML: yaml.org
>  Ruby: ruby-lang.org
>  Python: python.org
>  Perl: use.perl.org
> ```

Converted to JavaScript as follows.

> ```javascript
> { languages: [ 'Ruby', 'Perl', 'Python' ],
>   websites:
>    { YAML: 'yaml.org',
>      Ruby: 'ruby-lang.org',
>      Python: 'python.org',
>      Perl: 'use.perl.org' } }
> ```

### V. Scalars

Scalars are the most basic, indivisible values. The following data types belong to JavaScript scalars.

> - String
> - Boolean
> - Integer
> - Float
> - Null
> - Time
> - Date

Values are represented in literal form.

> ```javascript
> number: 12.30
> ```

Converted to JavaScript as follows.

> ```javascript
> { number: 12.30 }
> ```

Boolean values are represented by `true` and `false`.

> ```javascript
> isSet: true
> ```

Converted to JavaScript as follows.

> ```javascript
> { isSet: true }
> ```

`null` is represented by `~`.

> ```javascript
> parent: ~
> ```

Converted to JavaScript as follows.

> ```javascript
> { parent: null }
> ```

Time is represented in ISO8601 format.

> ```javascript
> iso8601: 2001-12-14t21:59:43.10-05:00
> ```

Converted to JavaScript as follows.

> ```javascript
> { iso8601: new Date('2001-12-14t21:59:43.10-05:00') }
> ```

Date is represented using the composite ISO8601 format of year, month, and day.

> ```javascript
> date: 1976-07-31
> ```

Converted to JavaScript as follows.

> ```javascript
> { date: new Date('1976-07-31') }
> ```

YAML allows the use of two exclamation points to forcefully convert data types.

> ```javascript
> e: !!str 123
> f: !!str true
> ```

Converted to JavaScript as follows.

> ```javascript
> { e: '123', f: 'true' }
> ```

### VI. Strings

Strings are the most common and also the most complex data type.

Strings are not quoted by default.

> ```javascript
> str: 这是一行字符串
> ```

Converted to JavaScript as follows.

> ```javascript
> { str: '这是一行字符串' }
> ```

If a string contains spaces or special characters, it needs to be enclosed in quotes.

> ```javascript
> str: '内容： 字符串'
> ```

Converted to JavaScript as follows.

> ```javascript
> { str: '内容: 字符串' }
> ```

Both single and double quotes can be used, and double quotes will not escape special characters.

> ```javascript
> s1: '内容\n字符串'
> s2: "内容\n字符串"
> ```

Converted to JavaScript as follows.

> ```javascript
> { s1: '内容\\n字符串', s2: '内容\n字符串' }
> ```

If there are single quotes within single quotes, two consecutive single quotes must be used to escape.

> ```javascript
> str: 'labor''s day'
> ```

Converted to JavaScript as follows.

> ```javascript
> { str: 'labor\'s day' }
> ```

Strings can be written in multiple lines, and starting from the second line, there must be a single space indentation. Line breaks will be converted into spaces.

> ```javascript
> str: 这是一段
>   多行
>   字符串
> ```

Converted to JavaScript as follows.

> ```javascript
> { str: '这是一段 多行 字符串' }
> ```

Multiline strings can use `|` to preserve line breaks or `>` to fold line breaks.

> ```javascript
> this: |
>   Foo
>   Bar
> that: >   Foo
>   Bar
> ```

Converted to JavaScript as follows.

> ```javascript
> { this: 'Foo\nBar\n', that: 'Foo Bar\n' }
> ```

`+` indicates preserving the ending line breaks of text blocks, and `-` indicates removing the ending line breaks of strings.

> ```javascript
> s1: |
>   Foo
> s2: |+
>   Foo
> s3: |-
>   Foo
> ```

Converted to JavaScript as follows.

> ```javascript
> { s1: 'Foo\n', s2: 'Foo\n\n\n', s3: 'Foo' }
> ```

HTML tags can be inserted within strings.

> ```javascript
> message: |
>   <p style="color: red">     段落
>   </p>
> ```

Converted to JavaScript as follows.

> ```javascript
> { message: '\n<p style="color: red">\n  段落\n</p>\n' }
> ```

### VII. References

Anchors `&` and aliases `*` can be used for references.

> ```javascript
> defaults: &defaults
>   adapter:  postgres
>   host:     localhost
> development:
>   database: myapp_development
>   <<: *defaults
> test:
>   database: myapp_test
>   <<: *defaults
> ```

Equivalent to the following code.

> ```javascript
> defaults:
>   adapter:  postgres
>   host:     localhost
> development:
>   database: myapp_development
>   adapter:  postgres
>   host:     localhost
> test:
>   database: myapp_test
>   adapter:  postgres
>   host:     localhost
> ```

`&` is used to create an anchor (`defaults`), `<<` indicates merging into current data, and `*` is used to reference the anchor.

Here is another example.

> ```javascript
> - &showell Steve
> - Clark
> - Brian
> - Oren
> - *showell
> ```

Converted to JavaScript as follows.

> ```javascript
> [ 'Steve', 'Clark', 'Brian', 'Oren', 'Steve' ]
> ```