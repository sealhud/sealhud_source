import { LapEvents } from "../../lib/LapEvents";
import { PitEvents } from "../../lib/PitEvents";
import { FlagEvents } from "../../lib/FlagEvents";
import { FuelEvents } from "../../lib/FuelEvents";
import { FuelStrategy } from '../../lib/FuelStrategy';
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
  getRoundsLeft,
  isRange,
  isEven,
  rankData,
  showDebugMessage,
  showDebugMessageSmall,
  widgetSettings,
  IRatingData,
  INVALID,
  getClassColor,
  computeRealLapDiff
} from './../../lib/utils';
import {
	ESession,
	IDriverData,
	EPitState,
	ESessionPhase,
	ICutTrackPenalties
} from './../../types/r3eTypes';
import { action, observable } from 'mobx';
import { 
	IWidgetSetting,
	showAllMode,
	// IDriverPitInfo,
	eDriverNum,
	// eDriverPitInfo,
	eIsLeaderboard,
	eIsHillClimb,
	eGainLossPermanentBar,
	eRankInvertRelative
} from '../app/app';
import { observer } from 'mobx-react';
import { times, uniq } from 'lodash-es';
import _ from './../../translate';
import r3e, { registerUpdate, unregisterUpdate, nowCheck } from './../../lib/r3e';
import React from 'react';
import getCarName from "./../../lib/carData";
import './positionBar.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	relative: boolean;
	settings: IWidgetSetting;
}
interface IStartPositions {
  [index: number]: number;
}
interface IDriverInfo {
	isUser: boolean;
	id: number;
	modelId: number;
	name: string;
	shortName: string;
	position: number;
	positionClass: number;
  	numPitstops: number;
	meta?: IDriverData;
	diff: string | number;
	lapDiff: number;
	classColor: string;
	inPit: number;
	pitting: number;
	mandatoryPit: number;
	numStops: number;
	validLap: number;
  	currentTime: number;
	finishStatus: number;
	userId: number;
	logoUrl: string;
	classUrl: string;
	bestLapTime: number;
	lapsDone: number;
	rankingData: IRatingData;
	penalties: ICutTrackPenalties;
}
@observer
export default class PositionBar extends React.Component<IProps, {}> {
  	@observable accessor vrGame = false;
	@observable accessor drivers: IDriverInfo[] = [];
	@observable accessor formattedDrivers: IDriverInfo[] = [];
	@observable accessor currentLap = INVALID;
	@observable accessor maxLaps = INVALID;
	@observable accessor pitState = INVALID;
	@observable accessor sessionPhase = INVALID;
	@observable accessor sessionTimeRemaining = INVALID;
	@observable accessor position = INVALID;
	@observable accessor positionClass = INVALID;
	@observable accessor multiClass = false;
	@observable accessor classDriverCount = INVALID;
	@observable accessor sessionType = INVALID;
	@observable accessor lapTimeCurrentSelf = INVALID;
	@observable accessor playerCount = INVALID;
	@observable accessor isLeaderboard = false;
	@observable accessor isHillClimb = false;
	@observable accessor strengthOF = "";
	@observable accessor logoUrlp1 = "https://game.raceroom.com/store/image_redirect?id=";
	@observable accessor logoUrlp2 = "&size=small";
	@observable accessor startingLights = -1;
	@observable accessor singleplayerRace = false;
	@observable accessor startPositions: IStartPositions = {};	
	@observable accessor lapTimePreviousSelf = -1;
	@observable accessor lapTimeBestSelf = -1;
	@observable accessor bestSelfSector3 = -1;
	@observable accessor completedLaps = -1;
	@observable accessor currentSlotId = -1;
	@observable accessor myIncidentPoints = -1;
	@observable accessor playerIsFocus = false;
	@observable accessor maxIncidentPoints = -1;
	@observable accessor myCutTrackWarnings = -1;
	@observable accessor actualRoundsLeft = -1;
	@observable accessor bestLapSelf = -1;
	@observable accessor sessionTimeDuration = -1;
	@observable accessor layoutLength = -1;
	@observable accessor pitWindowStatus = -1;
	@observable accessor lastCheck = 0;
	@observable accessor lapDistance = -1;
	@observable accessor notInRacePhase = true;
	@observable accessor personalBestTime = FuelEvents.bestLapTimeSec;

	playerPosition = INVALID;
	positionBarCount = 15;
	entryWidth = 148;
	userDriverData: IDriverInfo | null = null;
	classColorUpdate: any;

	constructor(props: IProps) {
		super(props);
		registerUpdate(this.update);
		this.forceClassColorUpdate();
		this.classColorUpdate = setInterval(this.forceClassColorUpdate, 10 * 1000);
	}
	componentWillUnmount() {
		clearInterval(this.classColorUpdate);
		unregisterUpdate(this.update);
	}

	private sortByLapDistance = (a: IDriverInfo, b: IDriverInfo) => {
		return (b.meta?.LapDistance ?? 0) - (a.meta?.LapDistance ?? 0);
	};

	@action
	private update = () => {
		this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
		this.bestLapSelf =
			this.personalBestTime !== null
			? this.personalBestTime
			: r3e.data.LapTimeBestSelf > -1
			? r3e.data.LapTimeBestSelf
			: r3e.data.LapTimeBestLeaderClass > -1
			? r3e.data.LapTimeBestLeaderClass
			: r3e.data.LapTimeBestLeader > -1
			? r3e.data.LapTimeBestLeader
			: r3e.data.SectorTimesSessionBestLap.Sector3 > -1
			? r3e.data.SectorTimesSessionBestLap.Sector3
			: -1;
		this.lapDistance = r3e.data.LapDistance;
		this.completedLaps = r3e.data.CompletedLaps;
		this.sessionPhase = r3e.data.SessionPhase;
		this.currentLap = this.completedLaps + 1;
		this.maxLaps = r3e.data.NumberOfLaps;
		this.position = r3e.data.Position;
		this.positionClass = r3e.data.PositionClass;
		this.sessionType = r3e.data.SessionType;
		this.lapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
		this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
		this.actualRoundsLeft = 
			FuelStrategy.RoundsLeft !== null 
			? Math.round(FuelStrategy.RoundsLeft* 10) / 10 
			: getRoundsLeft(this.lapTimeBestSelf);
		this.bestSelfSector3 = r3e.data.SectorTimesBestSelf.Sector3;
		this.layoutLength = r3e.data.LayoutLength;
		this.isLeaderboard = eIsLeaderboard;
		this.isHillClimb = eIsHillClimb;
		this.sessionTimeRemaining = showAllMode ? 1 : r3e.data.SessionTimeRemaining;
		this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
		// ATIVAR ESSE TRECHO NOVAMENTE QUANDO HABILITAR SHORTBAR
		// if (!this.props.relative) {
		//  this.vrGame = this.props.settings.subSettings.shortBar.enabled;
		// }
		this.lastCheck = nowCheck;
		this.playerIsFocus = ePlayerIsFocus;
		this.currentSlotId = eCurrentSlotId;
		this.sessionTimeDuration = r3e.data.SessionTimeDuration;
		this.notInRacePhase =
			(this.sessionPhase < 4 && r3e.data.CarSpeed < 5) ||
			this.sessionPhase < 3;
		this.pitState = r3e.data.PitState;
		this.pitWindowStatus = r3e.data.PitWindowStatus;
		this.maxIncidentPoints =
			r3e.data.MaxIncidentPoints !== undefined
			? r3e.data.MaxIncidentPoints
			: -1;
		this.myIncidentPoints =
			r3e.data.IncidentPoints !== undefined ? r3e.data.IncidentPoints : -1;
		this.myCutTrackWarnings =
			r3e.data.CutTrackWarnings !== undefined ? r3e.data.CutTrackWarnings : -1;
		this.classDriverCount = 0;
		this.playerCount = r3e.data.DriverData.length;
		this.multiClass = false;
		this.singleplayerRace = false;
		this.startingLights = r3e.data.StartLights;
		this.formattedDrivers = r3e.data.DriverData.map(this.formatDriverData);
		let driverData = this.props.relative
			? this.props.settings.subSettings.showAllSessions.enabled
			? this.formattedDrivers.filter(
				this.filterDriverDataQualy
				)
			: this.formattedDrivers.filter(
				this.filterDriverData
				)
			: this.formattedDrivers.filter(
				this.filterDriverData
			);

		// Deal with filtering and ordering relative positions
		if (this.props.relative) {
			if (this.props.settings.subSettings.showAllSessions.enabled) {
				driverData = r3e.data.DriverData.map(this.formatDriverData).filter(
				this.filterDriverDataQualy
				);
			}
			driverData = driverData.sort(this.sortByLapDistance);
			const playerIndex = this.getPlayerPosition(driverData);
			const N = driverData.length;
			// Ajustar effectiveNum conforme a qutde de drivers na pista
			let effectiveNum = eDriverNum; 
			if (N <= 3 && eDriverNum > 1) { 				
				effectiveNum = 1;				
			} else if (N <= 5 && N > 3 && eDriverNum > 2) {
				effectiveNum = 2;
			}			
			// Construir array circular
			const circular = driverData.concat(driverData).concat(driverData);
			// Centro do bloco no array circular
			const center = N + playerIndex;
			// Cortar effectiveNum acima e abaixo,  
			const start = center - effectiveNum;
			const end   = center + effectiveNum + 1;
			// Remover duplicados (caso haja pilotos com dados incompletos)
			driverData = uniq(circular.slice(start, end));
		}

		this.calculateDiffs(driverData);

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
		this.getPlayerPosition(driverData);		
		this.drivers = driverData.map((driver) => {
			delete driver.meta;
			return driver;
		});
		if (this.sessionType === ESession.Race) {
        if (this.startingLights <= 1) {
          this.strengthOF = "";
        }
        if (this.startingLights === 4) {
          r3e.data.DriverData.forEach((driver) => {
            this.startPositions[driver.DriverInfo.SlotId] = -1;
          });
        }
        if (this.startingLights >= 5) {
          r3e.data.DriverData.forEach((driver) => {
            if (this.startPositions[driver.DriverInfo.SlotId] === -1) {
              this.startPositions[driver.DriverInfo.SlotId] = driver.Place;
            }
          });
        }
       if (!this.singleplayerRace &&
			rankData.length > 0 &&
			this.strengthOF === "" &&
			this.startingLights >= 5
		) {
			this.strengthOF = this.getStrengthOfField();
		}
      }
	};

