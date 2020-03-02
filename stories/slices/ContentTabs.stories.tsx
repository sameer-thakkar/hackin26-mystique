import React from 'react';
import ContentTabs from '../../components/slices/ContentTabs';

export default {
  title: 'Slices/Content Tabs',
  component: ContentTabs,
};

const tabsArr = ['Fire', 'Water', 'Air'];
const contentArr = [
  {
    tab_name: 'Fire',
    tab_content: [
      {
        type: 'paragraph',
        text:
          'Fire is the rapid oxidation of a material in the exothermic chemical process of combustion, releasing heat, light, and various reaction products.',
        spans: [],
      },
    ],
  },
  {
    tab_name: 'Water',
    tab_content: [
      {
        type: 'paragraph',
        text: `Water is an inorganic, transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth's hydrosphere and the fluids of most living organisms.`,
        spans: [],
      },
    ],
  },
  {
    tab_name: 'Air',
    tab_content: [
      {
        type: 'paragraph',
        text: `Air is the Earth's atmosphere. Air around us is a mixture of many gases and dust particles. It is the clear gas in which living things live and breathe.`,
        spans: [],
      },
    ],
  },
];

export const Basic = () => (
  <ContentTabs tabsArr={tabsArr} contentArr={contentArr} />
);
