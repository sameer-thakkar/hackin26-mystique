import { strings } from 'const/strings';
import {
  CheckSheildSVG,
  ClockIllustrationSVG,
  DollarSignSVG,
  PremiumCapSVG,
} from 'assets/airportTransfers/privateAirportTransfers';

export const BANNER_IMG_URL =
  'https://cdn-imgix.headout.com/media/images/1e91c3e1e1a1c62d8a88bc2ffddc9a3b-25028---London---Private-Transfers--Stansted-Airport---Central-London---03.jpg';

export const PRIVATE_AT_FEATURES_DATA = (localisedStrings: typeof strings) => [
  {
    icon: <DollarSignSVG />,
    title: localisedStrings.PRIVATE_AT_LANDING_PAGE.BEST_PRICES,
    description: localisedStrings.PRIVATE_AT_LANDING_PAGE.BEST_PRICES_SUBTEXT,
  },
  {
    icon: <ClockIllustrationSVG />,
    title: localisedStrings.PRIVATE_AT_LANDING_PAGE.FREE_WAIT_TIME,
    description:
      localisedStrings.PRIVATE_AT_LANDING_PAGE.FREE_WAIT_TIME_SUBTEXT,
  },
  {
    icon: <PremiumCapSVG />,
    title: localisedStrings.PRIVATE_AT_LANDING_PAGE.COMFORTABLE_RIDE,
    description:
      localisedStrings.PRIVATE_AT_LANDING_PAGE.COMFORTABLE_RIDE_SUBTEXT,
  },
  {
    icon: <CheckSheildSVG />,
    title: localisedStrings.PRIVATE_AT_LANDING_PAGE.FREE_CANCELLATION,
    description:
      localisedStrings.PRIVATE_AT_LANDING_PAGE.FREE_CANCELLATION_SUBTEXT,
  },
];

export const PRIVATE_AT_REVIEWS = [
  {
    review_text:
      'Very satisfied with this service. I was met at the airport and then driven to the hotel in a luxurious car. The driver was impeccable and very friendly. I highly recommend this service.',
    reviewer_name: 'Murg Cosmin',
    reviewer_subtext: 'Romania',
    reviewer_country_code: 'ro',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/7c38e7fde816463d60f055d5007847fa-Romanian-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Murg's profile picture",
    rating: 5,
  },
  {
    review_text:
      'The driver arrived half an hour before the appointment, which was very good for us to anticipate the arrival at the airport, he was very kind. The experience was perfect.',
    reviewer_name: 'María Carmen',
    reviewer_subtext: 'Spain',
    reviewer_country_code: 'es',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/8dae9e3986c662527078530e479c6533-Spanish-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "María's profile picture",
    rating: 5,
  },
  {
    review_text:
      "The service was outstanding. I spent half as much as with a simple airport service arranged by my hotel, the service was accurate, fast and without any problems. The driver dropped me off directly in front of the 'international departures entrance. I did not take advantage of the services ' free water, free wifi' because I did not need it but if the driver had offered it to me I probably would have taken advantage of it. Anyway reservation absolutely to do. Thank you",
    reviewer_name: 'Davide Ciola',
    reviewer_subtext: 'Italy',
    reviewer_country_code: 'it',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/417b792f461c65f95740e87e2989c490-Italian-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Davide's profile picture",
    rating: 4.5,
  },
  {
    review_text:
      'High quality vehicle, timely pick up and scenic route to the airport to avoid the motorway traffic!',
    reviewer_name: 'Barbara Mary Saunders',
    reviewer_subtext: 'United Kingdom',
    reviewer_country_code: 'gb',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/a0edf96660041fcc6583542f815615ea-United-Kingdom-Guest-2-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Barbara's profile picture",
    rating: 5,
  },
  {
    review_text:
      'The driver was lovely and explained things to us as it was our first time in Paris',
    reviewer_name: 'Abisola Daudu',
    reviewer_subtext: 'United Kingdom',
    reviewer_country_code: 'gb',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/fe88ba98b365d783ef1fd2d11764a4bc-United-Kingdom-Guest-3-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Abisola's profile picture",
    rating: 4,
  },
  {
    review_text:
      'Easy booking, driver was friendly and polite, car was clean and tidy. Took all the stress out of our transfer, thank you!',
    reviewer_name: 'Jo-Anne Wendy Humboldt',
    reviewer_subtext: 'Australia',
    reviewer_country_code: 'au',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/900ea9b2cdbf563817cd952535d62b46-Australian-Guest--London--AT--LP.jpg',
    },
    reviewer_image_alt: "Jo-Anne's profile picture",
    rating: 4,
  },
  {
    review_text:
      'The overall booking and travelling experience was great. I and my family from india used this service to travel to Abu Dhabi from the Dubai Airport. A person named Amjad Ali greeted us, initially with whatsapp message 100 minutes before our landing time - which built confidence that the taxi would be waiting for us when we are done with the immigration and baggage reclaimation. The driver and the meeting person waited for another 30 minutes after our pickup time as i had to collect the sim and nol card from the airport. The taxi was in good condition, and had child seat as well, with enough storage space and comfortable seats. the ride was also smooth , overall a good experience and surely worth recommendation and reusing again next time. Thanks headout for a great start to our international trip. unforunately, i did not take any pictures as we were tired from the travel and immigration and baggage reclaimation.',
    reviewer_name: 'Nileshkumar Chhallani',
    reviewer_subtext: 'India',
    reviewer_country_code: 'in',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/0d8ee2cc68e736f718ec072cff8b2fd5-Indian-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Nileshkumar's profile picture",
    rating: 5,
  },
  {
    review_text:
      'The app was very easy to use, offered great prices and booking was easy.The taxi service for the airport was excellent.The driver was on time and remained in communication before arrival.I highly recommend using headout to get the best service for the best price.',
    reviewer_name: 'Haroon Rashid',
    reviewer_subtext: 'United Kingdom',
    reviewer_country_code: 'gb',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/2a3cdef8d3a6727e03b3861189f182e4-United-Kingdom-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Haroon's profile picture",
    rating: 4.5,
  },
  {
    review_text:
      'My experience was extraordinary because of the profesionality of the driver, his attention and he was a very kindled man. Thank you very much!',
    reviewer_name: 'Juan Carlos Cava Almohalla',
    reviewer_subtext: 'Spain',
    reviewer_country_code: 'es',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/4eec82aff9d07a611c4270797f1c4caf-Spanish-Guest-2-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Juan's profile picture",
    rating: 5,
  },
  {
    review_text:
      'Easy to book. Great communication! Van was clean and comfy! I would book again.',
    reviewer_name: 'Denise Gutierrez',
    reviewer_subtext: 'United States',
    reviewer_country_code: 'us',
    reviewer_image_url: {
      link_type: 'Web',
      url: 'https://cdn-imgix.headout.com/media/images/1e910d8b9c40a3c9f0b7eb747dd725bc-United-States-Guest-London--AT--LP.jpg',
    },
    reviewer_image_alt: "Denise's profile picture",
    rating: 5,
  },
];
export const WORLDMAP_CITIES_IMAGE_URL =
  'https://cdn-imgix.headout.com/airport-transfer-mbs/images/worldmap-city-markers.png';
