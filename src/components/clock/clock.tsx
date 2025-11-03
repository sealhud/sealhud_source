import {
	classNames,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode
} from '../app/app';
import {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import './clock.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Clock extends React.Component<IProps, {}> {

	@observable accessor localTime = '';
	lastCheck = 0;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		if (
			(
				highPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastCheck >= 266
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 133
			)
		) {
			this.lastCheck = nowCheck;
			const theTime = new Date();
			const hours = theTime.getHours();
			const minutes = theTime.getMinutes();
			const seconds = theTime.getSeconds();
			this.localTime =
				`${
					hours
				}:${
					minutes >= 10
						?	''
						:	'0'
				}${
					minutes
				}:${
					seconds >= 10
						?	''
						:	'0'
				}${
					seconds
				}`;
		}
	};

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('theClock', this.props.className, {
					shouldShow: 1 === 1
				})}
			>
				{/* Clock */}
				<div className="theTime">
					{this.localTime}
				</div>
			</div>
		);
	}
}
