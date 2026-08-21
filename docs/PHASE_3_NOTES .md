# Phase 3 — User Management

## Overview

In Phase 3, I learned how to build complete user management features for an e-commerce backend.

The main features I implemented were:

- User profile management
- Password change
- Address management
- Default address handling
- Admin user management
- Role-based authorization
- User preferences
- Protected user routes

---

# 1. Phase 3 Concepts

## User Profile

Users can view and update their own profile information such as:

- Name
- Email
- Profile information

When updating an email, we check that another user is not already using the same email.

## Password Change

Before changing a password, the current password is verified using bcrypt.

The new password is then hashed before being stored in the database.

The password hash is never returned in normal API responses.

## Addresses

Addresses are stored as subdocuments inside the User document.

Users can:

- Add an address
- Update an address
- Delete an address
- Set an address as default

Only one address should normally be the default address.

If the default address is deleted, another remaining address is selected as the default.

## User Preferences

Preferences are stored inside the User document because they are small settings directly related to the user.

Preferences include:

- Language
- Currency
- Order update notifications
- Promotional notifications
- Newsletter notifications

Default values are provided so every user has valid preferences.

Only the fields provided by the user are updated.

## Admin Management

Admins can manage users through protected admin routes.

Admin functionality includes:

- Getting users
- Getting a specific user
- Updating user roles
- Activating users
- Deactivating users

Admin routes use role-based authorization so normal customers cannot access admin operations.

---

# 2. Important Terminology

## Embedding

Embedding means storing related data directly inside the parent MongoDB document.

Example:

A user's addresses and preferences are embedded inside the User document.

## Referencing

Referencing means storing related data separately and connecting it using an ID.

For example, an Order could reference a User using `userId`.

## Subdocument

A subdocument is a nested document stored inside another Mongoose document.

Our addresses are an example of subdocuments.

## Partial Update

A partial update changes only the fields provided by the client instead of replacing the entire object.

This is useful for preferences because a user may want to change only one setting.

## RBAC

RBAC means Role-Based Access Control.

In our project, roles such as `customer` and `admin` determine which operations a user is allowed to perform.

## Enum

Enum validation restricts a field to a predefined set of values.

For example:

- Language: `en`, `ur`
- Currency: `PKR`, `USD`
- Role: `customer`, `admin`

## req.user

`req.user` contains the authenticated user provided by the authentication middleware.

For user-specific operations, we use `req.user._id` instead of trusting a user ID sent in the request body.

---

# 3. Important Files

## user.model.js

This file defines the User schema.

In Phase 3, the User model was extended with:

- Addresses
- Preferences

## user.service.js

This file contains the business logic for:

- Profile operations
- Password changes
- Address operations
- Preferences
- Admin user management

## user.controller.js

This file handles HTTP requests and responses.

The controller receives the request, calls the service layer, and sends the API response.

## user.routes.js

This file defines user-related API routes.

It also applies authentication and authorization middleware where required.

---

# 4. Security Considerations

User-specific operations should use the authenticated user's ID from `req.user._id`.

We should not trust a `userId` provided by the client because a malicious user could try to access another user's data.

Admin routes should use authorization middleware such as:

`authorize("admin")`

Passwords should never be exposed in API responses.

Sensitive fields should be protected.

Enum validation should be used to prevent invalid roles, languages, and currencies.

---

# 5. Common Mistakes

Some important mistakes to avoid are:

- Forgetting email uniqueness checks.
- Returning password hashes in API responses.
- Forgetting to handle the default address after deletion.
- Putting `/:userId` before routes such as `/me`, `/profile`, or `/preferences`.
- Trusting `userId` from the request body for user-specific operations.
- Forgetting authentication middleware.
- Forgetting admin authorization.
- Not validating preference values.
- Overwriting all preferences when only one field should change.

---

# 6. Production Considerations

In a production application, we should also consider:

- Database indexes for frequently searched fields such as email.
- Transactions when multiple related database changes must succeed together.
- Rate limiting for sensitive endpoints.
- Strong validation for user input.
- Proper password reset and email verification flows.
- Logging and monitoring for security-sensitive operations.

---

# Phase 3 Reflection

## 1. What did I learn in Phase 3?

I learned how to manage users beyond basic authentication.

I learned how to build profile management, password changes, address management, user preferences, and admin user management.

I also learned how MongoDB embedding and Mongoose subdocuments can be used for data that belongs directly to a user.

Another important lesson was security. User-specific operations should use the authenticated user's ID from `req.user`, while admin operations should require an admin role.

---

## 2. Why is each part needed?

### Profile

The profile allows users to manage their personal information such as name and email.

### Addresses

Addresses are required in an e-commerce application for shipping and delivery.

### Preferences

Preferences allow users to control their language, currency, and notification settings.

### Admin Management

Admin management allows authorized administrators to manage users, change roles, and activate or deactivate accounts.

Each feature solves a different user-management requirement.

---

## 3. How does route protection and authorization work?

Authentication middleware first checks whether the user has a valid access token.

If authentication succeeds, the middleware identifies the user and places the user information in `req.user`.

For normal user operations, we use `req.user._id` so the user can only access their own data.

For admin operations, an authorization middleware checks the user's role.

If the role is not `admin`, the request is rejected.

