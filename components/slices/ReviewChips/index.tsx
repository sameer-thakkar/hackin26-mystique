import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { TReviewChipsProps } from './interface';
import { Chip, ChipsWrapper, HeadingWrapper, Wrapper } from './styles';

const ReviewChips: React.FC<React.PropsWithChildren<TReviewChipsProps>> = ({
  heading = strings.REVIEWS_PAGE.WHAT_PEOPLE_ARE_SAYING,
  backgroundImage,
  repeatableContent,
}) => {
  const { REVIEWS_PAGE } = strings;
  const { WHAT_PEOPLE_ARE_SAYING } = REVIEWS_PAGE;

  return (
    <Conditional if={!!repeatableContent?.length}>
      <Wrapper $backgroundImage={backgroundImage}>
        <HeadingWrapper>
          <h2>{heading ?? WHAT_PEOPLE_ARE_SAYING}</h2>
        </HeadingWrapper>
        <ChipsWrapper>
          {repeatableContent?.map((chip, index) => {
            return <Chip key={index}>{chip.chips}</Chip>;
          })}
        </ChipsWrapper>
      </Wrapper>
    </Conditional>
  );
};

export default ReviewChips;
