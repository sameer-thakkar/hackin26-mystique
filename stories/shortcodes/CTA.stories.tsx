import React from 'react';
import CTA from '../../components/shortcodes/CTA';

export default {
  title: 'Shortcodes/CTA',
  component: CTA,
};

export const Basic = () => (
  <CTA text="Read More" link="https://www.headout.com" />
);

export const CenterAligned = () => (
  <CTA text="Read More" link="https://www.headout.com" align="center" />
);
