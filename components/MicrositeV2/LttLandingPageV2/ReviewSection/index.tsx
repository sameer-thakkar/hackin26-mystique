import { useState } from 'react';
import dynamic from 'next/dynamic';
import SwiperType from 'swiper';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import {
  Review,
  ReviewSectionWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/ReviewSection/style';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT, STAR } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

type IReviewSectionProps = {
  isMobile: boolean;
};

const HARDCODED_REVIEWS = [
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Hung Wai',
    country: '🇭🇰 Hong Kong',
    reviewText: `We LOVEEEE it! The show is great! Very good atmosphere and everyone's 
    so happy after the play. The Headout platform is easy to use. You just scan your ticket on your phone for entry.`,
    showName: 'Tina: The Turner Musical',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Karen Kadore',
    country: '🇬🇧 United Kingdom',
    reviewText: `Ease of booking, regular updates and the text on the day with tickets, maps and easy ordering from the bar. The show was brilliant. Wonderful day!`,
    showName: 'Tina: The Turner Musical',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Lucia Quiroz',
    country: '🇨🇭 Switzerland',
    reviewText: `Headout helpdesk, was awesome when I had a problem... that at the end turn out to be my fault.
    The show was fantastic. Even my son loved it. Recommended for groups of friends and families!`,
    showName: 'Moulin Rouge! The Musical',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Karina Salby',
    country: '🇩🇰 Denmark',
    reviewText: `Very easy to book tickets, one doesn't need to print anything. An absolutely phenomenal musical experience, amazing scenery, singing and acting.`,
    showName: 'Frozen the Musical',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Itziar Iraola',
    country: '🇪🇸 Spain',
    reviewText: `The activity had a very good cast and therefore we enjoyed a quality show. The experience to book the tickets on line was easy and although I missed receiving a pdf on my email we could print them and enter the theatre with no issues.`,
    showName: 'Frozen the Musical',
    stars: 4,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Tracy Lavin',
    country: '🇺🇸 United states',
    reviewText: `We LOVED the theater experience - just amazing! Also, when I coulnd't find my tickets, your team was ever responsive in assisting!`,
    showName: 'Frozen the Musical',
    stars: 5,
  },

  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Jane Phillips',
    country: '🇬🇧 United Kingdom',
    reviewText: `The musical was fabulous especially with my granddaughter. Headout had a problem with the booking and rectified it immediately.`,
    showName: 'Matilda The Musical',
    stars: 4,
  },

  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Bernardeau Lucie',
    country: '🇫🇷 France',
    reviewText: `Booking tickets with Headout was really easy, I loved the performance and cried a lot, i think its genuinely the best thing i ever saw`,
    showName: 'Matilda The Musical',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Joanne Kelly',
    country: '🇮🇪 Ireland',
    reviewText: `Booking with Headout was very easy and received plenty of other recommendations from them for our trip to London. The Lion King was just out of this world. We had our kids (aged 8&9) with us and they loved it. We'd all love to see it again. Theatre was lovely, the seats in the Royal Circle were perfect. Fantastic experience!`,
    showName: 'The Lion King',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Andrea Szanyi',
    country: '🇭🇺 Hungary',
    reviewText: `I loved the show. The view from my seat was perfect. I had no problem with buying the ticket. I really recommend headout app 🙂`,
    showName: 'The Lion King',
    stars: 5,
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Baruch Josef',
    country: '🇮🇱 Israel',
    reviewText: `First, ordering the tickets for the show through Headout was very convenient and easy. The explanation we received on how to get to the show hall was clear and convenient. The show itself was successful, very enjoyable and a perfect experience for the price paid.`,
    showName: 'The Lion King',
    stars: 5,
  },
];

const ReviewSection = ({ isMobile }: IReviewSectionProps) => {
  const [swiper, updateSwiper] = useState<SwiperType | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  const swiperParams: SwiperProps = {
    slidesPerView: isMobile ? 1 : 3,
    spaceBetween: isMobile ? 12 : 25,
    style: isMobile ? { overflow: 'visible' } : {},
    loop: isMobile ? true : false,
    freeMode: {
      enabled: true,
    },
  };

  const goNext = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + 3;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Next',
        Category: 'Reviews Section',
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          3,
          HARDCODED_REVIEWS?.length - newIndex
        ),
      });
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - 3;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: 'Reviews Section',
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          3,
          HARDCODED_REVIEWS?.length - newIndex
        ),
      });
    }
  };

  return (
    <ReviewSectionWrapper className="hroizontally-aligned-child">
      <div className="header">
        <div className="title">
          {strings.LTT_LANDING_PAGE.LOVED_BY_MILLIONS}
        </div>
        <Conditional if={!isMobile}>
          <div className="controls">
            <LTT_CHEVRON_LEFT onClick={goPrev} disabled={activeSlideIdx <= 0} />
            <LTT_CHEVRON_RIGHT
              onClick={goNext}
              disabled={activeSlideIdx + 3 >= HARDCODED_REVIEWS.length}
            />
          </div>
        </Conditional>
      </div>
      <div className="reviews">
        <Swiper isFreeMode {...swiperParams} onSwiper={updateSwiper}>
          {HARDCODED_REVIEWS.map((review, idx) => (
            <Review key={`${review.name} ${idx}`}>
              <div className="details">
                <div className="pfp">
                  <Image
                    draggable={false}
                    url={review.user_image_url}
                    alt={`${review.name} user image`}
                    priority
                    height={44}
                    width={44}
                    autoCrop={true}
                    className={`pinned-card-vertical-image`}
                    fetchPriority="high"
                    fitCrop={true}
                  />
                </div>
                <div className="user-details">
                  <div className="left">
                    <span className="name">{review.name}</span>
                    <span className="country">{review.country}</span>
                  </div>
                  <div className="stars">
                    {Array.from({ length: review.stars }).map(() =>
                      STAR(COLORS.BRAND.CANDY)
                    )}
                  </div>
                </div>
              </div>
              <div className="text-content">{review.reviewText}</div>
              <div className="show-name">{review.showName}</div>
            </Review>
          ))}
        </Swiper>
      </div>
    </ReviewSectionWrapper>
  );
};

export default ReviewSection;
