import React from 'react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { HEADOUT_API_ENDPOINT } from '../constants';

dayjs.extend(calendar);
dayjs.extend(advancedFormat);

type NextAvailableProps = {
  tid: number;
  text: string;
  parentProps: any;
};

type NextAvailableState = {
  error: any;
  isLoaded: Boolean;
  data: any;
};

class NextAvailable extends React.Component<
  NextAvailableProps,
  NextAvailableState
> {
  static defaultProps = {
    text: 'Available',
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
    };
  }

  dayjsFormat = (text) => {
    return {
      sameDay: `[${text} Today]`,
      nextDay: `[${text} Tomorrow]`,
      lastWeek: `[last] dddd`,
      nextWeek: `[${text} on] Do MMM`,
      sameWeek: `ddd`,
      sameElse: `[${text} on] Do MMM`,
    };
  };

  getFormattedDate = (date) => {
    const dayjsDate = dayjs(date).calendar(null, this.dayjsFormat('Available'));
    return dayjsDate.replace(/\s (\d)(st|nd|rd|th)/g, '$1<sup>$2</sup>');
  };

  componentDidMount() {
    fetch(
      `${HEADOUT_API_ENDPOINT}/public/v1/inventory/list-by/variant?variantId=${this.props.tid}`
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            data,
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
    const { error, isLoaded, data } = this.state;
    let nextAvailable = data.items ? data.items[0] : [];

    if (error || !isLoaded) {
      return '';
    } else {
      return nextAvailable ? (
        <span className="inline-availability">
          {this.getFormattedDate(nextAvailable.startDateTime)}
        </span>
      ) : (
        ''
      );
    }
  }
}

export default NextAvailable;
