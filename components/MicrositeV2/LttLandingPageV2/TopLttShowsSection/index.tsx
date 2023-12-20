import React, { useState } from 'react';
import Conditional from 'components/common/Conditional';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import HorizontalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard';
import VerticalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard';
import {
  Badge,
  TopShowsWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection/styles';
import Button from 'UI/Button';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { LTT_CATEGORIES } from 'const/lttCategories';
import { strings } from 'const/strings';

interface ITopLttShowsSectionProps {
  isMobile: boolean;
  topShows: any[];
  categoriesToRender?: any[];
  heading: string;
  showBrowseByCategories: boolean;
  isCategoryPage?: boolean;
}

const TopLttShowsSection = ({
  isMobile,
  topShows,
  categoriesToRender = [],
  heading,
  showBrowseByCategories,
  isCategoryPage = false,
}: ITopLttShowsSectionProps) => {
  const numberOfShowsPerFold = isMobile ? 10 : 24;

  const [allowShowMore, setAllowShowMore] = useState(
    !(topShows.length < numberOfShowsPerFold)
  );
  const [numberOfShowsToDisplay, setNumberOfShowsToDisplay] = useState(
    isMobile ? 10 : 24
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
      (!isMobile && numberOfShowsToShow >= 108) ||
      (isMobile && numberOfShowsToShow >= 100) ||
      numberOfShowsToShow > topShows.length
    ) {
      setAllowShowMore(false);
      return;
    }
  };

  return (
    <TopShowsWrapper
      id={LTT_CATEGORIES.top.name}
      className="hroizontally-aligned-child"
      $isCategoryPage={isCategoryPage}
    >
      <div className="title">
        {heading || strings.LTT_LANDING_PAGE.TOP_WEST_END_SHOWS}
      </div>
      <div className="shows">
        {shows.map((show, index) =>
          isMobile ? (
            <React.Fragment key={index}>
              <Conditional if={index === 3 && showBrowseByCategories}>
                <BrowseByCategoriesSection
                  categoriesToRender={categoriesToRender}
                  isMobile={isMobile}
                />
              </Conditional>
              <div className="card-wrapper">
                <Conditional if={index < 10}>
                  <TopShowBadge index={index} />
                </Conditional>
                <HorizontalProductCard
                  isTopLttShow
                  product={show}
                  background="LIGHT"
                  key={show.title}
                />
              </div>
            </React.Fragment>
          ) : (
            <div className="card-wrapper" key={index}>
              <Conditional if={index < 12}>
                <TopShowBadge index={index} />
              </Conditional>
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
      <Conditional if={allowShowMore}>
        <Button onClick={onShowMoreClicked}>
          {allowShowMore ? strings.SEE_MORE_SHOWS : 'View all shows'}
        </Button>
      </Conditional>
    </TopShowsWrapper>
  );
};

const TopShowBadge = ({ index }: { index: number }) => (
  <Badge index={index + 1} className="badge">
    <span className="rank">{index + 1}</span>
  </Badge>
);

export default TopLttShowsSection;
