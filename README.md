# Transparency Fix for Blockbench

A Blockbench plugin that fixes the visibility of objects inside transparent containers.

## The Problem

Blockbench WebGL renderer has a limitation where objects inside transparent cubes are not visible.

## The Solution

This plugin adjusts the render order so inner objects render before transparent containers.

## Features

- Auto-detects transparent textures by scanning alpha values
- Name-based detection (glass, window, crystal, ice, liquid, glow, etc.)
- Geometry detection - finds cubes inside transparent containers
- Toggle on/off from View menu

## Installation

1. Download transparency_fix.js
2. In Blockbench: File - Plugins - Load Plugin from File
3. Select the downloaded file

## Usage

View - Toggle Transparency Fix

## Author

Larsonix
