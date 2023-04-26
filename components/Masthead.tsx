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

const Masthead = ({
  title,
  image,
  isMobile,
}: {
  title: string;
  isMobile: boolean;
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

  return (
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
  );
};

export default Masthead;
