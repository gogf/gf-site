---
slug: "/articles/sql-migrate-database-migration"
title: "SQL Migrate Database Migration and Version Management: Effective Methods for Managing Database Structure Changes"
hide_title: true
keywords: ["database migration", "version management", "golang-migrate", "SQL audit", "GoFrame", "continuous integration", "multi-environment deployment", "database version control", "team collaboration", "safe changes"]
description: "This article comprehensively analyzes key technologies for database migration and version management, from manual SQL scripts to professional tools like golang-migrate, and provides practical best practices and production environment security audit solutions to help teams achieve controllable, traceable database change management."
---

## 1. Business Scenarios and Necessity of Database Migration and Version Management

In modern software development, database structure changes are common and inevitable. As businesses evolve and requirements change, we often need to modify databases in various ways, such as adding new tables, modifying fields, creating indexes, etc. Without an effective management mechanism, these changes may lead to the following problems:

### 1.1 Common Business Scenarios

#### 1.1.1 Multi-environment Deployment Consistency

Ensuring database structure consistency across development, testing, pre-production, and production environments is a huge challenge. Without version management, inconsistencies can easily occur between environments, causing applications to malfunction in certain environments.

```
Development environment → Testing environment → Pre-production environment → Production environment
```

#### 1.1.2 Team Collaboration Conflicts

In multi-developer projects, different developers may modify the database simultaneously. Without unified change management, conflicts or overwriting of others' modifications can easily occur.

#### 1.1.3 Version Rollback Requirements

When a new version has serious issues and needs to be rolled back, the absence of a corresponding database rollback mechanism may cause mismatches between database structure and application code, leading to more problems.

#### 1.1.4 Database Evolution in Microservice Architecture

In microservice architecture, different services may have independent databases or share certain databases. Managing database changes and dependencies among these services becomes more complex.

### 1.2 Necessity of Database Migration Management

- **Traceability**: Record the history of all database changes, knowing when, by whom, and why specific changes were made
- **Repeatability**: Ensure the same changes can be executed in the same way across different environments
- **Reliability**: Reduce human errors, especially in complex production environments
- **Collaboration Efficiency**: Improve team collaboration efficiency, reduce conflicts and communication costs
- **CI/CD Support**: Support automated CI/CD processes, enabling automated deployment of database changes

Having understood the importance and business scenarios of database migration and version management, we will now explore several common implementation methods, from the most basic manual execution to professional migration tools. Each method has its applicable scenarios, advantages, and disadvantages.

## 2. Common Methods for Database Migration and Version Management

### 2.1 Manual Execution of SQL Scripts

The most primitive way is to manually write SQL scripts and execute them in various environments.

```sql
-- Example of manually executed SQL script
ALTER TABLE users ADD COLUMN last_login_time DATETIME COMMENT 'Last login time';
CREATE INDEX idx_user_login ON users(last_login_time);
```

#### 2.1.1 Advantages

- **Simple and Direct**: No additional tools or frameworks needed, can be executed directly using a database client
- **High Flexibility**: Can execute any complex SQL statements without tool limitations
- **No Learning Cost**: Team members don't need to learn new tools
- **Suitable for Small Projects**: For small-scale projects with few changes, this method is simple and effective enough

#### 2.1.2 Disadvantages

- **Lack of Version Control**: Unable to track which scripts have been executed and which haven't
- **Difficult to Manage Execution Order**: Relies on manual maintenance of execution order, prone to errors
- **Prone to Human Error**: Manual execution can easily lead to omission or repeated execution of certain scripts
- **Difficult to Track Change History**: Unable to know when, by whom, and which changes were executed
- **Difficult to Rollback**: No automated rollback mechanism, requiring manual writing and execution of rollback scripts
- **Poor Multi-environment Consistency**: Different environments may execute different scripts or in different orders, leading to inconsistencies

### 2.2 Version-based SQL Script Management

This method names SQL scripts by version number and executes them in order, usually accompanied by a version record table to track executed scripts.

```
/migrations
  ├── V1.0.0__create_users_table.sql
  ├── V1.0.1__add_email_column.sql
  ├── V1.1.0__create_orders_table.sql
  └── V1.1.1__add_order_status.sql
```

