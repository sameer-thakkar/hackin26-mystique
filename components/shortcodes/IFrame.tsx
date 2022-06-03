import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import styled from 'styled-components';
import { trackEvent } from 'utils/analytics';

import { withAmp } from '../common/withAmp';

type IFrameProps = {
  name?: string;
  src: string;
  frameborder?: number | string;
  allow?: string;
  allowfullscreen?: string;
  height?: string;
  isAmp?: boolean;
};

const IFrameContainer = styled.div`
  position: relative;
  padding-bottom: ${({ paddingBottom }) =>
    paddingBottom ? paddingBottom : '56.25%'};
  padding-top: ${({ isAmp }) => (isAmp ? '0' : '35px')};
  height: 0;
  overflow: hidden;
`;

const StyledIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => (height ? height : '100%')};
`;

const getVideoIdFromUrl = (url) => {
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return url[2] !== undefined ? url[2].split(/[^0-9a-z_-]/i)[0] : url[0];
};

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
  isAmp,
  ...otherProps
}) => {
  const allowFullScreen = allowfullscreen === 'false' ? false : true;
  const pageMetaData = useRecoilValue(metaAtom);
  if (!src) {
    return null;
  }
  const videoId = getVideoIdFromUrl(src);
  const isYoutube = src.startsWith('https://www.youtube.com');
  const trackVideoPlayed = (e) => {
    e.currentTarget.dataset.playing = !e.currentTarget.dataset?.playing;
    if (e.currentTarget.dataset.playing)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_VIDEO_PLAYED,
        [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      });
  };
  const ampIframe = isYoutube ? (
    <IFrameContainer {...{ paddingBottom: otherProps.height, isAmp }}>
      <amp-youtube
        width="1600"
        height="900"
        layout="responsive"
        data-videoid={videoId}
      />
    </IFrameContainer>
  ) : (
    <IFrameContainer {...{ paddingBottom: otherProps.height, isAmp }}>
      <amp-iframe
        width="1600"
        height="900"
        sandbox="allow-scripts allow-same-origin"
        layout="responsive"
        frameborder="0"
        src={src}
      />
    </IFrameContainer>
  );
  return (
    <>
      {isAmp ? (
        ampIframe
      ) : (
        <IFrameContainer
          {...{ paddingBottom: otherProps.height, isAmp }}
          onClick={isYoutube ? trackVideoPlayed : null}
        >
          <StyledIFrame
            {...(name && { name })}
            src={src}
            frameBorder={Number(frameborder)}
            allow={allow}
            allowFullScreen={allowFullScreen}
            {...otherProps}
          />
        </IFrameContainer>
      )}
    </>
  );
};

export default withAmp(IFrame);
