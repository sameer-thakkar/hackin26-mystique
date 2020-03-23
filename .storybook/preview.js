import { addParameters, addDecorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { ThemeProvider } from 'styled-components';
import { DocsPage } from '@storybook/addon-docs/blocks';
import theme from '../theme';
import 'lazysizes';

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
));

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'desktop',
  },
  docs: {
    page: ({ context }) => {
      return (
        <DocsPage
          context={context}
          propsSlot={() => {
            return null;
          }}
        />
      );
    },
  },
});
