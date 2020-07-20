import * as labels from 'constants/localization/labels';
import Split, { StlyedSplit } from './Split';
import InfoBanner from './InfoBanner';
import { BrownTicket, Shield } from 'assets/SvgIcons';
import { brownScheme, greenScheme } from 'style/theme';
import DiscountedFuturesPitch from './DiscountedFuturesPitch';
import SafeExperiencesPitch from './SafeExperiencesPitch';
import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import useWindowSize from 'hooks/useWindowSize';
import styled from 'styled-components';
import { SIZES } from 'constants/ui-constants';

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  width: 100%;
  ${StlyedSplit} {
    margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
  }
`;

const SafeDFBannerWrapper = ({
  hasSafe = false,
  dfExpiryDate,
  marginTop = null,
}: {
  dfExpiryDate: any;
  hasSafe: boolean;
  marginTop?: number;
}) => {
  const {
    sidebarModal: { addToAside },
    lang,
  } = useContext(MBContext);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  if (!(hasSafe || dfExpiryDate)) return null;
  return (
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={hasSafe && !!dfExpiryDate ? 2 : 1}>
        <Conditional if={hasSafe}>
          <InfoBanner
            cta={labels[lang].LISTICLES.KNOW_MORE}
            title={labels[lang].SAFE_EXPERIENCE.HEADING}
            description={labels[lang].SAFE_EXPERIENCE.GENERAL_DESCRIPTION}
            bannerOnClick={() => {
              addToAside({
                width: '41.06vw',
                children: [<SafeExperiencesPitch generic={true} key={0} />],
                title: '',
                sidePadding: isMobile ? 0 : 40,
              });
            }}
            icon={Shield}
            colorScheme={greenScheme}
          />
        </Conditional>

        <Conditional if={dfExpiryDate}>
          <InfoBanner
            cta={labels[lang].LISTICLES.KNOW_MORE}
            title={labels[lang].DISCOUNTED_FUTURES.HEADING}
            description={labels[lang].DISCOUNTED_FUTURES.DESCRIPTION.replace(
              '<date>',
              dfExpiryDate?.format('DD-MMM-YY')
            )}
            bannerOnClick={() => {
              addToAside({
                width: '27.5vw',
                children: [
                  <DiscountedFuturesPitch
                    dfExpiryDate={dfExpiryDate?.format('DD-MMM-YY')}
                    key={0}
                  />,
                ],
                title: '',
              });
            }}
            icon={BrownTicket}
            colorScheme={brownScheme}
          />
        </Conditional>
      </Split>
    </Wrapper>
  );
};

export default SafeDFBannerWrapper;
