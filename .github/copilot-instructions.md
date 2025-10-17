# Tri-State Generation Website Development Guidelines

## Image Processing Standards

For comprehensive image processing standards and guidelines, see [Image Processing Documentation](copilot-prompts/image-processing.md).

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

### File Organization

-   Keep assets organized in appropriate folders
-   Use consistent naming conventions across all files
-   Maintain clean folder structure as shown in the workspace

## Commit Message Standards

This project uses the Conventional Commits format for commit messages. Follow this structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

-   **feat**: A new feature
-   **fix**: A bug fix
-   **docs**: Documentation only changes
-   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   **refactor**: A code change that neither fixes a bug nor adds a feature
-   **perf**: A code change that improves performance
-   **test**: Adding missing tests or correcting existing tests
-   **chore**: Changes to the build process or auxiliary tools and libraries

### Scope Guidelines

**Strongly encouraged:** Use a scope for all commits unless the change is truly global. Examples of scoped commits:

-   File-specific changes: Use the filename as scope (e.g., `feat(home): add hero section`)
-   Component changes: Use component name (e.g., `fix(header): correct navigation alignment`)
-   Page-specific updates: Use page name (e.g., `feat(about-us): update team photos`)

**Global commits only:** Reserve scopeless commits for truly global changes:

-   Tooling changes (e.g., `chore: update build configuration`)
-   Directory restructures (e.g., `refactor: reorganize asset folders`)
-   Project-wide dependency updates (e.g., `chore: update all dependencies`)

### Examples

-   `feat(home): add new hero component for landing pages`
-   `fix(home): correct video embed URL in cooperative section`
-   `docs(README): update deployment instructions`
-   `style(components): format CSS according to project standards`
-   `chore: update build configuration` (global - no scope needed)

## Project Context

This project contains website modules for Tri-State Generation and Transmission, including various page templates, assets, and components for their corporate website.
