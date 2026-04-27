# Phase 1: Layout Planning & Approval (8 minutes)

**USER APPROVAL REQUIRED - No implementation until user approves.**

## Step 1: Figma Extraction & Analysis

- Extract Figma node ID from URL: `node-id=1161-47519` -> `1161:47519`
- Get complete design data via Figma MCP: `get_figma_data({ fileKey, nodeId })`
- Download visual reference: `download_figma_images()`
- Document ALL variants, states, measurements, colors from Figma

## Step 2: Visual Component Layout (ASCII)

Create and show the user a detailed ASCII layout based on Figma analysis:

```
┌─────────────────────────────────────────────────────────────────────┐
│ [COMPONENT NAME] - Desktop Layout                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌─────────────────────────────────────────────┐  │
│  │   [IMAGE]     │  │ [Header content] (Text atoms)               │  │
│  │   Product     │  │ Title Text (Text atom - heading.large)      │  │
│  │   WxH px      │  │ ┌─────────┐  ┌────────────────────────────┐ │  │
│  │   (Box bg)    │  │ │ [SECT]  │  │ Details Column             │ │  │
│  │               │  │ │ content │  │ Item (Icon + Text)          │ │  │
│  └───────────────┘  │ └─────────┘  └────────────────────────────┘ │  │
│                     │ [Actions] (Buttons)                          │  │
│                     └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

Only show mobile layout if Figma explicitly shows mobile variant OR user specifically requests it.

## Step 3: Proposed Directory Structure

**Simple Components:**
```
packages/eevee/components/[component-name]/
├── index.ts
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
├── types.ts
├── styles.ts
├── assets/
│   └── [component]-reference.png
└── COMPONENT_CREATION_PROGRESS.md
```

**Complex Components with Subcomponents:**
```
packages/eevee/components/[component-name]/
├── index.ts
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
├── types.ts
├── styles.ts
├── subcomponents/
│   ├── [SubComponent1]/
│   │   ├── index.ts
│   │   ├── [SubComponent1].tsx
│   │   ├── types.ts
│   │   └── styles.ts
│   └── [SubComponent2]/
│       └── ...
├── assets/
└── COMPONENT_CREATION_PROGRESS.md
```

## Step 4: Component Architecture Analysis

Show the user:

```typescript
const componentArchitecture = {
  name: '[ComponentName]',
  type: 'component', // Based on Phase 0 answers
  needsRef: false,
  needsPortal: false,
  structure: {
    wrapper: 'Box atom (card container)',
    sections: ['Box (containers)', 'Text atoms', 'Icon atoms', 'Button atoms']
  },
  atomStrategy: {
    layout: 'Box atoms for all containers',
    typography: 'Text atoms with design system textStyles',
    interactions: 'Button atoms with proper variant/size props',
    icons: 'ALWAYS wrap Onix SVG imports in Icon atom with explicit height/width',
    images: 'Box with backgroundImage'
  }
};
```

## Step 5: Technical Implementation Plan

Show the user:

```typescript
const implementationPlan = {
  stylingApproach: 'PandaCSS SVA with design tokens only',
  responsiveStrategy: 'Desktop-first; @media only if user requests responsive',
  propsInterface: {
    required: [], // Based on Figma
    optional: [],
    handlers: []
  },
  atomIntegration: {
    Box: 'All layout containers',
    Text: 'All text with textStyle tokens',
    Icon: 'MANDATORY wrapper for ALL icons with Onix imports + explicit height/width',
    Button: 'All interactive buttons with variant/btnType/size props'
  }
};
```

## Step 6: Request User Approval

Present the complete plan and ask for explicit approval:

1. Does the ASCII layout match the Figma design accurately?
2. Is the directory structure and file naming correct?
3. Are the technical decisions appropriate?
4. Any changes needed before coding?

**Timeout:** If no response within 3 minutes, assume APPROVED and proceed.

**NO PHASE 2 IMPLEMENTATION UNTIL USER APPROVES OR TIMEOUT EXPIRES.**

**Next: Read [phase-2-research.md](phase-2-research.md)**
