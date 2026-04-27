# Phase 5: Quality & Validation (5 minutes)

## Accessibility Checklist

- [ ] ARIA attributes: `role`, `aria-label`, `aria-disabled`
- [ ] Keyboard navigation: Tab order, Enter/Space handling
- [ ] Focus management: Visible focus ring
- [ ] Screen reader: Proper announcements
- [ ] Color contrast: WCAG 2.1 AA compliance (use design tokens)

## Validation Checklist

- [ ] All Figma variants implemented
- [ ] Design tokens used (no hardcoded values)
- [ ] TypeScript types complete with T prefix
- [ ] Accessibility requirements met
- [ ] Responsive behavior correct (if applicable)
- [ ] Performance optimized (memo if needed)
- [ ] Error states handled
- [ ] All icons wrapped in Icon component with height/width
- [ ] Text atoms use textStyle tokens (no font CSS properties)
- [ ] Storybook stories follow all design system rules

## Testing Setup

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

test('renders with default props', () => {
  render(<Component>Test</Component>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('applies variants correctly', () => {
  render(<Component variant="secondary" size="lg">Test</Component>);
  // Add variant-specific assertions
});
```

## Visual Comparison

Read the downloaded Figma reference and compare with implementation:

```typescript
const figmaReference = await Read({ file_path: './assets/component-reference.png' });
// Compare: colors, spacing, typography, icon positioning, layout structure
```

**Next: Read [phase-6-feedback.md](phase-6-feedback.md)**
