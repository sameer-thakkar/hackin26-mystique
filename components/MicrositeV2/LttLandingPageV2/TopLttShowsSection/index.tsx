import { useState } from 'react';
import Conditional from 'components/common/Conditional';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import {
  Badge,
  TopShowsWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection/styles';
import Button from 'UI/Button';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import { TOP_SHOWS_ICON } from 'assets/SvgIcons';
import HorizontalProductCard from '../ProductCards/HorizontalProductCard';
import VerticalProductCard from '../ProductCards/VerticalProductCard';

type ITopLttShowsSectionProps = {
  isMobile: boolean;
  topShows: any[];
  totalCount: number;
};

const TopShowSvg = () => (
  <svg
    width="46"
    height="48"
    viewBox="0 0 46 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 3L14 0V3H0Z" fill="#E5006E" />
    <path
      d="M46 4C46 1.79086 44.2091 0 42 0H14V48L30 41.6842L46 48V4Z"
      fill="url(#paint0_linear_9148_142534)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9148_142534"
        x1="30"
        y1="0"
        x2="30"
        y2="48"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF5BAA" />
        <stop offset="1" stopColor="#FF017B" />
      </linearGradient>
    </defs>
  </svg>
);

const TopLttShowsSection = ({
  isMobile,
  topShows,
}: ITopLttShowsSectionProps) => {
  const numberOfShowsPerFold = isMobile ? 7 : 12;

  const [allowShowMore, setAllowShowMore] = useState(true);
  const [numberOfShowsToDisplay, setNumberOfShowsToDisplay] = useState(
    isMobile ? 8 : 12
  );
  const shows = topShows.slice(0, numberOfShowsToDisplay);

  const onShowMoreClicked = () => {
    if (!allowShowMore) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SEE_ALL_CLICKED,
        [ANALYTICS_PROPERTIES.CATEGORY]: 'Landing Page',
      });

      window.open(
        'https://www.london-theater-tickets.com/best-west-end-shows-in-london/'
      );
      return;
    }

    const numberOfShowsToShow = numberOfShowsToDisplay + numberOfShowsPerFold;

    setNumberOfShowsToDisplay(numberOfShowsToShow);
    trackEvent({
      eventName: ANALYTICS_EVENTS.PAGINATION_CLICKED,
      [ANALYTICS_PROPERTIES.PAGINATION_TYPE]: CTA_TYPE.SHOW_MORE,
      [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: numberOfShowsToDisplay,
    });

    if (
      (!isMobile && numberOfShowsToShow >= 24) ||
      (isMobile && numberOfShowsToShow >= 15)
    ) {
      setAllowShowMore(false);
      return;
    }
  };

  return (
    <TopShowsWrapper className="hroizontally-aligned-child">
      <div className="title">
        {strings.LTT_LANDING_PAGE.TOP_WEST_END_SHOWS}
        {TOP_SHOWS_ICON}
      </div>
      <div className="shows">
        {shows.map((show, index) =>
          isMobile ? (
            <>
              <Conditional if={index === 3}>
                <BrowseByCategoriesSection />
              </Conditional>
              <div className="card-wrapper">
                <TopShowBadge index={index} />
                <HorizontalProductCard
                  isTopLttShow
                  product={show}
                  background="LIGHT"
                  key={show.title}
                />
              </div>
            </>
          ) : (
            <div className="card-wrapper">
              <TopShowBadge index={index} />
              <VerticalProductCard
                isTopLttShow
                product={show}
                background="LIGHT"
                key={show.title}
                isMobile={isMobile}
              />
            </div>
          )
        )}
      </div>

      <Button onClick={onShowMoreClicked}>
        {allowShowMore ? strings.SEE_MORE_SHOWS : 'View all shows'}
      </Button>
    </TopShowsWrapper>
  );
};

const TopShowBadge = ({ index }: { index: number }) => (
  <Badge index={index + 1} className="badge">
    <TopShowSvg />
    <span className="rank">{index + 1}</span>
  </Badge>
);

export default TopLttShowsSection;
