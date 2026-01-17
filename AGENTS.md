# Session Context & Project Memory

**Last Updated:** 2026-01-14 10:43:23

---

## 📋 Current Project: JWT Authentication App

### Project Overview
Building a JWT (JSON Web Token) authentication system with Express.js that includes:
- Token generation and verification
- Protected routes (filtering posts by authenticated user)
- Environment variable security with `.env`
- Learning documentation for future reference

### Current Status
✅ **Core features implemented:**
- `server.js` - Main API with JWT verification middleware
- `serverAuth.js` - Authentication server for token generation
- Protected `/posts` endpoint that filters by authenticated user
- JWT token validation on protected routes

### Recent Work Completed
1. ✅ Created JWT authentication flow (login → token generation → protected routes)
2. ✅ Set up `LEARNING_REFERENCE.md` with Express.js and JWT best practices
3. ✅ Established `.env` for storing secrets securely
4. ✅ Implemented `authenticateToken` middleware for route protection
5. ✅ Converted project to TypeScript (`src/serverAuth.ts`)
6. ✅ Fixed CommonJS/ESM import issues with Express
7. ✅ Created comprehensive learning guides in `LEARNING_REFERENCE.md`:
   - JWT Complete Guide (structure, flow, implementation)
   - ts-node Execution Engine
   - npm Scripts (`npm start` vs `npm run dev`)
   - CommonJS vs ESM module systems

---

## 🎯 TODO - Next Steps

- [ ] Test the API endpoints to ensure they work correctly
- [ ] Add refresh token functionality
- [ ] Improve error handling and validation
- [ ] Add user registration endpoint
- [ ] Test edge cases (expired tokens, malformed requests, etc.)

---

## 🔑 Important Decisions & Context

1. **Session Memory:** Using `AGENTS.md` to persist context across conversations
2. **Learning Documentation:** `LEARNING_REFERENCE.md` is the growing knowledge base
3. **Project Type:** Educational - learning JWT auth patterns and Express.js best practices

---

## 📝 Key Learnings to Document
- Express.js middleware order matters (middleware must come before routes)
- JWT secrets should NEVER be hardcoded
- `authenticateToken` middleware pattern for protecting routes
- HTTP status codes: 401 (unauthorized), 403 (forbidden), 200 (success)

---

## 🔗 File Structure

```
project-root/
├── server.js              # Main API server
├── serverAuth.js          # Auth server (token generation)
├── .env                   # Secrets (ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET)
├── package.json           # Dependencies
├── LEARNING_REFERENCE.md  # Growing knowledge base
├── AGENTS.md              # This file - session context
└── requests.rest          # API test requests
```

---

## 💡 Quick Reference Commands

```bash
npm run dev        # Run server.js with auto-reload
npm run devAuth    # Run serverAuth.js with auto-reload
npm start          # Production mode
npm install        # Install dependencies
```

---

## 🚀 Next Conversation Starter

When returning to this project, start by:
1. Reading this file to understand where we left off
2. Checking `LEARNING_REFERENCE.md` for any patterns or solutions
3. Then ask: "What should we work on next?"

---
