# Eevee Component Conventions

## Naming Conventions

- **Types**: `T` prefix (preferred): `TComponentProps`, `TBadgeProps`, `TComponentVariants`
- **Interfaces**: `I` prefix (sparingly): `IBadgeInterface`
- **Prefer types over interfaces** for better composition with `&` operator
- **Story types**: `TStory` (always T prefix)

## Import Strategy

**Inside eevee repo** - relative imports:
```typescript
import { Box } from '../../atoms/box';
import { Button } from '../../atoms/button';
import { Text } from '../../atoms/text';
import { Icon } from '../../atoms/icon';
```

**Outside eevee repo** - package imports:
```typescript
import { Box, Button, Text, Icon } from '@headout/eevee';
```

**Onix icons** - always default import:
```typescript
// CORRECT
import Cross from '@headout/onix/web/ui/cross/Cross';
// WRONG
import { Cross } from '@headout/onix/web/ui/cross/Cross';
```

## Atom Usage Rules

### Button Atom
```typescript
<Button
  as='button'           // Required
  variant='primary'     // Required: primary/secondary/tertiary
  btnType='primary'     // Required: primary/transparent/black
  size='medium'         // Required: small/medium/large
  primaryText={text}    // Required when text provided (must be string, not undefined)
  onClick={handler}
/>
```

### Text Atom
```typescript
<Text as='h2' textStyle='heading.regular' color='semantic.text.grey.2'>
  {content}
</Text>
// NEVER mix textStyle with font CSS properties (fontSize, fontWeight, lineHeight, etc.)
// textStyle handles ALL font properties automatically
```

### Icon Atom (MANDATORY for all icons)
```typescript
// ALWAYS wrap in Icon component with explicit height/width
<Icon height="16" width="16" svg={Cross} />

// NEVER use icons directly
// WRONG: <Cross />
// WRONG: <StarFilled style={{ width: '16px' }} />
```

### Box Atom
```typescript
<Box display="flex" gap="space.4" padding="space.8">
  {content}
</Box>
// Box does NOT accept refs - use <div ref={ref}> instead
```

## Design Token Rules

### Correct Token Names
```typescript
// WRONG                              CORRECT
backgroundColor: 'colors.core...'    // backgroundColor: 'core.primary.white'
padding: 'spacing.16'                // padding: 'space.16'
textStyle: 'body.medium'             // textStyle: 'para.medium'
```

### Multiple Token Values
```typescript
// Single token - no brackets:
gap: 'space.2'

// Multiple tokens - bracket syntax:
padding: '[token(spacing.space.4) token(spacing.space.8)]'

// WRONG:
padding: 'space.4 space.8'
```

### Responsive Styles
```typescript
root: {
  padding: 'space.6',          // Default
  _mobile: { padding: 'space.4' },   // @media(max-width: 768px)
  _desktop: { padding: 'space.8' }   // @media(min-width: 768px)
}
// NEVER use manual @media queries
```

## TypeScript Patterns

### RecipeVariantProps Import
```typescript
// CORRECT
import type { RecipeVariantProps } from '@headout/pixie/css';
// WRONG
import type { VariantProps } from '@headout/pixie';
```

### Type Guards for Button Props
```typescript
// Button requires primaryText to be string (not undefined)
if (!buttonText) {
  throw new Error('Button text is required');
}
// Now buttonText is guaranteed string type
```

## Portal Usage (Modals/Overlays)
```typescript
import { createPortal } from 'react-dom';
return createPortal(modalContent, document.body);
```

## Ref Handling
```typescript
// WRONG - Box does not accept refs
<Box ref={modalRef}>Content</Box>

// CORRECT - use div for refs
<div ref={modalRef}>
  <Box>Content</Box>
</div>
```

## Storybook Rules

1. Use `TStory` type (T prefix required)
2. All layout with Box atoms (no div/span)
3. All text with Text atom + textStyle tokens
4. All icons wrapped in Icon component with height/width
5. All spacing/colors via design tokens (no inline styles)
6. Import component types with T prefix

## Icon Verification

Always verify icon paths with Oak CLI before using:
```bash
oak icons get Star
# Known correct paths:
# StarFilled: '@headout/onix/web/ui/reviews/StarFilled'
# Spark: '@headout/onix/web/ui/stroke/Spark'
```
