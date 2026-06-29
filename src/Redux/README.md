# Redux Documentation

## Architecture Overview
This application uses `@reduxjs/toolkit` for state management and `redux-saga` for handling asynchronous side effects (such as API calls).

## Folder Structure
- **`/Reducers`**: Contains Redux Toolkit slices/reducers. Each reducer manages a specific slice of the global state (e.g., Auth, Dashboard, Profile).
- **`/Saga`**: Contains generator functions (Sagas) that listen for specific Redux actions, execute async tasks, and dispatch success/failure actions.
- **`Store.js`**: The central configuration file that initializes the Redux store, combines reducers, and attaches middleware.

## Data Flow
1. **Component**: Dispatches an action (e.g., `dispatch(loginRequest(credentials))`).
2. **Saga**: Intercepts the action, makes an API call using utilities like `ApiRequest`.
3. **Saga (Success/Error)**: Yields a new action (e.g., `put(loginSuccess(data))` or `put(loginFailure(error))`).
4. **Reducer**: Listens for the success/failure action and updates the state.
5. **Component**: Re-renders based on the new state mapped from the store.

## Best Practices
- **Do not modify state directly**: Always return a new state object or rely on Redux Toolkit's built-in Immer.js for mutating draft state.
- **Keep Sagas pure**: Sagas should yield declarative effects (`call`, `put`, `select`) to remain easily testable.
- **Error Handling**: Every Saga making an API call must include a `try/catch` block and dispatch a failure action if it catches an error.
