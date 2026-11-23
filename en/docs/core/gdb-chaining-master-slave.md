# ORM Model - Master/Slave

From the previous introduction, we know that `gdb` supports master-slave configuration and read-write separation at the application layer, and all features can be achieved through simple configuration. `gdb` will automatically switch between master and slave for SQL requests. The following is a simple master-slave configuration with one master and one slave:

```yaml
database:
  default:
  - type: "mysql"
    link: "root:12345678@tcp(192.168.1.1:3306)/test"
    role: "master"
  - type: "mysql"
    link: "root:12345678@tcp(192.168.1.2:3306)/test"
    role: "slave"
```

In most scenarios, our write requests are directed to the `Master` node, while read requests are directed to the `Slave` nodes. This approach helps distribute the load on the database and improves its availability. However, in some cases, we want read operations to be executed on the `Master` node, especially in scenarios with high immediacy requirements (as there is some latency in data synchronization between master and slave nodes).

Developers can customize which node a chaining operation is executed on using the `Master` and `Slave` methods.

Let's look at a simple example. We have an order system with high daily traffic, often causing a `1-500ms` delay in database master-slave synchronization. The business requirement is to display the order list page immediately after creating an order. If the order list page reads data from the slave node by default, users may not see the newly created order due to the database master-slave synchronization delay. To solve this issue, we can configure the order list page to read data from the master node.

1. When creating an order, there is no need to specify the node for the operation because write operations are executed on the master node by default. To simplify the example, we only show the key code here:

   ```go
   g.Model("order").Data(g.Map{
       "uid"   : 1000,
       "price" : 99.99,
       // ...
   }).Insert()
   ```

2. When querying on the order list page, we need to use the `Master` method to specify that the query operation should be conducted on the master node to avoid read delays.

   ```go
   g.Model("order").Master().Where("uid", 1000).All()
   ```

> Page: https://goframe.org/en/docs/core/gdb-chaining-master-slave
