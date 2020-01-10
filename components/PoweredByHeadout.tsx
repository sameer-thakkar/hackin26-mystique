import React, { Fragment } from "react";
import { POWERED_BY_HEADOUT_LOGO } from "../constants";
import { attachQueryParam } from "../utils/helper";

const PoweredByHeadout = () => (
  <Fragment>
    <div className="line"></div>
    <img
      data-src={attachQueryParam(POWERED_BY_HEADOUT_LOGO, "h=40")}
      src={attachQueryParam(POWERED_BY_HEADOUT_LOGO, "h=40&q=10")}
      alt="Powered By Headout logo"
      className="lazyload"
    />
  </Fragment>
);

export default PoweredByHeadout;
