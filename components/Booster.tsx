import React, { Component } from "react";

export default class Booster extends Component<any, any> {
  static defaultProps = {
    color: "#24a1b2"
  };
  render() {
    const { color, text } = this.props;
    return (
      <span className="inline-booster">
        {text}
        <style jsx>
          {`
            .inline-booster {
              color: ${color};
            }
          `}
        </style>
      </span>
    );
  }
}
