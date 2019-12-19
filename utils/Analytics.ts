import { isMobile } from "./helper";
import { PAGE_TYPE } from "../constants";

export default function Analytics() {
  this.isClient = function() {
    return window && (window as any).dataLayer;
  };
}

Analytics.prototype.setVariableInDataLayer = function(labelProps) {
  if (this.isClient()) {
    this.pushToDataLayer(labelProps);
  }
};
Analytics.prototype.sendHsidToDataLayer = function(hsidProp) {
  if (this.isClient()) {
    this.pushToDataLayer(hsidProp);
  }
};

Analytics.prototype.sendGenericPageEvents = function(labelProps) {
  if (this.isClient()) {
    const { host, pathname } = window.location;
    const allProps = {
      Domain: host,
      "Page Url": `https://${host}${pathname}`,
      "Page Type": PAGE_TYPE.COLLECTION_PAGE,
      "Platform Name": isMobile() ? "Mobile" : "Desktop",
      "Collection Type": "Microbrand",
      ...labelProps
    };
    this.pushToDataLayer(allProps);
  }
};

Analytics.prototype.pushToDataLayer = function(props) {
  (window as any).dataLayer.push(props);
};
