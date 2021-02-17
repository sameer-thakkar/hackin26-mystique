import { SOLEIL, COLORS } from 'constants/ui-constants';

import styled from 'styled-components';
import Button from 'UI/Button';
import PriceBlock from 'UI/PriceBlock';
import { strings } from 'const/strings';
import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import { discountOf, createBookingURL, getDFValidityFromTags } from 'utils';
import DiscountedFuturesPitch from 'UI/DiscountedFuturesPitch';
import useWindowSize from 'hooks/useWindowSize';
import dayjs from 'dayjs';

import Conditional from './common/Conditional';

import 'utils/dayjsLocale';
import Tags, { Tag, StyledTags } from 'UI/Tags';

import { DATE_FORMAT_TYPES } from 'constants/index';

import useLocalisedDate from 'hooks/useLocalisedDate';

const DFSidebar = styled.div`
  display: grid;
  grid-row-gap: 24px;
  margin-bottom: 32px;
  margin-top: 16px;
`;
const BookingOptionCard = styled.div`
  padding: 24px 16px;
  border: 1px solid ${COLORS.GREY_G6};
  display: grid;
  grid-row-gap: 18px;
  position: relative;
  border-radius: 4px;
  ${StyledTags} {
    position: absolute;
    top: -12px;
    left: 16px;
  }
  ${Tag} {
    border: none;
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  .tour-book-now-cta-filled {
    border-radius: 2px;
  }
  .tour-book-now-cta,
  .tour-book-now-cta-filled {
    font-weight: ${SOLEIL.SEMIBOLD};
  }
`;
const Heading = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

const Text = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  color: ${({ colorProp }) => (colorProp ? colorProp : COLORS.FOUR_BLACK)};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  ${({ as }) => (as === 'ul' ? 'padding: 0 16px;' : '')}
`;

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 8px;
  justify-content: left;
  align-items: end;
`;
const SaveLabel = styled.div`
  background: #dbfddb;
  color: #34a853;
  border-radius: 3px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  padding: 4px 8px;
`;

const LeanMore = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryColor};
  text-decoration: underline;
  text-align: center;
  cursor: pointer;
`;

const DiscountedFutureSidebar = ({
  product: {
    allTags = [],
    tgid = null,
    listingPrice = null,
    dfListingPrice = null,
  },
}) => {
  const saveLabel = discountOf(listingPrice || {});
  const dfSaveLabel = discountOf(dfListingPrice);
  const {
    lang,
    sidebarModal: { addToAside },
    nakedDomain,
    biLink,
  } = useContext(MBContext);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const bookURL = createBookingURL({ nakedDomain, lang, tgid, biLink });
  const dfBookURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
    biLink,
  });
  const expiry = useLocalisedDate(
    getDFValidityFromTags(allTags),
    DATE_FORMAT_TYPES.SHORT
  );
  const startDate = useLocalisedDate(
    dayjs().add(30, 'day'),
    DATE_FORMAT_TYPES.SHORT
  );

  return (
    <DFSidebar>
      <BookingOptionCard>
        <Heading>
          {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.GO_LATER_HEADING}
        </Heading>

        <PriceContainer>
          <PriceBlock price={dfListingPrice} lang={lang} />
          {dfSaveLabel ? <SaveLabel>Save {dfSaveLabel}%</SaveLabel> : null}
        </PriceContainer>
        <Text colorProp={COLORS.GREY_G3}>
          {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.GO_LATER_PITCH.replace(
            '<stDate>',
            startDate
          ).replace('<edDate>', '31-Dec-2021')}
        </Text>
        <Button
          className={`tour-book-now-cta`}
          paddingSides="77px"
          type="fill"
          role="button"
          tabIndex={0}
          as={'a'}
          target={isMobile ? '' : '_blank'}
          href={dfBookURL}
        >
          {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.GET_THIS}
        </Button>
        <LeanMore
          onClick={() =>
            addToAside({
              children: <DiscountedFuturesPitch dfExpiryDate={expiry} />,
              width: '27.5vw',
            })
          }
        >
          {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.LEARN_MORE}
        </LeanMore>
        <Tags
          tags={[strings.DISCOUNTED_FUTURES.BOOKING_MODAL.LIMITED]}
          color={COLORS.PEACH_ORANGE}
          backgroundColor={COLORS.PALE_ORANGE}
        />
      </BookingOptionCard>
      <Conditional if={listingPrice}>
        <BookingOptionCard>
          <Heading>
            {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.BOOK_NOW_HEADING}
          </Heading>
          <PriceContainer>
            <PriceBlock price={listingPrice} lang={lang} />

            {saveLabel ? <SaveLabel>Save {saveLabel}%</SaveLabel> : null}
          </PriceContainer>
          <Text colorProp={COLORS.GREY_G3}>
            {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.BOOK_NOW_PITCH}
          </Text>
          <Button
            className={`tour-book-now-cta-filled`}
            paddingSides="77px"
            type="fill"
            role="button"
            tabIndex={0}
            as={'a'}
            href={bookURL}
            target={isMobile ? '' : '_blank'}
          >
            {strings.DISCOUNTED_FUTURES.BOOKING_MODAL.BOOK_NOW}
          </Button>
        </BookingOptionCard>
      </Conditional>
    </DFSidebar>
  );
};

export default DiscountedFutureSidebar;
