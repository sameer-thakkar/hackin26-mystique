import React from "react";

type MyProps = {
  tgid: number;
};
type MyState = {
  error: any;
  isLoaded: Boolean;
  data: any;
};
class InlinePrice extends React.Component<MyProps, MyState> {
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
        <span className="inline-price">
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
