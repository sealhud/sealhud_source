import { LapEvents } from "../../lib/LapEvents";
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
	IDriverPitInfo,
	eDriverLapInfo,
	IDriverLapInfo,
	eDriverNum,
	eDriverPitInfo,
	eIsLeaderboard,
	eIsHillClimb,
	eGainLossPermanentBar,
	eRankInvertRelative
} from '../app/app';
import { observer } from 'mobx-react';
import { personalBestTime, eRoundsLeft } from "../fuelDetail/fuelDetail";
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
	@observable accessor lapInfoData: IDriverLapInfo = [];
	@observable accessor startPositions: IStartPositions = {};	
	@observable accessor lapTimePreviousSelf = -1;
	@observable accessor lapTimeBestSelf = -1;
	@observable accessor bestSelfSector3 = -1;
	@observable accessor completedLaps = -1;
	@observable accessor currentSlotId = -1;
	@observable accessor myIncidentPoints = -1;
	@observable accessor playerIsFocus = false;
	@observable accessor maxIncidentPoints = -1;
	@observable accessor actualRoundsLeft = -1;
	@observable accessor bestLapSelf = -1;
	@observable accessor sessionTimeDuration = -1;
	@observable accessor layoutLength = -1;
	@observable accessor pitWindowStatus = -1;
	@observable accessor lastCheck = 0;
	@observable accessor lapDistance = -1;
	@observable accessor notInRacePhase = true;

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
        personalBestTime > -1
          ? personalBestTime
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
		this.actualRoundsLeft = eRoundsLeft > -1 ? eRoundsLeft : getRoundsLeft(this.lapTimeBestSelf);
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
		this.lapInfoData = eDriverLapInfo;
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
		this.classDriverCount = 0;
		this.playerCount = r3e.data.DriverData.length;
		this.multiClass = false;
		this.singleplayerRace = false;
		this.startingLights = r3e.data.StartLights;
		let driverData = this.props.relative
			? this.props.settings.subSettings.showAllSessions.enabled
			? r3e.data.DriverData.map(this.formatDriverData).filter(
				this.filterDriverDataQualy
				)
			: r3e.data.DriverData.map(this.formatDriverData).filter(
				this.filterDriverData
				)
			: r3e.data.DriverData.map(this.formatDriverData).filter(
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
      // Construir array circular
      const circular = driverData.concat(driverData).concat(driverData);
      // Centro do bloco no array circular
      const center = N + playerIndex;
      // Cortar exatamente eDriverNum acima e abaixo
      const start = center - eDriverNum;
      const end   = center + eDriverNum + 1;
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
        if (
          !this.singleplayerRace &&
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
			classColor: getClassColor(driver.DriverInfo.ClassPerformanceIndex),
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

	// Function used to check if lapDiff is "real"
	private computeRealLapDiff = (
			meLaps: number, meDist: number,
			otherLaps: number, otherDist: number
		) => {
			let lapDiff = meLaps - otherLaps;
			if (lapDiff < 0 && otherDist < meDist) lapDiff++;
			else if (lapDiff > 0 && meDist < otherDist) lapDiff--;
			return lapDiff;
		};

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
			const lapDiff = this.computeRealLapDiff(
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
			const lapDiff = this.computeRealLapDiff(
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
		// Evita aparecer lapTime do usuário via delta nativo bugado do RR
		const metaUser = drivers[userIndex]?.meta;
		if (metaUser) {
			metaUser.TimeDeltaBehind = 0;
			metaUser.TimeDeltaFront = 0;
		}
		// ----- CÁLCULOS MANUAIS -----
		const fallbackSpeed = 50; // m/s aproximado
		const manualBehind = (e: Entry) => {
			const best = e.driver.meta?.SectorTimeBestSelf.Sector3;
			const vel = (best && best > 0) ? best / layoutLen : null;
			const t = Math.abs(e.diff) * (vel ?? (1 / fallbackSpeed));
			return "+" + t.toFixed(1);
		};
		const manualAhead = (e: Entry) => {
			const best = e.driver.meta?.SectorTimeBestSelf.Sector3;
			const vel = (best && best > 0) ? best / layoutLen : null;
			const t = Math.abs(e.diff) * (vel ?? (1 / fallbackSpeed));
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
			if (diff < 0 && i > userIndex) diff += layoutLen;
			if (diff > 0 && i < userIndex) diff -= layoutLen;
			const lapDiff = this.computeRealLapDiff(
				myLaps, myDist,
				driver.lapsDone ?? 0, otherDist
			);
			return {
				driver,
				diff,
				otherRacePos,
				lapDiff,
				manualAhead: diff < 0 && (otherRacePos > myRacePos || lapDiff !== 0),
				manualBehind: diff > 0 && (otherRacePos < myRacePos || lapDiff !== 0),
			};
		});
		// ----- MODO METROS -----
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
			accFront += e.driver.meta?.TimeDeltaBehind ?? 0;
			e.driver.diff = e.manualAhead
				? manualAhead(e)
				: "-" + accFront.toFixed(1);
		}
		// ----- ACÚMULO NATIVO BEHIND -----
		let accBack = 0;
		for (let i = userIndex + 1; i < entries.length; i++) {
			const e = entries[i];
			if (e.driver.meta?.DriverInfo.SlotId === userSlot) continue;
			accBack += e.driver.meta?.TimeDeltaFront ?? 0;
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
		});
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
				velMedia = e.bestLap / layoutLen;   // s por metro
			} else {
				velMedia = 1 / 50; // fallback → 50 m/s
			}
			const t = absDist * velMedia;
			const prefix = e.diff > 0 ? "+" : "-";
			e.driver.diff = prefix + t.toFixed(1);
		});
	}

	private getStrengthOfField() {
		let sumUp = 0;
		let count = 0;
		this.drivers.forEach((driver) => {
		sumUp += driver.rankingData.Rating;
		count += 1;
		});
		return `${(sumUp / count / 1000).toFixed(2)}K`;
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
			this.maxIncidentPoints > 0 &&
			sessionName !== _("Practice") &&
			sessionName !== _("Warmup"))
		);
		const warnInc =
		showIncPoints && this.myIncidentPoints >= this.maxIncidentPoints * 0.9;

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
							playerPitInfo={eDriverPitInfo}
							singleplayerRace={this.singleplayerRace}
							sessionType={this.sessionType}
							sessionPhase={this.sessionPhase}
							position={this.position}
							multiClass={this.multiClass}
							isLeaderboard={this.isLeaderboard}
							isHillClimb={this.isHillClimb}
							startingLights={this.startingLights}
							playerLapInfo={eDriverLapInfo}
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
				<span className="mono">
				{showAllMode ? "9/12" : `${this.position}/${this.playerCount}`}
				</span>
				<div className="label">{_("Position")}</div>
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
				<span className="mono">
					{showAllMode
					? "3/6"
					: `${this.positionClass}/${this.classDriverCount}`}
				</span>
				<div className="label">{_("Position Class")}</div>
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
				<span className="mono">
					{showAllMode ? 6 : this.completedLaps}
				</span>
				<div className="label">{_("Completed Laps")}</div>
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
				<span className="mono">
				{showAllMode ? "2.22K" : this.getStrengthOfField()}
				</span>
				<div className="label">{_("Strength of Field")}</div>
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
					<span className="mono">
					{this.lapTimeCurrentSelf !== INVALID
						? formatTime(this.lapTimeCurrentSelf, "mm:ss.SSS")
						: "-:--.---"}
					</span>
					<div className="label">{_("Lap time")}</div>
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
						) && nowCheck <= this.lapInfoData[this.currentSlotId][2]
						? `rgba(${this.lapInfoData[this.currentSlotId][3]}, ${
							this.lapInfoData[this.currentSlotId][4]
						}, ${this.lapInfoData[this.currentSlotId][5]}, 1)`
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
					<span className="mono">
					{this.lapTimePreviousSelf !== -1
						? formatTime(this.lapTimePreviousSelf, "mm:ss.SSS")
						: showAllMode
						? "01:48.023"
						: "-:--.---"}
					</span>
					<div className="label">{_("Last Lap")}</div>
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
				<span className="mono">
					{this.bestSelfSector3 !== -1
					? formatTime(this.bestSelfSector3, "mm:ss.SSS")
					: showAllMode
					? "01:48.023"
					: "-:--.---"}
				</span>
				<div className="label">{_("Best Lap")}</div>
				</div>
			)}

			{/*PB: Show Incident Points*/}
			{!this.props.relative && showIncPoints && (
				<div
				className={classNames("incidentPoints")}
				style={{
					color: warnInc ? "rgba(255, 0, 0, 1)" : "rgba(255,255,255,1)",
					right:
					this.props.settings.subSettings.sessionTime.enabled &&
					((!this.isLeaderboard && !this.isHillClimb) || showAllMode)
						? "135px"
						: "10px",
				}}
				>
				<span className="mono">
					{`${
					showAllMode
						? 135
						: this.myIncidentPoints === -1
						? "N/A"
						: this.myIncidentPoints
					}/${showAllMode ? 200 : this.maxIncidentPoints}`}
				</span>
				<div className="label">{_("Incidents")}</div>
				</div>
			)}

			{/*PB: Show Session-Time*/}
			{!this.props.relative &&
				this.props.settings.subSettings.sessionTime.enabled &&
				((!this.isLeaderboard && !this.isHillClimb) || showAllMode) &&
				this.sessionTimeRemaining !== INVALID && (
				<div className="sessionTime">
					<span className="mono">
					<div className="sessionRemainHours">
						{showAllMode
						? "2"
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
					<div className="label">{sessionName}</div>
				</div>
				)
			}

			</div>
		);
	}
}

