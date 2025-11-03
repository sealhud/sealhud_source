import {
	classNames,
	ePlayerIsFocus,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './fuel.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Fuel extends React.Component<IProps, {}> {
	@observable accessor fuelPerLap = 0;

	@observable accessor fuelLeft = 0;

	@observable accessor fuelCapacity = 0;

	@observable accessor fuelUseActive = 0;

	@observable accessor lastCheck = 0;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor playerIsFocus = false;

	@observable accessor isAI = false;

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
			this.playerIsFocus = ePlayerIsFocus;
			this.fuelPerLap = r3e.data.FuelPerLap;
			this.fuelUseActive = r3e.data.FuelUseActive;
			this.fuelLeft = r3e.data.FuelLeft;
			this.fuelCapacity = r3e.data.FuelCapacity;
			this.isAI = r3e.data.ControlType === 1;
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
			(
				!this.fuelUseActive ||
				(!this.playerIsFocus && !this.isAI)
			) && !showAllMode
		) {
			return null;
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('fuel', this.props.className, {
					low: this.fuelLeft < this.fuelPerLap * 2
				})}
			>
				{(!!this.fuelUseActive || showAllMode) && (
					<div>
						<div className="fuelPerLap">
							{showAllMode
								?	2.54
								:	this.fuelPerLap.toFixed(2)}
						</div>
						<div className="barContainer">
							<div
								className="bar "
								style={{
									height: `${showAllMode
										?	50
										:	(this.fuelLeft /
										this.fuelCapacity) *
										100}%`
								}}
							/>
						</div>
						<SvgIcon src={require('./../../img/icons/fuel.svg')} />
						<div className="fuelLeft">
							{showAllMode
								?	109.5
								:	this.fuelLeft.toFixed(1)}
						</div>
					</div>
				)}
			</div>
		);
	}
}
