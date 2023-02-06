import { Wrapper } from 'components/slices/ImageGallery/style';
import React from 'react';

// @ts-ignore
const GridLayout = ({ children }) => {
  return <Wrapper noOfImages={children.length}>{children}</Wrapper>;
};

export default GridLayout;
