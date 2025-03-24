---
slug: '/articles/database-sharding-in-go'
title: 'Database Sharding in Go: A Practical E-commerce Case Study'
hide_title: true
keywords: ['GoFrame', 'Database Sharding', 'Database Partitioning', 'Horizontal Scaling', 'MySQL Sharding', 'E-commerce System', 'Go Implementation', 'High Performance']
description: 'A comprehensive guide on implementing database sharding in Go using a real-world e-commerce system case study, covering design principles and practical implementation with MySQL to handle large-scale data challenges.'
---

## Introduction

As business scales grow, the performance bottlenecks of single databases become increasingly apparent. When data volume reaches a certain threshold, excessive data in a single table or high load on a single database can significantly degrade read and write performance, potentially leading to system unavailability. Database sharding has become an indispensable part of large-scale system architecture as an effective solution to this challenge.

This article uses an e-commerce system as a practical case study, demonstrating database sharding design and implementation using the `GoFrame` framework and `MySQL` database, helping developers tackle large-scale data challenges effectively.

## Database Sharding Use Cases

### What is Database Sharding?

Database sharding involves distributing table data across different databases or tables according to specific rules, addressing performance issues caused by large data volumes in single databases or tables.

- **Database Sharding**: Distributing data across different database instances to address limitations in database connections, single-machine disk space, and computing power.
- **Table Sharding**: Spreading data across multiple tables within the same database to improve query efficiency when dealing with large data volumes.

### Suitable Scenarios

Database sharding is particularly useful in these scenarios:

1. **User Systems**: User data in large internet applications can be sharded by user ID across multiple databases and tables.
2. **Order Systems**: E-commerce platform order data can be sharded by order ID or time dimension to handle high-concurrency order processing.
3. **Logging Systems**: System logs and operation logs with rapidly growing data volumes are typically sharded by time dimension.
4. **Social Media**: User relationships and content data in social platforms can be sharded by user ID or content ID.
5. **IoT Applications**: Massive device-generated data can be sharded by device ID or time.

### Why Sharding is Necessary

1. **Performance Enhancement**: Reduces single table data volume, decreases index depth, improves query efficiency; distributes database load to increase concurrent processing capability.
2. **Breaking Limitations**: Overcomes single-machine database limitations in storage capacity, connections, and computing power.
3. **High Availability**: Database-level sharding enables fault isolation, improving overall system availability.
4. **Scalability**: Supports horizontal scaling through adding database nodes or tables as business grows.
5. **Maintenance Efficiency**: Enables independent backup, recovery, and archiving operations per shard, simplifying database maintenance.

## E-commerce Order System Case Study

Let's explore implementing database sharding with `GoFrame` using an e-commerce order system as an example.

### Business Requirements Analysis

Consider an e-commerce platform generating massive order data daily, where a single table can no longer handle the load, necessitating database sharding.

**Order Table Structure**:
- Order ID: Unique identifier
- User ID: Ordering user
- Order Amount: Total order amount
- Order Status: Current order status
- Create Time: Order creation time
- Update Time: Order update time

**Business Characteristics**:
- Large and rapidly growing order data volume
- Queries primarily based on order ID and user ID
- Historical order queries are less frequent but require long-term storage
- System needs to support rapid capacity expansion

### Sharding Strategy Design

Based on business characteristics, we adopt the following sharding strategy:

1. **Database Sharding**: **Shard by user ID modulo** to distribute different users' orders across database instances
2. **Table Sharding**: **Shard by order creation time monthly** for efficient historical data archiving and query optimization

**Sharding Structure**:
- Databases: `db_0, db_1` (by user ID modulo)
- Tables: `order_202501, order_202502, ...` (named by month)

### Technical Implementation

#### 1. Database Preparation

First, create the sharded databases and corresponding table structures:

```sql
-- Create databases
CREATE DATABASE IF NOT EXISTS `db_0`;
CREATE DATABASE IF NOT EXISTS `db_1`;

-- Create monthly sharded tables in each database (example for January and February 2025)
USE `db_0`;
CREATE TABLE `order_202501` (
  `order_id` varchar(32) NOT NULL COMMENT 'Order ID',
  `user_id` int(11) NOT NULL COMMENT 'User ID',
  `amount` decimal(10,2) NOT NULL COMMENT 'Order Amount',
  `status` tinyint(4) NOT NULL COMMENT 'Order Status',
  `create_time` datetime NOT NULL COMMENT 'Create Time',
  `update_time` datetime NOT NULL COMMENT 'Update Time',
  PRIMARY KEY (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='January 2025 Order Table';

CREATE TABLE `order_202502` (
  `order_id` varchar(32) NOT NULL COMMENT 'Order ID',
  `user_id` int(11) NOT NULL COMMENT 'User ID',
  `amount` decimal(10,2) NOT NULL COMMENT 'Order Amount',
  `status` tinyint(4) NOT NULL COMMENT 'Order Status',
  `create_time` datetime NOT NULL COMMENT 'Create Time',
  `update_time` datetime NOT NULL COMMENT 'Update Time',
  PRIMARY KEY (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='February 2025 Order Table';

-- Create same table structure in db_1
USE `db_1`;
CREATE TABLE `order_202501` (
  -- Same structure as db_0
);

CREATE TABLE `order_202502` (
  -- Same structure as db_0
);
```

