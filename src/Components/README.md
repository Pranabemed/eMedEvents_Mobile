# eMedEvents UI Components

This directory contains all the reusable, stateless UI components used throughout the application.

## Documentation Rules
- **Storybook First:** Every component in this directory must have a corresponding `.stories.tsx` or `.stories.js` file for isolated UI testing.
- **Storybook Path:** Storybook files are typically generated and linked in the `.rnstorybook/stories/` folder to maintain separation.
- **JSDoc/TSDoc:** Every component MUST include a comprehensive JSDoc block explaining its purpose, parameters, return value, and an example usage.

## Component Design
- Do not include business logic or Redux connections in these components.
- Pass data and callbacks via props.
