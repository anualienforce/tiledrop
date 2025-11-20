# Overview

This is a publication-ready, mobile-first puzzle game built with React, TypeScript, and Express. The game features a color-matching tile drop mechanic similar to games like 2048 or Threes, where players drop numbered tiles into a grid and match them to score points. The application includes power-ups, combo multipliers, daily challenges, a progressive difficulty system, and comprehensive publication features.

The project uses a full-stack architecture with:
- **Frontend**: React with Vite for fast development and optimized builds
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL (via Drizzle ORM and Neon serverless)
- **Styling**: Tailwind CSS with a custom design system based on Radix UI components
- **State Management**: Zustand for game state and audio management
- **UI/UX**: Lucide React icons for professional iconography

# Recent Changes (Publication Readiness - Oct 1, 2025)

**Publication Features Implemented:**
1. **TP GAMES Splash Screen**: Professional branded splash screen displaying "TP GAMES" logo with gradient animations on every app load (2.5 second duration with smooth fade transition)
2. **Game Branding**: Added "TileDrop" title with gradient styling in top button bar
3. **How to Play Modal**: Comprehensive instructions covering rules, power-ups, combos, and pro tips
4. **Welcome Screen**: First-visit experience with game introduction and quick tutorial option
5. **Pause Functionality**: Pause/resume game with dedicated button and overlay
6. **Settings Menu**: 
   - Audio toggle with visual indicators
   - Accessibility settings (color-blind mode, high contrast, reduced motion)
   - Statistics reset functionality
   - Welcome screen reset option
   - Game version and about information
7. **Share Score Feature**: 
   - Web Share API integration for mobile
   - Clipboard fallback for desktop
   - Formatted score sharing with combo stats
8. **Particle Effects**: Component ready for tile clearing animations (prepared for future enhancement)
9. **Error Handling**: 
   - localStorage access wrapped in try-catch blocks
   - Audio initialization with graceful fallbacks
   - Game continues functioning even if storage/audio fails
10. **UI Improvements**:
   - Professional button bar with icon buttons
   - High score display in score card
   - Enhanced game-over modal with share button
   - Smooth animations and transitions throughout
11. **Accessibility Features** (Oct 1, 2025):
   - **Color-Blind Mode**: Adds unique symbols (●, ■, ▲, ★, etc.) to each tile number for better differentiation
   - **High Contrast Mode**: Black/white color scheme with bold borders for improved visibility
   - **Reduced Motion**: Disables all animations and transitions for users sensitive to motion
   - **Screen Reader Support**: Comprehensive ARIA labels and semantic HTML throughout the app
   - **Keyboard Navigation**: Accessible buttons and interactive elements with proper focus states
   - **Live Regions**: Score updates and game state changes announced to screen readers
   - Settings persisted in localStorage for user convenience

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Component Structure**: The application follows a component-based architecture with clear separation of concerns:
- `App.tsx` serves as the main game container, orchestrating game logic through custom hooks
- Game-specific components (`GameBoard`, `HUD`, `PowerUps`, `GameOver`, `Tile`) handle individual UI responsibilities
- Publication-ready components:
  - `SplashScreen`: TP GAMES branded splash screen shown on every app load
  - `HowToPlay`: Modal with comprehensive game instructions
  - `WelcomeScreen`: First-visit onboarding experience
  - `Settings`: Game settings and data management
  - `Particles`: Visual effects component for tile clearing
- A comprehensive UI component library built on Radix UI primitives provides reusable, accessible components

**State Management**: Uses Zustand with middleware for reactive state management:
- `useGame` hook manages game phase state (ready, playing, ended)
- `useAudio` hook controls sound effects and background music with mute functionality
- Game logic state (grid, score, tiles, power-ups) is managed in the custom `useGame` hook in `App.tsx`

**Styling Approach**: Combines Tailwind CSS utility classes with custom CSS:
- Tailwind configured with a custom theme extending HSL-based color variables
- Game-specific styles in `game.css` with gradient backgrounds and animations
- Responsive design with mobile-first breakpoints

**Rationale**: This architecture provides excellent developer experience with hot module replacement, type safety throughout, and separation of concerns. The component library approach ensures consistency and accessibility.

## Backend Architecture

**Server Framework**: Express.js with TypeScript in ESM module format
- Middleware for JSON parsing, URL encoding, and request logging
- Error handling middleware for consistent error responses
- Custom logging system with timestamp formatting

**API Design**: RESTful API structure with `/api` prefix
- Routes registered through `registerRoutes` function
- HTTP server creation integrated with route registration
- Prepared for CRUD operations through storage interface

**Development vs Production**: Environment-aware setup
- Vite dev server integration in development mode with HMR
- Static file serving for production builds
- Separate build processes for client and server

**Rationale**: Express provides a lightweight, flexible foundation. The TypeScript ESM approach ensures modern JavaScript features and type safety. The storage abstraction allows easy switching between in-memory and database storage.

## Data Storage

**ORM**: Drizzle ORM with PostgreSQL dialect
- Type-safe schema definitions in `shared/schema.ts`
- Zod integration for runtime validation
- Migration support through drizzle-kit

**Database**: Neon serverless PostgreSQL
- Connection via `DATABASE_URL` environment variable
- Currently includes a `users` table with basic authentication fields

**Storage Abstraction**: Interface-based design pattern
- `IStorage` interface defines CRUD methods
- `MemStorage` class provides in-memory implementation for development
- Easy to swap for database implementation without changing application code

**Rationale**: Drizzle provides excellent TypeScript integration and developer experience. The storage interface pattern allows development without database dependency while maintaining production-ready architecture. Neon serverless provides scalable PostgreSQL without infrastructure management.

## External Dependencies

**UI Component Library**: Radix UI
- Accessible, unstyled primitives for complex components
- Includes accordion, dialog, dropdown, popover, tabs, and 30+ other components
- Provides keyboard navigation and ARIA compliance out of the box

**Database Service**: Neon Serverless PostgreSQL
- Serverless PostgreSQL with HTTP and WebSocket support
- Accessed via `@neondatabase/serverless` driver
- Configured through `DATABASE_URL` environment variable

**Build Tools**:
- Vite for frontend bundling with React plugin and GLSL shader support
- esbuild for server bundling in production
- TypeScript compiler for type checking

**3D Graphics** (imported but not currently used in main game):
- React Three Fiber for 3D rendering
- Three.js Drei helper library
- Post-processing effects library

**Development Tools**:
- `@replit/vite-plugin-runtime-error-modal` for better error display
- `tsx` for running TypeScript in development
- Hot Module Replacement (HMR) via Vite

**Styling Dependencies**:
- Tailwind CSS with PostCSS and Autoprefixer
- `class-variance-authority` for component variants
- `clsx` and `tailwind-merge` for conditional class merging

**State & Data**:
- Zustand for lightweight state management
- TanStack React Query for server state management
- Zod for schema validation

**Session Management**: 
- `connect-pg-simple` for PostgreSQL session storage (imported but not yet implemented)

**Rationale**: These dependencies provide a modern, type-safe development experience. Radix UI ensures accessibility without restricting design freedom. The tooling choices prioritize developer experience and performance. The 3D libraries suggest potential for enhanced visual features in future updates.