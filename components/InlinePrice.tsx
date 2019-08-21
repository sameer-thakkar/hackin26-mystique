import React from "react";

type IPriceProps = {
  tgid: number;
};
type IPriceState = {
  error: any;
  isLoaded: Boolean;
  data: any;
};
class InlinePrice extends React.Component<IPriceProps, IPriceState> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    };
  }
  componentDidMount() {
    fetch(`https://api.headout.com/api/v5/tour-group/get/${this.props.tgid}`)
      .then(res => res.json())
      .then(
        data => {
          this.setState({
            isLoaded: true,
            data
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, data } = this.state;
    if (error || !isLoaded) {
      return "";
    } else {
      return data.listingPrice ? (
        <span className="inline-price" style={{ color: "#ec1943" }}>
          {" "}
          {data.currency.localSymbol}
          {data.listingPrice.finalPrice}{" "}
        </span>
      ) : (
        ""
      );
    }
  }
}

export default InlinePrice;
