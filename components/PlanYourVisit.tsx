import React, { Component } from "react";
import JSONTree from "react-json-tree";

export default class PlanYourVisit extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return <JSONTree data={this.props.data} invertTheme />;
  }
}