{/*STANDINGS BAR & RELATIVES*/}

interface IEntryProps extends React.HTMLAttributes<HTMLDivElement> {
	player: IDriverInfo;
	relative: boolean;
	settings: IWidgetSetting;
	playerPitInfo: IDriverPitInfo;
	playerLapInfo: IDriverLapInfo;
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
		const playerPitInfo =
			r3e.data.GameInReplay > 0 &&
			((r3e.data.SessionTimeDuration !== -1 &&
				r3e.data.SessionTimeRemaining <= 0) ||
				(r3e.data.NumberOfLaps !== -1 &&
				r3e.data.CompletedLaps >= r3e.data.NumberOfLaps * 0.9))
				? {}
				: this.props.playerPitInfo;
		const playerLapInfo = this.props.playerLapInfo;
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
			((player.lapsDone > 0 &&
				playerLapInfo[player.id] !== undefined &&
				nowCheck <= playerLapInfo[player.id][2]) ||
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
					color: this.props.relative ? "#fff" : undefined,
					width: !this.props.relative ? "25px" : undefined,
					top: !this.props.relative && showGainLoss ? "-10px" : undefined,
					}}
				>

				{/*STANDINGS: Show Overall OR Class Positions*/}			
				{this.props.settings.subSettings.showOverallPos.enabled
				? player.position
				: player.positionClass}
				</div>{" "}

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
							? "rgba(0, 221, 23, 0.8)"
							: "rgba(255, 0, 0, 0.8)",
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
						src={require("./../../img/checkered.png")}
						width="21"
						height="25"
						/>
					</div>
					) : null
				}

				{/*RELATIVE: Driver's name*/}		
				<div className="name">
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
					}K / ${
						showAllMode ? 94.6 : player.rankingData.Reputation.toFixed(1)
					}`}
					</div>
				)}

				{/*RELATIVE: Show Car Name & Manufacturer Logo(Car Logo)*/}
				{this.props.relative && showCN && (
					<div className="carName">{getCarName(player.modelId)}</div>
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
					<div className="diff mono">
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
							color: 
							this.props.settings.subSettings.showLastLaps.enabled 
							? (
								LapEvents.shouldShowLapTime(player.id)
								? LapEvents.getLapTimeColor(player.id)
								: undefined
							) : undefined
						}}
					>{this.props.settings.subSettings.showLastLaps.enabled 
						? (LapEvents.shouldShowLapTime(player.id)
						? LapEvents.getLapTimeFormatted(player.id)
						: player.diff) : player.diff}
					</div>
					)
				}

				{/*RELATIVE & STANDINGS: Class Colors*/}
				{multiClass && (
					<div
						className="classStyle"
						style={{
							borderTop:
							!this.props.relative && multiClass
							? `3px solid ${player.classColor}`
							: `0`,
							borderLeft:
							this.props.relative && multiClass
							? `4px solid ${player.classColor}`
							: undefined,
						}}
					/>
				)}

				{/*STANDINGS: Pit-Stop Status Info*/}
				{this.props.relative ||
				player.finishStatus > 0 ||
				!this.props.settings.subSettings.showPitStatus.enabled ||
				(sessionType !== ESession.Race &&
				player.pitting &&
				sessionPhase === 6) ? null : player.pitting > 0 || showAllMode ? (
				// Showing when In Pits and time should be shown
				this.props.settings.subSettings.showPitTime.enabled &&
				(showAllMode ||
					(playerPitInfo[player.id] !== undefined &&
					sessionType === ESession.Race &&
					playerPitInfo[player.id][2] >= 0)) ? (
					<div
					className={classNames("pitting", {
						noShadow: false,
					})}
					style={{
						background:
						showAllMode || playerPitInfo[player.id][3] > 0
							? showAllMode || playerPitInfo[player.id][4] > 0
							? "rgba(0, 221, 23, 0.8)"
							: "rgba(255, 70, 0, 0.8)"
							: "rgba(0, 176, 255, 0.8)",
						color: "#fff",
						width: "25px",
					}}
					>
					<div className="pittinga">{`${"PIT"}`}</div>
					<div
						className={classNames("pittime", {
						noShadow: false,
						})}
					>
						{`${showAllMode	? 52.9 : fancyTimeFormatGap(
							(nowCheck - playerPitInfo[player.id][2]) / 1000, 1,1,false,true) // .toFixed(1)
						}`}
					</div>
					<div
						className={classNames("pittimea", {
						noShadow: showAllMode
							? false
							: playerPitInfo[player.id][3] <= 0,
						})}
						style={{
						color:
							showAllMode || playerPitInfo[player.id][3] > 0
							? showAllMode || playerPitInfo[player.id][4] > 0
								? "rgba(0, 221, 23, 1)"
								: "rgba(255, 255, 255, 1)"
							: "rgba(255, 255, 255, 0)",

						background:
							showAllMode || playerPitInfo[player.id][3] > 0
							? "rgba(0, 100, 255, 0.8)"
							: "rgba(0, 100, 255, 0)",
						}}
					>
						{showAllMode || playerPitInfo[player.id][3] > 0
						? showAllMode || playerPitInfo[player.id][4] <= 0
							? `${showAllMode ? 13.5	: fancyTimeFormatGap(
								(nowCheck - playerPitInfo[player.id][3]) / 1000,1,1,false,true) // .toFixed(1)
							}`
							: `${
								fancyTimeFormatGap(
								(playerPitInfo[player.id][4] -
									playerPitInfo[player.id][3]) / 1000,1,1,false,true) // .toFixed(1)
							}`
						: "|"}
					</div>
					</div>
					) : (
						// Showing when in Pits but no time should be shown
						<div
						className={classNames("pitting", {
							noShadow: false,
						})}
						style={{
							background:
							showAllMode ||
							(playerPitInfo[player.id] !== undefined &&
								playerPitInfo[player.id][3] > 0)
								? showAllMode ||
								(playerPitInfo[player.id] !== undefined &&
									playerPitInfo[player.id][4] > 0)
								? "rgba(0, 221, 23, 0.8)"
								: "rgba(255, 70, 0, 0.8)"
								: "rgba(0, 176, 255, 0.8)",
							color: "#fff",
							width: "25px",
						}}
						>
						<div className="pittinga">{`${"PIT"}`}</div>
						</div>
					)
					) : // Shown when not in Pits
					sessionType === ESession.Race &&
					(player.mandatoryPit !== -1 ||
						(gameInReplay && sessionType === ESession.Race)) ? (
					// Shown when Mandatory is active
					playerPitInfo[player.id] !== undefined &&
					playerPitInfo[player.id][5] > 0 &&
					((nowCheck - playerPitInfo[player.id][5] <= 7500 &&
						this.props.settings.subSettings.autoHidePitTime.enabled) ||
						(!this.props.settings.subSettings.autoHidePitTime.enabled &&
						!this.props.settings.subSettings.showPenalties.enabled) ||
						(!this.props.settings.subSettings.autoHidePitTime.enabled &&
						nowCheck - playerPitInfo[player.id][5] <= 7500 &&
						this.props.settings.subSettings.showPenalties.enabled)) ? (
						// Shown when Times should be shown and and it was a actual stop
						(this.props.settings.subSettings.showPitTime.enabled &&
						player.numPitstops > 1) ||
						(player.numPitstops === 1 && pitWindow > 0) ? (
						// Shown when Pit Window is active
						<div
							className={classNames("pitting", {
							noShadow: false,
							})}
							style={{
							background:
								player.mandatoryPit === 2
								? "rgba(0, 221, 23, 0.8)"
								: "rgba(255, 70, 0, 0.8)",
							color: "rgba(255, 255, 255, 1)",
							width: "25px",
							}}
						>
							<div className="pittinga">{player.numPitstops}</div>
							<div
							className={classNames("pittime", {
								noShadow: false,
							})}
							>
							{`${
								fancyTimeFormatGap(
								(playerPitInfo[player.id][5] -
									playerPitInfo[player.id][2]) / 1000,1,1,false,true) // .toFixed(1)
							}`}
							</div>
							<div
							className={classNames("pittimea", {
								noShadow: playerPitInfo[player.id][4] <= 0,
							})}
							style={{
								color:
								playerPitInfo[player.id][4] > 0
									? "rgba(0, 221, 23, 1)"
									: "rgba(0, 221, 23, 0)",
								background:
								playerPitInfo[player.id][4] > 0
									? "rgba(0, 100, 255, 0.8)"
									: "rgba(0, 100, 255, 0)",
							}}
							>
							{playerPitInfo[player.id][4] > 0
								? `${
									fancyTimeFormatGap(
									(playerPitInfo[player.id][4] -
										playerPitInfo[player.id][3]) / 1000, 1, 1, false, true) // .toFixed(1)
								}`
								: "|"}
							</div>
						</div>
						) : (
						<div
							className={classNames("pitting", {
							noShadow: true,
							})}
							style={{
							background: "rgba(0, 0, 0, 0)",
							color: "rgba(0, 0, 0, 0)",
							width: "25px",
							}}
						>
							<div className="pittinga" />
							<div
							className={classNames("pittime", {
								noShadow: false,
							})}
							>
							{`${
								fancyTimeFormatGap(
								(playerPitInfo[player.id][5] -
									playerPitInfo[player.id][2]) / 1000,1,1,false,true) // .toFixed(1)
							}`}
							</div>
							<div
							className={classNames("pittimea", {
								noShadow: playerPitInfo[player.id][4] <= 0,
							})}
							style={{
								color:
								playerPitInfo[player.id][4] > 0
									? "rgba(0, 221, 23, 1)"
									: "rgba(0, 221, 23, 0)",
								background:
								playerPitInfo[player.id][4] > 0
									? "rgba(0, 100, 255, 0.8)"
									: "rgba(0, 100, 255, 0)",
							}}
							>
							{playerPitInfo[player.id][4] > 0
								? `${
									fancyTimeFormatGap(
									(playerPitInfo[player.id][4] -
										playerPitInfo[player.id][3]) / 1000,1,1,false,true) // .toFixed(1)
								}`
								: "|"}
							</div>
						</div>
						)
					) : player.numPitstops > 1 ? (
						<div
						className={classNames("pitting", {
							noShadow: false,
						})}
						style={{
							background:
							player.mandatoryPit === 2
								? "rgba(0, 221, 23, 0.8)"
								: "rgba(255, 70, 0, 0.8)",
							color: "rgba(255, 255, 255, 1)",
							width: "25px",
						}}
						>
						<div className="pittinga">{player.numPitstops}</div>
						</div>
					) : null
					) : sessionType === ESession.Race && player.numPitstops > 0 ? (
					this.props.settings.subSettings.showPitTime.enabled &&
					playerPitInfo[player.id] !== undefined &&
					playerPitInfo[player.id][5] > 0 &&
					((nowCheck - playerPitInfo[player.id][5] <= 7500 &&
						this.props.settings.subSettings.autoHidePitTime.enabled) ||
						(!this.props.settings.subSettings.autoHidePitTime.enabled &&
						!this.props.settings.subSettings.showPenalties.enabled) ||
						(!this.props.settings.subSettings.autoHidePitTime.enabled &&
						this.props.settings.subSettings.showPenalties.enabled &&
						nowCheck - playerPitInfo[player.id][5] <= 7500)) ? (
						<div
						className={classNames("pitting", {
							noShadow: false,
						})}
						style={{
							background: "rgba(0, 221, 23, 0.8)",
							color: "rgba(255, 255, 255, 1)",
							width: "25px",
						}}
						>
						<div className="pittinga">{player.numPitstops}</div>
						<div
							className={classNames("pittime", {
							noShadow: false,
							})}
						>
							{`${
							fancyTimeFormatGap(
								(playerPitInfo[player.id][5] -
								playerPitInfo[player.id][2]) / 1000,1,1,false,true) // .toFixed(1)
							}`}
						</div>
						<div
							className={classNames("pittimea", {
							noShadow: playerPitInfo[player.id][4] <= 0,
							})}
							style={{
							color:
								playerPitInfo[player.id][4] > 0
								? "rgba(0, 221, 23, 1)"
								: "rgba(0, 221, 23, 0)",
							background:
								playerPitInfo[player.id][4] > 0
								? "rgba(0, 100, 255, 0.8)"
								: "rgba(0, 100, 255, 0)",
							}}
						>
							{playerPitInfo[player.id][4] > 0
							? `${
								fancyTimeFormatGap(
									(playerPitInfo[player.id][4] -
									playerPitInfo[player.id][3]) / 1000,1,1,false,true) // .toFixed(1)
								}`
							: "|"}
						</div>
						</div>
					) : (
						<div
						className={classNames("pitting", {
							noShadow: false,
						})}
						style={{
							background: "rgba(0, 221, 23, 0.8)",
							color: "rgba(255, 255, 255, 1)",
							width: "25px",
						}}
						>
						<div className="pittinga">{player.numPitstops}</div>
						</div>
					)
					) : null
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
								? "green"
								: player.mandatoryPit === 0 || player.mandatoryPit === 1
								? "red"
								: player.inPit
								? "red"
								: "dimgray",
							color:
							player.numStops > 0
								? "white"
								: player.inPit
								? "white"
								: player.mandatoryPit === 2
								? "green"
								: player.mandatoryPit === 0 || player.mandatoryPit === 1
								? "red"
								: player.inPit
								? "red"
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
						((player.finishStatus === 0 &&
							player.pitting === 0 &&
							(playerPitInfo[player.id] === undefined ||
							(playerPitInfo[player.id] !== undefined &&
								((playerPitInfo[player.id][5] > 0 &&
								nowCheck - playerPitInfo[player.id][5] > 7500) ||
								playerPitInfo[player.id][5] <= 0)))) ||
							player.finishStatus === 1))) &&
					Object.keys(player.penalties)
						.filter((penaltyKey) => {
							const p = player.penalties[penaltyKey];
							switch (penaltyKey) {
								case "DriveThrough":
								case "StopAndGo":
								case "PitStop":
								return p === 0;
								case "SlowDown":
								case "TimeDeduction":
								return p > 0;
								default:
								return false;
							}
						})
						.map((penaltyKey) => {
						return (
							<div key={penaltyKey} className="penalties">
							<div className="penaltiesText">
								{penaltyKey === "DriveThrough"
								? "DT"
								: penaltyKey === "PitStop"
								? "PS"
								: penaltyKey === "SlowDown"
								? "SD"
								: penaltyKey === "StopAndGo"
								? "SG"
								: "TD"}
							</div>
							</div>
						);
						}
						)}
					{" "}
				</div>
			);
		}
		return null;
	}	
}