	private getPlayerPosition = (driverData: IDriverInfo[]) => {
		let userPosition = 0;
		for (let i = 0; i < driverData.length; i++) {
			if (driverData[i].id === r3e.data.VehicleInfo.SlotId) {
				userPosition = i;
			}
		}
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
		if (isRaceSession && driver.finishStatus > 1) {
		  return false;
		}
		return true;
	};

	private filterDriverData = (driver: IDriverInfo) => {
		const isRaceSession = r3e.data.SessionType === ESession.Race;
		if (
			!isRaceSession &&
			(driver.meta?.SectorTimeBestSelf.Sector3 ?? 0) === INVALID &&
			!driver.isUser
		) {
			return false;
		}
		return true;
	};

	private formatDriverData = (driver: IDriverData): IDriverInfo => {
		const isUser =	r3e.data!.VehicleInfo.SlotId === driver.DriverInfo.SlotId;
		if (driver.DriverInfo.ClassPerformanceIndex ===	r3e.data.VehicleInfo.ClassPerformanceIndex) {
			this.classDriverCount += 1;
		} else {
			this.multiClass = true;
		}
		if (driver.DriverInfo.UserId === -1) {
		this.singleplayerRace = true;
		}

		const decName =
		!isUser && (this.isLeaderboard || this.isHillClimb)
		? "Ghost-Car"
		: base64ToString(driver.DriverInfo.Name);

		const driverData = {
			isUser,
			id: driver.DriverInfo.SlotId,
			modelId: driver.DriverInfo.ModelId,
			name: base64ToString(driver.DriverInfo.Name),
			shortName: getInitials(decName),
			position: driver.Place,
			positionClass: driver.PlaceClass,
			numPitstops: driver.NumPitstops,
			meta: driver,
			lapDiff: driver.CompletedLaps - r3e.data.CompletedLaps,
			diff: isUser ? this.getPlayerPositionText() : '',
			inPit: driver.InPitlane,
			pitting: driver.InPitlane,
			mandatoryPit: driver.PitStopStatus,
			numStops: driver.NumPitstops,
			validLap: driver.CurrentLapValid,
      		currentTime: driver.LapTimeCurrentSelf,
			finishStatus: driver.FinishStatus,
      		userId: driver.DriverInfo.UserId,
			logoUrl:
			driver.DriverInfo.ManufacturerId > 0
				? this.logoUrlp1 +
				driver.DriverInfo.ManufacturerId.toString() +
				this.logoUrlp2
				: `${this.logoUrlp1}4596${this.logoUrlp2}`,
			classUrl:
			driver.DriverInfo.ClassId > 0
				? this.logoUrlp1 +
				driver.DriverInfo.ClassId.toString() +
				this.logoUrlp2
				: `${this.logoUrlp1}1717${this.logoUrlp2}`,
			bestLapTime: driver.SectorTimeBestSelf.Sector3,
			lapsDone: driver.CompletedLaps,
			rankingData: getRankingData(driver.DriverInfo.UserId),
			classColor:  getClassColor(driver.DriverInfo.ClassPerformanceIndex),
			penalties: showAllMode ? {
				DriveThrough: 1,
				StopAndGo: 0,
				PitStop: 0,
				TimeDeduction: 0,
				SlowDown: 1,
			} : driver.Penalties,
		};
		this.userDriverData = driverData;
		return driverData;
	};

	private forceClassColorUpdate() {
		r3e.data.DriverData.forEach((driver) => {
			getClassColor(driver.DriverInfo.ClassPerformanceIndex);
		});
	}
	
	private calculateDiffs(drivers: IDriverInfo[]) {
		const isRace = r3e.data.SessionType === ESession.Race;
		isRace
		? this.props.relative
		? this.calculateDiffsRaceRelative(drivers)
		: this.calculateDiffsRace(drivers)
		: this.props.relative &&
		this.props.settings.subSettings.showAllSessions.enabled
		? this.calculateDiffsQualifyRelative(drivers)
		: this.calculateDiffsQualify(drivers);
	}

	// STANDINGS BAR: Calculate Gaps Between Drivers (Qualifying)
	private calculateDiffsQualify(drivers: IDriverInfo[]) {
		const userBestSector =
			r3e.data.SectorTimesBestSelf.Sector3 !== INVALID
			? r3e.data.SectorTimesBestSelf.Sector3
			: 0;
		drivers.forEach((driver, i) => {
			if (driver.isUser) {
				this.playerPosition = i + 1;
				return;
			}
			const diff =
			(driver.meta?.SectorTimeBestSelf.Sector3 ?? 0)- userBestSector;
			driver.diff =
			diff > 60
			? formatTime(diff, 'm:ss.SSS', true)
			: formatTime(diff, 's.SSS', true);
		});
	}

	/*
	private computeRealLapDiff = (
			meLaps: number, meDist: number,
			otherLaps: number, otherDist: number
		) => {
			let lapDiff = meLaps - otherLaps;
			if (lapDiff < 0 && otherDist < meDist) lapDiff++;
			else if (lapDiff > 0 && meDist < otherDist) lapDiff--;
			return lapDiff;
		};
		*/

