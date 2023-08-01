import React, { forwardRef, Ref, useContext } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { getLocalisedPrice } from 'utils/currency';
import { shortCodeSerializer } from 'utils/shortCodes';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { ASPECT_RATIO, FALLBACK_IMAGE } from 'const/index';
import { strings } from 'const/strings';
import { CLOSE_WHITE } from 'assets/SvgIcons';

const Wrapper = styled.div<{ isMobile: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 24px 0;
  border-top: 1px solid ${COLORS.GRAY.G6};
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  img {
    width: 100%;
    height: 448px;
    object-fit: cover;
    border-radius: 4px;
    @media (max-width: 768px) {
      height: 213px;
    }
  }
  ul,
  ol,
  p {
    margin: 0;
  }

  .content-wrapper {
    padding: 24px 0;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    row-gap: 24px;
    margin-top: 0;
    @media (max-width: 768px) {
      padding-top: 0;
      overflow: scroll;
    }
  }

  .title-wrapper {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    row-gap: 8px;
    .title {
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 28px;
    }
  }
  .description {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
  .info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    .column {
      display: grid;
      grid-template-rows: repeat(2, max-content);
      row-gap: 16px;
    }
  }

  .image-wrapper {
    position: relative;
  }
`;

const DescriptorWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  .descriptor {
    background-color: ${COLORS.GRAY.G7};
    padding: 4px 8px;
    border-radius: 2px;
    color: ${COLORS.GRAY.G3};
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 11px;
    letter-spacing: 0.4px;
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

const TicketsWrapper = styled.div`
  display: grid;
  grid-template-areas: 'price ctas';
  box-sizing: border-box;
  height: max-content;
  .price-wrapper {
    grid-area: price;
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 12px;
    .text {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: ${COLORS.GRAY.G4};
    }
    .price {
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 16px;
      color: ${COLORS.GRAY.G3};
    }
  }
  .cta-wrapper {
    grid-area: ctas;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    .cta {
      display: block;
      padding: 8px 0;
      width: 200px;
      border-radius: 4px;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      text-align: center;
    }
    .primary {
      grid-column: 1;
      background-color: ${COLORS.BRAND.PURPS};
      color: ${COLORS.BRAND.WHITE};
    }
    .secondary {
      grid-column: 2;
      background-color: ${COLORS.BRAND.WHITE};
      border: 1px solid ${COLORS.BRAND.BLACK};
      color: ${COLORS.GRAY.G2};
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    grid-template-areas:
      'price'
      'ctas';
    .price-wrapper {
      margin-bottom: 16px;
    }
  }
`;

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background-color: ${COLORS.BRAND.BLACK};
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  svg {
    width: 10.67px;
    height: 10.67px;
  }
`;
const Modal = styled.div`
  min-height: 100vh;
  .modal-body {
    padding: 0;
    max-width: 100%;
    max-height: 100%;
  }
  .modal-container {
    display: grid;
    grid-template-rows: max-content max-content;
    position: relative;
  }
  background-color: ${COLORS.BRAND.WHITE};
  svg {
    width: 13.33px;
    height: 13.33px;
    padding-right: 16px;
  }
  ${Wrapper} {
    grid-template-columns: unset;
    grid-template-rows: repeat(2, max-content);
    padding: 8px 16px;
    border-top: none;
    border-bottom: none;
    overflow: scroll;
    margin-top: 0;
  }
  ${TicketsWrapper} {
    padding: 12px 16px;
    background: ${COLORS.BRAND.WHITE};
    border-top: 1px solid ${COLORS.GRAY.G6};
    position: sticky;
    width: 100%;
    bottom: 0;
    .cta-wrapper {
      grid-template-columns: unset;
      grid-auto-flow: row;
      grid-auto-rows: max-content;
      column-gap: unset;
      row-gap: 24px;
    }
    .cta {
      grid-column: unset;
      width: 100%;
      padding: 12px 0;
    }
  }
`;

interface DetailedCollectionCardProps {
  data: any;
  isMobile: boolean;
  clickHandler?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ref?: Ref<HTMLDivElement>;
  price?: string;
  currency?: string;
  ticketURL?: string;
}

const DetailedCollectionCard = forwardRef<
  HTMLDivElement,
  DetailedCollectionCardProps
>(
  // @ts-expect-error TS(2345): Argument of type '({ data, isMobile, clickHandler,... Remove this comment to see the full error message
  ({ data, isMobile, clickHandler, price, currency, ticketURL }, ref) => {
    const {
      data: {
        microbrand_url: microbrand,
        images,
        descriptors,
        supply,
        collection_name: name,
        headout_collection_id: collectionId,
        headout_category_id: categoryId,
        collection_overview: overview,
        location,
        suggested_duration: duration,
        timings,
      },
    } = data || {};
    const { isDev, host, lang } = useContext(MBContext);
    const currencyList = useRecoilValue(currencyListAtom);

    const localisedPrice =
      price && currency
        ? getLocalisedPrice({
            price: Number(price),
            currencyCode: currency,
            lang,
            currencyList,
          })
        : null;

    const imageUrl = images[0]?.image_url || FALLBACK_IMAGE;
    const descriptorMarkup = descriptors?.map(
      (descriptor: any, index: number) => (
        <div className="descriptor" key={index}>
          {descriptor?.tag}
        </div>
      )
    );

    const ticketLink = ticketURL
      ? convertUidToUrl({ uid: ticketURL })
      : undefined;
    const hasTicketsPage =
      (collectionId || categoryId) && supply === 'Direct' && ticketLink;

    const TicketsMarkup = (
      <TicketsWrapper>
        <Conditional if={price}>
          <div className="price-wrapper">
            <div className="text">Tickets start from</div>
            <div className="price">{localisedPrice}</div>
          </div>
        </Conditional>

        <div className="cta-wrapper">
          <Conditional if={hasTicketsPage}>
            <a href={ticketLink} className="cta primary">
              {strings.BANNER_CTA}
            </a>
          </Conditional>
          <a
            href={
              data.uid
                ? convertUidToUrl({ uid: data.uid, isDev, hostname: host })
                : microbrand
                ? getValidUrl(microbrand?.trim())
                : ''
            }
            className="cta secondary"
          >
            More Details
          </a>
        </div>
      </TicketsWrapper>
    );

    const { GLOBAL_MB: globalMbAR } = ASPECT_RATIO;
    const cardMarkup = (
      <Wrapper isMobile={isMobile} id="collection-card-details" ref={ref}>
        <Conditional if={isMobile}>
          <div className="image-wrapper">
            <Image
              url={imageUrl}
              aspectRatio={globalMbAR}
              autoCrop={false}
              width={800}
              height={400}
              alt={name}
            />
          </div>
        </Conditional>
        <div className="content-wrapper">
          <div className="title-wrapper">
            <div className="title">{name}</div>
            <Conditional if={descriptors?.length}>
              <DescriptorWrapper>{descriptorMarkup}</DescriptorWrapper>
            </Conditional>
          </div>
          <Conditional if={overview}>
            <div className="description">
              {overview ? RichText?.asText(overview) : ''}
            </div>
          </Conditional>
          <div className="info">
            <div className="column">
              <Conditional if={location}>
                <div>
                  <strong>Address: </strong>
                  {location ? RichText?.asText(location) : ''}
                </div>
              </Conditional>
              <Conditional if={duration}>
                <div>
                  <strong>Duration: </strong>
                  {duration}
                </div>
              </Conditional>
            </div>
            <div className="column">
              <Conditional if={timings}>
                <div>
                  <strong>Timings: </strong>
                </div>
                <div>
                  <RichText
                    render={timings}
                    htmlSerializer={shortCodeSerializer}
                  />
                </div>
              </Conditional>
            </div>
          </div>
          {!isMobile && TicketsMarkup}
        </div>
        <Conditional if={!isMobile}>
          <div className="image-wrapper">
            <Image
              url={imageUrl}
              aspectRatio={globalMbAR}
              autoCrop={false}
              width={800}
              height={400}
              alt={name}
            />
            <Conditional if={!isMobile}>
              <CloseButton
                onClick={(e) => {
                  clickHandler && clickHandler(e);
                }}
              >
                {CLOSE_WHITE}
              </CloseButton>
            </Conditional>
          </div>
        </Conditional>
      </Wrapper>
    );

    if (!isMobile) {
      return <>{cardMarkup}</>;
    }
    if (isMobile) {
      return (
        <Modal>
          <div className="modal-body">
            <div className="modal-container">
              {cardMarkup}
              {TicketsMarkup}
            </div>
          </div>
        </Modal>
      );
    }
  }
);

export default DetailedCollectionCard;
