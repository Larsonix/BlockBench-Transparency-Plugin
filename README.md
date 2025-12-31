# Transparency Fix for Blockbench

A Blockbench plugin that fixes the visibility of objects inside transparent containers (glass, windows, etc.).

## The Problem

Blockbench's WebGL renderer has a limitation where objects inside transparent cubes are not visible - they get hidden by the transparent surface due to depth sorting issues.

## The Solution

This plugin adjusts the render order of elements so that inner objects render before transparent containers, making them visible through the glass.

## Features

- **Auto-detects transparent textures** - Scans pixel alpha values to identify semi-transparent elements
- **Name-based detection** - Recognizes common naming patterns: glass, window, crystal, ice, water, liquid, glow, inner, contents, fill
- **Geometry detection** - Automatically detects if cubes are physically inside transparent containers
- **Enabled by default** - Works automatically when installed
- **Toggle on/off** - Easy to enable/disable from the View menu

## Installation

1. Download `transparency_fix.js`
2. In Blockbench: **File > Plugins > Load Plugin from File**
3. Select the downloaded file

## Usage

The plugin is enabled by default. To toggle:

**View > Toggle Transparency Fix**

## Compatibility

- Blockbench 4.0.0 and above
- Works on both Desktop and Web versions

## Notes

- This plugin only adjusts render order - it does not modify your model
- Some visual artifacts on transparent faces are a WebGL limitation and cannot be fixed
- Models will render correctly in actual game engines (Minecraft, Hytale, etc.)

## Version

2.1.0

## Author

Larsonix
