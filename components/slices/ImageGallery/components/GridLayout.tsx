import { Wrapper } from 'components/slices/ImageGallery/style';

const GridLayout = ({ children }) => {
  return <Wrapper noOfImages={children.length}>{children}</Wrapper>;
};

export default GridLayout;
