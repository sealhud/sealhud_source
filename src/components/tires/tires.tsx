import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	lerpColor,
	// showDebugMessageSmall,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	tempInCelsius,
	pressureInPSI,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { ITireData, ITireTemp, IBrakeTemp } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './tires.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Tires extends React.Component<IProps, {}> {
	@observable accessor tempCelsius = tempInCelsius || false;
	@observable accessor pressurePSI = pressureInPSI || false;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor passed = false;
	@observable accessor tireWear: ITireData<number> = {
		FrontLeft: -1,
		FrontRight: -1,
		RearLeft: -1,
		RearRight: -1
	};
	@observable accessor tireFlatSpot: ITireData<number> = {
		FrontLeft: -1,
		FrontRight: -1,
		RearLeft: -1,
		RearRight: -1
	};
	@observable accessor tirePuncture: any = {
		FrontLeft: false,
		FrontRight: false,
		RearLeft: false,
		RearRight: false
	};
	@observable accessor lapStartTireWear: ITireData<number> = {
		FrontLeft: -1,
		FrontRight: -1,
		RearLeft: -1,
		RearRight: -1
	};
	@observable accessor wearPerLap: ITireData<number> = {
		FrontLeft: -1,
		FrontRight: -1,
		RearLeft: -1,
		RearRight: -1
	};
	@observable accessor lastLapsWearFL: number[] = [];
	@observable accessor lastLapsWearFR: number[] = [];
	@observable accessor lastLapsWearRL: number[] = [];
	@observable accessor lastLapsWearRR: number[] = [];

	@observable accessor lastLapsWearFLAverage = -1;
	@observable accessor lastLapsWearFRAverage = -1;
	@observable accessor lastLapsWearRLAverage = -1;
	@observable accessor lastLapsWearRRAverage = -1;

	@observable accessor lastLapWearFL = 'N/A';
	@observable accessor lastLapWearFR = 'N/A';
	@observable accessor lastLapWearRL = 'N/A';
	@observable accessor lastLapWearRR = 'N/A';
	@observable accessor lapDistance = -1;
	@observable accessor lapTimeCurrentSelf = -1;
	@observable accessor gameInMenus = -1;
	@observable accessor inPitlane = -1;
	@observable accessor layoutLength = -1;
	@observable accessor lapTimeBestSelf = -1;
	@observable accessor completedLaps = -1;
	@observable accessor lowestWearLaps	= -1;
	@observable accessor tireWearActive = 0;
	@observable accessor tireDirt: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};
	@observable accessor tireTemp: ITireData<ITireTemp> = {
		FrontLeft: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		FrontRight: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearLeft: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearRight: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		}
	};
	@observable accessor brakeTemp: ITireData<IBrakeTemp> = {
		FrontLeft: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		FrontRight: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearLeft: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearRight: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		}
	};

	@observable accessor tirePressure: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};

	@observable accessor lastCheck = 0;
	@observable accessor lastShortCheck = 0;
	@observable accessor currentSession = -1;
	@observable accessor actualFirstLap = false;
	@observable accessor wasInPit = true;
	@observable accessor updateTireWearRunning = false;
	@observable accessor savedSession = localStorage.savedSessionTires
		?	localStorage.savedSessionTires === '0'
			?	0
			:	localStorage.savedSessionTires === '1'
				?	1
				:	localStorage.savedSessionTires === '2'
					?	2
					:	0
		:	-1;
	@observable accessor blinkInterval: any = INVALID;
	@observable accessor showPunctureImg = false;
	@observable accessor playerIsFocus = false;
	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
		clearInterval(this.blinkInterval);
	}

	@action
	private toggleInterval = () => {
		this.showPunctureImg = !this.showPunctureImg;
	}

	@action
	private update = () => {
		if (this.blinkInterval === INVALID) {
			this.blinkInterval = setInterval(this.toggleInterval, 500);
		}
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
			this.brakeTemp = r3e.data.BrakeTemp;
			this.tireDirt = r3e.data.TireDirt;
			this.tireTemp = r3e.data.TireTemp;
			this.tirePressure = r3e.data.TirePressure;
			this.tirePuncture = {
				FrontLeft: this.tirePressure.FrontLeft < 100,
				FrontRight: this.tirePressure.FrontRight < 100,
				RearLeft: this.tirePressure.RearLeft < 100,
				RearRight: this.tirePressure.RearRight < 100
			};
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.lapDistance = r3e.data.LapDistance;
			this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
			this.gameInMenus = r3e.data.GameInMenus;
			this.inPitlane = r3e.data.InPitlane;
			this.layoutLength = r3e.data.LayoutLength;
			this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
			this.completedLaps = r3e.data.CompletedLaps;
			this.tempCelsius = tempInCelsius;
			this.pressurePSI = pressureInPSI;
		}
		if (
			(
				highPerformanceMode &&
				nowCheck - this.lastShortCheck >= 16
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastShortCheck >= 66
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastShortCheck >= 33
			)
		) {
			this.lastShortCheck = nowCheck;
			this.playerIsFocus = ePlayerIsFocus;
			this.tireWearActive = r3e.data.TireWearActive;
			this.tireFlatSpot = r3e.data.TireFlatspot;
			if (this.tireWearActive) {
				this.tireWear = r3e.data.TireWear;
				if (!this.updateTireWearRunning) {
					this.updateTireWearRunning = true;
					this.updateTireWear();
				}
				if (this.lastLapsWearFL.length > 0) {
					this.lowestWearLaps = Math.min(
						Math.floor(
							(
								this.tireWear.FrontLeft *
								100
							) /
							this.wearPerLap.FrontLeft
						),
						Math.floor(
							(
								this.tireWear.FrontRight *
								100
							) /
							this.wearPerLap.FrontRight
						),
						Math.floor(
							(
								this.tireWear.RearLeft *
								100
							) /
							this.wearPerLap.RearLeft
						),
						Math.floor(
							(
								this.tireWear.RearRight *
								100
							) /
							this.wearPerLap.RearRight
						)
					);
				} else {
					this.lowestWearLaps = -1;
				}
			}
			if (localStorage.savedSessionTires) {
				this.savedSession = parseInt(localStorage.savedSessionTires, 10);
			} else {
				localStorage.savedSessionTires = '-1';
				this.savedSession = -1;
			}
			this.currentSession =
				this.sessionType >= 0 &&
				this.sessionType < 3 &&
				this.sessionPhase === 5
				?	this.sessionType
				:	-1;
			if (
				this.currentSession !== -1 &&
				this.savedSession !== this.currentSession
			) {
				this.savedSession = this.currentSession;
				localStorage.savedSessionTires = this.savedSession.toString();
				this.clearTireWearData();
			}
			this.actualFirstLap = (
				this.sessionType === 2 &&
				this.completedLaps === 0
			) || (
				this.sessionType !== 2 &&
				this.lapTimeBestSelf < 0
			);
			/*showDebugMessageSmall(
				`FL: start(${
					this.lapStartTireWear.FrontLeft
				}) lap(${
					this.lastLapWearFL
				}) av(${
					this.wearPerLap.FrontLeft
				}) count(${
					this.lastLapsWearFL.length
				})
				FR: start(${
					this.lapStartTireWear.FrontRight
				}) lap(${
					this.lastLapWearFR
				}) av(${
					this.wearPerLap.FrontRight
				}) count(${
					this.lastLapsWearFR.length
				})
				RL: start(${
					this.lapStartTireWear.RearLeft
				}) lap(${
					this.lastLapWearRL
				}) av(${
					this.wearPerLap.RearLeft
				}) count(${
					this.lastLapsWearRL.length
				})
				RR: start(${
					this.lapStartTireWear.RearRight
				}) lap(${
					this.lastLapWearRR
				}) av(${
					this.wearPerLap.RearRight
				}) count(${
					this.lastLapsWearRR.length
				})`, 1000
			);*/
			/*showDebugMessageSmall(
				`${this.tireFlatSpot.FrontLeft}
				${this.tireFlatSpot.FrontRight}
				${this.tireFlatSpot.RearLeft}
				${this.tireFlatSpot.RearRight}
				${Math.abs((r3e.data.TireRps.FrontLeft * 9.5493) / 60)}
				${(1 / Math.abs(r3e.data.TireRps.FrontLeft)}`
			);*/
		}
	};

	@action
	private clearTireWearData = () => {
		this.lastLapsWearFL = [];
		this.lastLapsWearFR = [];
		this.lastLapsWearRL = [];
		this.lastLapsWearRR = [];
	}

	private updateTireWear() {
		if (this.playerIsFocus) {
			let sumFL = 0;
			let sumFR = 0;
			let sumRL = 0;
			let sumRR = 0;
			const lLWLength = this.lastLapsWearFL.length;
			if (lLWLength > 0) {
				let i = lLWLength;
				for (i; i--;) {
					sumFL += this.lastLapsWearFL[i];
					sumFR += this.lastLapsWearFR[i];
					sumRL += this.lastLapsWearRL[i];
					sumRR += this.lastLapsWearRR[i];
				}
			}

			this.lastLapsWearFLAverage = parseFloat(
				(
					sumFL / (
						this.lastLapsWearFL.length
					)
				).toFixed(1)
			);
			this.lastLapsWearFRAverage = parseFloat(
				(
					sumFR / (
						this.lastLapsWearFR.length
					)
				).toFixed(1)
			);
			this.lastLapsWearRLAverage = parseFloat(
				(
					sumRL / (
						this.lastLapsWearRL.length
					)
				).toFixed(1)
			);
			this.lastLapsWearRRAverage = parseFloat(
				(
				sumRR / (
						this.lastLapsWearRR.length
					)
				).toFixed(1)
			);

			this.wearPerLap.FrontLeft =
				this.lastLapsWearFLAverage > 0
				?	this.lastLapsWearFLAverage
				:	-1;
			this.wearPerLap.FrontRight =
				this.lastLapsWearFRAverage > 0
				?	this.lastLapsWearFRAverage
				:	-1;
			this.wearPerLap.RearLeft =
				this.lastLapsWearRLAverage > 0
				?	this.lastLapsWearRLAverage
				:	-1;
			this.wearPerLap.RearRight =
				this.lastLapsWearRRAverage > 0
				?	this.lastLapsWearRRAverage
				:	-1;

			if (this.inPitlane > 0 || this.wasInPit) {
				this.wasInPit = true;
			}

			if (
				this.wasInPit &&
				this.lapDistance > (
					this.layoutLength / 2
				) &&
				this.inPitlane < 1
			) {
				this.wasInPit = false;
			}

			if (
				this.lapDistance >= 0 &&
				this.lapDistance < 200 &&
				this.lapStartTireWear.FrontLeft === -1 &&
				!this.wasInPit &&
				this.lapTimeCurrentSelf >= 0
			) {
				this.lapStartTireWear = this.tireWear;
				this.passed = false;
			}

			if (
				this.inPitlane > 0 ||
				this.gameInMenus > 0 ||
				!this.tireWearActive ||
				this.sessionPhase < 3 ||
				this.lapTimeCurrentSelf < 0
			) {
				this.lapStartTireWear.FrontLeft = -1;
				this.lapStartTireWear.FrontRight = -1;
				this.lapStartTireWear.RearLeft = -1;
				this.lapStartTireWear.RearRight = -1;
				this.passed = false;
			}

			if (
				this.lapStartTireWear.FrontLeft !== -1 &&
				this.lapDistance > 200 &&
				this.lapDistance < 300
			) {
				this.passed = true;
			}
			if (
				this.lapStartTireWear.FrontLeft !== -1 &&
				this.lapDistance >= 0 &&
				this.lapDistance < 200 &&
				(
					(
						this.lapStartTireWear.FrontLeft -
						this.tireWear.FrontLeft
					) * 100
				) > 0.1 &&
				this.passed
			) {
				this.passed = false;
				const wearFL = (
					this.lapStartTireWear.FrontLeft - this.tireWear.FrontLeft
				) * 100;
				const wearFR = (
					this.lapStartTireWear.FrontRight - this.tireWear.FrontRight
				) * 100;
				const wearRL = (
					this.lapStartTireWear.RearLeft - this.tireWear.RearLeft
				) * 100;
				const wearRR = (
					this.lapStartTireWear.RearRight - this.tireWear.RearRight
				) * 100;
				this.lastLapWearFL = wearFL.toFixed(1);
				this.lastLapWearFR = wearFR.toFixed(1);
				this.lastLapWearRL = wearRL.toFixed(1);
				this.lastLapWearRR = wearRR.toFixed(1);
				this.lapStartTireWear = this.tireWear;
				if (!this.actualFirstLap) {
					this.lastLapsWearFL.push(wearFL);
					this.lastLapsWearFR.push(wearFR);
					this.lastLapsWearRL.push(wearRL);
					this.lastLapsWearRR.push(wearRR);
				}
			}
		} else {
			this.lapStartTireWear.FrontLeft = -1;
			this.lapStartTireWear.FrontRight = -1;
			this.lapStartTireWear.RearLeft = -1;
			this.lapStartTireWear.RearRight = -1;
		}
		this.updateTireWearRunning = false;
	}

	private getBrakeColor(temp: IBrakeTemp) {
		const currentTemp = temp.CurrentTemp;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		// Magic numbers decided based on some random sample cars

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}

	private getTireTempColor(temp: ITireTemp, side: number) {
		const cTempLeft = temp.CurrentTemp.Left;
		const cTempCenter = temp.CurrentTemp.Center;
		const cTempRight = temp.CurrentTemp.Right;
		const currentTemp = (side === 1)
			? cTempLeft
			: (side === 2)
				? cTempCenter
				: cTempRight;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if ((!this.playerIsFocus || r3e.data.GameInReplay > 0) && !showAllMode) {
			return null;
		}
		if (this.props.settings.subSettings.showDetails.enabled) {
			return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('tires', this.props.className)}
			>
				{['FrontLeft', 'FrontRight', 'RearLeft', 'RearRight'].map(
					(property) => {
						const wheelClass = property.replace(/^./, (str) => {
							return str.toLowerCase();
						});
						return (
							<div
								key={property}
								className={classNames('wheel', wheelClass)}
							>
								{this.props.settings.subSettings.showDetails.enabled && (
									<div className="templeft">
										{this.props.settings.subSettings.showTempNumbers.enabled
											? this.tempCelsius
												? this.tireTemp[
													property
													].CurrentTemp.Left.toFixed(0).toString() + '°'
												: ((this.tireTemp[property].CurrentTemp.Left
													* (9 / 5)) + 32).toFixed(0).toString() + '°'
											: ' '
										}
									</div>
								)}
								<div className="tempcenter">
									{this.props.settings.subSettings.showTempNumbers.enabled
										? this.tempCelsius
											? this.tireTemp[
												property
												].CurrentTemp.Center.toFixed(0).toString() + '°'
											: ((this.tireTemp[property].CurrentTemp.Center
												* (9 / 5)) + 32).toFixed(0).toString() + '°'
										: ' '
									}
								</div>
								{this.props.settings.subSettings.showDetails.enabled && (
									<div className="tempright">
										{this.props.settings.subSettings.showTempNumbers.enabled
											? this.tempCelsius
												? this.tireTemp[
													property
													].CurrentTemp.Right.toFixed(0).toString() + '°'
												: ((this.tireTemp[property].CurrentTemp.Right
													* (9 / 5)) + 32).toFixed(0).toString() + '°'
											: ' '
										}
									</div>
								)}
								<div
									className={classNames('brake', wheelClass)}
									style={{
										background: this.getBrakeColor(
											this.brakeTemp[property]
										)
									}}
								/>
								<div className="tireWearContainer">
									{this.props.settings.subSettings.showDetails.enabled && (
										<div
											className={classNames(
												'tireWearLeft',
												wheelClass
											)}
											style={{
												height: `${
													this.tireWearActive
													?	this.tirePuncture[property]
														?	0
														:	this.tireWear[property] * 100
													:	100
												}%`,
												background: this.getTireTempColor(
													this.tireTemp[property], 1
												)
											}}
										/>
									)}
									<div
										className={classNames(
											'tireWearCenter',
											wheelClass
										)}
										style={{
											height: `${
												this.tireWearActive
												?	this.tirePuncture[property]
													?	0
													:	this.tireWear[property] * 100
												:	100
											}%`,
											background: this.getTireTempColor(
												this.tireTemp[property], 2
											)
										}}
									/>
									{this.props.settings.subSettings.showDetails.enabled && (
										<div
											className={classNames(
												'tireWearRight',
												wheelClass
											)}
											style={{
												height: `${
													this.tireWearActive
													?	this.tirePuncture[property]
														?	0
														:	this.tireWear[property] * 100
													:	100
												}%`,
												background: this.getTireTempColor(
													this.tireTemp[property], 3
												)
											}}
										/>
									)}
									{this.props.settings.subSettings.showDetails.enabled &&
										this.props.settings.subSettings.showWearNumbers.enabled &&
										this.tireWearActive &&
										this.tirePressure[property] > 100 && (
										<div
											className="tireWearNumber"
											style={{
												fontSize:
													this.lastLapsWearFL.length > 0 &&
													this.props.settings.subSettings.showWearPerLap.enabled
													?	'10px'
													:	'12px'
											}}
										>
											{
												this.lastLapsWearFL.length > 0 &&
												this.props.settings.subSettings.showWearPerLap.enabled
												?	`${
														(
															this.tireWear[property] *
															100
														).toFixed(0)
													}% (${this.wearPerLap[property].toFixed(1)
													}${_('pL')})`
												:	`${
														(
															this.tireWear[property] *
															100
														).toFixed(0)
													}%`
											}
										</div>
									)}
									{this.props.settings.subSettings.showDetails.enabled &&
										this.props.settings.subSettings.showPressureNumbers.enabled &&
										this.tirePressure[property] > 100 &&  (
										<div className="tirePressureNumber">
											{this.pressurePSI
												? (this.tirePressure[property] * 0.145038).toFixed(1)
												: this.tirePressure[property].toFixed(1)
											}
											{this.pressurePSI
												? 'PSI'
												: 'kPa'
											}
										</div>
									)}
									{this.tirePuncture[property] &&
										this.showPunctureImg && (
										<div className="tirePuncture">
											<img
												src={require('./../../img/Puncture.png')}
												width="36"
												height="38"
											/>
										</div>
									)}
								</div>
								<div
									className="tireDirtOverlay"
									style={{
										opacity: this.tireDirt[property]
									}}
								/>
							</div>
						);
					}
				)}
				{
					this.props.settings.subSettings.showWearNumbers.enabled &&
					this.props.settings.subSettings.showWearLaps.enabled &&
					this.lowestWearLaps !== -1 &&
					this.tireWearActive && (
						<div className="wearLaps">
							{_('Estimated Laps:')}{` ${this.lowestWearLaps}L`}
						</div>
					)
				}
			</div>
			);
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('tiresa', this.props.className)}
			>
				{['FrontLeft', 'FrontRight', 'RearLeft', 'RearRight'].map(
					(property) => {
						const wheelClass = property.replace(/^./, (str) => {
							return str.toLowerCase();
						});
						return (
							<div
								key={property}
								className={classNames('wheel', wheelClass)}
							>
								<div className="temp mono">
									{this.props.settings.subSettings.showTempNumbers.enabled
										? this.tempCelsius
											? this.tireTemp[
												property
												].CurrentTemp.Center.toFixed(0).toString() + '°'
											: ((this.tireTemp[property].CurrentTemp.Center
												* (9 / 5)) + 32).toFixed(0).toString() + '°'
										: ' '
									}
								</div>
								<div
									className={classNames('brake', wheelClass)}
									style={{
										background: this.getBrakeColor(
											this.brakeTemp[property]
										)
									}}
								/>
								<div className="tireWearContainer">
									<div
										className={classNames(
											'tireWear',
											wheelClass
										)}
										style={{
											height: `${
												this.tireWearActive
												?	this.tirePressure[property] < 100
													?	100
													:	this.tireWear[property] * 100
												:	100
											}%`,
											background: this.tirePressure[property] < 100
												?	this.showPunctureImg
													?	'red'
													:	'black'
												:	this.getTireTempColor(
														this.tireTemp[property], 2
													)
										}}
									/>
								</div>
								<div
									className="tireDirtOverlay"
									style={{
										opacity: this.tireDirt[property]
									}}
								/>
							</div>
						);
					}
				)}
				{
					this.props.settings.subSettings.showWearNumbers.enabled &&
					this.props.settings.subSettings.showWearLaps.enabled &&
					this.lowestWearLaps !== -1 &&
					this.tireWearActive && (
						<div className="wearLaps">
							{`${this.lowestWearLaps}${_('L')}`}
						</div>
					)
				}
			</div>
		);
	}
}