Example of version record table:

```sql
CREATE TABLE `schema_version` (
    `version` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `installed_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `success` BOOLEAN NOT NULL,
    PRIMARY KEY (`version`)
);
```

#### 2.2.1 Advantages

- **Version Control**: Through version numbers and version record tables, you can clearly know which version the current database is at
- **Clear Execution Order**: Scripts are executed in version number order, avoiding order errors
- **Avoid Repeated Execution**: Version record tables can prevent the same script from being executed multiple times
- **Traceability**: Can record the execution time and status of each change
- **Still Keeps It Simple**: Improved compared to completely manual methods, but implementation is still relatively simple

#### 2.2.2 Disadvantages

- **Still Requires Manual Management**: Need to manually maintain version numbers and execute scripts
- **Limited Rollback Support**: Usually requires additional writing of rollback scripts, and the rollback process may not be automated enough
- **Lack of Automated Tool Support**: Need to develop scripts to execute and manage migrations
- **Limited Support for Complex Changes**: For complex changes requiring data migration, additional processing logic may be needed

### 2.3 ORM Framework Built-in Migration Features

Many modern `ORM` frameworks provide built-in migration features, such as `Django`'s `Migrations`, `Laravel`'s `Migrations`, etc. These tools typically support:

- Automatic generation of migration scripts
- Detection of model changes
- Applying/rolling back migrations
- Migration status queries

#### 2.3.1 Advantages

- **Seamless Integration with Framework**: As part of the framework, consistent user experience, low learning cost
- **Automatic Generation of Migration Scripts**: Automatically generate migration scripts based on model changes, reducing manual SQL writing workload
- **Bidirectional Migration**: Support for upgrade and rollback operations
- **Dependency Management**: Able to handle dependencies between migration scripts
- **Data Migration Support**: In addition to structural changes, also supports data migration operations
- **Good Development Experience**: Closely integrated with the development process, improving development efficiency

#### 2.3.2 Disadvantages

- **Framework Binding**: Bound to a specific framework, not easy to use across frameworks
- **Auto-generated SQL May Not Be Optimized**: Automatically generated SQL may not be as efficient as handwritten SQL
- **Learning Specific Syntax**: Need to learn framework-specific migration syntax and commands
- **Limited Support for Complex Scenarios**: Some complex database operations may not be possible through the framework's migration features
- **Black Box Operation**: Developers may not be clear about the actual SQL statements executed underneath


#### 2.3.3 Considerations

Migration features built into ORM frameworks may not consider data safety in automatically generated migration scripts, potentially leading to data loss in sensitive `DDL` operations such as field modifications and table restructuring. When used in production environments, there are several situations that could potentially cause data loss, mainly including:

##### 2.3.3.1 Data Truncation Due to Field Type Modification

When modifying a field type from a larger type to a smaller type, data truncation may occur.

```sql
-- For example, changing VARCHAR(255) to VARCHAR(50)
-- The automatically generated migration might directly execute:
ALTER TABLE `users` MODIFY COLUMN `description` VARCHAR(50);
-- This will cause data exceeding 50 characters to be truncated
```

##### 2.3.3.2 Data Loss Due to Table Restructuring

When model changes are significant, some ORM framework migration features might choose to delete the old table and create a new one, rather than performing `ALTER TABLE` operations.

```sql
-- The automatically generated migration might execute:
DROP TABLE `users`;
CREATE TABLE `users` (...);
-- This will cause all data in the original table to be lost
```

##### 2.3.3.3 Data Loss Due to Field Deletion

When a field is removed from the model, automatically generated migration scripts typically directly delete that field without considering data backup first.

```sql
-- When removing the email field from the model, the automatically generated migration might be:
ALTER TABLE `users` DROP COLUMN `email`;
-- This will cause all users' email information to be permanently lost
```

##### 2.3.3.4 Data Conflicts Due to Adding Unique Constraints

When adding a unique constraint to existing data, if duplicate values exist in the data, the migration will fail or cause data loss.

```sql
-- Adding a unique index to an existing table:
ALTER TABLE `users` ADD UNIQUE INDEX `idx_email` (`email`);
-- If duplicate emails exist in the table, this operation will fail
```

##### 2.3.3.5 Improper Handling of Foreign Key Relationships

When deleting or modifying tables or fields with foreign key relationships, if foreign key relationships are not properly handled, it may cause data consistency issues.

```sql
-- Deleting a referenced main table:
DROP TABLE `categories`;
-- If there is a product table referencing the category table, it may cause foreign key constraint errors or data inconsistencies
```

##### 2.3.3.6 Irreversibility of Rollback Operations

Some data changes are irreversible, even with rollback scripts, original data cannot be recovered.

```sql
-- If a data truncation operation is performed:
ALTER TABLE `users` MODIFY COLUMN `description` VARCHAR(50);

