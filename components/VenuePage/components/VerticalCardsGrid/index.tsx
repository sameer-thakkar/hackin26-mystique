import React from 'react';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TTheatreType, TVerticalCardsGridProps } from './interface';
import { Wrapper } from './styles';

const VerticalCardsGrid: React.FC<
  React.PropsWithChildren<TVerticalCardsGridProps>
> = (props) => {
  const { data, isMobile, heading } = props;

  const handleCardClick = (
    redirectUrl: string,
    nearbyTheatreName: string,
    nearbyTheatreRunningShowName: string
  ) => {
    window.open(redirectUrl);
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: nearbyTheatreRunningShowName,
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: nearbyTheatreName,
    });
  };

  return (
    <Conditional if={data?.length > 0}>
      <Wrapper>
        <h2>{heading}</h2>
        <div className="slider">
          {data?.map((theatre: TTheatreType, index: number) => {
            const {
              redirectUrl,
              nearbyTheatreName,
              nearbyTheatreRunningShowName,
              verticalImageUrl,
            } = theatre ?? {};
            return (
              <div
                className="card"
                key={index}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleCardClick(
                    redirectUrl,
                    nearbyTheatreName,
                    nearbyTheatreRunningShowName
                  )
                }
              >
                <div className="image-wrapper">
                  <Image
                    url={verticalImageUrl ?? ''}
                    height={isMobile ? 208 : 240}
                    width={isMobile ? 156 : 180}
                    alt={nearbyTheatreName}
                    loadHigherQualityImage={true}
                  />
                </div>
                <div className="theatre-name">{nearbyTheatreName}</div>
                <div className="theatre-info">
                  {nearbyTheatreRunningShowName}
                </div>
              </div>
            );
          })}
        </div>
      </Wrapper>
    </Conditional>
  );
};

export default VerticalCardsGrid;
