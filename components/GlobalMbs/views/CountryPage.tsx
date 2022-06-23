import Conditional from 'components/common/Conditional';
import CollectionTabs from 'components/GlobalMbs/collectionTabs';
import styled from 'styled-components';
import COLORS from 'const/colors';

import TopDestinationsCarousel from '../Carousels/TopDestinationsCarousel';

const SectionWrapper = styled.div``;

const HeadingSection = styled.div`
  max-width: 1200px;
  margin: 48px auto 24px auto;
  width: calc(100vw - (5.6vw * 2));
  h1 {
    font-weight: 600;
    font-size: 46px;
    line-height: 54px;
    letter-spacing: -1px;
    color: ${COLORS.GRAY.G2};
    margin: 0 0 16px;
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 28px;
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }
`;

const CountryPage = (props) => {
  const {
    cityCollections,
    collections,
    country_name: countryName,
    sub_heading: subHeading,
    ticketPages,
  } = props;

  const tabTitle = 'Best Theme Parks in ' + countryName;
  return (
    <SectionWrapper>
      <HeadingSection>
        <h1>{countryName + ' Theme Parks'}</h1>
        <p>{subHeading}</p>
      </HeadingSection>
      <Conditional if={cityCollections?.length}>
        <TopDestinationsCarousel
          destinations={cityCollections}
          showTitle={false}
        />
      </Conditional>
      <Conditional if={collections?.length}>
        <CollectionTabs
          collections={collections}
          title={tabTitle}
          ticketPages={ticketPages}
        />
      </Conditional>
    </SectionWrapper>
  );
};

export default CountryPage;
