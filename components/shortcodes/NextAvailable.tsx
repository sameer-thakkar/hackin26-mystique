import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import * as labels from '../../constants/localization/labels';
import { MBContext } from '../../contexts/MBContext';
import { HEADOUT_API_ENDPOINT } from '../../constants';
import { SOLEIL } from '../../constants/ui-constants';

dayjs.extend(calendar);
dayjs.extend(advancedFormat);

const Text = styled.span`
  font-family: ${SOLEIL.FONT_STACK};
`;

type NextAvailableProps = {
  tid: number;
};

type NextAvailableState = {
  error: any;
  isLoaded: Boolean;
  data: any;
};

/**
 *
 * Use the `next-available` shortcode to fetch and display the next available date of any tour (using a TID).
 *
 * Example Use:
 *
 * ```js
 * {next-available tid=16539}
 * ```
 *
 * Properties available:
 *
 * - `tid`
 *  - The tour id of the variant
 */

class NextAvailable extends React.Component<
  NextAvailableProps,
  NextAvailableState
> {
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

  getFormattedDate = (date, currentLanguage) => {
    const dayjsDate = dayjs(date).calendar(
      null,
      this.dayjsFormat(labels[currentLanguage].NEXT_AVAILABLE)
    );
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
        <Text className="inline-availability">
          <MBContext.Consumer>
            {({ lang }) => {
              return this.getFormattedDate(
                nextAvailable.startDateTime,
                lang || 'en'
              );
            }}
          </MBContext.Consumer>
        </Text>
      ) : (
        ''
      );
    }
  }
}

export default NextAvailable;
