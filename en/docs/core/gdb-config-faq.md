# ORM Configuration - FAQ

## How to Implement Database Account Password Encryption in Configuration Files

In certain scenarios, database account passwords cannot be configured in plaintext within configuration files and must be encrypted. During the database connection, the encrypted fields in the configuration file need to be decrypted. This requirement can be achieved by customizing a `Driver` (for detailed information about `Driver`, please refer to the chapter: [ORM - Interface](https://goframe.org/en/docs/core/gdb-interface.md)). Taking `mysql` as an example, we can write our own `Driver`, wrap the `mysql driver` from the framework community components, and override its `Open` method. Code example:

https://goframe.org/en/examples/database/encoded-pass

> Page: https://goframe.org/en/docs/core/gdb-config-faq
