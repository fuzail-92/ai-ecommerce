# Coding Standards

These are the coding rules we will follow in the AI E-Commerce project. The main goal is to keep the code clean, readable, secure, and easy to maintain.

## 1. File Naming

We will use clear and consistent names for files.

For backend files, we will use names like:

- `products.routes.js`
- `products.controller.js`
- `products.service.js`
- `products.model.js`

File names should clearly describe their purpose.

## 2. Variables and Functions

We will use `camelCase` for variables and functions.

Examples:

```javascript
const userEmail = "test@example.com";
const productPrice = 100;

function createOrder() {}
function getUser() {}
```

Constants will use `UPPER_SNAKE_CASE`.

Example:

```javascript
const MAX_RETRY_COUNT = 3;
```

We will use meaningful names instead of unclear names like `x`, `data`, or `temp` when a more specific name is possible.

## 3. Async and Error Handling

We will use `async/await` for asynchronous operations.

Errors should always be handled properly. We should not ignore errors silently.

We will use `try/catch` where appropriate and use centralized error handling in the backend when possible.

Functions should return or throw errors clearly so that problems can be handled correctly.

## 4. Security

We will never hardcode passwords, API keys, tokens, or other secrets in the source code.

Secret values will be stored in environment variables.

We will also validate data received from users and never blindly trust frontend input.

Sensitive files such as `.env` must not be committed to Git.

## 5. Comments

Comments should explain why something is done when the reason is not obvious.

We should avoid comments that simply repeat what the code already says.

For example, instead of explaining obvious code, comments should explain important business decisions or unusual behavior.

## General Rule

Code should be simple, readable, and easy for another developer to understand.

We should keep functions focused on one main task and use consistent naming and formatting throughout the project.
