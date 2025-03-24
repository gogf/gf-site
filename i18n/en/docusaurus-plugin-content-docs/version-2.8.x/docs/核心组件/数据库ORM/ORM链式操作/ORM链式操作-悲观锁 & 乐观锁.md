---
slug: '/docs/core/gdb-chaining-locks'
title: 'ORM Model - Lock'
sidebar_position: 15
hide_title: true
keywords: [Pessimistic Lock, Optimistic Lock, GoFrame, GoFrame Framework, Chaining Operations, SQL, Shared Lock, FOR UPDATE, LOCK IN SHARE MODE, Transaction]
description: "How to implement pessimistic and optimistic locks through chaining operations in the GoFrame framework. Pessimistic locks are used to lock data during each access to prevent conflicts, commonly in high concurrency scenarios; while optimistic locks use a versioning mechanism to check data updates, suitable for scenarios with more reads and fewer writes. This document provides a detailed analysis of applicable scenarios, implementation methods, and the advantages and disadvantages of locking mechanisms to help developers optimize database performance."
---

`Pessimistic Lock`, as the name suggests, is very pessimistic, assuming that others will modify the data each time it is accessed, so it locks the data each time. This results in a block if someone else wants to access the data until they get the lock. Many traditional relational databases use this locking mechanism, such as row locks, table locks, read locks, and write locks, all of which lock before performing operations.

`Optimistic Lock`, as the name suggests, is very optimistic, assuming that others will not modify the data each time it is accessed, so it does not lock. However, it checks if others have updated the data during this period when updating, which can be implemented using mechanisms like versioning. Optimistic locks are suitable for applications with more reads, which can improve throughput.

### Using Pessimistic Locks

Related methods:

```go
func (m *Model) LockUpdate() *Model
func (m *Model) LockShared() *Model
```

The `gdb` module's chaining operations provide two methods to help you implement "pessimistic locks" in `SQL` statements. You can use the `LockShared` method in queries to carry a "shared lock" when executing statements. A shared lock prevents the selected rows from being modified until the transaction is committed:

```go
g.Model("users").Ctx(ctx).Where("votes>?", 100).LockShared().All();
```

The above query is equivalent to the following SQL statement:

```sql
SELECT * FROM `users` WHERE `votes` > 100 LOCK IN SHARE MODE
```

You can also use the `LockUpdate` method. This method is used to create a `FOR UPDATE` lock, preventing selected rows from being modified or deleted by other shared locks:

```go
g.Model("users").Ctx(ctx).Where("votes>?", 100).LockUpdate().All();
```

The above query is equivalent to the following SQL statement:

```sql
SELECT * FROM `users` WHERE `votes` > 100 FOR UPDATE
```

Both `FOR UPDATE` and `LOCK IN SHARE MODE` are used to ensure that the selected records cannot be updated by other transactions (locked). The difference is that `LOCK IN SHARE MODE` will not block other transactions from reading the value of the locked row, while `FOR UPDATE` will block other locking reads of the locked row (non-locking reads can still read these records; both `LOCK IN SHARE MODE` and `FOR UPDATE` are locking reads).

This might be a bit abstract, so let's take a counter example: read a value in one statement, then update it in another. Using `LOCK IN SHARE MODE` allows two transactions to read the same initial value, so after executing the two transactions, the final value of the counter is `+1`; however, if using `FOR UPDATE`, it will lock the second transaction's read of the record value until the first transaction is completed, making the counter's final result `+2`.

### Using Optimistic Locks

Optimistic locks are mostly implemented based on a data version (`Version`) recording mechanism. What is a data version? It adds a version identifier to the data, usually by adding a "version" field to the database table in the version-based database table solution.

When reading data, the version number is also read, and when updating, the version number is incremented. At this time, the submitted data's version information is compared with the current version of the corresponding record in the database table. If the submitted data version number is greater than the current version number in the database table, the update is allowed; otherwise, it is considered outdated data.

### Summary of Locking Mechanisms

Each type of lock has its advantages and disadvantages. One cannot claim one is better than the other. Optimistic locks are suitable for scenarios with fewer writes, i.e., when conflicts rarely occur, thus eliminating the overhead of locks and increasing the system's overall throughput. However, if conflicts occur frequently, the upper-level application will keep retrying, which reduces performance, so using pessimistic locks is more appropriate in such cases.