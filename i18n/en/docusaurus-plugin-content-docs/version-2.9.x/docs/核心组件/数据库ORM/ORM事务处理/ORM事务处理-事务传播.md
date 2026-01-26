---
slug: '/docs/core/gdb-transaction-propagation'
title: 'ORM Transactions - Propagation'
sidebar_position: 4000
hide_title: true
keywords: ['GoFrame', 'ORM', 'Transaction', 'Transaction Propagation', 'Nested Transaction', 'Distributed Transaction']
description: 'GoFrame ORM transaction propagation provides a flexible transaction management mechanism, supporting various transaction propagation behaviors to meet transaction processing requirements in complex business scenarios.'
---

Transaction Propagation is an advanced transaction management mechanism provided by the `GoFrame ORM` framework, used to control the behavior of nested transactions. In complex business scenarios, one transaction method may call other transaction methods, requiring clear definition of transaction propagation behavior to ensure data consistency and integrity.

## Basic Introduction

Transaction propagation defines how a transaction method should behave when called by another transaction method. `GoFrame ORM` supports multiple transaction propagation behaviors, allowing developers to choose the appropriate propagation type based on business requirements.

`GoFrame ORM` supports the following transaction propagation types:

- `PropagationNested` (default): If a transaction exists, creates a nested transaction (using savepoints); if no transaction exists, creates a new transaction.
- `PropagationRequired`: If a transaction exists, joins that transaction; if no transaction exists, creates a new transaction.
- `PropagationSupports`: If a transaction exists, joins that transaction; if no transaction exists, executes without a transaction.
- `PropagationRequiresNew`: Creates a new transaction; if a transaction exists, suspends the current transaction.
- `PropagationNotSupported`: Executes without a transaction; if a transaction exists, suspends the current transaction.
- `PropagationMandatory`: If a transaction exists, joins that transaction; if no transaction exists, throws an exception.
- `PropagationNever`: Executes without a transaction; if a transaction exists, throws an exception.

:::info
Note: To ensure compatibility with older versions of transaction processing, the default transaction propagation type in `GoFrame ORM` is `PropagationNested`, not `PropagationRequired`.
:::

## Advantages

1. **Flexible Transaction Management**: Choose different transaction propagation behaviors based on business requirements for more granular transaction control.
2. **Improved Code Reusability**: Service layer methods can define transaction behavior independently, without concern for whether the calling environment already has a transaction.
3. **Reduced Transaction Conflicts**: Through appropriate propagation behavior, reduce locking and conflicts caused by long transactions.
4. **Enhanced Error Isolation**: Using independent transactions (such as `PropagationRequiresNew`) can isolate error impacts and avoid entire transaction rollbacks.
5. **Simplified Complex Business Logic**: In complex business processes, different steps can use different transaction propagation strategies, making code clearer.

## Application Scenarios

1. **Service Composition**: When one service method calls multiple other service methods, you can choose to share the same transaction or use independent transactions based on business requirements.
2. **Logging**: Business operations need to record logs, but log write failures should not affect the main business logic; `PropagationRequiresNew` can be used.
3. **Batch Processing**: In batch processing, you might want each item to use an independent transaction so that the failure of one item does not affect others.
4. **Transaction Compensation**: In distributed systems, different propagation behaviors can be used to implement transaction compensation mechanisms.
5. **Nested Business Logic**: Some steps in complex business logic may need to be treated as independent transaction units, using `PropagationNested`.

## Usage Examples

Before starting the examples, let's create a table for testing:

```sql
CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY,
    username VARCHAR(50)
);
```

:::tip
If you want to run the following examples step by step, you need to clear the `user` table data before running each new example.
:::

### PropagationNested (Nested Transaction, Default)

