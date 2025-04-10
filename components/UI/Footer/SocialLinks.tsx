import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { SOCIAL_DETAILS, SOCIAL_LINKS } from 'const/footer';

const StyledSocialLinks = styled.ul`
  display: flex;
  justify-content: flex-start;
  gap: 0.1875rem;
  align-items: center;
  padding-left: 0;
`;

const SocialIcon = styled.li<{
  isLight: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.867rem;
  height: 1.867rem;

  & svg {
    color: ${({ theme, isLight }) =>
      isLight ? theme.footer.secondaryLinkColor : theme.footer.primaryColor};
  }

  &:hover svg {
    color: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkHoverColor
        : theme.footer.primaryLinkHoverColor};
  }
`;

const SocialLinks = (props: any) => {
  const { className, isLight } = props || {};
  const pageMeta = useRecoilValue(metaAtom);
  const isUAEMB =
    pageMeta?.country?.code === 'AE' ||
    pageMeta?.country?.displayName === 'United Arab Emirates';

  return (
    <StyledSocialLinks className={className}>
      {SOCIAL_DETAILS.map((item) => {
        const { id, href, icon } = item;
        const isUAEInstagram = id === 'INSTAGRAM' && isUAEMB;

        return (
          <SocialIcon key={id} isLight={isLight}>
            <a
              href={
                isUAEInstagram ? SOCIAL_LINKS.INSTAGRAM_HEADOUT_DUBAI_URL : href
              }
              target="_blank"
              rel="noopener"
            >
              {icon}
            </a>
          </SocialIcon>
        );
      })}
    </StyledSocialLinks>
  );
};

export default SocialLinks;
