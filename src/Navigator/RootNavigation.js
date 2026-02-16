import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

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

export function getCurrentRoute() {
  if (navigationRef.isReady() && navigationRef.current) {
    const currentRoute = navigationRef.current.getCurrentRoute();
    return currentRoute ? currentRoute.name : null;
  }
  return null;
}
