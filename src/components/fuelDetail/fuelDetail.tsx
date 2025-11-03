import {
	classNames,
	ePlayerSlotId,
	ePlayerIsFocus,
	widgetSettings,
	lerpColor,
	formatTime,
	mpsToMph,
	mpsToKph,
	showDebugMessage,
	showDebugMessageSmall,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	showAllMode,
	blockFuelCalc,
	lowPerformanceMode,
	highPerformanceMode,
	speedInMPH
} from '../app/app';
import { action, observable } from 'mobx';
import { merge } from 'lodash-es';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './fuelDetail.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IFuelData {
	[index: string]: number[][];
}

let personalBestTime = -1;
let eRoundsLeft = -1;
export { personalBestTime, eRoundsLeft };

@observer
export default class FuelDetail extends React.Component<IProps, {}> {
	@observable accessor debug = false;

	@observable accessor fuelPerLap = -1;

	@observable accessor passed = false;

	@observable accessor fuelLeft = 0;

	@observable accessor fuelCapacity = 0;

	@observable accessor fuelUseActive = 0;

	@observable accessor lastCheck = 0;

	@observable accessor lapStartFuel = -1;

	@observable accessor fuelLastLap = 'N/A';

	@observable accessor fuelToEnd = 'N/A';

	@observable accessor fuelToAdd = 'N/A';

	@observable accessor fuelInitialAverage = true;

	@observable accessor wasInPit = true;

	@observable accessor skipThisLapForStats = true;

	@observable accessor actualFirstLap = false;

	@observable accessor lastLapsFuel: number[] = [];

	@observable accessor lastLapsFuelAverage = -1;

	@observable accessor fuelAndTimeTracking: IFuelData = {};

	@observable accessor ftArray = {};

	@observable accessor reparseData = true;

	@observable accessor trackingString = '';

	@observable accessor storedBestLap = -1;

	@observable accessor storedAverageLap = -1;

	@observable accessor lastLapTimePreviousSelf = -1;

	@observable accessor theFuel = -1;

	@observable accessor saveTimeout: any = INVALID;

	@observable accessor displayMessage = '';

	@observable accessor displayMessageTimer: any = INVALID;

	@observable accessor displayMessageSwitch = false;

	@observable accessor setTimeFuel = 0;

	@observable accessor setRoundFuel = 0;

	@observable accessor fuelCalcEnabled = false;

	@observable accessor blockCalc = false;

	@observable accessor fuelCalcBlock = blockFuelCalc;

	@observable accessor mphSpeed = speedInMPH || false;

	@observable accessor getNewTime = true;

	@observable accessor showDeleteAll = false;

	@observable accessor showDeleteCombo = false;

	@observable accessor showDeleteBL = false;

	@observable accessor showConfirmButtons = false;

	@observable accessor fuelTimeLeft = 0;

	@observable accessor lastTime = 0;

	@observable accessor newBestLap = false;

	@observable accessor trackId = -1;

	@observable accessor layoutId = -1;

	@observable accessor modelId = -1;

	@observable accessor exportPB = personalBestTime || -1;

	@observable accessor currentSession = -1;

	@observable accessor savedSession = -1;

	@observable accessor isAI = false;

	@observable accessor blinkInterval: any = INVALID;
	@observable accessor opacityLevel = 1.0;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor layoutLength = -1;

	@observable accessor sessionTimeDuration = -1;

	@observable accessor sessionTimeRemaining = -1;

