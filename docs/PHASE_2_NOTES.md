# Phase 2 — Authentication & Authorization

## 1. What We Learned

In Phase 2, we implemented the main authentication and authorization features of our backend application.

We learned the difference between **authentication** and **authorization**. Authentication checks who the user is, while authorization checks what that user is allowed to do.

We implemented:

- Password hashing using **bcrypt**
- JWT-based authentication
- Access tokens and refresh tokens
- Refresh token rotation and revocation
- Protected routes using `protect` middleware
- Role-based access control using `authorize` middleware
- Request validation using `express-validator`
- Password reset using secure hashed tokens
- Email verification using secure hashed tokens
- Token expiry
- Protection against user enumeration
- Proper use of `401` and `403` status codes

---

# 2. Important Concepts

## Authentication vs Authorization

**Authentication** means verifying the identity of a user.

Example:

> "Is this really Ahmed?"

**Authorization** means checking what an authenticated user is allowed to do.

Example:

> "Ahmed is logged in, but is he allowed to delete users?"

---

## Password Hashing with bcrypt

We never store a user's password directly in the database.

Instead, we use `bcrypt` to create a password hash.

```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

During login, we compare the entered password with the stored hash:

```javascript
await bcrypt.compare(password, user.password);
```

Hashing is one-way, so we cannot simply convert the hash back into the original password.

The salt and cost factor provided by bcrypt make password cracking more difficult.

---

## JWT

JWT stands for **JSON Web Token**.

It is used to represent an authenticated user's identity.

A JWT has three main parts:

1. Header
2. Payload
3. Signature

The payload can contain information such as:

```javascript
{
  userId: "...",
  role: "customer"
}
```

The server signs the token using a secret key and later verifies the signature.

---

# 3. Access Token vs Refresh Token

### Access Token

The access token is used to access protected API routes.

It usually has a short lifetime.

Example:

```text
Authorization: Bearer <accessToken>
```

### Refresh Token

The refresh token is used to obtain a new access token after the access token expires.

It normally has a longer lifetime.

Using separate access and refresh tokens improves security because the short-lived access token limits the damage if it is stolen.

---

# 4. Middleware

Middleware runs between the request and the final controller.

We created authentication and authorization middleware.

### `protect`

The `protect` middleware:

1. Reads the JWT from the Authorization header.
2. Verifies the token.
3. Gets the user ID from the token.
4. Finds the user.
5. Attaches the user to the request.
6. Allows the request to continue.

### `authorize`

The `authorize` middleware checks the user's role.

For example:

```text
customer → cannot access admin route
admin → can access admin route
```

---

# 5. Input Validation

We used `express-validator` to validate incoming data.

For example, registration data should contain:

- Valid name
- Valid email
- Valid password

We should never trust client input because users or attackers can send requests directly to the API.

Therefore, validation must happen on the server.

---

# 6. Password Reset

For password reset, we generate a random token.

The raw token is sent to the user, while only its hash is stored in the database.

```text
Raw token → Email
Hashed token → Database
```

When the user submits the token, we hash it again and compare it with the database value.

We also store an expiry time.

```javascript
passwordResetExpires: {
  $gt: Date.now();
}
```

This ensures that expired reset tokens cannot be used.

We also return a generic message such as:

```text
If email exists, a reset link has been sent
```

This prevents **user enumeration**.

---

# 7. Email Verification

After registration, the user receives a verification link.

The verification flow is:

```text
Register
   ↓
Generate verification token
   ↓
Hash token
   ↓
Store hash + expiry
   ↓
Send/log verification link
   ↓
User clicks link
   ↓
Hash received token
   ↓
Find user
   ↓
Check expiry
   ↓
