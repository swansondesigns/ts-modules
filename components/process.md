# Component Usage Guide

## Core Principles

1. Components are complete, ready-to-use templates
2. Copy components exactly - do not recreate or modify structure
3. Only replace clearly marked content areas
4. Maintain all existing classes and layout structure

## Usage Process

1. Identify needed component from `/components` folder
2. Copy entire component file contents
3. Only modify content within designated replacement zones:
    ```html
    <!-- REPLACE-START: section-name -->
    Content goes here
    <!-- REPLACE-END -->
    ```
4. Keep all structural elements, classes, and spacing intact

## Common Mistakes to Avoid

-   Do not recreate components from memory
-   Do not modify layout structure or classes
-   Do not use components as "inspiration" for new layouts
-   Do not mix and match component parts

## Parameters

Each component has required parameters clearly marked at the top of its file. Always fill these in:

```html
<!-- REQUIRED PARAMETERS
title: Page title
hero-image: URL of hero image
description: Main content description
-->
```
