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
		if (this.sessionType === 2 && this.sessionPhase === 1) return null;
		if (r3e.data.GameInReplay > 0 && !this.playerIsFocus && !showAllMode) return null;

		return (
			<div
			{...widgetSettings(this.props)}
			className={classNames("inputsNew", this.props.className, {
				hasWheel: this.props.settings.subSettings.steeringInput.enabled &&
						(this.playerIsFocus || showAllMode),
				showNumbers: this.props.settings.subSettings.showInputNumbers.enabled
			})}
			>

			{/* LEFT COLUMN — WHEEL */}
			{this.props.settings.subSettings.steeringInput.enabled &&
				(this.playerIsFocus || showAllMode) && (
				<div className="inputsWheel">
					<SvgIcon
					className="steeringWheel"
					src={require("./../../img/icons/wheel.svg")}
					style={{
						transform: `rotate(${showAllMode ? 30 : this.wheelTurn}deg)`
					}}
					/>
				</div>
			)}

			{/* RIGHT COLUMN — INPUTS */}
			<div className="inputsBars">

				{/* CLUTCH */}
				<div className="inputRow clutch">
				<div className="inputValue">
					{showAllMode ? 80 : Math.ceil(this.clutchPedal * 100)}
				</div>
				<div className="inputMeter">
					<div
					className="inputFill"
					style={{ width: `${showAllMode ? 80 : this.clutchPedal * 100}%` }}
					/>
				</div>
				</div>

				{/* BRAKE */}
				<div className="inputRow brake">
				<div className="inputValue">
					{showAllMode ? 90 : Math.ceil(this.brakePedal * 100)}
				</div>
				<div className="inputMeter">
					<div
					className="inputFill"
					style={{ width: `${showAllMode ? 90 : this.brakePedal * 100}%` }}
					/>
				</div>
				</div>

				{/* THROTTLE */}
				<div className="inputRow throttle">
				<div className="inputValue">
					{showAllMode ? 100 : Math.ceil(this.throttlePedal * 100)}
				</div>
				<div className="inputMeter">
					<div
					className="inputFill"
					style={{ width: `${showAllMode ? 100 : this.throttlePedal * 100}%` }}
					/>
				</div>
				</div>

			</div>
			</div>
		);
	}

}