-- The rollback script might be:
ALTER TABLE `users` MODIFY COLUMN `description` VARCHAR(255);
-- But the truncated data has already been lost and cannot be recovered through rollback
```


#### 2.3.4 Applicable Scenarios

This method is mainly suitable for the following scenarios:

- **Non-rigorous Personal Projects**: Projects where data is not sensitive and deviations are acceptable
- **Small Team Projects**: Teams where all members use the same framework and data volume is small
- **Prototype Development Stage**: In the early stages of a project requiring rapid iteration
- **Internal Tools or Test Environments**: Environments where data can tolerate loss or rebuilding

> Note: For enterprise-level production environments, critical business systems, or data-sensitive projects, the automatic migration features of ORM frameworks should be used with caution. In these scenarios, it is recommended to use professional database migration tools or handwritten migration scripts, with manual review.



### 2.4 Professional Database Migration Tools

Specialized database migration tools provide more powerful features:

- **Flyway**: Popular database migration tool in the `Java` ecosystem
- **Liquibase**: Open-source database change management tool supporting multiple databases
- **Alembic**: Database migration tool for `Python SQLAlchemy`
- **golang-migrate**: Database migration tool for `Go` language

#### 2.4.1 Advantages

- **Independent of Application Framework**: Can be used with applications in any language or framework
- **Multi-database Support**: Usually supports multiple database systems
- **Powerful Version Control**: Provides comprehensive version management and migration history recording
- **Command Line and API Support**: Can be used both via command line and API integration into applications
- **CI/CD Friendly**: Easy to integrate into continuous integration and continuous deployment processes
- **Community Support**: Mature tools usually have active communities and rich documentation
- **Enterprise-level Features**: Some tools provide advanced features such as baseline versions, conditional migrations, multi-environment configurations, etc.

#### 2.4.2 Disadvantages

- **Additional Dependencies**: Introduces new tool dependencies
- **Learning Cost**: Need to learn how to use specific tools and best practices
- **Additional Work for Application Integration**: Need to write code to integrate tools with applications
- **Potential Performance Overhead**: Some tools may bring additional performance overhead when executing migrations
- **Configuration Complexity**: Advanced features may require complex configuration

After understanding the advantages and disadvantages of various database migration methods, we can choose the most suitable solution based on the actual needs of the project. For most modern application development, especially projects requiring team collaboration and multi-environment deployment, we recommend the following database migration and version management methods.

## 3. Recommended Database Migration and Version Management Methods
Based on practical project experience, the following are recommended database migration and version management methods.

### 3.1 SQL Migration Version Management Tools

#### 3.1.1 Common SQL Version Management Tools

It is recommended that database migration tools be as independent as possible from development languages and frameworks, so that the same migration solution can be used in different projects. The following are several common SQL migration version management tools that are independent of development languages.

##### 3.1.1.1 Flyway

[Flyway](https://flywaydb.org/) is an open-source database migration tool with the following features:

- **Multi-platform Support**: Provides command-line tools, `Java API`, `Maven` plugins, `Gradle` plugins, and other usage methods
- **Multi-database Support**: `Oracle`, `SQL Server`, `DB2`, `MySQL`, `PostgreSQL`, and many other databases
- **Versioned Management**: Uses version numbers to manage each migration script
- **Security**: Prevents applied migration scripts from being modified
- **Commercial and Community Versions**: Provides free community version and more comprehensive commercial version

Naming convention example:

```
V1__Create_person_table.sql
V2__Add_people.sql
V3__Add_nickname_column.sql
```

##### 3.1.1.2 Liquibase

[Liquibase](https://www.liquibase.org/) is an open-source database schema change management tool with the following features:

- **Multi-format Support**: Can write change scripts using XML, YAML, JSON, or SQL
- **Multi-database Support**: Supports more than 20 different databases
- **Changesets**: Manages changes using "Changesets"
- **Context Awareness**: Can execute different changes based on different environments
- **Rollback Support**: Supports automatic generation of rollback scripts

Liquibase changeset example (XML format):

```xml
<changeSet id="1" author="bob">
    <createTable tableName="department">
        <column name="id" type="int">
            <constraints primaryKey="true" nullable="false"/>
        </column>
        <column name="name" type="varchar(50)">
            <constraints nullable="false"/>
        </column>
    </createTable>
