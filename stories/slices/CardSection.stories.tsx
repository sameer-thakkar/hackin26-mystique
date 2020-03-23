import React from 'react';
import CardSection from '../../components/slices/CardSection';
import { withKnobs, select } from '@storybook/addon-knobs';

export default {
  title: 'Slices/Card Section',
  component: CardSection,
  decorators: [withKnobs],
};

const cards = [
  {
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
  },
  {
    slice_type: 'card',
    items: [
      {
        image_source: {
          dimensions: { width: 3148, height: 2305 },
          url:
            'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg?auto=compress,format',
        },
        image_url: { link_type: 'Any' },
        image_alt: 'image',
      },
    ],
    primary: {
      card_title: 'Some good title',
      card_description: [
        {
          type: 'paragraph',
          text:
            ' The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums) and are famous for their frescoes which were painted by Raphael, marking the High Renaissance in Rome. The rooms that make up Raphael Rooms are Sala di Costantino ("Hall of Constantine"), the Stanza di Eliodoro ("Room of Heliodorus"), the Stanza della Segnatura ("Room of the Signatura") and the Stanza dell\'Incendio del Borgo ("The Room of the Fire in the Borgo").',
          spans: [],
        },
      ],
      cta_text: 'Book Now',
      cta_link: {
        link_type: 'Web',
        url: 'https://google.com',
        target: '_blank',
      },
    },
  },
];

export const Desktop = () => (
  <div style={{ width: 1200, padding: 50 }}>
    <CardSection
      slices={cards}
      title="Desktop Cards"
      sectionType="grid"
      cardType="desktop"
    />
  </div>
);

export const Column = () => (
  <div style={{ width: 1200, padding: 50 }}>
    <CardSection
      slices={cards}
      title="Column Cards"
      sectionType="grid"
      cardType="column"
    />
  </div>
);

export const Mobile = () => (
  <div style={{ padding: 50 }}>
    <CardSection
      slices={[
        {
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
                  'The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums) and are famous for their frescoes which were painted by Raphael',
                spans: [],
              },
            ],
            cta_text: 'Book Now',
            cta_link: { link_type: 'Any' },
          },
        },
        {
          slice_type: 'card',
          items: [
            {
              image_source: {
                dimensions: { width: 3148, height: 2305 },
                url:
                  'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg?auto=compress,format',
              },
              image_url: { link_type: 'Any' },
              image_alt: 'image',
            },
          ],
          primary: {
            card_title: 'Some good title',
            card_description: [
              {
                type: 'paragraph',
                text:
                  ' The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums) and are famous for their frescoes which were painted by Raphael',
                spans: [],
              },
            ],
            cta_text: 'Book Now',
            cta_link: {
              link_type: 'Web',
              url: 'https://google.com',
              target: '_blank',
            },
          },
        },
      ]}
      title="Mobile Cards"
      sectionType="grid"
      cardType="mobile"
    />
  </div>
);

export const Variable = () => {
  const label = 'Card Type';
  const options = {
    'Desktop Card': 'desktop',
    'Column Card': 'column',
    'Mobile Card': 'mobile',
  };
  const defaultValue = 'desktop';
  const groupId = 'GROUP-ID1';

  const cardType = select(label, options, defaultValue, groupId);

  return (
    <div style={{ width: 1200, padding: 50 }}>
      <CardSection
        slices={cards}
        title="Variable Cards"
        sectionType="grid"
        cardType={cardType}
      />
    </div>
  );
};
