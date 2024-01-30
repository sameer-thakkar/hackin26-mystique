import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import { TCriticReviewProps } from 'components/MicrositeV2/LttShowPageV2/CriticReview/interface';
import {
  CriticReviewWrapper,
  ReviewContent,
  ReviewerDetails,
} from 'components/MicrositeV2/LttShowPageV2/CriticReview/style';
import Image from 'UI/Image';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import CriticReviewQuotation from 'assets/criticReviewQuotation';

const CriticReview = ({ reviewContent, criticName }: TCriticReviewProps) => {
  return (
    <CriticReviewWrapper>
      <CriticReviewQuotation />
      <ReviewContent>
        <PrismicRichText
          field={[reviewContent]}
          components={shortCodeSerializer}
        />
      </ReviewContent>
      <Conditional if={criticName}>
        <ReviewerDetails>
          <Image
            className="reviewer-image"
            url={getRandomReviewerImage(criticName?.text ?? '')}
            alt="critic"
          />
          <div className="name">
            <PrismicRichText
              field={[criticName]}
              components={shortCodeSerializer}
            />
          </div>
        </ReviewerDetails>
      </Conditional>
    </CriticReviewWrapper>
  );
};

export default CriticReview;
