---
slug: "/articles/database-transaction-practice"
title: "Go Transaction Processing Best Practices: The Right Way to Ensure Data Consistency"
hide_title: true
keywords: ["GoFrame", "Transaction Processing", "Data Consistency", "Isolation Levels", "Optimistic Locking", "Distributed Transactions", "SAGA Pattern", "Modular Design", "Error Handling", "Performance Optimization"]
description: "An in-depth exploration of transaction processing best practices in Go, including basic transaction operations, isolation level selection, lock strategy optimization, modular design, and distributed transaction solutions. Through an e-commerce order system case study, learn how to build high-performance, reliable transaction processing modules that ensure data consistency and system stability"
---


When building enterprise-level applications, data consistency is fundamental to ensuring business logic correctness. When a business operation involves multiple database updates, if any step fails, we typically want to revert all changes—this is the core concept of database transactions. This article will explore how to correctly implement transaction processing in the `GoFrame` framework to ensure data consistency, providing practical examples and best practices.

## 1. Business Scenarios and Necessity of Transaction Processing

Transaction processing is a key mechanism for ensuring the atomicity, consistency, isolation, and durability (ACID) of database operations. Here are several typical business scenarios that require transaction processing to guarantee data consistency:

### 1.1 Financial Transfer Systems

The most classic transaction processing scenario is bank transfers, involving balance changes in at least two accounts:

- Deducting an amount from account A
- Adding an amount to account B

These two operations must be executed as an atomic unit—either both succeed or both fail. If only half is completed (for example, the deduction succeeds but the deposit fails), it will lead to lost funds or money created out of thin air, causing serious financial problems.

### 1.2 E-commerce Order Processing

Order creation in e-commerce platforms typically involves multiple related operations:

- Creating an order record
- Updating product inventory
- Creating payment records
- Generating logistics information

If any of these operations fail, the entire order process should be rolled back; otherwise, it may lead to overselling, inventory inconsistencies, or order status confusion.

### 1.3 User Registration and Associated Data

The user registration process may involve operations across multiple tables:

- Creating basic user information
- Creating user preference settings
- Initializing user wallet
- Assigning default roles and permissions

If any of these steps fail, the entire registration process should be rolled back to avoid incomplete user records.

### 1.4 Multi-service Collaborative Operations

In microservice architectures, a business operation may involve data changes across multiple services:

- Updating user status in the user service
- Creating a new order in the order service
- Reducing inventory in the inventory service

This kind of cross-service data consistency is a more complex issue, typically requiring distributed transaction solutions.

## 2. GoFrame Transaction Processing Basics

The `GoFrame` framework provides a concise yet powerful transaction processing API, offering higher-level abstractions on top of standard database transactions, making transaction processing simpler and safer.

### 2.1 Basic Usage of GoFrame Transactions

The `ORM` component of `GoFrame` provides two ways of transaction processing:

1. Function callback-based transaction processing (recommended)
2. Manual transaction start/commit/rollback

#### 2.1.1 Function Callback-based Transaction Processing

This is the recommended transaction processing method in `GoFrame`, which automatically handles commit and rollback operations, reducing the possibility of errors:

```go
// Using the Transaction method for transaction operations
if err := g.DB().Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
    // Execute transaction operations here

    // For example, deduct an amount from account A
    _, err := tx.Ctx(ctx).Model("accounts").
        Where("id", 1).
        Decrement("balance", 100)
    if err != nil {
        return err  // Returning an error will automatically trigger a rollback
    }
    
    // Add an amount to account B
    _, err = tx.Ctx(ctx).Model("accounts").
        Where("id", 2).
        Increment("balance", 100)
    if err != nil {
        return err  // Returning an error will automatically trigger a rollback
    }
    
    // Returning nil indicates success and will automatically commit the transaction
    return nil
}); err != nil {
    // Handle transaction error
    return err
}
```

#### 2.1.2 Manual Transaction Start/Commit/Rollback

For more fine-grained control, you can also manually manage transactions:

