# Themes Documentation

## Purpose
The `Themes` directory centralizes all styling constants, including colors, fonts, and image assets. This ensures a consistent look and feel across the entire application and simplifies the process of making UI-wide changes (e.g., implementing dark mode or updating brand colors).

## Responsibilities
- **`Colorpath.js`**: Defines the application's color palette and device dimensions (`Sizes`).
- **`Fonts.js`**: Maps custom font family names (like Inter) to their respective weights.
- **`Imagepath.js`**: Provides a single source of truth for all local image and icon assets requiring resolution via `require()`.

## Best Practices
- **Never hardcode colors or fonts**: Always import them from `Colorpath` and `Fonts`.
- **Use Imagepath for local assets**: Do not use `require('../Assets/Images/...')` inline within components. Add the asset to `Imagepath.js` and reference it from there.

## How to add new files
If you need to introduce a new theme category (e.g., `Metrics.js` for spacing/margins), create the file here, export the constants as an object, and document it using JSDoc.

## Naming conventions
- **Colors**: Use descriptive names indicating the color or its purpose (e.g., `primaryColor`, `Pagebg`, `yellow`).
- **Fonts**: Use the font name followed by the weight (e.g., `InterBold`).
- **Images**: Use PascalCase or camelCase indicating the visual content (e.g., `Splash`, `Logo`, `HomeUser`).
