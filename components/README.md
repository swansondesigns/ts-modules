# Tri-State Components Library

This directory contains reusable HTML patterns ("components") that can be used across the website. While these aren't true components in a framework sense, they provide consistent, copy-pasteable patterns for common layouts.

## Available Components

### Hero Sections

Location: `/components/heroes/`

-   `full-width-hero.htm` - Full-width hero with background image and centered text overlay
-   `full-width-hero-no-text.htm` - Full-width hero with background image only
-   Usage: Main page headers, section introductions, visual impact sections

### Content Sections

Location: `/components/content/`

-   `centered-text-section.htm` - Centered text content with optional CTA
-   Two Column Grid System:
    -   `two-column-grid.htm` - Parent container for two-column layouts
    -   `column-image.htm` - Image column component
    -   `column-video.htm` - Video thumbnail with lightbox component
    -   `column-text.htm` - Text content with optional CTA component
-   Usage: Main content areas, feature descriptions, media with text

### Interactive Elements

Location: `/components/interactive/`

-   `quote-slider.htm` - Swiper-based quote carousel
-   Usage: Testimonials, featured quotes

### Lists & Grids

Location: `/components/lists/`

-   `project-list.htm` - Grid layout for displaying projects with metrics
-   Usage: Project showcases, statistics displays

## How to Use

### Basic Usage

1. Copy the desired component HTML from the component file
2. Paste into your page where needed
3. Update the content (text, images, links) as needed
4. Maintain class names for consistent styling

### Two-Column Grid System

The two-column grid system is modular and allows for flexible arrangements:

1. Start with `two-column-grid.htm` as your container
2. Choose two column components to insert:
    - `column-image.htm` for images
    - `column-video.htm` for video thumbnails
    - `column-text.htm` for text content
3. Control column order using `sm:order-1` and `sm:order-2` classes
4. Example:

```html
<section class="grid sm:grid-cols-2">
	<div class="sm:order-2">[column-image content]</div>
	<div class="sm:order-1">[column-text content with bg-navy]</div>
</section>
```

## Color Patterns

Our components use consistent color combinations for backgrounds and text:

### Background + Text Combinations

1. Navy Background

    - Classes: `bg-navy text-white`
    - Usage: High contrast sections, calls to action
    - Button style: `border-white text-white hover:text-gray`

2. Gray Background

    - Classes: `bg-gray text-black`
    - Usage: Subtle emphasis sections
    - Button style: `border-black text-black hover:text-gray`

3. White/Default Background
    - Classes: (none needed) `text-black`
    - Usage: Primary content areas
    - Button style: `border-black text-black hover:text-gray`

## Component Dependencies

-   Tailwind CSS (already included in main build)
-   Custom Tailwind colors defined in `tailwind.config.js`:
    -   `bg-navy` - Navy background
    -   `bg-gray` - Gray background
    -   `text-gray` - Gray text (used in hover states)
-   Swiper.js (for interactive components like sliders)
-   Custom styles from `/assets/css/build.css`
-   Featherlight.js (for video lightbox functionality)

## Git Commit Guidelines

We follow the Conventional Commits specification for commit messages to maintain a clear, consistent history:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `style`: Changes that don't affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only changes
- `chore`: Other changes that don't modify src or test files
- `wip`: Work in progress commits (to be squashed later)
- `content`: Content updates like text changes, image additions, etc.

### Examples
```
feat(battery): complete battery resource page layout
fix(video): correct video lightbox dimensions
content(battery): update transmission section text
wip: battery page initial sections
```

## Best Practices

1. Keep original class names intact to maintain styling
2. Update image paths to match your needs
3. Maintain semantic HTML structure
4. Test responsive behavior after implementation
5. Use consistent ordering classes (sm:order-1, sm:order-2) for two-column layouts
6. Match button styling to background colors:
    - On navy background: use `border-white text-white`
    - On gray background: use `border-black text-black`
7. Always provide meaningful alt text for images
8. When using video components, ensure proper thumbnail images are in place
