import Image from 'UI/Image';
import { StyledSubStopMediaCardContainer } from './styles';

const SubStopMediaCard = ({ url }: { url: string }) => {
  return (
    <StyledSubStopMediaCardContainer>
      <div className="image-container">
        <Image url={url} alt="stop-image" height={148} width={236} />
      </div>
      <div className="gradient"></div>
    </StyledSubStopMediaCardContainer>
  );
};

export default SubStopMediaCard;
