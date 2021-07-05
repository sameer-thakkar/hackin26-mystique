import styled from 'styled-components';
import { FACEBOOK, TWITTER, INSTAGRAM } from 'assets/SvgIcons';
import { COLORS } from 'const/ui-constants';

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
        isEntertainmentMb ? COLORS.GREY.G5 : COLORS.WHITE};
    }
  }
`;

const SocialLinks = (props) => {
  const { className, isEntertainmentMb } = props || {};
  return (
    <StyledSocialLinks className={className}>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a
          href="http://www.facebook.com/headoutapp"
          target="_blank"
          rel="noreferrer noopener"
        >
          {FACEBOOK}
        </a>
      </SocialIcon>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a
          href="http://www.twitter.com/headout"
          target="_blank"
          rel="noreferrer noopener"
        >
          {TWITTER}
        </a>
      </SocialIcon>
      <SocialIcon isEntertainmentMb={isEntertainmentMb}>
        <a
          href="http://www.instagram.com/headoutapp"
          target="_blank"
          rel="noreferrer noopener"
        >
          {INSTAGRAM}
        </a>
      </SocialIcon>
    </StyledSocialLinks>
  );
};

export default SocialLinks;
