import React from 'react';
import { SubCategoryCarouselsProps } from 'components/CatAndSubCatPage/SubCategoryCarousels/interface';
import SubCategoryCarousel from 'components/CatAndSubCatPage/SubCategoryCarousels/SubCategoryCarousel';

const SubCategoryCarousels: React.FC<SubCategoryCarouselsProps> = (props) => {
  const { subCategoryCarousels, isMobile } = props;

  return (
    <>
      {subCategoryCarousels.map((subCategoryCarousel, index) => {
        const { carouselData } = subCategoryCarousel;

        if (carouselData.length < 1) return null;

        return (
          <SubCategoryCarousel
            key={index}
            {...subCategoryCarousel}
            isMobile={isMobile}
          />
        );
      })}
    </>
  );
};

export default SubCategoryCarousels;
