---
slug: '/docs/core/gdb-transaction-isolation-level'
title: 'ORM Transactions - Isolation Levels'
sidebar_position: 5000
hide_title: true
keywords: ['Transaction', 'Isolation Level', 'ORM', 'Database', 'Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable']
description: 'A comprehensive guide to GoFrame ORM transaction isolation levels, including basic concepts, characteristics of different isolation levels, advantages and application scenarios, as well as code examples and practical use cases in GoFrame.'
---

Transaction isolation level is an important feature of database transaction processing that defines the degree to which one transaction may be affected by other concurrent transactions. The `GoFrame ORM` component supports standard `SQL` transaction isolation levels, allowing developers to choose appropriate isolation levels based on application requirements.

## Basic Concepts

Transaction isolation levels primarily address the following issues that may occur during concurrent transaction execution:

1. **Dirty Read**: A transaction reads data that has been modified by another transaction that has not yet been committed.
2. **Non-repeatable Read**: Within the same transaction, multiple reads of the same data return different results.
3. **Phantom Read**: Within the same transaction, multiple executions of the same query return different data sets (row count changes).

## Types of Isolation Levels

`GoFrame ORM` supports the following standard transaction isolation levels:

| Isolation Level | Dirty Read | Non-repeatable Read | Phantom Read | Description |
|-----------------|------------|---------------------|--------------|-------------|
| Read Uncommitted | Possible | Possible | Possible | Lowest isolation level, allows reading uncommitted data changes |
| Read Committed | Not possible | Possible | Possible | Only allows reading data that has been committed |
| Repeatable Read | Not possible | Not possible | Possible | MySQL's default level, ensures consistent data reads within the same transaction |
| Serializable | Not possible | Not possible | Not possible | Highest isolation level, completely serialized execution |

## Advantages and Application Scenarios

Different isolation levels are suitable for different application scenarios:

### Read Uncommitted

**Advantages**:
- Best performance, no lock overhead
- Highest concurrency

**Application Scenarios**:
- Scenarios with extremely low data consistency requirements
- Read-only statistical analysis that allows for some imprecise data
- High-performance requirements where data inconsistency can be tolerated

### Read Committed

**Advantages**:
- Avoids dirty read issues
- Good concurrent performance
- Default level for most databases

**Application Scenarios**:
- Scenarios that need to avoid dirty reads but can accept non-repeatable reads
- Read-heavy applications
- Scenarios with moderate consistency requirements but also concerned with performance

### Repeatable Read

**Advantages**:
- Avoids dirty reads and non-repeatable reads
- MySQL's default isolation level
- Ensures data read consistency within the same transaction

**Application Scenarios**:
- Scenarios requiring multiple consistent reads within a transaction
- Financial applications
- Business logic with higher data consistency requirements

### Serializable

**Advantages**:
- Completely avoids concurrency issues
- Provides the highest level of data consistency guarantee

**Application Scenarios**:
- Critical business operations with extremely high data consistency requirements
- Core financial transactions such as bank transfers
- Scenarios where data integrity is more important than performance

## Using Transaction Isolation Levels in GoFrame

`GoFrame ORM` supports setting transaction isolation levels through the `TxOptions` struct. Here are examples using different isolation levels:

### Basic Usage

```go
// Start a transaction with a specific isolation level
tx, err := db.BeginWithOptions(ctx, gdb.TxOptions{
    Isolation: sql.LevelReadCommitted,
})
if err != nil {
    // Handle error
    return
}
// Ensure the transaction will eventually be committed or rolled back
defer func() {
    if err := recover(); err != nil {
        tx.Rollback()
        panic(err)
    }
}()

// Execute transaction operations
_, err = tx.Insert(ctx, "user", g.Map{"name": "john"})
// SQL: INSERT INTO user(name) VALUES('john')

// Commit the transaction
if err = tx.Commit(); err != nil {
    // Handle error
    tx.Rollback()
    return
}
```

### Examples Using Different Isolation Levels

#### Read Committed

```go
// Use Read Committed isolation level
tx, err := db.BeginWithOptions(ctx, gdb.TxOptions{
    Isolation: sql.LevelReadCommitted,
})
if err != nil {
    return
}
defer tx.Rollback()

// Query user balance
balance, err := tx.Model("account").Where("user_id", 1).Value("balance")
// SQL: SELECT balance FROM account WHERE user_id=1

// Update balance
_, err = tx.Model("account").Where("user_id", 1).Update(g.Map{"balance": balance.Int() + 100})
// SQL: UPDATE account SET balance=balance+100 WHERE user_id=1

if err = tx.Commit(); err != nil {
    return
}
```

#### Repeatable Read

```go
// Use Repeatable Read isolation level (MySQL default)
tx, err := db.BeginWithOptions(ctx, gdb.TxOptions{
    Isolation: sql.LevelRepeatableRead,
})
if err != nil {
    return
}
defer tx.Rollback()

// First query for user data
user1, err := tx.Model("user").Where("id", 1).One()
// SQL: SELECT * FROM user WHERE id=1

// ... other operations

// Second query for the same user data
// With Repeatable Read, even if other transactions have modified this data,
// the result here will be the same as the first query
user2, err := tx.Model("user").Where("id", 1).One()
// SQL: SELECT * FROM user WHERE id=1

if err = tx.Commit(); err != nil {
    return
}
```

