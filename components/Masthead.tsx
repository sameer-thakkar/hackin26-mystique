import React from 'react';
import styled from 'styled-components';
import { withShortcodes } from 'utils/helper';
import { SOLEIL } from 'const/ui-constants';

import Image from './UI/Image';

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
  }
`;

const Masthead: React.FC<{
  title: string;
  image: { url: string; alt: string };
  isMobile: boolean;
}> = (props) => {
  const { title, image, isMobile } = props;
  return (
    <StyledMasthead>
      <Image
        url={image.url}
        alt={image.alt}
        width={isMobile ? 800 : 1200}
        height={isMobile ? 300 : 400}
      />
      <Title>{withShortcodes(title)}</Title>
    </StyledMasthead>
  );
};

export default Masthead;
