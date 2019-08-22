export const IP_INFO_TOKEN = "108f1155413636";
export const PREFERRED_COUNTRIES_CODES = [
  "us",
  "gb",
  "it",
  "fr",
  "ae",
  "sg",
  "au",
  "de",
  "th"
];
export const FLAGS_IMAGE =
  "https://cdn-imgix-open.headout.com/flags/flags@2x.png";
export const GROUP_TOUR_PREFERED_TOUR = [
  {
    value:
      "Guided tour of Vatican Museum, Sistine Chapel & St. Peter's Basilica",
    label:
      "Guided tour of Vatican Museum, Sistine Chapel & St. Peter's Basilica"
  },
  {
    value:
      "Early Access Group Tour to St. Peter's Basilica, Vatican Museum & Sistine Chapel",
    label:
      "Early Access Group Tour to St. Peter's Basilica, Vatican Museum & Sistine Chapel"
  }
];
export const GROUP_TOUR_PREFERED_TIME = [
  { value: "Morning Tour", label: "Morning Tour" },
  { value: "Afternoon Tour", label: "Afternoon Tour" }
];
export const GROUP_TOUR_PREFERED_LANG = [
  { value: "English", label: "🇬🇧 English" },
  { value: "French", label: "🇫🇷 Français" },
  { value: "Spanish", label: "🇪🇸 Español" },
  { value: "Italian", label: "🇮🇹 Italiano" }
];

export const ERROR = {
  TOUR: "Select your prefered tour.",
  LANG: "Select your prefered language.",
  TIME: "Select your prefered time."
};

export const GROUP_BOOKING_URL = "https://vaticantickets.org/gsubmit";

export const MODAL_STYLE = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1
  },
  content: {
    width: "75%",
    maxWidth: "1020px",
    margin: "auto",
    boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.1)",
    background: "#fff",
    borderRadius: "4px",
    padding: "0 0px 25px",
    zIndex: "20",
    top: 0,
    bottom: 0,
    height: "max-content",
    border: "none"
  }
};
