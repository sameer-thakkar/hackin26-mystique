import React, { Component } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import LocalisedPrice from 'UI/LPrice';
import Conditional from 'components/common/Conditional';
import { getLocalisedPrice } from 'utils/currency';

const InlineScratchPrice = styled.span`
  text-decoration: line-through;
  margin-left: 5px;
  color: rgba(84, 84, 84, 0.7);
`;
export default class InlineInvPrice extends Component<any, any> {
  state = {
    price: '',
    scratchPrice: '',
    currencyCode: '',
    showScratchPrice: '',
    isFetched: false,
  };

  context!: React.ContextType<typeof MBContext>;
  static contextType = MBContext;

  async componentDidMount() {
    if (this.props.tgid && this.props.tid) {
      const fetchTour = await fetch(
        `/api/tours/v5/tour-group/inventory/get/${this.props.tgid}`
      ).then((res) => res.json());
      const currencyCode = fetchTour.currency.code;
      const getTIDData = fetchTour.inventoryList.find(
        (inventoryList) => inventoryList.tourId == this.props.tid
      );
      const price = getTIDData.finalPriceProfile.persons[0].price;
      const invScratchPriceId = getTIDData.originalPriceProfileId;
      const scratchPrice =
        fetchTour.priceProfileMap[invScratchPriceId].persons[0].price;
      const showScratchPrice = this.props['scratch-price']
        ? this.props['scratch-price']
        : false;
      this.setState({
        price,
        scratchPrice,
        currencyCode,
        showScratchPrice,
        isFetched: true,
      });
    }
  }

  render() {
    const {
      scratchPrice,
      currencyCode,
      isFetched,
      price,
      showScratchPrice,
    } = this.state;
    const hasScratchPrice =
      showScratchPrice && scratchPrice && price < scratchPrice;
    return (
      <Conditional if={isFetched}>
        <>
          <Conditional if={price}>
            <LocalisedPrice
              price={Number(price)}
              currencyCode={currencyCode}
              lang={this.context.lang}
            />
          </Conditional>
          <Conditional if={hasScratchPrice}>
            <InlineScratchPrice>
              {getLocalisedPrice({
                price: Number(scratchPrice),
                currencyCode,
                lang: this.context.lang,
              })}
            </InlineScratchPrice>
          </Conditional>
        </>
      </Conditional>
    );
  }
}
