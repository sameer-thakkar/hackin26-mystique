import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'components/UI/Image';
import { SOLEIL } from 'const/ui-constants';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { MBContext } from 'contexts/MBContext';

const StyledMasthead = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  overflow-x: hidden;
  img {
    width: 100vw;
    height: 400px;
    filter: brightness(0.7);
    object-fit: cover;
  }
  @media (max-width: 768px) {
    img {
      height: 300px;
    }
  }
`;

const Title = styled.h1`
  position: absolute;
  top: 50%;
  color: white;
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 2rem;
  transform: translateY(-50%);
  margin: 0;
  max-width: 792px;
  text-align: center;
  @media (max-width: 768px) {
    text-align: center;
    top: 42%;
    font-weight: 600;
    font-size: 1.5rem;
    padding: 0px 16px;
  }
`;

const Masthead = ({
  title,
  image,
  isMobile,
}: {
  title: string;
  image: { url: string; alt: string };
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
    <StyledMasthead>
      <Image
        url={image.url}
        alt={image.alt}
        width={isMobile ? 800 : 1200}
        height={isMobile ? 300 : 400}
      />
      <Title>{formattedTitle}</Title>
    </StyledMasthead>
  );
};

export default Masthead;
