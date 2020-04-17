import { FACEBOOK, TWITTER, INSTAGRAM } from '../public/static/svg-icons';
import styled from 'styled-components';

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
  a {
    display: flex;
  }
  align-self: center;
  svg {
    height: 20px;
    width: 20px;
  }
`;

const SocialLinks = (props) => {
  return (
    <StyledSocialLinks className={props.className}>
      <SocialIcon>
        <a
          href="http://www.facebook.com/headoutapp"
          target="_blank"
          rel="noreferrer noopener"
        >
          {FACEBOOK}
        </a>
      </SocialIcon>
      <SocialIcon>
        <a
          href="http://www.twitter.com/headout"
          target="_blank"
          rel="noreferrer noopener"
        >
          {TWITTER}
        </a>
      </SocialIcon>
      <SocialIcon>
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
