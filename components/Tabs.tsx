import React, { Component } from "react";

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
      <div className="navigation-bar">
        {tabs.map((tab, index) => (
          <a key={index} href={tab.tab_link.url}>
            <div
              className={`${
                tab.is_selected_link === "Yes" ? "selected-nav-tab" : ""
              } navigation-tab`}
            >
              {tab.title}
            </div>
          </a>
        ))}
      </div>
    );
  }
}