</changeSet>
```

##### 3.1.1.3 Alembic

[Alembic](https://alembic.sqlalchemy.org/) is a lightweight database migration tool. Although it is designed for Python's SQLAlchemy ORM, its migration scripts are pure SQL files that can be used in any project:

- **Versioned Migration**: Supports forward and backward database migrations
- **Automatic Generation of Migration Scripts**: Can automatically generate migration scripts based on model changes
- **Branch Support**: Supports branch and merge migrations
- **Multi-database Support**: Supports all databases supported by SQLAlchemy

##### 3.1.1.4 golang-migrate

[golang-migrate](https://github.com/golang-migrate/migrate) is a powerful database migration tool. Its biggest feature is that it is independent of any development language or framework and can be used in any project, whether developed in `Go`, `Java`, `Python`, `PHP`, or other languages.

It supports multiple database systems, including:
- `MySQL`
- `PostgreSQL`
- `SQLite`
- `MongoDB`
- `Microsoft SQL Server`
- `CockroachDB`
- `Clickhouse`
- And many other databases



#### 3.1.2 golang-migrate Solution

Among the tools introduced above, `golang-migrate` stands out due to its language independence, simplicity, and powerful features. It not only supports multiple database systems but also provides both command-line and programmatic API usage methods, making it very suitable for the needs of modern development teams.

Below we will detail a complete migration version management solution using the `golang-migrate` tool, covering every aspect from installation and configuration to actual use.

#### 3.1.3 Installing golang-migrate

`golang-migrate` provides multiple installation methods, you can choose the one that best suits your environment:

```bash
# MacOS installation using Homebrew
brew install golang-migrate

# Linux installation using curl
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/

# Windows can download executable files from the official GitHub repository
# Or install using scoop
scoop install migrate

# If you use Go language, you can also install via go install
go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```


#### 3.1.4 Directory Design and Naming Conventions

> Even if not relying on the `golang-migrate` tool to manage SQL migration scripts, the following directory design and naming conventions are equally suitable for manually managing SQL migration scripts.

##### 3.1.4.1 Directory Structure Design

When using `golang-migrate` for database migration, the following directory structure is recommended:

```
/project root
  └── manifest
      └── sql                # SQL version management directory
          ├── mysql          # MySQL migration scripts
          │   ├── [version prefix]_[description].up.sql
          │   ├── [version prefix]_[description].down.sql
          │   ├── ...
          │   └── ...
          └── postgres       # PostgreSQL migration scripts (if needed)
```

This directory structure has the following advantages:

- **Centralized Management**: All SQL version management files are centralized in the `manifest/sql` directory, making them easy to manage and find
- **Multi-database Support**: Organized by database type, supporting the use of multiple databases in the same project
- **Clear Version History**: The evolution history of the database structure can be visually seen through file names

##### 3.1.4.2 Meaning of up and down in Migration Scripts

Each migration version contains two files:

- **up file** (e.g., `v0.1.0_create_users_table.up.sql`): Contains upgrade operations, i.e., changes that need to be executed when applying a new version, such as creating tables, adding fields, creating indexes, etc.

- **down file** (e.g., `v0.1.0_create_users_table.down.sql`): Contains rollback operations, i.e., operations to be performed when rolling back to a previous version, such as deleting tables, deleting fields, deleting indexes, etc. The `down` file should be the inverse operation of the `up` file, ensuring that changes can be fully rolled back.



For example, for a migration that creates a user table:

`v0.1.0_create_users_table.up.sql` (upgrade script):
```sql
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL COMMENT 'Username',
    `email` VARCHAR(100) NOT NULL COMMENT 'Email',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX idx_username (`username`),
    UNIQUE INDEX idx_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Users table';
