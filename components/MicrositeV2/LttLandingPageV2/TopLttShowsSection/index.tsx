import React, { useState } from 'react';
import Conditional from 'components/common/Conditional';
import HorizontalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard';
import VerticalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard';
import { TopShowsWrapper } from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection/styles';
import Button from 'UI/Button';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { LTT_CATEGORIES } from 'const/lttCategories';
import { strings } from 'const/strings';
import { YourPickBackground, YourPickStar } from 'assets/yourPickBackground';
import BrowseByCategoriesSection from '../BrowseByCategoriesSection';

interface ITopLttShowsSectionProps {
  isMobile: boolean;
  topShows: any[];
  categoriesToRender?: any[];
  heading: string;
  showBrowseByCategories: boolean;
  isCategoryPage?: boolean;
  directTgid?: number;
}

const TopLttShowsSection = ({
  isMobile,
  topShows,
  categoriesToRender = [],
  heading,
  showBrowseByCategories,
  isCategoryPage = false,
  directTgid,
}: ITopLttShowsSectionProps) => {
  const [numberOfShowsToDisplay, setNumberOfShowsToDisplay] = useState(
    isMobile ? 18 : 36
  );

  const numberOfShowsPerFold = isMobile
    ? 18
    : topShows.length - numberOfShowsToDisplay;

  const shows = topShows.slice(0, numberOfShowsToDisplay);

  const [allowShowMore, setAllowShowMore] = useState(
    topShows.length > numberOfShowsToDisplay
  );

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

    if (numberOfShowsToShow >= topShows.length) {
      setAllowShowMore(false);
      return;
    }
  };

  return (
    <TopShowsWrapper
      id={LTT_CATEGORIES.top.name}
      className="hroizontally-aligned-child"
      $isCategoryPage={isCategoryPage}
      $hasShowCampaign={!!directTgid}
    >
      <div className="title">
        {heading || strings.LTT_LANDING_PAGE.TOP_WEST_END_SHOWS}
      </div>
      <div className="shows">
        {shows.map((show, index) => {
          const isShowCampaign = directTgid === show.tgid?.toString();

          return isMobile ? (
            <React.Fragment key={index}>
              <Conditional if={index === 3 && showBrowseByCategories}>
                <BrowseByCategoriesSection
                  categoriesToRender={categoriesToRender}
                  isMobile={isMobile}
                  showGridUI={showBrowseByCategories}
                />
              </Conditional>
              <div className="product-card-container">
                <div
                  className={`card-wrapper ${
                    isShowCampaign ? 'your-pick' : ''
                  }`}
                >
                  <Conditional if={isShowCampaign}>
                    <div className="your-pick-title">
                      <div className="text">
                        {YourPickStar}
                        <span>{strings.LTT_LANDING_PAGE.YOUR_PICK}</span>
                      </div>
                    </div>
                  </Conditional>
                  <HorizontalProductCard
                    isTopLttShow
                    product={show}
                    background="LIGHT"
                    key={show.title}
                  />
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div
              className={`card-wrapper ${isShowCampaign ? 'your-pick' : ''}`}
              key={index}
            >
              <Conditional if={isShowCampaign}>
                <div className="your-pick-title">
                  {YourPickBackground}
                  <div className="text">
                    {YourPickStar}
                    <span>{strings.LTT_LANDING_PAGE.YOUR_PICK}</span>
                  </div>
                </div>
              </Conditional>
              <VerticalProductCard
                isTopLttShow
                product={show}
                background="LIGHT"
                key={show.title}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>
      <Conditional if={allowShowMore}>
        <Button onClick={onShowMoreClicked}>
          {strings.formatString(
            strings.LTT_LANDING_PAGE.SEE_MORE_SHOWS,
            Math.min(
              numberOfShowsPerFold,
              topShows.length - numberOfShowsToDisplay
            )
          )}
        </Button>
      </Conditional>
    </TopShowsWrapper>
  );
};

export default TopLttShowsSection;
