import styled from 'styled-components';

export const LottieWrapper = styled.div<{
  setVisible: boolean;
  isEntertainmentMB: boolean;
}>(
  (props: { setVisible: boolean; isEntertainmentMB: boolean }) => `
  visibility: ${props.setVisible ? 'visible' : 'hidden'};
  position: ${props.setVisible ? 'initial' : 'absolute'};
  height: ${props.isEntertainmentMB ? `36px` : `44px`};

  @media (max-width: 768px) {  
    height: ${props.isEntertainmentMB ? '20px' : '26px'};
  }
`
);
