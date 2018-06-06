// @flow
import * as React from 'react';
import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
import * as WebService from './WebService';

import Constants from '@libs/constants';
import RootStore from '@store';
import { PushMsg } from '@store/models';

class PushMsgService {
	tokenListener: *;
	messageListener: *;
	notificationDisplayedListener: *;
	notifOpenedListener: *;
	notificationListener: *;
	error: boolean = false;

	constructor() {
		if (Constants.IS_ANDROID) {
			this.androidChannel();
		}
	}

	getCurrentToken() {
		firebase
			.messaging()
			.getToken()
			.then(fcmToken => {
				if (fcmToken) {
					WebService.handleFcmTokenPayload(fcmToken);
				} else {
					console.log('ERROR: PushMsgs.getCurrentToken()');
				}
			});
	}

	startTokenListner() {
		this.tokenListener = firebase.messaging().onTokenRefresh((fcmToken: string) => {
			// console.log('fcmToken', fcmToken);
			WebService.handleFcmTokenPayload(fcmToken);
			this.startMsgsListener();
		});
	}

	endTokenListener() {
		this.tokenListener();
		// this.endMsgsListener();
		this.endNotificationListener();
	}

	startMsgsListener() {
		firebase
			.messaging()
			.hasPermission()
			.then(enabled => {
				if (enabled) {
					// this.launchMsgsListener();
					this.addNotificationListeners();
				} else {
					console.log('[--PushMsgs require requestUserPermisions; XX--]');
					this.requestUserPermisions();
				}
			});
	}

	async requestUserPermisions() {
		try {
			await firebase.messaging().requestPermission();
			// this.launchMsgsListener();
			this.addNotificationListeners();
		} catch (error) {
			console.log('PushMsgs.requestUserPermisions => "User denied"');
		}
	}

	launchMsgsListener() {
		this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
			// Process your message as required
			console.log('Process your message as required', message);
			alert(message);
		});
	}

	endMsgsListener() {
		this.messageListener();
	}

	addNotificationListeners() {
		this.notificationDisplayedListener = firebase
			.notifications()
			.onNotificationDisplayed((notification: Notification) => {
				// Process your notification as required
				// ANDROID: Remote notifications do not contain the channel ID.
				// You will have to specify this manually if you'd like to re-display the notification.
				// console.log('[--XX firebase.notifications().onNotificationDisplayed() XX--]');
				// console.log('notification', notification);
				const push = RootStore.pushMsgStore.addNotification(notification);
				// this.displayNotification(this.buildNotification(push));
			});

		this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
			// Process your notification as required
			console.log('[--XX firebase.notifications().onNotification() XX--]');
			console.log('notification', notification);
			const push = RootStore.pushMsgStore.addNotification(notification);
			this.displayNotification(this.buildNotification(push));
		});

		// App in Foreground and background
		this.notifOpenedListener = firebase.notifications().onNotificationOpened((notifOpen: NotificationOpen) => {
			RootStore.pushMsgStore.addOpenNotification(notifOpen, true);
		});

		// App Closed
		firebase
			.notifications()
			.getInitialNotification()
			.then((notifOpen: NotificationOpen) => {
				RootStore.pushMsgStore.addOpenNotification(notifOpen);
			});
	}

	endNotificationListener() {
		this.notificationDisplayedListener();
		this.notificationListener();
		this.notifOpenedListener();
	}

	buildNotification(pushMsg: PushMsg) {
		const nNotif = new firebase.notifications.Notification();
		nNotif.setNotificationId(pushMsg.msgId);
		nNotif.setTitle(pushMsg.title);
		nNotif.setBody(pushMsg.body);
		if (Constants.IS_ANDROID) {
			nNotif.android.setChannelId(Constants.PUSH_CHANNEL_ID).android.setSmallIcon('ic_launcher');
		}
		// nNotif.setData({
		// 	key1: 'value1',
		// 	key2: 'value2'
		// });
		return nNotif;
	}

	displayNotification(newNotification: Notification) {
		firebase.notifications().displayNotification(newNotification);
	}

	androidChannel() {
		// Build a channel
		const channel = new firebase.notifications.Android.Channel(
			Constants.PUSH_CHANNEL_ID,
			'SoS Channel',
			firebase.notifications.Android.Importance.Max
		).setDescription('Sos Channel for android');
		// Create the channel
		firebase.notifications().android.createChannel(channel);
	}

	scheduleNotification(notification: Notification) {
		const date = new Date();
		date.setMinutes(date.getMinutes() + 1);

		firebase.notifications().scheduleNotification(notification, {
			fireDate: date.getTime()
		});
	}
}

export default new PushMsgService();
