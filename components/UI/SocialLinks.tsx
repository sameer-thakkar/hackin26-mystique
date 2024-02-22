import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import Facebook from 'assets/facebook';
import Instagram from 'assets/instagram';
import Twitter from 'assets/twitter';

const StyledSocialLinks = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 15px;
  @media (max-width: 768px) {
    justify-content: left;
  }
`;

const SocialIcon = styled.div`
  display: flex;
  align-self: center;
  a {
    display: flex;
  }
  svg {
    height: 20px;
    width: 20px;
    path {
      fill: ${({
        // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
        isEntertainmentMb,
      }) => (isEntertainmentMb ? COLORS.GRAY.G5 : COLORS.BRAND.WHITE)};
    }
  }
`;

const FB_URL = 'https://www.facebook.com/headoutapp';
const TWITTER_URL = 'https://www.twitter.com/headout';
const INSTAGRAM_HEADOUT_URL = 'https://www.instagram.com/headout/';
const INSTAGRAM_HEADOUT_DUBAI_URL = 'https://www.instagram.com/headoutuae/';

const SocialLinks = (props: any) => {
  const { className, isEntertainmentMb } = props || {};
  const pageMeta = useRecoilValue(metaAtom);

  const getInstagramLink = () => {
    switch ((pageMeta?.city as any)?.cityCode) {
      case 'DUBAI':
        return INSTAGRAM_HEADOUT_DUBAI_URL;
      default:
        return INSTAGRAM_HEADOUT_URL;
    }
  };

  return (
    <StyledSocialLinks className={className}>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={FB_URL} target="_blank" rel="noreferrer noopener">
          {Facebook}
        </a>
      </SocialIcon>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={TWITTER_URL} target="_blank" rel="noreferrer noopener">
          {Twitter}
        </a>
      </SocialIcon>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={getInstagramLink()} target="_blank" rel="noreferrer noopener">
          {Instagram}
        </a>
      </SocialIcon>
    </StyledSocialLinks>
  );
};

export default SocialLinks;
