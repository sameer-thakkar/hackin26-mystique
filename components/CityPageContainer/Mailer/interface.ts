export interface IMailerProps {
  heading: string | string[];
  subHeading: string;
  isMobile: boolean;
  eventName: string;
  isCatOrSubCatPage: boolean;
}

export interface ISubscriptionForm {
  eventName: string;
  isCatOrSubCatPage: boolean;
}
