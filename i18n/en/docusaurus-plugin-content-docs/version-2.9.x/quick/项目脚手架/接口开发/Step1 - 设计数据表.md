---
slug: '/quick/scaffold-api-sql'
title: 'Step1 - Design Data Structure'
hide_title: true
sidebar_position: 0
keywords: [GoFrame, Data Table Design, MySQL Database, Docker, SQL Statements, InnoDB, Auto Increment, varchar, Database Connection, User Status]
description: "Design and apply MySQL data tables. We define the structure of data tables for user information and practice operations by running MySQL with Docker, including creating table structures and applying SQL statements, helping you quickly master database operation skills."
---


## Design Data Structure SQL

First, we define a data table. The following is the `SQL` file of the data table to be used in this chapter's example:

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `name` varchar(45) DEFAULT NULL COMMENT 'user name',
  `status` tinyint DEFAULT NULL COMMENT 'user status',
  `age` tinyint unsigned DEFAULT NULL COMMENT 'user age',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Apply Data Structure SQL

We need to apply this data table to the `mysql` database for subsequent use. If you don't have a `mysql` database service locally, you can use `docker` to run one:

```bash
docker run -d --name mysql \
 -p 3306:3306 \
 -e MYSQL_DATABASE=test \
 -e MYSQL_ROOT_PASSWORD=12345678 \
 loads/mysql:5.7
```

After starting, connect to the database and apply the table creation `sql` statements:
```text
$ mysql -h127.0.0.1 -p3306 -uroot -p
mysql: [Warning] Using a password on the command line API can be insecure.
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 57
Server version: 9.0.1 Homebrew

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use test;
Database changed
mysql> CREATE TABLE `user` (
    ->   `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'user id',
    ->   `name` varchar(45) DEFAULT NULL COMMENT 'user name',
    ->   `status` tinyint DEFAULT NULL COMMENT 'user status',
    ->   `age` tinyint unsigned DEFAULT NULL COMMENT 'user age',
    ->   PRIMARY KEY (`id`)
    -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
Query OK, 0 rows affected, 2 warnings (0.02 sec)

mysql> 
```



## Learning Summary

It is a good development practice to design database tables before API development. Here we are using the `mysql` database, which requires setting up/running the database service first.

After designing the database table, we can use a scaffold tool to automatically generate corresponding database operation-related files in the next step.