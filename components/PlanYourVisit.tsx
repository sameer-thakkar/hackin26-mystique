import React from "react";
import JSONTree from "react-json-tree";

export default class PlanYourVisit extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return <JSONTree data={this.props.data} invertTheme />;
  }
}
