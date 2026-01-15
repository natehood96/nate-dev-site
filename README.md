# Nate's Portfolio

A modern, professional portfolio site built with Next.js 14, Turborepo, and Framer Motion.

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Language:** TypeScript (strict mode)

## Project Structure

```
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App Router pages
│       │   ├── page.tsx        # Landing page
│       │   └── macro-tracker/  # Macro Tracker route
│       ├── components/         # Web-specific components
│       └── public/             # Static assets (add nate.png here)
├── packages/
│   ├── ui/                     # Shared UI components (Button, Card, etc.)
│   ├── macro-tracker/          # Macro Tracker product package
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── tailwind-config/        # Shared Tailwind configuration
│   └── typescript-config/      # Shared TypeScript configuration
└── turbo.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.15.0

### Installation

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

## Adding Your Photo

Add your photo to `apps/web/public/images/nate.png`. The Hero component is already configured to display it.

## Adding Custom Fonts (Optional)

Download fonts from [Fontshare](https://www.fontshare.com/):
- Cabinet Grotesk (display font)
- Satoshi (body font)

Place the `.woff2` files in `apps/web/public/fonts/` and update `apps/web/app/layout.tsx` to use the custom fonts from `apps/web/app/fonts.ts`.

## Adding New Projects

1. Create a new package in `packages/`:
   ```bash
   mkdir -p packages/new-project/src/components
   ```

2. Add a `package.json` following the pattern in `packages/macro-tracker/package.json`

3. Add the route in `apps/web/app/new-project/page.tsx`

4. Add a new project card in `apps/web/components/Hero.tsx`:
   ```typescript
   const projects: Project[] = [
     // ... existing projects
     {
       id: 'new-project',
       title: 'New Project',
       description: 'Description here',
       href: '/new-project',
       icon: '🚀',
       badge: 'New',
       badgeVariant: 'primary',
       gradient: 'bg-gradient-to-br from-purple-50/50 to-violet-100/30',
     },
   ];
   ```

5. Run `pnpm install` to link the new package

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build all packages
pnpm lint         # Run linting
pnpm clean        # Clean all build outputs
pnpm format       # Format code with Prettier
```

## Deployment

The site is ready for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

When prompted, set the root directory to `apps/web`.

## License

MIT