```go
// Begin transaction
tx, err := g.DB().Begin(ctx)
if err != nil {
    return err
}

// Ensure proper error handling at the end of the function
defer func() {
    if err != nil {
        tx.Rollback()
    }
}()

// Execute transaction operations
_, err = tx.Ctx(ctx).Model("accounts").
    Where("id", 1).
    Decrement("balance", 100)
if err != nil {
    return err
}

_, err = tx.Ctx(ctx).Model("accounts").
    Where("id", 2).
    Increment("balance", 100)
if err != nil {
    return err
}

// Commit transaction
return tx.Commit()
```

### 2.2 Advanced Features of GoFrame Transaction Processing

The `ORM` component of `GoFrame` provides advanced transaction processing features, such as transaction nesting and specifying transaction isolation levels.

#### 2.2.1 Safe Transaction Nesting

In `GoFrame`, transactions can be safely nested, with inner transactions automatically reusing the connection of the outer transaction:

```go
// Outer transaction
g.DB().Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
    // Operation 1
    
    // Nested transaction, automatically reuses the connection of the outer transaction
    g.DB().Transaction(ctx, func(ctx context.Context, tx2 *gdb.TX) error {
        // Operation 2
        return nil
    })
    
    // Operation 3
    return nil
})
```

#### 2.2.2 Specifying Transaction Isolation Level

`GoFrame` supports setting the isolation level of transactions:

```go
// Set isolation level to serializable
g.DB().TransactionWithOptions(
	ctx, 
	gdb.TransactionOptions{
        IsolationLevel: sql.LevelSerializable,
    }, 
	func(ctx context.Context, tx *gdb.TX) error {
		// Transaction operations...
		return nil
	},
)
```

## 3. Case Study: E-commerce Order System Transaction Processing

Let's demonstrate how to correctly implement transaction processing in `GoFrame` through an e-commerce order system example. Assume we have the following data tables:

```sql
-- Orders table
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Order ID',
  `user_id` bigint NOT NULL COMMENT 'User ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT 'Total order amount',
  `status` varchar(20) NOT NULL COMMENT 'Order status',
  `created_at` datetime NOT NULL COMMENT 'Creation time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Main orders table';

-- Order items table
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Order item ID',
  `order_id` bigint NOT NULL COMMENT 'Order ID',
  `product_id` bigint NOT NULL COMMENT 'Product ID',
  `quantity` int NOT NULL COMMENT 'Purchase quantity',
  `price` decimal(10,2) NOT NULL COMMENT 'Product unit price',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Order items table';

-- Products table
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Product ID',
  `name` varchar(100) NOT NULL COMMENT 'Product name',
  `price` decimal(10,2) NOT NULL COMMENT 'Product price',
  `stock` int NOT NULL COMMENT 'Inventory quantity',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Products table';

-- Users table
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `name` varchar(50) NOT NULL COMMENT 'Username',
  `balance` decimal(10,2) NOT NULL COMMENT 'Account balance',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Users table';
```

### 3.1 Defining Models and Services

First, we define the necessary models and service interfaces (showing only core code):

```go
// entity/orders.go - Order model
type Order struct {
    Id          int64       // Order ID
    UserId      int64       // User ID
    TotalAmount float64     // Total order amount
    Status      string      // Order status
    CreatedAt   *gtime.Time // Creation time
}

// entity/order_items.go - Order item model
type OrderItem struct {
    Id        int64   // Order item ID
    OrderId   int64   // Order ID
    ProductId int64   // Product ID
    Quantity  int     // Purchase quantity
    Price     float64 // Product unit price
}
```

```go
// internal/logic/order/order.go

// OrderItemInput Order input model
type OrderItemInput struct {
    ProductId int64 // Product ID
    Quantity  int   // Purchase quantity
}

// OrderService Order service interface
type OrderService interface {
    // Create order
    CreateOrder(
		ctx context.Context, userId int64, items []model.OrderItemInput,
	) (orderId int64, err error)
}
```

### 3.2 Implementing Service Logic with Transaction Processing

Below is the service implementation for creating an order with complete transaction processing:

