# Phase 6 — Cart

## Phase 6 Overview

In Phase 6, I implemented the shopping cart system for the e-commerce backend.

The cart is stored in a separate MongoDB collection and is associated with a user. A cart contains products or product variants, their quantities, and a price snapshot. The cart API supports adding, updating, removing, clearing items, and calculating totals.

The main goal of this phase was to build a reliable cart while validating user input, product/variant existence, and available stock.

---

# Phase 6 Notes Summary

## 1. Cart Collection

Instead of storing the entire cart inside the User document, we created a separate Cart collection.

This approach keeps the User document smaller and makes cart-specific operations easier to manage.

Each user has their own cart, and the user reference is unique so that one user does not accidentally get multiple carts.

## 2. Cart Item

A cart item represents one product or product variant that the user wants to purchase.

A cart item contains information such as:

- Product ID
- Variant ID when applicable
- Quantity
- Price snapshot

The product and variant IDs identify what the user wants, while quantity tells us how many units they want.

## 3. Price Snapshot

When an item is added to the cart, the server determines its price instead of trusting a price sent by the client.

The price is stored as a snapshot in the cart item.

This gives the cart a record of the price that was used when the item was added. However, the final price should still be revalidated during checkout because product prices can change.

## 4. Validation

Cart input must be validated before modifying the database.

Important validations include:

- Product ID must be a valid MongoDB ObjectId.
- Variant ID must be a valid MongoDB ObjectId when provided.
- Quantity must be a positive integer.
- Product must exist.
- Variant must exist when selected.
- Quantity must not exceed available stock.

Validation protects the database from invalid or malicious input.

## 5. Stock Validation

Stock is checked when an item is added or its quantity is increased.

For example, if a product has only 8 units available, the cart should not allow the user to add 10 units.

Stock validation is important because allowing impossible quantities would create problems later during checkout.

Stock should also be checked again at checkout because stock can change after the item was added to the cart.

## 6. Duplicate Items

The same product/variant combination should not create multiple cart items unnecessarily.

If the product or variant already exists in the cart, the existing item's quantity should be updated instead of creating another duplicate item.

This keeps the cart clean and makes quantity management easier.

## 7. Cart Totals

The cart service calculates values such as:

- Subtotal
- Total number of items

The subtotal is calculated using the cart item's price and quantity.

For example:

`subtotal = price × quantity`

The server calculates these values rather than trusting totals sent by the client.

## 8. Race Conditions

The current implementation follows a basic:

1. Load cart
2. Modify cart
3. Save cart

flow.

This works for normal single-user scenarios, but concurrent requests can cause lost updates.

For example, two requests could load the same quantity at the same time, modify it differently, and then save. The last save could overwrite the first update.

This limitation will be addressed later using atomic MongoDB operations such as `$inc` and `findOneAndUpdate`, and potentially transactions where necessary.

---

# Important Terminology

- **Cart Collection:** MongoDB collection used to store shopping carts.
- **Cart Item:** An individual product/variant and its quantity inside a cart.
- **Price Snapshot:** Price stored with a cart item at the time it is added.
- **Variant:** A specific version of a product, such as size or color.
- **Quantity Validation:** Checking that the requested quantity is valid.
- **Stock Validation:** Making sure requested quantity does not exceed available inventory.
- **Unique Index:** Database rule used to prevent duplicate values, such as multiple carts for the same user.
- **Race Condition:** A problem caused by multiple operations accessing and modifying the same data concurrently.
- **Lost Update:** When one concurrent update overwrites another update.

---

# Key Files

The main files used in Phase 6 are:

- `server/src/modules/cart/cart.model.js`
- `server/src/modules/cart/cart.service.js`
- `server/src/modules/cart/cart.controller.js`
- `server/src/modules/cart/cart.routes.js`
- `server/src/modules/cart/cart.validation.js`

The model defines the cart structure.

The service contains the main cart business logic.

The controller handles HTTP requests and responses.

The routes expose the cart API endpoints.

The validation file validates incoming request data.

---

# Reflection Questions

## 1. What did I learn in Phase 6?

I learned how to design and implement a shopping cart system using MongoDB and a Node.js backend.

I learned why a cart should be treated as its own domain instead of simply putting everything inside the User document.

I also learned the importance of server-side validation, stock checking, price handling, duplicate prevention, and calculating totals on the server.

An important additional concept was race conditions. The current implementation works correctly for normal operations, but concurrent requests can cause lost updates, so production systems need atomic operations or transactions.

---

## 2. Why is each part needed?

### Separate Cart Collection

A separate collection keeps the User document smaller and allows cart operations to be handled independently.

