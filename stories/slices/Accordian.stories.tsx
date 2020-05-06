import React from 'react';
import AccordianGroup from '../../components/slices/AccordianGroup';

export default {
  title: 'Slices/Accordian',
  component: AccordianGroup,
};

const data = [
  {
    heading: 'Can I skip the long lines with these tickets?',
    content: [
      {
        type: 'paragraph',
        text:
          'Yes, you will be able to skip the long ticket queues with these tickets. Since the Vatican is one of the most visited attractions in Rome, the waiting line to get tickets to the museums can be anywhere between 30 minutes - 90 minutes long.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: '',
        spans: [],
      },
    ],
  },
  {
    heading:
      'Do I need tickets to enter the Vatican Museums and St. Peter’s Basilica?',
    content: [
      {
        type: 'paragraph',
        text:
          'Entry to the Vatican Museums and Sistine Chapel require you to purchase tickets. On the other hand, entry to St. Peter’s Basilica is free. However, if you wish to skip the long lines at St. Peter’s Basilica, it is advised that you purchase a skip the line ticket as the queue can easily be upto 60 minutes long.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: '',
        spans: [],
      },
    ],
  },
];

export const Basic = () => {
  return <AccordianGroup accoridians={data} />;
};
