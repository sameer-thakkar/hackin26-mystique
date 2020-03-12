import React from 'react';
import Breadcrumb from '../../components/slices/Breadcrumb';

export default {
  title: 'Slices/Breadcrumbs',
  component: Breadcrumb,
};

const data = [
  {
    text: 'Start Page',
    link: {
      link_type: 'Web',
      url: 'https://www.google.com',
    },
  },
  {
    text: 'Prev Page',
    link: {
      link_type: 'Web',
      url: 'https://www.google.com',
    },
  },
  {
    text: 'Framework',
    url: {},
  },
];

export const Basic = () => {
  return (
    <div style={{ width: 1200, padding: 50 }}>
      <Breadcrumb orderedLinks={data} />
    </div>
  );
};
