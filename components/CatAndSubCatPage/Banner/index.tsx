import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import { BannerProps } from 'components/CatAndSubCatPage/Banner/interface';
import {
  BannerContainer,
  BannerSection,
  Heading,
} from 'components/CatAndSubCatPage/Banner/styles';
import Conditional from 'components/common/Conditional';

const Banner: React.FC<BannerProps> = (props) => {
  const { pageHeading, breadcrumbs, taggedCity, primaryCity, isMobile } = props;
  const automatedBreadcrumbsExists = Object.keys(breadcrumbs).length > 0;

  return (
    <BannerSection>
      <BannerContainer>
        <Conditional if={automatedBreadcrumbsExists}>
          <Breadcrumbs
            isCatOrSubCatPage={true}
            breadcrumbs={breadcrumbs}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isMobile={isMobile}
          />
        </Conditional>
        <Heading>{pageHeading}</Heading>
      </BannerContainer>
    </BannerSection>
  );
};

export default Banner;
