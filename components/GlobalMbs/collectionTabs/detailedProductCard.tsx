import { forwardRef, FunctionComponent, Ref } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { COLORS, SOLEIL } from 'const/ui-constants';
import Image from 'UI/Image';
import { CLOSE_WHITE } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { FALLBACK_IMAGE } from 'const/index';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 16px;
  border-top: 1px solid ${COLORS.GREY_G6};
  border-bottom: 1px solid ${COLORS.GREY_G6};
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
      font-weight: ${SOLEIL.SEMIBOLD};
      line-height: 28px;
    }
  }
  .description {
    font-size: 16px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
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
    background-color: ${COLORS.GREY.G7};
    padding: 4px 8px;
    border-radius: 2px;
    color: ${COLORS.GREY.G3};
    font-size: 11px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 11px;
    letter-spacing: 0.4px;
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

const TicketsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  height: max-content;
  .price-wrapper {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 12px;
    .text {
      font-size: 14px;
      font-style: normal;
      font-weight: ${SOLEIL.REGULAR};
      line-height: 16px;
      color: ${COLORS.GREY.G4};
    }
    .price {
      font-size: 24px;
      font-style: normal;
      font-weight: ${SOLEIL.SEMIBOLD};
      line-height: 16px;
      color: ${COLORS.GREY.G3};
    }
  }
  .cta-wrapper {
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
      font-weight: ${SOLEIL.REGULAR};
      line-height: 24px;
      text-align: center;
    }
    .primary {
      grid-column: 1;
      background-color: ${COLORS.RHAPSODY};
      color: ${COLORS.WHITE};
    }
    .secondary {
      grid-column: 2;
      background-color: ${COLORS.WHITE};
      border: 1px solid ${COLORS.BLACK};
      color: ${COLORS.GREY.G2};
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
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
  background-color: ${COLORS.BLACK};
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
    grid-template-rows: auto 184px;
    position: relative;
  }
  background-color: ${COLORS.WHITE};
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
    background: ${COLORS.WHITE};
    border-top: 1px solid ${COLORS.GREY_G6};
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

type DetailedCollectionCardProps = {
  data: any;
  isMobile: boolean;
  clickHandler?: (e: any) => void;
  ref?: Ref<HTMLDivElement>;
  price?: string;
  currency?: string;
};

const DetailedCollectionCard: FunctionComponent<DetailedCollectionCardProps> = forwardRef(
  ({ data, isMobile, clickHandler, price, currency }, ref) => {
    const uid = data?.uid;
    const microbrand = data?.data?.microbrand_url?.trim();

    const imageUrl = data?.data?.images[0]?.image_url || FALLBACK_IMAGE;
    const descriptorMarkup = data?.data?.descriptors?.map(
      (descriptor, index) => (
        <div className="descriptor" key={index}>
          {descriptor?.tag}
        </div>
      )
    );

    const hasTicketsPage =
      data?.data?.supply === 'Direct' && data?.data?.headout_category_id;

    const ticketLink = hasTicketsPage
      ? ''
      : getValidUrl(data?.data?.official_website);

    const TicketsMarkup = (
      <TicketsWrapper>
        <Conditional if={data?.data?.headout_category_id}>
          <div className="price-wrapper">
            <div className="text">Tickets start from</div>
            <div className="price">
              {currency} {price}
            </div>
          </div>
        </Conditional>

        <div className="cta-wrapper">
          {/* TODO: Change the below condition once ticket page is live */}
          <Conditional if={false}>
            <a href={ticketLink} className="cta primary">
              Buy Tickets
            </a>
          </Conditional>
          <a
            href={
              microbrand
                ? getValidUrl(microbrand)
                : uid
                ? convertUidToUrl(uid)
                : ''
            }
            className="cta secondary"
          >
            More Details
          </a>
        </div>
      </TicketsWrapper>
    );

    const cardMarkup = (
      <Wrapper isMobile={isMobile} id="collection-card-details" ref={ref}>
        <Conditional if={isMobile}>
          <div className="image-wrapper">
            <Image url={imageUrl} />
          </div>
        </Conditional>
        <div className="content-wrapper">
          <div className="title-wrapper">
            <div className="title">{data?.data?.collection_name}</div>
            <Conditional if={data?.data?.descriptors?.length}>
              <DescriptorWrapper>{descriptorMarkup}</DescriptorWrapper>
            </Conditional>
          </div>
          <Conditional if={data?.data?.collection_overview}>
            <div className="description">
              {data?.data?.collection_overview
                ? RichText?.asText(data?.data?.collection_overview)
                : ''}
            </div>
          </Conditional>
          <div className="info">
            <div className="column">
              <Conditional if={data?.data?.location}>
                <div>
                  <strong>Address: </strong>
                  {data?.data?.location
                    ? RichText?.asText(data?.data?.location)
                    : ''}
                </div>
              </Conditional>
              <Conditional if={data?.data?.suggested_duration}>
                <div>
                  <strong>Duration: </strong>
                  {data?.data?.suggested_duration}
                </div>
              </Conditional>
            </div>
            <div className="column">
              <Conditional if={data?.data?.timings}>
                <div>
                  <strong>Timings: </strong>
                </div>
                <div>
                  <RichText render={data?.data?.timings} />
                </div>
              </Conditional>
            </div>
          </div>
          {!isMobile && TicketsMarkup}
        </div>
        <Conditional if={!isMobile}>
          <div className="image-wrapper">
            <Image url={imageUrl} />
            <Conditional if={!isMobile}>
              <CloseButton onClick={(e) => clickHandler(e)}>
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
