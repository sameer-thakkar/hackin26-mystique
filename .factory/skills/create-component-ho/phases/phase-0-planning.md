# Phase 0: Planning & Analysis (10 minutes)

**USER Q&A REQUIRED - No code until user answers all questions.**

## Step 1: Prefetch Essential Data

Run these 3 Oak CLI commands in parallel immediately:

```bash
oak styles list                    # All text styles
oak tokens category colors         # All color tokens
oak components list                # All available components/atoms
```

## Step 2: Component Nature Analysis

Ask the user ALL of these questions and wait for answers:

**1. Component Type & Behavior:**
- What type of component is this? (atom/component/layout/overlay)
- Is this a complex component with reusable sub-parts?
- Does it need refs for focus management or DOM manipulation?
- Should it render in a portal (modals, tooltips, overlays)?

**2. Interaction Patterns:**
- Does it have interactive states (hover, focus, disabled)?
- What clickable/focusable elements does it contain?
- Does it need keyboard navigation support?

**3. Layout & Responsiveness:**
- Are there mobile/desktop variants that need different layouts?
- Is this a fixed size or responsive component?
- Does it overlay other content or flow inline?

**4. Atom Dependencies:**
- What Eevee atoms should I use (Button, Text, Icon, Box)?
- Are there any special requirements for styling or behavior?

For each question, provide:
- Your suggestion based on Figma analysis
- A sensible default if no answer given

**Subcomponent Analysis (if complex):**
If component has 3+ distinct visual sections or reusable patterns, also ask:
- Which sections could be reusable subcomponents?
- Do you have separate Figma links for each subcomponent?
- Should subcomponents be exportable independently?
- What's the parent-child component hierarchy?

**Timeout:** If no response within 2 minutes, proceed with suggested defaults.

**NO PROCEEDING TO PHASE 1 UNTIL USER ANSWERS OR TIMEOUT EXPIRES.**

## Step 3: Figma Analysis (after prefetch)

1. Extract Figma node ID from URL: `node-id=5091-13273` -> `5091:13273`
2. Get complete data via Figma MCP: `get_figma_data({ fileKey, nodeId })`
3. If complex component detected: ask for subcomponent Figma URLs
4. Document ALL variants, states, measurements, colors
5. Use prefetched data to map colors/text styles instantly

## Step 4: Architecture Decisions

```typescript
const componentPlan = {
  name: 'ComponentName',
  type: 'atom' | 'component',
  variants: [], // from Figma
  sizes: [],    // from Figma
  states: [],   // from Figma
  composition: {
    wrapper: 'Box',
    content: ['Text', 'Icon'],
    conditional: ['LoadingSpinner']
  },
  props: {
    required: [],
    optional: []
  }
};

// CRITICAL: Always use Eevee atoms instead of custom implementations
const atomStrategy = {
  buttons: 'Use Button atom with proper as, variant, btnType props',
  text: 'Use Text atom with textStyle tokens',
  icons: 'ALWAYS use Icon atom wrapper with Onix icons - NEVER use icons directly. Always provide height/width props',
  layout: 'Use Box atom for containers (but NOT for refs - use div)',
  modals: 'Use createPortal from react-dom for proper layering'
};
```

## Analysis Checklist

- [ ] Prefetched via Oak CLI: Text styles, colors, components catalogs loaded
- [ ] Component type identified (atom/component/overlay)
- [ ] Ref requirements determined
- [ ] Portal requirements determined
- [ ] Eevee atom strategy planned
- [ ] Interactive patterns mapped
- [ ] Layout behavior understood
- [ ] All variants documented
- [ ] Colors mapped to tokens
- [ ] Typography mapped to textStyles
- [ ] Required icons identified
- [ ] Existing components checked for reuse

**Next: Read [phase-1-layout.md](phase-1-layout.md)**
