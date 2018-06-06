// @flow
import * as React from 'react';
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import Constants from '@libs/constants';

class GoogleAnalytics {
	tracker: *;
	constructor() {
		// console.log('YYY------------------------------');
		// console.log('YYY-GoogleAnalytics-constructor()');
		// console.log('YYY------------------------------');
		this.tracker = new GoogleAnalyticsTracker(Constants.GA_TRACKING_ID);
		GoogleAnalyticsSettings.setDryRun(Constants.IS_DEV);
	}

	trackView(viewName: string) {
		this.tracker.trackScreenView(viewName);
	}
}

export default new GoogleAnalytics();
