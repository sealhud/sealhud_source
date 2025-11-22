import {
	classNames,
	ePlayerIsFocus,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	// lowPerformanceMode,
	// highPerformanceMode,
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
import './inputs.scss';
import SvgIcon from '../svgIcon/svgIcon';
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Inputs extends React.Component<IProps, {}> {
	@observable accessor throttlePedal = 0;

	@observable accessor brakePedal = 0;

	@observable accessor clutchPedal = 0;

	@observable accessor wheelTurn = 0;

	@observable accessor lastCheck = 0;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor playerIsFocus = false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		// Use raw input if player is driving
		this.lastCheck = nowCheck;
		this.playerIsFocus = ePlayerIsFocus;
		this.sessionType = r3e.data.SessionType;
		this.sessionPhase = r3e.data.SessionPhase;
		if (this.playerIsFocus) {
			this.throttlePedal = r3e.data.ThrottleRaw;
			this.brakePedal = r3e.data.BrakeRaw;
			this.clutchPedal = r3e.data.ClutchRaw;
		} else {
			this.throttlePedal = r3e.data.Throttle;
			this.brakePedal = r3e.data.Brake;
			this.clutchPedal = r3e.data.Clutch;
		}
		this.wheelTurn =
			r3e.data.SteerInputRaw * (r3e.data.SteerWheelRangeDegrees / 2);
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (r3e.data.GameInReplay > 0 && !this.playerIsFocus && !showAllMode) { return null; }
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('inputs', this.props.className, {
					hasWheel:		this.props.settings.subSettings.steeringInput
									.enabled &&
									(this.playerIsFocus || showAllMode),
					showNumbers:	this.props.settings.subSettings.showInputNumbers
									.enabled
				})}
			>
				{/* Clutch */}
				{
					this.props.settings.subSettings.showInputNumbers.enabled && (
						<div className="clutchTextContainer">
							{
								<div className="clutchText">
									{
										showAllMode
										?	80
										:	this.clutchPedal > 0.9
											?	this.playerIsFocus
												?	Math.floor(this.clutchPedal * 100)
												:	Math.ceil(this.clutchPedal * 100)
											:	Math.ceil(this.clutchPedal * 100)
									}
								</div>
							}
						</div>
					)
				}
				{
					this.props.settings.subSettings.showInputNumbers.enabled && (
						<div className="brakeTextContainer">
							{
								<div className="brakeText">
									{
										showAllMode
										?	90
										:	this.brakePedal > 0.9
											?	this.playerIsFocus
												?	Math.floor(this.brakePedal * 100)
												:	Math.ceil(this.brakePedal * 100)
											:	Math.ceil(this.brakePedal * 100)
									}
								</div>
							}
						</div>
					)
				}
				{
					this.props.settings.subSettings.showInputNumbers.enabled && (
						<div className="throttleTextContainer">
							{
								<div className="throttleText">
									{
										showAllMode
										?	100
										:	this.throttlePedal > 0.9
											?	this.playerIsFocus
												?	Math.floor(this.throttlePedal * 100)
												:	Math.ceil(this.throttlePedal * 100)
											:	Math.ceil(this.throttlePedal * 100)
									}
								</div>
							}
						</div>
					)
				}
				<div className="barContainer">
					{(!!this.clutchPedal || showAllMode) && (
						<div
							className="bar clutchPedal"
							style={{
								height: `${showAllMode
									?	80
									:	this.clutchPedal * 100
								}%`
							}}
						/>
					)}
				</div>

				{/* Brake */}
				<div className="barContainer">
					{(!!this.brakePedal || showAllMode) && (
						<div
							className="bar brakePedal"
							style={{
								height: `${showAllMode
									?	90
									:	this.brakePedal * 100
								}%`
							}}
						/>
					)}
				</div>

				{/* Throttle */}
				<div className="barContainer">
					{(!!this.throttlePedal || showAllMode) && (
						<div
							className="bar throttlePedal"
							style={{
								height: `${showAllMode
									?	100
									:	this.throttlePedal * 100
								}%`
							}}
						/>
					)}
				</div>
				{
					this.props.settings.subSettings.steeringInput.enabled &&
					(this.playerIsFocus || showAllMode) &&
					(
						<SvgIcon
							className="steeringWheel"
							src={require('./../../img/icons/wheel.svg')}
							style={{
								transform: `rotate(${showAllMode
									?	30
									:	this.wheelTurn
								}deg)`
							}}
						/>
					)
				}
			</div>
		);
	}
}
