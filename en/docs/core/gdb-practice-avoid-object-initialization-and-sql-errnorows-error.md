# Avoid Object Initialization and sql.ErrNoRows Judgment in Queries

## Avoid Object Initialization and `sql.ErrNoRows` Judgment in Queries

When executing SQL queries, avoid initializing query results in advance to prevent the influence of default values in the struct objects and unnecessary object memory creation. By judging a return object pointer as `nil`, avoid using `sql.ErrNoRows`, thereby reducing the code's complexity in handling `error` and unifying the project’s logic for handling empty query results.

A counterexample:

```go
func (s *sTask) GetOne(ctx context.Context, id uint64) (out *entity.ResourceTask, err error) {
    out = new(model.TaskDetail)
    err = dao.ResourceTask.Ctx(ctx).WherePri(id).Scan(out)
    if err != nil {
        if err == sql.ErrNoRows {
            err = gerror.Newf(`record not found for "%d"`, id)
        }
        return
    }
    return
}
```

In this example, the returned `out` object actually has default values due to object initialization (regardless of whether the SQL query retrieves data), and the judgment of `sql.ErrNoRows` adds complexity to `error` handling logic in the code.

Recommended improvement:

```go
func (s *sTask) GetOne(ctx context.Context, id uint64) (out *entity.ResourceTask, err error) {
    err = dao.ResourceTask.Ctx(ctx).WherePri(id).Scan(&out)
    if err != nil {
        return
    }
    if out == nil {
        err = gerror.Newf(`record not found for "%d"`, id)
    }
    return
}
```

**Warning**

Note the use of `&out` in the code.

For more information, please refer to: [ORM Result - Empty Check](https://goframe.org/en/docs/core/gdb-result-empty-check.md)

> Page: https://goframe.org/en/docs/core/gdb-practice-avoid-object-initialization-and-sql-errnorows-error