```

`v0.1.0_create_users_table.down.sql` (rollback script):
```sql
DROP TABLE IF EXISTS `users`;
```

In `golang-migrate`, you can create only an `up` file without creating a `down` file, but this will have the following impacts:
 
1. **Unable to Roll Back That Version**: When executing the `migrate down` command, if there is no corresponding `down` file, the tool will not be able to perform the rollback operation and will return an error.
 
2. **Version Control Limitations**: If you need to roll back to an earlier version, you must skip versions without `down` files, possibly requiring the use of the `force` command to forcibly set the version number.
 
3. **Difficult to Handle Emergency Situations**: In a production environment, if you need to urgently roll back a problematic change, the absence of a `down` file will greatly increase the difficulty of handling.
 
4. **Incomplete Documentation**: The `down` file is also a form of documentation, recording how to undo changes. Without it, the documentation for database changes will be incomplete.
 
Therefore, even if in some cases you think rollback is not needed, it is strongly recommended to always create corresponding `down` files to ensure the completeness and flexibility of version control. In some cases, you may need to add special processing logic to the `down` file, such as backing up data before deleting a table.

##### 3.1.4.3 Migration Script Naming Conventions

`golang-migrate` supports multiple script file naming conventions, with two commonly used naming methods:

###### 3.1.4.3.1 Numeric Sequence Naming Method

```
000001_create_users_table.up.sql
000001_create_users_table.down.sql
000002_add_user_fields.up.sql
000002_add_user_fields.down.sql
```

This method uses numeric sequences as prefixes, such as `000001`, `000002`, etc. Its advantages are:
- Simple and intuitive, executed in numerical order
- Easy to generate automatically, using the `migrate create -seq` command to automatically generate incremental sequence numbers
- Suitable for frequently released projects, sequence numbers won't be quickly exhausted

###### 3.1.4.3.2 Semantic Versioning Naming Method

```
v0.1.0_create_users_table.up.sql
v0.1.0_create_users_table.down.sql
v0.2.0_add_user_fields.up.sql
v0.2.0_add_user_fields.down.sql
```

This method uses semantic version numbers as prefixes, such as `v0.1.0`, `v0.2.0`, etc. Its advantages are:
- Easier to understand the purpose of files and their relationship with application versions
- Can visually reflect major version changes, such as changes from `v1.0.0` to `v2.0.0`
- Suitable for projects bound to application versions, such as projects where each application version release has corresponding database changes

#### 3.1.5 Creating Migration Scripts

##### 3.1.5.1 Automatically Creating Migration Files
```bash
# Create new migration scripts
migrate create -ext sql -dir migrations/mysql -seq add_login_history_table
```

This will create two files:
- `migrations/mysql/000003_add_login_history_table.up.sql` (upgrade script)
- `migrations/mysql/000003_add_login_history_table.down.sql` (rollback script)

Then manually add the SQL upgrade and rollback script content to the corresponding files.

##### 3.1.5.2 Manually Creating Migration Files

Although `golang-migrate` provides convenient command-line tools to create migration files, you can also create migration files manually. The steps for manual creation are as follows:

1. Determine the version number and naming convention (such as `v0.1.0` or `000001`)
2. Create corresponding `up` and `down` files, named according to the convention
3. Write the upgrade and rollback SQL scripts


> Note: Regardless of which naming method you choose, it's important to maintain consistency within the project. The `golang-migrate` tool will determine the execution order based on the dictionary order of the file name prefixes, so the naming convention must ensure the correct execution order.



#### 3.1.6 Writing Migration Scripts

Upgrade script (`000003_add_login_history_table.up.sql`):

```sql
CREATE TABLE login_history (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'User ID',
    login_time DATETIME NOT NULL COMMENT 'Login time',
    ip VARCHAR(50) NOT NULL COMMENT 'Login IP',
    device VARCHAR(200) COMMENT 'Login device',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User login history';
```

Rollback script (`000003_add_login_history_table.down.sql`):

```sql
DROP TABLE IF EXISTS login_history;
```


#### 3.1.7 Command Line Usage

`golang-migrate` provides a simple and easy-to-use command-line tool that can be used in any project, independent of specific programming languages or frameworks:

```bash
# Create new migration scripts
migrate create -ext sql -dir migrations/mysql -seq create_users_table

# Execute upgrade migration
migrate -path migrations/mysql -database "mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true" up

# Roll back the most recent migration
migrate -path migrations/mysql -database "mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true" down 1

# Roll back to a specific version
migrate -path migrations/mysql -database "mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true" goto 20230101120000

# Force set version (used after migration errors)
migrate -path migrations/mysql -database "mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true" force 20230101120000

# View current version
migrate -path migrations/mysql -database "mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true" version
```

> For more usage methods, please refer to the `golang-migrate` project official website.

This command-line usage can be integrated into any project's build or deployment scripts, such as `Makefile`, `shell` scripts, `CI/CD` processes, etc.

#### 3.1.8 Programmatic Usage in Go Projects

For `Go` language projects, `golang-migrate` also provides a library that can be directly imported and used in code, making it possible to automatically execute migrations when the application starts:

```go
package main

import (
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	// Import required database drivers
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	// Import migration file source
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	// Create migrate instance
	m, err := migrate.New(
		"file://./migrations/mysql",
		"mysql://user:password@tcp(localhost:3306)/dbname?multiStatements=true",
	)
	if err != nil {
		log.Fatalf("Failed to create migrate instance: %v", err)
	}

	// Execute all upgrade migrations
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	// Get current version
	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		log.Fatalf("Failed to get version: %v", err)
	}

	fmt.Printf("Current database version: %d, Is in dirty state: %t\n", version, dirty)

	// Other application initialization code...
}
```

This method has the advantage of binding migrations to the application's lifecycle, ensuring that the database structure is always up-to-date when the application starts. However, this method is only applicable to `Go` projects; for projects in other languages, the command-line method is still needed.

> Note: Regardless of which method is used, `golang-migrate` maintains its language and framework independence. Even when used in `Go` projects via the `import` method, its migration files and version management mechanism remain universal and can be used by projects in other languages or command-line tools.



### 3.2 SQL Statement Execution Audit Tools

In production environment database change management, code developers usually do not have permission to directly execute SQL statements in the production environment. At this point, SQL submission, review, and execution tools are needed to standardize the release process. These tools can be used in conjunction with SQL migration tools to form a complete database change management process.

#### 3.2.1 Necessity of SQL Audit Tools

1. **Security**: Prevent risky SQL statements from being directly executed in the production environment
2. **Standardization**: Enforce team SQL writing standards to ensure code quality
3. **Auditability**: Record the reviewer, executor, and execution time of all SQL changes
4. **Separation of Duties**: Implement separation of responsibilities between developers, reviewers, and executors
5. **Performance Optimization**: Discover and optimize inefficient SQL statements before execution

#### 3.2.2 Common SQL Audit Tools

##### 3.2.2.1 Archery

![alt text](/markdown/SQLMigrate/image-2.png)

[Archery](https://github.com/hhyo/Archery) is an open-source SQL audit and SQL management tool maintained by domestic developers with the following features:

- Support for multiple databases: MySQL, Oracle, SQLServer, PostgreSQL, MongoDB, Redis, etc.
- Comprehensive SQL audit functionality: Support for using Inception, SOAR, SQLAdvisor, and other audit engines
- Work order process: Implement a complete submission-review-execution process
- Permission management: Fine-grained permission control system
- Database monitoring: Integrated monitoring of database instances, slow queries, etc.



##### 3.2.2.2 Bytebase

![alt text](/markdown/SQLMigrate/image.png)

[Bytebase](https://github.com/bytebase/bytebase) is a modern database DevOps and change management tool with features including:

- Intuitive Web UI: Provides a GitHub-like interface experience
- GitOps integration: Can integrate with Git repositories to implement version control of database changes
- SQL audit: Built-in multiple SQL audit rules
- Environment management: Support for management of multiple environments such as development, testing, production, etc.
- Visual database schema management

##### 3.2.2.3 Yearning

![alt text](/markdown/SQLMigrate/image-1.png)

[Yearning](https://github.com/cookieY/Yearning) is a domestic MySQL audit platform with the following features:

- Lightweight: Simple deployment, low resource consumption
- Comprehensive audit process: Support for multi-person review, review comments, etc.
- Built-in audit rules: Contains common SQL audit rules
- Permission management: Fine-grained permission control
- Support for scheduled tasks and batch execution

#### 3.2.3 Integration with SQL Migration Tools

Combining SQL audit tools with SQL migration tools can implement a complete database change management process:

1. **Development Phase**: Developers use SQL migration tools (such as `golang-migrate`) to write change scripts

2. **Code Review**: Ensure the quality of migration scripts through code review

3. **Submit for Review**: Submit migration scripts to the SQL audit platform (such as `Archery`, `Bytebase`)

4. **Automatic Audit**: SQL audit platform automatically checks if SQL statements comply with standards

5. **Manual Review**: DBA or senior developers review the changes

6. **Execute Changes**: After review approval, authorized personnel execute the changes

7. **Record and Track**: All change operations are recorded and can be tracked

This integration method combines the version control capabilities of SQL migration tools with the security guarantee capabilities of SQL audit tools, particularly suitable for strict enterprise-level production environments.

Regardless of which migration tool is chosen, a series of best practices need to be followed to ensure the safety, reliability, and maintainability of database changes. Below are our summarized best practice recommendations for database migration and version management.

## 4. Best Practice Recommendations

### 4.1 Migration Script Naming Conventions

- Use sequence number prefixes to ensure execution order
- Use descriptive names to explain the content of changes
- Distinguish between `up` (upgrade) and `down` (rollback) scripts
- Standardize naming conventions within the team to ensure consistency

### 4.2 Migration Content Standards

- Each migration should be atomic, focusing on one change
- Ensure each migration has a corresponding rollback script
- Avoid including large amounts of data operations in migrations; data migration should be separate from structural changes
- For structural changes to large tables, consider using online DDL tools
- Add comments in migration scripts explaining the purpose and impact of changes
- Avoid using database-specific features to ensure portability

### 4.3 Environment Management

- Development environments can be frequently reset and re-migrated
- Test environments should simulate the migration process of production environments
- Database backups must be made before production environment migrations
- Consider using blue-green deployment or canary release strategies for production environment migrations
- Establish environment-specific migration configurations, such as development, testing, pre-production, and production environments
- Before executing migrations in the production environment, conduct complete testing in the pre-production environment

## 5. Conclusion

Database migration and version management are indispensable parts of modern software development. By adopting appropriate migration strategies and tools, team collaboration efficiency can be significantly improved, problems caused by environmental differences can be reduced, and continuous integration and continuous deployment processes can be supported.

This article introduced multiple database migration management methods, from manual SQL script management to professional migration tools, and particularly recommended the `golang-migrate` tool as a language-independent universal solution. At the same time, we also introduced the importance of SQL audit tools in production environments and how to combine them with migration tools.

For projects using the `Go` language, it is recommended to use the `golang-migrate` tool for database migration management, which provides powerful version control features, supports upgrade and rollback operations, and can be seamlessly integrated into existing projects. Its command-line tools and programmatic API allow it to flexibly adapt to different project requirements and development processes.

Regardless of which migration tool is chosen, the key is to establish a standardized process and best practices to ensure that database changes are traceable, repeatable, and reliable, thereby supporting rapid iteration and development of the business. As the project scale grows and complexity increases, a sound database migration strategy will become a key factor in maintaining system stability and maintainability.
