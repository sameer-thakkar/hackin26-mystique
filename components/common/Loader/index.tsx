import styled from 'styled-components';
import { useRive } from 'rive-react';

export const LoaderWrapper = styled.div`
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  .loader {
    height: 15%;
    width: 15%;
  }
`;

const Loader = () => {
  const { RiveComponent } = useRive({
    autoplay: true,
    src: 'https://tourlandish.s3.amazonaws.com/assets/rive/loader.riv',
    stateMachines: 'stateMachine',
    artboard: 'loader',
  });
  return (
    <LoaderWrapper>
      <div className="loader">
        <RiveComponent width={'20%'} height={'20%'} />
      </div>
    </LoaderWrapper>
  );
};

export default Loader;
