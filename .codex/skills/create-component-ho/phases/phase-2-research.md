# Phase 2: Research & Foundation (3 minutes)

## Design System Integration (using prefetched data)

Use the prefetched data from Phase 0 to map tokens instantly:

```typescript
const tokenMapping = {
  colors: {
    // Use prefetched colors data to map Figma values
    primary: 'semantic.primary',
    background: 'core.primary.white',
    text: 'semantic.text.grey.2',
    overlay: 'semantic.overlay.dark'
  },
  typography: {
    // Use prefetched textStyles to match Figma fonts
    heading: 'heading.large',
    body: 'para.medium',
    small: 'ui.label.small'
  }
};
```

**Fetch on-demand via Oak CLI only when needed:**
```bash
oak tokens category spacing
oak tokens category shadows
oak tokens category radii
```

### Common Token Mistakes to Avoid

```typescript
// WRONG                              // CORRECT
backgroundColor: 'colors.core...'    // backgroundColor: 'core.primary.white'
padding: 'spacing.16'                // padding: 'space.16'
textStyle: 'body.medium'             // textStyle: 'para.medium'
padding: 'space.4 space.8'           // padding: '[token(spacing.space.4) token(spacing.space.8)]'
```

### TextStyle + CSS Font Properties Conflict

NEVER mix textStyle with font CSS properties. The `textStyle` token on Text atom handles ALL font properties (fontSize, fontWeight, lineHeight, fontFamily, letterSpacing). Container styles should only handle layout, spacing, colors, and borders.

## External Research (Context7 MCP - use sparingly)

Context7 MCP consumes significant tokens. Use only when absolutely required:

- Complex component patterns (modal focus trapping, compound components)
- Advanced TypeScript (generic constraints, conditional types)
- Performance optimization (React.memo, useMemo patterns)
- Accessibility implementation (ARIA patterns, keyboard navigation)
- PandaCSS advanced features (complex responsive breakpoints)

**Token Conservation:** Try standard React/TypeScript patterns first. Use Context7 only for advanced/uncommon implementations.

**Next: Read [phase-3-assets.md](phase-3-assets.md)**
