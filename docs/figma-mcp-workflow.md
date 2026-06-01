# Figma MCP Workflow

## Status

- Figma plugin is connected in Codex.
- Authenticated account: `pranab.behera@emedevents.com`
- Working Figma file: `eMedEvents - Mobile App - V1 - Design Comps`
- File key: `U8XfRf57CESO8CMzdvuKxE`

## How We Generate Screens

1. Open the exact screen frame in Figma.
2. Copy the frame URL with its `node-id`.
3. Send that URL in Codex.
4. Codex pulls the frame context from Figma MCP.
5. Codex maps the layout into the matching React Native screen/component in `src/Screen/...`.
6. Codex updates styles, structure, and supporting assets.

## Important Note

Large canvas selections can time out. Use a single frame URL for best results instead of a very large page section.

## Example

Shared node URL:

`https://www.figma.com/design/U8XfRf57CESO8CMzdvuKxE/eMedEvents---Mobile-App---V1---Design-Comps?node-id=14320-24628`

Recommended next step:

- Open one target mobile screen frame inside that file.
- Send its direct frame URL.
- Mention the destination code file if you already know it.

## Suggested Mapping Format

Use this message format when you want a screen generated:

`Create this screen from Figma: <frame-url> -> src/Screen/<path>/<ScreenName>.js`
