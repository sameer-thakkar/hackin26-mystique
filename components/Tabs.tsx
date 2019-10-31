import React, { Component } from "react";
import classNames from "classnames";
import LinkResolver from "./LinkResolver";

export default class Tabs extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false
    };
  }
  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    if (!this.state.isClient) {
      return null;
    }
    const { tabs } = this.props;
    return (
      <div
        className={classNames("navigation-bar", {
          "center-align-tabs": tabs.length < 2
        })}
      >
        {tabs.map((tab, index) => (
          <LinkResolver key={index} url={tab.tab_link.url}>
            <div
              className={classNames("navigation-tab", {
                "selected-nav-tab": tab.is_selected_link === "Yes"
              })}
            >
              {tab.title}
            </div>
          </LinkResolver>
        ))}
      </div>
    );
  }
}
