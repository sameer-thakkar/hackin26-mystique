import { SIZES } from 'const/ui-constants';
import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { strings } from 'const/strings';
import { SEE_SAFETY, BLACK_RIGHT_ARROW } from 'assets/SvgIcons';
import { greyScheme } from 'style/theme';
import { MBContext } from 'contexts/MBContext';

import InfoBanner from './InfoBanner';
import Split, { StlyedSplit } from '../UI/Split';

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
  @media (max-width: 768px) {
    ${StlyedSplit} {
      margin-bottom: 48px;
    }
  }
`;

const SafeDFBannerWrapper = ({
  marginTop = null,
  isMobile: isMobileCloudfront = false,
  isShowPage = false,
}: {
  marginTop?: number;
  isMobile?: boolean;
  isShowPage?: boolean;
}) => {
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const [isMobile, setIsMobile] = useState(isMobileCloudfront);
  const width = useWindowWidth();
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
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
      <Split mobileLayout={'scroll'} count={1}>
        <InfoBanner
          title={strings.SAFE_EXPERIENCE_NEW.HEADING}
          description={
            isShowPage
              ? strings.SAFE_EXPERIENCE_NEW.GENERAL_DESCRIPTION
              : strings.SAFE_EXPERIENCE_NEW.GENERAL_DESCRIPTION_V2
          }
          rightArrowOnClick={openSafeSidebar}
          icon={SEE_SAFETY}
          colorScheme={greyScheme}
          isMobile={isMobile}
          rightIcon={BLACK_RIGHT_ARROW}
        />
      </Split>
    </Wrapper>
  );
};

export default SafeDFBannerWrapper;
