# Error Explanation: "Cannot find module dist/main"

## What the Error Means

```
Error: Cannot find module 'C:\xampp\htdocs\POS\apps\api\dist\main'
```

### Translation:

- **Node.js is trying to**: Load a file at `dist/main.js`
- **But the file**: Doesn't exist
- **Why it's happening**: `nest start` (without `--watch`) expects a **built** version of your app

## The Problem

When you run `nest start` (without `--watch`), NestJS tries to:

1. Look for a compiled version in the `dist/` folder
2. Run `node dist/main.js`
3. But `dist/main.js` doesn't exist because you haven't built the app yet

## The Solution

### Option 1: Use Watch Mode (Recommended for Development)

```bash
npm run start:dev
```

This uses `nest start --watch` which:

- Uses ts-node to compile TypeScript on-the-fly
- Doesn't require a `dist/` folder
- Watches for file changes and auto-reloads

### Option 2: Build First, Then Start

```bash
npm run build    # Creates dist/ folder with compiled JavaScript
npm start        # Runs the compiled version
```

## Why This Happens

- **`nest start`** = Run compiled version (needs `dist/` folder)
- **`nest start --watch`** = Run with ts-node (no `dist/` needed)

## Fixed Configuration

I've updated `package.json` so that:

- **`npm start`** → Now uses `nest start --watch` (same as `start:dev`)
- **`npm run start:dev`** → Uses `nest start --watch`
- **`npm run start:prod`** → Uses `node dist/main` (for production)

## Quick Fix

Just use:

```bash
npm run start:dev
```

Or now you can also use:

```bash
npm start
```

Both will work the same way now! 🎉