	// STANDINGS BAR: Calculate Gaps Between Drivers (Race)
	private previousLapDiff = new Map<number, number>();
	private calculateDiffsRace(drivers: IDriverInfo[]) {
		const playerPos = r3e.data.Position;
		const userLapDistance = r3e.data.LapDistance;
		const userCompletedLaps = drivers[playerPos - 1]?.lapsDone ?? 0;
		const setStoredLap = (slot: number, v: number) =>
			this.previousLapDiff.set(slot, v);
		const driversInfront = drivers.slice(0, playerPos - 1).reverse();
		let accumulatedFront = 0;
		driversInfront.forEach((driver) => {
			const slot = driver.meta?.DriverInfo?.SlotId;
			if (slot == null) return;
			const otherDist = driver.meta?.LapDistance ?? 0;
			const otherLaps = driver.lapsDone ?? 0;
			const lapDiff = computeRealLapDiff(
				userCompletedLaps, userLapDistance,
				otherLaps, otherDist
			);
			accumulatedFront += driver.meta?.TimeDeltaBehind ?? 0;
			const gapTempo = accumulatedFront;
			if (lapDiff === 0) {
				setStoredLap(slot, 0);
				driver.diff =
					gapTempo > 60
					? formatTime(-gapTempo, "m:ss.SSS")
					: formatTime(-gapTempo, "s.SSS");
				return;
			}
			const stored = Math.abs(lapDiff);
			driver.diff = `-${stored} lap${stored > 1 ? "s" : ""}`;
			setStoredLap(slot, lapDiff);
		});
		const driversBehind = drivers.slice(playerPos);
		let accumulatedBehind = 0;
		driversBehind.forEach((driver) => {
			const slot = driver.meta?.DriverInfo?.SlotId;
			if (slot == null) return;
			const otherDist = driver.meta?.LapDistance ?? 0;
			const otherLaps = driver.lapsDone ?? 0;
			const lapDiff = computeRealLapDiff(
				userCompletedLaps, userLapDistance,
				otherLaps, otherDist
			);
			accumulatedBehind += driver.meta?.TimeDeltaFront ?? 0;
			const gapTempo = accumulatedBehind;
			if (lapDiff === 0) {
				setStoredLap(slot, 0);
				driver.diff =
					gapTempo > 60
					? formatTime(gapTempo, "m:ss.SSS", true)
					: formatTime(gapTempo, "s.SSS", true);
				return;
			}
			const stored = Math.abs(lapDiff);
			driver.diff = `+${stored} lap${stored > 1 ? "s" : ""}`;
			setStoredLap(slot, lapDiff);
		});
		this.playerPosition = playerPos;
	}

	// RELATIVES: Calculate Distance Between Drivers (Race)
	private calculateDiffsRaceRelative(drivers: IDriverInfo[]) {
		const userSlot = r3e.data.VehicleInfo.SlotId;
		const userIndex = drivers.findIndex(d => d.meta?.DriverInfo.SlotId === userSlot);
		const myDist = r3e.data.LapDistance;
		const myRacePos = r3e.data.Position;
		const myLaps = drivers[userIndex]?.lapsDone ?? 0;
		const layoutLen = r3e.data.LayoutLength;
		const showSeconds = this.props.settings.subSettings.showGapsInSeconds.enabled;
		// Evita RR mostrar lapTime como delta do player
		const metaUser = drivers[userIndex]?.meta;
		if (metaUser) {
			metaUser.TimeDeltaBehind = 0;
			metaUser.TimeDeltaFront = 0;
		}
		// ----- CÁLCULOS MANUAIS -----
		const fallbackSpeed = 50; // m/s
		const manualBehind = (e: Entry) => {
			const myBest = r3e.data.LapTimeBestSelf;
			const vel = myBest > 0
				? (0.7*(myBest / layoutLen))      // s/m = tempo por metro * 70%
				: (1 / fallbackSpeed);      // fallback s/m
			const t = Math.abs(e.diff) * vel;
			return "+" + t.toFixed(1);
		};
		const manualAhead = (e: Entry) => {
			const myBest = r3e.data.LapTimeBestSelf;
			const vel = myBest > 0
				? (0.7*(myBest / layoutLen))      // s/m = tempo por metro * 70%
				: (1 / fallbackSpeed);      // fallback s/m
			const t = Math.abs(e.diff) * vel;
			return "-" + t.toFixed(1);
		};
		// ----- ENTRIES PRÉ-COMPUTADOS -----
		type Entry = {
			driver: IDriverInfo,
			diff: number,
			otherRacePos: number,
			lapDiff: number,
			manualAhead: boolean,
			manualBehind: boolean,
		};
		const entries: Entry[] = drivers.map((driver, i) => {
			// Jogador
			if (driver.meta?.DriverInfo.SlotId === userSlot) {
				return {
					driver,
					diff: 0,
					otherRacePos: myRacePos,
					lapDiff: 0,
					manualAhead: false,
					manualBehind: false,
				};
			}
			const otherDist = driver.meta?.LapDistance ?? 0;
			const otherRacePos = driver.meta?.DriverInfo.Position ?? driver.position;
			let diff = myDist - otherDist;
			// Wrap
			if (diff < 0 && i > userIndex) diff += layoutLen;
			if (diff > 0 && i < userIndex) diff -= layoutLen;
			const lapDiff = computeRealLapDiff(
				myLaps, myDist,
				driver.lapsDone ?? 0, otherDist
			);
			return {
				driver,
				diff,
				otherRacePos,
				lapDiff,
				manualAhead:
					diff < 0 &&
					(otherRacePos > myRacePos || lapDiff !== 0),
				manualBehind:
					diff > 0 &&
					(otherRacePos < myRacePos || lapDiff !== 0),
			};
		});
		// MODO METROS
		if (!showSeconds) {
			entries.forEach(e => {
				if (e.driver.meta?.DriverInfo.SlotId === userSlot) {
					e.driver.diff = "";
					return;
				}
				const p = e.diff > 0 ? "+" : "";
				e.driver.diff = `${p}${e.diff.toFixed(0)}m`;
			});
			return;
		}
		// ----- ACÚMULO NATIVO AHEAD -----
		let accFront = 0;
		for (let i = userIndex - 1; i >= 0; i--) {
			const e = entries[i];
			if (e.driver.meta?.DriverInfo.SlotId === userSlot) continue;
			// Só acumula nativo se NÃO for manual
			if (!e.manualAhead) {
				accFront += e.driver.meta?.TimeDeltaBehind ?? 0;
			}
			e.driver.diff = e.manualAhead
				? manualAhead(e)
				: "-" + accFront.toFixed(1);
		}
		// ----- ACÚMULO NATIVO BEHIND -----
		let accBack = 0;
		for (let i = userIndex + 1; i < entries.length; i++) {
			const e = entries[i];
			if (e.driver.meta?.DriverInfo.SlotId === userSlot) continue;
			// Só acumula nativo se NÃO for manual
			if (!e.manualBehind) {
				accBack += e.driver.meta?.TimeDeltaFront ?? 0;
			}
			e.driver.diff = e.manualBehind
				? manualBehind(e)
				: "+" + accBack.toFixed(1);
		}
		// ----- FALLBACKS -----
		entries.forEach(e => {
			const slot = e.driver.meta?.DriverInfo.SlotId;
			if (slot === userSlot) {
				e.driver.diff = "";
				return;
			}
			if (e.driver.diff) return;
			if (e.diff > 0) {
				e.driver.diff = e.manualBehind
					? manualBehind(e)
					: "+" + (e.driver.meta?.TimeDeltaFront ?? 0).toFixed(1);
			} else if (e.diff < 0) {
				e.driver.diff = e.manualAhead
					? manualAhead(e)
					: "-" + (e.driver.meta?.TimeDeltaBehind ?? 0).toFixed(1);
			} else {
				e.driver.diff = "0.0";
			}
		})
		
		// ----- DEBUG: acrescentar metros ao final do diff -----
		/*
		entries.forEach(e => {
			const slot = e.driver.meta?.DriverInfo.SlotId;
			if (slot === userSlot) return; // jogador não exibe diff

			if (!e.driver.diff) return; // se não houver diff, não faz nada

			// e.diff é sempre em metros (+/-)
			const meters = e.diff;
			const mp = meters > 0 ? "+" : "";
			const metersStr = `${mp}${meters.toFixed(0)}m`;

			// concatena ao final do gap existente
			e.driver.diff = `${e.driver.diff} ${metersStr}`;
		});
		*/		
	;
	}

