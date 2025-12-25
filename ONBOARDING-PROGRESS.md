# Ayyaz-Dev-V2 Codebase Onboarding

**Started:** December 25, 2025
**Goal:** Understand every file and line of code to maintain, edit, and create new projects

---

## Progress Overview

| Phase | Status | Files | Description |
|-------|--------|-------|-------------|
| Foundation | Complete | 2/2 | Root config files |
| Phase 1 | Complete | 10/10 | Shared packages |
| Phase 2 | Complete | ~40/~40 | API (Backend) |
| Phase 3 | In Progress | 0/~20 | Admin Panel |
| Phase 4 | Not Started | 0/~15 | Public Website |

---

## Foundation (Root Config)

- [x] `turbo.json` - Monorepo orchestration
  - Tasks define commands (build, dev, lint)
  - `^` in dependsOn means "dependencies first"
  - cache, persistent, inputs, outputs options

- [x] `package.json` (root) - Workspaces and scripts
  - Scripts connect to Turborepo tasks
  - Workspaces: `apps/*` and `packages/*`
  - Uses Bun as package manager

---

## Phase 1: Shared Packages

### packages/database/ (Prisma - Data Model)

- [x] `package.json` - Package config
- [x] `prisma/schema.prisma` - **THE DATA MODEL** (most important file!)
- [x] `src/index.ts` - Exports Prisma client
- [x] `tsconfig.json` - TypeScript config

**Key Concepts to Learn:**
- Prisma schema syntax
- Models (tables)
- Relations (one-to-many, many-to-many)
- Enums

---

### packages/typescript-config/

- [ ] `package.json`
- [ ] `base.json` - Base TypeScript settings
- [ ] `nextjs.json` - Next.js specific settings
- [ ] `react-library.json` - React library settings

---

### packages/eslint-config/

- [ ] `package.json`
- [ ] Config files for linting rules

---

## Phase 2: API (Backend - NestJS)

### apps/api/ Root Files

- [ ] `package.json` - API dependencies and scripts
- [ ] `tsconfig.json` - TypeScript config
- [ ] `nest-cli.json` - NestJS CLI config
- [ ] `src/main.ts` - **Entry point** (starts the server)
- [ ] `src/app.module.ts` - **Root module** (imports all other modules)

---

### apps/api/src/modules/auth/ (Authentication)

- [ ] `auth.module.ts` - Module definition
- [ ] `auth.controller.ts` - HTTP routes (login, register)
- [ ] `auth.service.ts` - Business logic
- [ ] `dto/login.dto.ts` - Login request validation
- [ ] `dto/register.dto.ts` - Register request validation
- [ ] `guards/jwt-auth.guard.ts` - Protects routes
- [ ] `strategies/jwt.strategy.ts` - JWT validation logic
- [ ] `decorators/` - Custom decorators

**Key Concepts to Learn:**
- JWT authentication flow
- Guards (route protection)
- Strategies (Passport.js)

---

### apps/api/src/modules/projects/ (CRUD Pattern)

- [ ] `projects.module.ts` - Module definition
- [ ] `projects.controller.ts` - HTTP routes (GET, POST, PUT, DELETE)
- [ ] `projects.service.ts` - Business logic (Prisma queries)
- [ ] `dto/create-project.dto.ts` - Create validation
- [ ] `dto/update-project.dto.ts` - Update validation

**Key Concepts to Learn:**
- Controller decorators (@Get, @Post, @Put, @Delete)
- Service pattern
- DTO validation with class-validator
- Prisma queries

---

### apps/api/src/modules/ (Other Modules - Same Pattern)

- [ ] `users/` - User management
- [ ] `skills/` - Skills CRUD
- [ ] `experience/` - Experience CRUD
- [ ] `technologies/` - Technologies CRUD
- [ ] `media/` - File uploads (R2)

---

## Phase 3: Admin Panel (Next.js + Refine)

### apps/admin/ Root Files

- [ ] `package.json` - Dependencies
- [ ] `next.config.js` - Next.js config
- [ ] `tailwind.config.js` - Tailwind CSS config
- [ ] `src/app/layout.tsx` - Root layout
- [ ] `src/providers/` - Refine providers setup

---

### apps/admin/src/app/projects/ (CRUD Pages)

- [ ] `page.tsx` - List all projects
- [ ] `create/page.tsx` - Create form
- [ ] `edit/[id]/page.tsx` - Edit form
- [ ] `show/[id]/page.tsx` - View details (if exists)

**Key Concepts to Learn:**
- Refine hooks (useList, useOne, useCreate, useUpdate)
- React Hook Form
- shadcn/ui components

---

### apps/admin/src/components/

- [ ] `ui/` - shadcn/ui components (button, input, etc.)
- [ ] `multi-image-upload.tsx` - Image upload component
- [ ] Other custom components

---

## Phase 4: Public Website (Next.js)

### apps/web/ Root Files

- [ ] `package.json`
- [ ] `next.config.js`
- [ ] `tailwind.config.js`
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/page.tsx` - Homepage

---

### apps/web/app/ (Pages)

- [ ] `projects/page.tsx` - Projects list
- [ ] `projects/[slug]/page.tsx` - Project detail
- [ ] `about/page.tsx` - About page (if exists)
- [ ] Other pages

**Key Concepts to Learn:**
- Server Components (default in App Router)
- Data fetching in Server Components
- Dynamic routes ([slug])

---

## Notes & Learnings

*Add your notes here as you learn:*

### Patterns to Remember

1. **NestJS Module Pattern:**
   ```
   module.ts → imports controller + service
   controller.ts → handles HTTP routes
   service.ts → business logic + database
   dto/*.ts → request validation
   ```

2. **Refine Admin Pattern:**
   ```
   useList() → fetch list of items
   useOne() → fetch single item
   useCreate() → create new item
   useUpdate() → update existing item
   ```

3. **Next.js App Router Pattern:**
   ```
   app/page.tsx → route /
   app/projects/page.tsx → route /projects
   app/projects/[slug]/page.tsx → route /projects/:slug
   ```

---

## Questions to Ask

*Write down questions as they come up:*

1.
2.
3.

---

## Session Log

| Date | What We Covered | Time Spent |
|------|-----------------|------------|
| Dec 25, 2025 | turbo.json, root package.json | ~45 min |
| | | |
| | | |

---

*Last Updated: December 25, 2025*
