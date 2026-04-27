# Phase 4: Implementation (15-25 minutes)

## Strategy Selection

**Simple Components:** Follow steps 1-5 for single component.
**Complex Components:** Create main component first (steps 1-5), then repeat steps 1-4 for each subcomponent, update main to use subcomponents, create compound export strategy.

Use the template files in `templates/` as starting points and refer to `reference/conventions.md` for naming and token rules.

## Step 1: Create types.ts (2-4 min)

```typescript
import type { RecipeVariantProps } from '@headout/pixie/css';
import type { componentStyles } from './styles';

export type TComponentVariants = RecipeVariantProps<typeof componentStyles>;

export type TComponentProps = {
  /** Primary content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
} & TComponentVariants & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

// NAMING: T prefix for types (preferred), I prefix for interfaces (sparingly)
```

## Step 2: Create styles.ts (5 min)

```typescript
import { sva } from '@headout/pixie/css';

export const componentStyles = sva({
  slots: ['root', 'content', 'icon'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'radii.md',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      _disabled: {
        opacity: 'opacity.50',
        cursor: 'not-allowed'
      }
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      gap: 'space.2' // Single token - no brackets needed
    }
  },
  variants: {
    variant: {
      primary: { root: { bg: 'colors.semantic.primary' } },
      secondary: { root: { bg: 'colors.semantic.secondary' } }
    },
    size: {
      sm: { root: { px: 'spacing.3', py: 'spacing.2' } },
      md: { root: { px: 'spacing.4', py: 'spacing.3' } },
      lg: { root: { px: 'spacing.6', py: 'spacing.4' } }
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});
```

**Multiple token values syntax:**
```typescript
padding: '[token(spacing.space.4) token(spacing.space.8)]' // 4px 8px
// Single tokens don't need brackets: gap: 'space.2'
```

**Responsive styles:**
```typescript
root: {
  padding: 'space.6',
  _mobile: { padding: 'space.4', flexDirection: 'column' },
  _desktop: { padding: 'space.8', flexDirection: 'row' }
}
// _mobile -> @media(max-width: 768px)
// _desktop -> @media(min-width: 768px)
```

## Step 3: Create Component.tsx (6 min)

```typescript
import React, { forwardRef, useRef } from 'react';
// Inside eevee repo: relative imports
import { Box } from '../../atoms/box';
import { Button } from '../../atoms/button';
import { Text } from '../../atoms/text';
import { Icon } from '../../atoms/icon'; // MANDATORY for ALL icons
import Cross from '@headout/onix/web/ui/cross/Cross'; // Default import
import { componentStyles } from './styles';
import type { TComponentProps } from './types';

export const Component = forwardRef<HTMLButtonElement, TComponentProps>(
  ({ children, variant, size, disabled, ...props }, ref) => {
    const styles = componentStyles({ variant, size });

    return (
      <Box className={styles.root}>
        {/* Use div for refs, NOT Box */}
        <Text as='h2' textStyle='heading.regular' color='semantic.text.grey.2'>
          {title}
        </Text>
        <Icon height="16" width="16" svg={Cross} />
        <Button
          as='button'
          variant='primary'
          btnType='primary'
          size='medium'
          primaryText={buttonText}
          onClick={handleClick}
        />
      </Box>
    );
  }
);

Component.displayName = 'Component';
```

**Critical rules:**
- `<Box ref={}>` is WRONG - Box does not accept refs. Use `<div ref={}>`.
- Icons MUST be wrapped: `<Icon height="16" width="16" svg={Cross} />`
- Button requires: `as`, `variant`, `btnType`, `size`, `primaryText` (must be string, not undefined)
- Use `createPortal` from `react-dom` for modals/overlays

## Step 4: Create index.ts (1 min)

```typescript
export { Component } from './Component';
export type { TComponentProps } from './types';
export { componentStyles } from './styles';
```

## Step 5: Create Component.stories.tsx (3 min)

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
import { Box } from '../../atoms/box';
import { Text } from '../../atoms/text';
import { Icon } from '../../atoms/icon';
import StarFilled from '@headout/onix/web/ui/reviews/StarFilled';

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component,
  parameters: { layout: 'centered' },
};

export default meta;
type TStory = StoryObj<typeof meta>; // T prefix required

export const Default: TStory = {
  args: { title: 'Default Component', variant: 'primary' }
};

export const AllVariants: TStory = {
  render: () => (
    <Box display="flex" gap="space.4" flexWrap="wrap" padding="space.8">
      {(['primary', 'secondary'] as const).map(variant =>
        <Box key={variant} display="flex" flexDirection="column" gap="space.2">
          <Text textStyle="ui.label.small.heavy" color="semantic.text.grey.1">
            {variant}
          </Text>
          <Component variant={variant}>
            <Icon height="16" width="16" svg={StarFilled} />
            <Text textStyle="para.medium">Sample content</Text>
          </Component>
        </Box>
      )}
    </Box>
  )
};
```

**Storybook rules:**
- Use `TStory` type (T prefix required)
- All layout with Box atoms (no div/span)
- All text with Text atom + textStyle tokens
- All icons wrapped in Icon component with height/width
- All spacing/colors via design tokens (no inline styles)

**Next: Read [phase-5-quality.md](phase-5-quality.md)**
