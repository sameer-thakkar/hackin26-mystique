import React from 'react';

import TourComparisonTable from '../../components/slices/TourComparision';
import useWindowSize from '../../components/hooks/useWindowSize';
import { ProductsContextProvider } from '../../contexts/Products';
import ParentWrapper from '../ParentWrapper';

export default {
  title: 'Slices/Tour Comparision',
  component: TourComparisonTable,
};

const data = {
  heading: 'Compare Bestsellers (3)',
  description: 'Check out key highlights in one go',
  tgidsCSV: '9883,7312,9907',
  vendors: ['BigBus', 'The Original Tour', 'Golden Tours'],
  vendorLinks: [
    '/london/bigbus',
    '/london/originaltour',
    '/london/goldentours',
    '/london/city-tour',
  ],
  orderedLabels: [
    {
      label: 'what-we-love',
      labelId: 'Xipr7xEAALJlbg9M',
    },
    {
      label: 'duration',
      labelId: 'XaLC4BMAAKQaPA9K',
    },
    {
      label: 'validity',
      labelId: 'XiprdxEAACYAbg0Y',
    },
    {
      label: 'route',
      labelId: 'XiprixEAACEAbg13',
    },
    {
      label: 'ticket-type',
      labelId: 'XiprmBEAALJlbg22',
    },
    {
      label: 'departure',
      labelId: 'Xl4TjxAAACEAq-yi',
    },
    {
      label: 'inclusions',
      labelId: 'XeTE3BAAACMAKGGo',
    },
    {
      label: 'cancellation',
      labelId: 'Xipr3REAACEAbg7w',
    },
  ],
  slice: {
    slice_type: 'comparision_table',
    slice_label: null,
    items: [
      {
        selected_labels: {
          id: 'Xipr7xEAALJlbg9M',
          type: 'label',
          tags: [],
          slug: 'what-we-love',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'XaLC4BMAAKQaPA9K',
          type: 'label',
          tags: [],
          slug: 'duration',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'XiprdxEAACYAbg0Y',
          type: 'label',
          tags: [],
          slug: 'validity',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'XiprixEAACEAbg13',
          type: 'label',
          tags: [],
          slug: 'route',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'XiprmBEAALJlbg22',
          type: 'label',
          tags: [],
          slug: 'ticket-type',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'Xl4TjxAAACEAq-yi',
          type: 'label',
          tags: [],
          slug: 'departure',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'XeTE3BAAACMAKGGo',
          type: 'label',
          tags: [],
          slug: 'inclusions',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        selected_labels: {
          id: 'Xipr3REAACEAbg7w',
          type: 'label',
          tags: [],
          slug: 'cancellation',
          lang: 'en-us',
          link_type: 'Document',
          isBroken: false,
        },
      },
    ],
    primary: {
      comparision_heading: 'Compare Bestsellers (3)',
      comparison_description: 'Check out key highlights in one go',
      product_tgids: '9883,7312,9907',
      csv_vendors: 'BigBus, The Original Tour, Golden Tours',
      csv_vendor_links:
        '/london/bigbus, /london/originaltour,/london/goldentours, /london/city-tour',
    },
  },
};
const allTours = {
  '7312': {
    title: 'The Original London Hop-On-Hop-Off Tour, Cruise & Walking Tour',
    highlights:
      'An amazing London HOHO tour with complementary experiences\r\n\r\n- Take to the vibrant streets of London on comfortable, wifi-enabled, double-decker buses and discover the beautiful city while you’re at it\r\n- Choose to sit through the entire ride, or hop off at any of the stops to further explore the city on foot\r\n- With buses departing every 15-30 minutes, take your time admiring the many attractions along the route\r\n- Thanks to the onboard commentary (available in 11 languages) and dedicated English-speaking guides, you can now learn about the sites you pass along\r\n- Visit some of the top tourist spots of London, such as the London Eye, Kensington Palace, Buckingham Palace, Tower Bridge, Big Ben, and Madame Tussauds, among others\r\n- Enjoy complimentary experiences incorporated into this ticket, such as a one-way River Thames cruise ticket and 3 guided walking tours through London’s finest\r\n- With ticket options available in 24-Hour and 48-Hour bus passes, curate your own trip to London from scratch\r\n- Click <a href="https://cdn-imgix-open.headout.com/hop-on-hop-off/Original.jpg" target="_blank">here</a> for detailed route map and boarding points\r\n- Ages 5-15yrs enjoy discounted rates\r\n- Get a full refund on cancelling this ticket up to 24hrs before schedule',
    descriptors:
      'Flexible Tickets, Free Wi-Fi Onboard, Wheelchair Access, Guide Dogs Allowed',
    productHighlights:
      '<ul>\n<li>Hop aboard comfortable air-conditioned hop-on hop-off buses and tour the bustling city of London like a true tourist</li>\n<li>With 80 stops sprinkled across 6 distinct routes, you are at liberty of hopping off and back on between any of the stops</li>\n<li>Bus frequencies ranging between 15-20 minutes allow you to familiarize yourself with London easily\nWifi-enabled, double-decker buses further offer pre-recorded and live commentary on-board, making for a fun learning experience</li>\n<li>Visit some of the top attractions in London, such as the London Eye, Kensington Palace, Buckingham Palace, Tower Bridge, Big Ben, and Madame Tussauds, among others</li>\n<li>Benefit from the free River Thames cruise pass as you sail your way between Westminster and Tower of London piers</li>\n<li>With the additional choice of three major walking tours, learn closely about the rich history of this city in a unique manner</li>\n<li>Choose between a 24 or 48-hour pass so you can explore the city at your own pace and convenience</li>\n<li>Click <a href=https://cdn-imgix-open.headout.com/hop-on-hop-off/Original.jpg>here</a> for detailed route map and boarding points</li>\n</ul>',
    cardFooter: [
      {
        type: 'paragraph',
        text: '{rating-cta tgid="7312" text="10k+ Booked"}',
        spans: [],
      },
    ],
    contentBlocks: {
      left: [
        {
          label: 'What You Get',
          content: [
            {
              type: 'list-item',
              text:
                'Choose between 24 or 48-Hour bus passes to take a bus, ferry or walk through London',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Buses depart every 5-20min with over 80 stops across 6 routes',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Live English-speaking guide on the Yellow Route.',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Commentary available in 11 languages: English, German, French, Spanish, Japanese, Arabic & more',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Kids commentary on Yellow & Orange routes and free educational quiz book',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'HOHO River Cruise Pass',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                '3 Walking Tours: Changing of the Guard, Rock n Roll and Jack the Ripper ',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Children aged 5-15yrs enjoy reduced prices. Ages 4yrs & below go free',
              spans: [],
            },
          ],
          align: 'Left',
          len: 529,
          labelId: 'Xi-hwhEAAAzehUIv',
        },
      ],
      right: [
        {
          label: 'Departure',
          content: [
            {
              type: 'paragraph',
              text: 'First - 8:30 AM',
              spans: [],
            },
            {
              type: 'paragraph',
              text: 'Last - 6:00 PM',
              spans: [],
            },
          ],
          align: 'Right',
          len: 30,
          labelId: 'Xl4TjxAAACEAq-yi',
        },
        {
          label: 'Route',
          content: [
            {
              type: 'paragraph',
              text: '6 routes | 80 stops ',
              spans: [],
            },
            {
              type: 'paragraph',
              text:
                '{popup id="7312-originaltour-london" text="Click to View Map"}',
              spans: [],
            },
          ],
          align: 'Right',
          len: 83,
          labelId: 'XiprixEAACEAbg13',
        },
        {
          label: 'Ticket Type',
          content: [
            {
              type: 'paragraph',
              text: 'Mobile',
              spans: [],
            },
          ],
          align: 'Right',
          len: 6,
          labelId: 'XiprmBEAALJlbg22',
        },
        {
          label: 'Validity',
          content: [
            {
              type: 'paragraph',
              text: '6 months',
              spans: [],
            },
          ],
          align: 'Right',
          len: 8,
          labelId: 'XiprdxEAACYAbg0Y',
        },
        {
          label: 'Cancellation',
          content: [
            {
              type: 'paragraph',
              text: 'Free cancelation up to 24h',
              spans: [],
            },
          ],
          align: 'Right',
          len: 26,
          labelId: 'Xipr3REAACEAbg7w',
        },
      ],
      hidden: [
        {
          label: 'What We Love',
          content: [
            {
              type: 'list-item',
              text: 'max inclusions',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'commentary for kids',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 34,
          labelId: 'Xipr7xEAALJlbg9M',
        },
        {
          label: 'Duration',
          content: [
            {
              type: 'paragraph',
              text: '24h / 48h',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 9,
          labelId: 'XaLC4BMAAKQaPA9K',
        },
        {
          label: 'Inclusions',
          content: [
            {
              type: 'list-item',
              text: 'HOHO river cruise pass',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Recorded guide - 11 languages',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Free Wi-Fi',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Choice of 3 walking tours',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'English-speaking guide on 1 route',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Kids commentary on 2 routes',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 151,
          labelId: 'XeTE3BAAACMAKGGo',
        },
      ],
    },
    productImage:
      '//cdn-imgix.headout.com/tour/13338/TOUR-IMAGE/b4007caf-b1c8-487a-b829-2b08ec290a43-7312-london-the-original-london-hop-on-hop-off-sightseeing-bus---cruise-tour-02.jpg',
    descriptionImage:
      '//cdn-imgix.headout.com/tour/13338/TOUR-IMAGE/2b8843fa-fb43-4a0d-be88-2ad145ee81f1-7312-london-the-original-london-hop-on-hop-off-sightseeing-bus---cruise-tour-01.jpg',
    price: 34,
    scratchPrice: 34,
    currencySymbol: '£',
    tgid: 7312,
    images: [
      {
        url:
          '//cdn-imgix.headout.com/tour/13338/TOUR-IMAGE/b4007caf-b1c8-487a-b829-2b08ec290a43-7312-london-the-original-london-hop-on-hop-off-sightseeing-bus---cruise-tour-02.jpg',
        alt:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-1',
        title:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-1',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/13338/TOUR-IMAGE/2b8843fa-fb43-4a0d-be88-2ad145ee81f1-7312-london-the-original-london-hop-on-hop-off-sightseeing-bus---cruise-tour-01.jpg',
        alt:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-2',
        title:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-2',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/13338/TOUR-IMAGE/2e90fe7a-2678-488e-be56-0ec3d3325304-7312-london-the-original-london-hop-on-hop-off-sightseeing-bus---cruise-tour-03.jpg',
        alt:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-3',
        title:
          'the original london: 24/48 hr hop-on-hop-off bus + cruise & walking tour-3',
      },
    ],
    averageRating: 4.6,
    reviewCount: 242,
    ctaBooster: '21 views in last 3 hours',
    description: [
      {
        type: 'paragraph',
        text:
          'HOHO London double-decker bus tour with complimentary experiences',
        spans: [],
      },
    ],
    available: true,
    overlayBooster: null,
    vendor: 'The Original Tour',
  },
  '9883': {
    title: 'BigBus London Hop-On-Hop-Off Tour, Cruise & Walking Tour',
    highlights:
      'Iconic HOHO tour covering London’s finest attractions\r\n\r\n- Jump aboard comfortable, wifi-enabled HOHO buses to discover the beautiful city of London at your own pace\r\n- Sit back and enjoy the 2-hour 30-minute ride, or choose to deboard at any of the distinct stops to venture through the city on foot\r\n- With bus frequencies ranging between 15-30 minutes, you won’t have to worry about time ticking by\r\n- With engaging on-board commentary available in 12 languages, pick up interesting facts about the various attractions of London that zoom past you\r\n- Visit some of the top tourist spots of London, such as the London Eye, Kensington Palace, Buckingham Palace, Tower Bridge, Big Ben, and Madame Tussauds, among others\r\n- Enjoy complimentary experiences with this ticket, including a guided walking tour and a 1-hour cruise on River Thames\r\n- With ticket options available in 1-Day, 2-Day and 3-Day bus passes (in Classic, Premium and Deluxe packages), customize your trip to London from scratch\r\n- Click <a href=https://cdn-imgix-open.headout.com/hop-on-hop-off/BBL.pdf target=”_blank”>here</a> for detailed route map and boarding points\r\n- Ages 5-15yrs enjoy discounted rates\r\n- Get a full refund on cancelling this ticket up to 24hrs before schedule',
    descriptors:
      'Flexible Tickets,Free Wi-Fi Onboard, Mobile Tickets, Wheelchair Access',
    productHighlights:
      "<ul>\n<li>Tour through the vibrant city of London by hopping on comfortable HOHO sightseeing buses</li>\n<li>Features 4 distinct routes, over 40 stops and a bus frequency of 15-20 minutes</li>\n<li>These modern, wifi-enabled, double-decker buses offer pre-recorded commentary</li>\n<li>Visit the London Eye, Kensington Palace, Tower Bridge, Big Ben &amp; Madame Tussauds among other hotspots</li>\n<li>Pick from 2 free walks: 90-minute Royal Walk or Little Legs Kid’s Walking Tour</li>\n<li>What's more, the ticket price includes a relaxing river cruise</li>\n<li>1-Day, 2-Day &amp; 3-Day bus passes - available in Classic, Premium and Deluxe packages</li>\n<li>Click <a href=https://cdn-imgix-open.headout.com/hop-on-hop-off/BBL.pdf target=”_blank”>here</a> for detailed route map and boarding points</li>\n</ul>",
    cardFooter: [
      {
        type: 'paragraph',
        text: '{rating-cta tgid="9883" text="8.2k+ Booked"}',
        spans: [],
      },
    ],
    contentBlocks: {
      left: [
        {
          label: 'What You Get',
          content: [
            {
              type: 'list-item',
              text: '1, 2, or 3-Day Ticket based on the option you select',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Buses depart every 15-20min with over 50 stops across 4 routes',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Visit key landmarks such as Parliament Square, London Eye, Trafalgar Square & more',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Thames river cruise with on-board commentary',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Choose any one - Royal Walk or Little Legs Kids’ Walking Tour',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Recorded commentary in 12 languages: English, French, German, Spanish, Polish, Arabic, Japanese & more ',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'English-speaking guide available on Red Route',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Children aged 5-15yrs enjoy reduced prices. Ages 4yrs and below go for free',
              spans: [],
            },
          ],
          align: 'Left',
          len: 531,
          labelId: 'Xi-hwhEAAAzehUIv',
        },
      ],
      right: [
        {
          label: 'Departure',
          content: [
            {
              type: 'paragraph',
              text: 'First - 8:30 AM',
              spans: [],
            },
            {
              type: 'paragraph',
              text: 'Last - 6:30 PM',
              spans: [],
            },
          ],
          align: 'Right',
          len: 30,
          labelId: 'Xl4TjxAAACEAq-yi',
        },
        {
          label: 'Route',
          content: [
            {
              type: 'paragraph',
              text: '4 routes | 50 stops',
              spans: [],
            },
            {
              type: 'paragraph',
              text:
                '{popup id="9883-bigbus-london-map" text="Click to View Map"}',
              spans: [],
            },
          ],
          align: 'Right',
          len: 80,
          labelId: 'XiprixEAACEAbg13',
        },
        {
          label: 'Ticket Type',
          content: [
            {
              type: 'paragraph',
              text: 'Mobile',
              spans: [],
            },
          ],
          align: 'Right',
          len: 6,
          labelId: 'XiprmBEAALJlbg22',
        },
        {
          label: 'Validity',
          content: [
            {
              type: 'paragraph',
              text: '6 months',
              spans: [],
            },
          ],
          align: 'Right',
          len: 8,
          labelId: 'XiprdxEAACYAbg0Y',
        },
        {
          label: 'Cancellation',
          content: [
            {
              type: 'paragraph',
              text: 'Free cancellation up to 24h',
              spans: [],
            },
          ],
          align: 'Right',
          len: 27,
          labelId: 'Xipr3REAACEAbg7w',
        },
      ],
      hidden: [
        {
          label: 'What We Love',
          content: [
            {
              type: 'list-item',
              text: 'highest TripAdvisor rating ',
              spans: [],
            },
            {
              type: 'list-item',
              text: '3-day option',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 40,
          labelId: 'Xipr7xEAALJlbg9M',
        },
        {
          label: 'Duration',
          content: [
            {
              type: 'paragraph',
              text: '1 day / 2 days / 3 days',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 23,
          labelId: 'XaLC4BMAAKQaPA9K',
        },
        {
          label: 'Inclusions',
          content: [
            {
              type: 'list-item',
              text: 'River cruise with commentary',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Recorded guide - 12 languages',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Free Wi-Fi',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Choice of 2 walking tours ',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'English-speaking guide on 1 route',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 130,
          labelId: 'XeTE3BAAACMAKGGo',
        },
      ],
    },
    productImage:
      '//cdn-imgix.headout.com/tour/18061/TOUR-IMAGE/5434d5e3-aef0-43e6-8332-08707e78a52c-9883-london-big-bus--1-day-hop-on-hop-off-bus-tour-with-cruise-tickets-01.jpg',
    descriptionImage:
      '//cdn-imgix.headout.com/tour/18061/TOUR-IMAGE/77dc73db-07ff-4935-99ff-9685a6074bc8-9883-london-big-bus--1-day-hop-on-hop-off-bus-tour-with-cruise-tickets-02.jpg',
    price: 35.1,
    scratchPrice: 39,
    currencySymbol: '£',
    tgid: 9883,
    images: [
      {
        url:
          '//cdn-imgix.headout.com/tour/18061/TOUR-IMAGE/5434d5e3-aef0-43e6-8332-08707e78a52c-9883-london-big-bus--1-day-hop-on-hop-off-bus-tour-with-cruise-tickets-01.jpg',
        alt:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-1',
        title:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-1',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/18061/TOUR-IMAGE/77dc73db-07ff-4935-99ff-9685a6074bc8-9883-london-big-bus--1-day-hop-on-hop-off-bus-tour-with-cruise-tickets-02.jpg',
        alt:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-2',
        title:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-2',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/18061/TOUR-IMAGE/82709d82-b035-4ad5-84a5-1b234431c400-9883-london-big-bus--1-day-hop-on-hop-off-bus-tour-with-cruise-tickets-03.jpg',
        alt:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-3',
        title:
          'bigbus london: 1/2/3 day hop-on-hop-off + cruise & walking tour-3',
      },
    ],
    averageRating: 4.8,
    reviewCount: 441,
    ctaBooster: '48 views in last 3 hours',
    description: [
      {
        type: 'paragraph',
        text:
          'Unlimited HOHO London tour with free walking tour & cruise ticket',
        spans: [],
      },
    ],
    available: true,
    overlayBooster: null,
    vendor: 'BigBus',
  },
  '9907': {
    title: 'Golden Tours Hop-On-Hop-Off (Offer: Get Extra 24h Free!)',
    highlights:
      'A hop-on-hop-off bus pass valid for 1day/24/48/72 hrs across London\r\n\r\n- Explore London on a bus that departs every 5 - 10 min and discover four dedicated routes with over 70 stops taking you through the best of the city!\r\n- Choose between a 1Day/24/48/72 Hr Ticket, and get exclusive hop-on-hop-off access, allowing for a hassle-free and flexible journey\r\n- Enjoy panoramic views of London from the open-topped deck of these double-decker buses, which all come with free wifi facilities and a 3D treasure hunting game\r\n- Discover iconic structures such as the Buckingham Palace, Tower of London, St Paul’s Cathedral, Tower Bridge, and celebrated areas of London including Trafalgar Square and Piccadilly\r\n- Enjoy the services of a live English-speaking guide on the blue route, as well as an audio guide available in 11 languages across all routes\r\n- The 24/48 or 72 Hr tickets include a free walking tour, a boat ride on the River Thames, and an extra bonus of 24 hours available for a limited period\r\n- Discounted tickets: Children between 5 - 15 enjoy discounted rates on their tickets. Get family tickets for 2 adults and 2 children at a reduced price.\r\n- Get a full refund on canceling this ticket up to 24 hours before the schedule',
    descriptors:
      'Thames Cruise,Free Wi-Fi Onboard,Instant Confirmation, Wheel-chair Access',
    productHighlights:
      '<ul>\n<li>With over 70 stops across 4 well-planned routes, explore London on a bus that departs every 5 - 10 minutes.</li>\n<li>Enjoy hop-on-hop-off privilege for 1 Day/24/48 or 72-hrs, which allows you to set the course of your trip, giving you complete flexibility over your schedule and itinerary</li>\n<li>The double-decker buses come with an open-top, free wifi facility, and an onboard 3D treasure hunt game which will keep you engaged, should you choose for some fun and light-hearted entertainment </li>\n<li>The routes are designed to give you the best of London, taking you through key landmark areas like Buckingham Palace, the Tower of London, St. Paul’s Cathedral, and more</li>\n<li>Enjoy the services of a live English-speaking guide on board the bus, as well as an audio guide available in 11 languages</li>\n<li>If you choose to purchase a 24/48 or 72-hour ticket, you will get a complimentary walking tour, a free boat ride on the River Thames, and a bonus of 24 hours for a limited period, giving you extra time to roam and explore!</li>\n<li>Click <a href="https://cdn-imgix-open.headout.com/hop-on-hop-off/HoHo+Map+December+2019.pdf" target="_blank" draggable="false">here</a> for detailed route map and boarding points</li>\n</ul>',
    cardFooter: [
      {
        type: 'paragraph',
        text: '{rating-cta tgid="9907" text="8k+ Booked"}',
        spans: [],
      },
    ],
    contentBlocks: {
      left: [
        {
          label: 'What You Get',
          content: [
            {
              type: 'list-item',
              text:
                'Explore the best of London on buses departing every 5-10min with over 60 stops across 5 routes',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Enjoy a free walking tour, a boat ride on the River Thames',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Enjoy the services of a live English-speaking guide on the blue route',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Audio guide in English, French, German, Italian, Spanish, Russian, Hindi, Korean, Japanese, Mandarin Chinese, Portugese',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Interactive onboard app: 3D treasure hunt',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Save big on family tickets (2 adults and 2 children)',
              spans: [],
            },
            {
              type: 'list-item',
              text:
                'Children between 5 - 15 enjoy discounted rates on their tickets. ',
              spans: [],
            },
          ],
          align: 'Left',
          len: 504,
          labelId: 'Xi-hwhEAAAzehUIv',
        },
      ],
      right: [
        {
          label: 'Departure',
          content: [
            {
              type: 'paragraph',
              text: 'First - 9:00 AM',
              spans: [],
            },
            {
              type: 'paragraph',
              text: 'Last - 5:00 PM',
              spans: [],
            },
          ],
          align: 'Right',
          len: 30,
          labelId: 'Xl4TjxAAACEAq-yi',
        },
        {
          label: 'Route',
          content: [
            {
              type: 'paragraph',
              text: '5 routes | 60 stops',
              spans: [],
            },
            {
              type: 'paragraph',
              text:
                '{popup id="9907-goldentours-map" text="Click to View Map"}',
              spans: [],
            },
          ],
          align: 'Right',
          len: 78,
          labelId: 'XiprixEAACEAbg13',
        },
        {
          label: 'Ticket Type',
          content: [
            {
              type: 'paragraph',
              text: 'Mobile',
              spans: [],
            },
          ],
          align: 'Right',
          len: 6,
          labelId: 'XiprmBEAALJlbg22',
        },
        {
          label: 'Validity',
          content: [
            {
              type: 'paragraph',
              text: 'Fixed Date',
              spans: [],
            },
          ],
          align: 'Right',
          len: 10,
          labelId: 'XiprdxEAACYAbg0Y',
        },
        {
          label: 'Cancellation',
          content: [
            {
              type: 'paragraph',
              text: 'Free cancelation up to 24h',
              spans: [],
            },
          ],
          align: 'Right',
          len: 26,
          labelId: 'Xipr3REAACEAbg7w',
        },
      ],
      hidden: [
        {
          label: 'What We Love',
          content: [
            {
              type: 'list-item',
              text: 'best value on basic option',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'family tickets',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 41,
          labelId: 'Xipr7xEAALJlbg9M',
        },
        {
          label: 'Duration',
          content: [
            {
              type: 'paragraph',
              text: '1 day / 24h / 48h',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 17,
          labelId: 'XaLC4BMAAKQaPA9K',
        },
        {
          label: 'Inclusions',
          content: [
            {
              type: 'list-item',
              text: 'Boat ride ticket valid for 24h',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Recorded guide - 10 languages',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Free Wi-Fi',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Choice of 2 walking tours',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'English-speaking guide on 1 route',
              spans: [],
            },
            {
              type: 'list-item',
              text: 'Interactive 3D treasure hunt app',
              spans: [],
            },
          ],
          align: 'Hidden',
          len: 164,
          labelId: 'XeTE3BAAACMAKGGo',
        },
      ],
    },
    productImage:
      '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/ebda1c2b-d700-4c7d-8a30-051a631262b0-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-04.jpg',
    descriptionImage:
      '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/74c87bdb-c078-4a88-b15c-cf4d75f2cf8b-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-03.jpg',
    price: 28,
    scratchPrice: 28,
    currencySymbol: '£',
    tgid: 9907,
    images: [
      {
        url:
          '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/ebda1c2b-d700-4c7d-8a30-051a631262b0-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-04.jpg',
        alt: 'golden tours: london hop-on hop-off tour + free extra 24hrs-1',
        title: 'golden tours: london hop-on hop-off tour + free extra 24hrs-1',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/74c87bdb-c078-4a88-b15c-cf4d75f2cf8b-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-03.jpg',
        alt: 'golden tours: london hop-on hop-off tour + free extra 24hrs-2',
        title: 'golden tours: london hop-on hop-off tour + free extra 24hrs-2',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/89e398ff-9d0f-479d-a2f4-073e75e44451-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-02.jpg',
        alt: 'golden tours: london hop-on hop-off tour + free extra 24hrs-3',
        title: 'golden tours: london hop-on hop-off tour + free extra 24hrs-3',
      },
      {
        url:
          '//cdn-imgix.headout.com/tour/18107/TOUR-IMAGE/f2082790-6532-4cf2-b2d9-2dabceb21f61-9907-London-Golden-tours-London-Hop-On-Hop-Off-Tour-01.jpg',
        alt: 'golden tours: london hop-on hop-off tour + free extra 24hrs-4',
        title: 'golden tours: london hop-on hop-off tour + free extra 24hrs-4',
      },
    ],
    averageRating: 4.8,
    reviewCount: 282,
    ctaBooster: '36 views in last 3 hours',
    description: [
      {
        type: 'paragraph',
        text:
          "HOHO bus pass with 4 options: 1 day/24/48/72 hours. Includes the Buckingham Palace, St Paul's Cathedral, Trafalgar Square & more",
        spans: [],
      },
    ],
    available: true,
    overlayBooster: null,
    vendor: 'Golden Tours',
  },
};
export const Basic = () => {
  const isMobile = useWindowSize().width < 768;
  return (
    <ParentWrapper>
      <div style={{ width: 1200, padding: 50 }}>
        <ProductsContextProvider allTours={allTours} ready={true}>
          <TourComparisonTable isMobile={isMobile} {...data} />
        </ProductsContextProvider>
      </div>
    </ParentWrapper>
  );
};