	// RELATIVES: Calculate Distance Between Drivers (Qualify)
	private calculateDiffsQualifyRelative(drivers: IDriverInfo[]) {
		const userSlot = r3e.data.VehicleInfo.SlotId;
		const userIndex = drivers.findIndex(d => d.meta?.DriverInfo.SlotId === userSlot);
		const myDist = r3e.data.LapDistance;
		const layoutLen = r3e.data.LayoutLength;
		const showSeconds = this.props.settings.subSettings.showGapsInSeconds.enabled;
		// ======= Build list of entries =======
		type Entry = {
			driver: IDriverInfo,
			diff: number,
			bestLap: number | null,
		};
		const entries: Entry[] = drivers.map((driver, i) => {
			if (driver.meta?.DriverInfo.SlotId === userSlot) {
				return { driver, diff: 0, bestLap: null };
			}
			const otherDist = driver.meta?.LapDistance ?? 0;
			let diff = myDist - otherDist;
			// WRAP CORRECTION (mesma lógica da Race)
			if (diff < 0 && i > userIndex) diff += layoutLen;
			if (diff > 0 && i < userIndex) diff -= layoutLen;
			const best = driver.meta?.SectorTimeBestSelf.Sector3 ?? null;
			return { driver, diff, bestLap: best && best > 0 ? best : null };
		});
		// ======= Mode: distance (meters) =======
		if (!showSeconds) {
			entries.forEach(e => {
				if (e.driver.meta?.DriverInfo.SlotId === userSlot) {
					e.driver.diff = "";
					return;
				}
				const p = e.diff > 0 ? "+" : "";
				e.driver.diff = `${p}${e.diff.toFixed(0)}m`;
			});
			return;
		}
		// ======= Mode: TIME (seconds) =======
		entries.forEach(e => {
			if (e.driver.meta?.DriverInfo.SlotId === userSlot) {
				e.driver.diff = "";
				return;
			}
			const absDist = Math.abs(e.diff);
			// velocidade média (real ou fallback)
			let velMedia: number;
			if (e.bestLap) {
				velMedia = (0.7*(e.bestLap / layoutLen));   // s por metro * 70%
			} else {
				velMedia = 1 / 50; // fallback → 50 m/s
			}
			const t = absDist * velMedia;
			const prefix = e.diff > 0 ? "+" : "-";
			e.driver.diff = prefix + t.toFixed(1);
		});
	}

	private getStrengthOfField() {
		let sum = 0;
		let count = 0;

		this.formattedDrivers.forEach((driver: IDriverInfo) => {
			const rating = driver.rankingData?.Rating;
			if (typeof rating === "number") {
				sum += rating;
				count++;
			}
		});

		return `${(sum / count / 1000).toFixed(2)}K`;
	}


	private getPlayerPositionText(): string {
		const isntRace = r3e.data.SessionType !== ESession.Race;
		if (isntRace) {
			const bestTime = r3e.data.SectorTimesBestSelf.Sector3;
			return bestTime !== INVALID
				? bestTime > 60
				? formatTime(Math.max(0, bestTime), 'm:ss.SSS')
				: formatTime(Math.max(0, bestTime), 's.SSS')
			: '-';
		}

		const lapTime = r3e.data.LapTimeCurrentSelf;
		return lapTime !== INVALID
			? lapTime > 60
				? formatTime(Math.max(0, lapTime), 'm:ss.SSS')
				: formatTime(Math.max(0, lapTime), 's.SSS')
			: '-';
	}

	// *POSITION BAR* //

	render() {
		const playerIsAlone = this.playerCount === 1;
		if (playerIsAlone && this.props.relative) {
			return null;
		}
		const willOverlapPitMenu =
			this.props.relative && this.pitState === EPitState.Pitting;
		if (willOverlapPitMenu) {
			return null;
		}
		const onlyShowInRace =
			  this.props.relative &&
			  this.sessionType !== ESession.Race &&
			  !this.props.settings.subSettings.showAllSessions.enabled;
			if (onlyShowInRace && !showAllMode) {
			  return null;
			}
		const notInRacePhase = this.sessionPhase < ESessionPhase.Countdown;
		if (notInRacePhase) {
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
			(showAllMode ||
				(this.playerIsFocus &&
				// this.maxIncidentPoints > 0 &&
				sessionName !== _("Practice") &&
				sessionName !== _("Warmup"))
			);
		const warnInc =	showIncPoints && this.myIncidentPoints >= this.maxIncidentPoints * 0.9;

		return (
			<div
				className={classNames(
				"positionBarContainer",
				this.props.relative ? "relative" : "normal",
				{
				shouldShow: !!this.drivers.length || showAllMode,
				gameIsVR: this.vrGame,
				noStandings:
					!this.props.relative &&
					(!this.props.settings.subSettings.showStandings.enabled ||
					((this.isLeaderboard || this.isHillClimb) && !showAllMode)),
				sGapsInSeconds:
					this.props.relative &&
					this.props.settings.subSettings.showGapsInSeconds.enabled,
				sCarNames:
					this.props.relative &&
					this.props.settings.subSettings.showCarNames.enabled,
				sCarLogos:
					this.props.relative &&
					this.props.settings.subSettings.showCarLogos.enabled,
				sClassLogos:
					this.props.relative &&
					this.props.settings.subSettings.showClassLogos.enabled,
				sPitStops:
					this.props.relative &&
					this.props.settings.subSettings.showPitStops.enabled,
				noMultiClass: !this.multiClass,
				}
			)}
			{...widgetSettings(this.props)}
			>
			{(this.props.relative ||
				(!this.props.relative &&
				this.props.settings.subSettings.showStandings.enabled &&
				((!this.isLeaderboard && !this.isHillClimb) || showAllMode))
			) &&
            this.sessionPhase !== INVALID && (
				<div
              	className={classNames("positionBar", this.props.className, {
                gameIsVR: this.vrGame,
			})}
            >
			{times(!this.props.relative ? positionOffset : 0).map((i: number) => {
				return <div key={`empty-${i}`} className="player" />;
			}
				)}
				{this.drivers.map((player, i) => {
					return (
						<PositionEntry
							key={`${player.id}-${i}`}
							player={player}
							relative={this.props.relative}
							settings={this.props.settings}
							// playerPitInfo={eDriverPitInfo}
							singleplayerRace={this.singleplayerRace}
							sessionType={this.sessionType}
							sessionPhase={this.sessionPhase}
							position={this.position}
							multiClass={this.multiClass}
							isLeaderboard={this.isLeaderboard}
							isHillClimb={this.isHillClimb}
							startingLights={this.startingLights}
							startPosition={this.startPositions}
						/>
					);
				})}
				</div>
			)}

			{/*PB: Overall Position / Position Class*/}
			{!this.props.relative &&
			this.props.settings.subSettings.currentPosition.enabled &&
			(showAllMode ||
			(this.position !== INVALID &&
				!this.isLeaderboard &&
				!this.isHillClimb)) && (
			<div
				className={classNames("currentPosition", {
				gameIsVR: this.vrGame,
				})}
				style={{
				left:
					this.props.settings.subSettings.lapTime.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode)
					? "160px"
					: "10px",
				}}
			>
				<div className="label">{_("Position")}</div>
				<span className="mono">
				{showAllMode ? "9/12" : `${this.position}/${this.playerCount}`}
				</span>
			</div>
			)}

			{/*PB: Show Current Position*/}
			{!this.props.relative &&
			this.props.settings.subSettings.currentPosition.enabled &&
			((this.positionClass !== INVALID &&
				this.multiClass &&
				!this.isLeaderboard &&
				!this.isHillClimb) ||
				showAllMode) && (
				<div
				className={classNames("currentPositionClass", {
					gameIsVR: this.vrGame,
				})}
				style={{
					left:
					this.props.settings.subSettings.lapTime.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode)
						? "270px"
						: "120px",
				}}
				>
					<div className="label">{_("Position Class")}</div>
					<span className="mono">
						{showAllMode
						? "3/6"
						: `${this.positionClass}/${this.classDriverCount}`}
					</span>				
				</div>
			)}

			{/*PB: Show Completed Laps*/}
			{!this.props.relative &&
			this.props.settings.subSettings.sessionLaps.enabled &&
			((this.completedLaps > 0 &&
				this.maxLaps === INVALID &&
				!this.isLeaderboard &&
				!this.isHillClimb) ||
				showAllMode) && (
				<div
				className="sessionLaps"
				style={{
					left:
					this.props.settings.subSettings.lapTime.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode)
						? this.props.settings.subSettings.currentPosition.enabled
						? "380px"
						: "160px"
						: this.props.settings.subSettings.currentPosition.enabled
						? "230px"
						: "10px",
					}}
				>
					<div className="label">{_("Completed Laps")}</div>
					<span className="mono">
						{showAllMode ? 6 : this.completedLaps}
					</span>				
				</div>
			)}