Set isEmailVerified = true
```

Until the email is verified, login is blocked.

---

# 8. Important Files

### `server/src/modules/users/user.model.js`

Contains the User schema.

It includes:

- User information
- Password
- Role
- Account status
- Password reset token
- Password reset expiry
- Email verification token
- Email verification expiry

### `server/src/modules/auth/auth.service.js`

Contains the main authentication business logic:

- Register
- Login
- Refresh token
- Logout
- Forgot password
- Reset password
- Email verification

### `server/src/modules/auth/auth.controller.js`

Handles HTTP requests and responses.

It receives the request, calls the service, and sends the response.

### `server/src/modules/auth/auth.routes.js`

Defines authentication API routes.

### `server/src/modules/auth/auth.validation.js`

Contains validation rules for authentication requests.

### `server/src/middleware/auth.middleware.js`

Contains the `protect` middleware for authentication.

### `server/src/middleware/authorize.middleware.js`

Contains role-based authorization logic.

### `server/src/middleware/validate.middleware.js`

Handles validation errors returned by `express-validator`.

---

# 9. Reflection Questions

## 1. What did you learn in Phase 2?

I learned how to build a secure authentication and authorization system for a backend application.

I learned how passwords should be hashed using bcrypt instead of storing plaintext passwords. I learned how JWT access tokens authenticate users and how refresh tokens can be used to generate new access tokens.

I also learned how middleware can protect routes and how role-based authorization can restrict access to specific users.

Another important lesson was handling security-sensitive features such as password reset and email verification using hashed tokens and expiry times.

I also learned why input validation, proper HTTP status codes, token rotation, and prevention of user enumeration are important for API security.

---

## 2. Why is each part needed?

### bcrypt

bcrypt protects user passwords. If the database is compromised, attackers should not immediately see the user's actual passwords.

### JWT

JWT allows the server to identify authenticated users without requiring the user to log in on every request.

### Refresh Token

Access tokens should be short-lived for security. Refresh tokens allow users to obtain new access tokens without logging in again.

### Middleware

Middleware allows us to reuse authentication and authorization logic across many routes.

### Validation

Validation prevents invalid or malicious input from reaching business logic and the database.

### Role-Based Access

Role-based access control ensures users can only perform actions allowed for their role.

For example, a customer should not be able to access an admin-only endpoint.

---

## 3. How does authentication work from registration to a protected route?

The basic flow is:

```text
User Registration
      ↓
Validate input
      ↓
Hash password with bcrypt
      ↓
Create user
      ↓
Generate email verification token
      ↓
User verifies email
      ↓
User logs in
      ↓
Verify email + password
      ↓
Generate access + refresh tokens
      ↓
Client sends access token
      ↓
protect middleware verifies JWT
      ↓
Find user
      ↓
Protected controller runs
```

If the user tries to access a protected route without a valid token, the request is rejected.

---

## 4. Where did we use it?

We implemented the authentication system across several files.

`user.model.js` contains the User schema and security-related fields.

`auth.service.js` contains the authentication business logic such as registration, login, password reset, email verification, refresh tokens, and logout.

`auth.controller.js` handles HTTP requests and responses.

`auth.routes.js` defines the authentication endpoints.

`auth.validation.js` validates incoming authentication data.

`auth.middleware.js` protects authenticated routes.

`authorize.middleware.js` checks user roles.

`validate.middleware.js` handles validation errors.

---

## 5. What could go wrong if we ignore these security measures?

If passwords are stored as plaintext, a database leak could expose every user's password.

If JWTs are not properly verified, attackers could access protected resources.

If refresh tokens are not rotated or revoked, a stolen refresh token could remain useful for a long time.

Without validation, attackers could send invalid or malicious input to the server.

Without authorization, a normal customer might access admin-only operations.

Without token expiry, password reset or verification links could remain valid forever.

Without hashed reset tokens, a database leak could allow attackers to use reset tokens directly.

Without email verification, attackers could create accounts using email addresses they do not own.

Without user-enumeration protection, attackers could discover which email addresses are registered.

---

## 6. How would you explain Phase 2 to an interviewer?

I would explain it like this:

> "In Phase 2, I implemented authentication and authorization for the backend. I used bcrypt to securely hash passwords and JWT for authentication. I separated access tokens and refresh tokens, and implemented refresh token rotation and revocation.
>
> I created middleware to protect routes and another middleware for role-based authorization. I also added request validation using express-validator.
>
> For security-sensitive features, I implemented password reset and email verification using random tokens. Instead of storing the raw tokens, I stored their hashes and added expiration times.
>
> I also handled security concerns such as user enumeration and used appropriate 401 and 403 status codes.
>
> The main goal of Phase 2 was to build a secure authentication system rather than simply making login and registration work."

---

# 10. Interview Questions

## Beginner

### 1. What is the difference between authentication and authorization?

Authentication verifies **who the user is**.

Authorization verifies **what the user is allowed to do**.

Example:

```text
Authentication:
"Are you Ahmed?"