```go
// internal/logic/order/order.go
type orderService struct{
	db *gdb.DB
}

// Create order method implementation
func (s *orderService) CreateOrder(
	ctx context.Context, userId int64, items []model.OrderItemInput,
) (orderId int64, err error) {
    // Validation logic outside the transaction
    // ...code for validating user existence omitted...

    // Use transaction processing for the entire order creation process
    err = s.db.Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
        // Core transaction logic will be implemented in sections below
        return s.executeOrderTransaction(ctx, userId, items, &orderId)
    })
    
    return orderId, err
}
```

We break down the transaction logic into multiple steps, each implementing a core function:

#### 3.2.1 Core Process

```go
// Execute the core logic of the order transaction
func (s *orderService) executeOrderTransaction(
	ctx context.Context, userId int64, items []model.OrderItemInput, orderId int64,
) error {
    // 1. Calculate order amount and validate inventory
    totalAmount, err := s.calculateTotalAndValidateStock(ctx, items)
    if err != nil {
        return err
    }
    
    // 2. Validate user balance
    if err := s.validateUserBalance(ctx, userId, totalAmount); err != nil {
        return err
    }
    
    // 3. Create order record
    orderId, err := s.createOrderRecord(ctx, userId, totalAmount)
    if err != nil {
        return err
    }

    // 4. Create order items and update inventory
    if err := s.createOrderItemsAndUpdateStock(ctx, orderId, items); err != nil {
        return err
    }
    
    // 5. Deduct user balance
    if err := s.deductUserBalance(ctx, userId, totalAmount); err != nil {
        return err
    }
    
    return nil
}
```

#### 3.2.2 Calculate Order Amount and Validate Inventory

```go
// Calculate order amount and validate inventory
func (s *orderService) calculateTotalAndValidateStock(
	ctx context.Context, items []model.OrderItemInput,
) (float64, error) {
    var totalAmount float64 = 0
    for _, item := range items {
        // Check product inventory
        productStock, err := s.db.Ctx(ctx).Model("products").
            Where("id", item.ProductId).
            Value("stock")
        if err != nil {
            return 0, err
        }
        if productStock.Int() < item.Quantity {
            return 0, gerror.Newf("insufficient stock for product: %d", item.ProductId)
        }
        
        // Get product price and accumulate amount
        productPrice, err := s.db.Ctx(ctx).Model("products").
            Where("id", item.ProductId).
            Value("price")
        if err != nil {
            return 0, err
        }
        totalAmount += productPrice.Float64() * float64(item.Quantity)
    }
    
    return totalAmount, nil
}
```

#### 3.2.3 Validate User Balance

```go
// Validate user balance
func (s *orderService) validateUserBalance(
	ctx context.Context, userId int64, totalAmount float64,
) error {
    userBalance, err := s.db.Ctx(ctx).Model("users").
        Where("id", userId).
        Value("balance")
    if err != nil {
        return err
    }
    if userBalance.Float64() < totalAmount {
        return gerror.New("insufficient balance")
    }
    return nil
}
```

#### 3.2.4 Create Order Record

```go
// Create order record
func (s *orderService) createOrderRecord(
	ctx context.Context, userId int64, totalAmount float64,
) (int64, error) {
    orderId, err := s.db.Ctx(ctx).Model("orders").
        Data(g.Map{
            "user_id":      userId,
            "total_amount": totalAmount,
            "status":      "pending",
            "created_at":   gtime.Now(),
        }).
        InsertAndGetId()
    if err != nil {
        return 0, err
    }
    return orderId, nil
}
```

#### 3.2.5 Create Order Items and Update Inventory

```go
// Create order items and update inventory
func (s *orderService) createOrderItemsAndUpdateStock(
	ctx context.Context, orderId int64, items []model.OrderItemInput,
) error {
    for _, item := range items {
        // Get product price
        productPrice, err := s.db.Ctx(ctx).Model("products").
            Where("id", item.ProductId).
            Value("price")
        if err != nil {
            return err
        }
        // Create order item
        _, err = s.db.Ctx(ctx).Model("order_items").
            Data(g.Map{
                "order_id":   orderId,
                "product_id": item.ProductId,
                "quantity":   item.Quantity,
                "price":      productPrice.Float64(),
            }).
            Insert()
        if err != nil {
            return err
        }
        // Update product inventory
        _, err = s.db.Ctx(ctx).Model("products").
            Where("id", item.ProductId).
            Decrement("stock", item.Quantity)
        if err != nil {
            return err
        }
    }
    
    return nil
}
```

