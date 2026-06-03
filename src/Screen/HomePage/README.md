# HomePage Module

## Purpose
Hosts guest browsing, discovery, filtering, and home landing screens for the app.

## Features
- Guest home experience
- Search and browse flows
- CME conference discovery
- State and specialty exploration

## Screens
- `GuestUser.js`
- `GuestUserView.js`
- `GuestUserContent.js`
- Other HomePage screens remain in this folder

## Components
- `GuestUserModule/*`
- `GuestUser.styles.js`

## APIs
- Guest home list
- About Us stats
- State listing
- Additional search/browse APIs consumed by sibling screens

## Redux Flow
- `GuestUser.js` orchestrates guest home Redux requests
- Child GuestUserModule components remain presentational

## Navigation Flow
- Guest home routes into search, browse, webinar detail, membership, and organizer profile screens

## Dependencies
- React Native
- React Navigation
- Redux / Redux Saga

## Folder Structure
```text
src/Screen/HomePage/
  GuestUser.js
  GuestUserView.js
  GuestUserContent.js
  GuestUser.styles.js
  GuestUserModule/
  ...
```

## Future Improvements
- Extend module-level documentation to other HomePage screens
- Add tests for the extracted GuestUser submodule

## Known Issues
- Only the GuestUser submodule is fully documented in this pass