			{/*PB: Show Estimated Laps & Estimated Laps Left*/}
			{!this.props.relative &&
			((this.maxLaps === INVALID &&
			this.playerIsFocus &&
			((this.props.settings.subSettings.sessionLapsRemain.enabled &&
				this.actualRoundsLeft > -1) ||
				(this.props.settings.subSettings.sessionLapsTotal.enabled &&
				this.bestLapSelf > 0) ||
				(this.props.settings.subSettings.sessionLapsRemain.enabled &&
				this.actualRoundsLeft > -1 &&
				this.props.settings.subSettings.sessionLapsTotal.enabled &&
				this.bestLapSelf > 0)) &&
			((this.props.settings.subSettings.sessionLapsTotal.enabled &&
				this.bestLapSelf > 0) ||
				(this.props.settings.subSettings.sessionLapsRemain.enabled &&
				this.actualRoundsLeft > -1))) ||
			showAllMode) && (
			<div
				className="sessionLapsRemain"
				style={{
				left:
					this.props.settings.subSettings.lapTime.enabled &&
					(r3e.data.GameInReplay <= 0 || showAllMode)
					? this.props.settings.subSettings.currentPosition.enabled
						? this.props.settings.subSettings.sessionLaps.enabled
						? this.actualRoundsLeft > 99 ||
							Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
							? "490px"
							: "480px"
						: this.actualRoundsLeft > 99 ||
							Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
						? "380px"
						: "370px"
						: this.props.settings.subSettings.sessionLaps.enabled
						? this.actualRoundsLeft > 99 ||
						Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
						? "280px"
						: "270px"
						: this.actualRoundsLeft > 99 ||
						Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
						? "180px"
						: "180px"
					: this.props.settings.subSettings.currentPosition.enabled
					? this.props.settings.subSettings.sessionLaps.enabled
						? this.actualRoundsLeft > 99 ||
						Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
						? "340px"
						: "330px"
						: this.actualRoundsLeft > 99 ||
						Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
						? "230px"
						: "220px"
					: this.props.settings.subSettings.sessionLaps.enabled
					? this.actualRoundsLeft > 99 ||
						Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >=
						100
						? "120px"
						: "110px"
					: "10px",
				width:
					this.actualRoundsLeft > 99 ||
					Math.ceil(this.sessionTimeDuration / this.bestLapSelf) >= 100
					? "180px"
					: "160px",
				}}
			>
				<div className="label">
				{this.props.settings.subSettings.sessionLapsRemain.enabled ||
				this.props.settings.subSettings.sessionLapsTotal.enabled
					? this.props.settings.subSettings.sessionLapsTotal.enabled &&
					(this.bestLapSelf > 0 || showAllMode)
					? !this.props.settings.subSettings.sessionLapsRemain.enabled
						? _("Estimated Laps total")
						: _("Est.L. left / Est.L. total")
					: _("Estimated Laps left")
					: ""}
				</div>
				<span className="mono">
				{this.props.settings.subSettings.sessionLapsTotal.enabled ||
				this.props.settings.subSettings.sessionLapsRemain.enabled
					? this.props.settings.subSettings.sessionLapsTotal.enabled &&
					(this.bestLapSelf > 0 || showAllMode) &&
					this.props.settings.subSettings.sessionLapsRemain.enabled &&
					(this.actualRoundsLeft > -1 || showAllMode)
					? `${showAllMode ? 6 : this.actualRoundsLeft}/${
						showAllMode
							? 12
							: Math.ceil(this.sessionTimeDuration / this.bestLapSelf)
						}`
					: this.props.settings.subSettings.sessionLapsTotal
						.enabled &&
						(this.bestLapSelf > 0 || showAllMode)
					? `${
						showAllMode
							? 12
							: Math.ceil(this.sessionTimeDuration / this.bestLapSelf)
						}`
					: `${showAllMode ? 6 : this.actualRoundsLeft}`
					: ""}
				</span>				
			</div>
			)}

