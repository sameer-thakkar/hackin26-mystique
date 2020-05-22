import React from 'react';
import Reviews from '../../components/slices/Reviews';

export default {
  title: 'Slices/Reviews & Testimonials',
  component: Reviews,
};

const items = [
  {
    review_text:
      'We bought the Golden Tours 24 hours on which we got 24 hours free. It was value for money for us as we were on a tight budget. We also got a free river cruise and walking tour which can be crowded but worth it. Just be prepared for the unexpected rain, we had to move to the lower deck and we didn’t get good views of the city.',
    reviewer_name: 'Mohamed Shadab',
    reviewer_subtext: 'Bengaluru, India',
    rating: 4.3,
    rating_date: '2020-01-01',
  },
  {
    review_text:
      'We bought the Golden Tours 24 hours on which we got 24 hours free. It was value for money for us as we were on a tight budget. We also got a free river cruise and walking tour which can be crowded but worth it. Just be prepared for the unexpected rain, we had to move to the lower deck and we didn’t get good views of the city.',
    reviewer_name: 'Denver D.',
    reviewer_subtext: 'Seattle, US',
    rating: 5,
    rating_date: '2020-04-22',
  },
];

export const Review = () => <Reviews title="Reviews" reviews={items} />;

export const Testimonial = () => (
  <Reviews title="Testimonials" type="testimonial" reviews={items} />
);
