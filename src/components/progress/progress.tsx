import { FuelEvents } from "../../lib/FuelEvents";
import {
	classNames,
	ePlayerIsFocus,
	eCurrentSlotId,
	fancyTimeFormatGap,
	formatTime,
	getClassColor,
	// showDebugMessage,
	widgetSettings,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	eIsLeaderboard,
	eIsHillClimb,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { ESession, EPitState } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './progress.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Progress extends React.Component<IProps, {}> {
	@observable accessor currentDifference = INVALID;
	lastDifference = INVALID;
	differences: number[] = [];

	@observable accessor lapDistanceFraction = 0;
	@observable accessor lapDistance = -1;
	@observable accessor isImproving = 0;
	@observable accessor showDeltaOnLaptime = false;
	@observable accessor isLeading = false;
	@observable accessor sessionType = INVALID;
	@observable accessor sessionPhase = -1;
	@observable accessor estimatedPosition = 0;
	@observable accessor estimatedLaptime = 10000;
	@observable accessor estimatedDeltaNext = INVALID;
	@observable accessor lapTimeCurrentSelf = INVALID;
	@observable accessor lapTimePreviousSelf = INVALID;
	@observable accessor startLights = INVALID;
	@observable accessor sectorStartFactors = {
		Sector1: 0,
		Sector2: 0,
		Sector3: 0
	};
	@observable accessor sectorTimesBestSelf = {
		Sector1: INVALID,
		Sector2: INVALID,
		Sector3: INVALID
	};
	@observable accessor currentSectors = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor bestSectorsOverall = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor bestSectorsClass = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor bestSectorsSelf = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor sectorStatus = {
		Sector1: 0,
		Sector2: 0,
		Sector3: 0
	};
	@observable accessor sectorReset = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor toCheckCurrent = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor toCheckBest = {
		Sector1: -1,
		Sector2: -1,
		Sector3: -1
	};
	@observable accessor laptimeBest = -1;
	@observable accessor laptimeBestClass = -1;
	@observable accessor laptimeStatus = 0;
	@observable accessor resetSectors = false;
	@observable accessor pitState = INVALID;
	@observable accessor lastCheck = 0;
	@observable accessor gotLapped = false;
	@observable accessor completedLaps = -1;
	@observable accessor lappedAmount = 0;
	//@observable accessor pbTime = personalBestTime;
	@observable accessor pbTime = FuelEvents.bestLapTimeSec;
	@observable accessor lapTimeBestSelf = -1;
	@observable accessor timeDeltaBestSelf = -1;
	@observable accessor lapTimeBestLeaderClass = -1;
	@observable accessor lapTimeBestLeader = -1;
	@observable accessor classPerformanceIndex = -1;
	previousDeltaInfront = 0;
	lastSessionType: number | null = null;
	// seconds
	maxImprovingValue = 0.003;
	improvingSmoothness = 100;
	@observable accessor playerIsFocus = false;
	@observable accessor currentSlotId = -1;
	@observable accessor isLeaderboard = false;
	@observable accessor isHillClimb = false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private updateDifferences = () => {
		if (this.lastDifference) {
			const difference = this.lastDifference - this.currentDifference;
			this.differences.push(difference);
			if (this.differences.length > 10) {
				this.differences = this.differences.slice(1);
				const averageDifference =
					this.differences.reduce((p, c) => p + c, 0) /
					this.differences.length;

				const deltaTarget = averageDifference - this.isImproving;

				this.isImproving += deltaTarget / this.improvingSmoothness || 0;
			}
		}
		this.lastDifference = this.currentDifference;
		if	(showAllMode) {
			this.isImproving = 5;
		}
	};

	@action
	private update = () => {
		this.pbTime = FuelEvents.bestLapTimeSec;
		/*if (
			(
				highPerformanceMode &&
				nowCheck - this.lastCheck >= 33
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastCheck >= 133
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			)
		)*/ {
			this.lastCheck = nowCheck;
			this.playerIsFocus = ePlayerIsFocus;
			this.currentSlotId = eCurrentSlotId;
			this.pitState = r3e.data.PitState;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.sectorStartFactors = r3e.data.SectorStartFactors;
			this.startLights = r3e.data.StartLights;
			this.lapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
			this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
			this.lapDistance = r3e.data.LapDistance;
			this.completedLaps = r3e.data.CompletedLaps;
			this.timeDeltaBestSelf = r3e.data.TimeDeltaBestSelf;
			this.lapTimeBestLeaderClass = r3e.data.LapTimeBestLeaderClass;
			this.lapTimeBestLeader = r3e.data.LapTimeBestLeader;
			this.classPerformanceIndex = r3e.data.VehicleInfo.ClassPerformanceIndex;
			this.isLeaderboard = eIsLeaderboard;
			this.isHillClimb = eIsHillClimb;
			this.isLeading = showAllMode
				?	false
				:	r3e.data.PositionClass === 1;
			this.showDeltaOnLaptime = (
				(
					this.sessionType === ESession.Race &&
					(
						this.props.settings.subSettings.deltaInRace.enabled ||
						this.isLeading
					) &&
					r3e.data.CurrentLapValid === 1
				) ||
				(
					this.sessionType !== ESession.Race &&
					r3e.data.CurrentLapValid === 1
				) ||
				showAllMode
			);
			if (
				this.lastSessionType != null &&
				this.lastSessionType !== ESession.Race &&
				this.sessionType === ESession.Race
			) {
				this.resetSectors = true;
			}
			if (!this.showDeltaOnLaptime) {
					this.updateRace();
			} else {
				this.updatePracticeQualify();
			}
			this.updateSectorTimes();

			if (this.sessionType === ESession.Race && !showAllMode) {
				this.gotLapped = false;
				this.lappedAmount = 0;
				let beenLapped = false;
				for (let i = r3e.data.Position - 2; i >= 0; i -= 1) {
					const driver = r3e.data.DriverData[i];
					const isSameClass =
						driver.DriverInfo.ClassPerformanceIndex ===
						r3e.data.VehicleInfo.ClassPerformanceIndex;

					if (isSameClass) {
						const lapDiff = driver.CompletedLaps - this.completedLaps;
						if (
							lapDiff === 1 &&
							driver.LapDistance > this.lapDistance
						) {
							beenLapped = true;
							this.lappedAmount = Math.abs(lapDiff);
						}
						if (
							lapDiff > 1
						) {
							beenLapped = true;
							this.lappedAmount =
								driver.LapDistance > this.lapDistance
									?	Math.abs(lapDiff)
									:	Math.abs(lapDiff - 1);
						}
						break;
					}
				}
				if (beenLapped) {
					this.gotLapped = true;
				}
			}
		}
	};

	private getClassTimeDeltaInfront() {
		let classTimeDelta = 0;
		let hasFoundOpponent = false;
		if (showAllMode) {
			return 55;
		}
		if (this.gotLapped) {
			return classTimeDelta;
		}
		// Iterate backwards from the opponent infront of the driver
		// and append their timeDeltas to get the total
		for (let i = r3e.data.Position - 2; i >= 0; i -= 1) {
			const driver = r3e.data.DriverData[i];
			if (!driver) continue; // <---- skip se o driver sumiu nesse frame
			classTimeDelta += driver.TimeDeltaBehind ?? 0;

			const isSameClass =
				driver.DriverInfo.ClassPerformanceIndex ===
				r3e.data.VehicleInfo.ClassPerformanceIndex;
			if (isSameClass) {
				hasFoundOpponent = true;
				break;
			}
		}

		if (!hasFoundOpponent) {
			return INVALID;
		}

		return classTimeDelta;
	}

	@action
	private updateSectorTimes() {
		this.currentSectors.Sector1 = -1;
		this.currentSectors.Sector2 = -1;
		this.currentSectors.Sector3 = -1;
		this.bestSectorsSelf.Sector1 = -1;
		this.bestSectorsSelf.Sector2 = -1;
		this.bestSectorsSelf.Sector3 = -1;
		this.bestSectorsClass.Sector1 = -1;
		this.bestSectorsClass.Sector2 = -1;
		this.bestSectorsClass.Sector3 = -1;
		this.bestSectorsOverall.Sector1 = -1;
		this.bestSectorsOverall.Sector2 = -1;
		this.bestSectorsOverall.Sector3 = -1;
		this.laptimeBest = -1;
		this.laptimeBestClass = -1;

		const myBestTime =
			this.lapTimeBestSelf > 0
				?	Math.round(this.lapTimeBestSelf * 1e3) / 1e3
				:	-1;
		const myLastTime =
			this.lapTimePreviousSelf > 0
				?	Math.round(this.lapTimePreviousSelf * 1e3) / 1e3
				:	-1;
		this.bestSectorsSelf.Sector1 =
			r3e.data.BestIndividualSectorTimeSelf.Sector1 > 0
				?	Math.round(
						r3e.data.BestIndividualSectorTimeSelf.Sector1 * 1e3
					) / 1e3
				:	-1;
		this.bestSectorsSelf.Sector2 =
			r3e.data.BestIndividualSectorTimeSelf.Sector2 > 0
				?	Math.round(
						r3e.data.BestIndividualSectorTimeSelf.Sector2 * 1e3
					) / 1e3
				:	-1;
		this.bestSectorsSelf.Sector3 =
			r3e.data.BestIndividualSectorTimeSelf.Sector3 > 0
				?	Math.round(
						r3e.data.BestIndividualSectorTimeSelf.Sector3 * 1e3
					) / 1e3
				:	-1;

		this.currentSectors.Sector1 =
			r3e.data.SectorTimesCurrentSelf.Sector1 > 0
				?	Math.round(
						r3e.data.SectorTimesCurrentSelf.Sector1 * 1e3
					) / 1e3
				:	-1;
		this.currentSectors.Sector2 =
			r3e.data.SectorTimesCurrentSelf.Sector2 > 0
				?	Math.round(
						(
							r3e.data.SectorTimesCurrentSelf.Sector2
							- r3e.data.SectorTimesCurrentSelf.Sector1
						) * 1e3
					) / 1e3
				:	-1;
		this.currentSectors.Sector3 =
			r3e.data.SectorTimesCurrentSelf.Sector3 > 0
				?	Math.round(
						(
							r3e.data.SectorTimesCurrentSelf.Sector3
							- r3e.data.SectorTimesCurrentSelf.Sector2
						) * 1e3
					) / 1e3
				:	-1;

		r3e.data.DriverData.forEach((driver) => {
			const isUser =
				this.currentSlotId === driver.DriverInfo.SlotId;
			const isSameClass =
				driver.DriverInfo.ClassPerformanceIndex ===
				r3e.data.VehicleInfo.ClassPerformanceIndex;
			const toCheckTime =
				driver.SectorTimeBestSelf.Sector3 > 0
					?	Math.round(driver.SectorTimeBestSelf.Sector3 * 1e3) / 1e3
					:	-1;

			this.toCheckCurrent.Sector1 =
				driver.SectorTimeCurrentSelf.Sector1 > 0
					?	Math.round(
							driver.SectorTimeCurrentSelf.Sector1 * 1e3
						) / 1e3
					:	-1;
			this.toCheckCurrent.Sector2 =
				driver.SectorTimeCurrentSelf.Sector2 > 0
					?	Math.round(
							(
								driver.SectorTimeCurrentSelf.Sector2
								- driver.SectorTimeCurrentSelf.Sector1
							) * 1e3
						) / 1e3
					:	-1;
			this.toCheckCurrent.Sector3 =
				driver.SectorTimeCurrentSelf.Sector3 > 0
					?	Math.round(
							(
								driver.SectorTimeCurrentSelf.Sector3
								- driver.SectorTimeCurrentSelf.Sector2
							) * 1e3
						) / 1e3
					:	-1;

			this.toCheckBest.Sector1 = -1;
			this.toCheckBest.Sector2 = -1;
			this.toCheckBest.Sector3 = -1;

			if (driver.SectorTimeBestSelf.Sector3 > 0) {
				this.toCheckBest.Sector1 =
					isUser
					?	r3e.data.BestIndividualSectorTimeSelf.Sector1 > 0
						?	Math.round(
								r3e.data.BestIndividualSectorTimeSelf.Sector1 * 1e3
							) / 1e3
						:	-1
					:	driver.SectorTimeBestSelf.Sector1 > 0
						?	Math.round(
								driver.SectorTimeBestSelf.Sector1 * 1e3
							) / 1e3
						:	-1;
				this.toCheckBest.Sector2 =
					isUser
					?	r3e.data.BestIndividualSectorTimeSelf.Sector2 > 0
						?	Math.round(
								r3e.data.BestIndividualSectorTimeSelf.Sector2 * 1e3
							) / 1e3
						:	-1
					:	driver.SectorTimeBestSelf.Sector2 > 0
						?	Math.round(
								(
									driver.SectorTimeBestSelf.Sector2
									- driver.SectorTimeBestSelf.Sector1
								) * 1e3
							) / 1e3
						:	-1;
				this.toCheckBest.Sector3 =
					isUser
					?	r3e.data.BestIndividualSectorTimeSelf.Sector3 > 0
						?	Math.round(
								r3e.data.BestIndividualSectorTimeSelf.Sector3 * 1e3
							) / 1e3
						:	-1
					:	driver.SectorTimeBestSelf.Sector3 > 0
						?	Math.round(
								(
									driver.SectorTimeBestSelf.Sector3
									- driver.SectorTimeBestSelf.Sector2
								) * 1e3
							) / 1e3
						:	-1;
			}

			if (
				this.toCheckBest.Sector1 > 0 &&
				(
					this.bestSectorsOverall.Sector1 < 0 ||
					this.toCheckBest.Sector1 <= this.bestSectorsOverall.Sector1
				)
			) {
				this.bestSectorsOverall.Sector1 = this.toCheckBest.Sector1;
			}
			if (
				this.toCheckBest.Sector2 > 0 &&
				(
					this.bestSectorsOverall.Sector2 < 0 ||
					this.toCheckBest.Sector2 <= this.bestSectorsOverall.Sector2
				)
			) {
				this.bestSectorsOverall.Sector2 = this.toCheckBest.Sector2;
			}
			if (
				this.toCheckBest.Sector3 > 0 &&
				(
					this.bestSectorsOverall.Sector3 < 0 ||
					this.toCheckBest.Sector3 <= this.bestSectorsOverall.Sector3
				)
			) {
				this.bestSectorsOverall.Sector3 = this.toCheckBest.Sector3;
			}

			if (isSameClass) {
				if (
					toCheckTime > 0 &&
					(
						this.laptimeBestClass < 0 ||
						toCheckTime <= this.laptimeBestClass
					)
				) {
					this.laptimeBestClass = toCheckTime;
				}

				if (
					this.toCheckBest.Sector1 > 0 &&
					(
						this.bestSectorsClass.Sector1 < 0 ||
						this.toCheckBest.Sector1 <= this.bestSectorsClass.Sector1
					)
				) {
					this.bestSectorsClass.Sector1 = this.toCheckBest.Sector1;
				}
				if (
					this.toCheckBest.Sector2 > 0 &&
					(
						this.bestSectorsClass.Sector2 < 0 ||
						this.toCheckBest.Sector2 <= this.bestSectorsClass.Sector2
					)
				) {
					this.bestSectorsClass.Sector2 = this.toCheckBest.Sector2;
				}
				if (
					this.toCheckBest.Sector3 > 0 &&
					(
						this.bestSectorsClass.Sector3 < 0 ||
						this.toCheckBest.Sector3 <= this.bestSectorsClass.Sector3
					)
				) {
						this.bestSectorsClass.Sector3 = this.toCheckBest.Sector3;
				}
			}

			if (
				toCheckTime > 0 &&
				(
					this.laptimeBest < 0 ||
					toCheckTime <= this.laptimeBest
				)
			) {
				this.laptimeBest = toCheckTime;
			}

			if (
				this.toCheckCurrent.Sector1 > 0 &&
				(
					this.bestSectorsOverall.Sector1 < 0 ||
					this.toCheckCurrent.Sector1 <= this.bestSectorsOverall.Sector1
				)
			) {
				this.bestSectorsOverall.Sector1 = this.toCheckCurrent.Sector1;
			}
			if (
				this.toCheckCurrent.Sector2 > 0 &&
				(
					this.bestSectorsOverall.Sector2 < 0 ||
					this.toCheckCurrent.Sector2 <= this.bestSectorsOverall.Sector2
				)
			) {
				this.bestSectorsOverall.Sector2 = this.toCheckCurrent.Sector2;
			}
			if (
				this.toCheckCurrent.Sector3 > 0 &&
				(
					this.bestSectorsOverall.Sector3 < 0 ||
					this.toCheckCurrent.Sector3 <= this.bestSectorsOverall.Sector3
				)
			) {
				this.bestSectorsOverall.Sector3 = this.toCheckCurrent.Sector3;
			}

			if (isSameClass) {
				if (
					this.toCheckCurrent.Sector1 > 0 &&
					(
						this.bestSectorsClass.Sector1 < 0 ||
						this.toCheckCurrent.Sector1 <= this.bestSectorsClass.Sector1
					)
				) {
					this.bestSectorsClass.Sector1 = this.toCheckCurrent.Sector1;
				}
				if (
					this.toCheckCurrent.Sector2 > 0 &&
					(
						this.bestSectorsClass.Sector2 < 0 ||
						this.toCheckCurrent.Sector2 <= this.bestSectorsClass.Sector2
					)
				) {
					this.bestSectorsClass.Sector2 = this.toCheckCurrent.Sector2;
				}
				if (
					this.toCheckCurrent.Sector3 > 0 &&
					(
						this.bestSectorsClass.Sector3 < 0 ||
						this.toCheckCurrent.Sector3 <= this.bestSectorsClass.Sector3
					)
				) {
					this.bestSectorsClass.Sector3 = this.toCheckCurrent.Sector3;
				}
			}
		});

		/* this.currentSectors.Sector1 =
			Math.round(this.currentSectors.Sector1 * 1e3) / 1e3;
		this.currentSectors.Sector2 =
			Math.round(this.currentSectors.Sector2 * 1e3) / 1e3;
		this.currentSectors.Sector3 =
			Math.round(this.currentSectors.Sector3 * 1e3) / 1e3;

		this.bestSectorsSelf.Sector1 =
			Math.round(this.bestSectorsSelf.Sector1 * 1e3) / 1e3;
		this.bestSectorsSelf.Sector2 =
			Math.round(this.bestSectorsSelf.Sector2 * 1e3) / 1e3;
		this.bestSectorsSelf.Sector3 =
			Math.round(this.bestSectorsSelf.Sector3 * 1e3) / 1e3;

		this.bestSectorsClass.Sector1 =
			Math.round(this.bestSectorsClass.Sector1 * 1e3) / 1e3;
		this.bestSectorsClass.Sector2 =
			Math.round(this.bestSectorsClass.Sector2 * 1e3) / 1e3;
		this.bestSectorsClass.Sector3 =
			Math.round(this.bestSectorsClass.Sector3 * 1e3) / 1e3;

		this.bestSectorsOverall.Sector1 =
			Math.round(this.bestSectorsOverall.Sector1 * 1e3)  / 1e3;
		this.bestSectorsOverall.Sector2 =
			Math.round(this.bestSectorsOverall.Sector2 * 1e3)  / 1e3;
		this.bestSectorsOverall.Sector3 =
			Math.round(this.bestSectorsOverall.Sector3 * 1e3)  / 1e3; */

		if (
			this.currentSectors.Sector1 > 0 &&
			(
				this.bestSectorsOverall.Sector1 < 0 ||
				this.currentSectors.Sector1 <= this.bestSectorsOverall.Sector1
			)
		) {
			this.bestSectorsOverall.Sector1 = this.currentSectors.Sector1;
		}
		if (
			this.currentSectors.Sector2 > 0 &&
			(
				this.bestSectorsOverall.Sector2 < 0 ||
				this.currentSectors.Sector2 <= this.bestSectorsOverall.Sector2
			)
		) {
			this.bestSectorsOverall.Sector2 = this.currentSectors.Sector2;
		}
		if (
			this.currentSectors.Sector3 > 0 &&
			(
				this.bestSectorsOverall.Sector3 < 0 ||
				this.currentSectors.Sector3 <= this.bestSectorsOverall.Sector3
			)
		) {
			this.bestSectorsOverall.Sector3 = this.currentSectors.Sector3;
		}
		if (
			this.currentSectors.Sector1 > 0 &&
			(
				this.bestSectorsClass.Sector1 < 0 ||
				this.currentSectors.Sector1 <= this.bestSectorsClass.Sector1
			)
		) {
			this.bestSectorsClass.Sector1 = this.currentSectors.Sector1;
		}
		if (
			this.currentSectors.Sector2 > 0 &&
			(
				this.bestSectorsClass.Sector2 < 0 ||
				this.currentSectors.Sector2 <= this.bestSectorsClass.Sector2
			)
		) {
			this.bestSectorsClass.Sector2 = this.currentSectors.Sector2;
		}
		if (
			this.currentSectors.Sector3 > 0 &&
			(
				this.bestSectorsClass.Sector3 < 0 ||
				this.currentSectors.Sector3 <= this.bestSectorsClass.Sector3
			)
		) {
			this.bestSectorsClass.Sector3 = this.currentSectors.Sector3;
		}

		this.laptimeStatus = 0;
		if (myLastTime > 0) {
			if (
				(
					myLastTime >
					myBestTime
				) ||
				myBestTime < 0
			) {
				this.laptimeStatus = 1;
			}
			if (
				(
					myLastTime <=
					myBestTime
				) ||
				myBestTime < 0
			) {
				this.laptimeStatus = 2;
			}
			if (
				(
					myLastTime <=
					this.laptimeBestClass
				) ||
				this.laptimeBestClass < 0
			) {
				this.laptimeStatus = 3;
			}
			if (
				(
					myLastTime <=
					this.laptimeBest
				) ||
				this.laptimeBest < 0
			) {
				this.laptimeStatus = 4;
			}
		}
		if (
			myLastTime < 0 ||
			(
				this.lapDistance > 400
			)
		) {
			this.laptimeStatus = 0;
		}

		this.sectorStatus.Sector1 = 0;
		this.sectorStatus.Sector2 = 0;
		this.sectorStatus.Sector3 = 0;
		if (this.currentSectors.Sector1 > 0) {
			if (
				(
					this.currentSectors.Sector1 >
					this.bestSectorsSelf.Sector1
				) ||
				this.bestSectorsSelf.Sector1 < 0
			) {
				this.sectorStatus.Sector1 = 1;
			}
			if (
				(
					this.currentSectors.Sector1 <=
					this.bestSectorsSelf.Sector1
				) ||
				this.bestSectorsSelf.Sector1 < 0
			) {
				this.sectorStatus.Sector1 = 2;
			}
			if (
				(
					this.currentSectors.Sector1 <=
					this.bestSectorsClass.Sector1
				) ||
				this.bestSectorsClass.Sector1 < 0
			) {
				this.sectorStatus.Sector1 = 3;
			}
			if (
				(
					this.currentSectors.Sector1 <=
					this.bestSectorsOverall.Sector1
				) ||
				this.bestSectorsOverall.Sector1 < 0
			) {
				this.sectorStatus.Sector1 = 4;
			}
		}

		if (this.currentSectors.Sector2 > 0) {
			if (
				(
					this.currentSectors.Sector2 >
					this.bestSectorsSelf.Sector2
				) ||
				this.bestSectorsSelf.Sector2 < 0
			) {
				this.sectorStatus.Sector2 = 1;
			}
			if (
				(
					this.currentSectors.Sector2 <=
					this.bestSectorsSelf.Sector2
				) ||
				this.bestSectorsSelf.Sector2 < 0
			) {
				this.sectorStatus.Sector2 = 2;
			}
			if (
				(
					this.currentSectors.Sector2 <=
					this.bestSectorsClass.Sector2
				) ||
				this.bestSectorsClass.Sector2 < 0
			) {
				this.sectorStatus.Sector2 = 3;
			}
			if (
				(
					this.currentSectors.Sector2 <=
					this.bestSectorsOverall.Sector2
				) ||
				this.bestSectorsOverall.Sector2 < 0
			) {
				this.sectorStatus.Sector2 = 4;
			}
		}

		if (this.currentSectors.Sector3 > 0) {
			if (
				(
					this.currentSectors.Sector3 >
					this.bestSectorsSelf.Sector3
				) ||
				this.bestSectorsSelf.Sector3 < 0
			) {
				this.sectorStatus.Sector3 = 1;
			}
			if (
				(
					this.currentSectors.Sector3 <=
					this.bestSectorsSelf.Sector3
				) ||
				this.bestSectorsSelf.Sector3 < 0
			) {
				this.sectorStatus.Sector3 = 2;
			}
			if (
				(
					this.currentSectors.Sector3 <=
					this.bestSectorsClass.Sector3
				) ||
				this.bestSectorsClass.Sector3 < 0
			) {
				this.sectorStatus.Sector3 = 3;
			}
			if (
				(
					this.currentSectors.Sector3 <=
					this.bestSectorsOverall.Sector3
				) ||
				this.bestSectorsOverall.Sector3 < 0
			) {
				this.sectorStatus.Sector3 = 4;
			}
		}

		if (
			this.currentSectors.Sector1 < 0 ||
			(
				this.currentSectors.Sector1 > 0 &&
				this.currentSectors.Sector3 < 0 &&
				r3e.data.TrackSector === 1
			) ||
			(
				this.lapDistance > 400 &&
				r3e.data.TrackSector === 1
			)
		) {
			this.sectorStatus.Sector1 = 0;
		}
		if (
			this.currentSectors.Sector2 < 0 ||
			(
				this.currentSectors.Sector2 > 0 &&
				this.currentSectors.Sector3 < 0 &&
				r3e.data.TrackSector < 3 &&
				r3e.data.TrackSector > 0
			) ||
			(
				this.lapDistance > 400 &&
				r3e.data.TrackSector === 1
			)
		) {
			this.sectorStatus.Sector2 = 0;
		}
		if (
			this.currentSectors.Sector3 < 0 ||
			(
				this.lapDistance > 400 &&
				this.currentSectors.Sector3 > 0
			)
		) {
			this.sectorStatus.Sector3 = 0;
		}
		if (showAllMode) {
			this.sectorStatus.Sector1 = 1;
			this.sectorStatus.Sector2 = 2;
			this.sectorStatus.Sector3 = 4;
			this.currentSectors.Sector1 = 33.123;
			this.currentSectors.Sector2 = 34.234;
			this.currentSectors.Sector3 = 35.345;
		}
	}

	@action
	private updateRace() {
		this.lastSessionType = r3e.data.SessionType;
		this.lapDistanceFraction = this.lapDistanceFraction;
		this.currentDifference = this.getClassTimeDeltaInfront();
		this.updateDifferences();
	}

	@action
	private updatePracticeQualify() {
		this.sectorTimesBestSelf = r3e.data.SectorTimesBestSelf;
		if (showAllMode) {
			this.sectorTimesBestSelf.Sector3 = 123.234;
		}
		this.lapTimeCurrentSelf = showAllMode
			?	111.111
			:	r3e.data.LapTimeCurrentSelf;

		const shouldReset =
			this.lastSessionType !== null &&
			this.lastSessionType !== r3e.data.SessionType;

		if (
			shouldReset ||
			this.lapDistanceFraction - this.lapDistanceFraction > 0.5
		) {
			this.differences.length = 0;
		}

		if (this.lapTimeCurrentSelf === INVALID) {
			this.lapDistanceFraction = this.lapDistanceFraction;
			return;
		}

		this.lastSessionType = r3e.data.SessionType;
		this.lapDistanceFraction = this.lapDistanceFraction;

		if (
			this.sectorTimesBestSelf.Sector3 === INVALID ||
			this.timeDeltaBestSelf === -1000
		) {
			return;
		}

		this.currentDifference = showAllMode
			?	-3.123
			:	this.timeDeltaBestSelf;

		// Estimated position
		this.estimatedLaptime = showAllMode
			?	1342
			:	this.lapTimeBestSelf + (this.currentDifference || 0);

		let estimatedPosition = 1;
		this.estimatedDeltaNext = 1;
		const driverLength = r3e.data.DriverData.length;
		for (let i = 0; i < driverLength; i++) {
			const driver = r3e.data.DriverData[i];
			const isSameClass =
				driver.DriverInfo.ClassPerformanceIndex ===
				r3e.data.VehicleInfo.ClassPerformanceIndex;

			if (!isSameClass) {
				continue;
			}

			if (
				driver.SectorTimeBestSelf.Sector3 > this.estimatedLaptime ||
				driver.PlaceClass >= r3e.data.PositionClass
			) {
				break;
			}
			this.estimatedDeltaNext = Math.min(
				1,
				this.estimatedLaptime - driver.SectorTimeBestSelf.Sector3
			);
			estimatedPosition = driver.PlaceClass + 1;
		}
		this.estimatedPosition = showAllMode
			?	3
			:	estimatedPosition;
		this.estimatedDeltaNext = showAllMode
			?	0.99
			:	this.estimatedDeltaNext;

		this.updateDifferences();
	}

	getBarWidth = (direction: number) => {
		// this.currentDifference
		const proc = Math.min(
			(this.isImproving / this.maxImprovingValue) * direction * 50,
			50
		);
		return `${showAllMode
			?	90
			:	proc}%`;
	};

	render() {
		if (
			(
				this.sessionType === 2 &&
				this.sessionPhase === 1
			) ||
			(
				r3e.data.GameInReplay  && !showAllMode
			)
		) { return null; }
		const inPits = this.pitState >= EPitState.Entered;
		const hideInRace =
			this.props.settings.subSettings.hideInRace.enabled &&
			this.sessionType === ESession.Race &&
			!showAllMode;
		const showTimes = this.props.settings.subSettings.sectorsAsTime.enabled;
		const firstRoundInRace =
			this.sessionType === ESession.Race &&
			this.completedLaps === 0 &&
			!showAllMode;
		const firstRoundInQualy =
			this.sessionType !== ESession.Race &&
			this.lapTimeBestSelf < 0 &&
			!showAllMode;
		const showDelta =
			showAllMode ||
			(
				this.sessionType !== ESession.Race &&
				!firstRoundInQualy
			) ||
			(
				this.sessionType === ESession.Race &&
				this.timeDeltaBestSelf !== -1000 &&
				(
					!firstRoundInRace ||
					!this.isLeading
				)
			);

		if ((inPits || hideInRace) && !showAllMode) {
			return null;
		}

		if (this.startLights < 6 && !showAllMode) {
			return null;
		}

		if (
			this.playerIsFocus &&
			this.currentDifference === INVALID &&
			!firstRoundInRace &&
			!firstRoundInQualy &&
			!showAllMode
		) {
			return null;
		}
		const purple = 'rgb(150, 60, 150)';
		const green = 'rgb(16, 170, 62)';
		const gray = 'rgb(102, 102, 102)';

		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('progress', this.props.className, {
					shouldShow:
						this.lapTimeCurrentSelf !== INVALID ||
						this.sessionType === ESession.Race ||
						showAllMode,
					race: showAllMode
						?	false
						:	this.sessionType === ESession.Race,
					qualify: showAllMode
						?	true
						:	this.sessionType !== ESession.Race,
					loosing: !showAllMode && this.isImproving < -0.001,
					gaining: showAllMode || this.isImproving > 0.001,
					overallLoosing:
						!showAllMode && this.currentDifference > 0 && this.playerIsFocus,
					overallGaining:
						showAllMode || this.currentDifference < 0 && this.playerIsFocus,
					showAsTime: this.props.settings.subSettings.sectorsAsTime.enabled ||
						!this.playerIsFocus,
					lastValid: showAllMode || this.lapTimePreviousSelf > 0,
					pbl:
						this.lapTimePreviousSelf <=
						this.lapTimeBestSelf,
					cbl:
						this.lapTimePreviousSelf <=
						this.lapTimeBestLeaderClass,
					gbl:
						showAllMode ||
						this.lapTimePreviousSelf <=
						this.lapTimeBestLeader,
					estims:
						this.sessionType === ESession.Race &&
						!showAllMode
						?	false
						:	this.props.settings.subSettings.estimatedLapTime.enabled &&
							(showAllMode || this.playerIsFocus),
					deltaTextOn: this.props.settings.subSettings.deltaText.enabled &&
						(this.playerIsFocus || showAllMode),
					notDelta: !this.showDeltaOnLaptime
				})}
			>

			
			<div className="estimateContainer">
				<div className="estimate ">
					{
						this.props.settings.subSettings.deltaText.enabled &&
						(showAllMode || this.playerIsFocus) &&
						showDelta
							?	(
									(
										(
											!this.gotLapped ||
											(
												this.showDeltaOnLaptime &&
												this.timeDeltaBestSelf !== -1000
											)
										) && (
											<span className="mono">
												{
													showAllMode
													?	`-1.234`
													:	formatTime(
															this.sessionType !== ESession.Race ||
															this.showDeltaOnLaptime
																?	this.currentDifference
																:	-this.currentDifference,
															this.currentDifference >= 60 ||
															this.currentDifference <= -60
																?	'm:ss.SSS'
																:	's.SSS',
															true
														)
												}
											</span>
										)
									) ||
									(
										this.gotLapped &&
										!this.showDeltaOnLaptime && (
											<span className="mono">
												{'+'}{this.lappedAmount}{' '}
												{
													this.lappedAmount > 1
														?	_('Laps')
														:	_('Lap')
												}
											</span>
										)
									)
								)
							: null
					}
					{
						this.sessionType !== ESession.Race &&
						!firstRoundInQualy &&
						this.props.settings.subSettings.deltaNextPosition.enabled &&
						(showAllMode || (!this.isLeaderboard && !this.isHillClimb && this.playerIsFocus)) &&
						showDelta &&
						(
							<div className="deltaNextContainer">
								<div
									className="deltaNext"
									style={{
										width: `${showAllMode
											?	23
											:	(1 -
											this.estimatedDeltaNext) *
											100}%`
									}}
								/>
							</div>
						)
					}
					{
						this.sessionType !== ESession.Race &&
						!firstRoundInQualy &&
						(showAllMode || this.playerIsFocus) &&
						showDelta &&
						(
							<div className="qualifyInfo">
								{
									this.props.settings.subSettings.estimatedLapTime.enabled &&
									(
										<div className="esimatedLapTime">
											{_('Est. Time')}:{' '}
											<span
												className={classNames('Estmono')}
											>
											{
												showAllMode
												?	`1:46.789`
												:	formatTime(
														this.estimatedLaptime,
														'm:ss.SSS'
													)
											}
											</span>
										</div>
									)
								}
								{
									this.props.settings.subSettings.estimatedPosition.enabled &&
									((!this.isLeaderboard && !this.isHillClimb) || showAllMode) &&
									(
										<div className="esimatedPosition">
											{_('Est. Pos')}:{' '}
											<span className="mono">
												{
													showAllMode
													?	`3`
													:	this.estimatedPosition
												}
											</span>
										</div>
									)
								}
							</div>
						)
					}
				</div>

				{
					this.props.settings.subSettings.lastLap.enabled &&
					(
						(
							(
								firstRoundInQualy ||
								firstRoundInRace
							) &&
							this.lapTimePreviousSelf > 0
						) ||
						(
							!firstRoundInQualy &&
							!firstRoundInRace
						) ||
						showAllMode
					) && (
						<div className="lastLapContainer">
							{
								(this.laptimeStatus !== 0 || showAllMode) && (
									<div className={classNames('laps')}>
										<div className="lapLabel">
											<span className="mono">
												{_('Last Lap')}:{' '}
											</span>
										</div>
										<div
											className={classNames('lastLap', {
												isGerman: localStorage.language === 'de',
												isFrench: localStorage.language === 'fr',
												isPortuguese: localStorage.language === 'pt',
												isSpanish: localStorage.language === 'es',
												isItalian: localStorage.language === 'it',
												isPolish: localStorage.language === 'pl'
											})}
											style={{
												color: (showAllMode || this.laptimeStatus) === 4
													?	'fuchsia'
													:	this.laptimeStatus === 3
															?	getClassColor(this.classPerformanceIndex)
															:	this.laptimeStatus === 2
																	?	'lime'
																	:	'white'
											}}
										>
											<span className="mono">
											{
												showAllMode
												?	`1:48.023`
												:	this.lapTimePreviousSelf > 60
													?	formatTime(Math.max(0, this.lapTimePreviousSelf), 'm:ss.SSS')
													:	formatTime(Math.max(0, this.lapTimePreviousSelf), 'ss.SSS')
											}
											</span>
										</div>
									</div>
								)
							}
						</div>
					)
				}
				{
					this.props.settings.subSettings.deltaBars.enabled &&
					showDelta &&
					(showAllMode || this.playerIsFocus) &&
					!this.gotLapped &&
					(
						<div className={classNames('simple')}>
							<div
								className="bad"
								style={{
									width:
										this.isImproving < 0
										? this.getBarWidth(-1)
										: 0
								}}
							/>
							<div
								className="good"
								style={{
									width:
										showAllMode
										?	80
										:	this.isImproving > 0
											? this.getBarWidth(1)
											: 0
								}}
							/>
						</div>
					)
				}
				{
					(
						(
							(
								(
									firstRoundInQualy ||
									firstRoundInRace
								) &&
								this.lapTimeCurrentSelf > 0 &&
								this.currentSectors.Sector1 > 0
							) ||
							!firstRoundInQualy &&
							!firstRoundInRace
						) ||
						showAllMode
					) && (
						<div className="sectors">
							{
								this.sectorStatus.Sector1 !== 0 && (
									<div
										className={classNames('sector', {
											pb:			this.sectorStatus.Sector1 === 2,
											cb: 		this.sectorStatus.Sector1 === 3,
											gb: 		this.sectorStatus.Sector1 === 4
										})}
										style={{
											background: this.sectorStatus.Sector1 === 4
												?	purple
												:	this.sectorStatus.Sector1 === 3
														?	getClassColor(this.classPerformanceIndex)
														:	this.sectorStatus.Sector1 === 2
																?	green
																:	this.sectorStatus.Sector1 === 1
																		?	gray
																		:	'transparent'
										}}
									> {
										showTimes
											?	'S1: '
												+ fancyTimeFormatGap(this.currentSectors.Sector1, 1, 0)
											: ''
									}
									</div>
								)
							}
							{
								this.sectorStatus.Sector2 !== 0 && (
									<div
										className={classNames('sector', {
											pb:			this.sectorStatus.Sector2 === 2,
											cb: 		this.sectorStatus.Sector2 === 3,
											gb: 		this.sectorStatus.Sector2 === 4
										})}
										style={{
											background: this.sectorStatus.Sector2 === 4
												?	purple
												:	this.sectorStatus.Sector2 === 3
														?	getClassColor(this.classPerformanceIndex)
														:	this.sectorStatus.Sector2 === 2
																?	green
																:	this.sectorStatus.Sector2 === 1
																		?	gray
																		:	'transparent'
										}}
									> {
										showTimes
											?	'S2: '
												+ fancyTimeFormatGap(this.currentSectors.Sector2, 1, 0)
											: ''
									}
									</div>
								)
							}
							{
								this.sectorStatus.Sector3 !== 0 && (
									<div
										className={classNames('sector', {
											pb:			this.sectorStatus.Sector3 === 2,
											cb: 		this.sectorStatus.Sector3 === 3,
											gb: 		this.sectorStatus.Sector3 === 4
										})}
										style={{
											background:
												this.sectorStatus.Sector3 === 4
													?	purple
													:	this.sectorStatus.Sector3 === 3
															?	getClassColor(this.classPerformanceIndex)
															:	this.sectorStatus.Sector3 === 2
																	?	green
																	:	this.sectorStatus.Sector3 === 1
																			?	gray
																			:	'transparent'
										}}
									> {
										showTimes
											?	'S3: '
												+ fancyTimeFormatGap(this.currentSectors.Sector3, 1, 0)
											: ''
									}
									</div>
								)
							}
						</div>
					)
				}
			</div>

			</div>
		);
	}
}