#### 3.2.6 Deduct User Balance

```go
// Deduct user balance
func (s *orderService) deductUserBalance(
	ctx context.Context, userId int64, totalAmount float64,
) error {
    _, err := s.db.Ctx(ctx).Model("users").
        Where("id", userId).
        Decrement("balance", totalAmount)
    return err
}
```

The above code completes the following transaction operations:

1. Calculate order amount and validate inventory
2. Validate user balance
3. Create main order record
4. Create order items and update product inventory
5. Deduct user balance

If any of these steps fail, the entire order creation process will be rolled back, ensuring data consistency.

## 4. Transaction Processing Considerations and Best Practices

Overreliance on transactions can lead to performance issues, deadlocks, and increased application complexity. Below are some fundamental principles and best practices to consider when using transactions in `GoFrame`.

### 4.1 Controlling Transaction Scope and Duration

1. **Minimize transaction scope**: Only include database operations that must be executed as atomic units in transactions. Don't include external service requests, HTTP calls, or unnecessary redundant operations.

2. **Keep transactions concise**: Transactions should be short and focused, as longer transactions increase lock duration and affect concurrency.

	```go
	// Good practice: Only perform necessary database operations within transactions
	g.DB().Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
		// Preparation work (such as parameter validation, data preparation) should be done outside the transaction
		
		// Only execute necessary database operations within the transaction
		return nil
	})
	```

### 4.2 Properly Handling Errors and Exceptions

1. **Always check errors**: Check for errors after each database operation and return errors to trigger rollbacks when errors occur.

2. **Avoid panics whenever possible**: Uncaught `panic`s in transactions can lead to connection leaks or database locks being held. In function callback-based transactions, `GoFrame` automatically handles `panic`s and rolls back transactions, but in manual transaction mode, use `defer` and `recover` to ensure proper cleanup.

	```go
	// Proper error and panic handling in manual transactions
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return err
	}

	// Use defer to ensure transaction connections are always properly handled
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p) // Optional re-throw or handle panic
		} else if err != nil {
			tx.Rollback()
		}
	}()

	// Execute transaction operations
	```

### 4.3 Database Transaction Performance Optimization

1. **Choose appropriate isolation levels**: Select isolation levels based on business requirements; higher isolation levels affect concurrent performance.

	| Isolation Level | Description | Characteristics | Application Scenarios |
	| :--- | :--- | :--- | :--- |
	| `READ UNCOMMITTED` | Lowest isolation level | No locks, dirty read issues | Report queries with low data consistency requirements |
	| `READ COMMITTED` | Medium isolation level | Prevents dirty reads, non-repeatable reads and phantom reads exist | General transaction processing |
	| `REPEATABLE READ` | MySQL default isolation level | Prevents dirty reads and non-repeatable reads, phantom reads exist | Business requiring consistent reads |
	| `SERIALIZABLE` | Highest isolation level | Complete serialization, prevents all concurrency issues | Financial and high-security requirement scenarios |

2. **Avoid long transactions**: Long transactions not only hold database locks but can also cause record issues. Consider splitting a large transaction into multiple smaller ones, or use distributed transactions.

