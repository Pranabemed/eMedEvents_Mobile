# eMedEvents React Native Mobile App

## Project Overview
eMedEvents is a comprehensive React Native mobile application designed to help medical professionals manage their CME (Continuing Medical Education) credits, explore medical events, and track certificates. It offers a seamless, cross-platform experience on both iOS and Android.

## Architecture
The application is built upon a modern React Native architecture:
- **Framework**: React Native 0.82.0
- **State Management**: Redux Toolkit & Redux Saga for asynchronous side-effects.
- **Navigation**: React Navigation (Bottom Tabs, Stack Navigator)
- **UI Components**: Custom components, Storybook integration for isolated testing, and `react-native-elements`.
- **Data Persistence**: Async Storage for secure local token and state persistence.
- **Networking**: Axios for API requests.

## Folder Structure
```text
/
├── android/            # Android native project files
├── ios/                # iOS native project files
├── docs/               # Auto-generated JSDoc documentation
├── .rnstorybook/       # Storybook UI configuration and stories
├── src/                # Main application source code
│   ├── Assets/         # Static images, fonts, and icons
│   ├── Components/     # Reusable, stateless UI components
│   ├── Navigator/      # React Navigation setup and route configs
│   ├── Redux/          # State management (Actions, Reducers, Sagas, Store)
│   ├── Screen/         # Stateful screen components grouped by feature
│   ├── Themes/         # Global styling (Colors, Fonts, Image paths)
│   └── Utils/          # Helper functions, config, and utilities
└── package.json        # Project dependencies and scripts
```

## Installation
1. **Clone the repository.**
2. **Install Node modules:**
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Install CocoaPods (iOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

## Environment Variables
Ensure you have the required `.env` configurations (if applicable) placed in the root directory before running the build. This handles API endpoints and feature flags.

## Running the App

### Running Metro Bundler
Start the Metro bundler to serve the JS bundle:
```bash
npm start
# OR to clear cache:
npm run startios
```

### Running Android
```bash
npm run android
# OR without uninstalling the old app:
npm run android-build
```

### Running iOS
```bash
npm run ios
```

## Storybook Setup
The project uses Storybook for isolated UI component development.
To run Storybook on a simulator/device:
1. Ensure the Metro bundler is running (`npm start`).
2. Run the platform-specific Storybook script:
   - **iOS:** `npm run storybook:ios`
   - **Android:** `npm run storybook:android`

## Build & Release

### Build APK (Debug/Release)
- **Debug:** `npm run debug-build`
- **Release:** `npm run release-build` (Outputs to `android/app/build/outputs/apk/release/app-release.apk`)

### Build AAB (Android App Bundle)
To build an AAB for the Play Store, run from the `android` directory:
```bash
cd android && ./gradlew bundleRelease
```

### Build IPA (iOS)
Open `ios/eMedEvents.xcworkspace` in Xcode, configure your provisioning profiles, choose "Any iOS Device (arm64)", and select **Product > Archive**.

## Running Tests
Run the Jest test suite:
```bash
npm test
```

## Linting & Formatting
Ensure code quality by running ESLint:
```bash
npm run lint
```
Formatting is handled via Prettier (`.prettierrc.js`).

## Documentation Generation (JSDoc)
To generate the HTML documentation for the project's source code:
```bash
npm run docs
```
The output will be available in the `docs/` folder.

## Available Scripts
- `npm start`: Starts Metro Bundler.
- `npm run android`: Uninstalls previous app and runs on Android.
- `npm run ios`: Runs on iOS simulator.
- `npm run lint`: Lints the codebase.
- `npm test`: Runs unit tests.
- `npm run docs`: Generates JSDoc.
- `npm run release-build`: Builds Android Release APK.

## Troubleshooting
- **Metro Bundler issues:** Run `npm run startios` to clear the cache.
- **iOS Build Failures:** Delete `ios/Pods` and `ios/Podfile.lock`, then run `pod install`.
- **Android Build Failures:** Run `cd android && ./gradlew clean`.
- **NPM Conflicts:** Always use `--legacy-peer-deps` due to the React 19 / Redux Toolkit versioning.

## Contributing Guidelines
1. Create a feature branch (`feature/your-feature`).
2. Document new functions using JSDoc.
3. Add Storybook stories for new reusable UI components.
4. Ensure `npm run lint` passes before committing.
5. Submit a PR.

## Coding Standards
- Use functional components and React Hooks.
- Centralize styling via `src/Themes`.
- Keep business logic in Redux Sagas and Utils, keeping UI components pure.
- Include JSDoc for all exported utilities and components.

## Version Information
- **App Version:** 0.0.1
- **React Native:** 0.82.0
- **React:** 19.1.1

## License
Proprietary - Do not distribute without permission.
