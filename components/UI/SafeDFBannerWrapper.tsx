import { SIZES } from 'const/ui-constants';
import { THEMES } from 'const/index';
import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { strings } from 'const/strings';
import { Shield } from 'assets/SvgIcons';
import { greenScheme } from 'style/theme';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';

import InfoBanner from './InfoBanner';
import Split, { StlyedSplit } from './Split';
import IconCTA, { StyledIconCTA } from './IconCTA';

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

const SafeDFBannerWrapper = ({
  hasSafe = false,
  dfExpiryDate,
  marginTop = null,
  isAmp = false,
}: {
  dfExpiryDate: any;
  hasSafe: boolean;
  isAmp?: boolean;
  marginTop?: number;
}) => {
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
  if (!(hasSafe || dfExpiryDate)) return null;
  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: [<SafeExperiencesPitch generic={true} key={0} />],
      title: '',
      sidePadding: isMobile ? 0 : 40,
    });
  };
  return (
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={hasSafe && !!dfExpiryDate ? 2 : 1}>
        <Conditional if={!isMobile}>
          <Conditional if={hasSafe}>
            <InfoBanner
              cta={strings.LISTICLES.KNOW_MORE}
              title={strings.SAFE_EXPERIENCE.HEADING}
              description={strings.SAFE_EXPERIENCE.GENERAL_DESCRIPTION}
              bannerOnClick={openSafeSidebar}
              icon={Shield}
              isAmp={isAmp}
              colorScheme={greenScheme}
            />
          </Conditional>
        </Conditional>
        <Conditional if={isMobile}>
          <Conditional if={hasSafe}>
            <IconCTA
              text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
              colorScheme={greenScheme}
              ctaOnClick={openSafeSidebar}
              icon={Shield}
            />
          </Conditional>
        </Conditional>
      </Split>
    </Wrapper>
  );
};

export default SafeDFBannerWrapper;
