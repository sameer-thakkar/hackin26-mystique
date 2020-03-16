import React, { Component } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import ReactTelInput from 'react-telephone-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {
  IP_INFO_TOKEN,
  PREFERRED_COUNTRIES_CODES,
  FLAGS_IMAGE,
  GROUP_TOUR_PREFERED_TOUR,
  GROUP_TOUR_PREFERED_TIME,
  GROUP_TOUR_PREFERED_LANG,
  MODAL_STYLE,
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

  handleInputChange = e => {
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

  handleDateChange = date => this.setState({ date });

  formatDate = date => moment(date).format('DD/MM/YYYY');

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
      countryDialCode,
      date,
      company,
      isAgent,
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
    const theDay = date
      .toDateString()
      .slice(0, 2)
      .toLowerCase();
    return blockedDays.toLowerCase().indexOf(theDay) == -1;
  };

  render() {
    const {
      blackoutStartDate,
      blackoutEndDate,
      blockNDaysGroupBooking,
      minimumPax,
      maximumPax,
      blockedDays,
      disclaimer,
    } = this.props;
    const blackoutDateRange = this.getDatesInRange(
      blackoutStartDate,
      blackoutEndDate
    );
    return (
      <Modal isOpen={true} style={MODAL_STYLE} shouldCloseOnOverlayClick>
        <div className="popup-wrapper">
          <div className="popup-title">
            <span>Group Tickets {minimumPax}+ Pax</span>
            <br />
            <small className="hide-mobi">
              Regardless of the size of group, we offer an exceptional level of
              service
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
            <img
              data-src="https://cdn-imgix-open.headout.com/sites/assets/close-thin.svg?auto=compress&amp;q=10"
              alt="close"
              className="close-group lazyload"
              onClick={this.props.closeGroupBookingModal()}
            />
          </div>
          <div className="hide-desk group-text">
            <span>
              Regardless of the size of group, we offer an exceptional level of
              service and best prices for each of our Tours at Vatican.
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
                      onChange={value =>
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
                        onChange={e => this.handleInputChange(e)}
                        placeholder="No. of Adults"
                        onBlur={() => this.handleInputBlur('GROUP')}
                      />
                      <input
                        className="input-box"
                        type="number"
                        value={this.state.children}
                        name="children"
                        onChange={e => this.handleInputChange(e)}
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
                        onChange={value =>
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
                        onChange={value =>
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
                      filterDate={date =>
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
                      onChange={e => this.handleInputChange(e)}
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
                        onChange={e => this.handleInputChange(e)}
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
                          onChange={e => this.handleInputChange(e)}
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
                      onChange={e => this.handleInputChange(e)}
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
                        autoFocus={false}
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
                  We've received your group tickets request. Our team will get
                  in touch with you soon to help you complete your reservation
                </div>
                <div className="info-text">Or</div>
                <div className="info-text">
                  Alternatively, speak directly to our reservations team to get
                  the best deals and make your booking process as simple as
                  possible. You can call us at{' '}
                  <a href="tel:+1-347-897-0100">+1-347-897-0100</a>
                </div>
                <div className="call hidden"></div>
              </section>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
