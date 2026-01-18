# Script Type Error Fixes

## Problem
The TypeScript errors in `check-guru-classes.ts` and `test-grade-input-query.ts` are caused by:

1. **Module resolution issues**: Cannot find `@/db` and `@/db/schema`
2. **Implicit any types**: Parameters without type annotations

## Solutions

### Option 1: Add Type Annotations (Quick Fix)

For **check-guru-classes.ts**, add these type annotations:

```typescript
// Line 20 - Add type for user parameter
.leftJoin(teachers, (u: typeof users) => eq(teachers.userId, u.id))

// Line 32 - Add type for teacher parameter
.map((t: any) => ({

// Line 39 - Add type for class parameter
.map((c: any) => ({

// Line 55 - Add type for guru kelas parameter
.map((gk: any) => ({

// Line 87 - Add type for class parameter
.map((c: any) => ({
```

For **test-grade-input-query.ts**, add these type annotations:

```typescript
// Line 31 & 40 - Add type for class parameter
.map((c: any) => ({

// Line 59 - Add types for destructured parameters
.map(({ classId, subjectId, name, code, description }: any) => ({

// Lines 72, 93, 101 - Add type annotations
.map((c: any) => ({
.map((s: any) => ({
```

### Option 2: Use ts-node with Path Aliases

Install `tsx` for better TypeScript support:

```bash
npm install -D tsx
```

Run scripts with:
```bash
npx tsx scripts/check-guru-classes.ts
npx tsx scripts/test-grade-input-query.ts
```

### Option 3: Disable Strict Mode for Scripts

Create a separate `tsconfig.json` in the scripts folder:

**scripts/tsconfig.json**:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "noImplicitAny": false,
    "strict": false
  }
}
```

### Option 4: Convert to .js Files

Since these are diagnostic scripts, you could rename them to `.js` and add JSDoc comments instead.

## Recommended Approach

For temporary diagnostic scripts, **Option 1** (adding `any` types) is fastest. For production scripts, use **Option 2** with proper type definitions.
