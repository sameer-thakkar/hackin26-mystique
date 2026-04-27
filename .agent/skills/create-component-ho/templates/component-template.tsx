import React, { forwardRef } from 'react';
// Inside eevee repo: use relative imports
import { Box } from '../../atoms/box';
import { Button } from '../../atoms/button';
import { Text } from '../../atoms/text';
import { Icon } from '../../atoms/icon'; // MANDATORY for ALL icons
// Onix icons - always use default import, verify paths with `oak icons get`
// import Cross from '@headout/onix/web/ui/cross/Cross';
import { componentStyles } from './styles';
import type { TComponentProps } from './types';

export const Component = forwardRef<HTMLButtonElement, TComponentProps>(
  ({ children, variant, size, disabled, ...props }, ref) => {
    const styles = componentStyles({ variant, size });

    return (
      <Box className={styles.root}>
        {/* Text atom with textStyle token - handles ALL typography */}
        <Text as="h2" textStyle="heading.regular" color="semantic.text.grey.2">
          {/* title */}
        </Text>

        {/* Icon MUST be wrapped in Icon component with explicit height/width */}
        {/* <Icon height="16" width="16" svg={Cross} /> */}

        {/* Button atom with required props */}
        {/* <Button
          as='button'
          variant='primary'
          btnType='primary'
          size='medium'
          primaryText={buttonText} // Must be string, not undefined
          onClick={handleClick}
        /> */}
      </Box>
    );
  }
);

Component.displayName = 'Component';

// CRITICAL RULES:
// - Box does NOT accept refs -> use <div ref={ref}> instead
// - Icons MUST be wrapped: <Icon height="16" width="16" svg={IconSvg} />
// - Button requires: as, variant, btnType, size, primaryText (string)
// - Use createPortal from 'react-dom' for modals/overlays
// - Outside eevee repo: import { Box, Button, Text, Icon } from '@headout/eevee'
