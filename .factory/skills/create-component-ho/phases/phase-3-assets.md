# Phase 3: Asset Extraction & Analysis (4 minutes)

## Download Figma Assets

```typescript
await download_figma_images({
  fileKey: '[FIGMA_KEY]',
  localPath: '/path/to/component/assets',
  nodes: [
    { nodeId: '5091:13273', fileName: 'component-reference.png' }
  ]
});
```

## Read Downloaded Image for Analysis

After downloading, ALWAYS read the image to verify component accuracy:

```typescript
const figmaReference = await Read({
  file_path: '/path/to/component/assets/component-reference.png'
});

// Identify: exact colors, gradients, icon requirements, typography,
// spacing details, layout structure, overlays, background patterns
```

## Create FIGMA_ANALYSIS.md

Create comprehensive documentation in the component directory:

```markdown
# Figma Analysis - [ComponentName]

## Basic Information
- **Figma File**: [URL]
- **Node ID**: [ID]
- **Component Type**: [Type]

## Visual Analysis
### Colors Identified
- **Primary**: #[hex] -> [token-name]
- **Background**: #[hex] -> [token-name]
- **Text**: #[hex] -> [token-name]

### Typography Detected
- **Heading**: [size]px/[line-height]px -> [textStyle-token]
- **Body**: [size]px/[line-height]px -> [textStyle-token]

### Spacing & Layout
- **Padding**: [values] -> [spacing-tokens]
- **Gap**: [values] -> [spacing-tokens]
- **Border Radius**: [values] -> [radius-tokens]

### Icons Required
- **Icon 1**: [Name] -> [verified-import-path] (use `oak icons get` to verify)

## Structure Analysis
### Layout Hierarchy
Component -> Container (Box) -> Sections -> Elements

### Interactive States
- Default, Hover, Active, Disabled, Loading

## Variants Identified
### Size / Style variants from Figma

## Token Mapping Results
Colors, Typography, Spacing -> Design System tokens

## Implementation Checklist
- [ ] All colors mapped to design tokens
- [ ] All typography mapped to textStyle tokens
- [ ] All spacing mapped to spacing tokens
- [ ] All icons verified and imported correctly
- [ ] Layout structure matches Figma hierarchy
```

## Targeted Icon Searches

```bash
# ALWAYS verify icon paths with targeted searches
oak icons get Star

# If not found, search by category
oak icons list --category ui
```

## Targeted Token & TextStyle Searches

```bash
oak tokens category spacing
oak tokens get "semantic.primary"
oak tokens find "#078842"
oak styles category heading
```

**Next: Read [phase-4-implementation.md](phase-4-implementation.md)**
