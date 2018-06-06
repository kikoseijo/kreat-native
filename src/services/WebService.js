// @flow
import * as React from 'react';
import RegisterDeviceMutation from '@graphql/mutations/RegisterDeviceMutation';
import Constants from '@libs/constants';
import { processErrors, toast, logOut, logObject } from '@libs/helpers';
import RootStore from '@store';
import NavigationService from '@services/NavigationService';
import type { GraphQLResponseErrors } from 'react-relay-network-modern/lib/definition';

function pingBackendWithDeviceInformation(token: string) {
	// console.log('pingBackendWithDeviceInformation', pingBackendWithDeviceInformation);
	const payloadInput = Object.assign({}, Constants.DEVICE_INFO, { push_token: token });
	RegisterDeviceMutation(
		payloadInput,
		({ success, msg, payload }) => {
			if (success) {
				RootStore.accountStore.prepareDeviceRegistration(null, false);
				// if (Constants.IS_DEV) {
				// 	toast('Device ping success', 'success');
				// }
			}
		},
		_handleError
	);
}

const _handleError = ({ name, res }: *) => {
	// logObject(res);
	if (res) {
		if (res.status === 4001) {
			console.log('IM GOING TO LOGOUT');
			logOut();
		} else {
			// const { errors } = res;
			if (res && res.length > 0) {
				processErrors(res);
				return;
			} else {
				if (res.length > 0) {
					toast(res[0].message, 'danger', 8000);
				} else {
					toast(`Device registration error.${'\n'}Pruebe de nuevo pasados unos minutos`, 'warning', 5000);
				}
			}
		}
	} else {
		toast('Unhandled error. XX-12-XX', 'danger', 8000);
	}
};

export function pingServerWithDevice() {
	// console.log('[--XX pingServerWithDevice() XX--]');
	let { fcmToken } = RootStore.accountStore;
	if (!fcmToken) fcmToken = '-FALSE-';
	pingBackendWithDeviceInformation(fcmToken);
}

export function handleFcmTokenPayload(token: string) {
	const { fcmToken } = RootStore.accountStore;
	let thisToken = fcmToken;

	if (token.length > 0 && token !== thisToken) {
		thisToken = token;
		RootStore.accountStore.prepareDeviceRegistration(token, false);
	}

	const { isLogedIn, isDeviceRegistered } = RootStore.accountStore;
	if (isLogedIn && !isDeviceRegistered) {
		pingBackendWithDeviceInformation(thisToken);
	}

	// console.log('Constants.DEVICE_INFO', Constants.DEVICE_INFO);
}
