import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import RightArrow from 'assets/rightArrow';
import { OptionJSX } from '../TheatreGrid';
import { TChips } from '../TheatreGrid/interface';
import { Chip, HoverCard, Separator } from '../TheatreGrid/styles';

const Chips = ({
  nowPlayingShows,
  index,
  nowPlayingShowTgid,
  isMobile,
  setShowDrawer,
  setShowTooltip,
  showTooltip,
  mediaData,
  showPageUrl,
  showName,
  hostname,
  showPageDocuments,
  language,
}: TChips) => {
  const { THEATRE_PAGE } = strings;
  const { NOW_PLAYING } = THEATRE_PAGE;

  return (
    <>
      <Conditional if={nowPlayingShows?.length > 1 && index === 1}>
        <Chip
          key={nowPlayingShowTgid}
          onClick={() =>
            isMobile ? setShowDrawer(true) : setShowTooltip(!showTooltip)
          }
          $relativePositioning
        >
          {`+${nowPlayingShows?.length - 1}`}
          <Conditional if={showTooltip && !isMobile}>
            <HoverCard>
              <h3>{NOW_PLAYING}</h3>
              <Separator />
              <OptionJSX
                mediaData={mediaData}
                hostname={hostname}
                showPageDocuments={showPageDocuments}
                language={language}
                nowPlayingShows={nowPlayingShows}
                isMobile={isMobile}
              />
            </HoverCard>
          </Conditional>
        </Chip>
      </Conditional>
      <Conditional if={index < 1}>
        <Chip
          key={nowPlayingShowTgid}
          href={showPageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {showName}
          {RightArrow}
        </Chip>
      </Conditional>
    </>
  );
};

export default Chips;