### Price Snapshot

The price snapshot records the price associated with the cart item when it was added. It also prevents the client from controlling the stored price.

The final price should still be checked at checkout because prices can change.

### Validation

Validation prevents invalid data from reaching the database.

For example, we should not accept negative quantities or invalid MongoDB IDs.

### Stock Checks

Stock checks prevent users from adding more items than are currently available.

However, stock must also be revalidated at checkout because another customer may purchase the remaining inventory.

### Totals

Totals provide the user with the current cart subtotal and item count.

These values should be calculated by the server so that the client cannot manipulate them.

---

## 3. How does the cart flow work?

The general cart flow is:

1. The authenticated user sends a request to add an item.
2. The protected route identifies the user.
3. The request data is validated.
4. The server checks that the product exists.
5. If a variant is provided, the server checks that the variant exists.
6. The server determines the correct price from the database.
7. The server checks available stock.
8. The cart is loaded or created for the user.
9. The service checks whether the same product/variant already exists.
10. If it exists, its quantity is updated.
11. Otherwise, a new cart item is added.
12. The cart is saved.
13. When the cart is requested, the service calculates totals.
14. At checkout, the cart and inventory must be revalidated again.

---

## 4. Where did we use it?

The cart functionality was divided into several files.

### `cart.model.js`

Defines the MongoDB Cart schema and cart item structure.

### `cart.service.js`

Contains the main business logic, including operations such as:

- Getting or creating a cart
- Adding an item
- Updating quantity
- Removing an item
- Clearing the cart
- Calculating totals
- Checking stock

### `cart.controller.js`

Receives HTTP requests, calls the appropriate service functions, and sends responses back to the client.

### `cart.routes.js`

Defines the cart API endpoints and protects them with authentication middleware.

### `cart.validation.js`

Validates request input such as product IDs, variant IDs, and quantities.

---

## 5. What could go wrong if we ignore cart consistency?

Several problems can happen.

### Without Stock Checks

A user could add more items than are available, resulting in failed orders or an overselling problem.

### With Duplicate Items

The cart could contain multiple entries for the same product/variant, making quantity management and checkout more complicated.

### Without Protected Routes

A user could potentially access or modify another user's cart.

### If Client-Sent Prices Are Trusted

A malicious client could modify the price in the request and potentially purchase an item for an invalid amount.

### Without Input Validation

Invalid IDs, negative quantities, or malformed requests could reach the database.

### Without Checkout Revalidation

An item could be available when it enters the cart but become unavailable before checkout.

### Without Concurrency Handling

Two simultaneous requests could overwrite each other's changes and cause lost updates.

---

## 6. How would I explain Phase 6 to an interviewer?

I would explain it like this:

> In Phase 6, I implemented a shopping cart system using a separate MongoDB collection. Each authenticated user has a unique cart containing product or variant references, quantities, and price snapshots. I created CRUD operations for adding, updating, removing, and clearing cart items, along with subtotal and item-count calculations.
>
> I added server-side validation for IDs and quantities, checked that products and variants exist, and validated stock before modifying the cart. I also prevented duplicate product/variant entries by updating the existing cart item when appropriate.
>
> I made sure prices are determined by the server rather than trusted from the client. I also learned about race conditions in the load-modify-save approach. For higher-concurrency situations, I would use atomic MongoDB operations such as `findOneAndUpdate` and `$inc`, and transactions where appropriate.
>
> Finally, I understand that cart validation is not enough by itself. Stock and pricing must be revalidated during checkout because inventory and prices can change after an item is placed in the cart.

---

# Interview Questions and Answers

## Beginner

### 1. Why do we use a separate Cart collection instead of storing items directly in User?

A separate Cart collection keeps the User document smaller and separates user information from shopping-cart data.

It also makes cart-specific queries and updates easier to manage.

---

### 2. What is a cart item and what fields does it contain?

A cart item represents one product or product variant in the user's cart.

In our implementation, it contains:

- Product reference
- Variant reference when applicable
- Quantity
- Price snapshot

---

### 3. Why must cart routes be protected?

Cart data belongs to a specific authenticated user.

Protected routes ensure that a user can only view and modify their own cart.

Without authentication and authorization, users could potentially access or manipulate another user's cart.

---

# Intermediate

### 4. What is the purpose of a price snapshot in a cart item?

A price snapshot stores the price associated with the item when it was added to the cart.

It provides consistency for the cart's current state and prevents the client from choosing an arbitrary price.

However, the price should be revalidated during checkout because the actual product price may have changed.

---

### 5. How do we prevent the same product/variant from creating duplicate items?

