# AGENTS.md

## Project Overview

This repository contains website modules for Tri-State Generation and Transmission, a cooperative that provides wholesale electric power and transmission services. The project includes various page templates, assets, and components for their corporate website.

## Development Environment

### Setup Commands

-   Install dependencies: `npm install` (if using npm) or check `package.json` for package manager
-   Build CSS: Check `tailwind.config.js` and `postcss.config.js` for build process
-   The project uses Tailwind CSS for styling

### Project Structure

-   `assets/` - Static assets including images, CSS, and JavaScript
-   `components/` - Reusable website components
-   `pages/` - Individual page templates
-   `src/` - Source files including input.css for Tailwind
-   Various `.htm` files are page templates in the root

## Image Processing Standards

For comprehensive image processing standards and guidelines, see [Image Processing Documentation](.github/copilot-prompts/image-processing.md).

## Code Style Guidelines

### HTML/CSS

-   Use semantic HTML elements
-   Follow BEM methodology for CSS classes
-   Maintain consistent indentation (2 spaces)
-   Use Tailwind CSS utility classes where appropriate

### JavaScript

-   Use modern ES6+ syntax
-   Prefer const/let over var
-   Use descriptive variable names
-   Add comments for complex logic

## File Organization

-   Keep assets organized in appropriate folders
-   Use consistent naming conventions across all files
-   Maintain clean folder structure
-   Images should be optimized for web use following the processing standards referenced above

## Testing Instructions

-   Test all page templates across different screen sizes
-   Verify image optimization and loading performance
-   Check Tailwind CSS compilation if making style changes
-   Validate HTML markup for accessibility compliance

## Deployment Notes

-   This appears to be a static website project
-   Check `netlify.toml` for deployment configuration
-   Ensure all assets are properly optimized before deployment
-   Images should follow the naming and optimization standards referenced above
