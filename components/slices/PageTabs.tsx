import React, { Component } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import LinkResolver from '../LinkResolver';

const Tabs = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-auto-flow: column;
  justify-content: space-between;
  margin: auto;
  border-bottom: 1px solid #ebebeb;
  justify-content: ${({ align }) => {
    switch (align) {
      case 'center':
        return 'space-around';
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        break;
    }
  }};
  .navigation-tab {
    font-weight: 600;
    font-family: Graphik;
    color: #444444;
    font-size: 18px;
    padding: 20px;
  }

  .selected-nav-tab {
    border-bottom: 3px solid #ec1943;
    border-radius: 1px;
    color: #ec1943;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    border: none;

    a {
      width: 100% !important;
      text-align: center;
    }
    .navigation-tab {
      border-bottom: 1px solid #ebebeb;
      font-size: 16px;
      padding: 15px;
    }
    .selected-nav-tab {
      border-bottom: 2px solid #ec1943;
    }
    .content-container {
      margin-left: 15px !important;
      margin-right: 15px !important;
    }
  }
`;

export default class PageTabs extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false,
    };
  }
  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    if (!this.state.isClient) {
      return null;
    }
    const { tabs, align } = this.props;
    return (
      <Tabs align={align}>
        {tabs.map((tab, index) => (
          <LinkResolver key={index} url={tab.tab_link.url}>
            <div
              className={classNames('navigation-tab', {
                'selected-nav-tab': tab.is_selected_link === 'Yes',
              })}
            >
              {tab.title}
            </div>
          </LinkResolver>
        ))}
      </Tabs>
    );
  }
}