Before adding a new cart item, we check whether the same product/variant combination already exists in the user's cart.

If it exists, we increase or update its quantity instead of creating another cart item.

This keeps the cart organized.

---

### 6. What is the difference between `product.price` and `variant.price`?

`product.price` is the base price of the product.

`variant.price` is the price associated with a specific variant when variants have their own pricing.

When adding an item, the backend should determine which price applies based on the selected product and variant rather than accepting a price from the client.

---

# Advanced

### 7. What is a race condition in cart operations? How would you prevent it?

A race condition occurs when multiple requests access and modify the same cart at nearly the same time.

For example, two requests may both read quantity `1`, then one changes it to `2` and another changes it to `3`. If both save independently, one update may overwrite the other.

To reduce this problem, I would use atomic MongoDB operations such as:

- `findOneAndUpdate`
- `$inc`
- Conditional updates

For more complex operations involving multiple documents, MongoDB transactions can also be used.

---

### 8. What happens if a product's price changes while it is in the cart?

The cart can display the price snapshot according to the chosen business rule, but checkout must use the current authoritative price from the database.

A good production approach is to inform the user if the price changed before checkout and ask them to accept the updated price.

The important point is that the client must never be allowed to determine the final order price.

---

### 9. What are the trade-offs of storing a cart in MongoDB vs Redis?

### MongoDB

Advantages:

- Persistent storage
- Survives application restarts
- Easy integration with existing application data
- Suitable when carts need long-term persistence

Disadvantages:

- Database reads/writes can be slower than in-memory storage
- Higher database load at very large scale

### Redis

Advantages:

- Very fast
- Good for high-frequency cart operations
- Useful for caching and temporary data

Disadvantages:

- Requires additional infrastructure
- Data persistence and recovery need to be designed carefully
- More complexity when combining Redis with the main database

A production system can also use both: MongoDB for durable cart storage and Redis for caching or high-speed access.

---

# Real-World Scenario

## 10. A user adds 10 items, but only 8 are in stock. What should happen?

At the cart level, the request to add 10 should be rejected or limited according to the application's business rules because only 8 units are available.

The backend must perform the stock check using the actual database value rather than trusting the client.

At checkout, stock must be checked again because the inventory may have changed since the item was added.

For example:

1. Product has 8 units.
2. User tries to add 10.
3. Cart operation rejects the request because quantity exceeds stock.
4. User can add at most 8.
5. Later, another customer buys 3 units.
6. Only 5 remain.
7. During checkout, the backend detects the new stock level.
8. The order must not reserve or sell more than the available quantity.

In a high-concurrency production system, inventory deduction should be atomic so that two customers cannot both successfully purchase the same final units.

---

# Common Mistakes to Avoid

- Storing the entire cart inside the User document without considering document growth.
- Trusting product prices sent by the frontend.
- Not checking whether a product exists.
- Not checking whether a selected variant exists.
- Allowing zero, negative, or invalid quantities.
- Allowing cart quantity to exceed stock.
- Creating duplicate cart items for the same product/variant.
- Leaving cart routes unprotected.
- Defining the same MongoDB index multiple times.
- Assuming cart stock validation is enough for checkout.
- Ignoring concurrent cart updates.

---

# Security Considerations

The cart API must be protected with authentication.

The backend should validate all product and variant IDs.

Quantities must be positive integers.

Prices must be calculated from trusted server-side product/variant data.

The server should verify that the authenticated user owns the cart being accessed or modified.

Client-provided totals, prices, and stock values should never be trusted.

---

# Production Considerations

For a production-ready cart system, I would consider:

- Atomic MongoDB updates for concurrent modifications.
- Transactions for operations that require multiple documents to remain consistent.
- Checkout-time price and stock revalidation.
- Redis caching when cart traffic becomes large.
- Background jobs for abandoned-cart processing.
- Proper inventory reservation/deduction during checkout.
- Logging and monitoring for failed cart operations.
- Clear handling when products or variants become unavailable.

---

# Phase 6 Final Takeaway

Phase 6 taught me that a shopping cart is more than just an array of products.

A reliable cart needs:

- Proper data modeling
- Authentication
- Input validation
- Product and variant validation
- Stock validation
- Duplicate prevention
- Server-side pricing
- Total calculation
- Checkout revalidation
- Awareness of concurrency problems

The current cart implementation provides the foundation for the next stages of the e-commerce system, especially checkout, inventory management, and order creation.

---

# Phase 6 Status

**Phase:** 6 — Cart

**Status:** Complete

**Next Phase:** Phase 7 — Wishlist & Reviews
