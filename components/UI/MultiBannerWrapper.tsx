import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import { useWindowWidth } from '@react-hook/window-size';
import { greyScheme } from 'style/theme';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { shortCodeSerializer } from 'utils/shortCodes';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';
import { SIZES } from 'const/ui-constants';
import { Shield } from 'assets/SvgIcons';
import IconCTA, { StyledIconCTA } from './IconCTA';
import InfoBanner from './InfoBanner';
import {
  getSafetyDescription,
  TSetSafetyBannerData,
} from './SafeExperiencesPitch';
import Split, { StlyedSplit } from './Split';

const SafeExperiencesPitch = dynamic(() => import('./SafeExperiencesPitch'), {
  ssr: false,
});

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  width: 100%;
  ${StlyedSplit} {
    margin-top: ${({
      // @ts-expect-error TS(2339): Property 'marginTop' does not exist on type 'Pick<... Remove this comment to see the full error message
      marginTop,
    }) => (marginTop ? marginTop : 0)}px;
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

const MultiBannerWrapper = ({
  hasSafe = false,
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'number'.
  marginTop = null,
  isMobile: isMobileCloudfront = false,
}: {
  hasSafe: boolean;
  marginTop?: number;
  isMobile?: boolean;
}) => {
  const {
    sidebarModal: { addToAside },
    primaryCountry,
    primaryCity,
    lang,
  } = useContext(MBContext);

  const [isMobile, setIsMobile] = useState(isMobileCloudfront);
  const [safetyBannerData, setSafetyBannerData] = useState<
    TSetSafetyBannerData
  >(null);
  const width = useWindowWidth();
  useEffect(() => {
    getSafetyDescription((primaryCountry as any)?.code, primaryCity, lang).then(
      (data) => {
        data
          ? setSafetyBannerData(data)
          : // @ts-expect-error TS(2345): Argument of type '{ description: { spans: never[];... Remove this comment to see the full error message
            setSafetyBannerData(GENERAL_SAFETY_NOTE);
      }
    );
    setIsMobile(width < 768);
  }, [width]);

  if (!hasSafe) return null;
  const openSafeSidebar = () => {
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '41.06vw',
      children: [<SafeExperiencesPitch generic={true} key={0} />],
      title: '',
      sidePadding: isMobile ? 0 : 40,
    });
  };

  const finalHeading = (
    <PrismicRichText
      field={(safetyBannerData as any)?.heading}
      components={shortCodeSerializer}
    />
  );
  const showFullBanner = (primaryCountry as any)?.code === 'FR' || !isMobile;
  const description = (
    <Description>
      <PrismicRichText
        field={(safetyBannerData as any)?.description}
        components={shortCodeSerializer}
      />
    </Description>
  );

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={1}>
        <Conditional if={showFullBanner}>
          <Conditional if={hasSafe && safetyBannerData}>
            <InfoBanner
              cta={strings.LISTICLES.KNOW_MORE}
              title={finalHeading}
              description={description}
              bannerOnClick={openSafeSidebar}
              icon={Shield}
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
