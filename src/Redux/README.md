# eMedEvents Redux State Management

This directory contains the global state management logic using Redux Toolkit and Redux Saga.

## Documentation Rules
- **No Storybook:** Do NOT generate Storybook files for anything in this directory.
- **JSDoc/TSDoc:** Every action, reducer, saga, selector, and store configuration file MUST include a comprehensive JSDoc block.

## Architecture
- **Actions:** Define intention to mutate state.
- **Reducers:** Handle state mutations synchronously.
- **Sagas:** Handle complex asynchronous side effects (API calls).
- **Selectors:** Provide memoized slices of state to components.
