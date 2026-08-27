# Phase 7 — Wishlist & Reviews

## Phase 7 Notes Summary

In Phase 7, I implemented two important modules for the e-commerce application:

- Wishlist module
- Reviews module

The Wishlist module allows users to save products for later. Users can add products, remove products, and view their wishlist. Duplicate products are prevented from being added multiple times.

The Reviews module allows users to review products. A review contains a rating from 1 to 5 and optional title and review text.

The Review module also includes:

- Create review
- Update review
- Delete review
- List product reviews
- Average rating
- Review status
- Verified purchase field
- Validation
- Duplicate review prevention
- Role-based deletion

---

## Wishlist

The Wishlist is used to save products that a user may want to buy later.

The wishlist functionality includes:

- Add product to wishlist
- Remove product from wishlist
- Get user's wishlist
- Prevent duplicate products
- Connect users with products

A separate Wishlist collection makes it easier to manage wishlist data independently from the User document.

---

## Reviews

The Review model contains these important fields:

- `user`
- `product`
- `rating`
- `title`
- `review`
- `status`
- `isVerifiedPurchase`

The `rating` field accepts values from 1 to 5.

The `title` and `review` fields contain optional written feedback.

The `user` and `product` fields are references to the User and Product collections.

---

## Unique Compound Index

In the Review model, I used this unique compound index:

```javascript
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
```
