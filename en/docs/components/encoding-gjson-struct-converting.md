# General Codec - Struct

## `Struct` Conversion

The `Struct` method is used to convert the entire data content contained in `Json` into a specified data format or object.

```
data :=
    `
{
    "count" : 1,
    "array" : ["John", "Ming"]
}`
if j, err := gjson.DecodeToJson(data); err != nil {
    panic(err)
} else {
    type Users struct {
        Count int
        Array []string
    }
    users := new(Users)
    if err := j.Scan(users); err != nil {
        panic(err)
    }
    fmt.Printf(`%+v`, users)
}

// Output:
// &{Count:1 Array:[John Ming]}
```

> Page: https://goframe.org/en/docs/components/encoding-gjson-struct-converting
