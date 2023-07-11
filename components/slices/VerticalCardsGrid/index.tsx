import { TTheatreType } from 'components/slices/VerticalCardsGrid/interface';
import { Wrapper } from 'components/slices/VerticalCardsGrid/styles';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const VerticalCardsGrid = (props: any) => {
  const { data, isMobile, heading } = props;

  const handleCardClick = (theatre: {
    redirect_url: {
      url: string;
    };
    theatre_info: string;
    nearby_theatre_name: string;
  }) => {
    window.open(theatre.redirect_url.url);
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: theatre.theatre_info,
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatre.nearby_theatre_name,
    });
  };

  return (
    <Wrapper>
      <h2>{heading}</h2>
      <div className="slider">
        {data?.map((theatre: TTheatreType, index: number) => {
          return (
            <div
              className="card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(theatre)}
            >
              <Image
                url={theatre.image_url?.url}
                height={isMobile ? 208 : 240}
                width={isMobile ? 156 : 180}
                alt={theatre.nearby_theatre_name}
              />
              <div className="theatre-name">{theatre.nearby_theatre_name}</div>
              <div className="theatre-info">{theatre.theatre_info}</div>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default VerticalCardsGrid;
