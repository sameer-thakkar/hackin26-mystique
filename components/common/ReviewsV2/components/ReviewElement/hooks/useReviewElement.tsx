import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { TReviewMedia } from 'types/reviews';
import { REVIEW_CONTENT_ACTIONS } from 'components/common/ReviewsV2/constants';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_SORT_ORDER,
} from 'const/index';
import { strings } from 'const/strings';
import type { TUseReviewElementProps } from '../types';
import { parseReviewMedia } from '../utils';

export const useReviewElement = ({
  id,
  reviewMedias = [],
  tourGroup,
  useTranslatedContent,
  translatedContent,
  content,
  rating,
  reviewTime,
  collectionDetails,
  categoryId,
  subCategoryId,
  onImageClick,
  sourceLanguage,
  currentLanguage = 'en',
  shouldFocusProductCardOnCTAClick = false,
}: TUseReviewElementProps) => {
  const [reviewContent, setReviewContent] = useState(
    useTranslatedContent ? translatedContent : content
  );
  const [isProductCardPresent, setIsProductCardPresent] = useState(false);

  const reviewTimeFormatted = dayjs(reviewTime).format('MMM, YYYY');
  const isSupportedLanguage =
    sourceLanguage &&
    LANGUAGE_SORT_ORDER.includes(sourceLanguage.toLowerCase());

  let finalReviewMedia: TReviewMedia[] = reviewMedias;
  const MAX_IMAGES_TO_BE_DISPLAYED = 3;
  const balanceImages = finalReviewMedia.length - MAX_IMAGES_TO_BE_DISPLAYED;

  if (reviewMedias.length > MAX_IMAGES_TO_BE_DISPLAYED) {
    finalReviewMedia = reviewMedias.slice(0, MAX_IMAGES_TO_BE_DISPLAYED);
  }

  const toggleReviewContent = () => {
    const shouldTranslate = reviewContent === content;
    const action = shouldTranslate
      ? REVIEW_CONTENT_ACTIONS.TRANSLATE_REVIEW
      : REVIEW_CONTENT_ACTIONS.VIEW_ORIGINAL;
    const finalContent = shouldTranslate ? translatedContent : content;
    setReviewContent(finalContent);
    trackEvent({ eventName: ANALYTICS_EVENTS.REVIEW_LOC, action });
  };

  const onMediaClick = (index: number) => {
    onImageClick?.({
      mediaIndex: index,
      reviewId: id,
      reviewMedia: parseReviewMedia({ media: reviewMedias, id }),
    });
  };

  const handleBottomCTAClick = () => {
    if (isProductCardPresent && shouldFocusProductCardOnCTAClick) {
      const productCard = document.querySelector(
        `[data-tgid="${tourGroup?.id}"]`
      );
      productCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEW_LINK_CLICKED,
      [ANALYTICS_PROPERTIES.RATING]: rating,
      [ANALYTICS_PROPERTIES.LINK_ACTIVE]: isProductCardPresent,
      ...(collectionDetails?.id && {
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionDetails.id,
      }),
      ...(collectionDetails?.displayName && {
        [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionDetails.displayName,
      }),
      ...(categoryId && { [ANALYTICS_PROPERTIES.CATEGORY_ID]: categoryId }),
      ...(subCategoryId && {
        [ANALYTICS_PROPERTIES.SUB_CAT_ID]: subCategoryId,
      }),
    });
  };

  const getLanguageToDisplay = (lang: string) => {
    return (
      strings.REVIEW_LOC.LANGUAGES[
        lang.toUpperCase() as keyof typeof strings.REVIEW_LOC.LANGUAGES
      ] ?? strings.REVIEW_LOC.LANGUAGES.EN
    );
  };

  const getReviewContent = () => {
    switch (true) {
      case reviewContent === content:
        return strings.formatString(
          strings.REVIEW_LOC.TRANSLATE,
          getLanguageToDisplay(currentLanguage!)
        );
      case isSupportedLanguage:
        return strings.formatString(
          strings.REVIEW_LOC.VIEW_ORIGINAL,
          getLanguageToDisplay(sourceLanguage!)
        );
      default:
        return strings.REVIEW_LOC.VIEW_ORIGINAL_NO_LANG;
    }
  };

  useEffect(() => {
    const productCard = document.querySelector(
      `[data-tgid="${tourGroup?.id}"]`
    );
    setIsProductCardPresent(!!productCard);
  }, [tourGroup?.id]);

  return {
    reviewContent,
    toggleReviewContent,
    onMediaClick,
    handleBottomCTAClick,
    reviewTimeFormatted,
    finalReviewMedia,
    balanceImages,
    isProductCardPresent,
    getReviewContent,
  };
};
