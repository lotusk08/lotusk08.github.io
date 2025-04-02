# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Run/Test Commands

- Development server: `bash tools/run.sh` or `bundle exec jekyll s -l`
- Build: `npm run build` (includes CSS with Purgecss & JS with Rollup)
- SCSS linting: `npm run lint:scss` or `npm test`
- SCSS lint + fix: `npm run lint:scss -- --fix`
- Full site test: `bash tools/test.sh` (builds site & runs HTML validator)

## Code Style Guidelines

- Indentation: 2 spaces (defined in .editorconfig)
- Line endings: LF (Unix-style)
- SCSS: Follow stylelint-config-standard-scss with customizations
- JavaScript: Use ES modules, trailing commas disabled
- Commits: Follow conventional commits format (enforced by commitlint)
- Markdown: Use standard Jekyll frontmatter for posts/pages
- File encoding: UTF-8
- Quote style: Single quotes for JS/CSS/SCSS, double for YAML

## Project Structure

- Jekyll site with Node.js build tools
- Posts in `_posts/` directory with frontmatter
- Drafts in `_drafts/` directory
- Styles in `_sass/` directory (SCSS)
- JavaScript in `_javascript/` directory