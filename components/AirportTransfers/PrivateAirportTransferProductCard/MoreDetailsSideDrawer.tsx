import { useEffect, useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import Button from '@headout/aer/src/atoms/Button';
import { SidePanelOverlay } from 'components/Product/styles';
import { SavedTag } from 'UI/PriceBlock';
import { shortCodeSerializer } from 'utils/shortCodes';
import { StarIcon } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import CloseIcon from 'assets/closeIcon';
import Accordion from '../Accordion';
import { TScorpioDataHighlight } from '../interface';
import {
  ContentHeader,
  FullHeightDrawer,
  RatingsContainer,
  StyledContentContainer,
  StyledPricingAndCTA,
  StyledProductTitle,
} from './styles';

export const MoreDetailsSideDrawer = ({
  onClose,
  title,
  averageRating,
  ratingsCount,
  listingPrice,
  productBookingUrl,
  highlights,
}: {
  onClose: () => void;
  title: string;
  averageRating: number;
  ratingsCount: number;
  listingPrice: ListingPrice;
  productBookingUrl: string;
  highlights: TScorpioDataHighlight[];
}) => {
  const [closed, setClosed] = useState(false);

  // Remove overflow from body when drawer is open
  useEffect(() => {
    document.querySelector('body')?.classList.add('scroll-lock');
    return () => {
      document.querySelector('body')?.classList.remove('scroll-lock');
    };
  }, []);

  useEffect(() => {
    window.LC_API?.hide_chat_window?.();

    return () => {
      window.LC_API?.minimize_chat_window();
    };
  }, [closed]);

  const { finalPrice, localSymbol } = listingPrice;

  const accordionFormattedData = formatDataForAccordion(highlights);

  return (
    <SidePanelOverlay
      $closed={closed}
      onClick={() => {
        setClosed(true);
      }}
      onAnimationEnd={() => {
        if (closed) onClose();
      }}
    >
      <FullHeightDrawer $closed={closed} onClick={(e) => e.stopPropagation()}>
        <ContentHeader>
          <div className="review-header">
            <RatingsContainer>
              <StarIcon />
              <span className="rating">{averageRating}</span>
              <span className="ratings-count">({ratingsCount} Reviews)</span>
            </RatingsContainer>

            <div
              role="button"
              tabIndex={0}
              className="close"
              onClick={() => setClosed(true)}
            >
              <CloseIcon />
            </div>
          </div>

          <StyledProductTitle>{title}</StyledProductTitle>
        </ContentHeader>

        <StyledContentContainer>
          {accordionFormattedData.map((accordion, i) => (
            <Accordion
              isAccordionPanelOpen={i === 0}
              key={i}
              header={
                <PrismicRichText
                  field={[accordion.title] || []}
                  components={shortCodeSerializer}
                />
              }
            >
              <PrismicRichText
                field={accordion.content || []}
                components={shortCodeSerializer}
              />
            </Accordion>
          ))}
        </StyledContentContainer>

        <StyledPricingAndCTA>
          <div className="scratch-price">
            {/* from <span className="scratch-price-amount">{}</span> */}
          </div>

          <div className="price">
            <span>
              {localSymbol} {finalPrice}
            </span>
            <SavedTag>Save 5 %</SavedTag>
          </div>

          <a
            target={'_blank'}
            href={productBookingUrl}
            rel="nofollow"
            className="booking-link"
          >
            <Button
              width={'100%'}
              size="medium"
              color="purps"
              variant="primary"
              tabIndex={0}
              text={strings.CHECK_AVAIL}
            />
          </a>
        </StyledPricingAndCTA>
      </FullHeightDrawer>
    </SidePanelOverlay>
  );
};

function formatDataForAccordion(data: any[]) {
  const accordionData = [];
  let currentAccordion = null;

  for (const item of data) {
    if (item.type === 'heading6') {
      // Create a new accordion section with the entire object
      currentAccordion = {
        title: item,
        content: [] as any[],
      };
      accordionData.push(currentAccordion);
    } else if (currentAccordion) {
      // Add the entire object to the current accordion's content array
      currentAccordion.content.push(item);
    }
  }

  return accordionData;
}
