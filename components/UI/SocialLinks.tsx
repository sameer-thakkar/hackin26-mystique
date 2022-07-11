import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { FACEBOOK, TWITTER, INSTAGRAM } from 'assets/SvgIcons';
import COLORS from 'const/colors';

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
      fill: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G5 : COLORS.BRAND.WHITE};
    }
  }
`;

const FB_URL = 'http://www.facebook.com/headoutapp';
const TWITTER_URL = 'http://www.twitter.com/headout';
const INSTAGRAM_HEADOUT_URL = 'http://www.instagram.com/headout';
const INSTAGRAM_HEADOUT_DUBAI_URL = 'https://www.instagram.com/headoutuae/';

const SocialLinks = (props) => {
  const { className, isEntertainmentMb } = props || {};
  const pageMeta = useRecoilValue(metaAtom);

  const getInstagramLink = () => {
    switch (pageMeta?.city?.cityCode) {
      case 'DUBAI':
        return INSTAGRAM_HEADOUT_DUBAI_URL;
      default:
        return INSTAGRAM_HEADOUT_URL;
    }
  };

  return (
    <StyledSocialLinks className={className}>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={FB_URL} target="_blank" rel="noreferrer noopener">
          {FACEBOOK}
        </a>
      </SocialIcon>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={TWITTER_URL} target="_blank" rel="noreferrer noopener">
          {TWITTER}
        </a>
      </SocialIcon>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a href={getInstagramLink()} target="_blank" rel="noreferrer noopener">
          {INSTAGRAM}
        </a>
      </SocialIcon>
    </StyledSocialLinks>
  );
};

export default SocialLinks;
