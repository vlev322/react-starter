# React + TypeScript + Vite Project

This project is a modern web application built with React, TypeScript, and Vite. It features a robust architecture with Redux for state management, React Router for navigation, and a variety of UI components.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Shadcn UI components
- Authentication system
- Protected routes

## Project Structure

- `src/`
  - `components/`: Reusable React components
  - `pages/`: Page components for different routes
  - `router/`: React Router configuration
  - `state/`: Redux store and slices
  - `styles/`: Global styles
  - `api/`: API service functions
  - `types/`: TypeScript type definitions
  - `lib/`: Utility functions
  - `hooks/`: Custom React hooks

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   ```

## Available Scripts

- `pnpm run dev`: Start the development server
- `pnpm run build`: Build the production-ready app
- `pnpm run lint`: Run ESLint for code linting
- `pnpm run preview`: Preview the built app locally

## ESLint Configuration

The project uses ESLint for code linting. To enable type-aware lint rules, update the `.eslintrc.cjs` file as follows:
