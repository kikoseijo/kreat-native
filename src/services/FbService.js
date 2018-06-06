// @flow
import * as React from 'react';
import { GraphRequestManager, GraphRequest, LoginManager } from 'react-native-fbsdk';

export function getFbUserData(token: string, callBack: Function) {
	const profileRequestConfig = {
		httpMethod: 'GET',
		version: 'v2.12',
		parameters: {
			fields: {
				string: 'id, name, email'
			}
		},
		accessToken: token
	};

	const profileRequest = new GraphRequest('/me', profileRequestConfig, callBack);
	new GraphRequestManager().addRequest(profileRequest).start();
}

export function logoutFb() {
	LoginManager.logOut();
}
