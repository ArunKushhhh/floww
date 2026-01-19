# Floww

A powerful **web scraping workflow automation platform** built with Next.js 16. Create visual workflows to automate browser-based tasks, extract data with AI, and deliver results via webhooks.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=flat-square&logo=prisma)

## ✨ Features

### Workflow Automation

- **Visual Workflow Editor** - Drag-and-drop interface using React Flow
- **Scheduled Workflows** - Cron-based scheduling with automatic execution
- **Execution History** - Track all workflow runs with detailed logs

### Browser Automation Tasks

- **Launch Browser** - Start automated browser sessions
- **Page to HTML** - Extract HTML content from pages
- **Extract Text from Element** - Get text using CSS selectors
- **Fill Input** - Automate form filling
- **Click Element** - Simulate user clicks
- **Wait for Element** - Wait for elements to appear
- **Navigate URL** - Navigate to different pages
- **Scroll to Element** - Scroll page to specific elements

### AI & Data Processing

- **Extract Data with AI** - Use Google Gemini to intelligently extract structured data
- **Read/Add JSON Properties** - Manipulate JSON data within workflows
- **Deliver via Webhook** - Send results to external services

### Platform Features

- **User Authentication** - Secure login with Clerk
- **Credits System** - Pay-per-use billing with Stripe
- **Credentials Vault** - Securely store API keys and passwords (encrypted)
- **Analytics Dashboard** - Track workflow performance and credit usage

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **Stripe Account** (for billing features)
- **Clerk Account** (for authentication)
- **Google AI API Key** (optional, for AI extraction features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArunKushhhh/floww.git
   cd floww
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env .env.local
   ```

   Then fill in the required values (see [Environment Variables](#-environment-variables) below).

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

### Authentication (Clerk)

| Variable                                       | Description                               | Required |
| ---------------------------------------------- | ----------------------------------------- | -------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Clerk publishable key (starts with `pk_`) | ✅       |
| `CLERK_SECRET_KEY`                             | Clerk secret key (starts with `sk_`)      | ✅       |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                | Sign-in page URL                          | ✅       |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                | Sign-up page URL                          | ✅       |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Redirect URL after sign-up                | ✅       |

**Example:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/setup
```

### Database (Prisma)

| Variable       | Description                | Required |
| -------------- | -------------------------- | -------- |
| `DATABASE_URL` | Database connection string | ✅       |

**Example (SQLite - default):**

```env
DATABASE_URL="file:./prisma/dev.db"
```

### Application

| Variable               | Description                                                  | Required |
| ---------------------- | ------------------------------------------------------------ | -------- |
| `NEXT_PUBLIC_APP_URL`  | Base URL of your application                                 | ✅       |
| `API_SECRET`           | Secret key for API authentication (generate a random string) | ✅       |
| `ENCRYPTION_KEY`       | 32-byte hex key for encrypting credentials                   | ✅       |
| `NEXT_PUBLIC_DEV_MODE` | Enable development features (`true`/`false`)                 | ❌       |

**Example:**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_SECRET=your-random-api-secret-key
ENCRYPTION_KEY=your-64-character-hex-string
NEXT_PUBLIC_DEV_MODE=false
```

**To generate an encryption key:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Stripe (Payments)

| Variable                             | Description                      | Required |
| ------------------------------------ | -------------------------------- | -------- |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                | ✅       |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key           | ✅       |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret    | ✅       |
| `STRIPE_SMALL_PACK_PRICE_ID`         | Price ID for Small credits pack  | ✅       |
| `STRIPE_MEDIUM_PACK_PRICE_ID`        | Price ID for Medium credits pack | ✅       |
| `STRIPE_LARGE_PACK_PRICE_ID`         | Price ID for Large credits pack  | ✅       |

**Example:**

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_SMALL_PACK_PRICE_ID=price_xxxxx
STRIPE_MEDIUM_PACK_PRICE_ID=price_xxxxx
STRIPE_LARGE_PACK_PRICE_ID=price_xxxxx
```

> **Note:** You need to create products and prices in your Stripe dashboard, then copy the price IDs here.

---

## 📦 Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build for production                     |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint                               |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Database:** [Prisma ORM](https://www.prisma.io/) with SQLite (LibSQL adapter)
- **Authentication:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Workflow Editor:** [React Flow](https://reactflow.dev/)
- **Browser Automation:** [Puppeteer](https://pptr.dev/)
- **AI:** [Google Gemini](https://ai.google.dev/)
- **State Management:** [TanStack Query](https://tanstack.com/query)

---

## 📁 Project Structure

```
floww/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (sign-in, sign-up)
│   ├── (dashboard)/       # Dashboard pages
│   │   ├── billing/       # Billing & credits management
│   │   ├── credentials/   # Credentials vault
│   │   └── workflows/     # Workflow management
│   ├── api/               # API routes
│   │   ├── webhooks/      # Stripe webhooks
│   │   └── workflows/     # Workflow execution endpoints
│   ├── setup/             # User setup page
│   └── workflow/          # Workflow editor
├── actions/               # Server actions
│   ├── analytics/         # Analytics actions
│   ├── billing/           # Billing actions
│   ├── credentials/       # Credentials actions
│   └── workflows/         # Workflow actions
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── stripe/            # Stripe configuration
│   └── workflow/          # Workflow execution engine
├── prisma/                # Database schema & migrations
├── providers/             # React context providers
├── schemas/               # Zod validation schemas
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

---

## 💳 Credits System

Floww uses a credit-based billing system:

| Pack   | Credits | Price  |
| ------ | ------- | ------ |
| Small  | 1,000   | $9.99  |
| Medium | 5,000   | $39.99 |
| Large  | 10,000  | $69.99 |

New users receive **100 free credits** upon signup. Different tasks consume varying amounts of credits based on complexity.

---

## 🔒 Security

- **Credentials Encryption:** All stored credentials are encrypted using AES-256-GCM
- **Authentication:** Secured with Clerk's enterprise-grade auth
- **API Protection:** Internal APIs are protected with secret key validation
- **Webhook Verification:** Stripe webhooks are verified using signatures

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

If you have any questions or need help, please open an issue in the repository.
