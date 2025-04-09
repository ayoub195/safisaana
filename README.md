# Safisaana

A modern e-commerce platform built with Next.js, Firebase, and IntaSend payment integration.

## Features

- Product management with drag-and-drop image ordering
- Course management system
- Secure payment processing with IntaSend
- User authentication with Firebase
- Responsive design

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ayoub195/safisaana.git
cd safisaana
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY=your_intasend_publishable_key
INTASEND_SECRET_KEY=your_intasend_secret_key
NEXT_PUBLIC_APP_URL=your_app_url
```

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

Make sure to set up these environment variables in your deployment platform:

- `NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY`: Your IntaSend publishable key
- `INTASEND_SECRET_KEY`: Your IntaSend secret key
- `NEXT_PUBLIC_APP_URL`: Your application URL (e.g., https://your-domain.com)

## Deployment

This project is designed to be deployed on Vercel or similar platforms that support Next.js applications.

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
