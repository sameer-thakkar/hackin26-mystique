import {
  LTT_CATEGORY_COMEDY,
  LTT_CATEGORY_DISCOUNT,
  LTT_CATEGORY_KIDS,
  LTT_CATEGORY_MUSICALS,
  LTT_CATEGORY_NEW_SHOWS,
  LTT_CATEGORY_PLAYS,
} from 'assets/SvgIcons';

export const LTT_CATEGORIES = {
  DISCOUNT: {
    icon: LTT_CATEGORY_DISCOUNT,
    name: 'Discount',
    link: 'https://www.london-theater-tickets.com/discount-west-end-tickets/',
  },
  MUSICALS: {
    icon: LTT_CATEGORY_MUSICALS,
    name: 'Musicals',
    link: 'https://www.london-theater-tickets.com/london-musicals/',
  },
  PLAYS: {
    icon: LTT_CATEGORY_PLAYS,
    name: 'Plays',
    link: 'https://www.london-theater-tickets.com/west-end-plays-in-london/',
  },
  KIDS: {
    icon: LTT_CATEGORY_KIDS,
    name: 'Kids',
    link:
      'https://www.london-theater-tickets.com/shows-in-london/shows-for-kids/',
  },
  NEW_SHOWS: {
    icon: LTT_CATEGORY_NEW_SHOWS,
    name: 'New shows',
    link:
      'https://www.london-theater-tickets.com/shows-in-london/new-west-end-shows/',
  },
  COMEDY: {
    icon: LTT_CATEGORY_COMEDY,
    name: 'Comedy',
    link:
      'https://www.london-theater-tickets.com/shows-in-london/comedy-shows/',
  },
};

export const BANNERS = [
  {
    title: "Step into London's theatrical world",
    mobileVideoLink:
      'https://tourlandish.s3.amazonaws.com/assets/videos/mobile/ltt_trailer_lower.mp4',
    desktopVideoLink:
      'https://tourlandish.s3.amazonaws.com/assets/videos/desktop/ltt_trailer_higher.mp4',
  },
  {
    title: 'The Lion King',
    desc:
      'Immerse yourself in the mesmerizing world of The Lion King, a breathtaking musical that uses masks and puppetry to create pure theatrical magic.',
    show_page_link:
      'https://www.london-theater-tickets.com/the-lion-king-tickets/',
    url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/lion-king.jpeg',
    mobile_url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/lion-king.jpeg',
  },
  {
    title: 'The Phantom of the Opera',
    desc:
      'Recipient to countless awards, this masterpiece has been enchanting audiences for decades with its iconic music score and exquisite set design.',
    show_page_link:
      'https://www.london-theater-tickets.com/the-phantom-of-the-opera-tickets/',
    url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/phantom.jpeg',
    mobile_url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/phantom.jpeg',
  },
  {
    title: 'Frozen the Musical',
    desc:
      "Experience Disney's hit film as it comes to life on stage with stunning sets, show-stopping music, and a heartwarming tale of love and self-discovery.",
    show_page_link:
      'https://www.london-theater-tickets.com/frozen-the-musical-tickets/',
    url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/frozen.jpeg',
    mobile_url:
      'https://headout-open.s3.amazonaws.com/ltt-experiment-banner/frozen.jpeg',
  },
];
