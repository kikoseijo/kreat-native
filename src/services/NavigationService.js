// @flow
import * as React from 'react';
import {
	NavigationActions,
	DrawerActions,
	type NavigationParams,
	type NavigationRoute,
	type NavigationContainer
} from 'react-navigation';
import { type MenuItem } from '@store/MenuStore';
import { openLink, toast, menuHookHandler } from '@libs/helpers';
import validUrl from 'valid-url';

let _navigator;

function setTopLevelNavigator(navigatorRef: any) {
	_navigator = navigatorRef;
}

function handleNavigation(menuItem: MenuItem, reset: boolean = false) {
	const { route, hook, params, action, url } = menuItem;
	if (undefined !== action && typeof action === 'function') {
		action();
	} else if (undefined !== url && validUrl.isUri(url)) {
		openLink(url);
	} else if (undefined !== hook) {
		menuHookHandler(hook);
	} else if (undefined !== route) {
		navigate(route, params);
	} else {
		toast('Undefined action route', 'danger');
	}
}

function navigate(routeName: string, params?: NavigationParams) {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	);
}

function toggleDrawer() {
	_navigator.dispatch(
		DrawerActions.toggleDrawer({
			type: DrawerActions.TOGGLE_DRAWER
		})
	);
}

function closeDrawer() {
	_navigator.dispatch(
		DrawerActions.closeDrawer({
			type: DrawerActions.CLOSE_DRAWER
		})
	);
}

function goBack(params?: NavigationParams) {
	_navigator.dispatch(
		NavigationActions.back({
			type: NavigationActions.POP,
			params
		})
	);
}

// add other navigation functions that you need and export them
function popToTop() {
	_navigator.dispatch(NavigationActions.popToTop());
}

function navigateDeep(actions: { routeName: string, params?: NavigationParams }[]) {
	_navigator.dispatch(
		actions.reduceRight(
			(prevAction, action): any =>
				NavigationActions.navigate({
					type: NavigationActions.NAVIGATE,
					routeName: action.routeName,
					params: action.params
					// action: prevAction
				}),
			undefined
		)
	);
}

function getCurrentRoute(): NavigationRoute | null {
	if (!_navigator || !_navigator.state.nav) {
		return null;
	}

	return _navigator.state.nav.routes[_navigator.state.nav.index] || null;
}

function getCurrentRouteName(navigationState: *) {
	if (!navigationState) {
		return null;
	}
	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getCurrentRouteName(route);
	}
	return route.routeName;
}

export default {
	navigate,
	handleNavigation,
	toggleDrawer,
	closeDrawer,
	goBack,
	setTopLevelNavigator,
	navigateDeep,
	popToTop,
	getCurrentRoute,
	getCurrentRouteName
};
