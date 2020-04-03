import React from 'react';
import TicketCards from '../../components/slices/TicketCards';

export default {
  title: 'Slices/Ticket Cards',
  component: TicketCards,
};

export const Basic = () => {
  return (
    <TicketCards
      title="Offers"
      cards={[
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 7148,
        },
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 10225,
        },
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 7358,
        },
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 10224,
        },
      ]}
    />
  );
};

export const TwoColumns = () => {
  return (
    <TicketCards
      title="Offers"
      cards={[
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 7148,
        },
        {
          card_heading: '',
          cta_title: 'Book Now',
          cta_link: 'https://www.google.com',
          tgid: 10225,
        },
      ]}
      twoColumns={true}
    />
  );
};
