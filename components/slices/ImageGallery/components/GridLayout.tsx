import React from 'react';
import { Wrapper } from 'components/slices/ImageGallery/style';

const GridLayout = ({
  $isNewspage,
  children,
}: {
  $isNewspage: boolean | undefined;
  children: JSX.Element[];
}) => {
  return (
    <Wrapper noOfImages={children.length} $isNewsPage={$isNewspage}>
      {children}
    </Wrapper>
  );
};

export default GridLayout;