Authorization:
"Ahmed is a customer. Can he access this admin route?"
```

---

### 2. Why do we hash passwords instead of encrypting them?

Passwords are hashed because the application does not need to recover the original password.

Hashing is designed to be one-way.

During login, we compare the entered password with the stored hash.

Encryption is different because encrypted data can be decrypted with the correct key.

For passwords, hashing is the appropriate approach.

---

### 3. What is a JWT and what are its three parts?

JWT stands for **JSON Web Token**.

It is commonly used to represent authenticated user information.

Its three parts are:

```text
Header.Payload.Signature
```

### Header

Contains information about the token type and signing algorithm.

### Payload

Contains claims such as:

```javascript
{
  userId: "...",
  role: "customer"
}
```

### Signature

Used to verify that the token was created by the trusted server and has not been modified.

---

# Intermediate

## 4. Explain the difference between access token and refresh token.

An access token is normally short-lived and is used to access protected APIs.

A refresh token has a longer lifetime and is used to obtain a new access token.

The advantage is that the access token can expire quickly while the user can remain logged in through the refresh token.

---

## 5. How does the `protect` middleware verify a user?

The `protect` middleware generally:

1. Gets the Authorization header.
2. Extracts the Bearer token.
3. Verifies the JWT using the access-token secret.
4. Gets the user ID from the token.
5. Finds the user in the database.
6. Checks that the user still exists and is active.
7. Attaches the user to the request.
8. Calls `next()` to continue.

If the token is missing or invalid, the request is rejected.

---

## 6. Why do we use `select: false` on the password field?

We use:

```javascript
select: false;
```

so the password hash is not returned in normal database queries.

This reduces the chance of accidentally exposing password hashes through API responses or application code.

When login needs the password hash, we explicitly request it:

```javascript
User.findOne({ email }).select("+password");
```

---

## 7. What is token rotation and why is it important?

Token rotation means replacing the old refresh token with a new refresh token when it is used.

For example:

```text
Old refresh token
       ↓
Used successfully
       ↓
Revoke old token
       ↓
Generate new refresh token
```

This reduces the useful lifetime of a stolen refresh token and makes token theft easier to detect and control.

---

# Advanced

## 8. How would you store refresh tokens in production? What are the trade-offs of in-memory storage?

In production, I would use a database or Redis instead of an in-memory `Set`.

In-memory storage is simple for development, but it has major limitations.

If the server restarts, all refresh tokens are lost.

It also does not work well when multiple server instances are running because each instance has its own memory.

Redis is useful because it is fast and shared between application instances.

A database can also be used when persistent storage and auditing are important.

For additional security, refresh tokens should be stored securely and preferably represented by hashes rather than raw tokens.

---

## 9. How can we prevent user enumeration in authentication APIs?

We should avoid giving attackers different responses depending on whether an account exists.

For example, instead of:

```text
Email not found
```

we can respond:

```text
If email exists, a reset link has been sent
```

This makes it difficult for attackers to determine which email addresses are registered.

We should also consider consistent response behavior and rate limiting for authentication endpoints.

---

## 10. What is the difference between 401 and 403?

### 401 Unauthorized

Used when authentication is missing or invalid.

Example:

```text
No valid JWT token provided.
```

The user needs to authenticate.

### 403 Forbidden

Used when the user is authenticated but does not have permission.

Example:

```text
A customer tries to access an admin-only route.
```

The user is logged in, but access is not allowed.

A simple way to remember:

```text
401 → "Who are you?"
403 → "I know who you are, but you cannot do this."
```

---

# Phase 2 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] Password hashes hidden with `select: false`
- [x] JWT access tokens
- [x] JWT refresh tokens
- [x] Refresh token rotation
- [x] Refresh token revocation
- [x] Protected routes
- [x] Role-based authorization
- [x] Server-side input validation
- [x] Password reset tokens hashed
- [x] Password reset token expiry
- [x] Email verification tokens hashed
- [x] Email verification expiry
- [x] Email verification required before login
- [x] User enumeration protection
- [x] Correct use of 401 and 403

---

# Production Improvements

Before using this authentication system in production, I would improve several areas:

1. Replace the in-memory refresh token store with Redis or a database.
2. Store refresh tokens securely, preferably using HTTP-only, Secure cookies.
3. Add rate limiting to login and password-reset endpoints.
4. Use a proper email service for verification and password-reset emails.
5. Never log reset or verification URLs in production.
6. Use HTTPS everywhere.
7. Use strong environment-specific secrets.
8. Rotate secrets when necessary.
9. Add account lockout or additional protection against repeated failed login attempts.
10. Add monitoring and logging for suspicious authentication activity.

---

# Phase 2 Conclusion

Phase 2 taught me how to build a secure authentication and authorization foundation for a backend application.

The important lesson is that authentication is not only about creating a login endpoint. A secure system also requires password hashing, token management, validation, authorization, expiry, revocation, email verification, password recovery, and protection against common attacks.

This foundation can now be used for the next phase of the application: **User Management**.
