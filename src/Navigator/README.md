# Navigation Documentation

## Architecture Overview
The application's navigation is built using React Navigation (`@react-navigation/native`). It defines the screen hierarchy and flow transitions.

## Folder Structure
- **`RootNavigation.js`**: Provides global helper methods (`navigate`, `resetAndNavigate`) allowing navigation actions to be triggered outside of the component tree, such as from Redux Sagas or utility files.
- **`StackNav.js`**: Defines the main Stack Navigator. Contains the configuration for various screen transitions, header settings, and route registrations.
- **`TabNav.js`**: Defines the Bottom Tab Navigator, which controls the main sections of the app (e.g., Home, Vault, Profile).

## Best Practices
- **Never mutate route params**: Treat route params as immutable.
- **Use RootNavigation sparingly**: Prefer the `useNavigation()` hook inside React components. Only use `RootNavigation` when you absolutely must navigate from a non-React context (like a Saga responding to a 401 Unauthorized error).
- **Type Checking**: Ensure all routes and parameters are strongly typed if using TypeScript.

## Navigation Flow
The standard flow typically initializes at a Splash Screen, determines authentication state via a Redux token check, and then swaps the root stack between an Auth Flow (Login/Register) and an App Flow (TabNav inside StackNav).
