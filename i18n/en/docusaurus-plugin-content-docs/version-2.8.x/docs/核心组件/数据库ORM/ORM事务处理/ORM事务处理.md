---
slug: '/docs/core/gdb-transaction'
title: 'ORM - Transaction'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame framework, ORM transaction, transaction handling, closure operation, transaction safety, nested transaction, database, transaction interface, Go development]
description: "Using the ORM component of the GoFrame framework for transaction operations is very simple and safe, with two methods: conventional operation and closure operation. Conventional operation begins a transaction with Begin, returning a transaction interface gdb.TX, while closure operation encapsulates transaction logic using the Transaction method and automatically manages transaction closure, supporting nested transactions. It is recommended to use closure operation to ensure transaction safety."
---

Using the `GoFrame ORM` component for transaction operations is very simple and safe, and can be achieved through two methods.

1. Conventional Operation: After starting a transaction through `Begin`, it returns a transaction operation interface `gdb.TX`, which can then be used for operations and chain operations as introduced in previous sections. Conventional operations are prone to missing transaction closures, posing certain transaction safety risks.
2. Closure Operation: Transactions are handled in the form of closure methods using `Transaction`, where all transaction logic is implemented within the closure, and the transaction is automatically closed after the closure ends to ensure transaction safety. Additionally, closure operations support very convenient **nested transactions**, which are transparent and seamless in business operations.

:::tip
We recommend all transaction operations be uniformly implemented using the `Transaction` closure method.
:::

Interface Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX)

import DocCardList from '@theme/DocCardList';

<DocCardList />