#### 2. Database Configuration

Configure multiple database connections in `config.yaml`:

```yaml
database:
  default:
    link: "mysql:root:password@tcp(127.0.0.1:3306)/default"
    debug: true
  db_0:
    link: "mysql:root:password@tcp(127.0.0.1:3306)/db_0"
    debug: true
  db_1:
    link: "mysql:root:password@tcp(127.0.0.1:3306)/db_1"
    debug: true
```

#### 3. Custom Sharding Rules

Implement custom sharding rules supporting **database sharding by user ID** and **table sharding by time**:

```go
// ShardingValue represents sharding parameters
type ShardingValue struct {
    UserId     int64       
    CreateTime time.Time
}

// OrderShardingRule defines order sharding rules
type OrderShardingRule struct {
    SchemaCount int64 // Number of database shards
}

// Implement SchemaName method of ShardingRule interface
func (r *OrderShardingRule) SchemaName(
    ctx context.Context, config gdb.ShardingSchemaConfig, value any,
) (string, error) {
    if r.SchemaCount <= 0 {
        return "", gerror.New("schema count should be greater than 0")
    }
    // Get user ID
    sv, ok := value.(ShardingValue)
    if !ok {
        return "", gerror.New("invalid sharding value")
    }
    userId := sv.UserId
    if userId <= 0 {
        return "", gerror.New("invalid user_id for sharding")
    }
    // Determine database by user ID modulo
    schemaIndex := userId % int64(r.SchemaCount)
    return fmt.Sprintf("%s%d", config.Prefix, schemaIndex), nil
}

// Implement TableName method of ShardingRule interface
func (r *OrderShardingRule) TableName(
    ctx context.Context, config gdb.ShardingTableConfig, value any,
) (string, error) {
    // Get order creation time
    sv, ok := value.(ShardingValue)
    if !ok {
        return "", gerror.New("invalid sharding value")
    }
    createTime := sv.CreateTime
    if createTime.IsZero() {
        return "", gerror.New("invalid create_time for sharding")
    }
    // Determine table by month
    tableName := fmt.Sprintf(
        "%s%d%02d", config.Prefix, createTime.Year(), createTime.Month(),
    )
    return tableName, nil
}
```

#### 4. Order Model Definition

```go
// Order model structure
type Order struct {
    OrderId    string    `json:"order_id"    description:"Order ID"`
    UserId     int64     `json:"user_id"     description:"User ID"`
    Amount     float64   `json:"amount"      description:"Order Amount"`
    Status     int       `json:"status"      description:"Order Status"`
    CreateTime time.Time `json:"create_time" description:"Create Time"`
    UpdateTime time.Time `json:"update_time" description:"Update Time"`
}

// OrderService handles order business logic
type OrderService struct{}

// CreateOrder creates a new order
func (s *OrderService) CreateOrder(ctx context.Context, userId int64, amount float64) (string, error) {
    // Generate order ID (can't use auto-increment with sharding)
    orderId := grand.S()
    
    // Create order object
    order := &Order{
        OrderId:    orderId,
        UserId:     userId,
        Amount:     amount,
        Status:     1,
        CreateTime: time.Now(),
        UpdateTime: time.Now(),
    }
    
    // Get sharding value
    sv := ShardingValue{
        UserId:     userId,
        CreateTime: order.CreateTime,
    }
    
    // Insert order with sharding
    _, err := g.DB().Model("order").Data(order).HookSharding(sv).Insert()
    if err != nil {
        return "", err
    }
    
    return orderId, nil
}
```

## Best Practices and Considerations

Based on the above analysis and practical experience, here are the best practices for database sharding:

1. **Early Planning**: Consider sharding strategy during initial system design to avoid high costs of later modifications.
2. **Careful Shard Key Selection**: Choose shard keys that are frequently queried, evenly distributed, and unlikely to change.
3. **Global Unique IDs**: Use solutions like the Snowflake algorithm to generate globally unique IDs instead of auto-increment primary keys.
4. **Data Migration Strategy**: Plan for smooth data migration and implement proper monitoring and rollback mechanisms.
5. **Performance Monitoring**: Implement comprehensive monitoring for sharded databases to identify and address performance issues early.
6. **Consistent Hash**: Consider using consistent hashing for more flexible scaling when adding or removing database nodes.
7. **Transaction Handling**: Be cautious with cross-shard transactions and implement proper compensation mechanisms when needed.
8. **Testing**: Thoroughly test sharding logic, especially edge cases and failure scenarios.

## Conclusion

Database sharding is a powerful solution for handling large-scale data in modern applications. Through this e-commerce system case study, we've demonstrated how to implement database sharding effectively using Go and the GoFrame framework. While sharding adds complexity to the system, proper planning and implementation can significantly improve system scalability and performance.

Remember that sharding is not always the best solution for every scenario. Evaluate your specific business needs, data growth patterns, and maintenance capabilities before implementing a sharding strategy. Start with a simple and maintainable solution, then evolve it as your system grows.
