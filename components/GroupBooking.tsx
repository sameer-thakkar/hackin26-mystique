import React, { Component } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import ReactTelInput from 'react-telephone-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styled from 'styled-components';
import {
  IP_INFO_TOKEN,
  PREFERRED_COUNTRIES_CODES,
  FLAGS_IMAGE,
  GROUP_TOUR_PREFERED_TIME,
  GROUP_TOUR_PREFERED_LANG,
  GROUP_BOOKING_URL,
} from './../constants';
import {
  isMobileDevice,
  validateEmail,
  validateFullName,
  isGroupValid,
  checkPhoneNumberValidity,
  isFeildSelected,
  fetchUserGeoLocation,
  createGroupBooking,
} from '../utils/helper';
import 'react-datepicker/dist/react-datepicker.css';
import './../public/static/PhoneFieldStyle/phoneFelid.css';
import './../public/static/PhoneFieldStyle/phoneFieldinput.css';
import { RichText } from 'prismic-reactjs';
import { MODAL_STYLE } from '../constants/ui-constants';

const StyledGroupBooking = styled.div`
  .hide-desk {
    display: none;
  }
  .popup-wrap * {
    box-sizing: content-box;
    font-weight: 300;
  }
  .popup-wrapper .popup-title {
    padding: 20px;
    text-align: center;
    background: #00529f;
    color: #fff;
    font-size: 22px;
    line-height: 1.5;
    font-weight: 400;
    border-bottom: 1px solid #44444452;
    font-weight: 500;
    font-family: Graphik;
    span {
      color: #fff;
    }
  }
  .popup-wrapper img.close-group {
    /* filter: invert(1); */
    width: 18px;
    cursor: pointer;
    height: 18px;
    position: absolute;
    top: 30px;
    right: 20px;
    transform: translate3d(-50%, -50%, 0);
    -webkit-font-smoothing: antialiased;
  }
  .popup-wrapper .form-wrapper {
    display: grid;
    grid-column-gap: 20px;
    padding: 0 20px;
    grid-template-columns: 1fr 0 0.5fr;
    box-sizing: content-box;
  }
  .popup-wrapper .form-wrapper:after {
    border-right: 1px dashed #44444452;
    content: '';
    grid-row: 1 / 3;
    grid-column: 2;
  }
  .popup-wrapper .left-form {
    grid-row: 1 / 3;
  }
  .popup-wrapper button.form-button {
    grid-column: 1 / 4;
    justify-self: center;
    margin: 15px;
    padding: 10px 60px;
  }
  .form-button:hover {
    background: #00529f;
    color: #fff;
  }
  .popup-wrapper button.form-button:focus {
    outline: none;
  }
  .form-button {
    padding: 15px 75px;
    border: solid 1px #00529f;
    font-weight: 500;
    color: #00529f;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    transition: ease 0.2s;
    font-size: 14px;
    text-transform: uppercase;
  }
  button.form-button.disabled {
    border: solid 1px #ebebeb;
    color: #fff;
    background-color: #ebebeb;
  }
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
  .form-wrapper .react-select__control,
  .date-picker {
    position: relative;
    /* box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1); */
    border: 1px solid #ebebeb;
    cursor: pointer;
    outline: none;
  }
  .form-wrapper .react-select__value-container {
    padding: 17px 8px;
  }
  .form-wrapper .react-select__control--is-focused,
  .form-wrapper .react-select__control:hover {
    border: 1px solid #ebebeb !important;
    outline: none !important;
    box-shadow: 0 0 0 0 transparent !important;
  }
  .form .react-select__placeholder {
    font-size: 1em;
    font-family: 'Graphik';
    width: 100%;
  }
  form.form {
    display: grid;
    grid-row-gap: 30px;
    margin: 30px 0;
  }
  .form-wrapper .react-select__menu {
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    margin: 0;
  }
  .form-wrapper .react-select__option {
    display: block;
    padding: 13px;
    background-color: #fff;
    font-weight: 400;
    margin-bottom: 0;
    cursor: pointer;
    color: #333333;
    line-height: 1.4;
    font-size: 1em;
    font-family: 'Graphik';
    text-transform: capitalize;
  }
  .form-wrapper .react-select__option:hover,
  .form-wrapper .react-select__option--is-selected {
    color: #546c84;
    background-color: #fbfbfb;
  }
  .form-wrapper .react-select__single-value {
    font-size: 1em;
    font-family: 'Graphik';
  }
  .form-wrapper .split {
    display: grid;
    grid-template-columns: calc(50% - 10px) calc(50% - 10px);
    grid-gap: 20px;
  }
  .input-box {
    border: solid 1px #ebebeb;
    width: calc(100% - 42px);
    font-size: 1em;
    padding: 15px 20px;
    background-color: white;
  }
  .input-box:focus {
    outline: none;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }
  .react-datepicker__input-container input {
    border: none;
    outline: none;
    padding: 17px 8px;
    width: calc(100% - 16px);
    cursor: pointer;
    font-size: 1em;
    font-family: 'Graphik';
  }
  .react-datepicker__input-container input:focus {
    border-color: #333;
  }
  .form .react-datepicker__triangle {
    display: none;
  }
  /* .form .react-datepicker__navigation--previous {
 left: 10px;
 border-left: 3px solid #ccc;
 border-bottom: 3px solid #ccc;
 border-top-color: transparent;
 border-right-color: transparent;
 transform: rotate(45deg);
 background-color: #FFF;
 border-radius: 0;
 padding: 4px;
} */
  .form .react-datepicker {
    border-radius: 0;
    background-color: #fff;
    border: 1px solid #cccccc;
    width: max-content;
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 20px;
  }
  /* .form .react-datepicker__navigation--next {
 left: 10px;
 border-right: 3px solid #ccc;
 border-top: 3px solid #ccc;
 border-bottom-color: transparent;
 border-left-color: transparent;
 transform: rotate(45deg);
 background-color: #FFF;
 border-radius: 0;
 padding: 4px;
} */
  .form .react-datepicker__triangle {
    display: none;
  }
  .form .react-datepicker__header {
    background-color: #fff;
  }

  .form .react-datepicker__day,
  .form .react-datepicker__day-name {
    background: transparent;
    border: none;
    text-align: center;
    padding: 0.7em;
    margin: 0;
    font-weight: normal;
    color: #4d4d4d;
    font-size: 14px;
  }
  .form .react-datepicker__day--disabled {
    color: #cbcbcb;
  }
  .form .react-datepicker__day--selected {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .form img.input-icon {
    height: 20px;
    width: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }
  .hide-mobi a {
    color: #fff;
  }
  .popup-title small {
    font-weight: 300;
  }
  .popup-title small {
    font-weight: 300;
  }
  .group-booking-disclaimer p {
    margin-block-start: 0em;
    margin-block-end: 0em;
  }

  .sub-input.check-box {
    display: grid;
    grid-template-columns: 20px auto;
    justify-content: left;
    align-items: center;
    grid-gap: 5px;
    margin-bottom: 7px;
    font-family: Graphik;
    font-size: 14px;
    color: #444444;
    letter-spacing: -0.5px;
  }

  .sub-input.check-box input {
    width: 15px;
    height: 15px;
    background: transparent;
    color: #fff;
    border: 1px solid #000;
  }
  @media (max-width: 768px) {
    .ReactModal__Overlay--after-open {
      overflow: scroll;
    }
    .ReactModal__Content--after-open {
      width: 100% !important;
      margin: 0 !important;
      left: 0 !important;
    }
    .popup-wrapper {
      width: 100%;
    }
    .popup-wrapper .popup-title {
      text-align: left;
      font-size: 18px;
    }
    .hide-mobi {
      display: none !important;
    }
    .hide-desk {
      display: block;
    }
    .group-text {
      padding: 20px;
      display: block;
      text-align: center;
      font-family: Graphik;
      font-weight: 300;
    }
    .popup-wrapper .form-wrapper {
      grid-template-columns: 1fr;
    }
    .popup-wrapper .form-wrapper .left-form {
      grid-row: 2;
    }
    .popup-wrapper .form-wrapper .left-right {
      grid-row: 1;
    }
    .popup-wrapper button.form-button {
      grid-column: 1 / 1;
      /* grid-row: 3; */
      display: flex;
      margin: 50px auto 0;
    }
    .popup-wrapper .form-wrapper:after {
      display: none;
    }
    .form-wrapper .split {
      grid-template-columns: auto;
      grid-template-rows: auto auto;
      grid-row-gap: 30px;
    }
    .form.form {
      margin: 30px 0 0;
    }
    .form-wrapper {
      margin-bottom: 80px;
    }
    .react-tel-input .country-list {
      right: 0 !important;
      left: -20px !important;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    }
  }
  .form-wrapper .react-select__menu {
    z-index: 99999999 !important;
  }
  .success.wrapx .img {
    margin: 50px auto;
  }
  .success.wrapx {
    margin: 30px;
    text-align: center;
  }
  .success .img {
    height: 70px;
    width: 70px;
    margin: auto;
  }

  .success .main-area {
    grid-row-gap: 30px;
  }
  .success li {
    list-style: none;
  }
  .success li a {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    grid-gap: 10px;
  }
  .success .call img {
    height: auto;
    width: 15px;
  }
  .success .call span {
    font-family: Graphik;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.06;
    letter-spacing: normal;
    text-align: left;
    color: #00529f;
  }
  .info-text {
    font-size: 1em;
    font-family: Graphik;
    line-height: 2.06;
  }
  .error {
    font-size: 0.625em;
    color: #ec1943;
    padding-top: 6px;
    font-family: Graphik;
    position: absolute;
  }
`;
export default class GroupBooking extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      email: '',
      phone: '',
      tour: '',
      lang: '',
      time: '',
      adults: '',
      children: '',
      isSendingRequest: false,
      error: {
        isFullNameValid: false,
        isEmailValid: false,
        isPhoneValid: false,
        isTourSelected: false,
        isLangSelected: false,
        isTimeSelected: false,
        isGroupSizeValid: '',
        isCompanyValid: false,
      },
      isAgent: false,
      company: false,
      date: new Date(),
      showPhoneFeild: false,
      userCountry: null,
      isFetchingGeolocation: false,
      countryDialCode: null,
      isBookingSuccessful: false,
      telDropdownOffset: {
        top: '',
        left: '',
      },
    };
  }

  telInputRef = React.createRef();

  componentDidMount() {
    this.getUserGeoLocation();
    window.addEventListener('resize', () => this.generateOffset());
  }

  generateOffset() {
    const telInputElement = document.getElementById('telInput');
    const offset = telInputElement.getBoundingClientRect();
    const telDropdownOffset = {
      top: offset.top + telInputElement.offsetHeight,
      left: offset.left,
    };
    this.setState({ telDropdownOffset });
  }

  getUserGeoLocation = async () => {
    if (this.state.isFetchingGeolocation) return;
    const url = `https://ipinfo.io/json?token=${IP_INFO_TOKEN}`;
    this.setState({ isFetchingGeolocation: true });
    const country = await fetchUserGeoLocation(url);
    if (country !== null) {
      this.setState({
        userCountry: country,
        isFetchingGeolocation: false,
      });
    } else {
      this.setState({ isFetchingGeolocation: false });
    }
  };

  showPhoneFieldComponent = () => {
    this.generateOffset();
    this.setState({ showPhoneFeild: true });
  };

  handleReactSelectChange = (value, state) => this.setState({ [state]: value });

  handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = e.target.checked;
    }
    this.setState({ [name]: finalValue });
  };

  handlePhoneInputChange = (telNumber, selectedCountry) =>
    this.setState({
      phone: telNumber,
      countryDialCode: selectedCountry.dialCode,
    });

  handleDateChange = (date) => this.setState({ date });

  formatDate = (date) => moment(date).format('DD/MM/YYYY');

  validateInputData = () => {
    const {
      fname,
      email,
      phone,
      lang,
      tour,
      time,
      adults,
      children,
      countryDialCode,
      isAgent,
      company,
    } = this.state;
    const error = {
      isFullNameValid: false,
      isEmailValid: false,
      isPhoneValid: false,
      isTourSelected: false,
      isLangSelected: false,
      isTimeSelected: false,
      isGroupSizeValid: '',
      isCompanyValid: true,
    };
    const phoneWithCountryCode = {
      phone,
      countryDialCode,
    };
    const { minimumPax, maximumPax } = this.props;
    error.isFullNameValid = !validateFullName(fname);
    error.isEmailValid = !validateEmail(email);
    error.isPhoneValid = !checkPhoneNumberValidity(phoneWithCountryCode);
    error.isTourSelected = !isFeildSelected(tour);
    error.isGroupSizeValid = isGroupValid(
      adults,
      children,
      minimumPax,
      maximumPax
    );
    error.isLangSelected = !isFeildSelected(lang);
    error.isTimeSelected = !isFeildSelected(time);
    error.isCompanyValid = !(isAgent ? company.length > 0 : true);
    this.setState({ error });
    return (
      error.isFullNameValid ||
      error.isEmailValid ||
      error.isTourSelected ||
      error.isLangSelected ||
      error.isTimeSelected ||
      error.isPhoneValid ||
      error.isGroupSizeValid ||
      error.isCompanyValid
    );
  };

  handleInputBlur(input) {
    const {
      fname,
      email,
      phone,
      lang,
      tour,
      time,
      adults,
      children,
      countryDialCode,
      isAgent,
      company,
    } = this.state;
    let hasError, error;
    const phoneWithCountryCode = {
      phone,
      countryDialCode,
    };
    const { minimumPax, maximumPax } = this.props;
    switch (input) {
      case 'FULL_NAME':
        hasError = !validateFullName(fname);
        error = { ...this.state.error };
        error.isFullNameValid = hasError;
        this.setState({ error: error });
        return;
      case 'EMAIL':
        hasError = !validateEmail(email);
        error = { ...this.state.error };
        error.isEmailValid = hasError;
        this.setState({ error: error });
        return;
      case 'LANG':
        hasError = !isFeildSelected(lang);
        error = { ...this.state.error };
        error.isLangSelected = hasError;
        this.setState({ error: error });
        return;
      case 'PHONE':
        hasError = !checkPhoneNumberValidity(phoneWithCountryCode);
        error = { ...this.state.error };
        error.isPhoneValid = hasError;
        this.setState({ error: error });
        return;
      case 'TOUR':
        hasError = !isFeildSelected(tour);
        error = { ...this.state.error };
        error.isTourSelected = hasError;
        this.setState({ error });
        return;
      case 'GROUP':
        hasError = isGroupValid(adults, children, minimumPax, maximumPax);
        error = { ...this.state.error };
        error.isGroupSizeValid = hasError;
        this.setState({ error: error });
        return;
      case 'TIME':
        hasError = !isFeildSelected(time);
        error = { ...this.state.error };
        error.isTimeSelected = hasError;
        this.setState({ error: error });
        return;
      case 'COMPANY':
        hasError = isAgent === true && company.length === 0;
        error = { ...this.state.error };
        error.isCompanyValid = hasError;
        this.setState({ error: error });
        return;
      default:
        return;
    }
  }

  sendBookingRequest = async () => {
    const {
      fname,
      email,
      phone,
      lang,
      tour,
      time,
      adults,
      children,
      date,
      company,
    } = this.state;
    const hasError = this.validateInputData();
    if (!hasError) {
      let formattedDate = this.formatDate(date);
      let group = `Adults: ${adults} ${children ? ', Child:' + children : ''}`;
      const data = {
        fname,
        email,
        show: tour.value,
        lang: lang.value,
        time: time.value,
        contact: phone,
        group,
        adults,
        children,
        company,
        date: formattedDate,
      };
      this.setState({ isSendingRequest: true });
      const status = await createGroupBooking(GROUP_BOOKING_URL, data);

      if (status === 'Successful') {
        this.setState({
          isBookingSuccessful: true,
          isSendingRequest: false,
        });
      } else {
        this.setState({ isSendingRequest: false });
      }
    }
  };

  getDatesInRange = (startDate, endDate) => {
    const dateRange = [];
    let nextDate = startDate;
    while (moment(nextDate).isSameOrBefore(moment(endDate))) {
      dateRange.push(moment(nextDate).toDate());
      nextDate = moment(nextDate).add(1, 'days');
    }
    return dateRange;
  };

  isDayAvailable = (date, blockedDays = '') => {
    const theDay = date.toDateString().slice(0, 2).toLowerCase();
    return blockedDays.toLowerCase().indexOf(theDay) == -1;
  };

  render() {
    const {
      blackoutStartDate,
      blackoutEndDate,
      blockNDaysGroupBooking,
      minimumPax,
      blockedDays,
      disclaimer,
      isMobile,
    } = this.props;
    const blackoutDateRange = this.getDatesInRange(
      blackoutStartDate,
      blackoutEndDate
    );
    const styles = MODAL_STYLE;
    if (isMobile) {
      styles.content = {
        ...styles.content,
        height: 'auto',
      };
    }
    return (
      <Modal isOpen={true} style={styles} shouldCloseOnOverlayClick>
        <StyledGroupBooking>
          <div className="popup-wrapper">
            <div className="popup-title">
              <span>Group Tickets {minimumPax}+ Pax</span>
              <br />
              <small className="hide-mobi">
                Regardless of the size of group, we offer an exceptional level
                of service
              </small>
              <br className="hide-mobi" />
              <small className="hide-mobi">
                {' '}
                and best prices for each of our Tours.
                <br />
                Call us on <a href="tel:+1 347-897-0100"> +1 347-897-0100</a>,
                Available 24*7
              </small>
              <br />
              {disclaimer && (
                <small className="group-booking-disclaimer">
                  <RichText render={disclaimer} />
                </small>
              )}
              <span
                role="button"
                tabIndex={0}
                onClick={this.props.closeGroupBookingModal()}
              >
                <img
                  data-src="https://cdn-imgix-open.headout.com/sites/assets/close-thin.svg?auto=compress&amp;q=10"
                  alt="close"
                  className="close-group lazyload"
                />
              </span>
            </div>
            <div className="hide-desk group-text">
              <span>
                Regardless of the size of group, we offer an exceptional level
                of service and best prices for each of our Tours at Vatican.
              </span>
              <span>Call us on +1 347-897-0100</span>
              <span>Available 24*7</span>
            </div>
            {!this.state.isBookingSuccessful ? (
              <div className="form-wrapper">
                <div className="left-form">
                  <form className="form">
                    <div className="input-wrapper">
                      <Select
                        value={this.state.tour}
                        name="tour"
                        options={this.props.groupBookingTourTitles}
                        onChange={(value) =>
                          this.handleReactSelectChange(value, 'tour')
                        }
                        placeholder={'Select Tour'}
                        isSearchable={false}
                        classNamePrefix="react-select"
                        onBlur={() => this.handleInputBlur('TOUR')}
                      />
                      <div className="error">
                        <span>
                          {this.state.error.isTourSelected
                            ? 'Please select your prefered tour'
                            : ''}
                        </span>
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <div className="split">
                        <input
                          className="input-box"
                          type="number"
                          value={this.state.adults}
                          name="adults"
                          onChange={(e) => this.handleInputChange(e)}
                          placeholder="No. of Adults"
                          onBlur={() => this.handleInputBlur('GROUP')}
                        />
                        <input
                          className="input-box"
                          type="number"
                          value={this.state.children}
                          name="children"
                          onChange={(e) => this.handleInputChange(e)}
                          placeholder="No. of Children"
                          onBlur={() => this.handleInputBlur('GROUP')}
                        />
                      </div>
                      <div className="error">
                        <span>{this.state.error.isGroupSizeValid}</span>
                      </div>
                    </div>
                    <div className="split">
                      <div
                        className="input-wrapper"
                        style={{ position: 'relative' }}
                      >
                        <Select
                          value={this.state.lang}
                          name="lang"
                          options={GROUP_TOUR_PREFERED_LANG}
                          onChange={(value) =>
                            this.handleReactSelectChange(value, 'lang')
                          }
                          placeholder={'Select Prefered Language'}
                          isSearchable={false}
                          classNamePrefix="react-select"
                          onBlur={() => this.handleInputBlur('LANG')}
                        />
                        <div className="error">
                          <span>
                            {this.state.error.isLangSelected
                              ? 'Select your prefered language'
                              : ''}
                          </span>
                        </div>
                      </div>
                      <div className="input-wrapper">
                        <Select
                          value={this.state.time}
                          name="time"
                          options={GROUP_TOUR_PREFERED_TIME}
                          onChange={(value) =>
                            this.handleReactSelectChange(value, 'time')
                          }
                          placeholder={'Select Time'}
                          isSearchable={false}
                          classNamePrefix="react-select"
                          onBlur={() => this.handleInputBlur('TIME')}
                        />
                        <div className="error">
                          <span>
                            {this.state.error.isTimeSelected
                              ? 'Select your prefered time slot'
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="date-picker">
                      <DatePicker
                        selected={this.state.date}
                        onChange={this.handleDateChange}
                        minDate={moment()
                          .add(blockNDaysGroupBooking, 'days')
                          .toDate()}
                        excludeDates={[...blackoutDateRange]}
                        dateFormat="dd/MM/yyyy"
                        filterDate={(date) =>
                          this.isDayAvailable(date, blockedDays)
                        }
                        monthsShown={isMobileDevice() ? 1 : 2}
                      />
                      <img
                        className="input-icon group-cal-icon cal-icon lazyload"
                        data-src="https://cdn-imgix-open.headout.com/sites/assets/calendar.svg?auto=compress&amp;q=10"
                        alt="cal"
                      ></img>
                    </div>
                  </form>
                </div>
                <div className="right-form">
                  <form className="form">
                    <div className="input-wrapper">
                      <input
                        className="input-box"
                        type="text"
                        placeholder="Full Name"
                        name="fname"
                        onChange={(e) => this.handleInputChange(e)}
                        onBlur={() => this.handleInputBlur('FULL_NAME')}
                      />
                      <div className="error">
                        <span>
                          {this.state.error.isFullNameValid
                            ? 'Please enter your fullname'
                            : ''}
                        </span>
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <div className="sub-input check-box">
                        <input
                          className="input-box"
                          type="checkbox"
                          id="is-agent"
                          name="isAgent"
                          onChange={(e) => this.handleInputChange(e)}
                        />{' '}
                        <label htmlFor="is-agent"> I am a travel agent </label>
                      </div>
                      {this.state.isAgent == true ? (
                        <div className="sub-input">
                          <input
                            className="input-box"
                            type="company"
                            placeholder="Company"
                            name="company"
                            onChange={(e) => this.handleInputChange(e)}
                            onBlur={() => this.handleInputBlur('COMPANY')}
                          />
                          <div className="error">
                            <span>
                              {this.state.error.isCompanyValid
                                ? 'Please enter a valid company name'
                                : ''}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="input-wrapper">
                      <input
                        className="input-box"
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => this.handleInputChange(e)}
                        onBlur={() => this.handleInputBlur('EMAIL')}
                      />
                      <div className="error">
                        <span>
                          {this.state.error.isEmailValid
                            ? 'Please enter a valid email'
                            : ''}
                        </span>
                      </div>
                    </div>
                    <div className="input-wrapper" id="telInput">
                      {this.state.showPhoneFeild &&
                      this.state.userCountry !== null ? (
                        <ReactTelInput
                          preferredCountries={PREFERRED_COUNTRIES_CODES}
                          flagsImagePath={FLAGS_IMAGE}
                          defaultCountry={this.state.userCountry.toLowerCase()}
                          placeholder="Enter Phone Number"
                          autoFormat={true}
                          value={this.state.phone}
                          name="phone"
                          onChange={this.handlePhoneInputChange}
                          onBlur={() => this.handleInputBlur('PHONE')}
                          listStyle={
                            !isMobileDevice()
                              ? {
                                  position: 'fixed',
                                  top: this.state.telDropdownOffset.top,
                                  left: this.state.telDropdownOffset.left,
                                }
                              : {}
                          }
                        />
                      ) : (
                        <input
                          className="input-box"
                          type="text"
                          placeholder="Phone"
                          onFocus={this.showPhoneFieldComponent}
                        />
                      )}
                      <div className="error">
                        <span>
                          {this.state.error.isPhoneValid
                            ? 'Please enter a valid phone number'
                            : ''}
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
                <button
                  className={
                    this.state.isSendingRequest
                      ? 'form-button disabled'
                      : 'form-button'
                  }
                  onClick={this.sendBookingRequest}
                  disabled={this.state.isSendingRequest}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="success wrapx">
                <section className="main-area wrapper">
                  <div className="img">
                    <img
                      data-src="https://cdn-imgix-open.headout.com/sites/assets/done.svg"
                      alt="done"
                      className="lazyload"
                    />
                  </div>
                  <div className="info-text">
                    We{"'"}ve received your group tickets request. Our team will
                    get in touch with you soon to help you complete your
                    reservation
                  </div>
                  <div className="info-text">Or</div>
                  <div className="info-text">
                    Alternatively, speak directly to our reservations team to
                    get the best deals and make your booking process as simple
                    as possible. You can call us at{' '}
                    <a href="tel:+1-347-897-0100">+1-347-897-0100</a>
                  </div>
                  <div className="call hidden"></div>
                </section>
              </div>
            )}
          </div>
        </StyledGroupBooking>
      </Modal>
    );
  }
}
