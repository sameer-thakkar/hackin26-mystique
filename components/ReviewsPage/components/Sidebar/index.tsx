import { Sidecard } from 'components/NewsPage/components/Sidebar';
import ReviewChips from 'components/slices/ReviewChips';
import { TSidebarProps } from './interface';
import { Wrapper } from './styles';

const Sidebar: React.FC<React.PropsWithChildren<TSidebarProps>> = ({
  experienceData,
  verticalImageUrl,
  showPageUid,
  reviewChipsHeading,
  reviewChipsRepeatableContent,
  productImageUrl,
}) => {
  return (
    <Wrapper>
      <Sidecard
        showData={experienceData}
        showPageUid={showPageUid}
        verticalPoster={verticalImageUrl}
        showBookNowHeading={false}
      />
      <ReviewChips
        backgroundImage={productImageUrl}
        heading={reviewChipsHeading}
        repeatableContent={reviewChipsRepeatableContent}
      />
    </Wrapper>
  );
};

export default Sidebar;
