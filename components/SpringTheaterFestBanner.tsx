import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 1200px;
  width: calc(100% - (5.46vw * 2));
  margin: 0 auto;
  cursor: pointer;
`;

const Container = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 185px;
  background-image: url('https://cdn-imgix.headout.com/media/images/977cd743c7c28253a50bb89bfc0da4f8-LTT%20MB%20MWEB%20banner.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    background-image: url('https://cdn-imgix.headout.com/media/images/fa4fccbc4bae3df5ee92a93a8d25c99d-Special%20MB%20Banner%20Option%202.png');
    height: 132px;
  }
`;

const SpringTheaterFestBanner = () => {
  return (
    <Wrapper>
      <Container
        href="https://www.headout.com/spring-theatre-fest-london/"
        target="_blank"
      ></Container>
    </Wrapper>
  );
};

export default SpringTheaterFestBanner;
