# Phase 8 — Inventory Notes

## Phase 8 Summary

In Phase 8, I learned how to build an inventory system for an e-commerce application.

We created a separate Inventory collection to manage stock independently from the Product collection.

We track three important values:

- `stock` — total stock available.
- `reservedStock` — stock temporarily reserved for orders.
- `availableStock` — stock currently available for new orders.

We also created a `StockMovement` collection to keep the history of inventory changes.

The main stock movement types are:

- `IN` — stock added.
- `OUT` — stock deducted.
- `RESERVE` — stock reserved.
- `RELEASE` — reserved stock released.
- `ADJUST` — manual stock correction.

We also used MongoDB atomic operations like `findOneAndUpdate`, `$inc`, and `$gte` to reduce race conditions and prevent overselling.

---

# Reflection Questions

## 1. What did you learn in Phase 8?

I learned how inventory management works in an e-commerce system.

I learned how to track total stock, reserved stock, and available stock. I also learned why stock reservations are important during checkout and how atomic database operations help prevent overselling.

I also learned how to keep a history of every stock change using stock movements.

---

## 2. Why is each part needed?

### Inventory Collection

The Inventory collection keeps stock information separate from the Product collection.

This is useful because inventory can change frequently, especially when many customers are buying at the same time.

### StockMovement

StockMovement keeps a history of stock changes.

For example, we can see when stock was added, reserved, released, or deducted.

### Atomic Operations

Atomic operations help prevent race conditions.

They make sure that the stock check and update happen safely together.

### reservedStock

`reservedStock` represents stock that is temporarily held for an order.

This prevents the same stock from being sold to another customer.

### availableStock

`availableStock` tells us how much stock is currently available for new orders.

It can be calculated as:

`stock - reservedStock`

---

## 3. How does the inventory flow work from adding stock to reserving and releasing?

First, stock is added using `addStock`.

For example:

- Stock = 50
- Reserved Stock = 0
- Available Stock = 50

When a customer places an order, we reserve some stock.

If we reserve 5:

- Stock = 50
- Reserved Stock = 5
- Available Stock = 45

If the order is cancelled or payment fails, we release the reservation.

After releasing 5:

- Stock = 50
- Reserved Stock = 0
- Available Stock = 50

If the payment succeeds, the reserved stock can eventually be deducted from the actual stock.

---

## 4. Where did we use it?

We created the following files:

- `inventory.model.js`
- `stockMovement.model.js`
- `inventory.service.js`
- `inventory.controller.js`
- `inventory.routes.js`
- `inventory.validation.js`

Important service functions include:

- `getInventory()`
- `addStock()`
- `deductStock()`
- `reserveStock()`
- `releaseStock()`
- `adjustStock()`
- `listLowStock()`
- `getStockMovements()`

The routes were mounted in `app.js` under:

`/api/v1/inventory`

---

## 5. What could go wrong if we ignore concurrency and atomic operations?

If we don't handle concurrency properly, two customers could try to buy the same stock at the same time.

Both requests might see the same available stock and both could successfully purchase it.

This can cause overselling and incorrect inventory.

For example, if only 5 items are available and two customers both try to reserve 5, both requests could succeed if there is no proper concurrency control.

Atomic operations help prevent this problem.

---

## 6. How would you explain Phase 8 to an interviewer?

I would explain it like this:

"I built an inventory module for an e-commerce system. I separated inventory from the product collection and tracked stock, reserved stock, and available stock.

I used MongoDB atomic updates with conditions like `$gte` to prevent overselling when multiple customers access the inventory at the same time.

I also created a StockMovement collection to maintain an audit history of stock changes such as adding, reserving, releasing, and deducting stock.

The module also includes validation, role-based access, low-stock checking, and paginated stock movement history."

---

# Interview Questions

## Beginner

### 1. What is the difference between stock, reservedStock, and availableStock?

`stock` is the total quantity we have.

`reservedStock` is the quantity temporarily held for orders.

`availableStock` is the quantity that can still be sold.

Formula:

`availableStock = stock - reservedStock`

---

### 2. Why do we need a separate Inventory collection?

We use a separate Inventory collection because inventory changes frequently and can have high concurrency.

Keeping it separate from Product makes inventory management easier and reduces unnecessary updates to the Product document.

It also allows us to track inventory separately for different product variants.

---

### 3. What is a stock movement? Give two examples.

A stock movement is a record of a change in inventory.

Examples:

- `IN` — adding 50 new items to stock.
- `RESERVE` — reserving 5 items for an order.

Other examples include `OUT`, `RELEASE`, and `ADJUST`.

---

# Intermediate

## 4. Explain how `findOneAndUpdate` helps prevent overselling.

`findOneAndUpdate` can check the stock condition and update the stock in one atomic database operation.

For example:

```js
{
  availableStock: {
    $gte: quantity;
  }
}
```
