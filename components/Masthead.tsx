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
  isEntertainmentMb,
}: {
  title: string;
  image: { url: string; alt: string } | null;
  isMobile: boolean;
  isEntertainmentMb: boolean;
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
        layout={'fill'}
        objectFit={'cover'}
      />
    );
  };

  return (
    <>
      {isEntertainmentMb ? (
        <StyledMasthead isEntMb={true} withoutImage={false}>
          {getImage()}
          <Title isEntMb={true} withoutImage={false}>
            {formattedTitle}
          </Title>
        </StyledMasthead>
      ) : (
        <StyledMasthead isEntMb={false} withoutImage={!image}>
          <TitleWrapper isEntMb={false} withoutImage={!image}>
            <Title isEntMb={false} withoutImage={!image}>
              {formattedTitle}
            </Title>
          </TitleWrapper>
          <Conditional if={image}>
            <ImageWrapper>
              {getImage()}
              <Conditional if={!isMobile}>
                <GradientWrapper />
              </Conditional>
            </ImageWrapper>
          </Conditional>
        </StyledMasthead>
      )}
    </>
  );
};

export default Masthead;
