import {
	classNames,
	base64ToString,
	ePlayerIsFocus,
	eCurrentSlotId,
	fancyTimeFormatGap,
	formatTime,
	getInitials,
	getRankingData,
	getTimeUntilPit,
	isRange,
	// rankData,
	// showDebugMessage,
	// showDebugMessageSmall,
	widgetSettings,
	IRatingData,
	INVALID,
	getClassColor
} from './../../lib/utils';
import {
	ESession,
	IDriverData
} from './../../types/r3eTypes';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode,
	eDriverNum,
	eDriverPitInfo,
	eDriverDiffs,
	eIsLeaderboard,
	eIsHillClimb,
	eRankInvertRelative,
	IDriverDiffs,
	IDriverPitInfo,
	eDriverLapInfo,
	IDriverLapInfo
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { personalBestTime, eRoundsLeft } from '../fuelDetail/fuelDetail';
import { times, uniq } from 'lodash-es';
// import * as _lodash from 'lodash-es';
import _ from './../../translate';
import getCarName from './../../lib/carData';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './positionBar.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	relative: boolean;
	settings: IWidgetSetting;
}
interface IDriverInfo {
	isUser: boolean;
	id: number;
	modelId: number;
	name: string;
	shortName: string;
	position: number;
	positionClass: number;
	meta?: IDriverData;
	diff: string | number;
	lapDiff: number;
	classColor: string;
	carPerformance: number;
	inPit: number;
	pitting: number;
	mandatoryPit: number;
	numStops: number;
	validLap: number;
	currentTime: number;
	gapToPlayer: number;
	finishStatus: number;
	userId: number;
	lapDistance: number;
	logoUrl: string;
	classUrl: string;
	bestLapTime: number;
	lapsDone: number;
	rankingData: IRatingData;
	aheadOrBehind: { isAhead: boolean; isBehind: boolean; wasAhead: boolean; wasBehind: boolean };
}
@observer
export default class PositionBar extends React.Component<IProps, {}> {
	@observable accessor vrGame = false;

	@observable accessor drivers: IDriverInfo[] = [];

	@observable accessor currentLap = INVALID;

	@observable accessor lapInfoData: IDriverLapInfo = [];

	@observable accessor maxLaps = INVALID;

	@observable accessor pitState = INVALID;

	@observable accessor sessionPhase = INVALID;

	@observable accessor sessionTimeRemaining = INVALID;

	@observable accessor classDriverCount = INVALID;

	@observable accessor positionClass = INVALID;

	@observable accessor position = INVALID;

	@observable accessor sessionType = INVALID;

	@observable accessor multiClass = false;

	@observable accessor lapTimeCurrentSelf = INVALID;

	@observable accessor lapTimePreviousSelf = -1;

	@observable accessor lapTimeBestSelf = -1;

	@observable accessor bestSelfSector3 = -1;

	@observable accessor playerCount = INVALID;

	@observable accessor playersAhead = INVALID;

	@observable accessor playersBehind = INVALID;

	@observable accessor maxIncidentPoints = -1;

	@observable accessor myIncidentPoints = -1;

	@observable accessor lastCheck = 0;

	@observable accessor actualRoundsLeft = -1;

	@observable accessor notInRacePhase = true;

	@observable accessor playerPosition = INVALID;

	@observable accessor positionBarCount = 15;

	@observable accessor entryWidth = 148;

	@observable accessor classColorUpdate: any;

	@observable accessor singleplayerRace = false;

	@observable accessor completedLaps = -1;

	@observable accessor sessionTimeDuration = -1;

	@observable accessor layoutLength = -1;

	@observable accessor lapDistance = -1;

	@observable accessor pitWindowStatus = -1;

	@observable accessor logoUrlp1 = 'https://game.raceroom.com/store/image_redirect?id=';

	@observable accessor logoUrlp2 = '&size=small';

	@observable accessor playerIsFocus = false;

	@observable accessor currentSlotId = -1;

	@observable accessor isLeaderboard = false;

	@observable accessor isHillClimb = false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

