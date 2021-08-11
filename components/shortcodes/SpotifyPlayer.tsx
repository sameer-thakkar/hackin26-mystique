import React from 'react';
import styled from 'styled-components';

const SpotifyContainer = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
  margin: 16px 0;
  border-radius: 8px;
`;

const StyledIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: none;
  height: ${({ height }) => (height ? height : '100%')};
`;

type SpotifyPlayerProps = {
  albumid?: string;
  height?: string;
};

/**
 *
 * Use the `spotify-player` shortcode to embed spotify player matching a albumId (albumid can be obtained from embed URL).
 *
 * ex: for https://open.spotify.com/embed/album/3ZnRypvLKFfwTw4KSpLIXz
 *
 * albumid is `3ZnRypvLKFfwTw4KSpLIXz`
 *
 * Example Use:
 *
 * ```js
 * {spotify-player albumid="3ZnRypvLKFfwTw4KSpLIXz"}
 * ```
 *
 */

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  albumid,
  height,
  ...otherProps
}) => {
  const isPlaylist = otherProps['isplaylist'];
  return (
    <SpotifyContainer {...{ paddingBottom: height || '150px', ...otherProps }}>
      <StyledIFrame
        src={`https://open.spotify.com/embed/${
          isPlaylist === '1' ? `playlist` : `album`
        }/${albumid}`}
        border="0"
        {...otherProps}
      />
    </SpotifyContainer>
  );
};

export default SpotifyPlayer;
