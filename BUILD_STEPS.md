# Build Steps

## 1. Added LazyMotion at app root
- File: src/app/layout.tsx
- Imported LazyMotion and domAnimation from framer-motion.
- Wrapped Navbar, main content, and Analytics with LazyMotion to enable deferred Framer Motion feature loading.

## 2. Enabled ISR for homepage
- File: src/app/page.tsx
- Added `export const revalidate = 3600;`.

## 3. Enabled ISR and cached blog listing query
- File: src/app/blog/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and wrapped blog list Prisma query in `getPosts` with key `all-posts` and `revalidate: 3600`.
- Replaced blog card cover `<img>` with Next.js `<Image>` including explicit dimensions and sizes.

## 4. Enabled ISR and cached blog detail query
- File: src/app/blog/[slug]/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and introduced slug-based cached getter `getPostBySlug` with key pattern `post-${slug}` and `revalidate: 3600`.
- Updated `generateMetadata` and page data loading to use cached getter.
- Replaced writer avatar JSX `<img>` with Next.js `<Image>` and explicit width/height.

## 5. Enabled ISR and cached development projects listing
- File: src/app/dev-projects/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and wrapped Prisma list query in `getDevProjects` with key `all-dev-projects` and `revalidate: 3600`.

## 6. Enabled ISR and cached development project detail
- File: src/app/dev-projects/[slug]/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and introduced slug-based cached getter `getDevProjectBySlug` with key pattern `dev-project-${slug}` and `revalidate: 3600`.
- Updated metadata and page data retrieval to use cached getter.

## 7. Enabled ISR and cached content projects listing
- File: src/app/content-projects/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and wrapped Prisma list query in `getContentProjects` with key `all-content-projects` and `revalidate: 3600`.

## 8. Enabled ISR and cached skills-development listing data
- File: src/app/skills/development/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and wrapped Prisma list query in `getDevProjects` with key `all-dev-projects-skills` and `revalidate: 3600`.

## 9. Enabled ISR and cached skills-content listing data
- File: src/app/skills/content/page.tsx
- Added `export const revalidate = 3600;`.
- Added `unstable_cache` import and wrapped Prisma list query in `getContentProjects` with key `all-content-projects-skills` and `revalidate: 3600`.

## 10. Migrated template animation from motion to m
- File: src/app/template.tsx
- Replaced framer-motion import from `motion` to `m`.
- Replaced `motion.div` with `m.div`.

## 11. Migrated Reveal animation from motion to m
- File: src/components/reveal.tsx
- Replaced framer-motion import from `motion` to `m`.
- Replaced `motion.div` with `m.div`.

## 12. Migrated navbar animation from motion to m
- File: src/components/navbar.tsx
- Replaced framer-motion import from `AnimatePresence, motion` to `AnimatePresence, m`.
- Replaced `motion.span` with `m.span`.

## 13. Migrated mobile nav animation from motion to m
- File: src/components/mobile-nav.tsx
- Replaced framer-motion import from `AnimatePresence, motion` to `AnimatePresence, m`.
- Replaced `motion.div` with `m.div`.

## 14. Font loading verification
- Files checked: src/app/layout.tsx, src/app/globals.css
- Verified font loading already uses `next/font/google`.
- Verified no Google Fonts `<link rel="stylesheet">` tags or CSS `@import url(...)` font imports exist.

## 15. Above-the-fold image optimization verification
- File checked/updated: src/app/page.tsx
- Verified homepage hero images already use Next.js `<Image>` with `priority`.
- No additional above-the-fold hero image required priority updates on other public pages.

## 16. Removed explicit any lint violations in blog detail page
- File: src/app/blog/[slug]/page.tsx
- Replaced explicit `any` usage for post/comments with typed aliases (`PostBySlug`, `CommentNode`, `SerializedCommentNode`).
- Updated recursive date serialization helper to typed inputs/outputs.
- Kept behavior unchanged while satisfying `@typescript-eslint/no-explicit-any`.
