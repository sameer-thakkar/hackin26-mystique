import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { SOCIAL_DETAILS, SOCIAL_LINKS } from 'const/footer';

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
      isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
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
  const SOCIALS = SOCIAL_DETAILS?.map((item) => {
    if (
      (pageMeta?.city as any)?.cityCode === 'DUBAI' &&
      item.id === 'INSTAGRAM'
    ) {
      item.href = SOCIAL_LINKS.INSTAGRAM_HEADOUT_DUBAI_URL;
    }
    return item;
  });

  return (
    <StyledSocialLinks className={className}>
      {SOCIALS.map((item) => {
        return (
          <SocialIcon key={item.id} isLight={isLight}>
            <a href={item.href} target="_blank" rel="noopener">
              {item.icon}
            </a>
          </SocialIcon>
        );
      })}
    </StyledSocialLinks>
  );
};

export default SocialLinks;
