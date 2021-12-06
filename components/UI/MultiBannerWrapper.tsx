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
import { RichText } from 'prismic-reactjs';

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
  p {
    margin: 0;
  }
  a {
    font-size: 12px;
    line-height: 16px;
    display: inline-block;
    text-decoration: underline;
    cursor: pointer;
    @media (max-width: 768px) {
      display: block;
      margin-top: 4px;
    }
  }
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 20px;
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
    primaryCity,
    lang,
  } = useContext(MBContext);

  const GENERAL_SAFETY_NOTE = {
    description: [
      {
        spans: [],
        type: 'paragraph',
        text: strings.SAFE_EXPERIENCE.GENERAL_DESCRIPTION,
      },
    ],
    heading: [
      { spans: [], type: 'paragraph', text: strings.SAFE_EXPERIENCE.HEADING },
    ],
  };
  const [isMobile, setIsMobile] = useState(isMobileCloudfront);
  const [safetyBannerData, setSafetyBannerData] = useState(GENERAL_SAFETY_NOTE);
  const width = useWindowWidth();
  useEffect(() => {
    Promise.resolve(
      getSafetyDescription(primaryCountry?.code, primaryCity, lang)
    ).then((e) => {
      e ? setSafetyBannerData(e) : setSafetyBannerData(GENERAL_SAFETY_NOTE);
    });
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

  const finalHeading = <RichText render={safetyBannerData?.heading} />;
  const showFullBanner = primaryCountry?.code === 'FR' || !isMobile;
  const description = finalHeading ? (
    <Description>
      <RichText render={safetyBannerData?.description} />
    </Description>
  ) : (
    <RichText render={safetyBannerData?.description} />
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
