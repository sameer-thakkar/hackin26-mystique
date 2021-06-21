import { SIZES } from 'const/ui-constants';
import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { strings } from 'const/strings';
import { SEE_SAFETY, RIGHT_ARROW } from 'assets/SvgIcons';
import { blackScheme } from 'style/theme';
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
}: {
  isAmp?: boolean;
  marginTop?: number;
  isMobile?: boolean;
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
          cta={strings.LISTICLES.KNOW_MORE}
          title={strings.SAFE_EXPERIENCE_NEW.HEADING}
          description={strings.SAFE_EXPERIENCE_NEW.GENERAL_DESCRIPTION}
          bannerOnClick={openSafeSidebar}
          icon={SEE_SAFETY}
          colorScheme={blackScheme}
          isMobile={isMobile}
          rightIcon={RIGHT_ARROW}
        />
      </Split>
    </Wrapper>
  );
};

export default SafeDFBannerWrapper;
