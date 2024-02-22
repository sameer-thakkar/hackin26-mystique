import Conditional from 'components/common/Conditional';
import DesktopTrailer from 'components/NewsPage/components/Trailer/components/DesktopTrailer';
import MobileTrailer from 'components/NewsPage/components/Trailer/components/MobileTrailer';
import { TTrailerProps } from 'components/NewsPage/components/Trailer/interface';

const Trailer: React.FC<TTrailerProps> = ({ content, isMobile }) => {
  const { trailerSectionData, showPageDocuments, tgid, videoData } = content;

  return (
    <>
      <Conditional if={isMobile}>
        <MobileTrailer
          content={{
            trailerData: trailerSectionData,
            showPageDocuments,
            videoData,
          }}
        />
      </Conditional>
      <Conditional if={!isMobile}>
        <DesktopTrailer
          content={{
            trailerData: trailerSectionData,
            showPageDocuments,
            tgid,
            videoData,
          }}
        />
      </Conditional>
    </>
  );
};

export default Trailer;
