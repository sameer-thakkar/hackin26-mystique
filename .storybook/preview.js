import { addParameters, addDecorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { ThemeProvider } from 'styled-components';
import { DocsPage } from '@storybook/addon-docs/blocks';
import { getAppTheme } from '../style/theme';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import '!style-loader!css-loader!../style/global.css';
import { THEMES } from '../constants';

addDecorator((storyFn) => (
  <ThemeProvider theme={getAppTheme(THEMES.DEFAULT)}>{storyFn()}</ThemeProvider>
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
