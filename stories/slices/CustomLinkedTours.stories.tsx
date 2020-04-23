import React from 'react';
import CustomLinkedTours from '../../components/slices/CustomLinkedTours';

export default {
  title: 'Slices/Custom Linked Tours',
  component: CustomLinkedTours,
};

const data = {
  tours: {
    '7312': {
      tgid: 7312,
      link_type: 'Web',
      url: 'http://stage.sydney.opera-tickets.org/',
    },
    '9883': {
      tgid: 9883,
      link_type: 'Any',
    },
  },
  content: [
    {
      type: 'heading2',
      text: 'Heading',
      spans: [],
    },
    {
      type: 'paragraph',
      text: 'Some content',
      spans: [],
    },
  ],
  commonLink: {
    link_type: 'Web',
    url: 'http://stage.sydney.opera-tickets.org/',
    target: '_blank',
  },
};
export const Mobile = () => (
  <div style={{ width: 1200, margin: 'auto' }}>
    <CustomLinkedTours {...data} />
  </div>
);
