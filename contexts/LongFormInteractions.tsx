import React, { Component, createContext } from 'react';

export const LongFormInteractionContext = createContext({});

export class LongFormInteractionContextProvider extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activeTour: {
        tgid: null,
        hoist: false,
      },
      activeCategoryTgids: [],
    };
  }

  clickTour = (tgid, hoist) => {
    if (this.state.activeTour.tgid != tgid) {
      let newState = { ...this.state };
      newState.activeTour = {
        tgid,
        hoist,
      };
      if (hoist) {
        newState.activeCategoryTgids = [tgid, ...newState.activeCategoryTgids];
      }
      this.setState(newState);
    } else
      this.setState({
        ...this.state,
        activeTour: {
          tgid: null,
        },
      });
  };

  closeTour = () => {
    this.setState({
      ...this.state,
      activeTour: {
        tgid: null,
      },
    });
  };

  render() {
    return (
      <LongFormInteractionContext.Provider
        value={{
          ...this.state,
          clickTour: this.clickTour,
          closeTour: this.closeTour,
        }}
      >
        {this.props.children}
      </LongFormInteractionContext.Provider>
    );
  }
}
