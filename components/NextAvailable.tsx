import React from "react";
import Moment from "moment";

type NextAvailProps = {
  tid: number;
  text: string;
  parentProps: any;
};
type NextAvailState = {
  error: any;
  isLoaded: Boolean;
  data: any;
};
class NextAvailable extends React.Component<NextAvailProps, NextAvailState> {
  static defaultProps = {
    text: "Available"
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    };
  }
  momentFormat = text => {
    return {
      sameDay: `[${text} Today]`,
      nextDay: `[${text} Tomorrow]`,
      lastWeek: `[last] dddd`,
      nextWeek: `[${text} on] Do MMM`,
      sameWeek: `ddd`,
      sameElse: `[${text} on] Do MMM`
    };
  };
  getFormattedDate = date => {
    const momentDate = Moment(date).calendar(
      null,
      this.momentFormat("Available")
    );
    return momentDate.replace(/\s (\d)(st|nd|rd|th)/g, "$1<sup>$2</sup>");
  };
  componentDidMount() {
    fetch(
      `https://api.headout.com/api/public/v1/inventory/list-by/variant?variantId=${this.props.tid}`
    )
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
    let nextAvailable = data.items ? data.items[0] : [];

    if (error || !isLoaded) {
      return "";
    } else {
      return nextAvailable ? (
        <span className="inline-availability">
          {this.getFormattedDate(nextAvailable.startDateTime)}
        </span>
      ) : (
        ""
      );
    }
  }
}

export default NextAvailable;
