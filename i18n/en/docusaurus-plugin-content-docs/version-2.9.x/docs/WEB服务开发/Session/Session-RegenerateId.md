---
slug: '/docs/web/session-regenerate-id'
title: 'Session - RegenerateId'
sidebar_position: 6000
hide_title: true
keywords: ['GoFrame', 'GoFrame Framework', 'Session Management', 'gsession', 'RegenerateId', 'Session Fixation', 'Session Security', 'User Authentication', 'Security Best Practices']
description: 'Session ID regeneration functionality in the GoFrame framework, preventing session fixation attacks through RegenerateId and MustRegenerateId methods to enhance web application security. Detailed explanation of session fixation attack principles, risks, and prevention methods, with complete code examples and security recommendations.'
---

## Introduction to Session Fixation Attacks

Session fixation attacks are a common web application security vulnerability where attackers control a user's session by setting the user's session identifier (Session ID). The basic process of this attack is as follows:

1. The attacker obtains a valid `Session ID` (by visiting the target website or through other means)
2. The attacker induces the victim to use this `Session ID` to access the target website (e.g., through specially crafted URLs, XSS attacks, etc.)
3. The victim logs into the website using this preset `Session ID`
4. After successful login, the `Session ID` is associated with the victim's account
5. The attacker uses the same `Session ID` to access the website, thereby gaining the victim's identity and permissions

The danger of this attack is that attackers can obtain a user's identity without cracking the user's password, allowing them to access sensitive information or perform unauthorized operations.

## Preventing Session Fixation Attacks

The best practice for preventing session fixation attacks is to regenerate the `Session ID` after a user successfully authenticates (logs in). This way, even if an attacker manages to make a user use a specific `Session ID`, that ID will be replaced after successful login, rendering the attack ineffective.

The `GoFrame` framework provides `RegenerateId` and `MustRegenerateId` methods to implement this security mechanism.

## `RegenerateId` Method

In applications with higher security requirements, to prevent **session fixation attacks**, it's usually necessary to regenerate the `Session ID` after a user successfully logs in. The `GoFrame` framework provides `RegenerateId` and `MustRegenerateId` methods to implement this functionality.

### Implementation Principle

The implementation principle of the `RegenerateId` method is as follows:

1. Generate a new `Session ID`
2. Copy the current session data to the new `Session ID`
3. Decide whether to delete the old session data based on the `deleteOld` parameter
4. Update the current session's ID to the newly generated ID

This achieves seamless migration of session data while ensuring security.

### `RegenerateId` Method

- Description: The `RegenerateId` method is used to regenerate a new `Session ID` for the current session while preserving all data in the session. This is especially useful after a user successfully logs in, as it can prevent session fixation attacks.
- Format:

    ```go
    RegenerateId(deleteOld bool) (newId string, err error)
    ```

- Parameter Description:
  - `deleteOld`: Specifies whether to immediately delete the old session data
    - If `true`: The old session data will be deleted immediately
    - If `false`: The old session data will be preserved and will expire automatically according to its TTL

- Return Values:
  - `newId`: The newly generated `Session ID`
  - `err`: Possible errors that may occur during the operation

### `MustRegenerateId` Method

- Description: The `MustRegenerateId` method has the same functionality as `RegenerateId`, but if an error occurs during the operation, it will directly `panic`. This is very useful in scenarios where the `Session ID` must be regenerated.
- Format:

    ```go
    MustRegenerateId(deleteOld bool) string
    ```

- Parameter Description:
  - `deleteOld`: Same meaning as the parameter in the `RegenerateId` method

- Return Value:
  - The newly generated `Session ID`

### Usage Example

```go
package main

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gtime"
)

func main() {
	s := g.Server()

	// Mock login interface
	s.BindHandler("/login", func(r *ghttp.Request) {
		username := r.Get("username").String()
		// password := r.Get("password").String()

		// Assume username and password verification is done here
		// password ...

		// After verification, store user information in the Session
		r.Session.MustSet("user", g.Map{
			"username":   username,
			"login_time": gtime.Now(),
		})

		// Important: Regenerate Session ID after successful login to prevent session fixation attacks
		// Parameter true means to immediately delete the old session data
		// The returned session id can be unused, the server will automatically return the latest session id through the header
		_, err := r.Session.RegenerateId(true)
		if err != nil {
			r.Response.WriteJson(g.Map{
				"code":    500,
				"message": "Failed to regenerate Session ID",
			})
			return
		}

		r.Response.WriteJson(g.Map{
			"code":    0,
			"message": "Login successful",
		})
	})

	// Get user information interface
	// Note that you need to submit the session id through the header
	s.BindHandler("/user/info", func(r *ghttp.Request) {
		user := r.Session.MustGet("user")
		if user == nil {
			r.Response.WriteJson(g.Map{
				"code":    403,
				"message": "Not logged in or session expired",
			})
			return
		}
		r.Response.WriteJson(g.Map{
			"code":    0,
			"message": "Retrieved successfully",
			"data":    user,
		})
	})

	// Logout interface
	s.BindHandler("/logout", func(r *ghttp.Request) {
		// Clear all session data
		_ = r.Session.RemoveAll()
		r.Response.WriteJson(g.Map{
			"code":    0,
			"message": "Logout successful",
		})
	})

	s.SetPort(8000)
	s.Run()
}
```

### Security Recommendations

1. **Regenerate Session ID After Login**: Always call the `RegenerateId` method to regenerate the `Session ID` after a user successfully logs in. This is a basic practice to prevent session fixation attacks.

2. **Regenerate Session ID After Sensitive Operations**: Consider regenerating the `Session ID` after users perform sensitive operations such as password changes or permission changes.

3. **Delete Old Session Data**: When regenerating the `Session ID`, it is usually recommended to set the `deleteOld` parameter to `true` to immediately delete the old session data, preventing malicious use of session data.

4. **Use HTTPS**: Always use the `HTTPS` protocol to transmit the `Session ID` to prevent session information from being captured by network security tools or man-in-the-middle attacks.

5. **Set Correct Cookie Attributes**: For cookies that store the `Session ID`, set the `HttpOnly`, `Secure`, and `SameSite` attributes to prevent `XSS` attacks and `CSRF` attacks.
