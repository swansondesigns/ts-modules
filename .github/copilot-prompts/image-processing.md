# Image Processing for Tri-State Generation Website

Process images according to Tri-State Generation and Transmission website standards using ImageMagick commands with precise specifications.

## Task Description

Generate ImageMagick commands to resize, crop, and optimize images for web use following the project's image processing standards.

## Processing Rules

### Default Settings

-   **Crop anchor:** Center
-   **Output location:** Same folder as source
-   **Compression:** 80% quality
-   **File extension:** Maintain original extension
-   **Metadata:** Strip EXIF data (use -strip option)
-   **Processing:** Single-step operation (resize/fit and crop in one ImageMagick command)
-   **Dimensions:** REQUIRED - Must specify at least one dimension or aspect ratio

### Naming Convention

Convert filenames to kebab-case with:

-   All punctuation removed
-   Extraneous suffixes like "(1)", "(2)", etc. removed
-   File dimensions appended (WordPress style)
-   Example: "TS BigHorn REA 4804.jpg" → "ts-bighorn-rea-4804-1200x800.jpg"

### Override Commands

Commands can override defaults using natural language:

-   "crop [filename] from [position]" - overrides crop anchor (top, bottom, left, right, top-left, etc.)
-   "crop [filename] to [dimensions]" - specifies exact dimensions
-   "crop [filename] at [quality]%" - overrides compression quality
-   "save [filename] as [name]" - overrides naming convention

### Dimension Formats (REQUIRED)

-   **Exact dimensions:** "800x600", "1920x1080"
-   **Width + aspect ratio:** "800 wide video aspect" (16:9), "600 wide square"
-   **Height + aspect ratio:** "400 tall video aspect", "300px square"
-   **Single dimension:** "800px wide", "600 tall" (maintains original aspect ratio)

## Command Examples

For basic resize and crop:

```bash
magick input.jpg -resize 800x600^ -gravity center -extent 800x600 -quality 80 -strip output-800x600.jpg
```

For crop from specific position:

```bash
magick input.jpg -resize 1200x800^ -gravity northwest -extent 1200x800 -quality 80 -strip output-1200x800.jpg
```

## Project Context

This is for the Tri-State Generation and Transmission website modules project. All processed images should follow these standards for consistency across the website.

## Instructions

When given an image processing request:

1. Parse the natural language command for any overrides
2. Apply the default settings unless overridden
3. Generate the appropriate ImageMagick command
4. Use the proper naming convention for the output file
5. Include explanation of what the command does
