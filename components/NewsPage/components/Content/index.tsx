import LongForm from 'components/common/LongForm';
import type {
  TBannerProps,
  TPageContentProps,
} from 'components/NewsPage/components/Content/interface';
import { Container } from 'components/NewsPage/components/Content/styles';
import Image from 'UI/Image';

const Banner: React.FC<React.PropsWithChildren<TBannerProps>> = ({
  bannerImage,
}) => {
  return (
    <div className="image-wrapper">
      <Image
        className="banner-image"
        url={bannerImage?.url}
        alt={'Banner Image'}
        aspectRatio="16:10"
        fill
        fetchPriority={'high'}
        loadHigherQualityImage={true}
      />
    </div>
  );
};

const PageContent: React.FC<React.PropsWithChildren<TPageContentProps>> = ({
  content,
}) => {
  const { bannerImage, contentFrameworkSlices } = content;

  return (
    <Container>
      <Banner bannerImage={bannerImage} />
      <LongForm content={contentFrameworkSlices} isNewsPage />
    </Container>
  );
};

export default PageContent;
