// @flow
import * as React from 'react';
import { type MenuItem } from '@store/MenuStore';

export type VLabel = {
	value: string,
	label: string
};

export type MenuBtn = {
	menuItem: MenuItem,
	active: string,
	pressAction: Function
};

export type ValidationErrors = {
	message: string,
	validation: Object
};

export type MessageType = 'error' | 'success' | 'info';
export type ToastType = 'danger' | 'success' | 'warning';
