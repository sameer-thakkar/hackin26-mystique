import { useMemo } from 'react';
import styled from 'styled-components';
import { SliceZone } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import { sliceComponents } from 'components/slices/sliceManager';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { TLinkSlices } from './interface';
import { Container } from './style';

const FooterLinksWrapper = styled.div<{
  $isCatOrSubCatPage: boolean;
}>`
  padding-bottom: 2.13rem;
  &.primary-footer {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .quick-links-title {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.GRAY.G2};
    margin-bottom: 1.5rem;
  }
  &.primary-footer + .secondary-footer .quick-links-title {
    display: none;
  }
  &.primary-footer + .secondary-footer .quick-links-title.has-custom-title {
    display: block;
  }
  &.secondary-footer {
    padding-bottom: 0;
    margin-top: 0;
  }
  .quick-links {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    display: flex;
    flex-wrap: wrap;
    .footer_column {
      display: contents;
    }
  }
`;

export const LinkSlices = ({
  linksTitle,
  slices,
  theme,
  className = '',
  isCatOrSubCatPage,
}: TLinkSlices) => {
  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  return (
    <FooterLinksWrapper
      className={className}
      $isCatOrSubCatPage={isCatOrSubCatPage}
    >
      <Container>
        <Conditional if={theme !== THEMES.MIN_BLUE}>
          <div
            className={`quick-links-title ${
              linksTitle ? 'has-custom-title' : ''
            }`}
          >
            {linksTitle || strings.FOOTER.QUICK_LINKS}
          </div>
        </Conditional>
        <div className="quick-links">
          <Conditional if={theme === THEMES.MIN_BLUE}>
            <div className={`quick-links-heading`}>
              <div className="quick-links-title">
                {linksTitle || strings.FOOTER.QUICK_LINKS}
              </div>
            </div>
          </Conditional>
          <SliceZone
            slices={slices}
            components={components}
            context={{ sliceLength: slices.length }}
            defaultComponent={() => null}
          />
        </div>
      </Container>
    </FooterLinksWrapper>
  );
};
