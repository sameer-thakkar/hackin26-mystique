import React from 'react';
import CardCarousel from '../../components/slices/CardCarousel';

export default {
  title: 'Slices/Card Carousel',
  component: CardCarousel,
};

const data = [
  {
    card_title: 'Aladdin',
    card_link: {
      url: 'https://www.headout.com/tour/508/united-states/new-york/aladdin',
    },
    tgid: 508,
    image_source: {
      url:
        'https://cdn-imgix.headout.com/tour/638/TOUR-IMAGE/d8da7ef3-6be5-4ab9-a88e-66a1cf8b5126-2.jpg?auto=compress&fm=pjpg&w=504&h=315&crop=faces&fit=min',
    },
  },
  {
    card_title: 'Aladdin',
    card_link: {
      url: 'https://www.headout.com/tour/508/united-states/new-york/aladdin',
    },
    tgid: 508,
    image_source: {
      url:
        'https://cdn-imgix.headout.com/tour/638/TOUR-IMAGE/d8da7ef3-6be5-4ab9-a88e-66a1cf8b5126-2.jpg?auto=compress&fm=pjpg&w=504&h=315&crop=faces&fit=min',
    },
  },
  {
    card_title: 'Aladdin',
    card_link: {
      url: 'https://www.headout.com/tour/508/united-states/new-york/aladdin',
    },
    tgid: 508,
    image_source: {
      url:
        'https://cdn-imgix.headout.com/tour/638/TOUR-IMAGE/d8da7ef3-6be5-4ab9-a88e-66a1cf8b5126-2.jpg?auto=compress&fm=pjpg&w=504&h=315&crop=faces&fit=min',
    },
  },
  {
    card_title: 'Aladdin',
    card_link: {
      url: 'https://www.headout.com/tour/508/united-states/new-york/aladdin',
    },
    tgid: 508,
    image_source: {
      url:
        'https://cdn-imgix.headout.com/tour/638/TOUR-IMAGE/d8da7ef3-6be5-4ab9-a88e-66a1cf8b5126-2.jpg?auto=compress&fm=pjpg&w=504&h=315&crop=faces&fit=min',
    },
  },
  {
    card_title: 'Aladdin',
    card_link: {
      url: 'https://www.headout.com/tour/508/united-states/new-york/aladdin',
    },
    tgid: 508,
    image_source: {
      url:
        'https://cdn-imgix.headout.com/tour/638/TOUR-IMAGE/d8da7ef3-6be5-4ab9-a88e-66a1cf8b5126-2.jpg?auto=compress&fm=pjpg&w=504&h=315&crop=faces&fit=min',
    },
  },
];

export const Basic = () => {
  return <CardCarousel cards={data} carouselHeading="Super Carousel" />;
};
