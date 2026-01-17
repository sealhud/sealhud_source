import {
	classNames,
	ePlayerDriverDataIndex,
	ePlayerIsFocus,
	eCurrentSlotId,
	INVALID,
	mpsToKph,
	mpsToMph,
	rpsToRpm,
	// showDebugMessageSmall,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { EEngineType } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './motec.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Motec extends React.Component<IProps, {}> {
	@observable accessor speed = INVALID;
	@observable accessor rpm = 0;
	@observable accessor maxRpm = 0;
	@observable accessor upshiftRps = 0;
	@observable accessor gear = 0;
	@observable accessor limiter = false;
	gearNameLookup : any = {};
	@observable accessor lastCheck = 0;
	@observable accessor lastBlinkTime = -1;
	@observable accessor gearColor = 'white';
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor driverDataIndex = -1;
	@observable accessor engineState = -1;
	@observable accessor playerDriverDataIndex = -1;
	@observable accessor playerIsFocus = false;
	@observable accessor currentSlotId = -1;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

		const isElectric =
			r3e.data.VehicleInfo.EngineType === EEngineType.Electric;

		this.gearNameLookup = isElectric
			? {
					'-1': 'R',
					0: 'N',
					1: 'D',
					2: 'S'
			  }
			: {
					'-1': 'R',
					0: 'N'
			  };
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {		
		this.playerDriverDataIndex = ePlayerDriverDataIndex;
		this.playerIsFocus = ePlayerIsFocus;
		this.currentSlotId = eCurrentSlotId;
		if (r3e.data && this.currentSlotId !== -1 && !this.playerIsFocus) {
			this.driverDataIndex = -1;
			for (let i = 0; i < r3e.data.DriverData.length; i++) {
				if (r3e.data.DriverData[i].DriverInfo.SlotId === this.currentSlotId) {
					this.driverDataIndex = i;
					break;
				}
			}
		}
		if (this.playerIsFocus) { this.driverDataIndex = this.playerDriverDataIndex; }
		if (this.driverDataIndex !== -1) {
			this.engineState =
				r3e.data !== undefined &&
				r3e.data.DriverData !== undefined &&
				r3e.data.DriverData[this.driverDataIndex] !== undefined
				?	r3e.data.DriverData[this.driverDataIndex].EngineState
				:	2;
		}
		this.lastCheck = nowCheck;
		this.speed = r3e.data.CarSpeed;
		this.rpm = rpsToRpm(r3e.data.EngineRps);
		this.maxRpm = rpsToRpm(r3e.data.MaxEngineRps);
		this.upshiftRps = rpsToRpm(r3e.data.UpshiftRps);
		this.gear = r3e.data.Gear;
		this.limiter = r3e.data.PitLimiter > 0 && this.engineState > 0
			?	true
			:	false;
		this.sessionType = r3e.data.SessionType;
		this.sessionPhase = r3e.data.SessionPhase;
	};

	render() {
		if (this.sessionType === 2 && this.sessionPhase === 1) {
			return null;
		}
		const showSpeed = this.speed !== INVALID;
		/*
		const isIgnition = this.engineState === 0 && !showAllMode;
		const isStart = this.engineState === 1 && !showAllMode;
		const isRunning = this.engineState >= 2 || showAllMode;
		*/

		const speedValue = showAllMode
			? 65
			: this.props.settings.subSettings.showMPH.enabled
			? mpsToMph(this.speed).toFixed(0)
			: mpsToKph(this.speed).toFixed(0);

		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(
					"motecContainer",
					this.props.className,
					{
					visible: showSpeed,
					plBBlink:
						this.props.settings.subSettings.plBBlink.enabled &&
						(showAllMode || this.limiter),
					}
				)}
			>
				{/* TOP ROW */}
				<div className="motecTopRow">

					{/* GEAR */}
					<div
					className={classNames("motecBox gearBox", {
						upshift: this.rpm > this.upshiftRps * 0.94 && this.rpm <= this.maxRpm * 0.96,
						redline: this.rpm > this.maxRpm * 0.96,
						disabled: this.engineState === 0 && !showAllMode
					})}
					>
					{showAllMode
						? 2
						: this.engineState >= 1
						? this.gearNameLookup[this.gear] || this.gear
						: ""}
					</div>

					{/* SPEED */}
					<div className="motecBox speedBox">
						<span className="speedValue">{speedValue}</span>
						<span className="speedUnit">
							{this.props.settings.subSettings.showMPH.enabled ? "MpH" : "KpH"}
						</span>
					</div>

				</div>
			</div>
		);
	}
}
