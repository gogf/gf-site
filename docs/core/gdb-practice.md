# ORM最佳实践

数据库操作往往是业务项目中最复杂的部分， `GoFrame` 的数据库组件其实提供了非常强大和灵活的操作方式，我们在这里提供了一些最佳实践的案例，方便大家参考学习。

子页面：

- [利用指针属性和do对象实现灵活的修改接口](https://goframe.org/docs/core/gdb-practice-using-pointer-and-do-for-update-api.md)
- [复杂类型尽量使用json存储，便于Scan到对象时自动化转换，避免自定义解析](https://goframe.org/docs/core/gdb-practice-using-json-for-complicated-field.md)
- [查询时避免返回对象初始化及sql.ErrNoRows判断](https://goframe.org/docs/core/gdb-practice-avoid-object-initialization-and-sql-errnorows-error.md)

> 页面: https://goframe.org/docs/core/gdb-practice