If a transaction exists, creates a nested transaction (using savepoints); if no transaction exists, creates a new transaction.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Execute transaction
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in the outer transaction
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "outer_user",
		})
		if err != nil {
			return err
		}

		// Nested transaction - using PropagationNested to create a nested transaction (using savepoint)
		err = tx.Transaction(ctx, func(ctx context.Context, tx2 gdb.TX) error {
			// Insert data in the nested transaction
			_, err = tx2.Insert("user", g.Map{
				"id":       2,
				"username": "nested_user",
			})
			if err != nil {
				return err
			}

			// Simulate an error, causing the nested transaction to roll back to the savepoint
			return fmt.Errorf("nested transaction deliberately failed")
		})

		// Nested transaction failed, but outer transaction can continue
		fmt.Println("Nested transaction error:", err)

		// Continue inserting data in the outer transaction
		_, err = tx.Insert("user", g.Map{
			"id":       3,
			"username": "outer_after_nested",
		})
		// Outer transaction commits normally
		return nil
	})

	if err != nil {
		fmt.Println("Transaction execution failed:", err)
		return
	}

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	// Data only contains records with id 1 and 3, not 2
	fmt.Println("Query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');

-- Create savepoint
SAVEPOINT sp1;
-- Insert nested transaction data
INSERT INTO user(id,username) VALUES(2,'nested_user');
-- Nested transaction fails, roll back to savepoint
ROLLBACK TO SAVEPOINT sp1;

-- Continue outer transaction
INSERT INTO user(id,username) VALUES(3,'outer_after_nested');
-- Commit outer transaction
COMMIT;
```

### PropagationRequired (Ensure Transaction)

The main difference between `PropagationRequired` and `PropagationNested` is that `PropagationRequired` joins the existing transaction when a transaction exists, and creates a new transaction when no transaction exists, **without creating a nested transaction**.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Execute transaction
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in the outer transaction
		// Using tx object or db object to operate on data tables within the transaction closure is equivalent
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "outer_user",
		})
		if err != nil {
			return err
		}

		// Nested transaction - default using PropagationRequired
		err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
			Propagation: gdb.PropagationRequired,
		}, func(ctx context.Context, tx2 gdb.TX) error {
			// Insert data in the nested transaction (using the same transaction)
			// Using tx2 object or db object to operate on data tables within the transaction closure is equivalent
			_, err = tx2.Insert("user", g.Map{
				"id":       2,
				"username": "inner_user",
			})
			return err
		})

		return err
	})
	if err != nil {
		fmt.Println("Transaction execution failed:", err)
		return
	}

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	fmt.Println("Query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');
-- Insert inner data (using the same transaction)
INSERT INTO user(id,username) VALUES(2,'inner_user');
-- Commit transaction
COMMIT;
```

### PropagationRequiresNew (Create New Transaction)

Creates a new transaction; if a transaction exists, suspends the current transaction.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Execute transaction
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in the outer transaction
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "outer_user",
		})
		if err != nil {
			return err
		}

		// Nested transaction - using PropagationRequiresNew to create a new transaction
		err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
			Propagation: gdb.PropagationRequiresNew,
		}, func(ctx context.Context, tx2 gdb.TX) error {
			// Insert data in the new transaction
			_, err = tx2.Insert("user", g.Map{
				"id":       2,
				"username": "new_tx_user",
			})
			// Simulate an error, causing the inner transaction to roll back
			return fmt.Errorf("inner transaction deliberately failed")
		})

		// Inner transaction failure does not affect the outer transaction
		fmt.Println("Inner transaction error:", err)

		// Continue inserting data in the outer transaction
		_, err = tx.Insert("user", g.Map{
			"id":       3,
			"username": "outer_after_error",
		})
		// Outer transaction commits normally
		return nil
	})

	if err != nil {
		fmt.Println("Transaction execution failed:", err)
		return
	}

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	fmt.Println("Query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');

-- Start a new independent transaction
BEGIN;
-- Insert inner data (using new transaction)
INSERT INTO user(id,username) VALUES(2,'new_tx_user');
-- Inner transaction rolls back
ROLLBACK;

-- Continue outer transaction
INSERT INTO user(id,username) VALUES(3,'outer_after_error');
-- Commit outer transaction
COMMIT;
```

### PropagationSupports (Support Current Transaction)

If a transaction exists, joins that transaction; if no transaction exists, executes without a transaction.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Scenario 1: When an external transaction exists, join the external transaction
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in the outer transaction
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "outer_user",
		})
		if err != nil {
			return err
		}

		// Nested transaction - using PropagationSupports
		err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
			Propagation: gdb.PropagationSupports,
		}, func(ctx context.Context, tx2 gdb.TX) error {
			// Insert data in a way that supports the current transaction (using outer transaction)
			_, err = tx2.Insert("user", g.Map{
				"id":       2,
				"username": "supports_user",
			})
			return err
		})

		return err
	})
	if err != nil {
		fmt.Println("Scenario 1 execution failed:", err)
		return
	}

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	fmt.Println("Scenario 1 query results:", result)

	// Clear data table
	_, err = db.Exec(ctx, `TRUNCATE TABLE user`)
	if err != nil {
		fmt.Println("Execution failed:", err)
		return
	}

	// Scenario 2: When no external transaction exists, execute without a transaction
	err = db.TransactionWithOptions(ctx, gdb.TxOptions{
		Propagation: gdb.PropagationSupports,
	}, func(ctx context.Context, tx gdb.TX) error {
		// Insert data without a transaction
		_, err = tx.Insert("user", g.Map{
			"id":       3,
			"username": "non_tx_user",
		})
		return err
	})
	if err != nil {
		fmt.Println("Scenario 2 execution failed:", err)
		return
	}

	// Query results
	result, err = db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	fmt.Println("Scenario 2 query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Scenario 1: With external transaction
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');
-- Insert inner data (using outer transaction)
INSERT INTO user(id,username) VALUES(2,'supports_user');
-- Commit transaction
COMMIT;

-- Scenario 2: Without external transaction
-- Insert data directly without a transaction
INSERT INTO user(id,username) VALUES(3,'non_tx_user');
```

### PropagationMandatory (Force Transaction Use)

If a transaction exists, joins that transaction; if no transaction exists, throws an exception.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "context"
    "fmt"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var (
        ctx = context.Background()
        db  = g.DB()
    )
    db.SetDebug(true)

    // Scenario 1: When an external transaction exists, join the external transaction
    err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
        // Insert data in the outer transaction
        _, err := tx.Insert("user", g.Map{
            "id":       1,
            "username": "outer_user",
        })
        if err != nil {
            return err
        }

        // Nested transaction - using PropagationMandatory
        err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
            Propagation: gdb.PropagationMandatory,
        }, func(ctx context.Context, tx2 gdb.TX) error {
            // Insert data in a way that mandates using the current transaction (using outer transaction)
            _, err = tx2.Insert("user", g.Map{
                "id":       2,
                "username": "mandatory_user",
            })
            return err
        })

        return err
    })

    if err != nil {
        fmt.Println("Scenario 1 execution failed:", err)
        return
    }

    // Query results
    result, err := db.Model("user").All()
    if err != nil {
        fmt.Println("Query failed:", err)
        return
    }

    fmt.Println("Scenario 1 query results:", result)

    // Clear data table
    _, err = db.Exec(ctx, `TRUNCATE TABLE user`)
    if err != nil {
        fmt.Println("Execution failed:", err)
        return
    }

    // Scenario 2: When no external transaction exists, an exception will be thrown
    fmt.Println("Scenario 2: Using PropagationMandatory without an external transaction")
    err = db.TransactionWithOptions(ctx, gdb.TxOptions{
        Propagation: gdb.PropagationMandatory,
    }, func(ctx context.Context, tx gdb.TX) error {
        // This code will not execute because an exception will be thrown when there is no external transaction
        _, err = tx.Insert("user", g.Map{
            "id":       3,
            "username": "will_not_insert",
        })
        return err
    })

    // Should have an error because there is no external transaction
    fmt.Println("Scenario 2 error:", err)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Scenario 1: With external transaction
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');
-- Insert inner data (using outer transaction)
INSERT INTO user(id,username) VALUES(2,'mandatory_user');
-- Commit transaction
COMMIT;

