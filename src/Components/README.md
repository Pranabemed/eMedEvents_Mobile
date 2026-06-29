# Components Documentation

## Purpose
The `Components` directory houses all reusable UI building blocks for the application. These components are designed to be stateless (or manage only local UI state) and driven purely by props. This ensures they can be reused across different screens without side effects.

## Storybook Integration
We use **Storybook** for UI component development and testing. 
- Every reusable component must have a corresponding `.stories.tsx` or `.stories.js` file located in `.rnstorybook/stories/`.
- Stories should cover all visual states: `Default`, `Disabled`, `Loading`, `Error`, etc.
- To view stories on your device/emulator, run `npm run storybook:ios` or `npm run storybook:android`.

## Best Practices
- **Document with JSDoc**: Every component must include a standard JSDoc/TSDoc block explaining its purpose, props, and any specific usage notes.
- **Props Typing**: Use `prop-types` (or TypeScript interfaces) to enforce type safety on component inputs.
- **Avoid Business Logic**: Components should not contain Redux dispatches, API calls, or heavy business logic. Pass data and callbacks as props from the parent Screen or Container.
- **Styling**: Always use the colors and fonts exported from `src/Themes`.

## Adding a New Component
1. Create `YourComponent.js` in `src/Components`.
2. Add JSDoc describing what it does.
3. Use `Colorpath` and `Fonts` for styling.
4. Create `YourComponent.stories.tsx` in `.rnstorybook/stories/` defining its various states.
