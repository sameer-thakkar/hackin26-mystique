import React from 'react';
import ImageGrid from '../../components/ImageGrid';
import { withKnobs, number } from '@storybook/addon-knobs';
import '../../public/static/styles.css';

export default {
  title: 'Slices/Image Grid',
  component: ImageGrid,
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
  const noOfImages = number(
    'No. of Images',
    4,
    {
      range: false,
      min: 4,
      max: 20,
      step: 1,
    },
    groupId
  );
  let images = [];
  while (true) {
    images.push({
      image_url: {
        url:
          'https://images.prismic.io/mystique/23fc7d42-5897-401c-9345-4f74f4e9c0ef_Disneyland+Paris+Rides+6.jpg?auto=compress,format',
      },
    });
    if (images.length === noOfImages) break;
  }
  return <ImageGrid cols={cols} images={images} lazyLoadImages={false} />;
};
