/**
 * Global Navigation Utility.
 * Allows dispatching navigation actions from outside of React components (e.g., inside Redux Sagas).
 * 
 * @module RootNavigation
 */
import { createNavigationContainerRef } from "@react-navigation/native";

/**
 * The global navigation container reference.
 * @constant navigationRef
 */
/**
 * Navigation ref value.
 * @returns {*}
 */
/**
 * Navigation ref value.
 * @returns {*}
 */
export const navigationRef = createNavigationContainerRef();

/**
 * Navigates to a specific route in the app.
 * 
 * @function navigate
 * @param {string} name - The name of the route to navigate to.
 * @param {Object} [params] - Optional parameters to pass to the route.
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/**
 * Resets the navigation state and replaces the current route stack.
 * 
 * @function resetAndNavigate
 * @param {string} name - The name of the route to navigate to.
 * @param {Object} [params] - Optional parameters to pass to the route.
 */
export function resetAndNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef?.reset({
      index: 0,
      routes: [
        {
          name: name,
          params: params,
        },
      ],
    });
  }
}

/**
 * Gets the name of the current active route.
 * 
 * @function getCurrentRoute
 * @returns {string|null} The name of the current route, or null if the navigation container is not ready.
 */
export function getCurrentRoute() {
  if (navigationRef.isReady() && navigationRef.current) {
    const currentRoute = navigationRef.current.getCurrentRoute();
    return currentRoute ? currentRoute.name : null;
  }
  return null;
}

/**
 * Gets the params of the current active route.
 * 
 * @function getCurrentRouteParams
 * @returns {Object|null} The params of the current route, or null.
 */
export function getCurrentRouteParams() {
  if (navigationRef.isReady() && navigationRef.current) {
    const currentRoute = navigationRef.current.getCurrentRoute();
    return currentRoute ? currentRoute.params : null;
  }
  return null;
}
