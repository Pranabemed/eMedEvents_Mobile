# eMedEvents Screens

This directory contains all the stateful screen components, typically grouped by feature or navigation flow.

## Documentation Rules
- **No Storybook:** Do NOT generate Storybook files for screens. Screens are stateful and often connected to Redux or Navigation context, making them unsuitable for isolated Storybook testing without complex mocking.
- **JSDoc/TSDoc:** Every screen MUST include a comprehensive JSDoc block explaining its purpose, parameters (route props), return value, and an example usage.

## Architecture
- Screens should map UI events to Redux actions or navigation events.
- Keep complex logic in custom hooks or Redux Sagas.
