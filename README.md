This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Project Setup & Workflow

**Installation Steps:**

1. Clone the repository and install dependencies:
   ```bash
   git clone [repo-url]
   npm install
   ```

**Application Flow:**

1. The application launches at the sign-in page by default
2. **Authentication:**
   - Use one of the predefined test user accounts (credentials available upon request)
3. **Post-Login Navigation:**
   - **Regular Users:** Redirected to forms interface
   - **Admin Users:** Redirected to dashboard
4. **User Features:**
   - Complete dynamic forms with intelligent answer reuse:
   - Previously submitted responses automatically pre-populate matching questions
5. **Admin Features:**
   - Monitor and analyze user responses through dashboard metrics
   - Access comprehensive response data

---

### Database Implementation

**Schema Configuration:**

- ORM: Prisma
- Database: PostgreSQL (via [Prisma Postgres](https://www.prisma.io/postgres))
- Schema Definition: [`prisma/schema.prisma`](prisma/schema.prisma)
