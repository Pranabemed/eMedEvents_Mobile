# Guest User Module

## Purpose
Provide a scalable, production-ready guest home architecture by separating rendering, data derivation, helpers, and modal handling.

## Features
- Guest home banner carousel
- Featured, popular, live, specialty, and free conference sections
- Profession/state requirement input panel
- Guest selection modals
- Marketplace stats and prime membership banner
- CME checklist modal integration

## Screens
- Consumed by `src/Screen/HomePage/GuestUserContent.js`

## Components
- `components/GuestHomeHeader.js`
- `components/GuestHeroSection.js`
- `components/GuestCarouselSections.js`
- `components/GuestUserCards.js`
- `components/GuestUserShimmers.js`
- `components/GuestPanels.js`
- `components/GuestSelectionModals.js`
- `components/GuestUserShared.js`

## APIs
- Guest home list API via parent container
- About Us stats API via parent container
- State list API via parent container
- Profession vault API via parent container

## Redux Flow
- Container `GuestUser.js` owns Redux requests and reducer reads
- Presentational submodule receives normalized `guest` props only

## Navigation Flow
- Search routes to `GuestSpecialitySearch`
- Conference cards route to `Statewebcast`
- Organizer actions route to `SpeakerProfile`
- Specialty and state selections route to `Globalresult` or `BrowseScreen`

## Dependencies
- React Native
- React Navigation
- Redux / React Redux
- `react-native-snap-carousel`
- `react-native-skeleton-placeholder`
- `react-native-linear-gradient`
- `react-native-safe-area-context`

## Folder Structure
```text
src/Screen/HomePage/GuestUserModule/
  README.md
  components/
  hooks/
  utils/
```

## Future Improvements
- Add unit tests for data mappers and state/result navigation helpers
- Move repeated inline modal styles into the shared style sheet
- Add typed contracts for the `guest` view-model

## Known Issues
- Upstream guest payload still uses inconsistent field names, so multiple fallback chains remain necessary
