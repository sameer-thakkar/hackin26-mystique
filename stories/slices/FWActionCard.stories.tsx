import React from 'react';
import FWActionCard from '../../components/slices/FWActionCard';
import '../../public/static/global.css';

export default {
  title: 'Slices/Full Width Action Card',
  component: FWActionCard,
};

export const Basic = () => {
  return (
    <FWActionCard
      title="Offers"
      cards={[
        {
          card_heading:
            'Priority Entrance Tickets to Colosseum, Roman Forum and Palatine Hill',
          card_description: [
            {
              type: 'paragraph',
              text:
                'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur cum suscipit quasi aspernatur, a vel distinctio id, nam tempore expedita repellendus omnis sunt nihil, soluta inventore cupiditate ducimus nemo aperiam.',
              spans: [],
            },
          ],
          cta_title: 'BOOK NOW',
          cta_link: 'http://book.colosseum-rome-tickets.com/book/7148',
        },
        {
          card_heading:
            'Skip-the-Line Tickets to Colosseum with Access to the Arena, Roman Forum & Palatine Hill',
          card_description: [
            {
              type: 'paragraph',
              text:
                'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur cum suscipit quasi aspernatur, a vel distinctio id, nam tempore expedita repellendus omnis sunt nihil, soluta inventore cupiditate ducimus nemo aperiam.',
              spans: [],
            },
          ],
          cta_title: 'BOOK NOW',
          cta_link: 'http://book.colosseum-rome-tickets.com/book/10144',
        },
        {
          card_heading:
            'Skip-the-Line Colosseum Guided Tour with Access to Arena, Roman Forum & Palatine Hill',
          card_description: [
            {
              type: 'paragraph',
              text:
                'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur cum suscipit quasi aspernatur, a vel distinctio id, nam tempore expedita repellendus omnis sunt nihil, soluta inventore cupiditate ducimus nemo aperiam.',
              spans: [],
            },
          ],
          cta_title: 'BOOK NOW',
          cta_link: 'http://book.colosseum-rome-tickets.com/book/9179',
        },
      ]}
    />
  );
};
