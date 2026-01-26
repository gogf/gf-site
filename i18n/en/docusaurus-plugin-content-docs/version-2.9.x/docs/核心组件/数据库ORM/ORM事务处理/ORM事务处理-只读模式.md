---
slug: '/docs/core/gdb-transaction-readonly'
title: 'ORM Transactions - Read-Only Mode'
sidebar_position: 6000
hide_title: true
keywords: ['Transaction', 'Read-Only Mode', 'ReadOnly', 'ORM', 'Database', 'Transaction Safety', 'Data Consistency']
description: 'A comprehensive guide to GoFrame ORM transaction read-only mode, including basic concepts, advantages, application scenarios, and code examples to help developers improve database operation safety and performance.'
---

## Basic Introduction

Transaction read-only mode (`ReadOnly`) is a transaction processing feature provided by `GoFrame ORM` that allows developers to mark a transaction as read-only. In a read-only transaction, the database prohibits any modification operations (such as `INSERT`, `UPDATE`, `DELETE`, etc.) and only allows query operations. `GoFrame ORM` supports this feature through the `ReadOnly` field in the `TxOptions` struct.

## Advantages of Read-Only Mode

1. **Enhanced Security**: Prevents accidental data modification operations, ensuring that only read operations can be performed within the transaction
2. **Optimized Performance**: Databases can apply specific optimizations for read-only transactions, such as avoiding write locks and reducing lock contention
3. **Reduced Resource Consumption**: Read-only transactions typically consume fewer database resources, especially in high-concurrency scenarios
4. **Increased Concurrency**: Multiple read-only transactions can execute in parallel without blocking each other
5. **Support for Load Balancing**: Read-only transactions can be routed to read-only replicas, reducing the load on the primary database

## Application Scenarios

1. **Report Generation**: When generating complex reports that require querying large amounts of data but don't need to modify data
2. **Data Export Functions**: Ensuring data consistency during exports while preventing accidental modifications
3. **Complex Data Queries**: Executing multiple related queries within a transaction to ensure data consistency
4. **Read-Only API Endpoints**: Providing transactional guarantees for API endpoints that only serve data queries
5. **Data Analysis Operations**: Ensuring that data won't be modified when executing complex data analysis queries
6. **Audit and Log Queries**: Preventing accidental modifications when viewing historical records and audit logs

## Basic Usage

`GoFrame ORM` provides simple and easy-to-use APIs to create read-only transactions by using the `BeginWithOptions` or `TransactionWithOptions` methods and setting `ReadOnly: true` to enable read-only mode.

### Using `BeginWithOptions`

```go
// Start a read-only transaction
tx, err := db.BeginWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
})
// SQL: BEGIN

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

// Execute query operations
users, err := tx.Model("user").All()
// SQL: SELECT * FROM user

// Attempting to execute a modification operation will fail
_, err = tx.Update("user", g.Map{"status": "active"}, "id=1")
// In a read-only transaction, this will return an error

// Commit the transaction
if err = tx.Commit(); err != nil {
    tx.Rollback()
    return
}
```

### Using `TransactionWithOptions`

```go
// Use transaction closure function
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
}, func(ctx context.Context, tx gdb.TX) error {
    // Execute query operations
    users, err := tx.Model("user").Where("status", "active").All()
    // SQL: SELECT * FROM user WHERE status='active'
    
    if err != nil {
        return err
    }
    
    // Process query results
    fmt.Println("Active users count:", len(users))
    
    // Attempting to execute a modification operation will fail and automatically roll back the transaction
    _, err = tx.Model("user").Data(g.Map{"login_time": gtime.Now()}).Where("id", 1).Update()
    // In a read-only transaction, this will return an error
    
    return err // Returning nil will automatically commit the transaction, returning an error will automatically roll back
})
```

## Read-Only Transactions in MySQL

In `MySQL`, read-only transactions are implemented with the following SQL statements:

```sql
-- Start a read-only transaction
SET TRANSACTION READ ONLY;
START TRANSACTION;

-- Execute query operations
SELECT * FROM user;

-- Attempting to execute a modification operation will fail
UPDATE user SET status = 'active' WHERE id = 1;
-- Error: ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.

-- Commit the transaction
COMMIT;
```

## Important Considerations

1. Attempting to execute data modification operations in a read-only transaction will result in errors, and the transaction will be rolled back
2. Different databases may have varying levels of support and implementation for read-only transactions
3. Read-only transactions are primarily used to enhance security and performance, not as a forced access control mechanism
4. In high-concurrency systems, appropriate use of read-only transactions can significantly improve performance
5. Read-only transactions can typically be routed to read-only replicas of the database

## Practical Application Examples

### Report Generation

```go
// Use a read-only transaction to generate sales reports
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
}, func(ctx context.Context, tx gdb.TX) error {
    // 1. Query total sales
    totalSales, err := tx.Model("order").Where("status", "completed").Sum("amount")
    // SQL: SELECT SUM(amount) FROM order WHERE status='completed'
    
    if err != nil {
        return err
    }
    
    // 2. Query product sales information
    productSales, err := tx.Model("order_item")
        .Fields("product_id, SUM(quantity) as total_quantity, SUM(amount) as total_amount")
        .Group("product_id")
        .Order("total_amount DESC")
        .All()
    // SQL: SELECT product_id, SUM(quantity) as total_quantity, SUM(amount) as total_amount 
    //      FROM order_item GROUP BY product_id ORDER BY total_amount DESC
    
    if err != nil {
        return err
    }
    
    // 3. Query top customers
    topCustomers, err := tx.Model("order")
        .Fields("customer_id, COUNT(*) as order_count, SUM(amount) as total_spent")
        .Group("customer_id")
        .Order("total_spent DESC")
        .Limit(10)
        .All()
    // SQL: SELECT customer_id, COUNT(*) as order_count, SUM(amount) as total_spent 
    //      FROM order GROUP BY customer_id ORDER BY total_spent DESC LIMIT 10
    
    // Report generation logic...
    
    return nil // Returning nil automatically commits the transaction
})
```

