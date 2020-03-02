import React from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';
import ImageTextGrid from '../../components/slices/ImageTextGrid';

export default {
  title: 'Slices/Image Text Combo',
  component: ImageTextGrid,
  decorators: [withKnobs],
};

export const Basic = () => {
  const groupId = 'GROUP-ID1';
  const cols = number(
    'No. of Columns',
    2,
    {
      range: true,
      min: 2,
      max: 10,
      step: 1,
    },
    groupId
  );
  const noOfCards = number(
    'No. of Cards',
    4,
    {
      range: false,
      min: 4,
      max: 20,
      step: 1,
    },
    groupId
  );
  let cards = [];
  for (let i = 0; i < noOfCards; i++) {
    cards.push({
      card_title: 'Lorem Ipsum',
      card_description: [
        {
          type: 'paragraph',
          text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
          spans: [],
        },
      ],
      image_url: {
        url:
          'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
      },
      image_alt: 'lorem',
    });
  }
  return <ImageTextGrid cols={cols} cards={cards} lazyLoadImages={false} />;
};
