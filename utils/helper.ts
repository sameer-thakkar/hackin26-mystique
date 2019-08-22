import { parsePhoneNumberFromString as parseMobile } from "libphonenumber-js/mobile";

export const isMobileDevice = () => {
  return document.documentElement.clientWidth < 768;
};
export const validateEmail = email => {
  let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(String(email).toLowerCase());
};
export const validateFullName = fullName => {
  const parts = fullName.trim().split(" ");
  const hasAtLeastTwoParts = parts.length >= 2;
  let hasAtLeastOneNonInitial = false;
  for (const part of parts) {
    if (part.length > 1) {
      hasAtLeastOneNonInitial = true;
      break;
    }
  }

  return hasAtLeastTwoParts && hasAtLeastOneNonInitial;
};

export const isFeildSelected = field => !(field.length === 0);

export const isGroupValid = (adults, children) => +adults + +children >= 15;

export const checkPhoneNumberValidity = phoneWithCountryCode => {
  const { phone, countryDialCode } = phoneWithCountryCode;
  console.log(phone, countryDialCode);
  if (phone === countryDialCode || !countryDialCode || !phone) {
    return false;
  }
  if (phone.length >= 18 || phone.length <= countryDialCode.length) {
    return false;
  }
  // Indian Exception for number starting with 6
  if (phone.replace(/\D+/g, "").startsWith("+916")) {
    return true;
  }
  if (phone && parseMobile(`${phone}`)) {
    console.log("beta");
    return parseMobile(`${phone}`).isValid();
  }
  return true;
};

export const fetchUserGeoLocation = url =>
  fetch(url)
    .then(response => response.json())
    .then(json => {
      return json.country;
    })
    .catch(err => {
      console.log("Error in fetching country code", err);
      return err;
    });

export const createGroupBooking = (url, data) =>
  fetch("/api/v2/account/auth/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => json.message);
