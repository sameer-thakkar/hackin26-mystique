import React from 'react';
import Card from '../../components/slices/Card';

export default {
  title: 'Slices/Card',
  component: Card,
};

const data = {
  images: [
    {
      url:
        'https://images.prismic.io/mystique/043186fadae7d3408b3860150604ade970991323_basilica-02.jpg?auto=compress,format',
      alt: 'ALT',
    },
    {
      url:
        'https://images.prismic.io/mystique/c6ad6c82-b00e-4bcd-bea5-167894c4cedb_City+Sightseeing+Rome+4.jpg?auto=compress,format',
      alt: 'ALT',
    },
    {
      url:
        'https://images.prismic.io/mystique/43faf96d-35d7-46c9-8080-2d0db892b6b5_Disneyland+Paris+Guest+Services+1.jpg?auto=compress,format',
      alt: 'ALT',
    },
  ],
  title: 'The Raphael Rooms',
  description: [
    {
      type: 'paragraph',
      text: `The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums) and are famous for their frescoes which were painted by Raphael, marking the High Renaissance in Rome. The rooms that make up Raphael Rooms are Sala di Costantino ("Hall of Constantine"), the Stanza di Eliodoro ("Room of Heliodorus"), the Stanza della Segnatura ("Room of the Signatura") and the Stanza dell'Incendio del Borgo ("The Room of the Fire in the Borgo").`,
      spans: [],
    },
  ],
  cta: {
    link: {
      url: 'https://www.headout.com/',
      target: '_blank',
    },
    text: 'Book Now',
  },
};

export const Basic = () => {
  return (
    <div style={{ width: 1200 }}>
      <Card
        images={data.images}
        title={data.title}
        description={data.description}
        cta={data.cta}
      />
    </div>
  );
};

export const Mobile = () => (
  <div style={{ width: 350 }}>
    <Card
      images={data.images}
      title={data.title}
      description={[
        {
          type: 'paragraph',
          text: `The Raphael Rooms are a group of rooms in the public portion of the Vatican Palace (part of the Vatican Museums).`,
          spans: [],
        },
      ]}
      cta={data.cta}
      type="mobile"
    />
  </div>
);

export const ColumnCard = () => {
  return (
    <div style={{ width: 500 }}>
      <Card
        images={data.images}
        title={data.title}
        description={data.description}
        type="secondary"
      />
    </div>
  );
};

export const OnlyText = () => {
  return (
    <div style={{ width: 500 }}>
      <Card
        title={data.title}
        description={data.description}
        type="secondary"
      />
    </div>
  );
};
