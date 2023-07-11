import React from 'react';
import CategorySection from '../../../components/MicrositeV2/CategorySection';
import { InteractionContextProvider } from '../../../contexts/Interaction';
import { ProductsContextProvider } from '../../../contexts/Products';
import tourData from './data.json';

export default {
  title: 'Slices/Tours Section [V2]',
  component: CategorySection,
};

const props = {
  tgidsArray: [793, 896, 792, 796, 11610, 11611, 11597, 866, 11607],
  description:
    'Stunning bird’s eye view of the Grand Canyon in state-of-the-art helicopters. Tours start at Las Vegas and include transfers.',
  heading: 'Helicopter Tours',
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 4,
    spaceBetween: 24,
    navigaton: {
      nextEl: '.swiper-btn.btn-left',
      prevEl: '.swiper-btn.btn-right',
    },
  },
};

export const Basic = () => {
  return (
    <ProductsContextProvider allTours={tourData} ready={true}>
      <InteractionContextProvider>
        <CategorySection {...props} />;
      </InteractionContextProvider>
    </ProductsContextProvider>
  );
};
