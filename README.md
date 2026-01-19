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

---

# 🔐 JWT (JSON Web Token) - Complete Learning Guide

## What is JWT?

**JWT** stands for **JSON Web Token**. It's a secure way to transmit information between a client (your browser/app) and a server.

Think of it like a **digital ID card**:
- 🎫 The server issues it (when you log in)
- 📝 It contains information about you (your username, ID, etc.)
- ✅ It's cryptographically signed (can't be forged)
- 🔒 It's tamper-proof (server can verify it's real)

---

## Why Use JWT?

| Feature | Benefit |
|---------|---------|
| **Stateless** | Server doesn't need to store session info in a database |
| **Scalable** | Works great with multiple servers/microservices |
| **Secure** | Uses cryptography to prevent tampering |
| **Self-contained** | Token carries all user info server needs |
| **Cross-platform** | Works with web, mobile, APIs, etc. |

---

## JWT Structure (The Three Parts)

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXVzdGFwaGEifQ.abc123xyz789
│                                          │                        │
└─ PART 1: Header                          └─ PART 2: Payload       └─ PART 3: Signature
```

### **PART 1: Header**
Contains information about the token type and algorithm used.

```json
{
  "alg": "HS256",    // Algorithm (HMAC with SHA-256)
  "typ": "JWT"       // Type is JWT
}
```

**Encoded in Base64:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

---

### **PART 2: Payload**
Contains the actual data (claims) about the user. This is readable but not modifiable without invalidating the signature.

```json
{
  "name": "mustapha",
  "id": 123,
  "iat": 1705238400,        // issued at (timestamp)
  "exp": 1705324800         // expires at (timestamp)
}
```

**Encoded in Base64:** `eyJuYW1lIjoibXVzdGFwaGEiLCJpZCI6MTIzfQ`

**Important:** Base64 is NOT encryption! Anyone can decode it, so don't put passwords or sensitive data in the payload.

---

### **PART 3: Signature**
This is what makes JWT secure. It's created by:
1. Taking the header + payload
2. Signing them with a SECRET (only server knows this)
3. Creating a unique signature

```
SIGNATURE = HMACSHA256(
  base64(header) + "." + base64(payload),
  SECRET_KEY
)
```

**Why this matters:**
- ✅ If someone tries to change the payload, the signature becomes invalid
- ✅ Only the server (which knows the SECRET) can create valid tokens
- ✅ Server can verify: "Did I create this token? Yes/No"

---

## JWT Flow - Step by Step

### **Step 1: User Logs In**
```
Client → Server: POST /login { username: "mustapha", password: "123456" }
```

### **Step 2: Server Validates & Creates Token**
```javascript
// Server code
const user = { name: "mustapha", id: 123 };
const secret = "my_super_secret_key";
const token = jwt.sign(user, secret);
// Returns: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXVzdGFwaGEifQ.xyz789
```

### **Step 3: Server Sends Token to Client**
```
Server → Client: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXVzdGFwaGEifQ.xyz789" }
```

### **Step 4: Client Stores Token (in localStorage, sessionStorage, or cookie)**
```javascript
// Client code (browser)
localStorage.setItem('token', token);
```

### **Step 5: Client Uses Token for Protected Routes**
```
Client → Server: GET /posts 
         Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXVzdGFwaGEifQ.xyz789
```

### **Step 6: Server Verifies Token**
```javascript
// Server code
jwt.verify(token, secret, (err, user) => {
  if (err) {
    // Token is invalid or expired
    return res.sendStatus(403);
  }
  // Token is valid! user = { name: "mustapha", id: 123 }
  req.user = user;
  next();
});
```

### **Step 7: Server Responds with Protected Data**
```
Server → Client: { posts: [...] }  // Only because token was valid!
```

---

## JWT Implementation in Our Project

### **In `serverAuth.js` - Token Generation**
```javascript
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const user = { name: req.body.username };
  
  // Create token (valid for 15 minutes)
  const token = jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }  // Optional: token expires after 15 minutes
  );
  
  res.json({ accessToken: token });
});

app.listen(4000);
```

### **In `server.js` - Token Verification**
```javascript
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  // Extract token from header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);  // No token provided
  
  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);   // Token invalid or expired
    req.user = user;                       // Attach user to request
    next();                                // Continue to route
  });
};

// Protected route
app.get('/posts', authenticateToken, (req, res) => {
  res.json({ message: `Posts for ${req.user.name}` });
});

