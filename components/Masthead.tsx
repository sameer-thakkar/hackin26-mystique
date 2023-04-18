import React, { useContext, useEffect } from 'react';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { MBContext } from 'contexts/MBContext';
import {
  MobileTitle,
  Wrapper,
  StyledMasthead,
  Title,
  TitleWrapper,
} from 'components/MastheadStyles';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';

const Masthead = ({
  title,
  image,
  isMobile,
  isEntertainmentMb,
}: {
  title: string;
  isMobile: boolean;
  isEntertainmentMb: boolean;
  image: { url: string; alt: string } | null;
}) => {
  const { lang } = useContext(MBContext);
  const formattedTitle = withShortcodes(title);
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.TGIDS]: null,
      [ANALYTICS_PROPERTIES.MB_NAME]: formattedTitle?.join(''),
    });
  }, []);

  const getImage = () => {
    return !image?.url ? null : (
      <Image
        url={image?.url}
        alt={image?.alt}
        width={isMobile ? 800 : 1200}
        height={isMobile ? 300 : 400}
        fill
      />
    );
  };

  return (
    <>
      {isEntertainmentMb ? (
        <StyledMasthead
          isEntMb={true}
          withoutImage={false}
          imageUrl={image?.url}
        >
          {getImage()}
          <Title isEntMb>{formattedTitle}</Title>
        </StyledMasthead>
      ) : (
        <>
          <StyledMasthead
            isEntMb={false}
            withoutImage={!image}
            imageUrl={image?.url}
          >
            <Conditional if={!isMobile}>
              <Wrapper>
                <TitleWrapper>
                  <Title isEntMb={false}>{formattedTitle}</Title>
                </TitleWrapper>
              </Wrapper>
            </Conditional>
          </StyledMasthead>
          <Conditional if={isMobile}>
            <MobileTitle withoutImage={!image}>{formattedTitle}</MobileTitle>
          </Conditional>
        </>
      )}
    </>
  );
};

export default Masthead;
