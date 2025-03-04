import { Button, Text } from '@headout/eevee';
import { strings } from 'const/strings';
import NoReviewsIllustration from 'assets/reviewsEmptyState';
import { emptyStateStyles } from './styles';
import { TExportStateProps } from './types';

const EmptyState = ({ onClick }: TExportStateProps) => {
  const { container, illustration, contentContainer } = emptyStateStyles();
  return (
    <div className={container}>
      <NoReviewsIllustration className={illustration} />
      <div className={contentContainer}>
        <Text align="center" textStyle="Semantics/Para/Regular" as="span">
          {strings.REVIEW_SECTION.EMPTY_STATE.SUB_HEADING}
        </Text>
        <Button
          onClick={onClick}
          as="button"
          primaryText={strings.REVIEW_SECTION.EMPTY_STATE.CTA}
          size="small"
          btnType="black"
        />
      </div>
    </div>
  );
};

export default EmptyState;
