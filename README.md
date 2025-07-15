This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configuration

This app has configurable authentication and payment features. You can enable/disable these features by editing `app/config.ts`:

```typescript
export const config = {
  // Authentication configuration
  auth: {
    enabled: false, // Set to true to enable login/authentication
    providers: ['google', 'github', 'discord', 'facebook'], // Available auth providers
  },
  
  // Payment configuration
  payment: {
    enabled: false, // Set to true to enable payment verification
    minimumAmount: 499, // Minimum payment amount in cents ($4.99)
  },
  
  // App configuration
  app: {
    title: 'Navigation Quiz',
    description: 'Test your knowledge of navigation concepts',
  },
};
```

### Features

- **Authentication**: When enabled, users can log in using OAuth providers (Google, GitHub, Discord, Facebook)
- **Payment Verification**: When enabled, integrates with Stripe to verify payments before allowing quiz access
- **Configurable Providers**: Choose which OAuth providers to make available
- **Flexible Settings**: Easy to toggle features on/off without code changes

### Environment Variables

If you enable authentication, you'll need:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If you enable payments, you'll also need:
- `STRIPE_SECRET_KEY`

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
