import React from 'react';
import { Wrapper } from 'components/slices/ImageGallery/style';

// @ts-ignore
const GridLayout = ({ children }) => {
  return <Wrapper noOfImages={children.length}>{children}</Wrapper>;
};

export default GridLayout;