### Data Export

```go
// Use a read-only transaction to export user data
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
}, func(ctx context.Context, tx gdb.TX) error {
    // Query basic user information
    users, err := tx.Model("user").All()
    // SQL: SELECT * FROM user
    
    if err != nil {
        return err
    }
    
    // Query detailed information for each user
    for _, user := range users {
        userId := user["id"]
        
        // Query user address
        address, err := tx.Model("user_address").Where("user_id", userId).One()
        // SQL: SELECT * FROM user_address WHERE user_id=?
        
        if err != nil {
            return err
        }
        
        // Query user orders
        orders, err := tx.Model("order").Where("user_id", userId).All()
        // SQL: SELECT * FROM order WHERE user_id=?
        
        if err != nil {
            return err
        }
        
        // Export data logic...
    }
    
    return nil
})
```

### Complex Data Analysis

```go
// Use a read-only transaction for complex data analysis
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
}, func(ctx context.Context, tx gdb.TX) error {
    // 1. Query user activity data
    userActivity, err := tx.Model("user_activity")
        .Fields("user_id, COUNT(*) as activity_count")
        .Where("activity_time", ">", "2023-01-01")
        .Group("user_id")
        .Order("activity_count DESC")
        .All()
    
    if err != nil {
        return err
    }
    
    // 2. Query product popularity
    productPopularity, err := tx.Model("product_view")
        .Fields("product_id, COUNT(*) as view_count")
        .Where("view_time", ">", "2023-01-01")
        .Group("product_id")
        .Order("view_count DESC")
        .Limit(20)
        .All()
    
    if err != nil {
        return err
    }
    
    // 3. Calculate conversion rates
    conversionRates, err := tx.Raw(`
        SELECT 
            p.category_id,
            COUNT(DISTINCT pv.user_id) as viewers,
            COUNT(DISTINCT o.user_id) as buyers,
            COUNT(DISTINCT o.user_id) / COUNT(DISTINCT pv.user_id) * 100 as conversion_rate
        FROM 
            product_view pv
        JOIN 
            product p ON pv.product_id = p.id
        LEFT JOIN 
            order_item oi ON oi.product_id = p.id
        LEFT JOIN 
            order o ON oi.order_id = o.id
        WHERE 
            pv.view_time > '2023-01-01'
        GROUP BY 
            p.category_id
        ORDER BY 
            conversion_rate DESC
    `).All()
    
    if err != nil {
        return err
    }
    
    // Data analysis logic...
    
    return nil
})
```

## Combining with Other Transaction Features

Read-only mode can be combined with other transaction features in `GoFrame ORM`, such as isolation levels and transaction propagation, to achieve more precise transaction control.

### Combining with Isolation Levels

```go
// Combine read-only mode with a specific isolation level
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
    Isolation: sql.LevelRepeatableRead,
}, func(ctx context.Context, tx gdb.TX) error {
    // Execute read operations with Repeatable Read isolation level
    // This ensures consistent reads without allowing any modifications
    
    // ... query operations ...
    
    return nil
})
```

### Combining with Transaction Propagation

```go
// Outer transaction with read-only mode
err := db.TransactionWithOptions(ctx, gdb.TxOptions{
    ReadOnly: true,
}, func(ctx context.Context, tx gdb.TX) error {
    // Execute some read operations
    
    // Nested transaction with specific propagation behavior
    // Since the outer transaction is read-only, the nested transaction will also be read-only
    err := tx.TransactionWithOptions(ctx, gdb.TxOptions{
        Propagation: gdb.PropagationRequired,
    }, func(ctx context.Context, tx2 gdb.TX) error {
        // Execute more read operations
        
        return nil
    })
    
    return err
})
```

## Alternative Approaches

If you need similar functionality but don't want to use read-only transactions, `GoFrame` provides alternative approaches:

1. **Manual Validation**:
   ```go
   // Manually check operations before executing them
   func ReadOnlyOperation(ctx context.Context, db gdb.DB) error {
       return db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
           // Only allow SELECT operations
           result, err := tx.Model("user").All()
           if err != nil {
               return err
           }
           
           // Process result...
           
           return nil
       })
   }
   ```

2. **DryRun Feature**:
   ```yaml
   # Enable via configuration file
   database:
     default:
       dryrun: true
   ```
   
   ```go
   // The database will only print SQL without executing it
   _, err := db.Model("user").Data(g.Map{"name": "John"}).Insert()
   // This will only print the SQL without actually modifying the database
   ```

3. **Read-Only Database Connection**:
   ```go
   // Configure a read-only database connection
   g.DB("readonly")
   
   // Use it for read operations
   result, err := g.DB("readonly").Model("user").All()
   ```

## Conclusion

Read-only transaction mode is a powerful feature in `GoFrame ORM` that enhances both security and performance for read-intensive operations. By explicitly declaring a transaction as read-only, developers can prevent accidental data modifications and allow the database to optimize query execution. This feature is particularly valuable in reporting, data export, and analysis scenarios where data consistency is important but no modifications are needed.

When designing applications with complex data access patterns, consider using read-only transactions for operations that don't require data modifications to improve both safety and performance.