app.listen(3000);
```

---

## Common JWT Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | No token provided | Add `Authorization: Bearer <token>` header |
| **403 Forbidden** | Token invalid/expired | Get a new token by logging in again |
| **JsonWebTokenError** | Wrong secret used | Make sure `ACCESS_TOKEN_SECRET` matches |
| **TokenExpiredError** | Token has expired | Implement refresh tokens (see below) |

---

## Access Tokens vs Refresh Tokens

### **Access Token**
- Short-lived (15 min - 1 hour)
- Used for normal API requests
- If leaked, damage is limited due to short expiry

### **Refresh Token**
- Long-lived (7 days - 1 month)
- Only used to get a new access token
- Stored securely (not in localStorage!)
- If leaked, you can revoke it on the server

**Flow:**
```
1. User logs in → Gets access token + refresh token
2. Access token expires after 15 minutes
3. Client uses refresh token to get new access token
4. User continues without re-logging in
```

---

## Security Best Practices

✅ **DO:**
- Store secrets in `.env` file
- Use HTTPS (never send tokens over plain HTTP)
- Add token expiry times
- Store refresh tokens securely (HttpOnly cookies)
- Validate tokens on every protected route

❌ **DON'T:**
- Hardcode secrets in code
- Put passwords in JWT payload
- Store tokens in localStorage (vulnerable to XSS)
- Use weak secrets
- Trust tokens without verifying signature

---

## How to Test JWT

Using the `requests.rest` file:

```
### Get a token
POST http://localhost:4000/login
Content-Type: application/json

{
  "username": "mustapha"
}

### Use the token to access protected route
GET http://localhost:3000/posts
Authorization: Bearer <paste_token_here>
```

---

---

# ⚙️ TypeScript & ts-node Guide

## What is ts-node?

**ts-node** is a **TypeScript execution engine** for Node.js. It allows you to run `.ts` (TypeScript) files directly without having to manually compile them to JavaScript first.

### **Without ts-node (Normal Flow):**
```
Write .ts file → Compile to .js (tsc command) → Run .js file (node command)
     app.ts              app.js                      node app.js
```

### **With ts-node (Direct Execution):**
```
Write .ts file → Run directly with ts-node (automatic compilation happens)
     app.ts                  ts-node app.ts
```

**In short:** ts-node = **TypeScript compiler + Node.js runner combined in one command**

---

## Why Use ts-node?

| Benefit | Explanation |
|---------|-------------|
| **Faster Development** | No manual compile step needed |
| **Type Safety** | Catches errors before runtime |
| **Less File Management** | No need to track `.js` output files |
| **Great for Scripts** | Perfect for build scripts, CLI tools, automation |
| **Development Only** | Use in dev, compile to JS for production |

---

## Installation

```bash
npm install --save-dev ts-node typescript @types/node
```

**What each package does:**
- `ts-node` - Executes TypeScript directly
- `typescript` - The TypeScript compiler
- `@types/node` - Type definitions for Node.js APIs

---

## Basic Usage

### **Run a TypeScript file directly:**
```bash
npx ts-node server.ts
```

### **With nodemon (auto-restart on file changes):**
```bash
npx nodemon --exec ts-node server.ts
```

### **Or in package.json scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node server.ts",
    "start": "ts-node server.ts",
    "build": "tsc",  // Compile to .js for production
    "prod": "node dist/server.js"  // Run compiled JS
  }
}
```

---

## How ts-node Works (Under the Hood)

1. **Read the .ts file**
2. **Check tsconfig.json** for compilation settings
3. **Compile TypeScript to JavaScript in memory** (not saved to disk)
4. **Execute the JavaScript** with Node.js
5. **Run your code** normally

```
ts-node server.ts
    ↓
Read tsconfig.json
    ↓
Compile server.ts → JavaScript (in RAM, not saved)
    ↓
Execute with Node.js
    ↓
Your app runs!
```

---

## Example: Convert Your JWT App to TypeScript

### **Before (JavaScript):**
```javascript
// server.js
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.get('/posts', (req, res) => {
  res.json({ posts: [] });
});
```

