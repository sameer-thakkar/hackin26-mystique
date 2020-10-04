import React from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import { SOLEIL, COLORS } from '../../constants/ui-constants';
import { stringIdfy } from '../../utils/helper';

const StyledTabPanel = styled.div`
	position: relative;
	display: grid;
	grid-row-gap: 16px;
	font-family: ${SOLEIL.FONT_STACK};
	line-height: 1.5;
	a {
		color: ${COLORS.MED_SLATE_BLUE};
	}
	p {
		margin: 0;
	}
`;

const StyledTabContent = styled.div`
	display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const Tab = (props) => {
	const { slices, title, sliceProps } = props;
	const { activeTabId, keyIndex } = sliceProps;
	return (
		<StyledTabPanel key={keyIndex}>
			{slices.map((slice, index) => {
				return (
					<StyledTabContent
						key={index}
						className="tab-item-amp"
						isActive={activeTabId == stringIdfy(title)}
					>
						{sliceHandler(slice, {
							index,
							...sliceProps,
						})}
					</StyledTabContent>
				);
			})}
		</StyledTabPanel>
	);
};

export default Tab;
