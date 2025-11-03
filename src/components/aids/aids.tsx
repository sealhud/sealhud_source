import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { IAidSettings } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, nowCheck, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import './aids.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Aids extends React.Component<IProps, {}> {
	@observable accessor aids: IAidSettings = {
		// ABS; -1 = N/A, 0 = off, 1 = on, 5 = active
		Abs: INVALID,
		// TC; -1 = N/A, 0 = off, 1 = on, 5 = active
		Tc: INVALID,
		// ESP; -1 = N/A, 0 = off, 1 = low, 2 = medium, 3 = high, 5 = active
		Esp: INVALID,
		// Countersteer; -1 = N/A, 0 = off, 1 = on, 5 = active
		Countersteer: INVALID,
		// Cornering; -1 = N/A, 0 = off, 1 = on, 5 = active
		Cornering: INVALID
	};

	@observable accessor lastCheck = 0;

	@observable accessor sessionType = -1;

	@observable accessor playerIsFocus = false;

	@observable accessor sessionPhase = -1;

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
			this.playerIsFocus = ePlayerIsFocus;
			this.lastCheck = nowCheck;
			this.aids = r3e.data.AidSettings;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
		}
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			(!this.playerIsFocus && !showAllMode) ||
			(
				this.aids.Abs < 1 &&
				this.aids.Esp < 1 &&
				this.aids.Tc < 1 &&
				this.aids.Countersteer < 1 &&
				this.aids.Cornering < 1 &&
				!showAllMode
			) ||
			r3e.data.GameInReplay > 0
		) {
			return null;
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('aids', this.props.className)}
			>
				<div className="inner">
					{(this.aids.Abs > 0 || showAllMode) && (
						<div
							className={classNames(
								'aid abs',
								`state-${this.aids.Abs}`
							)}
						>
							<SvgIcon
								src={require('./../../img/icons/abs.svg')}
							/>
						</div>
					)}
					{(this.aids.Esp > 0 || showAllMode) && (
						<div
							className={classNames(
								'aid esp',
								`state-${this.aids.Esp}`
							)}
						>
							<SvgIcon
								src={require('./../../img/icons/esp.svg')}
							/>
						</div>
					)}
					{(this.aids.Tc > 0 || showAllMode) && (
						<div
							className={classNames(
								'aid tc',
								`state-${this.aids.Tc}`
							)}
						>
							<SvgIcon
								src={require('./../../img/icons/tc.svg')}
							/>
						</div>
					)}
					{(this.aids.Countersteer > 0 || showAllMode) && (
						<div
							className={classNames(
								'aid countersteer',
								`state-${this.aids.Countersteer}`
							)}
						>
							<SvgIcon
								src={require('./../../img/icons/countersteer.svg')}
							/>
						</div>
					)}
					{(this.aids.Cornering > 0 || showAllMode) && (
						<div
							className={classNames(
								'aid cornering',
								`state-${this.aids.Cornering}`
							)}
						>
							<SvgIcon
								src={require('./../../img/icons/cornering.svg')}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
