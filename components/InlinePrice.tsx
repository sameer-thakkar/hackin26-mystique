import React from 'react';

type IPriceProps = {
  tgid: number;
};
type IPriceState = {
  error: any;
  isLoaded: Boolean;
  data: any;
  showScratchPrice: any;
};
class InlinePrice extends React.Component<IPriceProps, IPriceState> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      showScratchPrice: '',
    };
  }
  componentDidMount() {
    const showScratchPrice =
      this.props['scratch-price'] !== undefined
        ? this.props['scratch-price']
        : false;
    fetch(`/api/tours/v5/tour-group/get/${this.props.tgid}`)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            data,
            showScratchPrice: showScratchPrice,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, data, showScratchPrice } = this.state;
    const isScratchPriceExist =
      isLoaded && data.listingPrice
        ? showScratchPrice &&
          data.listingPrice.finalPrice < data.listingPrice.originalPrice
        : false;
    if (error || !isLoaded) {
      return '';
    } else {
      return data.listingPrice ? (
        <>
          <span className="inline-price">
            {' '}
            {data.currency.localSymbol}
            {data.listingPrice.finalPrice}{' '}
          </span>
          {isScratchPriceExist ? (
            <span className="inline-scratch-price">
              {data.currency.localSymbol}
              {data.listingPrice.originalPrice}
            </span>
          ) : (
            ''
          )}
          <style jsx>{`
            .inline-scratch-price {
              text-decoration: line-through;
              color: rgba(84, 84, 84, 0.7);
            }
          `}</style>
        </>
      ) : (
        ''
      );
    }
  }
}

export default InlinePrice;
