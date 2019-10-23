import React, { Fragment } from "react";
import { POWERED_BY_HEADOUT_LOGO } from "../constants";

const PoweredByHeadout = () => (
  <Fragment>
    <div className="line"></div>
    <img src={POWERED_BY_HEADOUT_LOGO} alt="Powered By Headout logo" />
  </Fragment>
);

export default PoweredByHeadout;
