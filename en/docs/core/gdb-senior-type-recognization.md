# ORM Senior - Type Recognition

When using `GoFrame ORM` to query data, since the field value is a generic object, the returned data type will be automatically recognized and mapped to the `Go` variable type as the concrete value of the generic.

For example:

- When the field type is `int(xx)`, the queried field value type will be recognized as `int` type
- When the field type is `varchar(xxx)`/ `char(xxx)`/ `text`, etc., it will be automatically recognized as `string` type
- ……

Taking `mysql` types as an example, the following introduces the automatic recognition and mapping relationship between database types and `Go` variable types:

**Tip**

The version may be updated iteratively, please check the source code for details [https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go](https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go)

| Database Type | Go Variable Type |
| --- | --- |
| `*char` | `string` |
| `*text` | `string` |
| `*binary` | `bytes` |
| `*blob` | `bytes` |
| `*int` | `int` |
| `*money` | `float64` |
| `bit` | `int` |
| `big_int` | `int64` |
| `float` | `float64` |
| `double` | `float64` |
| `decimal` | `float64` |
| `bool` | `bool` |
| `year` | `time.Time` |
| `date` | `time.Time` |
| `datetime` | `time.Time` |
| `time` | `time.Time` |
| `timestamp` | `time.Time` |
| `others` | `string` |

This feature is especially friendly for encoding query results and directly returning them to the client via methods like `JSON`.

> Page: https://goframe.org/en/docs/core/gdb-senior-type-recognization
