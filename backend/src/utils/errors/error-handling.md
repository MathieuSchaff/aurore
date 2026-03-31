# How we handle errors in the project 🐛 (A note to my future self)

When I first looked at this, it was a bit confusing, but here is how our error system actually works!

Instead of writing `try { ... } catch (e) { return c.json(...) }` inside every single route, we decided to handle all errors in one central place. This saves a lot of time.

## 1. How to throw an error

When something goes wrong in the business logic (for example, we cannot find a product), you don't return a Hono response directly. Instead, you just `throw` one of our custom error classes.

```typescript
// Good: Just throw the error!
throw new ProductError("product_not_found");
```

Because of our `globalErrorHandler`, Hono will catch this thrown error and send it straight to our utility file.

## 2. What happens in the global error handler?

The handler receives the error but it only sees it as a basic Javascript `Error`. It doesn't know it is a `ProductError` yet.

This is why we have the `AppError` interface. We check if the error has a `code` property. If it does, we say to Typescript: "Trust me, this is an AppError".

Then, we do a magic trick. We look at `error.constructor.name`. If you threw `new ProductError()`, the name will be exactly `"ProductError"`.

```typescript
const errorName = appError.constructor.name; // "ProductError"
```

## 3. The Mapping Dictionary

Now that we know it is a `ProductError`, we use the `switch` statement to load the `productErrorMapping`.
This mapping is just a dictionary that connects our string code (`'product_not_found'`) to a real HTTP status code (`404`).

Finally, the handler takes the code, looks up the status in the mapping, and sends a nice JSON back to the frontend.

## 4. What if the error is not ours?

If the error does not have a `code`, we check if it has a `status` (maybe Hono threw it). If it does not even have a `status`, then it is an unexpected server crash (like a TypeError or a database connection fail).

In that case, we log the full ugly stack trace to our console so we can fix it, but we send a simple `500 Internal Server Error` to the user so we keep our server secure.

## Summary:

- **Do not** catch errors in the route just to send a response.
- **Do** throw custom errors (like `new HabitError('habit_not_found')`).
- The `globalErrorHandler` will catch it, read the name, find the HTTP status in the mapping, and reply for you!