3. **Optimize lock strategies**: Proper lock strategies can significantly improve transaction concurrency performance.

   - **Use optimistic locking**: In scenarios with low conflict probability, use version numbers or timestamps for optimistic lock control to avoid long-term locking.
   
		```go
		// Optimistic locking example
		func UpdateWithOptimisticLock(ctx context.Context, id int, data g.Map) error {
			// Query current version
			version, err := g.DB().Ctx(ctx).
				Model("products").
				Where("id", id).
				Value("version")
			if err != nil {
				return err
			}
			
			// Use version number condition for updating
			data["version"] = version.Int() + 1
			result, err := g.DB().Ctx(ctx).
				Model("products").
				Where("id", id).
				Where("version", version.Int()).
				Data(data).
				Update()
			if err != nil {
				return err
			}
			
			// Check if update was successful
			if result.RowsAffected() == 0 {
				return gerror.New("data has been modified by another user, please refresh and try again")
			}
			return nil
		}
		```
   
   - **Fine-grained lock granularity**: Lock the smallest possible range of data, use row locks instead of table locks, and minimize lock duration as much as possible.
   
   - **Logical query order**: When accessing multiple tables in a transaction, maintain a consistent access order to reduce deadlock risks.

### 4.4 Transaction Processing Architectural Design

1. **Layered design**: Centralize transaction logic in the service layer, rather than dispersing it across multiple controllers or application components.

	```go
	// Implement transaction logic in the service layer
	// internal/logic/order/order.go
	func (s *orderService) CreateOrder(ctx context.Context, input *model.CreateOrderInput) error {
		return s.db.Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
			// ... Complete transaction logic
			return nil
		})
	}

	// Call the service in the controller
	// internal/controller/order/order.go
	func (c *orderController) Create(ctx context.Context, req *v1.CreateOrderReq)(res *v1.CreateOrderRes, err error) {
		// Call the service containing transaction logic
		if err := c.service.CreateOrder(ctx, &model.CreateOrderInput{
			// ... Parameter binding
		}); err != nil {
			// ... Error handling
		}
		// ... Response handling
	}
	```

2. **Addressing distributed transactions**: When transactions need to span microservices or databases, consider using reliable message queues, event-driven patterns, or the `SAGA` pattern.

3. **Using transaction nesting judiciously**: Complex transaction nesting can lead to code maintenance difficulties and logical confusion. In `GoFrame`, inner nested transactions automatically reuse the connection of the outer transaction (called "virtual nesting"), not creating true nested transactions. While this mechanism is technically safe, clear transaction boundaries and responsibility divisions should still be maintained.

### 4.5 Multi-datasource and Multi-database Transactions

1. **Resource localization principle**: Try to ensure related data is in the same database to facilitate local transactions.

2. **For necessary cross-database scenarios**: In cases requiring cross-database transactions, consider:
   - Distributed transaction coordinators (`XA`)
   - Compensating transactions (`SAGA`)
   - Message-based eventual consistency solutions

		```go
		// A simplified message-driven cross-database transaction example

		// 1. First phase of business operation
		func createOrderFirstPhase(ctx context.Context, input *model.OrderInput) (int64, error) {
			var orderId int64
			err := g.DB("db1").Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
				// Create order record
				result, err := tx.Insert("orders", g.Map{/*...*/})
				if err != nil {
					return err
				}
				orderId, err = result.LastInsertId()
				if err != nil {
					return err
				}
				
				// Send message to trigger next phase
				return mqClient.Send("order_created", &message.OrderCreated{
					OrderId: orderId,
					// Other data...
				})
			})
			return orderId, err
		}

		// 2. Listen for messages to process the next phase
		func handleOrderCreated(msg *message.OrderCreated) error {
			return g.DB("db2").Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
				// Process inventory and other database operations
				
				// If successful, can also send messages for the next step
				return nil 
			})
		}
		```

## 5. Conclusion

The `GoFrame` framework provides flexible and powerful transaction processing capabilities, enabling developers to ensure data consistency while avoiding common pitfalls. By following the best practices in this article, you will be able to better utilize transactions in practical applications and build robust applications with high data consistency guarantees.

Remember, good transaction design should achieve balance in the following aspects:

1. **Appropriate scope**: Only include necessary operations in transactions
2. **Compact duration**: Reduce transaction duration
3. **Correct isolation level**: Choose based on business scenarios
4. **Robust error handling**: Always check and handle errors
5. **Clear layered design**: Centralize transaction logic in the service layer

Through proper transaction handling, your application will be able to find an appropriate balance between concurrency, scalability, and data security.
