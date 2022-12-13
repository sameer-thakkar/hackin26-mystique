import React, { useContext, useEffect } from 'react';
import Image from 'components/UI/Image';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { MBContext } from 'contexts/MBContext';
import {
  GradientWrapper,
  ImageWrapper,
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
  image: { url: string; alt: string } | null;
  isMobile: boolean;
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
    <StyledMasthead withoutImage={image === null}>
      {image ? (
        <>
          <TitleWrapper withoutImage={false}>
            <Title withoutImage={false}>{formattedTitle}</Title>
          </TitleWrapper>
          <ImageWrapper>
            <Image
              url={image.url}
              alt={image?.alt}
              width={isMobile ? 800 : 1200}
              height={isMobile ? 300 : 400}
              fill
            />
            <Conditional if={!isMobile}>
              <GradientWrapper />
            </Conditional>
          </ImageWrapper>
        </>
      ) : (
        <TitleWrapper withoutImage={true}>
          <Title withoutImage={true}>{formattedTitle}</Title>
        </TitleWrapper>
      )}
    </StyledMasthead>
  );
};

export default Masthead;
