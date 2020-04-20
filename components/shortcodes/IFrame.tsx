import React from 'react';
import styled from 'styled-components';

type IFrameProps = {
  name?: string;
  src: string;
  frameborder?: number | string;
  allow?: string;
  allowfullscreen?: string;
};

const IFrameContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 35px;
  height: 0;
  overflow: hidden;
`;

const StyledIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/**
 *
 * Use the `iframe` shortcode to embed different media (videos, other websites etc.).
 *
 * Example Use:
 *
 * ```js
 * {iframe src="https://www.youtube.com/embed/GrrpLGAD_Y0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope
 * picture-in-picture" allowfullscreen}
 * ```
 *
 */

const IFrame: React.FC<IFrameProps> = ({
  name,
  src,
  frameborder = 0,
  allow = '',
  allowfullscreen = 'false',
}) => {
  const allowFullScreen = allowfullscreen === 'false' ? false : true;
  if (!src) {
    return null;
  }
  return (
    <IFrameContainer>
      <StyledIFrame
        {...(name && { name })}
        src={src}
        frameBorder={Number(frameborder)}
        allow={allow}
        allowFullScreen={allowFullScreen}
      />
    </IFrameContainer>
  );
};

export default IFrame;
