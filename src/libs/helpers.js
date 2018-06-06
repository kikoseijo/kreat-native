// @flow
import * as React from 'react';
import { Linking, Image } from 'react-native';
import { Toast, Icon } from 'native-base';
import { showLocation } from 'react-native-map-link';
import { checkOptions } from 'react-native-map-link/utils';
import NavigationService from '@services/NavigationService';
import type { ValidationErrors, ToastType } from './types_ui';
import RootStore from '@store';
import type { HookMenuTypes } from '@store/MenuStore';

const moment = require('moment');
moment.locale('es', {
	relativeTime: {
		future: 'en %s',
		past: '%s',
		s: '0 seg',
		ss: 'hace %d seg',
		m: '1 min',
		mm: 'hace %d min',
		h: '1h',
		hh: 'hace %d horas',
		d: 'ayer',
		dd: 'hace %d días',
		M: 'hace 1 mes',
		MM: 'hace %d meses',
		y: 'hace 1 año',
		yy: '%d años'
	}
});

/*
 * Get 2 Initials from a given name
 */
export function getInitials(inputName: string): string {
	if (!inputName || inputName.length < 2) {
		return inputName;
	}
	var names = inputName.split(' '),
		initials = names[0].substring(0, 1).toUpperCase();

	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase();
	}
	return initials;
}

export function m2Km(meters: number): string {
	var km = meters / 1000;
	return km.toFixed(1) + ' km';
}

export function padDigits(number: number, digits: number) {
	return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
}

export function stripHtml(html?: string) {
	if (undefined === html) {
		return '';
	}
	const pre = html.replace('<br />', '\n');
	return pre.replace(/<[^>]+>/g, '');
}

export function stripHtmlTruncate(html: string, truncAt?: number = 220): string {
	const pre = html.replace('<br />', '\n');
	const shortString = pre.length > truncAt ? pre.substr(0, truncAt - 1) + '...' : pre;
	return shortString.replace(/<[^>]+>/g, '');
}

export function isFunction(obj: any) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
}

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: *) => {
	const paddingToBottom = 180;
	console.log(
		'layoutMeasurement.height + contentOffset.y,',
		layoutMeasurement.height + contentOffset.y,
		contentSize.height - paddingToBottom
	);
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

// export const getEnv = (token: string) => {
// 	return createRelayEnvironment(token, {});
// };

export function ago(value: string) {
	return moment
		.utc(value)
		.local()
		.fromNow();
}

export function formatDate(value: string, format: string = 'DD MMM YY') {
	return moment
		.utc(value)
		.local()
		.format(format);
}

export function price($amount: number, $toDecimal: number = 0) {
	return number($amount, $toDecimal);
}
export function number($number: number, $toDecimal: number = 0) {
	const val = ($number / 1).toFixed($toDecimal).replace('.', ',');
	return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const customIcon = (image: number, styles: any) => {
	return <Image source={image} style={styles} />;
};

export function menuHookHandler(hookId: HookMenuTypes) {
	if (hookId === 'OpenBussinesMaps') {
		openMapUrl();
	} else if (hookId === 'Logout') {
		logOut();
	} else {
		toast('Undefined Hook route', 'danger');
	}
}

export function logOut() {
	console.log('logOut()');
	RootStore.accountStore.logout().then(() => {
		NavigationService.navigate('Preloading');
	});
}

// whatsapp://send?text=hello&phone=xxxxxxxxxxxxx
export const openLink = (url: string): void => {
	Linking.canOpenURL(url)
		.then(supported => {
			if (!supported) {
				Toast.show({
					text: "Can't handle url: " + url,
					type: 'danger',
					duration: 3000
				});
			} else {
				return Linking.openURL(url);
			}
		})
		.catch(err => Toast.show({ text: err, type: 'danger', duration: 3000 }));
};

export function openMapUrl(lat?: number, lng?: number) {
	const { contact, maps } = RootStore.appStore.settings;
	let params = {
		latitude: lat ? lat : maps.latitude,
		longitude: lng ? lng : maps.longitude,
		// sourceLatitude: -8.0870631, // optionally specify starting location for directions
		// sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
		title: contact.name, // optional
		googleForceLatLon: true, // optionally force GoogleMaps to use the latlon for the query instead of the title
		googlePlaceId: 0 // optionally specify the google-place-id
		// dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
		// dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
		// cancelText: 'This is the cancel button text' // optional (default: 'Cancel')
		// app: 'uber'  // optionally specify specific app to use
	};

	const googlPlaceId = maps.google_place_cid ? Number.parseInt(maps.google_place_cid) : 0;
	if (googlPlaceId > 0) {
		params.googlePlaceId = googlPlaceId;
	}

	if (checkOptions(params)) {
		// console.log('params', params);
		showLocation(params);
	} else {
		toast('Cant open Maps, contact support.');
	}
}

export function toastSuccess($text: string) {
	toast($text, 'success');
}

export function toast($text: string, $type: ToastType = 'danger', $duration: number = 3000) {
	Toast.show({ text: $text, type: $type, duration: $duration });
}

export const renderIcon = (icon: string, styles: any) => {
	return <Icon name={icon} style={styles} />;
};

export const openLinkUrl = (url: string | Function) => {
	if (typeof url === 'string') {
		if (url.toLowerCase().includes('http')) {
			openLink(url);
		} else {
			NavigationService.navigate(url);
		}
	}
};

export function preProcessGraphQlErrors(res: *) {
	if (!res) {
		console.log('[-- SUPER EERRROR --]');
		return;
	}
	const { errors } = res;
	if (errors && errors.length > 0) {
		if (errors.message) {
			processMsgPayload(errors.message, 'danger');
		} else {
			processErrors(errors);
		}
	} else {
		processErrors(res);
	}
}

export function processMsgPayload(msg: string, type: ToastType = 'warning') {
	if (msg === 'Check your email') {
		if (!RootStore.accountStore.resetMailSent) {
			RootStore.accountStore.toggleEmailNotice();
		} else {
			alert(msg);
		}
	} else {
		Toast.show({ text: msg, position: 'top', type: type, duration: 6000 });
	}
}

export function processErrors(errors: *) {
	// console.log('errors', errors);
	if (errors.length > 0) {
		for (var i = 0; i < errors.length; i++) {
			const err = errors[i];
			if (err.message && err.message === 'validation') {
				processValidationErrors(err.validation);
			} else {
				processMsgPayload(err.message, 'danger');
			}
		}
	} else {
		const { message } = errors;
		if (message) {
			processMsgPayload(message, 'danger');
		} else {
			toast('Unhandled error validation helper V2.');
			console.log('Unhandled error validation helper V2.', errors);
		}
	}
}

// TODO: Hay que mejorar este proceso.
function processValidationErrors(errors) {
	var count = 0;
	for (var errMessage in errors) {
		// if (errors.hasOwnProperty(errMessage)) {
		if (count === 0) {
			showValidationError(errors[errMessage][0]);
		} else {
			setTimeout(function() {
				showValidationError(errors[errMessage][0]);
			}, 3400);
		}
		count += 1;
		// }
	}
}

function showValidationError(msg: string) {
	const showMsg = msg.replace('payload.', '');
	toast(showMsg);
}

export function logObject(objeto: Object) {
	if (typeof objeto !== Object) {
		console.log('CANT log non Object: ', typeof objeto);
		return;
	}
	console.log('typeof objeto', typeof objeto);
	for (let [key, value] of Object.entries(objeto)) {
		console.log('key, value', key, value);
	}
}
