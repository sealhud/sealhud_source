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
	showAllMode,
	speedInKPH
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
	@observable accessor speedKPH = speedInKPH || false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

		const isElectric = r3e.data.VehicleInfo.EngineType === EEngineType.Electric;
		const isTruck = r3e.data.VehicleInfo.ClassPerformanceIndex === 217;

		if (isTruck) {
			this.gearNameLookup = {
				'-1': 'R',
				0: 'N',
				1: '1',
				3: '2',
				5: '3',
				7: '4',
				2: '1',
				4: '2',
				6: '3',
				8: '4',
				9: '5',
				11: '6',
				13: '7',
				15: '8',
				10: '5',
				12: '6',
				14: '7',
				16: '8',
			};
		} else if (isElectric) {
			this.gearNameLookup = {
				'-1': 'R',
				0: 'N',
				1: 'D',
				2: 'S',
			};
		} else {
			this.gearNameLookup = {
				'-1': 'R',
				0: 'N',
			};
		}
	}

	private getTruckSplit(gearIndex: number): 'L' | 'H' | null {
		if (gearIndex <= 0) return null;
		return gearIndex % 2 === 0 ? 'H' : 'L';
	}

	private getTruckRange(gearIndex: number): 'LO' | 'HI' | null {
		if (gearIndex <= 0) return null;
		return gearIndex > 8 ? 'HI' : 'LO';
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
		this.speedKPH = speedInKPH;
	};

	render() {
		if (this.sessionType === 2 && this.sessionPhase === 1) {
			return null;
		}

		const isTruck = r3e.data.VehicleInfo.ClassPerformanceIndex === 217;
		const gearLabel = this.gearNameLookup[this.gear] || this.gear;
		const split = isTruck
			? this.getTruckSplit(this.gear)
			: null;

		const range = isTruck
			? this.getTruckRange(this.gear)
			: null;

		const showSpeed = this.speed !== INVALID;
		/*
		const isIgnition = this.engineState === 0 && !showAllMode;
		const isStart = this.engineState === 1 && !showAllMode;
		const isRunning = this.engineState >= 2 || showAllMode;
		*/

		const speedValue = showAllMode
			? 65
			: !this.speedKPH
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
						{this.engineState >= 1 && (
							isTruck ? (
								<div className="truckGearWrapper">
									<span>{gearLabel}</span>

									<span className={classNames("truckGearSplit","low",{ active: split === 'L' })}>
										L
									</span>
									<span className={classNames("truckGearSplit","high",{ active: split === 'H' })}>
										H
									</span>

									<span className={classNames("truckGearRange","low",{ active: range === 'LO' })}>
										LO
									</span>
									<span className={classNames("truckGearRange","high",{ active: range === 'HI' })}>
										HI
									</span>
								</div>
							) : (gearLabel)
						)}
					</div>


					{/* SPEED */}
					<div className="motecBox speedBox">
						<span className="speedValue">{speedValue}</span>
						<span className="speedUnit">
							{!this.speedKPH ? "MpH" : "KpH"}
						</span>
					</div>

				</div>
				{/* RPM BAR*/}
				{((this.engineState > 0) || showAllMode) && (
					<div className="rpm">
						<div
						className={classNames("rpmBar", {
							upshift: this.rpm > this.upshiftRps * 0.94 && this.rpm <= this.maxRpm * 0.96,
							redline: this.rpm > this.maxRpm * 0.96,
							disabled: this.engineState === 0 && !showAllMode,
						})}
						style={{
							width: `${showAllMode ? 50 : (this.rpm / this.maxRpm) * 100}%`,
						}}
						/>
					</div>
				)}
			</div>
		);
	}
}