export const CUSTOMERS_TILE_BG_URL =
  'https://cdn-imgix.headout.com/media/images/13f66de7f5b932244cb5620d723ca2a1-Familyexitingairportterminal.jpg';
export const TRUSTPILOT_IMAGE_BG_URL =
  'https://cdn-imgix.headout.com/media/images/5611b95ea192a57f66cc54c367fd183e-Trustpilot-Driver-London--AT--LP.jpg';

export const TRUSTED_DRIVERS_IMAGE_BG_URL =
  'https://cdn-imgix.headout.com/media/images/d54f0dac6c9fa8cbcfd4caa65a303d20-25621-new-york-city-private-airport-transfers-fromto-laguardia-airport-04.jpg';

export const CARS_DATA = [
  {
    title: 'Sedan',
    guests: 4,
    luggage: 2,
    carList: 'Toyota Prius, Nissan Versa, Buick GL8 or similar',
    imageUrl:
      'https://cdn-imgix.headout.com/media/images/150ae1e98888d72374718eea76762df7-Desktop-Sedan-London%2C-AT--LP.jpg',
  },
  {
    title: 'Business sedan',
    guests: 4,
    luggage: 2,
    carList: 'Mercedes-Benz E-klasse AMG, Lexus IS or similar',
    imageUrl:
      'https://cdn-imgix.headout.com/media/images/ab08ef3bd9c8c6e36405812af17c140e-Desktop-Business-Sedan-London%2C-AT--LP.jpg',
  },
  {
    title: 'Van',
    guests: 6,
    luggage: 6,
    carList: 'Toyota Hiace, Mercedes-Benz Viano or similar',
    imageUrl:
      'https://cdn-imgix.headout.com/media/images/a7a082e93d3c493440dbb2504319429c-Desktop-Van-London%2C-AT--LP.jpg',
  },
  {
    title: 'Minibus',
    guests: 8,
    luggage: 8,
    carList: 'Toyota Hiace, Mercedes-Benz Vito, Buick GL8 or similar',
    imageUrl:
      'https://cdn-imgix.headout.com/media/images/a1b8d33ec936399ad5b190ea42ac2db7-Desktop-Minibus-London%2C-AT--LP.jpg',
    imageAlt: 'Minibus',
  },
];