			{/*PB: Show Setrength Of Field*/}
			{!this.props.relative &&
			this.props.settings.subSettings.showSOF.enabled &&
			(!this.singleplayerRace || showAllMode) && (
			<div
				className="strengthOfField"
				style={{
				right:
					this.props.settings.subSettings.sessionTime.enabled &&
					((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
					? showIncPoints
						? this.props.settings.subSettings.showLastLap.enabled
						? this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
							? "585px"
							: "430px"
						: this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
						? "430px"
						: "275px"
						: this.props.settings.subSettings.showLastLap.enabled
						? this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
						? "445px"
						: "290px"
						: this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
						? "290px"
						: "135px"
					: showIncPoints
					? this.props.settings.subSettings.showLastLap.enabled
						? this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
						? "460px"
						: "305px"
						: this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
						? "305px"
						: "150px"
					: this.props.settings.subSettings.showLastLap.enabled
					? this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
						? "320px"
						: "165px"
					: this.props.settings.subSettings.showBestLap.enabled &&
						(r3e.data.GameInReplay <= 0 || showAllMode)
					? "165px"
					: "10px",
				}}
			>
				<div className="label">{_("Strength of Field")}</div>
				<span className="mono">
				{showAllMode ? "2.22K" : this.getStrengthOfField()}
				</span>				
			</div>
			)}

			{/*PB: Show Lap-Time*/}
			{!this.props.relative &&
				this.props.settings.subSettings.lapTime.enabled &&
				(r3e.data.GameInReplay <= 0 || showAllMode) && (
				<div
					className={classNames("currentLapTime", {
					noTime: this.lapTimeCurrentSelf <= 0,
					})}
				>
					<div className="label">{_("Lap time")}</div>
					<span className="mono">
					{this.lapTimeCurrentSelf !== INVALID
						? formatTime(this.lapTimeCurrentSelf, "mm:ss.SSS")
						: "-:--.---"}
					</span>					
				</div>
			)}

			{/*PB: Show Last Lap*/}
			{!this.props.relative &&
				this.props.settings.subSettings.showLastLap.enabled && (
				<div
					className={classNames("lastLap", {
					noTime: !showAllMode && this.lapTimePreviousSelf <= 0,
					})}
					style={{
					color: showAllMode
						? "rgba(255, 255, 255, 1)"
						: !(
							(this.sessionType === 2 && this.completedLaps < 1) ||
							(this.sessionType !== 2 && this.lapTimeBestSelf < 0)
						) && LapEvents.shouldShowLapTime(this.currentSlotId)
						? LapEvents.getLapTimeColor(this.currentSlotId)
						: "rgba(255, 255, 255, 1)",
					right:
						this.props.settings.subSettings.sessionTime.enabled &&
						((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
						? showIncPoints
							? this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
							? "430px"
							: "275px"
							: this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
							? "290px"
							: "135px"
						: showIncPoints
						? this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
							? "305px"
							: "150px"
						: this.props.settings.subSettings.showBestLap.enabled &&
							(r3e.data.GameInReplay <= 0 || showAllMode)
						? "165px"
						: "10px",
					}}
				>
					<div className="label">{_("Last Lap")}</div>
					<span className="mono">
					{this.lapTimePreviousSelf !== -1
						? formatTime(this.lapTimePreviousSelf, "mm:ss.SSS")
						: showAllMode
						? "01:48.023"
						: "-:--.---"}
					</span>					
				</div>
			)}

			{/*PB: Show Best Lap*/}		  
			{!this.props.relative &&
			this.props.settings.subSettings.showBestLap.enabled &&
			(r3e.data.GameInReplay <= 0 || showAllMode) && (
				<div
				className={classNames("bestLap", {
					noTime: !showAllMode && this.bestSelfSector3 <= 0,
				})}
				style={{
					color: "white",
					right:
					this.props.settings.subSettings.sessionTime.enabled &&
					((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
						? showIncPoints
						? "275px"
						: "135px"
						: showIncPoints
						? "150px"
						: "10px",
				}}
				>
					<div className="label">{_("Best Lap")}</div>
					<span className="mono">
						{this.bestSelfSector3 !== -1
						? formatTime(this.bestSelfSector3, "mm:ss.SSS")
						: showAllMode
						? "01:48.023"
						: "-:--.---"}
					</span>				
				</div>
			)}

			{/*PB: Show Incident Points*/}
			{(!this.isLeaderboard && !this.isHillClimb) && !this.props.relative && showIncPoints && (
				<div
				className={classNames("incidentPoints")}
				style={{
					color: warnInc && this.maxIncidentPoints > 1 ? "rgb(228, 50, 50)" : "rgba(255,255,255,1)",
					right:
					this.props.settings.subSettings.sessionTime.enabled &&
					((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
						? "135px"
						: "10px",
				}}
				>
					<div className="label">{_("Incidents")}</div>
					<span className="mono">
						{`${
						showAllMode
							? 135
							: this.myIncidentPoints === -1
								? "N/A"
								: this.myIncidentPoints
						}${showAllMode ? "/"+200 : this.maxIncidentPoints < 1 
							? ""
							: "/"+this.maxIncidentPoints
						}`}								
					</span>
					{(this.sessionType === ESession.Race || showAllMode) && (
						<div className="details">
							{`( ${this.myCutTrackWarnings} ${_("cuts")} )`}
						</div>
					)}
				</div>
			)}

			{/*PB: Show Session-Time*/}
			{!this.props.relative &&
				this.props.settings.subSettings.sessionTime.enabled &&
				((!this.isLeaderboard && !this.isHillClimb) || showAllMode) &&
				this.sessionTimeRemaining !== INVALID && (
				<div className="sessionTime">
					<div className="label">{sessionName}</div>
					<span className="mono">
					<div className="sessionRemainHours">
						{showAllMode
						? "23"
						: formatTime(this.sessionTimeRemaining, "H")}
					</div>
					<div className="sessionRemainHoursText">{`${"H"}`}</div>
					<div className="sessionRemainMinutes">
						{showAllMode
						? "34"
						: formatTime(this.sessionTimeRemaining, "mm")}
					</div>
					<div className="sessionRemainMinutesText">{`${"M"}`}</div>
					<div className="sessionRemainSeconds">
						{showAllMode
						? "56"
						: formatTime(this.sessionTimeRemaining, "ss")}
					</div>
					<div className="sessionRemainSecondsText">{`${"S"}`}</div>
					</span>					
				</div>
				)
			}

			{/*PB: Show Session Duration (# Laps)*/}
			{!this.props.relative &&
			this.props.settings.subSettings.sessionTime.enabled &&
			this.maxLaps !== INVALID && (
				<div className="currentLap">
					<div className="label">{_('Lap')}</div>
					<span className="mono">
						{this.currentLap}/{this.maxLaps}
					</span>					
				</div>
			)}

			</div>
		);
	}
}

{/*STANDINGS BAR & RELATIVES*/}

interface IEntryProps extends React.HTMLAttributes<HTMLDivElement> {
	player: IDriverInfo;
	relative: boolean;
	settings: IWidgetSetting;
	// playerPitInfo: IDriverPitInfo;
	singleplayerRace: boolean;
	sessionType: number;
	sessionPhase: number;
	position: number;
	multiClass: boolean;
	isLeaderboard: boolean;
	isHillClimb: boolean;
	startingLights: number;
	startPosition: IStartPositions;
}

@observer
export class PositionEntry extends React.Component<IEntryProps, {}> {
	constructor(props: IEntryProps) {
		super(props);
	}
	render() {
		const sessionType = this.props.sessionType;
		const sessionPhase = this.props.sessionPhase;
		const gameInReplay = r3e.data.GameInReplay > 0;
		const position = this.props.position;
		const player = this.props.player;
		/*
		const playerPitInfo =
			r3e.data.GameInReplay > 0 &&
			((r3e.data.SessionTimeDuration !== -1 &&
				r3e.data.SessionTimeRemaining <= 0) ||
				(r3e.data.NumberOfLaps !== -1 &&
				r3e.data.CompletedLaps >= r3e.data.NumberOfLaps * 0.9))
				? {}
				: this.props.playerPitInfo;
		*/
		const singleplayerRace = this.props.singleplayerRace;
		const multiClass = this.props.multiClass;
		const isLeaderboard = this.props.isLeaderboard;
		const isHillClimb = this.props.isHillClimb;
		const pitWindow = getTimeUntilPit(r3e.data.NumberOfLaps !== INVALID);
		const startPositions = this.props.startPosition;
		// CN=Car Names and CL=Car Logos
		const showCN =
			this.props.relative &&
			this.props.settings.subSettings.showCarNames.enabled &&
			((singleplayerRace && !showAllMode) ||
			((!singleplayerRace || showAllMode) &&
				!this.props.settings.subSettings.showRanking.enabled)) &&
			!this.props.settings.subSettings.showCarLogos.enabled;
		const showCL =
			this.props.relative &&
			(this.props.settings.subSettings.showCarLogos.enabled ||
			(this.props.settings.subSettings.showRanking.enabled &&
			(!singleplayerRace || showAllMode) &&
			this.props.settings.subSettings.showCarNames.enabled));
		let returnWidth = 288;
		if (this.props.relative) {
			if (this.props.settings.subSettings.showGapsInSeconds.enabled) {
			returnWidth = returnWidth - 10;
			}
			if (showCN) {
			returnWidth = returnWidth + 51;
			}
			if (
			(showAllMode || sessionType === ESession.Race) &&
			this.props.settings.subSettings.showPitStops.enabled
			) {
			returnWidth = returnWidth + 26;
			}
			if (
			showCL &&
			this.props.settings.subSettings.showRanking.enabled &&
			(!singleplayerRace || showAllMode)
			) {
			returnWidth = returnWidth + 25;
			}
		}
		const relativeWidth = `${returnWidth}px`;
		const startingLights = this.props.startingLights;
		const gainLossPermanentBar = eGainLossPermanentBar;
		const startPosition = showAllMode
			? isEven(position)
			? position + 1
			: position - 1
			: startPositions[player.id] === undefined
			? -1
			: startPositions[player.id];
		const showGainLoss =
			!this.props.relative &&
			this.props.settings.subSettings.showPosGainLoss.enabled &&
			((sessionType === ESession.Race &&
			startingLights === 6 &&
			startPosition !== -1 &&
			(player.lapsDone > 0 &&
				LapEvents.shouldShowLapTime(player.id) ||
				gainLossPermanentBar)) ||
				showAllMode);
		const posGainedLost =
		startPosition !== -1 ? Math.abs(startPosition - player.position) : -1;

		// If Relative/Standings are Off or is not HillClimb/LeaderBoard
		if (
		  this.props.relative ||
		  (!this.props.relative &&
			this.props.settings.subSettings.showStandings.enabled &&
			((!isLeaderboard && !isHillClimb) || showAllMode))
		) {	

		return (
			<div className={classNames('player', {
				isUser: player.isUser,
				lapping: player.lapDiff < 0,
				sameLap: player.lapDiff === 0,
				lapped: player.lapDiff > 0,
				validLap: player.validLap > 0 && player.currentTime > 0,
				noValidLap: player.validLap < 1,
				noRaceSession: showAllMode || sessionType !== ESession.Race,
				sGapsInSeconds:
					this.props.relative &&
					this.props.settings.subSettings.showGapsInSeconds.enabled,
				sCarNames: this.props.relative && showCN,
				sCarLogos: this.props.relative && showCL,
				sClassLogos:
					this.props.relative &&
					this.props.settings.subSettings.showClassLogos.enabled,
				sRankData:
					this.props.relative &&
					(!singleplayerRace || showAllMode) &&
					this.props.settings.subSettings.showRanking.enabled,
				sPitStops:
					this.props.relative &&
					this.props.settings.subSettings.showPitStops.enabled,
				sPosGainLoss:
					!this.props.relative &&
					this.props.settings.subSettings.showPosGainLoss.enabled,
					}
				)}
				style={{
					width: this.props.relative ? relativeWidth : "148px",
				}}
			>

				{/*RELATIVE: Position Color*/}				
				<div
				className="position"
					style={{
						// Yellow flag mark
						color: FlagEvents.shouldHighlight(player.id)
								? "yellow"
								: "#fff",
						width: !this.props.relative ? "25px" : undefined,
						top: !this.props.relative && showGainLoss ? "-3px" : undefined,
					}}
				>

				{/*STANDINGS: Show Overall OR Class Positions*/}			
				{this.props.settings.subSettings.showOverallPos.enabled
				? player.position
				: player.positionClass}
				</div>{""}

				{/*STANDINGS: Show Position Gain And Loss*/}	
				{!this.props.relative && showGainLoss && (
				<div className="gainLossImg">
					{posGainedLost > 0 && (
					<img src={
						startPosition - player.position > 0
						? require("./../../img/posGain.svg")
						: require("./../../img/posLoss.svg")
					}
					width="10"
					height="10"
					/>
				)}
				</div>)}
				{!this.props.relative && showGainLoss && (
				<div
					className="positionGainLoss"
					style={{
					color: "rgba(255, 255, 255, 1)",
					width: posGainedLost > 0 ? undefined : "25px",
					textAlign: posGainedLost > 0 ? "right" : "center",
					}}
				>
					{posGainedLost > 0 ? posGainedLost : "-"}
					</div>
				)}

				{/*STANDINGS: Mandatory Pit-Stop*/}
				{!this.props.relative &&
				sessionType === 2 &&
				sessionPhase >= 5 &&
				player.mandatoryPit !== -1 &&
				pitWindow <= 0 &&
				isRange(player.finishStatus, 0, 1) && (
					<div
					className="pitMandatoryIndicator"
					style={{
						position: "absolute",
						display: "inline-block",
						background:
						player.mandatoryPit === 2
							? "rgba(57, 216, 73, 0.8)"
							: "rgba(214, 39, 39, 0.8)",
						width: "5px",
						left: "25px",
						height: "40px",
						lineHeight: "40px",
						verticalAlign: "top",
					}}
					/>
				)}

				{/*STANDINGS: Checkered flag*/}
				{!this.props.relative &&
					(player.finishStatus === 1 ||
					(sessionType !== ESession.Race &&
						player.pitting &&
						sessionPhase === 6)) ? (
					<div className="cheqFlag">
						<img
						className="cheqFlagImg"
						src={require("./../../img/checkered.svg")}
						width="21"
						height="25"
						/>
					</div>
					) : null
				}

				{/*RELATIVE & STANDINGS: Driver's name*/}		
				<div className="name" 
				style = {{
				// YellowFlag mark
					color: FlagEvents.shouldHighlight(player.id)
						? "Yellow"
						: undefined,
				}}>
					{this.props.relative
						? this.props.settings.subSettings.showCarNames.enabled ||
						this.props.settings.subSettings.showCarLogos.enabled ||
						(this.props.settings.subSettings.showRanking.enabled &&
						(!singleplayerRace || showAllMode))
						? player.shortName
						: player.name
						: this.props.settings.subSettings.showStandings.enabled &&
						((!isLeaderboard && !isHillClimb) || showAllMode)
						? player.shortName
						: ""
					}
				</div>

				{/*RELATIVE: Rank Data*/}
				{this.props.relative &&
				(!singleplayerRace || showAllMode) &&
				this.props.settings.subSettings.showRanking.enabled && (
					<div
					className="rankData"
					style={{
						background: eRankInvertRelative
						? undefined
						: "rgba(255, 255, 255, 1)",
						color: eRankInvertRelative ? undefined : "rgba(0, 0, 0, 1)",
						fontWeight: eRankInvertRelative ? undefined : "bold",
					}}
					>
					{`${
						showAllMode
						? 2.22
						: (player.rankingData.Rating / 1000).toFixed(2)
					}K | ${
						showAllMode ? 94.6 : player.rankingData.Reputation.toFixed(1)
					}`}
					</div>
				)}

				{/*RELATIVE: Show Car Name & Manufacturer Logo(Car Logo)*/}
				{this.props.relative && showCN && (
					<div className="carName">{getCarName(player.modelId, player.name)}</div>
				)}
				{this.props.relative && showCL && (
					<div className="carLogo">
					<img src={player.logoUrl} width="18" height="18" />
					</div>
				)}

				{/*RELATIVE: Show Class Logos*/}
				{this.props.relative &&
				this.props.settings.subSettings.showClassLogos.enabled && (
				<div className="classLogo">
					<img src={player.classUrl} width="20" height="20" />
				</div>
				)}

				{/*RELATIVE: GAP BETWEEN DRIVERS*/}
				{this.props.relative && (
					<div className="diff mono"
					style = {{
						color: FlagEvents.shouldHighlight(player.id)
						? "Yellow"
						: undefined,
					}}
					>
						{player.diff}
					</div>
					)
				}

				{/*STANDINGS: GAP BETWEEN DRIVERS*/}
				{!this.props.relative &&
				this.props.settings.subSettings.showStandings.enabled &&
				((!isLeaderboard && !isHillClimb) || showAllMode) && (
					<div
					className="diff mono"
					style={{
						color: (() => {
						// 1) PRIORIDADE — LastLap popup
						if (this.props.settings.subSettings.showLastLaps.enabled &&
							LapEvents.shouldShowLapTime(player.id)) {
							return LapEvents.getLapTimeColor(player.id);
						}

						// 2) NOVO — Yellow highlight
						if (FlagEvents.shouldHighlight(player.id)) {
							return "yellow";
						}

						// 3) Default
						return undefined;
						})()
					}}
					>
					{
						// Texto exibido
						this.props.settings.subSettings.showLastLaps.enabled 
						? (LapEvents.shouldShowLapTime(player.id)
							? LapEvents.getLapTimeFormatted(player.id)
							: player.diff)
						: player.diff
					}
					</div>
				)}


				{/*RELATIVE & STANDINGS: Class Colors*/}
				{
				(
					<div
						className="classStyle"
						style={{
						borderTop:
							!this.props.relative
							? multiClass
								? `${
								FlagEvents.shouldHighlight(player.id)
								? "3px solid yellow"
								: `3px solid ${player.classColor}`
							}`
							: FlagEvents.shouldHighlight(player.id)
								? "3px solid yellow"
								: '3px solid #252525ff'
							: undefined,							
						borderLeft:
							this.props.relative && multiClass
							? `4px solid ${player.classColor}`
							: undefined,
						}}
					/>
				)}

				{/*STANDINGS: Pit-Stop Status Info*/}
				{
					(() => {
						// Atalhos e segurança
						if (
						this.props.relative ||
						player.finishStatus > 0 ||
						!this.props.settings.subSettings.showPitStatus.enabled ||
						(sessionType !== ESession.Race && player.pitting && sessionPhase === 6)
						) {
						return null;
						}
						const now = performance.now();
						const st = PitEvents.getState(player.id);
						const inPit = st?.inPitlane ?? false;
						const enterTs = st?.timeEnterPitlane ?? null;
						const stopTs = st?.timeStopOnSpot ?? null;
						const leaveTs = st?.timeLeaveSpot ?? null;
						const exitTs = st?.timeExitPitlane ?? null;
						const spotDur = st?.spotDuration ?? null;
						const pitDur = st?.pitTotalDuration ?? null;
						// Configs
						const showAll = showAllMode;
						const showPitTime = this.props.settings.subSettings.showPitTime.enabled;
						const autoHide = this.props.settings.subSettings.autoHidePitTime.enabled;
						const showPenalties = this.props.settings.subSettings.showPenalties.enabled;
						// Aux
						const exitRecent = exitTs ? now - exitTs <= 7500 : false;
						const shouldShowExitTime =
						exitTs && (autoHide ? exitRecent : !showPenalties || exitRecent);
						// Formatting helper
						const fmt = (t: number | null) =>
						t != null
							? fancyTimeFormatGap(t, 1, 1, false, true)
							: fancyTimeFormatGap(0, 1, 1, false, true);

						// ---------- CASE A: currently in pits (or forced showAllMode) ----------
						if (inPit || showAll) {
						const showTimes =
							showPitTime &&
							(showAll || (enterTs !== null && sessionType === ESession.Race));
						const bg =
							sessionType !== ESession.Race
							? "rgba(4, 132, 192, 0.9)"
							: showAll || (stopTs && stopTs > 0)
								? showAll || (leaveTs && leaveTs > 0)
									? "rgba(50, 163, 62, 0.9)" // leaving
									: "rgba(199, 85, 44, 0.9)" // stopped
								: "rgba(4, 132, 192, 0.9)";   // entering
						const laneTime = enterTs
							? showAll
							? 52.9
							: (now - enterTs) / 1000
							: null;
						if (showTimes) {
							return (
							<div
								className="pitting"
								style={{ background: bg, color: "#fff", width: "25px" }}
							>
								<div className="pittinga">PIT</div>
								<div className="pittime">
								{showAll ? 52.9 : laneTime != null ? fmt(laneTime) : fmt(0)}
								</div>
								<div
								className="pittimea"
								style={{
									color:
									showAll || (stopTs && stopTs > 0)
										? showAll || (leaveTs && leaveTs > 0)
										? "rgb(109, 255, 123)"
										: "rgba(255, 255, 255, 1)"
										: "rgba(255, 255, 255, 0)",
									background:
									showAll || (stopTs && stopTs > 0)
										? "rgba(12, 64, 141, 0.9)"
										: "rgba(0, 100, 255, 0)",
								}}
								>
								{showAll || (stopTs && stopTs > 0)
									? showAll || !(leaveTs && leaveTs > 0)
									? showAll
										? 13.5
										: fmt((now - stopTs!) / 1000)
									: fmt(((leaveTs as number) - (stopTs as number)) / 1000)
									: " "}
								</div>
							</div>
							);
						}
						// IN PIT but no time
						return (
							<div
							className="pitting"
							style={{ background: bg, color: "#fff", width: "25px" }}
							>
							<div className="pittinga">PIT</div>
							</div>
						);
						}

						// ---------- CASE B: mandatory pit logic (shown when NOT in pits) ----------
						if (
						sessionType === ESession.Race &&
						(player.mandatoryPit !== -1 ||
							(gameInReplay && sessionType === ESession.Race))
						) {
						const isGreen = player.mandatoryPit === 2;
						const bg = isGreen ? "rgba(40, 168, 53, 0.8)" : "rgba(204, 90, 49, 0.8)";
						const hasExit = exitTs != null;
						const hasEnter = enterTs != null;
						const total =
							pitDur ??
							(hasEnter && hasExit ? (exitTs! - enterTs!) / 1000 : null);
						const spot =
							spotDur ??
							(stopTs && leaveTs ? (leaveTs - stopTs) / 1000 : null);

						// ---- EXIBE TEMPOS + BADGE IMEDIATAMENTE ----
						if (hasExit && shouldShowExitTime) {
							return (
							<div
								className="pitting"
								style={{ background: bg, color: "#fff", width: "25px" }}
							>
								{/* BADGE — sempre aparece imediatamente */}
								<div className="pittinga">{player.numPitstops}</div>
								{/* Tempo total */}
								<div className="pittime">{fmt(total)}</div>
								{/* Spot time */}
								<div
								className="pittimea"
								style={{
									color: spot != null ? "rgb(29, 143, 40)" : "rgba(0,221,23,0)",
									background:
									spot != null
										? "rgba(13, 82, 185, 0.8)"
										: "rgba(0,100,255,0)",
								}}
								>
								{spot != null ? fmt(spot) : " "}
								</div>
							</div>
							);
						}
						// ----- SEM TEMPOS → mostra só o badge -----
						if (player.numPitstops > 0) {
							return (
							<div
								className="pitting"
								style={{ background: bg, color: "#fff", width: "25px" }}
							>
								<div className="pittinga">{player.numPitstops}</div>
							</div>
							);
						}
						return null;
						}

						// ---------- CASE C: regular post-pit display for normal races ----------
						if (sessionType === ESession.Race && player.numPitstops > 0) {
						if (
							showPitTime &&
							exitTs &&
							(autoHide ? exitRecent : !showPenalties || exitRecent)
						) {
							const total =
							pitDur ?? (enterTs && exitTs ? (exitTs - enterTs) / 1000 : null);
							const spot =
							spotDur ?? (stopTs && leaveTs ? (leaveTs - stopTs) / 1000 : null);

							return (
							<div
								className="pitting"
								style={{
								background: "rgba(40, 168, 53, 0.8)",
								color: "#fff",
								width: "25px",
								}}
							>
								<div className="pittinga">{player.numPitstops}</div>
								<div className="pittime">{fmt(total)}</div>
								<div
								className="pittimea"
								style={{
									color: spot ? "rgba(29, 143, 40)" : "rgba(0,221,23,0)",
									background: spot ? "rgba(13, 82, 185, 0.8)" : "rgba(0,100,255,0)",
								}}
								>
								{spot ? fmt(spot) : " "}
								</div>
							</div>
							);
						}
						return (
							<div
							className="pitting"
							style={{
								background: "rgba(40, 168, 53, 0.8)",
								color: "#fff",
								width: "25px",
							}}
							>
							<div className="pittinga">{player.numPitstops}</div>
							</div>
						);
						}
						return null;
					})()
				}

				{/*RELATIVES: Pit-Stop Status Info*/}
				{this.props.relative &&
				(sessionType === ESession.Race || showAllMode) &&
				this.props.settings.subSettings.showPitStops.enabled && (
					<div
					className={classNames("stopStatus", {
						textShadow: player.numStops > 0,
					})}
					style={{
						background:
						player.mandatoryPit === 2
							? "rgb(81, 206, 53)"
							: player.mandatoryPit === 0 || player.mandatoryPit === 1
							? "rgb(209, 63, 63)"
							: player.inPit
							? "rgb(209, 63, 63)"
							: "dimgray",
						color:
						player.numStops > 0
							? "white"
							: player.inPit
							? "white"
							: player.mandatoryPit === 2
							? "rgb(81, 206, 53)"
							: player.mandatoryPit === 0 || player.mandatoryPit === 1
							? "rgb(209, 63, 63)"
							: player.inPit
							? "rgb(209, 63, 63)"
							: "dimgray",
					}}
					>
					{player.inPit ? `${"PIT"}` : player.numStops}
					</div>
				)}

				{/*STANDINGS: Penalties Info*/}
				{!this.props.relative &&
				this.props.settings.subSettings.showPenalties.enabled &&
				(showAllMode ||
					(sessionType === ESession.Race &&
					player.finishStatus === 0)) &&

				(() => {
					// ==== PIT / PENALTY VISIBILITY CONTROL USING PitEvents ====
					const inPit = PitEvents.isInPitlane(player.id);
					const highlight = PitEvents.shouldHighlight(player.id);
					// Se não estiver no modo de teste (showAll) ocultamos penalidades quando:
					// - Está no pitlane
					// - Ainda está no período de highlight pós-pit
					if (!showAllMode) {
					if (inPit) return null;
					if (highlight) return null;
					}
					// ==== FILTRAR PENALIDADES ATIVAS ====
					const active = Object.keys(player.penalties).filter((key) => {
					const p = player.penalties[key];
					switch (key) {
						case "DriveThrough":
						case "StopAndGo":
						case "PitStop":
						return p === 0; // ativa
						case "SlowDown":
						case "TimeDeduction":
						return p > 0;
						default:
						return false;
					}
					});
					if (!active.length) return null;
					// ==== RENDER ====
					return active.map((key) => (
					<div key={key} className="penalties">
						<div className="penaltiesText">
						{key === "DriveThrough"
							? "DT"
							: key === "PitStop"
							? "PS"
							: key === "SlowDown"
							? "SD"
							: key === "StopAndGo"
							? "SG"
							: "TD"}
						</div>
					</div>
					));
				})()
				}

				{" "}
			</div>
			);
		}
		return null;
	}	
}