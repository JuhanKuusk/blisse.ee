# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based e-commerce web application for Kehastuudio (Beauty Studio), featuring:
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui components
- Backend: Supabase for database and serverless functions  
- WooCommerce integration for product synchronization
- Responsive beauty/cosmetics store interface

## Development Commands

```bash
# Development server (runs on port 8080)
npm run dev

# Production build
npm run build

# Development build (includes component tagger)
npm run build:dev

# Linting
npm run lint

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Architecture Overview

### Frontend Structure
- **Main App**: `src/App.tsx` - Contains React Router setup with QueryClient provider
- **Pages**: Located in `src/pages/` 
  - `Index.tsx` - Main landing page with hero, categories, and featured products
  - `ProductSync.tsx` - Admin page for WooCommerce product synchronization
  - `NotFound.tsx` - 404 page
- **Components**: Modular React components in `src/components/`
  - Layout components: `Header.tsx`, `Footer.tsx`, `Hero.tsx`
  - Product components: `ProductCard.tsx`, `FeaturedProducts.tsx`, `Categories.tsx`
  - UI components: Full shadcn/ui component library in `src/components/ui/`
- **Integrations**: Supabase client and types in `src/integrations/supabase/`

### Backend Structure
- **Supabase Functions**: Edge functions in `supabase/functions/`
  - `sync-woocommerce-products/index.ts` - Imports products from WooCommerce API to Supabase database
- **Database**: Managed through Supabase with migrations in `supabase/migrations/`

### Styling & UI
- **Tailwind CSS** with custom beauty-themed color palette (`beauty-rose`, `beauty-coral`, `beauty-nude`, `beauty-bronze`)
- **shadcn/ui** component system with full component library
- **CSS Variables** for consistent theming across light/dark modes
- **Component aliases** configured for clean imports (`@/components`, `@/lib`, etc.)

## Key Features

### WooCommerce Integration
- Automatic product synchronization from external WooCommerce store (kehastuudio.ee)
- Serverless function handles API authentication and data transformation
- Products stored with full metadata (price, images, categories, stock, etc.)
- Admin interface at `/sync` for triggering imports

### Component System
- Built on shadcn/ui with extensive component library
- Custom beauty industry theming and color schemes  
- Responsive design with mobile-first approach
- Toast notifications and loading states

### Development Setup
- **Vite** for fast development with HMR
- **TypeScript** with strict configuration
- **ESLint** configured for React/TypeScript with unused vars disabled
- **Path aliases** for clean imports (`@/` maps to `src/`)
- **lovable-tagger** integration for development mode component tracking

## Environment Requirements

The application requires these environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

For WooCommerce sync function:
- `WOOCOMMERCE_STORE_URL` - WooCommerce store URL
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce API consumer key
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce API consumer secret
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Database Schema

Products table includes:
- Basic info: `name`, `description`, `sku`, `type`, `status`
- Pricing: `price`, `sale_price`, `regular_price`
- Inventory: `stock_quantity`  
- Media: `image_url`
- Taxonomy: `categories[]`, `tags[]` (JSON arrays)
- WooCommerce ID mapping for sync operations

## Deployment

This project is configured for deployment through Lovable platform but can be deployed anywhere that supports:
- Static React applications
- Supabase edge functions
- Environment variable configuration