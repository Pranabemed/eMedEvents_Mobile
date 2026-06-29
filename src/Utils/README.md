# Utils Documentation

## Purpose
The `Utils` directory houses helper functions, reusable logic blocks, configuration singletons, and third-party integrations (like Analytics and Push Notifications). These utilities are independent of the UI and are designed to be imported and used across multiple screens and components.

## Responsibilities
- **Data Formatting**: Normalizing phone numbers, dates, timezones.
- **Network & API**: IP Server configurations, Token management, API request interceptors.
- **Device Utilities**: Network connectivity checks, User Agent construction.
- **Third-Party Services**: Firebase Analytics, Push Notifications.

## Best Practices
- **Pure Functions**: Where possible, functions in `Helpers` should be pure (deterministic and side-effect free) to simplify testing.
- **Modularity**: Do not lump unrelated functions into a single file. Keep functions modularized (e.g., `PhoneNormalize.js` handles only phone normalization).

## How to add new files
When introducing a new helper utility, create a new `.js` file within `Helpers`. Add comprehensive JSDoc explaining the inputs, outputs, side-effects, and edge cases. Export the utility for reuse.

## Naming conventions
- **Files**: PascalCase for files exporting a class or component (e.g., `CustomFlat.tsx`). camelCase or PascalCase for standard utilities based on existing project consistency.
- **Functions**: camelCase indicating the action (e.g., `getToken`, `normalizePhone`).
