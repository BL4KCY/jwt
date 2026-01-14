# Learning Reference Guide

A quick reference document for concepts, patterns, and best practices learned while building the JWT authentication app and other projects.

---

## Express.js Fundamentals

### `app.use(express.json())`

**Purpose:** Middleware that automatically parses incoming JSON request bodies and converts them into JavaScript objects.

**What it does:**
- Intercepts all incoming requests
- Checks for `Content-Type: application/json` header
- Parses raw JSON string into JavaScript object
- Populates `req.body` with the parsed data
- Limits request size to 100kb by default (security protection)

**Example:**
```javascript
app.use(express.json());

app.post('/login', (req, res) => {
  const username = req.body.username;  // Works because of express.json()
  // ...
});
```

**Without this middleware:**
- `req.body` would be `undefined`
- You'd need to manually parse the raw stream
- Form data and other content types wouldn't be handled

**Additional Features:**
- ✅ Automatic error handling for malformed JSON (returns 400 error)
- ✅ Character encoding support (UTF-8, UTF-16, etc.)
- ✅ Customizable size limit: `express.json({ limit: '50mb' })`
- ✅ Strict mode option: `express.json({ strict: true })`

**Related Middleware:**
- `express.urlencoded()` - For form data (`application/x-www-form-urlencoded`)
- `express.text()` - For plain text
- `express.raw()` - For binary data

---

## JWT Authentication Pattern

**Flow:**
1. User sends credentials (username/password) via POST to `/login`
2. Server validates credentials and generates a JWT token
3. Server returns token to client
4. Client includes token in `Authorization: Bearer <token>` header for protected routes
5. Server verifies token before allowing access

**Key Files in Our Project:**
- `server.js` - Main API with JWT verification
- `serverAuth.js` - Authentication server (token generation)
- `.env` - Stores `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` securely

---

## Common Debugging Tips

**Problem: `req.body` is undefined in POST routes**
- Solution: Make sure `app.use(express.json())` is called BEFORE your route definitions
- Check that client is sending `Content-Type: application/json` header

**Problem: Cannot access JSON data from request**
- Ensure the middleware is registered: `app.use(express.json())`
- Verify the JSON sent by client is valid (no syntax errors)

---

## Express Best Practices

**Middleware Order Matters:**
```javascript
// ✅ CORRECT - Middleware before routes
app.use(express.json());
app.post('/login', handler);

// ❌ WRONG - Routes before middleware
app.post('/login', handler);
app.use(express.json());  // Too late!
```

**Protecting Routes with Authentication:**
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Use on protected routes
app.get('/protected-route', authenticateToken, (req, res) => {
  // Only runs if authentication passes
});
```

---

## Environment Variables & Security

**Never hardcode secrets!** Use `.env` file:
```javascript
import env from 'dotenv';
env.config({ quiet: true });

// Access via process.env
const secret = process.env.ACCESS_TOKEN_SECRET;
```

**Common secrets to store:**
- Database credentials
- JWT secrets
- API keys
- Third-party service tokens

---

## Quick Reference: Common HTTP Status Codes

| Code | Meaning | When to use |
|------|---------|------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid JSON or malformed data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but access denied |
| 404 | Not Found | Route doesn't exist |
| 500 | Server Error | Unhandled exception |

---

## Project Structure

```
jwt-app/
├── server.js           # Main API server with JWT verification
├── serverAuth.js       # Authentication server (token generation)
├── .env               # Environment variables (secrets)
├── package.json       # Dependencies & scripts
└── LEARNING_REFERENCE.md  # This file!
```

---

## Useful Commands

**Development:**
```bash
npm run dev        # Run with nodemon (auto-reload)
npm run devAuth    # Run serverAuth.js with nodemon
npm start          # Run production mode
```

**Install dependencies:**
```bash
npm install
```

---

## Date Updated
- Initial creation: 2026-01-14
- Topics covered: Express.json(), JWT basics, middleware, security

---

Feel free to add more sections as you learn new concepts!
