import React, { Component } from 'react';

export default class InlineInvPrice extends Component<any, any> {
  state = {
    price: '',
    scratchPrice: '',
    currencySymbol: '',
    showScratchPrice: '',
    isFetched: false,
  };

  async componentDidMount() {
    if (this.props.tgid && this.props.tid) {
      const fetchTour = await fetch(
        `/api/tours/v5/tour-group/inventory/get/${this.props.tgid}`
      ).then((res) => res.json());
      const currencySymbol = fetchTour.currency.localSymbol;
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
        currencySymbol,
        showScratchPrice,
        isFetched: true,
      });
    }
  }

  render() {
    const {
      scratchPrice,
      currencySymbol,
      isFetched,
      price,
      showScratchPrice,
    } = this.state;
    const isScratchPriceExist =
      showScratchPrice && scratchPrice && price < scratchPrice;
    return (
      <>
        {isFetched ? (
          <>
            {price ? (
              <span className="inv-price">
                {currencySymbol}
                {price}
              </span>
            ) : (
              ''
            )}
            {isScratchPriceExist ? (
              <span className="inline-scratchprice">
                {currencySymbol}
                {scratchPrice}
              </span>
            ) : (
              ''
            )}
            <style jsx>{`
              .inline-scratchprice {
                text-decoration: line-through;
                margin-left: 5px;
                color: rgba(84, 84, 84, 0.7);
              }
            `}</style>
          </>
        ) : null}
      </>
    );
  }
}