-- Scenario 2: Without external transaction
-- Throw exception: "mandatory transaction is required, but none exists"
```

### PropagationNever (Disallow Execution in Transaction)

Executes without a transaction; if a transaction exists, throws an exception.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Scenario 1: When an external transaction exists, an exception will be thrown
	fmt.Println("Scenario 1: Using PropagationNever with an external transaction")
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in the outer transaction
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "outer_user",
		})
		if err != nil {
			return err
		}

		// Nested transaction - using PropagationNever
		err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
			Propagation: gdb.PropagationNever,
		}, func(ctx context.Context, tx2 gdb.TX) error {
			// This code will not execute because an exception will be thrown when using PropagationNever in an external transaction
			_, err := tx2.Insert("user", g.Map{
				"id":       2,
				"username": "will_not_insert",
			})
			return err
		})

		// Should have an error
		fmt.Println("Nested transaction error:", err)

		// Continue outer transaction
		return nil
	})
	if err != nil {
		fmt.Println("Scenario 1 execution failed:", err)
		return
	}

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}
	// Should only have record with id=1
	fmt.Println("Scenario 1 query results:", result)

	// Clear data table
	_, err = db.Exec(ctx, `TRUNCATE TABLE user`)
	if err != nil {
		fmt.Println("Execution failed:", err)
		return
	}

	// Scenario 2: When no external transaction exists, execute without a transaction
	err = db.TransactionWithOptions(ctx, gdb.TxOptions{
		Propagation: gdb.PropagationNever,
	}, func(ctx context.Context, tx gdb.TX) error {
		// Insert data without a transaction
		_, err = tx.Insert("user", g.Map{
			"id":       3,
			"username": "non_tx_user",
		})
		return err
	})
	if err != nil {
		fmt.Println("Scenario 2 execution failed:", err)
		return
	}

	// Query results
	result, err = db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}
	// Should have record with id=3
	fmt.Println("Scenario 2 query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Scenario 1: With external transaction
-- Start outer transaction
BEGIN;
-- Insert outer data
INSERT INTO user(id,username) VALUES(1,'outer_user');
-- Throw exception: "transaction is existing, but never transaction is required"
-- Commit outer transaction
COMMIT;

-- Scenario 2: Without external transaction
-- Insert data directly without a transaction
INSERT INTO user(id,username) VALUES(3,'non_tx_user');
```

