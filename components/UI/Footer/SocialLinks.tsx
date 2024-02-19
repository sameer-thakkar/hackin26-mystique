import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { SOCIAL_DETAILS, SOCIAL_LINKS } from 'const/footer';
import Instagram from 'assets/instagram';

const StyledSocialLinks = styled.ul`
  display: flex;
  justify-content: flex-start;
  gap: 0.3rem;
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
    fill: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkColor
        : theme.footer.primaryLinkColor};
  }

  &:hover svg {
    fill: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkHoverColor
        : theme.footer.primaryLinkHoverColor};
  }
`;

const SocialLinks = (props: any) => {
  const { className, isLight } = props || {};
  const pageMeta = useRecoilValue(metaAtom);

  let SOCIALS = [...SOCIAL_DETAILS];

  if ((pageMeta?.city as any)?.cityCode === 'DUBAI')
    SOCIALS = [
      ...SOCIAL_DETAILS,
      {
        href: SOCIAL_LINKS.INSTAGRAM_HEADOUT_DUBAI_URL,
        icon: Instagram,
      },
    ];
  else
    SOCIALS = [
      ...SOCIAL_DETAILS,
      {
        href: SOCIAL_LINKS.INSTAGRAM_HEADOUT_URL,
        icon: Instagram,
      },
    ];

  return (
    <StyledSocialLinks className={className}>
      {SOCIALS.map((item, index) => {
        return (
          <SocialIcon key={index} isLight={isLight}>
            <a href={item.href} target="_blank" rel="noreferrer noopener">
              {item.icon}
            </a>
          </SocialIcon>
        );
      })}
    </StyledSocialLinks>
  );
};

export default SocialLinks;
