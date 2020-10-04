import React, { Component } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import LinkResolver from '../LinkResolver';
import { SOLEIL } from 'constants/ui-constants';

const Tabs = styled.div`
	display: grid;
	grid-column-gap: 40px;
	grid-auto-flow: column;
	justify-content: left;
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
		font-weight: 500;
		font-family: ${SOLEIL.FONT_STACK};
		color: #444444;
		font-size: 22px;
		line-height: 1.3;
		padding-bottom: 16px;
	}

	.selected-nav-tab {
		border-bottom: 3px solid #ec1943;
		border-radius: 1px;
		color: #ec1943;
	}
	@media (max-width: 768px) {
		overflow: scroll;
		margin: 0 -16px;
		justify-content: left;
		padding-left: 16px;
		width: calc(100vw - 16px);
		grid-column-gap: 24px;
		grid-auto-columns: max-content;
		align-items: center;

		a {
			width: 100% !important;
			text-align: center;
		}
		.navigation-tab {
			font-size: 16px;
		}
		.navigation-tab:last-child {
			margin-right: 16px;
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
