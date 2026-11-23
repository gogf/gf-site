# ORM - Transaction

Using the `GoFrame ORM` component for transaction operations is very simple and safe, and can be achieved through two methods.

1. Conventional Operation: After starting a transaction through `Begin`, it returns a transaction operation interface `gdb.TX`, which can then be used for operations and chain operations as introduced in previous sections. Conventional operations are prone to missing transaction closures, posing certain transaction safety risks.
2. Closure Operation: Transactions are handled in the form of closure methods using `Transaction`, where all transaction logic is implemented within the closure, and the transaction is automatically closed after the closure ends to ensure transaction safety. Additionally, closure operations support very convenient **nested transactions**, which are transparent and seamless in business operations.

**Tip**

We recommend all transaction operations be uniformly implemented using the `Transaction` closure method.

Interface Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX)

Child pages:

- [ORM Transaction - Methods](https://goframe.org/en/docs/core/gdb-transaction-basic.md)
- [ORM Transaction - Closure](https://goframe.org/en/docs/core/gdb-transaction-closure.md)
- [ORM Transaction - Nested](https://goframe.org/en/docs/core/gdb-transaction-nested.md)
- [ORM Transactions - Propagation](https://goframe.org/en/docs/core/gdb-transaction-propagation.md)
- [ORM Transactions - Isolation Levels](https://goframe.org/en/docs/core/gdb-transaction-isolation-level.md)
- [ORM Transactions - Read-Only Mode](https://goframe.org/en/docs/core/gdb-transaction-readonly.md)

> Page: https://goframe.org/en/docs/core/gdb-transaction