	@observable accessor playerSlotId = -1;

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
		this.opacityLevel = this.opacityLevel === 1.0
		?	0.6
		:	1.0;
	}
	@action
	private update = () => {
		if (this.blinkInterval === INVALID) {
			this.blinkInterval = setInterval(this.toggleInterval, 500);
		}
		if (
			(
				highPerformanceMode &&
				nowCheck - this.lastCheck >= 15
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 32
			)
		) {
			this.lastCheck = nowCheck;
			this.playerSlotId = ePlayerSlotId;
			this.playerIsFocus = ePlayerIsFocus;
			if (this.storedBestLap > 0 && (nowCheck - this.lastTime) >= 1000) {
				this.lastTime = nowCheck;
				this.fuelTimeLeft = this.getTimeFuelLeftNumber();
			}
			this.fuelUseActive = r3e.data.FuelUseActive;
			this.fuelLeft = r3e.data.FuelLeft;
			this.fuelCapacity = r3e.data.FuelCapacity;
			this.isAI = r3e.data.ControlType === 1;
			if (this.fuelUseActive || showAllMode) {
				this.runFuelCheck();
			}

			this.fuelCalcBlock = blockFuelCalc;
			this.exportPB = this.storedBestLap;
			personalBestTime = this.exportPB;
			this.mphSpeed = speedInMPH;
			this.trackId = r3e.data.TrackId;
			this.layoutId = r3e.data.LayoutId;
			this.modelId = r3e.data.VehicleInfo.ModelId;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.layoutLength = r3e.data.LayoutLength;
			this.sessionTimeDuration = r3e.data.SessionTimeDuration;
			this.sessionTimeRemaining = r3e.data.SessionTimeRemaining;

			if (this.trackId !== -1 && this.layoutId !== -1 && this.modelId !== -1) {
				this.trackingString = `${this.trackId}_${this.layoutId}_${this.modelId}`;
			}
			this.actualFirstLap = (
				this.sessionType === 2 &&
				r3e.data.CompletedLaps === 0
			) || (
				this.sessionType !== 2 &&
				r3e.data.LapTimeBestSelf < 0 &&
				r3e.data.CompletedLaps === 0
			);

			if (
				this.currentSession !== -1 &&
				this.currentSession !== this.savedSession
			) {
				if (
					(
						this.currentSession === 2 &&
						this.props.settings.subSettings.clearRaceSession.enabled
					) ||
					this.props.settings.subSettings.clearAnySession.enabled
				) {
					this.clearCombinationDataNoMessage();
				}
				this.savedSession = this.currentSession;
				localStorage.savedSessionFuel = this.savedSession.toString();
				this.lastLapsFuel = [];
			}
			if (localStorage.savedSessionFuel) {
				this.savedSession = parseInt(localStorage.savedSessionFuel, 10);
			} else {
				localStorage.savedSessionFuel = '-1';
				this.savedSession = -1;
			}
			this.currentSession =
				this.sessionType >= 0 &&
				this.sessionType < 3 &&
				this.sessionPhase === 5
				?	this.sessionType
				:	-1;
			if (this.props.settings.subSettings.clearComboData.enabled) {
				this.clearData(false);
			}
			if (this.props.settings.subSettings.clearAllData.enabled) {
				this.clearData(true);
			}
		}
	}

	@action
	private onDummy = () => {
		let moo = 0;
		moo = moo;
		if (moo === 1) {
			moo = 2;
		}
	}

	@action
	private onMouseDown = (e: React.MouseEvent) => {
		if (e.button === 2) {
			if (this.fuelCalcEnabled) {
				this.fuelCalcEnabled = false;
				this.blockCalc = true;
				setTimeout(() => {
					this.blockCalc = false;
				}, 1000);
			}
			if (
				!this.fuelCalcEnabled &&
				!this.blockCalc &&
				this.trackingString !== ''
			) {
				if (
					this.storedAverageLap === -1 ||
					(
						this.lastLapsFuel.length +
						this.fuelAndTimeTracking[
							this.trackingString
						][
							this.fuelUseActive + 1
						].length
					) <= 0
				) {
					this.displayMessage = _('We have no Data yet!');
					this.displayMessageSwitch = true;
					clearTimeout(this.displayMessageTimer);
					this.displayMessageTimer = setTimeout(this.displayMessageReset, 3000);
				} else {
					this.fuelCalcEnabled = true;
				}
			}
		}
		this.fuelCalcBlock = blockFuelCalc;
	}

	@action
	private onMouseUp = () => {
		if (
			!this.fuelCalcEnabled &&
			!this.blockCalc &&
			!this.fuelCalcBlock &&
			this.trackingString !== ''
		) {
			if (
				(
					this.lastLapsFuel.length +
					this.fuelAndTimeTracking[
						this.trackingString
					][
						this.fuelUseActive + 1
					].length
				) <= 0
			) {
				this.displayMessage = _('We have no Data yet!');
				this.displayMessageSwitch = true;
				clearTimeout(this.displayMessageTimer);
				this.displayMessageTimer = setTimeout(this.displayMessageReset, 3000);
			} else {
				this.fuelCalcEnabled = true;
			}
		}
		this.fuelCalcBlock = blockFuelCalc;
	}

	@action
	private adjustSetTimeFuelM1 = () => {
		this.setTimeFuel =
			(this.setTimeFuel - 1) < 0
			?	0
			:	this.setTimeFuel - 1;
	}

	@action
	private adjustSetTimeFuelM10 = () => {
		this.setTimeFuel =
			(this.setTimeFuel - 10) < 0
			?	0
			:	this.setTimeFuel - 10;
	}

	@action
	private adjustSetTimeFuelP1 = () => {
		this.setTimeFuel++;
	}

	@action
	private adjustSetTimeFuelP10 = () => {
		this.setTimeFuel += 10;
	}

	@action
	private adjustSetRoundFuelM1 = () => {
		this.setRoundFuel =
			(this.setRoundFuel - 1) < 0
			?	0
			:	this.setRoundFuel - 1;
	}

	@action
	private adjustSetRoundFuelM5 = () => {
		this.setRoundFuel =
			(this.setRoundFuel - 5) < 0
			?	0
			:	this.setRoundFuel - 5;
	}

	@action
	private adjustSetRoundFuelP1 = () => {
		this.setRoundFuel++;
	}

	@action
	private adjustSetRoundFuelP5 = () => {
		this.setRoundFuel += 5;
	}

	@action resetSetTimeFuel = () => {
		this.setTimeFuel = 0;
	}

	@action resetSetRoundFuel = () => {
		this.setRoundFuel = 0;
	}

	@action onWheel = () => {
		return;
	}

	private getFuelNeeded(minutes: boolean) {
		let calculated =
			this.setRoundFuel *
			this.fuelPerLap;
		if (minutes) {
			calculated =
				this.fuelPerLap *
				Math.ceil(
					(this.setTimeFuel * 60) / this.storedAverageLap
				);
		}
		return calculated.toFixed(1) + 'L';
	}

	private getTimeFuelLeftNumber() {
		const fpS = this.storedAverageLap > 0
			?	this.fuelPerLap / this.storedAverageLap
			:	this.storedBestLap > 0
				?	this.fuelPerLap / this.storedBestLap
				:	0;
		const swF = fpS > 0
			?	this.fuelLeft / fpS
			:	-1;
		return swF;
	}

	private getTimeFuelLeftBoolean() {
		const fpS = this.storedAverageLap > 0
			?	this.fuelPerLap / this.storedAverageLap
			:	this.storedBestLap > 0
				?	this.fuelPerLap / this.storedBestLap
				:	0;
		const swF = fpS > 0
			?	this.fuelLeft / fpS
			:	-1;
		return swF <= this.storedAverageLap;
	}

	private getFuelNeed() {
		const perLap = this.fuelPerLap;
		if (perLap === -1) {
			return {ftEnd: 'N/A', ftAdd: 'N/A'};
		}

		const secsRemain = this.sessionTimeRemaining;
		let fastestLapLeader = r3e.data.LapTimeBestLeader;
		let fastestLap = this.storedAverageLap;
		if (fastestLap <= 0) {
			fastestLap = this.storedBestLap;
		}
		if (fastestLap <= 0) {
			fastestLap = r3e.data.LapTimeBestSelf;
		}
		if (fastestLap <= 0) {
			return {ftEnd: 'N/A', ftAdd: 'N/A'};
		}
		if (fastestLapLeader <= 0) {
			fastestLapLeader = fastestLap;
		}
		let roundsLeft = 0;
		let roundsLeftFloat = 0.0;
		let leader = 999;
		let leaderLaps = -1;
		const playerLaps = r3e.data.CompletedLaps;
		let leaderPercent = 0;
		const playerPercent = r3e.data.LapDistanceFraction;
		let timeLeft = 0;

		if (r3e.data.SessionLengthFormat >= 0) {
			if (r3e.data.SessionLengthFormat === 1) {
				let blob = 0;
				r3e.data.DriverData.forEach((driver) => {
						const blab = driver.CompletedLaps + 1;
						if (blab != null && blab > blob) {
							blob = blab;
						}
					}
				);
				roundsLeft = this.sessionPhase === 6
					?	0
					:	r3e.data.NumberOfLaps - blob;
				roundsLeftFloat = roundsLeft + (1 - playerPercent);
			} else if (this.sessionType !== -1) {
				if (this.sessionType < 2) {
					roundsLeft = this.sessionPhase === 6
						?	0
						:	Math.floor(secsRemain / fastestLap);
					roundsLeftFloat = roundsLeft + (1 - playerPercent);
				} else if (this.sessionType === 2) {
					if (this.sessionPhase === 6) {
						roundsLeft = 0;
						roundsLeftFloat = roundsLeft + (1 - playerPercent);
					} else {
						r3e.data.DriverData.forEach((driver) => {
								const blib = driver.Place;
								if (blib != null && blib < leader) {
									leader = blib;
									leaderLaps =
										driver.CompletedLaps;
									leaderPercent =
										driver.LapDistance / this.layoutLength;
								}
							}
						);
						roundsLeft = Math.floor(secsRemain / fastestLap);
						timeLeft = secsRemain - (fastestLap * roundsLeft);
						if (
							leaderLaps > playerLaps &&
							leaderPercent < playerPercent
						) {
							roundsLeft++;
						}
						if (timeLeft > (fastestLapLeader * (1 - leaderPercent))) {
							roundsLeft++;
						}
						roundsLeftFloat = roundsLeft + (1 - playerPercent);
					}
				}
			}
		}

		const fuelToEnd = perLap * (roundsLeft + (1 - playerPercent));
		const fuelToAdd = fuelToEnd >= 0 ? fuelToEnd - r3e.data.FuelLeft : 0;
		eRoundsLeft = Math.round(roundsLeftFloat * 10) / 10;

		return {
			ftEnd:
				fuelToEnd > 0
				?	fuelToEnd.toFixed(1).toString()
				:	'N/A',
			ftAdd:
				fuelToAdd !== 0
				?	fuelToAdd <= -100
					?	fuelToAdd.toFixed().toString()
					:	fuelToAdd.toFixed(1).toString()
				:	'N/A'
		};
		/* if (toEnd) {
			if (fuelToEnd >= 0) {
				return fuelToEnd.toFixed(1).toString();
			}
			return 'N/A';
		}
		if (fuelToAdd !== 0) {
			if (fuelToAdd <= -100) {
				return fuelToAdd.toFixed().toString();
			}
			return fuelToAdd.toFixed(1).toString();
		}
		return 'N/A';*/
	}

	private getFuelTextColor(fuel: number, laps: boolean, time: boolean) {
		const red = '#ff0000';
		const green = '#00ff00';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		// Magic numbers decided based on some random sample cars

		if (laps && !time) {
			if (fuel <= 2) {
				return red;
			}
			if (fuel >= 3) {
				return green;
			}
			if (fuel > 2) {
				const localDelta = 1;
				const deltaFromCold = fuel - 2;
				amount = Math.min(1, deltaFromCold / localDelta);
				fromColor = red;
				toColor = green;
			}
		}
		if (!laps && time) {
			if (fuel <= (this.storedAverageLap * 2)) {
				return red;
			}
			if (fuel >= (this.storedAverageLap * 3)) {
				return green;
			}
			if (fuel > (this.storedAverageLap * 2)) {
				const localDelta = this.storedAverageLap;
				const deltaFromCold = fuel - (this.storedAverageLap * 2);
				amount = Math.min(1, deltaFromCold / localDelta);
				fromColor = red;
				toColor = green;
			}
		}
		if (!laps && !time) {
			if (fuel < (this.fuelCapacity * 0.05)) {
				return red;
			}
			if (fuel > (this.fuelCapacity * 0.25)) {
				return green;
			}
			if (fuel > (this.fuelCapacity * 0.05)) {
				const localDelta = this.fuelCapacity * 0.05;
				const deltaFromCold = fuel - localDelta;
				amount = Math.min(1, deltaFromCold / localDelta);
				fromColor = red;
				toColor = green;
			}
		}
		return lerpColor(fromColor, toColor, amount);
	}

	private runFuelCheck() {
		if (this.playerSlotId !== -1) {
			if (this.playerIsFocus && this.trackingString !== '') {

				if (
					this.fuelAndTimeTracking[this.trackingString] === undefined
				) {
					let newSet = false;
					let storedData: IFuelData = {};
					if (localStorage.FuelAndTimeTracking) {
						storedData = JSON.parse(localStorage.FuelAndTimeTracking);
					}
					if (storedData[this.trackingString] === undefined) {
						newSet = true;
						// showDebugMessage('Created new Combo Set');
						storedData[this.trackingString] = [
							[
								-1,
								-1
							],
							[],
							[],
							[],
							[],
							[]
						];
					}

					this.fuelAndTimeTracking = merge(this.fuelAndTimeTracking, storedData);
					if (newSet) {
						localStorage.FuelAndTimeTracking =
							JSON.stringify(this.fuelAndTimeTracking, null, '  ');
					}
				}
				if (
					this.fuelAndTimeTracking[this.trackingString] !== undefined
				) {
					this.fuelAndTimeTracking[this.trackingString].forEach((fattarray, i) => {
						const lookArray = fattarray;
						if (lookArray.length >= 50) {
							const sortArray =
								lookArray.sort(this.sortThisArrayAscending);
							const slicedArray =
								i > 1
									?	sortArray.slice(10, sortArray.length + 1)
									:	sortArray.slice(0, 41);
							this.fuelAndTimeTracking[this.trackingString][i] =
								slicedArray;
							localStorage.FuelAndTimeTracking =
								JSON.stringify(this.fuelAndTimeTracking, null, '  ');
						}
					});
				}

				const lLLength = this.lastLapsFuel.length;
				const fTTFALength =
					this.fuelAndTimeTracking[this.trackingString][
						this.fuelUseActive + 1
					].length;
				const fTTTALength =
					this.fuelAndTimeTracking[this.trackingString][1].length;
				let sum = 0;
				let sim = 0;
				if (lLLength > 0) {
					this.lastLapsFuel.forEach((sumfuel) => {
						sum += sumfuel;
					});
				}

				if (
					this.fuelAndTimeTracking[this.trackingString] !== undefined
				) {
					this.storedBestLap =
						this.fuelAndTimeTracking[this.trackingString][0][0];
					this.exportPB = this.storedBestLap;
					personalBestTime = this.exportPB;
					if (fTTFALength > 0) {
						this.fuelAndTimeTracking[this.trackingString][1]
						.forEach((fuel) => {
							sim += fuel;
						});
					}
					if (fTTFALength > 0) {
						this.fuelAndTimeTracking[this.trackingString][this.fuelUseActive + 1]
						.forEach((fuel) => {
							sum += fuel;
						});
					}
				}

				this.storedAverageLap = sim > 0
					?	sim / fTTTALength
					:	-1;
				this.lastLapsFuelAverage = sum > 0
					?	parseFloat(
							(
								sum / (
									lLLength + fTTFALength
								)
							).toFixed(2)
						)
					:	-1;

				if (this.storedAverageLap === -1 && this.storedBestLap > 0) {
					this.storedAverageLap = this.storedBestLap;
				}
				this.fuelPerLap =
					this.lastLapsFuelAverage > 0
						?	this.lastLapsFuelAverage
						:	parseFloat(r3e.data.FuelPerLap.toFixed(2));

				const fuelArray = this.getFuelNeed();
				// this.fuelToEnd = this.getFuelNeed(true);
				// this.fuelToAdd = this.getFuelNeed(false);
				this.fuelToEnd = fuelArray.ftEnd;
				this.fuelToAdd = fuelArray.ftAdd;

				if (r3e.data.InPitlane > 0 || this.wasInPit) {
					this.wasInPit = true;
					this.passed = false;
				}

				if (
					this.wasInPit &&
					r3e.data.LapDistance > (
						this.layoutLength / 2
					) &&
					r3e.data.InPitlane < 1
				) {
					this.wasInPit = false;
				}

				if (
					r3e.data.LapDistance >= 0 &&
					r3e.data.LapDistance < 200 &&
					this.lapStartFuel === -1 &&
					!this.wasInPit &&
					r3e.data.LapTimeCurrentSelf >= 0
				) {
					this.lapStartFuel = r3e.data.FuelLeft;
					this.skipThisLapForStats = false;
					this.passed = false;
					if (this.debug) {
						showDebugMessageSmall(
							`1st Cross - Fuel:${
								this.lapStartFuel
							}`, 3000
						);
					}
				}

				if (
					r3e.data.InPitlane > 0 ||
					r3e.data.GameInMenus > 0 ||
					!this.fuelUseActive ||
					this.sessionPhase <= 3 ||
					r3e.data.LapTimeCurrentSelf < 0
				) {
					this.lapStartFuel = -1;
					this.passed = false;
					if (this.debug) {
						showDebugMessageSmall(
							`Invalididated Lap for Fuel Tracking`, 3000
						);
					}
				}

				if (this.lapStartFuel !== -1 &&
					(
						this.wasInPit ||
						(r3e.data.CarSpeed <= 0 && !this.actualFirstLap) ||
						(r3e.data.Gear < 0 && !this.actualFirstLap) ||
						this.sessionPhase <= 3 ||
						r3e.data.Flags.BlackAndWhite >= 3 ||
						r3e.data.Flags.YellowCausedIt === 1 ||
						(
							r3e.data.CarDamage.Engine !== -1 &&
							r3e.data.CarDamage.Transmission <= 0.5
						) ||
						r3e.data.Penalties.DriveThrough > 0 ||
						r3e.data.Penalties.SlowDown > 0 ||
						r3e.data.Penalties.PitStop > 0 ||
						r3e.data.Penalties.StopAndGo > 0 ||
						r3e.data.PitLimiter > 0 ||
						!this.fuelUseActive ||
						r3e.data.GameInMenus > 0 ||
						r3e.data.LapTimeCurrentSelf < 0 ||
						r3e.data.CurrentLapValid <= 0
					)
				) {
					if (this.debug) {
						showDebugMessageSmall(
							`${fTTFALength} ${fTTTALength} ${lLLength}`, 3000
						);
					}
					this.skipThisLapForStats = true;
				}
				if (
					this.lapStartFuel !== -1 &&
					r3e.data.LapDistance > 500 &&
					r3e.data.LapDistance < 700
				) {
					this.passed = true;
					if (this.debug) {
						showDebugMessageSmall(
							`Detection Zone passed - Fuel:${
								this.lapStartFuel
							}`, 3000
						);
					}
				}
				if (
					this.lapStartFuel !== -1 &&
					r3e.data.LapDistance >= 0 &&
					r3e.data.LapDistance < 200 &&
					this.passed
					// (this.lapStartFuel - r3e.data.FuelLeft) > (this.fuelPerLap * 0.75) &&
					// (this.lapStartFuel - r3e.data.FuelLeft) < (this.fuelPerLap * 1.25)
				) {
					this.passed = false;
					const nowFuel = r3e.data.FuelLeft;
					this.theFuel = this.lapStartFuel - nowFuel;
					this.fuelLastLap = (this.lapStartFuel - nowFuel).toFixed(2);
					this.lapStartFuel = nowFuel;
					if (!this.actualFirstLap) {
						this.lastLapsFuel.push(this.theFuel);
					}
					if (!this.skipThisLapForStats && !this.actualFirstLap) {
						clearTimeout(this.saveTimeout);
						this.saveTimeout = setTimeout(this.checkAndSave, 1000);
						if (this.debug) {
							showDebugMessageSmall(
								`Valid Lap for record - Fuel used:${
									this.theFuel
								} - Temp Fuel array:${
									lLLength + 1
								} - Saved Fuel array:${
									fTTFALength + 1
								}`, 3000
							);
						}
					} else if (this.debug) {
						showDebugMessageSmall(
							`Non-Valid Lap for record - Fuel used:${
								this.theFuel
							} - Temp Fuel array:${
								lLLength + 1
							} - Saved Fuel array:${
								fTTFALength
							}`, 3000
						);
					}
					this.skipThisLapForStats = false;
				}
			} else {
				this.lapStartFuel = -1;
			}
		} else {
			this.lapStartFuel = -1;
		}
	}

	private sortThisArrayAscending = (a: number, b: number) => {
		return a - b;
	};

	private sortThisArrayDescending = (a: number, b: number) => {
		return b - a;
	};

	@action
	private cancelClearData = () => {
		this.showDeleteAll = false;
		this.showDeleteCombo = false;
		this.showDeleteBL = false;
		this.showConfirmButtons = false;
		this.displayMessageSwitch = false;
		clearTimeout(this.displayMessageTimer);
	}

	@action
	private clearAllData = () => {
		this.showDeleteAll = false;
		this.showDeleteCombo = false;
		this.showDeleteBL = false;
		this.showConfirmButtons = false;
		if (this.trackingString !== '') {
			delete localStorage.FuelAndTimeTracking;
			this.fuelAndTimeTracking = {}; /*[this.trackingString] = [
				[
					-1,
					-1
				],
				[],
				[],
				[],
				[],
				[]
			];*/
			showDebugMessage(
				_('All Fuel/Lap Tracking data got deleted!'),
				3000
			);
		}
		this.displayMessageSwitch = false;
		// this.displayMessage = 'Data for all Combinations deleted';
		clearTimeout(this.displayMessageTimer);
		// this.displayMessageTimer = setTimeout(this.displayMessageReset, 3000);
	}

	@action
	private clearCombinationDataNoMessage = () => {
		if (
			this.trackingString !== '' &&
			this.fuelAndTimeTracking[this.trackingString] !== undefined
		) {
			for (let i = 1; i < 6; i++) {
				this.fuelAndTimeTracking[this.trackingString][i] = [];
			}
			localStorage.FuelAndTimeTracking =
				JSON.stringify(this.fuelAndTimeTracking, null, '  ');
		}
	}

	@action
	private clearCombinationData = () => {
		if (this.trackingString !== '') {
			this.showDeleteAll = false;
			this.showDeleteCombo = false;
			this.showDeleteBL = false;
			this.showConfirmButtons = false;
			// delete this.fuelAndTimeTracking[this.trackingString];
			if (this.fuelAndTimeTracking[this.trackingString] !== undefined) {
				for (let i = 1; i < 6; i++) {
					this.fuelAndTimeTracking[this.trackingString][i] = [];
				}
				localStorage.FuelAndTimeTracking =
					JSON.stringify(this.fuelAndTimeTracking, null, '  ');
				showDebugMessage(
					_('Fuel/Lap Tracking data for this Combination got deleted!'),
					3000
				);
			}
		}
		this.displayMessageSwitch = false;
		// this.displayMessage = 'Data for this Combination deleted';
		clearTimeout(this.displayMessageTimer);
		// this.displayMessageTimer = setTimeout(this.displayMessageReset, 3000);
	}

	@action
	private clearCombinationDataBL = () => {
		if (this.trackingString !== '') {
			this.showDeleteAll = false;
			this.showDeleteCombo = false;
			this.showDeleteBL = false;
			this.showConfirmButtons = false;
			if (this.fuelAndTimeTracking[this.trackingString] !== undefined) {
				this.fuelAndTimeTracking[this.trackingString][0][0] = -1;
				for (let i = 1; i < 6; i++) {
					this.fuelAndTimeTracking[this.trackingString][i] = [];
				}
				localStorage.FuelAndTimeTracking =
					JSON.stringify(this.fuelAndTimeTracking, null, '  ');

				showDebugMessage(
					_('Fuel/Lap Tracking data for this Combination got deleted!'),
					3000
				);
			}
		}
		this.displayMessageSwitch = false;
		// this.displayMessage = 'Data for this Combination deleted';
		clearTimeout(this.displayMessageTimer);
		// this.displayMessageTimer = setTimeout(this.displayMessageReset, 3000);
	}

	@action
	private clearDataBL = () => {
		this.displayMessage = _('Clear Personal Best-Laptime?');
		this.showDeleteCombo = false;
		this.showDeleteAll = false;
		this.showDeleteBL = true;
		this.displayMessageSwitch = true;
		this.showConfirmButtons = true;
	}

	private clearData(allData = false) {
		if (allData) {
			this.displayMessage = _('Really delete ALL data?');
			this.showDeleteAll = true;
			this.showDeleteCombo = false;
			this.showDeleteBL = false;
		} else {
			this.displayMessage = _('Really delete Combination data?');
			this.showDeleteCombo = true;
			this.showDeleteBL = false;
			this.showDeleteAll = false;
		}
		this.displayMessageSwitch = true;
		this.showConfirmButtons = true;
	}

	@action
	private displayMessageReset = () => {
		this.displayMessageSwitch = false;
	}

	@action
	private checkAndSave = () => {
		if (
			r3e.data.LapTimePreviousSelf > 0 &&
			r3e.data.LapTimePreviousSelf !== this.lastLapTimePreviousSelf
		) {
			if (
				(
					this.storedAverageLap !== -1 &&
					Math.abs(r3e.data.LapTimePreviousSelf - this.storedAverageLap) >
						(this.storedAverageLap * 0.25)
				) ||
				(
					this.lastLapsFuelAverage !== -1 &&
					Math.abs(this.theFuel - this.lastLapsFuelAverage) >
						(this.lastLapsFuelAverage / 2)
				)
			) {
				clearTimeout(this.saveTimeout);
				if (this.debug) {
					showDebugMessageSmall(`Lap was not saved, out of range`, 2000);
				}
				return;
			}
			this.lastLapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
			this.fuelAndTimeTracking[this.trackingString][1]
				.push(r3e.data.LapTimePreviousSelf);
			this.fuelAndTimeTracking[this.trackingString][this.fuelUseActive + 1]
				.push(this.theFuel);
			if (
				this.storedBestLap === -1 ||
				r3e.data.LapTimePreviousSelf <= this.storedBestLap
			) {
				this.storedBestLap = r3e.data.LapTimePreviousSelf;
				this.exportPB = this.storedBestLap;
				personalBestTime = this.exportPB;
				this.newBestLap = true;
				this.fuelAndTimeTracking[this.trackingString][0][0] =
					this.storedBestLap;
				this.fuelAndTimeTracking[this.trackingString][0][1] =
					parseFloat(this.fuelLastLap);
				clearTimeout(this.saveTimeout);
				this.saveTimeout = setTimeout(this.resetBlink, 5000);
			}
			localStorage.FuelAndTimeTracking =
				JSON.stringify(this.fuelAndTimeTracking, null, '  ');
		}
		this.skipThisLapForStats = false;
		if (this.debug) {
			showDebugMessageSmall(`Lap was saved!`, 2000);
		}
	};

	@action
	private resetBlink = () => {
		this.newBestLap = false;
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			(
				!this.fuelUseActive ||
				!this.playerIsFocus
			) && !showAllMode) {
			return null;
		}
		if (this.displayMessageSwitch) {
			return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelDetail', this.props.className, {
					})}
					onWheel={this.onDummy}
					onMouseDown={this.onDummy}
					onMouseUp={this.onDummy}
				>
				<div className="ClearData">
					{this.displayMessage}
				</div>
				{
					this.showConfirmButtons &&
					!this.showDeleteCombo &&
					!this.showDeleteBL &&
					this.showDeleteAll && (
						<button className="confirmYes" onClick={this.clearAllData}>
							{_('YES')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteCombo &&
					!this.showDeleteBL &&
					this.showDeleteAll && (
						<button className="confirmNo" onClick={this.cancelClearData}>
							{_('NO')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteAll &&
					!this.showDeleteBL &&
					this.showDeleteCombo && (
						<button className="confirmYes" onClick={this.clearDataBL}>
							{_('YES')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteAll &&
					!this.showDeleteBL &&
					this.showDeleteCombo && (
						<button className="confirmNo" onClick={this.cancelClearData}>
							{_('NO')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteAll &&
					!this.showDeleteCombo &&
					this.showDeleteBL && (
						<button className="confirmYes" onClick={this.clearCombinationDataBL}>
							{_('YES')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteCombo &&
					!this.showDeleteAll &&
					this.showDeleteBL && (
						<button className="confirmNo" onClick={this.clearCombinationData}>
							{_('NO')}
						</button>
					)
				}
				</div>
			);
		}
		if (this.fuelCalcEnabled) {
			return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelCalc', this.props.className, {
					})}
					onMouseDown={this.onMouseDown}
					onWheel={this.onWheel}
				>
				<div className="FuelCalcTitleBox"/>
					<div className="FuelCalcTitleTextBox">
						<div className="FuelCalcTitleText">
							{_('Fuel Calculator - Right click to close')}
						</div>
					</div>

					<div className="FuelCalcMinuteBox"/>
					<div className="FuelCalcMinuteTextBox">
						<div className="FuelCalcMinuteText">
							{_('Minutes')}
						</div>
					</div>
					<div className="FuelCalcMinuteAmountBox">
						<div className="FuelCalcMinuteAmount">
							{this.setTimeFuel}
						</div>
					</div>

					<div className="FuelCalcRoundBox"/>
					<div className="FuelCalcRoundTextBox">
						<div className="FuelCalcRoundText">
							{_('Laps')}
						</div>
					</div>
					<div className="FuelCalcRoundAmountBox">
						<div className="FuelCalcRoundAmount">
							{this.setRoundFuel}
						</div>
					</div>

					<div className="FuelMinuteM1TextBox">
						<div
							className={classNames('FuelMinuteM1Text', {
							})}
						>
							{`${'-1'}`}
						</div>
					</div>
					<button
						className={classNames('FuelMinuteM1Box', {
							})}
						onClick={this.adjustSetTimeFuelM1}
					/>

					<div className="FuelMinuteM10TextBox">
						<div
							className={classNames('FuelMinuteM10Text', {
							})}
							onClick={this.adjustSetTimeFuelM10}
						>
							{`${'-10'}`}
						</div>
					</div>
					<button
						className={classNames('FuelMinuteM10Box', {
						})}
						onClick={this.adjustSetTimeFuelM10}
					/>

					<div className="FuelRoundM1TextBox">
						<div
							className={classNames('FuelRoundM1Text', {
							})}
							onClick={this.adjustSetRoundFuelM1}
						>
							{`${'-1'}`}
						</div>
					</div>
					<button
						className={classNames('FuelRoundM1Box', {
						})}
						onClick={this.adjustSetRoundFuelM1}
					/>

					<div className="FuelRoundM5TextBox">
						<div
							className={classNames('FuelRoundM5Text', {
							})}
							onClick={this.adjustSetRoundFuelM5}
						>
							{`${'-5'}`}
						</div>
					</div>
					<button
						className={classNames('FuelRoundM5Box', {
						})}
						onClick={this.adjustSetRoundFuelM5}
					/>

					<div className="FuelMinuteResetTextBox">
						<div
							className={classNames('FuelMinuteResetText', {
							})}
							onClick={this.resetSetTimeFuel}
						>
							{_('Reset')}
						</div>
					</div>
					<button
						className={classNames('FuelMinuteResetBox', {
						})}
						onClick={this.resetSetTimeFuel}
					/>

					<div className="FuelRoundResetTextBox">
						<div
							className={classNames('FuelRoundResetText', {
							})}
							onClick={this.resetSetRoundFuel}
						>
							{_('Reset')}
						</div>
					</div>
					<button
						className={classNames('FuelRoundResetBox', {
						})}
						onClick={this.resetSetRoundFuel}
					/>

					<div className="FuelMinuteP1TextBox">
						<div
							className={classNames('FuelMinuteP1Text', {
							})}
							onClick={this.adjustSetTimeFuelP1}
						>
							{`${'+1'}`}
						</div>
					</div>
					<button
						className={classNames('FuelMinuteP1Box', {
						})}
						onClick={this.adjustSetTimeFuelP1}
					/>

					<div className="FuelMinuteP10TextBox">
						<div
							className={classNames('FuelMinuteP10Text', {
							})}
							onClick={this.adjustSetTimeFuelP10}
						>
							{`${'+10'}`}
						</div>
					</div>
					<button
						className={classNames('FuelMinuteP10Box', {
						})}
						onClick={this.adjustSetTimeFuelP10}
					/>

					<div className="FuelRoundP1TextBox">
						<div
							className={classNames('FuelRoundP1Text', {
							})}
							onClick={this.adjustSetRoundFuelP1}
						>
							{`${'+1'}`}
						</div>
					</div>
					<button
						className={classNames('FuelRoundP1Box', {
						})}
						onClick={this.adjustSetRoundFuelP1}
					/>

					<div className="FuelRoundP5TextBox">
						<div
							className={classNames('FuelRoundP5Text', {
							})}
							onClick={this.adjustSetRoundFuelP5}
						>
							{`${'+5'}`}
						</div>
					</div>
					<button
						className={classNames('FuelRoundP5Box', {
						})}
						onClick={this.adjustSetRoundFuelP5}
					/>

					<div className="FuelCalcMinuteNeedBox"/>
					<div className="FuelCalcMinuteNeedTextBox">
						<div className="FuelCalcMinuteNeedText">
							{_('Fuel needed')}
						</div>
					</div>

					<div className="FuelCalcMinuteNeedAmountBox">
						<div className="FuelCalcMinuteNeedAmount">
							{this.getFuelNeeded(true)}
						</div>
					</div>

					<div className="FuelCalcRoundNeedBox"/>
					<div className="FuelCalcRoundNeedTextBox">
						<div className="FuelCalcRoundNeedText">
							{_('Fuel needed')}
						</div>
					</div>
					<div className="FuelCalcRoundNeedAmountBox">
						<div className="FuelCalcRoundNeedAmount">
							{this.getFuelNeeded(false)}
						</div>
					</div>
				</div>
			);
		}
		if (!this.fuelCalcBlock) {
			return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelDetail', this.props.className, {
					})}
					onMouseUp={this.onMouseUp}
				>
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredInfoBox"/>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredSpeedBox">
								<div className="StoredSpeed">
									{
										this.storedBestLap > 0 ||
										this.storedAverageLap > 0
										?	this.mphSpeed
											?	this.storedAverageLap > 0
												?	mpsToMph(
														this.layoutLength / this.storedAverageLap
													).toFixed()
												:	mpsToMph(
														this.layoutLength / this.storedBestLap
													).toFixed()
											:	this.storedAverageLap > 0
												?	mpsToKph(
														this.layoutLength / this.storedAverageLap
													).toFixed()
												:	mpsToKph(
														this.layoutLength / this.storedBestLap
													).toFixed()
										: 	'N/A'
									}{
									this.storedBestLap > 0 ||
										this.storedAverageLap > 0
											?	this.mphSpeed
													?	_('MPH')
													:	_('KMH')
											: ''
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredSpeedTextBox">
								<div className="StoredSpeedText">
									{_('Average Speed:')}{' '}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredLapBestBox">
								<div
									className={classNames('StoredLapBest', {
										blinkBest: this.newBestLap
									})}
									style={{
										opacity: this.newBestLap
											?	this.opacityLevel
											:	1.0
									}}
								>
									{
										this.storedBestLap > 0
										?	this.storedBestLap >= 60
											?	formatTime(this.storedBestLap, 'm:ss.SSS')
											:	formatTime(this.storedBestLap, 'ss.SSS')
										:	'-:--.---'
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredLapBestTextBox">
								<div className="StoredLapBestText">
									{_('Best Laptime:')}{' '}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredLapAverageBox">
								<div
									className="StoredLapAverage"
									style={{
										opacity: 1.0
									}}
								>
									{
										this.storedAverageLap > 0
										?	this.storedAverageLap >= 60
											?	formatTime(this.storedAverageLap, 'm:ss.SSS')
											:	formatTime(this.storedAverageLap, 'ss.SSS')
										:	'-:--.---'
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showStoredInfo.enabled && (
							<div className="StoredLapAverageTextBox">
								<div className="StoredLapAverageText">
									{_('Average Laptime:')}{' '}
								</div>
							</div>
						)
					}

					<div className="FuelRemainBox"/>

					<div className="FuelReaminAmountBox">
						<div
							className="FuelRemain"
							style={{
								color: `${this.getFuelTextColor(this.fuelLeft, false, false)}`
							}}
						>
							{this.fuelLeft.toFixed(1)}
						</div>
					</div>
					<div className="FuelRemainTextBox">
						<div className="FuelRemainText">
							{_('Fuel Remain')}
						</div>
					</div>

					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateBox"/>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateAmountBox">
								<div
									className={classNames('TimeEstimateAmount', {
										lowTime: this.storedBestLap > 0
											?	this.getTimeFuelLeftBoolean()
											:	false
									})}
									style={{
										color: this.storedBestLap > 0
											?	`${this.getFuelTextColor(
													this.fuelTimeLeft, false, true
												)}`
											:	'#D2691E',
										opacity: this.storedBestLap > 0
											?	this.getTimeFuelLeftBoolean()
												?	this.opacityLevel
												:	1.0
											:	1.0
									}}
								>
									{
										this.storedBestLap > 0
										?	formatTime(this.fuelTimeLeft, 'H:mm:ss')
										:	'N/A'
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateTextBox">
								<div className="TimeEstimateText">
									{_('Time Estimate')}
								</div>
							</div>
						)
					}

					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateBox"/>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateAmountBox">
								<div
									className={classNames('LapsEstimateAmount', {
										lowLaps: this.playerIsFocus
											?	(this.fuelLeft / this.fuelPerLap) < 1
											:	false
									})}
									style={{
										color: `${
											this.playerIsFocus
											?	this.getFuelTextColor(
													(this.fuelLeft / this.fuelPerLap), true, false
												)
											:	'#D2691E'
										}`,
										opacity: (this.fuelLeft / this.fuelPerLap) < 1
											?	this.opacityLevel
											:	1.0
									}}
								>
									{
										this.playerIsFocus
										?	(this.fuelLeft / this.fuelPerLap).toFixed(1)
										:	'N/A'
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateTextBox">
								<div className="LapsEstimateText">
									{_('Laps Estimate')}
								</div>
							</div>
						)
					}

					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyBox"/>
						)
					}
					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyAmountBox">
								<div
									className={classNames('LapsEstimateOnlyAmount', {
										lowLaps: (this.fuelLeft / this.fuelPerLap) < 1
									})}
									style={{
										color: `${this.getFuelTextColor(
											(this.fuelLeft / this.fuelPerLap), true, false
										)}`,
										opacity: (this.fuelLeft / this.fuelPerLap) < 1
											?	this.opacityLevel
											:	1.0
									}}
								>
									{(this.fuelLeft / this.fuelPerLap).toFixed(1)}
								</div>
							</div>
						)
					}
					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyTextBox">
								<div className="LapsEstimateOnlyText">
									{_('Laps Estimate')}
								</div>
							</div>
						)
					}

					<div className="FuelLastLapBox"/>
					<div className="FuelLastLapAmountBox">
						<div className="FuelLastLapAmount">
							{
								this.fuelLastLap !== ''
								?	this.fuelLastLap
								:	'N/A'
							}
						</div>
					</div>
					<div className="FuelLastLapTextBox">
						<div className="FuelLastLapText">
							{`${
								localStorage.language === 'fr'
								?	'Tr Précédent'
								:	_('Last Lap')}`
							}
						</div>
					</div>

					<div className="FuelPerLapBox"/>
					<div className="FuelPerLapAmountBox">
						<div className="FuelPerLapAmount">
							{
								this.playerIsFocus
								?	this.fuelPerLap.toFixed(2)
								:	'N/A'
							}
						</div>
					</div>
					<div className="FuelPerLapTextBox">
						<div className="FuelPerLapText">
							{_('Fuel / Lap')}
						</div>
					</div>

					<div className="FuelToEndBox"/>
					<div className="FuelToEndAmountBox">
						<div className="FuelToEndAmount">
							{
								this.sessionType === 0 &&
								(
									(
										this.sessionTimeDuration === 86400 &&
										this.sessionTimeRemaining > 14400
									) ||
									this.sessionTimeRemaining > 21600
								)
								?	`${'N/A'}`
								:	this.fuelToEnd
							}
						</div>
					</div>
					<div className="FuelToEndTextBox">
						<div className="FuelToEndText">
							{_('Fuel To End')}
						</div>
					</div>

					<div className="FuelToAddBox"/>
					<div className="FuelToAddAmountBox">
						<div
							className="FuelToAddAmount"
							style={{
								color: this.sessionType === 0 &&
								(
									(
										this.sessionTimeDuration === 86400 &&
										this.sessionTimeRemaining > 14400
									) ||
									this.sessionTimeRemaining > 21600
								)
								?	'#fff'
								:	parseFloat(this.fuelToAdd) > 0
									?	'#f00'
									:	'#0f0'
							}}
						>
							{
								this.sessionType === 0 &&
								(
									(
										this.sessionTimeDuration === 86400 &&
										this.sessionTimeRemaining > 14400
									) ||
									this.sessionTimeRemaining > 21600
								)
								?	`${'N/A'}`
								:	this.fuelToAdd
							}
						</div>
					</div>
					<div className="FuelToAddTextBox">
						<div className="FuelToAddText">
							{_('Fuel To Add')}
						</div>
					</div>
				</div>
			);
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('fuelDetail', this.props.className, {
				})}
				onMouseDown={this.onMouseDown}
			>
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredInfoBox"/>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredSpeedBox">
							<div className="StoredSpeed">
								{
									this.storedBestLap > 0 ||
									this.storedAverageLap > 0
									?	this.mphSpeed
										?	this.storedAverageLap > 0
											?	mpsToMph(
													this.layoutLength / this.storedAverageLap
												).toFixed()
											:	mpsToMph(
													this.layoutLength / this.storedBestLap
												).toFixed()
										:	this.storedAverageLap > 0
											?	mpsToKph(
													this.layoutLength / this.storedAverageLap
												).toFixed()
											:	mpsToKph(
													this.layoutLength / this.storedBestLap
												).toFixed()
									: 	'N/A'
								}{
									this.storedBestLap > 0 ||
									this.storedAverageLap > 0
										?	this.mphSpeed
												?	_('MPH')
												:	_('KMH')
										: ''
								}
							</div>
						</div>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredSpeedTextBox">
							<div className="StoredSpeedText">
								{_('Average Speed:')}{' '}
							</div>
						</div>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredLapBestBox">
							<div
								className="StoredLapBest"
								style={{
									opacity: this.newBestLap
										?	this.opacityLevel
										:	1.0
								}}
							>
								{
									this.storedBestLap > 0
									?	this.storedBestLap >= 60
										?	formatTime(this.storedBestLap, 'm:ss.SSS')
										:	formatTime(this.storedBestLap, 'ss.SSS')
									:	'-:--.---'
								}
							</div>
						</div>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredLapBestTextBox">
							<div className="StoredLapBestText">
								{_('Best Laptime:')}{' '}
							</div>
						</div>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredLapAverageBox">
							<div
								className="StoredLapAverage"
								style={{
									opacity: 1.0
								}}
							>
								{
									this.storedAverageLap > 0
									?	this.storedAverageLap >= 60
										?	formatTime(this.storedAverageLap, 'm:ss.SSS')
										:	formatTime(this.storedAverageLap, 'ss.SSS')
									:	'-:--.---'
								}
							</div>
						</div>
					)
				}
				{
					this.props.settings.subSettings.showStoredInfo.enabled && (
						<div className="StoredLapAverageTextBox">
							<div className="StoredLapAverageText">
								{_('Average Laptime:')}{' '}
							</div>
						</div>
					)
				}

				<div className="FuelRemainBox"/>

				<div className="FuelReaminAmountBox">
					<div
						className="FuelRemain"
						style={{
							color: `${this.getFuelTextColor(this.fuelLeft, false, false)}`
						}}
					>
						{this.fuelLeft.toFixed(1)}
					</div>
				</div>
				<div className="FuelRemainTextBox">
					<div className="FuelRemainText">
						{_('Fuel Remain')}
					</div>
				</div>

					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateBox"/>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateAmountBox">
								<div
									className={classNames('TimeEstimateAmount', {
										lowTime: this.storedBestLap > 0
											?	this.getTimeFuelLeftBoolean()
											:	false
									})}
									style={{
										color: this.storedBestLap > 0
											?	`${this.getFuelTextColor(
													this.fuelTimeLeft, false, true
												)}`
											:	'#D2691E',
										opacity: this.storedBestLap > 0
											?	this.getTimeFuelLeftBoolean()
												?	this.opacityLevel
												:	1.0
											:	1.0
									}}
								>
									{
										this.storedBestLap > 0
										?	formatTime(this.fuelTimeLeft, 'H:mm:ss')
										:	'N/A'
									}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="TimeEstimateTextBox">
								<div className="TimeEstimateText">
									{_('Time Estimate')}
								</div>
							</div>
						)
					}

					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateBox"/>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateAmountBox">
								<div
									className={classNames('LapsEstimateAmount', {
										lowLaps: (this.fuelLeft / this.fuelPerLap) < 1
									})}
									style={{
										color: `${this.getFuelTextColor(
											(this.fuelLeft / this.fuelPerLap), true, false
										)}`,
										opacity: (this.fuelLeft / this.fuelPerLap) < 1
											?	this.opacityLevel
											:	1.0
									}}
								>
									{(this.fuelLeft / this.fuelPerLap).toFixed(1)}
								</div>
							</div>
						)
					}
					{
						this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateTextBox">
								<div className="LapsEstimateText">
									{_('Laps Estimate')}
								</div>
							</div>
						)
					}

					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyBox"/>
						)
					}
					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyAmountBox">
								<div
									className={classNames('LapsEstimateOnlyAmount', {
										lowLaps: (this.fuelLeft / this.fuelPerLap) < 1
									})}
									style={{
										color: `${this.getFuelTextColor(
											(this.fuelLeft / this.fuelPerLap), true, false
										)}`,
										opacity: (this.fuelLeft / this.fuelPerLap) < 1
											?	this.opacityLevel
											:	1.0
									}}
								>
									{(this.fuelLeft / this.fuelPerLap).toFixed(1)}
								</div>
							</div>
						)
					}
					{
						!this.props.settings.subSettings.showFuelTime.enabled && (
							<div className="LapsEstimateOnlyTextBox">
								<div className="LapsEstimateOnlyText">
									{_('Laps Estimate')}
								</div>
							</div>
						)
					}

				<div className="FuelLastLapBox"/>
				<div className="FuelLastLapAmountBox">
					<div className="FuelLastLapAmount">
						{
							this.fuelLastLap !== ''
							?	this.fuelLastLap
							:	'N/A'
						}
					</div>
				</div>
				<div className="FuelLastLapTextBox">
					<div className="FuelLastLapText">
						{_('Last Lap')}
					</div>
				</div>

				<div className="FuelPerLapBox"/>
				<div className="FuelPerLapAmountBox">
					<div className="FuelPerLapAmount">
						{this.fuelPerLap.toFixed(2)}
					</div>
				</div>
				<div className="FuelPerLapTextBox">
					<div className="FuelPerLapText">
						{_('Fuel / Lap')}
					</div>
				</div>

				<div className="FuelToEndBox"/>
				<div className="FuelToEndAmountBox">
					<div className="FuelToEndAmount">
						{
							this.sessionType === 0 &&
							(
								(
									this.sessionTimeDuration === 86400 &&
									this.sessionTimeRemaining > 14400
								) ||
								this.sessionTimeRemaining > 21600
							)
							?	`${'N/A'}`
							:	this.fuelToEnd
						}
					</div>
				</div>
				<div className="FuelToEndTextBox">
					<div className="FuelToEndText">
						{_('Fuel To End')}
					</div>
				</div>

				<div className="FuelToAddBox"/>
				<div className="FuelToAddAmountBox">
					<div
						className="FuelToAddAmount"
						style={{
							color: this.sessionType === 0 &&
							(
								(
									this.sessionTimeDuration === 86400 &&
									this.sessionTimeRemaining > 14400
								) ||
								this.sessionTimeRemaining > 21600
							)
							?	'#fff'
							:	parseFloat(this.fuelToAdd) > 0
								?	'#f00'
								:	'#0f0'
						}}
					>
						{
							this.sessionType === 0 &&
							(
								(
									this.sessionTimeDuration === 86400 &&
									this.sessionTimeRemaining > 14400
								) ||
								this.sessionTimeRemaining > 21600
							)
							?	`${'N/A'}`
							:	this.fuelToAdd
						}
					</div>
				</div>
				<div className="FuelToAddTextBox">
					<div className="FuelToAddText">
						{_('Fuel To Add')}
					</div>
				</div>
			</div>
		);
	}
}
