# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Best Practices Reference
@/Users/crayonzgrim/.claude/skills/vercel-react-best-practices/SKILL.md

## Project Overview

Image Converting Editor - a Next.js 16 application for image format conversion and preprocessing with multi-language support.

### Key Features
- Image format conversion (JPEG, PNG, WebP, GIF, BMP, AVIF, HEIC)
- Image preprocessing filters (Grayscale, Blur, Brightness, Contrast)
- Before/After split view comparison
- Multi-file upload with carousel navigation
- Hybrid processing (client-side for standard formats, server-side for RAW/TIFF)
- Internationalization (Korean/English)

## Development Commands

```bash
# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 16.1.2 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 via PostCSS
- **State Management**: Zustand 5
- **i18n**: next-intl 4
- **Image Processing**: Sharp (server), Canvas API + heic2any (client)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Package Manager**: pnpm

## Architecture

### App Router Structure
```
app/
├── layout.tsx              # Root layout (passes through to locale)
├── page.tsx                # Redirects to default locale
├── globals.css             # Global styles + Tailwind + CSS variables
├── [locale]/
│   ├── layout.tsx          # Locale layout with i18n provider
│   └── page.tsx            # Main editor page
└── api/
    └── convert/
        └── route.ts        # Server-side image conversion API
```

### Components Structure
```
components/
├── layout/
│   ├── ThreeColumnLayout.tsx  # 3-column responsive layout (335px-1665px-335px)
│   └── Header.tsx             # App header with language switcher
├── editor/
│   ├── ImageUploader.tsx      # Drag-and-drop file upload
│   ├── ImageCarousel.tsx      # Multi-image navigation
│   ├── ImagePreview.tsx       # Before/After comparison slider
│   ├── FormatSelector.tsx     # Output format selection
│   ├── FilterPanel.tsx        # Image filter controls
│   └── DownloadButton.tsx     # Download processed image
└── ui/                        # shadcn/ui components
```

### Library Structure
```
lib/
├── store/
│   └── editor-store.ts        # Zustand store for editor state
├── image/
│   └── client-processor.ts    # Client-side image processing
└── i18n/
    ├── config.ts              # i18n configuration
    ├── request.ts             # Server request config
    └── messages/
        ├── ko.json            # Korean translations
        └── en.json            # English translations
```

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)

## Supported Image Formats

### Client-side (Browser)
| Format | Input | Output |
|--------|-------|--------|
| JPEG/JPG | ✅ | ✅ |
| PNG | ✅ | ✅ |
| WebP | ✅ | ✅ |
| GIF | ✅ | ✅ |
| BMP | ✅ | ✅ |
| AVIF | ✅ | ✅ |
| HEIC/HEIF | ✅ | ❌ |
| SVG | ✅ | ❌ |

### Server-side (Sharp)
| Format | Input | Output |
|--------|-------|--------|
| TIFF | ✅ | ✅ |
| PSD | ✅ | ❌ |

## Layout Specifications

- **Desktop (≥1024px)**: Left sidebar (335px) + Center content (1665px) + Right sidebar (335px)
- **Mobile (<1024px)**: Full-width center content, sidebars hidden
- Sidebars reserved for future ad placement

## Key Dependencies

```json
{
  "sharp": "Server-side image processing",
  "heic2any": "HEIC to JPEG conversion (client)",
  "zustand": "State management",
  "next-intl": "Internationalization",
  "react-dropzone": "Drag-and-drop file upload",
  "react-compare-slider": "Before/After comparison",
  "@radix-ui/*": "Accessible UI primitives"
}
```

## Configuration Files

- `next.config.ts` - Next.js configuration with next-intl plugin
- `tsconfig.json` - TypeScript with bundler module resolution
- `eslint.config.mjs` - ESLint 9 flat config
- `postcss.config.mjs` - PostCSS with @tailwindcss/postcss plugin
- `components.json` - shadcn/ui configuration
- `middleware.ts` - i18n routing middleware
