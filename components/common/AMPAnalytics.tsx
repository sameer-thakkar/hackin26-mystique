import React from 'react';
import { useAmp } from 'next/amp';
import { GTM_AMP_URL, GTM_AMP_KEY_PROD } from 'constants/index';

type AMPAnalyticsProps = {
	asPath: string;
	query: any;
};

const AmpAnalytics: React.FC<AMPAnalyticsProps> = ({ asPath, query }) => {
	const amp = useAmp();

	if (!amp) return null;

	let gtmConfig;
	const isNonProd =
		asPath.includes('localhost') ||
		query.previewSession ||
		asPath.includes('stage-');
	if (isNonProd) {
		gtmConfig = `${GTM_AMP_URL}?id=${GTM_AMP_KEY_PROD}&gtm_cookies_win=x`;
	} else {
		gtmConfig = `${GTM_AMP_URL}?id=${GTM_AMP_KEY_PROD}&gtm_cookies_win=x`;
	}

	return (
		<amp-analytics
			config={gtmConfig}
			data-credentials="include"
		></amp-analytics>
	);
};

export default AmpAnalytics;
