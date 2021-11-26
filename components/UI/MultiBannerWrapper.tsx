import { SIZES } from 'const/ui-constants';
import { THEMES } from 'const/index';
import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { strings } from 'const/strings';
import { Shield } from 'assets/SvgIcons';
import { greyScheme } from 'style/theme';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';

import InfoBanner from './InfoBanner';
import Split, { StlyedSplit } from './Split';
import IconCTA, { StyledIconCTA } from './IconCTA';
import { getSafetyDescription } from './SafeExperiencesPitch';

const SafeExperiencesPitch = dynamic(() => import('./SafeExperiencesPitch'), {
  ssr: false,
});

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  width: 100%;
  ${StlyedSplit} {
    margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
  }
  ${({ theme }) =>
    theme.theme === THEMES.DEFAULT
      ? `
    @media (max-width: 768px) {
      margin-bottom: 0;
      ${StlyedSplit} {
        grid-template-columns: auto auto;
        padding: 0 16px;
        padding-left: 32px;
        &:after {
          display: none;
        }
        grid-column-gap: 24px;
        ${StyledIconCTA} {
          border: none;
        }
      }
    }
  `
      : ``}
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 20px;
`;

const Link = styled.a`
  font-size: 12px;
  line-height: 16px;
  display: inline-block;
  text-decoration: underline;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
    margin-top: 4px;
  }
`;

const MultiBannerWrapper = ({
  hasSafe = false,
  marginTop = null,
  isAmp = false,
  isMobile: isMobileCloudfront = false,
}: {
  hasSafe: boolean;
  isAmp?: boolean;
  marginTop?: number;
  isMobile?: boolean;
}) => {
  const {
    sidebarModal: { addToAside },
    primaryCountry,
  } = useContext(MBContext);
  const [isMobile, setIsMobile] = useState(isMobileCloudfront);
  const width = useWindowWidth();
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
  if (!hasSafe) return null;
  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: [<SafeExperiencesPitch generic={true} key={0} />],
      title: '',
      sidePadding: isMobile ? 0 : 40,
    });
  };

  const finalDescription = getSafetyDescription(primaryCountry?.code);

  const finalHeading =
    primaryCountry?.code === 'FR'
      ? strings.SAFE_EXPERIENCE.EU_HEADING
      : strings.SAFE_EXPERIENCE.HEADING;
  const showFullBanner = primaryCountry?.code === 'FR' || !isMobile;
  const description = finalDescription.CTA_URL ? (
    <Description>
      {finalDescription.TEXT}{' '}
      <Link
        href={finalDescription.CTA_URL}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
      >
        {strings.SAFE_EXPERIENCE.DESCRIPTION_CTA}
      </Link>
    </Description>
  ) : (
    finalDescription.TEXT
  );

  return (
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={1}>
        <Conditional if={showFullBanner}>
          <Conditional if={hasSafe}>
            <InfoBanner
              cta={strings.LISTICLES.KNOW_MORE}
              title={finalHeading}
              description={description}
              bannerOnClick={openSafeSidebar}
              icon={Shield}
              isAmp={isAmp}
              colorScheme={greyScheme}
              isMobile={isMobile}
            />
          </Conditional>
        </Conditional>
        <Conditional if={!showFullBanner}>
          <Conditional if={hasSafe}>
            <IconCTA
              text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
              colorScheme={greyScheme}
              ctaOnClick={openSafeSidebar}
              icon={Shield}
            />
          </Conditional>
        </Conditional>
      </Split>
    </Wrapper>
  );
};

export default MultiBannerWrapper;
