# API Server - Quick Start

## Start Development Server

```bash
npm run start:dev
```

This will:

1. Automatically build Prisma package (via `prestart:dev`)
2. Start NestJS in watch mode using ts-node
3. Watch for file changes and auto-reload

## Important Notes

- **Use `npm run start:dev`** - This uses `nest start --watch` which uses ts-node
- **Don't use `npm start`** - This tries to run built version (requires `npm run build` first)
- **No dist folder needed** - Watch mode compiles TypeScript on-the-fly

## Troubleshooting

### "Cannot find module dist/main"

- Make sure you're using `npm run start:dev` (not `npm start`)
- Verify nest-cli.json exists and is correct
- Check that NestJS CLI is installed: `npx nest --version`

### Prisma Import Errors

- Rebuild Prisma: `cd ../../packages/prisma && npm run build`
- Verify `packages/prisma/dist/index.js` exists

### TypeScript Errors

- Check tsconfig.json paths are correct
- Verify all dependencies are installed: `npm install`