#### Serializable

```go
// Use Serializable isolation level
tx, err := db.BeginWithOptions(ctx, gdb.TxOptions{
    Isolation: sql.LevelSerializable,
})
if err != nil {
    return
}
defer tx.Rollback()

// Query all users matching the condition
users, err := tx.Model("user").Where("status", "active").All()
// SQL: SELECT * FROM user WHERE status='active'

// At the Serializable level, other transactions cannot simultaneously modify or add records
// that match this condition, ensuring query result consistency during transaction execution

if err = tx.Commit(); err != nil {
    return
}
```

### Using Transaction Closure Functions

`GoFrame ORM` also provides convenient transaction closure functions that can specify isolation levels:

```go
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    Isolation: sql.LevelSerializable,
}, func(ctx context.Context, tx gdb.TX) error {
    // Execute transaction operations
    _, err := tx.Insert("user", g.Map{"name": "john"})
    if err != nil {
        return err
    }
    
    // All operations will be automatically committed if no error is returned
    // or rolled back if an error is returned
    return nil
})
```

## Practical Application Examples

### Example 1: Bank Transfer (Repeatable Read)

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "context"
    "database/sql"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.Background()
    db := g.DB()
    
    // Transfer money from account A to account B
    err := db.TransactionWithOptions(ctx, gdb.TxOptions{
        Isolation: sql.LevelRepeatableRead, // Use Repeatable Read for financial transactions
    }, func(ctx context.Context, tx gdb.TX) error {
        // Get account A balance
        balanceA, err := tx.Model("account").Where("id", 1).Value("balance")
        if err != nil {
            return err
        }
        
        // Check if account A has sufficient funds
        if balanceA.Int() < 100 {
            return fmt.Errorf("insufficient funds")
        }
        
        // Deduct from account A
        _, err = tx.Model("account").Where("id", 1).Update(g.Map{
            "balance": gdb.Raw("balance - 100"),
        })
        if err != nil {
            return err
        }
        
        // Add to account B
        _, err = tx.Model("account").Where("id", 2).Update(g.Map{
            "balance": gdb.Raw("balance + 100"),
        })
        if err != nil {
            return err
        }
        
        // Record the transaction
        _, err = tx.Insert("transaction_log", g.Map{
            "from_account": 1,
            "to_account": 2,
            "amount": 100,
            "time": gdb.Raw("NOW()"),
        })
        
        return err
    })
    
    if err != nil {
        fmt.Println("Transfer failed:", err)
        return
    }
    
    fmt.Println("Transfer completed successfully")
}
```

### Example 2: Inventory Management (Read Committed)

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "context"
    "database/sql"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.Background()
    db := g.DB()
    
    // Process an order
    err := db.TransactionWithOptions(ctx, gdb.TxOptions{
        Isolation: sql.LevelReadCommitted, // Use Read Committed for inventory management
    }, func(ctx context.Context, tx gdb.TX) error {
        // Check product inventory
        inventory, err := tx.Model("product").Where("id", 101).Value("inventory")
        if err != nil {
            return err
        }
        
        // Check if inventory is sufficient
        if inventory.Int() < 1 {
            return fmt.Errorf("product out of stock")
        }
        
        // Reduce inventory
        _, err = tx.Model("product").Where("id", 101).Update(g.Map{
            "inventory": gdb.Raw("inventory - 1"),
            "sales": gdb.Raw("sales + 1"),
        })
        if err != nil {
            return err
        }
        
        // Create order
        _, err = tx.Insert("order", g.Map{
            "product_id": 101,
            "user_id": 1001,
            "quantity": 1,
            "status": "created",
            "create_time": gdb.Raw("NOW()"),
        })
        
        return err
    })
    
    if err != nil {
        fmt.Println("Order processing failed:", err)
        return
    }
    
    fmt.Println("Order processed successfully")
}
```

### Example 3: Concurrent Data Analysis (Read Uncommitted)

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "context"
    "database/sql"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.Background()
    db := g.DB()
    
    // Generate statistical report
    err := db.TransactionWithOptions(ctx, gdb.TxOptions{
        Isolation: sql.LevelReadUncommitted, // Use Read Uncommitted for statistical analysis
    }, func(ctx context.Context, tx gdb.TX) error {
        // Get total sales
        sales, err := tx.Model("product").Sum("sales")
        if err != nil {
            return err
        }
        
        // Get average price
        avgPrice, err := tx.Model("product").Avg("price")
        if err != nil {
            return err
        }
        
        // Get product count
        count, err := tx.Model("product").Count()
        if err != nil {
            return err
        }
        
        // Save report
        _, err = tx.Insert("sales_report", g.Map{
            "total_sales": sales,
            "avg_price": avgPrice,
            "product_count": count,
            "create_time": gdb.Raw("NOW()"),
        })
        
        return err
    })
    
    if err != nil {
        fmt.Println("Report generation failed:", err)
        return
    }
    
    fmt.Println("Report generated successfully")
}
```

## Conclusion

Choosing the right transaction isolation level is a balance between data consistency and performance. In real-world applications, it's recommended to select an appropriate isolation level based on specific business scenario requirements:

- For general web applications, "Read Committed" is usually a good choice
- For financial and order processing, "Repeatable Read" provides better data consistency guarantees
- For extremely important financial transactions, "Serializable" can be considered, but be aware of the performance impact
