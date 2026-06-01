# Codex Caveman Mode

Use this when you want very low token usage.

## Short Rule

If you start your message with `$`, use this style:

- read minimum files only
- avoid broad repo scans
- patch only requested files
- keep explanations short
- keep final response short
- no extra suggestions unless asked
- reuse existing code and theme patterns
- do not inspect unrelated files
- run only essential validation

## Best Prompt Format

```txt
$ Task: <what to do>
$ File: <path>
$ Keep: <logic / props / navigation / API>
$ Change: <UI / spacing / bug / text>
$ Verify: <eslint / no tests / none>
```

## Examples

```txt
$ Task: improve UI
$ File: src/Screen/CMERequirement/RequirementCard.js
$ Keep: props, logic, navigation
$ Change: spacing, shadows, hierarchy
$ Verify: eslint
```

```txt
$ Task: fix dropdown bug
$ File: src/Screen/CMERequirement/ProfessionDropdown.js
$ Keep: styles unless needed
$ Change: selection behavior only
$ Verify: none
```

## Important Limits

- `$` is not a built-in global Codex command.
- It will not automatically reduce model billing or token accounting by itself.
- It works as a team convention: if you start with `$`, I will treat it as low-token mode.
- Global installation would require changing Codex home or app-level settings outside this workspace.

## Recommended One-Line Starter

```txt
$ Caveman mode. Read minimum context. Patch only requested file. Keep answer short.
```