		this.forceClassColorUpdate();
		this.classColorUpdate = setInterval(
			this.forceClassColorUpdate,
			10 * 1000
		);
	}
	componentWillUnmount() {
		clearInterval(this.classColorUpdate);
		unregisterUpdate(this.update);
	}

	private sortByLapDistance = (a: IDriverInfo, b: IDriverInfo) => {
		return b.gapToPlayer - a.gapToPlayer ||
			(
				a.lapDistance === b.lapDistance &&
				(a.isUser || b.isUser) &&
				(
					(a.aheadOrBehind.wasAhead === b.aheadOrBehind.wasAhead ? 0 : a.aheadOrBehind.wasAhead ? -1 : 1) ||
					(b.aheadOrBehind.wasBehind === a.aheadOrBehind.wasBehind ? 0 : b.aheadOrBehind.wasBehind ? -1 : 1)
				)
			) ||
			a.position - b.position;
	};

	private sortByPerformance = (a: IDriverInfo, b: IDriverInfo) => {
		return b.carPerformance - a.carPerformance;
	};

	@action
	private update = () => {
		this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
		if (
			(
				highPerformanceMode &&
				nowCheck - this.lastCheck >= 33
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
			this.lapDistance = r3e.data.LapDistance;
			this.completedLaps = r3e.data.CompletedLaps;
			this.sessionPhase = r3e.data.SessionPhase;
			this.currentLap = this.completedLaps + 1;
			this.maxLaps = r3e.data.NumberOfLaps;

			this.position = r3e.data.Position;
			this.positionClass = r3e.data.PositionClass;
			this.sessionType = r3e.data.SessionType;
			this.actualRoundsLeft = eRoundsLeft;
			this.lapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
			this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
			this.bestSelfSector3 = r3e.data.SectorTimesBestSelf.Sector3;
			this.layoutLength = r3e.data.LayoutLength;
			this.isLeaderboard = eIsLeaderboard;
			this.isHillClimb = eIsHillClimb;
			this.sessionTimeRemaining = showAllMode ? 1 : r3e.data.SessionTimeRemaining;
			if (!this.props.relative) {
				this.vrGame = this.props.settings.subSettings.shortBar.enabled;
			}
			this.lastCheck = nowCheck;
			this.playerIsFocus = ePlayerIsFocus;
			this.currentSlotId = eCurrentSlotId;
			this.lapInfoData = eDriverLapInfo;
			this.sessionTimeDuration = r3e.data.SessionTimeDuration;
			this.notInRacePhase =
				(
					this.sessionPhase < 4 &&
					r3e.data.CarSpeed < 5
				) ||
				this.sessionPhase < 3;
			this.pitState = r3e.data.PitState;
			this.pitWindowStatus = r3e.data.PitWindowStatus;
			this.maxIncidentPoints = r3e.data.MaxIncidentPoints !== undefined
				? r3e.data.MaxIncidentPoints
				: -1;
			this.myIncidentPoints = r3e.data.IncidentPoints !== undefined
				? r3e.data.IncidentPoints
				: -1;

			/* if (this.props.relative &&
				this.props.settings.subSettings.showClassAndCounts.enabled) {
				let allDrivers = r3e.data.DriverData.map(this.formatDriverData);
				allDrivers = allDrivers.sort(this.sortByPerformance);
				this.classesAndCount = [ [], [], [] ];
				let count = allDrivers.reduce((drivers, i) => drivers + (i === 'a'), 0);
			} */

			this.classDriverCount = 0;
			this.playersAhead = 0;
			this.playersBehind = 0;
			this.playerCount = r3e.data.DriverData.length;
			this.multiClass = false;
			this.singleplayerRace = false;

			let driverData = this.props.relative
				? this.props.settings.subSettings.showAllSessions.enabled
					? r3e.data.DriverData.map(
						this.formatDriverData
					).filter(
						this.filterDriverDataQualy
					)
					: r3e.data.DriverData.map(
						this.formatDriverData
					).filter(
						this.filterDriverData
					)
				: r3e.data.DriverData.map(
					this.formatDriverData
				).filter(
					this.filterDriverData
				);

			// Deal with filtering and ordering relative positions
			if (this.props.relative) {
				if (this.props.settings.subSettings.showAllSessions.enabled) {
					driverData = r3e.data.DriverData.map(this.formatDriverData).filter(
						this.filterDriverDataQualy
					);
				}
				/* showDebugMessageSmall(
					`${driverData[2].gapToPlayer} - ${driverData[2].id} - ${driverData[2].name} - ${driverData[2].aheadOrBehind.isAhead} - ${driverData[2].aheadOrBehind.isBehind} - ${driverData[2].aheadOrBehind.wasAhead} - ${driverData[2].aheadOrBehind.wasBehind}`
				);

				showDebugMessage(
					`${driverData[3].gapToPlayer} - ${driverData[3].id} - ${driverData[3].name} - ${driverData[3].aheadOrBehind.isAhead} - ${driverData[3].aheadOrBehind.isBehind} - ${driverData[3].aheadOrBehind.wasAhead} - ${driverData[3].aheadOrBehind.wasBehind}`
				); */

				driverData = driverData.sort(this.sortByLapDistance);

				const playerIndex = this.getPlayerPosition(driverData);

				// Start based on user with offset so it can wrap around
				// const start = Math.max(playerIndex, 0) + driverData.length;
				// const start = driverData.length;

				// Make sure these are unique otherwise it will "loop" with few opponents
				const dataLength = driverData.length;
				const aheadCount = dataLength - (dataLength - playerIndex);
				const start = aheadCount >= eDriverNum
					? playerIndex - eDriverNum
					: playerIndex - aheadCount;
				const end = aheadCount >= eDriverNum
					? playerIndex + (eDriverNum + 1)
					: playerIndex + (((eDriverNum * 2) + 1) - aheadCount);

				driverData = uniq(
					driverData
						.slice(start, end)
				);
				/*driverData = uniq(
					driverData
						.concat(driverData, driverData)
						.slice(4, 11)
				);*/
			}

			this.calculateDiffs(driverData);

			let driverDataAhead = driverData.slice().reverse();
			let driverDataBehind = driverData.slice().reverse();

			if (this.props.relative) {
				const playerPosition = this.getPlayerPosition(driverDataAhead);
				driverDataAhead = driverDataAhead.slice(
					playerPosition + 1, playerPosition + (eDriverNum + 1)
				);
				driverDataBehind = driverDataBehind.slice(
					Math.max(0, playerPosition - eDriverNum),
					playerPosition
				);
				driverDataBehind.reverse();
			}

			if (!this.props.relative) {
				const playerPosition = this.getPlayerPosition(driverData);

				driverData = this.vrGame
					? driverData.slice(
						Math.max(playerPosition - 5, 0),
						playerPosition + 6
					)
					: driverData.slice(
						Math.max(playerPosition - 6, 0),
						playerPosition + 7
					);
			}

			this.drivers = driverData.map((driver) => {
				delete driver.meta;
				return driver;
			});
		}
	};

	private wasAheadOrBehind = (driverData: IDriverInfo[], searchId: number) => {
		if (searchId === this.currentSlotId) { return 0; }
		for (let i = 0; i < driverData.length; i++) {
			if (driverData[i].id === searchId) {
				if (driverData[i].aheadOrBehind.wasAhead) { return 1; }
				if (driverData[i].aheadOrBehind.wasBehind) { return -1; }
			}
			return 0;
		}
		return 0;
	}
	private getAheadOrBehind = (driverData: IDriverInfo[], searchId: number, lapDist: number) => {
		let iAhead = false;
		let iBehind = false;
		let wAhead = false;
		let wBehind = false;
		const playersDist = 0;
		for (let i = 0; i < driverData.length; i++) {
			if (driverData[i].id === searchId) {
				const driver = driverData[i];
				if (lapDist > playersDist) { // || place < r3e.data.Position) {
					iAhead = true;
					iBehind = false;
					wAhead = true;
					wBehind = false;
				} else if (lapDist < playersDist) { // || place > r3e.data.Position) {
					iAhead = false;
					iBehind = true;
					wAhead = false;
					wBehind = true;
				} else if (lapDist === playersDist && driver.aheadOrBehind.wasAhead) { // || place < r3e.data.Position) {
					iAhead = true;
					iBehind = false;
					wAhead = true;
					wBehind = false;
				} else if (lapDist === playersDist && driver.aheadOrBehind.wasBehind) { // || place > r3e.data.Position) {
					iAhead = false;
					iBehind = true;
					wAhead = false;
					wBehind = true;
				}
				break;
			}
		}
		return { isAhead: iAhead, isBehind: iBehind, wasAhead: wAhead, wasBehind: wBehind };
	}

	private getPlayerPosition = (driverData: IDriverInfo[]) => {
		let userPosition = 0;
		driverData.forEach((driver, i) => {
			if (driver.id === this.currentSlotId) {
				userPosition = i;
			}
		});

		return userPosition;
	};

	private filterDriverDataQualy = (driver: IDriverInfo) => {
		const isRaceSession = this.sessionType === ESession.Race;
		if (
			!isRaceSession &&
			driver.meta &&
			driver.meta.InPitlane === 1 &&
			!driver.isUser
		) {
			return false;
		}
		if (
			isRaceSession && driver.finishStatus > 1
		) {
			return false;
		}
		return true;
	};

	private filterDriverData = (driver: IDriverInfo) => {
		const isRaceSession = this.sessionType === ESession.Race;
		if (
			!isRaceSession &&
			driver.meta &&
			driver.meta.SectorTimeBestSelf.Sector3 === INVALID &&
			!driver.isUser
		) {
			return false;
		}
		return true;
	};

	private formatDriverData = (driver: IDriverData): IDriverInfo => {
		const isUser =
			this.currentSlotId === driver.DriverInfo.SlotId;
		if (
			driver.DriverInfo.ClassPerformanceIndex ===
			r3e.data.VehicleInfo.ClassPerformanceIndex
		) {
			this.classDriverCount += 1;
		} else {
			this.multiClass = true;
		}

		if (driver.DriverInfo.UserId === -1) { this.singleplayerRace = true; }

		const decName = (!isUser && (this.isLeaderboard || this.isHillClimb)) ? 'Ghost-Car' : base64ToString(driver.DriverInfo.Name);
		const aheadOrBehind = isUser ? 0 : driver.LapDistance === this.lapDistance ? this.wasAheadOrBehind(this.drivers, driver.DriverInfo.SlotId) : 0;
		const dLapDistance = aheadOrBehind === 1 ? (driver.LapDistance + 0.001) : aheadOrBehind === -1 ? (driver.LapDistance - 0.001) : driver.LapDistance;
		const gapPlayer = isUser ? 0 : this.getGapToPlayer(dLapDistance);
		const driverData = {
			isUser,
			id: driver.DriverInfo.SlotId,
			modelId: driver.DriverInfo.ModelId,
			name: decName,
			shortName: getInitials(decName),
			position: driver.Place,
			positionClass: driver.PlaceClass,
			meta: driver,
			diff: isUser ? this.getPlayerPositionText() : '',
			lapDiff: driver.CompletedLaps - this.completedLaps,
			classColor: this.multiClass
				? getClassColor(driver.DriverInfo.ClassPerformanceIndex)
				: 'rgba(0, 0, 0, 0)',
			carPerformance: driver.DriverInfo.ClassPerformanceIndex,
			inPit: driver.InPitlane,
			pitting: driver.InPitlane,
			mandatoryPit: driver.PitStopStatus,
			numStops: driver.NumPitstops,
			validLap: driver.CurrentLapValid,
			currentTime: driver.LapTimeCurrentSelf,
			gapToPlayer: gapPlayer,
			finishStatus: driver.FinishStatus,
			userId: driver.DriverInfo.UserId,
			lapDistance: dLapDistance,
			logoUrl: driver.DriverInfo.ManufacturerId > 0
				? this.logoUrlp1 +
				driver.DriverInfo.ManufacturerId.toString() +
				this.logoUrlp2
				: `${this.logoUrlp1
				}4596${this.logoUrlp2
				}`,
			classUrl: driver.DriverInfo.ClassId > 0
				? this.logoUrlp1 +
				driver.DriverInfo.ClassId.toString() +
				this.logoUrlp2
				: `${this.logoUrlp1
				}1717${this.logoUrlp2
				}`,
			bestLapTime: driver.SectorTimeBestSelf.Sector3,
			lapsDone: driver.CompletedLaps,
			rankingData: getRankingData(driver.DriverInfo.UserId),
			aheadOrBehind: isUser
				? { isAhead: false, isBehind: false, wasAhead: false, wasBehind: false }
				: this.getAheadOrBehind(this.drivers, driver.DriverInfo.SlotId, gapPlayer)
		};
		return driverData;
	};

	private forceClassColorUpdate() {
		r3e.data.DriverData.forEach((driver) => {
			getClassColor(driver.DriverInfo.ClassPerformanceIndex);
		});
	}

	private calculateDiffs(drivers: IDriverInfo[]) {
		const isRace = this.sessionType === ESession.Race;

		isRace
			? this.props.relative
				? this.calculateDiffsRaceRelative(drivers)
				: this.calculateDiffsRace(drivers)
			: this.props.relative
				&& this.props.settings.subSettings.showAllSessions.enabled
				? this.calculateDiffsRaceRelative(drivers)
				: this.calculateDiffsQualify(drivers);
	}

	private calculateDiffsQualify(drivers: IDriverInfo[]) {
		const userBestSector =
			this.bestSelfSector3 !== INVALID
				? this.bestSelfSector3
				: 0;

		drivers.forEach((driver, i) => {
			if (driver.isUser) {
				this.playerPosition = i + 1;
				return;
			}
			const diff =
				driver.meta ? driver.meta.SectorTimeBestSelf.Sector3 - userBestSector : 0;
			driver.diff =
				diff > 60
					? formatTime(diff, 'm:ss.SSS', true)
					: formatTime(diff, 's.SSS', true);
		});
	}

	private calculateDiffsRace(drivers: IDriverInfo[]) {
		const driversInfront = drivers.slice(0, this.position - 1);
		// let infrontDiff = 0;
		driversInfront.reverse().forEach((driver) => {
			let gotLapped = false;
			if (
				driver.lapDiff === 1 &&
				driver.lapDistance > this.lapDistance
			) {
				gotLapped = true;
				driver.diff = `-${Math.abs(driver.lapDiff)} ${_(
					'lap'
				)}`;
			}
			if (
				driver.lapDiff > 1
			) {
				gotLapped = true;
				if (
					driver.lapDistance > this.lapDistance
				) {
					driver.diff = `-${Math.abs(driver.lapDiff)} ${_(
						'laps'
					)}`;
				} else {
					const theLapDiff = driver.lapDiff - 1;
					driver.diff = theLapDiff > 1
						? (driver.diff = `-${Math.abs(theLapDiff)} ${_(
							'laps'
						)}`)
						: (driver.diff = `-${Math.abs(theLapDiff)} ${_(
							'lap'
						)}`);
				}
			}

			if (!gotLapped) {
				driver.diff =
					eDriverDiffs[driver.id] !== undefined
						? eDriverDiffs[driver.id][1][0] > 60
							? formatTime(eDriverDiffs[driver.id][1][0] * -1, 'm:ss.SSS')
							: formatTime(eDriverDiffs[driver.id][1][0] * -1, 's.SSS')
						: '-';
			}
		});

		const driversAfter = drivers.slice(
			this.position,
			r3e.data.DriverData.length
		);
		let afterDiff = 0;
		driversAfter.forEach((driver) => {
			afterDiff += driver.meta ? driver.meta.TimeDeltaFront : 0;
			let gotLapped = false;
			if (
				driver.lapDiff === -1 &&
				driver.lapDistance < this.lapDistance
			) {
				gotLapped = true;
				driver.diff = `+${Math.abs(driver.lapDiff)} ${_(
					'lap'
				)}`;
			}
			if (
				driver.lapDiff < -1
			) {
				gotLapped = true;
				if (
					driver.lapDistance < this.lapDistance
				) {
					driver.diff = `+${Math.abs(driver.lapDiff)} ${_(
						'laps'
					)}`;
				} else {
					const theLapDiff = driver.lapDiff + 1;
					driver.diff = theLapDiff < -1
						? `+${Math.abs(theLapDiff)} ${_(
							'laps'
						)}`
						: `+${Math.abs(theLapDiff)} ${_(
							'lap'
						)}`;
				}
			}
			if (!gotLapped) {
				driver.diff =
					afterDiff > 60
						? formatTime(afterDiff, 'm:ss.SSS')
						: formatTime(afterDiff, 's.SSS');
			}
		});
		this.playerPosition = this.position;
	}

	private calculateDiffsRaceRelative(drivers: IDriverInfo[]) {
		const userLapDistance = this.lapDistance;
		drivers.forEach((driver) => {
			if (driver.isUser) {
				driver.diff = '';
				return;
			}

			let diff = driver.meta ? userLapDistance - driver.meta.LapDistance : 0;
			if (diff < -(this.layoutLength / 2)) {
				diff = diff + this.layoutLength;
			}
			if (diff > (this.layoutLength / 2)) {
				diff = diff - this.layoutLength;
			}
			diff = diff;
			if (diff < 0) {
				this.playersAhead += 1;
			}
			if (diff > 0) {
				this.playersBehind += 1;
			}

			const bestLapSelf =
				personalBestTime > -1
					? personalBestTime
					: this.lapTimeBestSelf > -1
						? this.lapTimeBestSelf
						: 0;

			const bestLapClass =
				r3e.data.LapTimeBestLeaderClass > -1
					? r3e.data.LapTimeBestLeaderClass
					: 0;

			const bestLapLeader =
				r3e.data.LapTimeBestLeader > -1
					? r3e.data.LapTimeBestLeader
					: 0;

			const bestLapOpponent =
				driver.meta &&
					driver.meta.SectorTimeBestSelf.Sector3 > 0
					? driver.meta.SectorTimeBestSelf.Sector3
					: 0;

			const avgLapSpeed =
				bestLapSelf > 0
					? this.layoutLength / bestLapSelf
					: bestLapClass > 0
						? this.layoutLength / bestLapClass
						: bestLapLeader > 0
							? this.layoutLength / bestLapLeader
							: 100;

			const avgLapSpeedOpponent =
				bestLapOpponent > 0
					? this.layoutLength / bestLapOpponent
					: driver.meta &&
						driver.meta.DriverInfo.ClassPerformanceIndex ===
						r3e.data.VehicleInfo.ClassPerformanceIndex &&
						bestLapClass > 0
						? this.layoutLength / bestLapClass
						: bestLapLeader > 0
							? this.layoutLength / bestLapLeader
							: avgLapSpeed;

			const avgSpeed =
				(
					avgLapSpeed + avgLapSpeedOpponent
				) / 2;

			const timeDiff = fancyTimeFormatGap((diff / avgSpeed), 1, 1);
			/* const timeDiff = r3e.data.CarSpeed.toString().indexOf('E') > -1
				? 0
				: r3e.data.CarSpeed;*/

			const prefix = diff > 0 ? '+' : '';
			driver.diff = this.props.settings.subSettings.showGapsInSeconds.enabled
				? `${prefix}${timeDiff}`
				: `${prefix}${diff.toFixed(0)}m`;
		});
	}

	private getGapToPlayer(lapDist: number): number {
		if (lapDist === -1) {
			return 0;
		}
		const trackDist = this.layoutLength;
		const playerDist = this.lapDistance;
		let distToPlayer = playerDist - lapDist;

		if (distToPlayer < -(trackDist / 2)) {
			distToPlayer = distToPlayer + trackDist;
		}
		if (distToPlayer > (trackDist / 2)) {
			distToPlayer = distToPlayer - trackDist;
		}
		return (distToPlayer * -1);
	}

	private getStrengthOfField() {
		let sumUp = 0;
		let count = 0;
		this.drivers.forEach((driver) => {
			sumUp += driver.rankingData.Rating;
			count += 1;
		});
		return `${((sumUp / count) / 1000).toFixed(2)
			}K`;
	}

	private getPlayerPositionText(): string {
		const isntRace = this.sessionType !== ESession.Race;
		if (isntRace) {
			const bestTime = this.bestSelfSector3;
			return bestTime !== INVALID
				? bestTime > 60
					? formatTime(Math.max(0, bestTime), 'm:ss.SSS')
					: formatTime(Math.max(0, bestTime), 's.SSS')
				: '-';
		}

		return this.lapTimeCurrentSelf !== INVALID
			? this.lapTimeCurrentSelf > 60
				? formatTime(Math.max(0, this.lapTimeCurrentSelf), 'm:ss.SSS')
				: formatTime(Math.max(0, this.lapTimeCurrentSelf), 's.SSS')
			: '-';
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			this.playerCount === 1 &&
			this.props.relative &&
			!showAllMode
		) {
			return null;
		}

		/*const willOverlapPitMenu =
			this.props.relative && this.pitState === EPitState.Pitting;
		if (willOverlapPitMenu && !showAllMode) {
			return null;
		}*/

		const onlyShowInRace =
			this.props.relative
			&& this.sessionType !== ESession.Race
			&& !this.props.settings.subSettings.showAllSessions.enabled;
		if (onlyShowInRace && !showAllMode) {
			return null;
		}

		if (this.notInRacePhase && !showAllMode) {
			return null;
		}

		const positionOffset = this.vrGame
			? 6 - this.playerPosition
			: 7 - this.playerPosition;

		let sessionName = '';
		switch (this.sessionType) {
			case 0:
				sessionName = _('Practice');
				break;
			case 1:
				sessionName = _('Qualification');
				break;
			case 2:
				sessionName = _('Race');
				break;
			case 3:
				sessionName = _('Warmup');
				break;
		}
		const showIncPoints =
			!this.props.relative &&
			this.props.settings.subSettings.showIncidentPoints.enabled &&
			(
				showAllMode ||
				(
					this.playerIsFocus &&
					this.maxIncidentPoints > 0 &&
					sessionName !== _('Practice') &&
					sessionName !== _('Warmup')
				)
			);
		const warnInc =
			showIncPoints &&
			this.myIncidentPoints >= (this.maxIncidentPoints * 0.9);

		return (
			<div
				className={classNames(
					'positionBarContainer',
					this.props.relative ? 'relative' : 'normal',
					{
						shouldShow:
							!!this.drivers.length || showAllMode,
						gameIsVR: this.vrGame,
						noStandings:
							!this.props.relative &&
							(
								!this.props.settings.subSettings.showStandings.enabled ||
								((this.isLeaderboard || this.isHillClimb) && !showAllMode)
							),
						sGapsInSeconds: this.props.relative &&
							this.props.settings.subSettings.showGapsInSeconds.enabled,
						sCarNames: this.props.relative &&
							this.props.settings.subSettings.showCarNames.enabled,
						sCarLogos: this.props.relative &&
							this.props.settings.subSettings.showCarLogos.enabled,
						sClassLogos: this.props.relative &&
							this.props.settings.subSettings.showClassLogos.enabled,
						sPitStops: this.props.relative &&
							this.props.settings.subSettings.showPitStops.enabled,
						noMultiClass: !this.multiClass
					}
				)}
				{...widgetSettings(this.props)}
			>
				{
					(
						this.props.relative ||
						(
							!this.props.relative &&
							this.props.settings.subSettings.showStandings.enabled &&
							((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
						)
					) &&
					this.sessionPhase !== INVALID && (
						<div
							className={classNames('positionBar', this.props.className,
								{
									gameIsVR: this.vrGame
								}
							)}
						>
							{
								times(!this.props.relative ? positionOffset : 0).map(
									(i: number) => {
										return (
											<div
												key={`empty-${i}`}
												className="player"
											/>
										);
									}
								)
							}
							{this.drivers.map((player, i) => {
								return (
									<PositionEntry
										key={`${player.id}-${i}`}
										player={player}
										relative={this.props.relative}
										settings={this.props.settings}
										playerPitInfo={eDriverPitInfo}
										playerLapInfo={eDriverLapInfo}
										playerDiffs={eDriverDiffs}
										singleplayerRace={this.singleplayerRace}
										sessionType={this.sessionType}
										sessionPhase={this.sessionPhase}
										position={this.position}
										multiClass={this.multiClass}
										isLeaderboard={this.isLeaderboard}
										isHillClimb={this.isHillClimb}
									/>
								);
							})}
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.lapTime.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode) && (
						<div
							className={classNames(
								'currentLapTime',
								{
									noTime: this.lapTimeCurrentSelf <= 0
								}
							)}
						>
							<span className="mono">
								{this.lapTimeCurrentSelf !== INVALID
									? formatTime(
										this.lapTimeCurrentSelf,
										'mm:ss.SSS'
									)
									: '-:--.---'}
							</span>
							<div className="label">{_('Lap time')}</div>
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.currentPosition.enabled &&
					(showAllMode || (
						this.position !== INVALID &&
						(!this.isLeaderboard && !this.isHillClimb)
					)) && (
						<div
							className={classNames(
								'currentPosition',
								{
									gameIsVR: this.vrGame
								}
							)}
							style={{
								left:
									this.props.settings.subSettings.lapTime.enabled &&
										(r3e.data.GameInReplay <= 0 || showAllMode)
										? '160px'
										: '10px'
							}}
						>
							<span className="mono">
								{
									showAllMode
										? '9/12'
										: `${this.position}/${this.playerCount}`
								}
							</span>
							<div className="label">{_('Position')}</div>
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.currentPosition.enabled &&
					(
						(
							this.positionClass !== INVALID &&
							this.multiClass &&
							(!this.isLeaderboard && !this.isHillClimb)
						) ||
						showAllMode
					) && (
						<div
							className={classNames(
								'currentPositionClass',
								{
									gameIsVR: this.vrGame
								}
							)}
							style={{
								left:
									this.props.settings.subSettings.lapTime.enabled &&
										(r3e.data.GameInReplay <= 0 || showAllMode)
										? '270px'
										: '120px'
							}}
						>
							<span className="mono">
								{
									showAllMode
										? '3/6'
										: `${this.positionClass}/${this.classDriverCount}`
								}
							</span>
							<div className="label">{_('Position Class')}</div>
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.sessionTime.enabled &&
					this.maxLaps !== INVALID && (
						<div className="currentLap">
							<span className="mono">
								{this.currentLap}/{this.maxLaps}
							</span>
							<div className="label">{_('Lap')}</div>
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.sessionLaps.enabled &&
					(
						(
							this.completedLaps > 0 &&
							this.maxLaps === INVALID &&
							(!this.isLeaderboard && !this.isHillClimb)
						) || showAllMode
					) && (
						<div
							className="sessionLaps"
							style={{
								left:
									this.props.settings.subSettings.lapTime.enabled &&
										(r3e.data.GameInReplay <= 0 || showAllMode)
										? this.props.settings.subSettings.currentPosition.enabled
											? '380px'
											: '160px'
										: this.props.settings.subSettings.currentPosition.enabled
											? '230px'
											: '10px'
							}}
						>
							<span className="mono">
								{
									showAllMode
										? 6
										: this.completedLaps
								}
							</span>
							<div className="label">
								{_('Completed Laps')}
							</div>
						</div>
					)}

				{
					!this.props.relative &&
					(
						(
							this.maxLaps === INVALID &&
							this.playerIsFocus &&
							(
								(
									this.props.settings.subSettings.sessionLapsRemain.enabled &&
									this.actualRoundsLeft > -1
								) ||
								(
									this.props.settings.subSettings.sessionLapsTotal.enabled &&
									personalBestTime > 0
								) ||
								(
									this.props.settings.subSettings.sessionLapsRemain.enabled &&
									this.actualRoundsLeft > -1 &&
									this.props.settings.subSettings.sessionLapsTotal.enabled &&
									personalBestTime > 0
								)
							) &&
							(
								(
									this.props.settings.subSettings.sessionLapsTotal.enabled &&
									personalBestTime > 0
								) ||
								(
									this.props.settings.subSettings.sessionLapsRemain.enabled &&
									this.actualRoundsLeft > -1
								)
							)
						) ||
						showAllMode
					) && (
						<div
							className="sessionLapsRemain"
							style={{
								left:
									this.props.settings.subSettings.lapTime.enabled &&
										(r3e.data.GameInReplay <= 0 || showAllMode)
										? this.props.settings.subSettings.currentPosition.enabled
											? this.props.settings.subSettings.sessionLaps.enabled
												? this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '490px'
													: '480px'
												: this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '380px'
													: '370px'
											: this.props.settings.subSettings.sessionLaps.enabled
												? this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '280px'
													: '270px'
												: this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '180px'
													: '180px'
										: this.props.settings.subSettings.currentPosition.enabled
											? this.props.settings.subSettings.sessionLaps.enabled
												? this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '340px'
													: '330px'
												: this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '230px'
													: '220px'
											: this.props.settings.subSettings.sessionLaps.enabled
												? this.actualRoundsLeft > 99 ||
													Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
													? '120px'
													: '110px'
												: '10px',
								width: this.actualRoundsLeft > 99 ||
									Math.ceil(this.sessionTimeDuration / personalBestTime) >= 100
									? '180px'
									: '160px'
							}}
						>
							<span className="mono">
								{
									this.props.settings.subSettings.sessionLapsTotal.enabled ||
										this.props.settings.subSettings.sessionLapsRemain.enabled
										? this.props.settings.subSettings.sessionLapsTotal.enabled &&
											(personalBestTime > 0 || showAllMode) &&
											this.props.settings.subSettings.sessionLapsRemain.enabled &&
											(this.actualRoundsLeft > -1 || showAllMode)
											? `${showAllMode
												? 6
												: this.actualRoundsLeft
											}/${showAllMode
												? 12
												: Math.ceil(this.sessionTimeDuration / personalBestTime)
											}`
											: this.props.settings.subSettings.sessionLapsTotal.enabled &&
												(personalBestTime > 0 || showAllMode)
												? `${showAllMode
													? 12
													: Math.ceil(this.sessionTimeDuration / personalBestTime)
												}`
												: `${showAllMode
													? 6
													: this.actualRoundsLeft
												}`
										: ''
								}
							</span>
							<div className="label">
								{
									this.props.settings.subSettings.sessionLapsRemain.enabled ||
										this.props.settings.subSettings.sessionLapsTotal.enabled
										? this.props.settings.subSettings.sessionLapsTotal.enabled &&
											(personalBestTime > 0 || showAllMode)
											? !this.props.settings.subSettings.sessionLapsRemain.enabled
												? _('Estimated Laps total')
												: _('Est.L. left / Est.L. total')
											: _('Estimated Laps left')
										: ''
								}
							</div>
						</div>
					)}

				{!this.props.relative &&
					this.props.settings.subSettings.showSOF.enabled &&
					(!this.singleplayerRace || showAllMode) && (
						<div
							className="strengthOfField"
							style={{
								right: this.props.settings.subSettings.sessionTime.enabled &&
									((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
									? showIncPoints
										? this.props.settings.subSettings.showLastLap.enabled
											? this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '585px'
												: '430px'
											: this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '430px'
												: '275px'
										: this.props.settings.subSettings.showLastLap.enabled
											? this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '445px'
												: '290px'
											: this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '290px'
												: '135px'
									: showIncPoints
										? this.props.settings.subSettings.showLastLap.enabled
											? this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '460px'
												: '305px'
											: this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '305px'
												: '150px'
										: this.props.settings.subSettings.showLastLap.enabled
											? this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '320px'
												: '165px'
											: this.props.settings.subSettings.showBestLap.enabled &&
												(r3e.data.GameInReplay <= 0 || showAllMode)
												? '165px'
												: '10px'
							}}
						>
							<span className="mono">
								{
									showAllMode
										? '2.22K'
										: this.getStrengthOfField()
								}
							</span>
							<div className="label">{_('Strength of Field')}</div>
						</div>
					)
				}
				{!this.props.relative &&
					this.props.settings.subSettings.showLastLap.enabled && (
						<div
							className={classNames(
								'lastLap',
								{
									noTime: !showAllMode &&
										this.lapTimePreviousSelf <= 0
								}
							)}
							style={{
								color: showAllMode
									? 'rgba(255, 255, 255, 1)'
									: !(
										(
											this.sessionType === 2 &&
											this.completedLaps < 1
										) || (
											this.sessionType !== 2 &&
											this.lapTimeBestSelf < 0
										)
									) &&
										nowCheck <= this.lapInfoData[this.currentSlotId][2]
										? `rgba(${this.lapInfoData[this.currentSlotId][3]
										}, ${this.lapInfoData[this.currentSlotId][4]
										}, ${this.lapInfoData[this.currentSlotId][5]
										}, 1)`
										: 'rgba(255, 255, 255, 1)',
								right: this.props.settings.subSettings.sessionTime.enabled &&
									((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
									? showIncPoints
										? this.props.settings.subSettings.showBestLap.enabled &&
											(r3e.data.GameInReplay <= 0 || showAllMode)
											? '430px'
											: '275px'
										: this.props.settings.subSettings.showBestLap.enabled &&
											(r3e.data.GameInReplay <= 0 || showAllMode)
											? '290px'
											: '135px'
									: showIncPoints
										? this.props.settings.subSettings.showBestLap.enabled &&
											(r3e.data.GameInReplay <= 0 || showAllMode)
											? '305px'
											: '150px'
										: this.props.settings.subSettings.showBestLap.enabled &&
											(r3e.data.GameInReplay <= 0 || showAllMode)
											? '165px'
											: '10px'
							}}
						>
							<span className="mono">
								{
									this.lapTimePreviousSelf !== -1
										? formatTime(
											this.lapTimePreviousSelf,
											'mm:ss.SSS'
										)
										: showAllMode
											? '01:48.023'
											: '-:--.---'
								}
							</span>
							<div className="label">{_('Last Lap')}</div>
						</div>
					)
				}
				{!this.props.relative &&
					this.props.settings.subSettings.showBestLap.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode) && (
						<div
							className={classNames(
								'bestLap',
								{
									noTime: !showAllMode &&
										this.bestSelfSector3 <= 0
								}
							)}
							style={{
								color: 'white',
								right: this.props.settings.subSettings.sessionTime.enabled &&
									((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
									? showIncPoints
										? '275px'
										: '135px'
									: showIncPoints
										? '150px'
										: '10px'
							}}
						>
							<span className="mono">
								{
									this.bestSelfSector3 !== -1
										? formatTime(
											this.bestSelfSector3,
											'mm:ss.SSS'
										)
										: showAllMode
											? '01:48.023'
											: '-:--.---'
								}
							</span>
							<div className="label">{_('Best Lap')}</div>
						</div>
					)
				}
				{!this.props.relative &&
					showIncPoints && (
						<div
							className={classNames(
								'incidentPoints'
							)}
							style={{
								color: warnInc
									? 'rgba(255, 0, 0, 1)'
									: 'rgba(255,255,255,1)',
								right: this.props.settings.subSettings.sessionTime.enabled &&
									((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
									? '135px'
									: '10px'
							}}
						>
							<span className="mono">
								{
									`${showAllMode
										? 135
										: this.myIncidentPoints === -1
											? 'N/A'
											: this.myIncidentPoints
									}/${showAllMode
										? 200
										: this.maxIncidentPoints
									}`
								}
							</span>
							<div className="label">{_('Incidents')}</div>
						</div>
					)}
				{!this.props.relative &&
					this.props.settings.subSettings.sessionTime.enabled &&
					((!this.isLeaderboard && !this.isHillClimb) || showAllMode) &&
					this.sessionTimeRemaining !== INVALID && (
						<div className="sessionTime">
							<span className="mono">
								<div className="sessionRemainHours">
									{
										showAllMode
											? '2'
											: formatTime(this.sessionTimeRemaining, 'H')
									}
								</div>
								<div className="sessionRemainHoursText">
									{`${'H'}`}
								</div>
								<div className="sessionRemainMinutes">
									{
										showAllMode
											? '34'
											: formatTime(this.sessionTimeRemaining, 'mm')
									}
								</div>
								<div className="sessionRemainMinutesText">
									{`${'M'}`}
								</div>
								<div className="sessionRemainSeconds">
									{
										showAllMode
											? '56'
											: formatTime(this.sessionTimeRemaining, 'ss')
									}
								</div>
								<div className="sessionRemainSecondsText">
									{`${'S'}`}
								</div>
							</span>
							<div className="label">{sessionName}</div>
						</div>
					)}
			</div>
		);
	}
}

interface IEntryProps extends React.HTMLAttributes<HTMLDivElement> {
	player: IDriverInfo;
	relative: boolean;
	settings: IWidgetSetting;
	playerPitInfo: IDriverPitInfo;
	playerLapInfo: IDriverLapInfo;
	playerDiffs: IDriverDiffs;
	singleplayerRace: boolean;
	sessionType: number;
	sessionPhase: number;
	position: number;
	multiClass: boolean;
	isLeaderboard: boolean;
	isHillClimb: boolean;
}

@observer
export class PositionEntry extends React.Component<IEntryProps, {}> {
	constructor(props: IEntryProps) {
		super(props);
	}
	render() {
		const sessionType = this.props.sessionType;
		const sessionPhase = this.props.sessionPhase;
		const position = this.props.position;
		if (
			sessionType === 2 &&
			sessionPhase === 1
		) { return null; }
		const player = this.props.player;
		const playerDiffs = this.props.playerDiffs;
		const playerPitInfo =
			(
				r3e.data.GameInReplay > 0 &&
				(
					(
						r3e.data.SessionTimeDuration !== -1 &&
						r3e.data.SessionTimeRemaining <= 0
					) ||
					(
						r3e.data.NumberOfLaps !== -1 &&
						r3e.data.CompletedLaps >= (r3e.data.NumberOfLaps * 0.9)
					)
				)
			)
				? {}
				: this.props.playerPitInfo;
		const playerLapInfo = this.props.playerLapInfo;
		const singleplayerRace = this.props.singleplayerRace;
		const multiClass = this.props.multiClass;
		const isLeaderboard = this.props.isLeaderboard;
		const isHillClimb = this.props.isHillClimb;
		const pitWindow = getTimeUntilPit(r3e.data.NumberOfLaps !== INVALID);

		const showCN =
			this.props.relative &&
			this.props.settings.subSettings.showCarNames.enabled &&
			(
				(
					singleplayerRace &&
					!showAllMode
				) ||
				(
					(!singleplayerRace || showAllMode) &&
					!this.props.settings.subSettings.showRanking.enabled
				)
			) &&
			!this.props.settings.subSettings.showCarLogos.enabled;

		const showCL =
			this.props.relative &&
			(
				this.props.settings.subSettings.showCarLogos.enabled ||
				(
					this.props.settings.subSettings.showRanking.enabled &&
					(!singleplayerRace || showAllMode) &&
					this.props.settings.subSettings.showCarNames.enabled
				)
			);

		let returnWidth = 288;

		if (
			this.props.relative
		) {
			if (
				this.props.settings.subSettings.showGapsInSeconds.enabled
			) { returnWidth = returnWidth - 10; }

			if (
				showCN
			) { returnWidth = returnWidth + 51; }

			if (
				(
					showAllMode ||
					sessionType === ESession.Race
				) &&
				this.props.settings.subSettings.showPitStops.enabled
			) { returnWidth = returnWidth + 26; }

			if (
				showCL &&
				this.props.settings.subSettings.showRanking.enabled &&
				(!singleplayerRace || showAllMode)
			) { returnWidth = returnWidth + 25; }

		}
		const relativeWidth = `${returnWidth}px`;

		if (
			this.props.relative ||
			(
				!this.props.relative &&
				this.props.settings.subSettings.showStandings.enabled &&
				((!isLeaderboard && !isHillClimb) || showAllMode)
			)
		) {
			return (
				<div
					className={classNames('player', {
						isUser: player.isUser,
						lapping: player.lapDiff < 0,
						sameLap: player.lapDiff === 0,
						lapped: player.lapDiff > 0,
						validLap: player.validLap > 0 && player.currentTime > 0,
						noValidLap: player.validLap < 1,
						noRaceSession: showAllMode || sessionType !== ESession.Race,
						sGapsInSeconds: this.props.relative &&
							this.props.settings.subSettings.showGapsInSeconds.enabled,
						sCarNames: this.props.relative &&
							showCN,
						sCarLogos: this.props.relative &&
							showCL,
						sClassLogos: this.props.relative &&
							this.props.settings.subSettings.showClassLogos.enabled,
						sRankData: this.props.relative &&
							(!singleplayerRace || showAllMode) &&
							this.props.settings.subSettings.showRanking.enabled,
						sPitStops: this.props.relative &&
							this.props.settings.subSettings.showPitStops.enabled
					})}
					style={{
						width: this.props.relative
							? relativeWidth
							: '148px'
					}}
				>
					<div
						className="position"
						style={{
							color: this.props.relative
								? '#fff'
								: undefined,
							width: !this.props.relative
								? '25px'
								: undefined,
							borderRight: !this.props.relative
								? sessionType === ESession.Race &&
									sessionPhase >= 5 &&
									player.mandatoryPit !== -1 &&
									pitWindow <= 0 &&
									isRange(player.finishStatus, 0, 0)
									? `5px solid ${player.mandatoryPit === 0 || player.mandatoryPit === 1
										? 'rgba(255, 70, 0, 0.8)'
										: player.mandatoryPit === 2
											? 'rgba(100, 221, 23, 0.8)'
											: 'rgba(0, 0, 0, 0)'
									}`
									: '0px solid rgba(255, 255, 255, 1)'
								: undefined
						}}
					>
						{player.positionClass}
					</div>{' '}
					<div className="name">
						{
							this.props.relative
								? (
									this.props.settings.subSettings.showCarNames.enabled ||
									this.props.settings.subSettings.showCarLogos.enabled ||
									(
										this.props.settings.subSettings.showRanking.enabled &&
										(!singleplayerRace || showAllMode)
									)
								)
									? player.shortName
									: player.name
								: this.props.settings.subSettings.showStandings.enabled &&
									((!isLeaderboard && !isHillClimb) || showAllMode)
									? player.shortName
									: ''
						}
					</div>
					{
						this.props.relative &&
						(!singleplayerRace || showAllMode) &&
						this.props.settings.subSettings.showRanking.enabled && (
							<div
								className="rankData"
								style={{
									background: eRankInvertRelative
										? undefined
										: 'rgba(255, 255, 255, 1)',
									color: eRankInvertRelative
										? undefined
										: 'rgba(0, 0, 0, 1)',
									fontWeight: eRankInvertRelative
										? undefined
										: 'bold'
								}}
							>
								{
									`${showAllMode
										? 2.22
										: (player.rankingData.Rating / 1000).toFixed(2)
									}K / ${showAllMode
										? 94.6
										: player.rankingData.Reputation.toFixed(1)
									}`
								}
							</div>
						)
					}
					{
						this.props.relative &&
						showCN && (
							<div className="carName">
								{
									getCarName(player.modelId)
								}
							</div>
						)
					}
					{
						this.props.relative &&
						showCL && (
							<div className="carLogo">
								<img src={player.logoUrl} width="18" height="18" />
							</div>
						)
					}
					{
						this.props.relative && (
							<div
								className="diff mono"
								style={{
									padding:
										this.props.settings.subSettings.showGapsInSeconds.enabled &&
											playerDiffs[player.id] !== undefined &&
											playerDiffs[player.id][1][0] > 0
											? '0 0 0 7px'
											: '0 0 0 2px'
								}}
							>
								{
									this.props.settings.subSettings.showGapsInSeconds.enabled
										? playerDiffs[player.id] !== undefined
											? fancyTimeFormatGap(playerDiffs[player.id][1][0], 1, 1, false, false)
											: ' '
										: player.diff
								}
							</div>
						)
					}
					{
						!this.props.relative &&
						(
							this.props.settings.subSettings.showStandings.enabled &&
							((!isLeaderboard && !isHillClimb) || showAllMode) &&
							(
								(
									this.props.settings.subSettings.showLastLaps.enabled &&
									playerLapInfo[player.id] !== undefined &&
									nowCheck <= playerLapInfo[player.id][2] &&
									(
										<div
											className={classNames(
												'diff mono'
											)}
											style={{
												color: !(
													(
														sessionType === 2 &&
														player.lapsDone < 1
													) || (
														sessionType !== 2 &&
														player.bestLapTime < 0
													)
												)
													? `rgba(${playerLapInfo[player.id][3]
													}, ${playerLapInfo[player.id][4]
													}, ${playerLapInfo[player.id][5]
													}, 1)`
													: 'rgba(255, 255, 255, 1)'
											}}
										>
											{
												`${!(
													(
														sessionType === 2 &&
														player.lapsDone < 1
													) || (
														sessionType !== 2 &&
														player.bestLapTime < 0
													)
												)
													? playerLapInfo[player.id][1] !== -999
														? playerLapInfo[player.id][1] >= 60
															? formatTime(
																playerLapInfo[player.id][1],
																'm:ss.SSS'
															)
															: formatTime(
																playerLapInfo[player.id][1],
																'ss.SSS'
															)
														: 'INVALID'
													: player.diff.toString().indexOf('.') <= -1 ||
														sessionType !== ESession.Race
														? player.diff
														: playerDiffs[player.id] !== undefined
															? fancyTimeFormatGap(playerDiffs[player.id][1][0], 1, 0)
															: '-'
												}`
											}
										</div>
									)
								) || (
									(
										!this.props.settings.subSettings.showLastLaps.enabled ||
										playerLapInfo[player.id] === undefined ||
										(
											playerLapInfo[player.id] !== undefined &&
											nowCheck > playerLapInfo[player.id][2]
										)
									) &&
									(
										<div
											className={classNames(
												'diff mono'
											)}
											style={{
												color: 'rgba(255, 255, 255, 1)'
											}}
										>
											{
												`${player.diff.toString().indexOf('.') <= -1 ||
													sessionType !== ESession.Race
													? player.diff
													: playerDiffs[player.id] !== undefined
														? player.position < position &&
															playerDiffs[player.id][1][0] > 0
															? fancyTimeFormatGap(
																(
																	0 -
																	(
																		(
																			playerDiffs[player.id][0][0] /
																			2
																		) +
																		(
																			(
																				playerDiffs[player.id][0][0] /
																				2
																			) -
																			playerDiffs[player.id][1][0]
																		)
																	)
																), 1, 0
															)
															: player.position > position &&
																playerDiffs[player.id] !== undefined &&
																playerDiffs[player.id][1][0] < 0
																? fancyTimeFormatGap(
																	(
																		(
																			playerDiffs[player.id][0][0] /
																			2
																		) +
																		(
																			(
																				playerDiffs[player.id][0][0] /
																				2
																			) +
																			playerDiffs[player.id][1][0]
																		)
																	), 1, 0
																)
																: fancyTimeFormatGap(playerDiffs[player.id][1][0], 1, 0)
														: '-'
												}`
											}
										</div>
									)
								)
							)
						)
					}
					{
						!this.props.relative &&
							this.props.settings.subSettings.showPitTime.enabled &&
							(
								showAllMode ||
								(
									sessionType === ESession.Race &&
									player.finishStatus === 0 &&
									playerPitInfo[player.id] !== undefined
								)
							)
							? player.pitting > 0 || showAllMode
								? playerPitInfo[player.id][2] > 0 || showAllMode
									? <div
										className={classNames(
											'pitting',
											{
												noShadow: false
											}
										)}
										style={{
											background: showAllMode ||
												playerPitInfo[player.id][3] > 0
												? showAllMode || playerPitInfo[player.id][4] > 0
													? 'rgba(0, 190, 60, 0.8)'
													: 'rgba(255, 70, 0, 0.8)'
												: 'rgba(0, 176, 255, 0.8)',
											color: '#fff',
											width: '25px'
										}}
									>
										{`${'PIT'}`}
										<div
											className={classNames(
												'pittime',
												{
													noShadow: false
												}
											)}
											style={{
												marginLeft: '5px'
											}}
										>
											{
												`${showAllMode
													? 52.9
													: (
														(
															nowCheck - playerPitInfo[player.id][2]
														) / 1000
													).toFixed(1)
												}`
											}
										</div>
										<div
											className={classNames(
												'pittimea',
												{
													noShadow: showAllMode
														? false
														: playerPitInfo[player.id][3] <= 0
												}
											)}
											style={{
												marginLeft: '0px',
												color: showAllMode || playerPitInfo[player.id][3] > 0
													? showAllMode || playerPitInfo[player.id][4] > 0
														? 'rgba(0, 190, 60, 1)'
														: 'rgba(255, 255, 255, 1)'
													: 'rgba(255, 255, 255, 0)',

												background: showAllMode || playerPitInfo[player.id][3] > 0
													? 'rgba(0, 100, 255, 0.8)'
													: 'rgba(0, 100, 255, 0)'
											}}
										>
											{
												showAllMode || playerPitInfo[player.id][3] > 0
													? showAllMode || playerPitInfo[player.id][4] <= 0
														? `${showAllMode
															? 13.5
															: (
																(
																	nowCheck - playerPitInfo[player.id][3]
																) / 1000
															).toFixed(1)
														}`
														: `${(
															(
																playerPitInfo[player.id][4] - playerPitInfo[player.id][3]
															) / 1000
														).toFixed(1)
														}`
													: '|'
											}
										</div>
									</div>
									: <div
										className={classNames(
											'pitting',
											{
												noShadow: false
											}
										)}
										style={{
											background: showAllMode ||
												playerPitInfo[player.id][3] > 0
												? showAllMode || playerPitInfo[player.id][4] > 0
													? 'rgba(0, 190, 60, 0.8)'
													: 'rgba(255, 70, 0, 0.8)'
												: 'rgba(0, 176, 255, 0.8)',
											color: '#fff',
											width: '25px'
										}}
									>
										{`${'PIT'}`}
									</div>
								: playerPitInfo[player.id][5] > 0 &&
									(
										(
											nowCheck - playerPitInfo[player.id][5] <= 7500 &&
											this.props.settings.subSettings.autoHidePitTime.enabled
										) ||
										!this.props.settings.subSettings.autoHidePitTime.enabled
									)
									? <div
										className={classNames(
											'pitting',
											{
												noShadow: true
											}
										)}
										style={{
											background: 'rgba(0, 176, 255, 0)',
											color: 'rgba(255, 255, 255, 0)',
											width: '25px'
										}}
									>
										{`${'PIT'}`}
										<div
											className={classNames(
												'pittime',
												{
													noShadow: false
												}
											)}
											style={{
												marginLeft: '5px'
											}}
										>
											{
												`${(
													(
														playerPitInfo[player.id][5] - playerPitInfo[player.id][2]
													) / 1000
												).toFixed(1)
												}`
											}
										</div>
										<div
											className={classNames(
												'pittimea',
												{
													noShadow: playerPitInfo[player.id][4] <= 0
												}
											)}
											style={{
												marginLeft: '0px',
												color: playerPitInfo[player.id][4] > 0
													? 'rgba(0, 190, 60, 1)'
													: 'rgba(0, 190, 60, 0)',
												background: playerPitInfo[player.id][4] > 0
													? 'rgba(0, 100, 255, 0.8)'
													: 'rgba(0, 100, 255, 0)'
											}}
										>
											{
												playerPitInfo[player.id][4] > 0
													? `${(
														(
															playerPitInfo[player.id][4] - playerPitInfo[player.id][3]
														) / 1000
													).toFixed(1)
													}`
													: '|'
											}
										</div>
									</div>
									: null
							: null
					}
					{' '}
					{
						this.props.relative &&
						(sessionType === ESession.Race || showAllMode) &&
						this.props.settings.subSettings.showPitStops.enabled && (
							<div
								className={classNames('stopStatus', {
									textShadow: player.numStops > 0
								})}
								style={{
									background:
										player.mandatoryPit === 2
											? 'green'
											: player.mandatoryPit === 0 || player.mandatoryPit === 1
												? 'red'
												: player.inPit
													? 'red'
													: 'dimgray',
									color:
										player.numStops > 0
											? 'white'
											: player.inPit
												? 'white'
												: player.mandatoryPit === 2
													? 'green'
													: player.mandatoryPit === 0 || player.mandatoryPit === 1
														? 'red'
														: player.inPit
															? 'red'
															: 'dimgray'
								}}
							>
								{
									player.inPit
										? `${'PIT'}`
										: player.numStops
								}
							</div>
						)
					}
					{this.props.relative &&
						this.props.settings.subSettings.showUserId.enabled && (
							<div className="userId">{player.userId}</div>
						)}
					{multiClass && (
						<div
							className="classStyle"
							style={{
								borderTop: !this.props.relative &&
									multiClass
									? `3px solid ${player.classColor}`
									: `0`,
								borderLeft: this.props.relative &&
									multiClass
									? `4px solid ${player.classColor}`
									: undefined
							}}
						/>
					)}
					{
						this.props.relative &&
						this.props.settings.subSettings.showClassLogos.enabled && (
							<div className="classLogo">
								<img src={player.classUrl} width="20" height="20" />
							</div>
						)
					}
				</div>
			);
		}
		return null;
	}
}
