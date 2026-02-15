import {
	classNames,
	widgetSettings,
} from './../../lib/utils';
import {
	IWidgetSetting,
} from '../app/app';
import r3e from './../../lib/r3e';
import {
	ESessionPhase
} from './../../types/r3eTypes';
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
	@observable accessor sessionPhase = -1;
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
			this.lastCheck = nowCheck;
			this.sessionPhase = r3e.data.SessionPhase;
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
	};

	render() {		
		const notInRacePhase = this.sessionPhase < ESessionPhase.Countdown;
		if (notInRacePhase) {
			return null;
		}
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
