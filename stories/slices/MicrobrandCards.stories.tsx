import React from 'react';
import MicrobrandCards from '../../components/slices/MicrobrandCards';
import { repeat } from '../../utils/storybook';

export default {
  title: 'Slices/Microbrand Cards',
  component: MicrobrandCards,
};

export const Basic = () => {
  const cards = repeat(
    {
      microbrand_link: {
        url: 'https://www.headout.com',
      },
      image_url: {
        url:
          'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
      },
      image_alt: 'lorem',
      tgid: 508,
      card_title: 'Lorem Ipsum',
    },
    6
  );

  return (
    <MicrobrandCards
      cardsContent={{
        content_above_cards: [
          {
            type: 'paragraph',
            text:
              'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit quibusdam dicta fuga est cum dolorem, totam quia obcaecati dolores incidunt officia soluta quos voluptate unde, optio eligendi deleniti aliquid nemo?',
            spans: [],
          },
        ],
        content_below_cards: [
          {
            type: 'paragraph',
            text:
              'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit quibusdam dicta fuga est cum dolorem, totam quia obcaecati dolores incidunt officia soluta quos voluptate unde, optio eligendi deleniti aliquid nemo?',
            spans: [],
          },
        ],
      }}
      cards={cards}
    />
  );
};