So the basic flow is:

`Request → Authentication → Authorization → Controller → Service → Database`

---

## 4. Where did we use it?

The main implementation was divided into different files.

`user.model.js` contains the User schema, including addresses and preferences.

`user.service.js` contains the business logic for profiles, passwords, addresses, preferences, and admin operations.

`user.controller.js` handles HTTP requests and responses.

`user.routes.js` defines endpoints and applies authentication and authorization middleware.

This separation keeps the application organized and easier to maintain.

---

## 5. What could go wrong if we ignore proper user data management?

Poor user data management can create serious problems.

For example:

- Users could access another user's information.
- Unauthorized users could perform admin operations.
- Duplicate emails could be created.
- Password hashes could accidentally be exposed.
- Invalid roles or preferences could be stored.
- Default addresses could become inconsistent.
- Important user relationships could be broken by deleting data incorrectly.

Good validation, authentication, authorization, and data management help prevent these problems.

---

## 6. How would I explain Phase 3 to an interviewer?

I would explain it like this:

"Phase 3 focused on building complete user management for an e-commerce backend. I implemented profile management, password changes, embedded addresses, default address handling, user preferences, and admin user management. I used Mongoose subdocuments for addresses and embedded preferences because they are closely related to the user. I also implemented authentication and role-based authorization so users can only manage their own data while admins can manage users. The business logic is separated into services, controllers handle HTTP requests, and routes handle authentication and authorization."

---

# Phase 3 Interview Questions

## Beginner

### 1. What is the difference between embedding and referencing in MongoDB?

Embedding means storing related data inside the parent document.

Referencing means storing related data separately and connecting it using an ID.

In our project, addresses and preferences are embedded inside the User document.

An example of referencing would be an Order storing a `userId` that points to a User.

---

### 2. What is a subdocument in Mongoose?

A subdocument is a nested document inside another Mongoose document.

For example, each address inside the User document is a subdocument.

This allows us to manage addresses as part of the User document.

---

### 3. Why do we use enum for fields like role and language?

Enum restricts a field to allowed values.

For example, the role can be only:

- `customer`
- `admin`

And language can be:

- `en`
- `ur`

This prevents invalid data from being stored.

---

# Intermediate

### 4. How do we ensure a user cannot access another user's profile?

We use the authenticated user's ID from:

`req.user._id`

instead of trusting a user ID from the request body.

The authentication middleware identifies the logged-in user, and the service uses that ID to access their data.

This prevents a normal user from simply changing a `userId` in the request and accessing another user's profile.

---

### 5. Explain the purpose of `user.addresses.id(addressId)`.

`user.addresses.id(addressId)` is a Mongoose helper that searches the addresses subdocuments for the address with the specified ID.

It allows us to find a specific address before updating or deleting it.

If the address does not exist, we return an appropriate error.

---

### 6. What is the difference between PUT and PATCH? Which did we use for profile update and why?

PUT generally represents replacing or updating a complete resource, while PATCH is intended for partial updates.

For user profile updates, we used a partial update approach because we may only change specific fields such as name or email.

For preferences, we used PUT in our endpoint while implementing partial field updates inside the service.

The important point is that the service only changes the fields that were provided.

---

### 7. How do we manage the default address? Why is it important?

When an address is marked as default, we set all other addresses to `isDefault = false`.

When the first address is added, it automatically becomes the default.

If the default address is deleted, another remaining address can become the default.

This is important because the application needs one clear address for operations such as shipping and delivery.

---

# Advanced

### 8. How would you handle a situation where an admin tries to deactivate themselves? Should we prevent that?

Yes, I would normally prevent an admin from deactivating themselves.

If an admin could deactivate their own account, they could accidentally lock themselves out of the admin system.

The service could check:

`userId === req.user._id`

before allowing the deactivation.

For systems with multiple administrators, preventing self-deactivation is a safer default.

---

### 9. What are the trade-offs between embedding addresses and having a separate Address collection?

Embedding addresses is simple and fast when addresses belong only to one user and the number of addresses is relatively small.

It also allows the user and their addresses to be retrieved together easily.

A separate Address collection becomes more useful when:

- Users can have many addresses.
- Addresses need independent queries.
- Addresses are shared between multiple entities.
- Address data becomes large or complex.
- We need independent lifecycle management.

For our current e-commerce project, embedding is a reasonable choice because addresses are directly related to the user and are relatively small.

---

### 10. How would you add pagination to the admin users list?

I would use MongoDB's `skip()` and `limit()` methods.

For example:

`skip = (page - 1) * limit`

Then:

`User.find().skip(skip).limit(limit)`

I would also use `countDocuments()` to calculate the total number of users and return pagination information such as:

- Current page
- Page size
- Total users
- Total pages

For large datasets, cursor-based pagination could also be considered for better performance.

---

# Phase 3 Final Summary

Phase 3 taught me how to build a complete user-management module rather than only authentication.

I learned how to manage user profiles, passwords, addresses, preferences, and administrative actions while maintaining proper authentication, authorization, validation, and data integrity.

The main architectural flow is:

`Routes → Middleware → Controller → Service → Model/Database`

This structure keeps responsibilities separated and makes the application easier to maintain and scale.

Phase 3 is now complete.
