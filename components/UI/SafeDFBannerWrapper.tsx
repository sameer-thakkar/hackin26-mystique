import * as labels from 'constants/localization/labels';
import Split, { StlyedSplit } from './Split';
import InfoBanner from './InfoBanner';
import { BrownTicket, Shield } from 'assets/SvgIcons';
import { brownScheme, greenScheme } from 'style/theme';
import DiscountedFuturesPitch from './DiscountedFuturesPitch';
import SafeExperiencesPitch from './SafeExperiencesPitch';
import { useContext, useState, useEffect } from 'react';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import styled from 'styled-components';
import { SIZES } from 'constants/ui-constants';
import { DATE_FORMAT_TYPES, THEMES } from 'constants/index';
import IconCTA, { StyledIconCTA } from './IconCTA';
import { useWindowWidth } from '@react-hook/window-size';
import useLocalisedDate from 'hooks/useLocalisedDate';

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
    lang,
  } = useContext(MBContext);
  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
  const finalDFExpiryDate = useLocalisedDate(
    dfExpiryDate,
    DATE_FORMAT_TYPES.SHORT
  );
  if (!(hasSafe || dfExpiryDate)) return null;
  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: [<SafeExperiencesPitch generic={true} key={0} />],
      title: '',
      sidePadding: isMobile ? 0 : 40,
    });
  };
  const openDFPitchSidebar = () => {
    addToAside({
      width: '27.5vw',
      children: [
        <DiscountedFuturesPitch dfExpiryDate={finalDFExpiryDate} key={0} />,
      ],
      title: '',
    });
  };
  return (
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={hasSafe && !!dfExpiryDate ? 2 : 1}>
        <Conditional if={!isMobile}>
          <Conditional if={hasSafe}>
            <InfoBanner
              cta={labels[lang].LISTICLES.KNOW_MORE}
              title={labels[lang].SAFE_EXPERIENCE.HEADING}
              description={labels[lang].SAFE_EXPERIENCE.GENERAL_DESCRIPTION}
              bannerOnClick={openSafeSidebar}
              icon={Shield}
              isAmp={isAmp}
              colorScheme={greenScheme}
            />
          </Conditional>

          <Conditional if={dfExpiryDate}>
            <InfoBanner
              cta={labels[lang].LISTICLES.KNOW_MORE}
              title={labels[lang].DISCOUNTED_FUTURES.HEADING}
              description={labels[
                lang
              ].DISCOUNTED_FUTURES.SHORT_DESCRIPTION.replace(
                '<date>',
                finalDFExpiryDate
              )}
              bannerOnClick={openDFPitchSidebar}
              icon={BrownTicket}
              isAmp={isAmp}
              colorScheme={brownScheme}
            />
          </Conditional>
        </Conditional>
        <Conditional if={isMobile}>
          <Conditional if={hasSafe}>
            <IconCTA
              text={labels[lang].SAFE_EXPERIENCE.FLAG_TEXT}
              colorScheme={greenScheme}
              ctaOnClick={openSafeSidebar}
              icon={Shield}
            />
          </Conditional>
          <Conditional if={dfExpiryDate}>
            <IconCTA
              text={labels[lang].DISCOUNTED_FUTURES.FLAG_TEXT}
              colorScheme={brownScheme}
              ctaOnClick={openDFPitchSidebar}
              icon={BrownTicket}
            />
          </Conditional>
        </Conditional>
      </Split>
    </Wrapper>
  );
};

export default SafeDFBannerWrapper;