### **After (TypeScript):**
```typescript
// server.ts
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const app = express();

interface User {
  name: string;
  id?: number;
}

app.get('/posts', (req: Request, res: Response) => {
  res.json({ posts: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Key differences:**
- ✅ File extension is `.ts` instead of `.js`
- ✅ Type annotations: `(req: Request, res: Response)`
- ✅ Define interfaces for data types: `interface User { ... }`
- ✅ Catch type errors before runtime

---

## ts-node vs Regular Node

| Feature | Node.js | ts-node |
|---------|---------|---------|
| **File Type** | .js only | .ts files |
| **Compilation** | Direct execution | On-the-fly compilation |
| **Setup** | Just `node file.js` | Need tsconfig.json |
| **Speed** | Faster (pre-compiled) | Slightly slower (compiles on run) |
| **Use Case** | Production | Development/Testing |

---

## Development vs Production

### **Development (with ts-node):**
```bash
npm run dev
# Uses ts-node to run .ts files directly
# Easy to iterate and debug
```

### **Production (compiled to JS):**
```bash
npm run build      # Compiles .ts to .js
npm run prod       # Runs compiled .js files
# Faster execution, optimized code
```

**Why this matters:**
- 🚀 Development is fast and convenient
- ⚡ Production is optimized for performance
- 🔒 Type checking happens during development, not at runtime

---

## Common ts-node Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **Cannot find module** | Missing type definitions | Install `@types/packagename` |
| **tsconfig.json not found** | TypeScript config missing | Run `tsc --init` |
| **ESM errors** | Module system mismatch | Set `"module": "ESNext"` in tsconfig |
| **Slow startup** | Compilation takes time | This is normal for large projects |

---

## Quick Comparison: Your JWT App

### **Current Setup (JavaScript + nodemon):**
```bash
npm run dev
# Uses: nodemon server.js
# Runs JavaScript directly
```

### **If You Converted to TypeScript:**
```bash
npm run dev
# Uses: nodemon --exec ts-node server.ts
# Compiles TypeScript on each change, then runs
```

---

## Should You Use TypeScript?

✅ **Use TypeScript if:**
- Building a large project
- Working in a team (catch errors early)
- Want better IDE support and autocomplete
- Learning best practices

❌ **Skip TypeScript if:**
- Small quick script
- Learning basics (focus on logic first)
- Already comfortable with JavaScript

---

---

# 📦 npm Scripts: `npm run dev` vs `npm start`

## What are npm Scripts?

**npm scripts** are shortcuts defined in `package.json` that run commands without typing the full command. They're stored in the `"scripts"` section.

---

## Basic Difference

| Command | Purpose | When to Use |
|---------|---------|------------|
| `npm start` | Default production entry point | **Production/Default** - Officially designated command |
| `npm run dev` | Custom development script | **Development** - For faster iteration with auto-reload |
| `npm run build` | Custom build command | **Compilation** - Prepare code for production |

---

## `npm start`

### **What it does:**
- **Built-in npm command** (no `run` needed)
- Runs the script defined in `"start"` in package.json
- Convention: Used for production or default mode
- If no `"start"` script is defined, npm tries to run `node server.js` automatically

### **Syntax:**
```bash
npm start
# Same as: npm run start
```

### **Example in package.json:**
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## `npm run dev`

### **What it does:**
- **Custom npm command** (needs `run` keyword)
- Typically used for **development with auto-reload** (using nodemon)
- Faster iteration: changes automatically restart the server
- Not production-ready

### **Syntax:**
```bash
npm run dev
```

### **Example in package.json:**
```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

---

## Real-World Examples

### **Example 1: JavaScript App (Your JWT Project)**
```json
{
  "name": "jwt-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",          // Development: auto-restart
    "devAuth": "nodemon serverAuth.js",  // Alternate dev script
    "start": "node server.js"            // Production: no auto-restart
  },
  "dependencies": {
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

**Usage:**
```bash
npm run dev      # Development mode (auto-restart on file changes)
npm start        # Production mode (runs once)
npm run devAuth  # Run auth server in dev mode
```

---

### **Example 2: TypeScript App**
```json
{
  "name": "typescript-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",  // TypeScript dev
    "build": "tsc",                                  // Compile TS to JS
    "start": "node dist/server.js"                   // Run compiled JS
  },
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.1.11"
  }
}
```

**Usage Flow:**
```bash
npm run dev    # Development: TypeScript auto-compiles & auto-restarts
npm run build  # Compile TypeScript to JavaScript
npm start      # Production: Run compiled JavaScript
```

---

### **Example 3: Full-Stack App (Frontend + Backend)**
```json
{
  "name": "full-stack-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon server.js",
    "dev:client": "npm run dev --prefix client",
    "build": "npm run build --prefix client",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.11",
    "concurrently": "^8.2.0"
  }
}
```

**Usage:**
```bash
npm run dev    # Runs both server and client with auto-reload
npm start      # Production: runs only server
```

---

### **Example 4: React/Vue Frontend**
```json
{
  "name": "react-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",              // Vite dev server (instant HMR)
    "build": "vite build",      // Production build
    "start": "vite preview",    // Preview production build
    "lint": "eslint src"        // Custom script
  },
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## Development vs Production Workflow

### **During Development:**
```bash
npm run dev     # ← Use this
# Server runs with auto-restart
# Changes detected immediately
# Great for testing and debugging
```

### **For Production Deployment:**
```bash
npm run build   # ← Compile/optimize code
npm start       # ← Run the production build
# Server runs once
# Optimized for performance
# No auto-restart (stability)
```

