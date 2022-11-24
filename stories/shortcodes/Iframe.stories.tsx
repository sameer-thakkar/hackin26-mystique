import React from 'react';

import ParentWrapper from '../ParentWrapper';
import IFrame from '../../components/shortcodes/IFrame';

export default {
  title: 'Shortcodes/IFrame',
  component: IFrame,
};

export const Basic = () => {
  return (
    <ParentWrapper>
      <IFrame
        name="basic-iframe"
        src="https://www.youtube.com/embed/GrrpLGAD_Y0"
      />
    </ParentWrapper>
  );
};
