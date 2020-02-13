import React from 'react';
import IFrame from '../../components/shortcodes/IFrame';

export default {
  title: 'Shortcodes/IFrame',
  component: IFrame,
};

export const Basic = () => {
  return (
    <IFrame
      name="basic-iframe"
      src="https://www.youtube.com/embed/GrrpLGAD_Y0"
    />
  );
};
