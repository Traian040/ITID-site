# TUCN AI Resources
A small static site for AI resources at TUCN, guides and quick links. Provides a lightweight hub of applications, articles and shared assets intended for students, faculty and staff.


[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)](https://sorigh.github.io/TUCN-Resources/)

## Summary
- Multi-page static site built with Vite.
- Pages include: index, applications, digital services, blog, multiple resources/articles.
- Header/footer fragment that can be easily reused and is loaded dynamically using JavaScript.
- Other pages link to external resources, mainly [ITID UTCN](https://itid.utcluj.ro/).
- Designed for GitHub Pages deployment under the repo path `/TUCN-Resources/`.
- Responsive layout with simple interactive behaviour (mobile menu, banner show/hide), scroll animations.

## Contents
- This repo serves as the contents of the `dist/` folder of the main project, used to deploy it using GitHub Pages.
- index.html, applications.html, resources-*.html, blog.html, etc. are the top-level pages.
- CSS site styles (modular sections, global variables) and JS scripts (page behaviour, AOS initialisation and dynamic header/footer loader) were loaded using the dst folder after npm run build.
- public/header.html, public/footer.html — header/footer fragments and public assets copied to dist.

## Technologies Used
- **Vite** — Bundler and dev server  
- **Vanilla JavaScript (ES Modules)** — Dynamic header/footer, page interactions  
- **CSS** — Modular styles and global variables  
- **AOS (Animate On Scroll)** — Scroll animations  
- **GitHub Pages** — Static hosting

## Quick start
### 1. Install
  -  `npm install`

### 2. Dev
 -  `npm run dev`
 - open ``http://localhost:<port>``

### 3. Build & preview
- `npm run build`
- `npm run preview`
- open ``http://localhost:<port>/<page>.html``

## Reach & usage
- Intended to be a low-bandwidth, easily editable resource portal for UTCN community members.
- Deployable to GitHub Pages and preview locally with Vite.