---

## Common npm Scripts

| Script | Purpose | Example |
|--------|---------|---------|
| `npm start` | Run app (production) | `node server.js` |
| `npm run dev` | Run app (development) | `nodemon server.js` |
| `npm run build` | Compile/prepare code | `tsc` or `webpack` |
| `npm run test` | Run tests | `jest` or `mocha` |
| `npm run lint` | Check code quality | `eslint src` |
| `npm run deploy` | Deploy to production | Custom deploy script |

---

## Why Use Scripts Instead of Direct Commands?

✅ **Advantages of npm scripts:**
1. **Consistency** - Team members run same commands
2. **Simplicity** - Type `npm run dev` instead of `nodemon --exec ts-node src/index.ts`
3. **Portability** - Works on Windows, Mac, Linux without modification
4. **Documentation** - Scripts show what commands are available
5. **Easy Updates** - Change command in one place (package.json)

---

## Your Current JWT App Scripts

```json
{
  "scripts": {
    "dev": "nodemon server.js",      // Development mode
    "devAuth": "nodemon serverAuth.js", // Alt dev script
    "start": "node server.js"        // Production mode
  }
}
```

**How to use:**
```bash
# Development
npm run dev          # Run main server with auto-restart
npm run devAuth      # Run auth server with auto-restart

# Production
npm start            # Run main server once
```

---

## Pro Tips

### **Tip 1: Run multiple scripts in parallel**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon server.js",
    "dev:client": "npm run dev --prefix client"
  }
}
```

### **Tip 2: Pass arguments to scripts**
```bash
npm start -- --port 8000
# Passes --port 8000 to the start script
```

### **Tip 3: Environment variables**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon server.js",
    "start": "NODE_ENV=production node server.js"
  }
}
```

---

---

# 🔧 CommonJS vs ES Modules (ESM) - TypeScript Issue

## The Problem

When using TypeScript with Express and ESM, you might get this error:

```
SyntaxError: Named export 'Application' not found. The requested module 'express' is a CommonJS module, which may not support all module.exports as named exports.
```

### **Why This Happens:**

Express is a **CommonJS module**, but your `package.json` has `"type": "module"` (ESM). They don't always play nicely together.

```javascript
// ❌ WRONG - Trying to import named exports from CommonJS module
import express, { Application, Request, Response } from 'express';
const app: Application = express();

// ✅ CORRECT - Default import + type imports
import express from 'express';
import type { Request, Response } from 'express';
const app = express();
```

---

## The Solution

### **Step 1: Import express as default**
```typescript
import express from 'express';  // Not named imports!
```

### **Step 2: Use `type` imports for TypeScript types**
```typescript
import type { Request, Response } from 'express';
```

### **Step 3: Remove explicit type annotations (optional)**
```typescript
// ❌ Not needed - TypeScript infers it
const app: Application = express();

// ✅ Better - Let TypeScript infer the type
const app = express();
```

---

## Full Example

### **Before (Error):**
```typescript
import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});
```

### **After (Works):**
```typescript
import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});
```

---

## Key Points

| Concept | Explanation |
|---------|-------------|
| **CommonJS** | Old module system (uses `require()` and `module.exports`) |
| **ESM** | New module system (uses `import` and `export`) |
| **Named Import** | `import { something }` - Only works with ESM modules |
| **Default Import** | `import something` - Works with CommonJS + ESM |
| **Type Import** | `import type { Request }` - Imports only for TypeScript, removed at runtime |

---

## Why Use `type` Imports?

```typescript
import type { Request, Response } from 'express';
```

Benefits:
- ✅ Only used by TypeScript (removed from compiled JS)
- ✅ Reduces bundle size
- ✅ Makes it clear it's for type-checking only
- ✅ Avoids runtime issues

---

## tsconfig.json Settings for ESM + TypeScript

```json
{
  "compilerOptions": {
    "module": "ESNext",           // Use ESM in output
    "moduleResolution": "node",   // Resolve modules like Node.js
    "target": "ES2023",           // Target modern JavaScript
    "strict": true,               // Strict type checking
    "esModuleInterop": true,      // Better CommonJS/ESM compatibility
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## Date Updated
- Initial creation: 2026-01-14
- Topics covered: Express.json(), JWT basics, middleware, security
- **JWT Deep Dive Added:** 2026-01-14 - Complete guide from basics to implementation
- **ts-node Guide Added:** 2026-01-14 - TypeScript execution engine explained
- **npm Scripts Guide Added:** 2026-01-14 - `npm start` vs `npm run dev` with examples
- **CommonJS vs ESM Added:** 2026-01-14 - Fixed Express import error with TypeScript

---

Feel free to add more sections as you learn new concepts!
