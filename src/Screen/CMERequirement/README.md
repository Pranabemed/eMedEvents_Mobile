# CME Requirement Module

## Purpose
Render guest-facing CME licensure requirements with profession/state filters, requirement summaries, and API-driven course bundle recommendations.

## Features
- Profession selector
- State selector with search
- Expandable licensure requirement card
- Ordered bundle rendering that follows API sequence
- Featured and standard course card rendering
- Rating, price, and registration CTA presentation

## Screens
- `CMERequirement.js`

## Components
- `ProfessionDropdown.js`
- `RequirementCard.js`
- `CourseHorizontalList.js`

## APIs
- `GET master/states?country_id=1`
- Guest state bundle landing API triggered through `StateBundleLandingRequest`

## Redux Flow
- Screen dispatches `StateBundleLandingRequest`
- `GuestReducer.status` controls loading, success, and failure states
- `GuestReducer.StateBundleLandingResponse` provides requirement and bundle payloads

## Navigation Flow
- Entry into `CMERequirement`
- Back navigation to previous screen
- Course card navigation to `Statewebcast`
- Requirement-note links navigation to `Globalresult`

## Dependencies
- React Native
- Redux / React Redux
- React Navigation
- `react-native-render-html`
- `react-native-star-rating-widget`
- `react-native-vector-icons`
- `react-native-skeleton-placeholder`

## Folder Structure
```text
src/Screen/CMERequirement/
  CMERequirement.js
  CourseHorizontalList.js
  ProfessionDropdown.js
  RequirementCard.js
  README.md
```

## Future Improvements
- Move profession list and mapping to a shared constant file
- Replace inline fallback strings with shared localization/constants
- Add unit coverage for payload transformation helpers
- Add skeleton and empty-state visual snapshot tests

## Known Issues
- State list fetch currently logs warnings instead of showing a dedicated retry UI
- Profession list is static and must be updated manually if backend mappings change
