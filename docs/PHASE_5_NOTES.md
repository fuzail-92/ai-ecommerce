# Phase 5 — Product Search

## What We Covered

Phase 5 focused on building a traditional product search system using MongoDB text search.

The main features are:

- Dedicated `/api/v1/products/search` endpoint
- MongoDB `$text` search
- Text indexes
- Relevance scoring with `$meta: 'textScore'`
- Category, brand, and price filters
- Sorting
- Pagination
- Correct Express route ordering

MongoDB `$text` is useful for basic keyword-based product search. It searches indexed words and can calculate how relevant each result is to the search query.

## Important Concepts

### `$text`

MongoDB's `$text` operator searches fields covered by a text index.

It allows users to search product information using keywords instead of requiring an exact field value.

### Text Index

A text index is required before `$text` search can work.

It tells MongoDB which fields should be searchable.

### `textScore`

`$meta: 'textScore'` gives each matching document a relevance score.

A higher score generally means the document is more relevant to the search query. The score can be used to sort results by relevance.

### Dedicated Search Endpoint

The search functionality uses a dedicated endpoint because searching is different from normal product listing.

`listProducts` is mainly for browsing and filtering the catalog, while `searchProducts` handles keyword search and relevance ranking.

A separate endpoint also makes it easier to change the search implementation in the future.

### Route Ordering

The `/search` route must be defined before `/:id`.

Express checks routes from top to bottom. If `/:id` comes first, a request such as `/products/search` can be interpreted as a request where the ID is `"search"`.

## Search Flow

The general search flow is:

1. The user enters a search query.
2. The client sends the query to the search endpoint.
3. `searchProducts` receives the query parameters.
4. MongoDB performs `$text` search when a valid search query is provided.
5. Filters such as category, brand, and price range are applied.
6. Results are sorted according to the requested sorting option.
7. When relevance sorting is requested, `textScore` is used.
8. Pagination limits the number of returned products.
9. The controller returns the results to the client.

If `q` is empty and `sort=relevance`, the condition `if (q && sort === 'relevance')` is false. Therefore, the code does not attempt `$text` search or text-score sorting and falls through to the normal sorting logic, which uses `{ createdAt: -1 }`.

## Files and Functions

### `server/src/modules/products/product.service.js`

The `searchProducts` function contains the product search logic.

It handles the search query, filters, sorting, and pagination.

### `server/src/modules/products/product.controller.js`

The `searchProducts` controller handles the incoming search request and calls the service.

### `server/src/modules/products/product.routes.js`

The `/search` route was added here.

It must appear before the `/:id` route.

---

# Reflection Questions

## 1. What did you learn in Phase 5?

I learned how to build a basic e-commerce product search system using MongoDB's `$text` search. I learned about text indexes, relevance scores, search-specific endpoints, filters, sorting, pagination, and Express route ordering.

I also learned that MongoDB text search is useful for basic keyword search but has limitations compared with dedicated search engines.

## 2. Why is each part needed?

- **Search endpoint:** Separates search functionality from normal product listing.
- **Text index:** Makes the product fields searchable with `$text`.
- **Relevance score:** Allows matching products to be ranked according to search relevance.
- **Route order:** Prevents `/search` from being interpreted as an ID.
- **Query parameters:** Allow users to control the search query, filters, sorting, and pagination.

Together, these parts make the search feature usable and maintainable.

## 3. How does the search flow work from user query to results?

The user sends a keyword query along with optional filters, sorting, and pagination parameters.

The controller receives the request and calls `searchProducts`. The service builds the MongoDB query. If a search query exists, `$text` is used. Additional filters such as category, brand, and price range are combined with the search.

If relevance sorting is requested while a query exists, MongoDB's `textScore` is used. Otherwise, normal sorting such as newest or price ascending/descending is used.

Finally, pagination limits the results and the products are returned to the client.

## 4. Where did we use it?

We used the search functionality in three main files:

- `server/src/modules/products/product.service.js` — `searchProducts`
- `server/src/modules/products/product.controller.js` — `searchProducts`
- `server/src/modules/products/product.routes.js` — `/search` route

The service contains the main search logic, the controller handles the HTTP request, and the routes expose the functionality through the API.

## 5. What could go wrong if we ignore proper search design?

Search could become slow, inaccurate, difficult to maintain, or expose information that should not be returned.

Possible problems include:

- Missing or incorrect text indexes
- Incorrect route ordering
- Invalid query parameters
- Very large result sets
- Poor relevance
- Unvalidated input
- Excessive search requests
- Exposing internal product fields
- Poor performance as the catalog grows

MongoDB `$text` also has limitations for advanced features such as autocomplete, fuzzy matching, and sophisticated ranking.

## 6. How would you explain Phase 5 to an interviewer?

