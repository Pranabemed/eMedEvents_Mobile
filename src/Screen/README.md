# Screens Documentation

## Purpose
The `Screen` directory contains all the main top-level views/pages of the application. These components are typically stateful, connected to Redux, and orchestrate navigation, API calls, and local UI logic.

## Folder Structure
Screens are logically grouped by feature/domain:
- **`Auth/`**: Login, Signup, Forgot Password flows.
- **`Dashboard/`**: Main authenticated landing pages.
- **`Profile/`**: User settings and profile management.
- **`HomePage/`**: Unauthenticated and Guest user experiences.
- **`CMERequirement/`**: Workflows regarding CME state tracking.
- And various other specialized modules.

## Architecture & Best Practices
- **Separation of Concerns**: Screens should orchestrate data flow but avoid heavy UI rendering inside a single file. Complex UI elements within a screen should be extracted to `src/Components`.
- **Redux Integration**: Use `useSelector` and `useDispatch` to interact with global state. Do not use local state (`useState`) for data that needs to persist across screens.
- **Navigation**: Access navigation parameters via `route.params`. Navigate using the `navigation` prop passed by React Navigation.

## Documentation Standard
Every screen component includes a JSDoc block identifying it as a component, defining its accepted props (if any), and explaining its role in the application flow.