### PropagationNotSupported (Execute Without Transaction)

Executes without a transaction; if a transaction exists, suspends the current transaction.

```go
package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

func main() {
	var (
		ctx = context.Background()
		db  = g.DB()
	)
	db.SetDebug(true)

	// Execute transaction
	err := db.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Insert data in transaction
		_, err := tx.Insert("user", g.Map{
			"id":       1,
			"username": "tx_user",
		})
		if err != nil {
			return err
		}

		// Use PropagationNotSupported to suspend current transaction
		err = tx.TransactionWithOptions(ctx, gdb.TxOptions{
			Propagation: gdb.PropagationNotSupported,
		}, func(ctx context.Context, tx2 gdb.TX) error {
			// Write data without a transaction
			_, err = tx2.Insert("user", g.Map{
				"id":       2,
				"username": "non_tx_user",
			})
			return err
		})
		if err != nil {
			return err
		}

		// Simulate an error, causing the outer transaction to roll back
		return fmt.Errorf("outer transaction deliberately failed")
	})

	fmt.Println("Transaction execution result:", err)

	// Query results
	result, err := db.Model("user").All()
	if err != nil {
		fmt.Println("Query failed:", err)
		return
	}

	// Should only see record with id=2, because record with id=1 was canceled when the transaction rolled back
	fmt.Println("Query results:", result)
}
```

The SQL statements executed by the above code are similar to:

```sql
-- Start transaction
BEGIN;
-- Insert transaction data
INSERT INTO user(id,username) VALUES(1,'tx_user');

-- Execute without transaction (commit directly)
INSERT INTO user(id,username) VALUES(2,'non_tx_user');

-- Outer transaction rolls back
ROLLBACK;
```

## Conclusion

The transaction propagation feature of `GoFrame ORM` provides developers with a flexible transaction management mechanism that can meet transaction processing requirements in complex business scenarios. By choosing appropriate transaction propagation behaviors, more granular transaction control can be achieved, improving system reliability and performance.

In practical applications, it is recommended to choose appropriate propagation behaviors based on business characteristics:

1. For most scenarios, the default `PropagationRequired` is sufficient.
2. When independent transactions are needed to isolate error impacts, `PropagationRequiresNew` can be used.
3. For scenarios requiring savepoint functionality, `PropagationNested` can be used.
4. When certain operations do not need transaction protection, `PropagationNotSupported` can be used.

By properly using the transaction propagation mechanism, more robust and maintainable applications can be built.