"I built a product search system using MongoDB's `$text` search. I created a dedicated search endpoint and used a text index to search product fields. I used `$meta: 'textScore'` to rank results by relevance and combined keyword search with filters, sorting, and pagination. I also handled Express route ordering so `/search` is matched before `/:id`. I understand that MongoDB text search is suitable for basic search, but for advanced features like fuzzy search, autocomplete, and complex ranking, I would consider a dedicated search engine such as Elasticsearch or OpenSearch."

---

# Interview Questions

## Beginner

### 1. What is MongoDB text search, and how does it differ from a regular `find` query?

MongoDB text search uses a text index and `$text` to search words within indexed text fields.

A regular `find` query is generally used for exact or structured conditions such as `category: "laptop"` or `price: { $lt: 100000 }`.

Text search is designed specifically for keyword-based searching.

### 2. Why do we need a text index to use `$text`?

MongoDB requires a text index because `$text` searches the indexed text fields.

The index allows MongoDB to efficiently search words instead of scanning every product document.

### 3. What does `$meta: 'textScore'` do?

It tells MongoDB to include the relevance score for a text-search result.

That score can then be used to sort matching documents so that more relevant products appear first.

---

# Intermediate

### 4. Explain why `/search` must be defined before `/:id` in our routes.

Express matches routes from top to bottom.

If `/:id` appears before `/search`, Express can match `"search"` as the value of the `id` parameter.

Putting `/search` first ensures that the request reaches the search handler.

### 5. How do filters like category and price range combine with keyword search in `searchProducts`?

The keyword search identifies products matching the text query, while additional conditions restrict those results.

For example, a user could search for laptops and then limit the results to a specific category, brand, or price range.

This allows keyword search and structured filtering to work together.

### 6. What are the limitations of MongoDB text search? When would you consider a dedicated search engine?

MongoDB text search is relatively basic.

It has limitations around:

- Fuzzy matching
- Typo tolerance
- Autocomplete
- Synonyms
- Advanced ranking
- Search-as-you-type
- Complex search features

I would consider Elasticsearch, OpenSearch, or another dedicated search solution when search becomes a major feature or the application requires advanced relevance and discovery capabilities.

---

# Advanced

### 7. How would you add autocomplete or search-as-you-type suggestions?

I would use a search technology designed for autocomplete, such as Elasticsearch/OpenSearch or MongoDB Atlas Search.

The system could index product names and other relevant fields in a way optimized for prefix or autocomplete queries.

I would also debounce requests from the frontend so that a request is not sent for every keystroke immediately.

### 8. If you wanted to combine text relevance with other ranking factors, how would you approach it?

I would create a ranking strategy that combines text relevance with business factors such as popularity, rating, sales, and stock availability.

For example, relevance could be the primary factor while popularity or rating could influence the final ranking.

With a dedicated search engine, I could implement this much more flexibly using custom scoring or boosting.

### 9. How would you handle a phrase like `"laptop under 100000 with good battery life"` using our current system? Why is this difficult?

Our current system is mainly keyword-based.

It could search for terms such as `laptop`, `battery`, and `life`, while the price condition would need to be handled separately.

The difficult part is understanding the natural-language meaning:

- `laptop` → product search
- `under 100000` → price filter
- `good battery life` → semantic/product attribute requirement

MongoDB `$text` does not naturally understand the entire sentence as structured search intent. A more advanced search or NLP system would be better for this type of query.

---

# Real-World Scenario

### 10. A product catalog grows to 5 million products. Users complain that search is becoming slow. What steps would you take?

First, I would measure the problem rather than immediately changing the technology.

I would:

1. Check query performance and MongoDB execution plans.
2. Verify that the correct text index is being used.
3. Check database CPU, memory, disk, and connection usage.
4. Look for expensive filters or sorting operations.
5. Make sure pagination and result limits are enforced.
6. Reduce unnecessary fields returned from the database.
7. Check common search queries and identify slow patterns.
8. Consider caching frequently repeated searches.
9. Review database scaling and indexing strategy.
10. If search requirements have outgrown MongoDB `$text`, evaluate Elasticsearch, OpenSearch, or MongoDB Atlas Search.

At 5 million products, the correct solution depends on actual query performance and requirements rather than the document count alone.

---

# Phase 5 Summary

Phase 5 established the foundation for product search.

The key lessons are:

- Use a text index for MongoDB `$text` search.
- Use `textScore` for relevance ranking.
- Keep search logic separate from normal catalog listing.
- Put specific `/search` routes before parameterized `/:id` routes.
- Combine keyword search with structured filters.
- Use pagination and validation.
- Understand the limitations of basic MongoDB text search.
- Move to a dedicated search solution when advanced search requirements justify it.

This foundation can later be extended into more advanced search functionality.
