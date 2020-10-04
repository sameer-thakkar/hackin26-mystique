import React from 'react';
import { useAmp } from 'next/amp';
import Accordion from './Accordion';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';

/**
 *
 * Accordion slice allows you to have toggle-able content, heading is visible at all times and on-click the respective content gets shown/hidden.<br>
 * Commonly used for creating FAQs<br>
 * First accordion item is open by default.
 *
 * ### Non-Repeatable Zone
 * **Heading**: Section Heading.
 *
 * ### Repeatable Zone
 * **Heading**: Simple text field, this is always shown and is the clickable part of the Accordion.<br>
 * **Content**: RichText field, is by default hidden (except for first) unless user clicks on the heading or the chevron icon.
 *
 */

const AccordionGroup: React.FC<{
	accordions: {
		content: any;
		heading: string;
	}[];
	heading: string;
	useSchema: Boolean;
}> = ({ accordions, heading, useSchema }) => {
	const isAmp = useAmp();
	return (
		<div
			{...(useSchema && {
				itemType: 'https://schema.org/FAQPage',
				itemScope: true,
			})}
		>
			<TitleTextCombo>{heading ? <h2>{heading}</h2> : null}</TitleTextCombo>
			{isAmp ? (
				<amp-accordion animate="">
					{accordions.map((accordion, index) => {
						const content = <RichContent render={accordion.content} />;
						return (
							<Accordion
								key={index}
								content={content}
								heading={accordion.heading}
								useSchema={useSchema}
								isAmp
							/>
						);
					})}
				</amp-accordion>
			) : (
				<>
					{accordions.map((accordion, index) => {
						const content = <RichContent render={accordion.content} />;
						return (
							<Accordion
								key={index}
								content={content}
								isOpenOverride={index == 0}
								heading={accordion.heading}
								useSchema={useSchema}
							/>
						);
					})}
				</>
			)}
		</div>
	);
};

export default AccordionGroup;
