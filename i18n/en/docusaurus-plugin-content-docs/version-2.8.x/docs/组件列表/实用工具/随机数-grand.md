---
slug: '/docs/components/util-grand'
title: 'Random'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame Framework, Random Number, grand Module, Random Generation, Performance Optimization, API Documentation, Character List, Probability Calculation, Random String]
description: "The grand module in the GoFrame framework provides optimized encapsulation for random number operations, offering high performance and versatile random generation methods, including integers, strings, and probability calculations. With practical methods like Intn and Str, you can easily generate various types of random data to meet different development needs."
---

The `grand` module implements encapsulation and improvements for random number operations, achieving extremely high random number generation performance, and provides rich methods related to random numbers.

Usage:

```go
import "github.com/gogf/gf/v2/util/grand"
```

API Documentation:

[https://pkg.go.dev/github.com/gogf/gf/v2/util/grand](https://pkg.go.dev/github.com/gogf/gf/v2/util/grand)

Common Methods:

```go
func N(min, max int) int
func B(n int) []byte
func S(n int, symbols ...bool) string
func Str(s string, n int) string
func Intn(max int) int
func Digits(n int) string
func Letters(n int) string
func Meet(num, total int) bool
func MeetProb(prob float32) bool
func Perm(n int) []int
func Symbols(n int) string
```

### Characters

```text
Type    Characters
Numeric 0123456789
English abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
Special !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

### Random Integers

1. The `Intn` method returns a random integer greater than or equal to `0` and less than `max`, i.e., `[0, max)`.
2. The `N` method returns a random integer between `min` and `max`, supports negative numbers, and includes boundaries, i.e., `[min, max]`.

### Random Strings

1. The `B` method is used to return a binary `[]byte` data of specified length.
2. The `S` method is used to return a string of specified length consisting of numbers and characters. The second parameter `symbols` specifies whether the random string should include special characters.
3. The `Str` method is a more advanced method that selects a random string of specified length from a given character list and supports `unicode` characters, such as Chinese. For example, `Str("中文123abc", 3)` may return a random string like `1a文`.
4. The `Digits` method returns a random numeric string of specified length.
5. The `Letters` method returns a random English string of specified length.
6. The `Symbols` method returns a random special character string of specified length.

### Probability Calculation

1. `Meet` is used to specify a number `num` and a total `total`, often with `num<=total`, and randomly calculate whether the probability of `num/total` is met. For example, `Meet(1, 100)` will randomly calculate whether a one percent probability is met.
2. `MeetProb` is used to provide a probability float number `prob`, often with `prob<=1.0`, and randomly calculate whether this probability is met. For example, `MeetProb(0.005)` will randomly calculate whether a five per thousand probability is met.