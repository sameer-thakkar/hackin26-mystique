import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
// Import atoms for story layouts - MANDATORY
import { Box } from '../../atoms/box';
import { Text } from '../../atoms/text';
import { Icon } from '../../atoms/icon';
// Import Onix icons with verified paths
// import StarFilled from '@headout/onix/web/ui/reviews/StarFilled';

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type TStory = StoryObj<typeof meta>; // T prefix REQUIRED

export const Default: TStory = {
  args: {
    title: 'Default Component',
    variant: 'primary',
  },
};

export const AllVariants: TStory = {
  render: () => (
    // Box atom + design tokens for ALL layout
    <Box display="flex" gap="space.4" flexWrap="wrap" padding="space.8">
      {(['primary', 'secondary'] as const).map((variant) => (
        <Box
          key={variant}
          display="flex"
          flexDirection="column"
          gap="space.2"
        >
          {/* Text atom + textStyle token for ALL text */}
          <Text textStyle="ui.label.small.heavy" color="semantic.text.grey.1">
            {variant}
          </Text>
          <Component variant={variant}>
            {/* Icon wrapper MANDATORY with explicit height/width */}
            {/* <Icon height="16" width="16" svg={StarFilled} /> */}
            <Text textStyle="para.medium">Sample content</Text>
          </Component>
        </Box>
      ))}
    </Box>
  ),
};

// STORYBOOK RULES:
// 1. Use TStory type (T prefix required)
// 2. All layout with Box atoms (no div/span)
// 3. All text with Text atom + textStyle tokens
// 4. All icons wrapped in Icon component with height/width
// 5. All spacing/colors via design tokens (no inline styles)
// 6. Import component types with T prefix
