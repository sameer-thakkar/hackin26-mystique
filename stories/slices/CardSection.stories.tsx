import React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import CardSection from '../../components/slices/CardSection';
import { repeat } from '../../utils/storybook';

export default {
  title: 'Slices/Card Section',
  component: CardSection,
  decorators: [withKnobs],
};

const card = {
  slice_type: 'card',
  items: [
    {
      image_source: {
        url:
          'https://images.prismic.io/mystique/10bcf22c-2fe7-4c1b-8392-f0837587d0c3_9608b3b0-0f78-492c-8194-256a0dcdc622-7677-barcelona-hop-on-hop-off-02.jpg?auto=compress,format',
      },
      image_url: { link_type: 'Any' },
      image_alt: 'image',
    },
    {
      image_source: {
        url:
          'https://images.prismic.io/mystique/12f13285-6026-4bf6-884b-ff04b41998f4_lucas-gallone-cVhZX5tEYGo-unsplash.jpg?auto=compress,format',
      },
      image_url: { link_type: 'Any' },
      image_alt: 'image',
    },
  ],
  primary: {
    card_title: 'A cool title',
    card_description: [
      {
        type: 'paragraph',
        text:
          'The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums) and are famous for their frescoes which were painted by Raphael, marking the High Renaissance in Rome. The rooms that make up Raphael Rooms are Sala di Costantino ("Hall of Constantine"), the Stanza di Eliodoro ("Room of Heliodorus"), the Stanza della Segnatura ("Room of the Signatura") and the Stanza dell\'Incendio del Borgo ("The Room of the Fire in the Borgo").',
        spans: [],
      },
    ],
    cta_text: 'Book Now',
    cta_link: { link_type: 'Any' },
  },
};

export const Grid = () => {
  const cardsInARow = select(
    'No. of Cards in a Row',
    {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
    },
    1,
    'GROUP-ID1'
  );

  return (
    <div style={{ width: 1200, padding: 50 }}>
      <CardSection
        slices={repeat(card, 4)}
        title="Card Section (Grid)"
        sectionType="Grid"
        cardsInARow={cardsInARow}
      />
    </div>
  );
};

export const Carousel = () => {
  return (
    <div style={{ width: 1200, padding: 50 }}>
      <CardSection
        slices={repeat(card, 5)}
        title="Card Section (Carousel)"
        sectionType="Carousel"
        cardsInARow={3}
      />
    </div>
  );
};
