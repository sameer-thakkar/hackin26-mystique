import styled from 'styled-components';
import {
  ImageGalleryWrapper,
  ReviewInfo,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ScaledCard = styled.div<{
  $isClicked: boolean;
  $isDrawer: boolean;
}>`
  scale: ${({ $isClicked, $isDrawer }) =>
    $isClicked && !$isDrawer ? '0.98' : '1'} !important;
  transition: scale 50ms ease-in-out 0s;
`;

export const BottomSheetContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const ContentContainer = styled.div`
  background: ${COLORS.BRAND.WHITE};
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  overflow: hidden;

  ul {
    padding-left: 1.5rem;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    text-align: left;
  }
`;

export const ImageGalleryContainer = styled.div`
  ${ImageGalleryWrapper} {
    z-index: 10001; // header is 10000

    ${ReviewInfo} {
      width: calc(100vw - 3rem);
    }
  }
`;
