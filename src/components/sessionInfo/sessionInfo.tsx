import { LapEvents } from "../../lib/LapEvents";
import { FuelStrategy } from '../../lib/FuelStrategy';
import { 
  classNames,
  widgetSettings, 
  INVALID, 
  IRatingData, 
  getRankingData, 
  formatTime,
  eCurrentSlotId,
  getRoundsLeft,
  showDebugMessageSmall
} from "./../../lib/utils";
import { 
  hudApp, 
  IWidgetSetting, 
  showAllMode,
  eIsLeaderboard,
	eIsHillClimb,
} from "../app/app";
import r3e, { 
  registerUpdate, 
  unregisterUpdate 
} from "./../../lib/r3e";
import {
  //ESession,
	//EPitState,
  IDriverData,
	ESessionPhase,
} from "./../../types/r3eTypes";
import { observer } from "mobx-react";
import { action, observable } from 'mobx';
import React from "react";
import _ from './../../translate';
import "./sessionInfo.scss";

interface IDriverInfo {
  isUser: boolean;
  id: number;
  performanceIndex: number;
  position: number;
  positionClass: number;
  classId: number;
  lapsDone: number;
  rankingData: IRatingData;
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: IWidgetSetting;
}

@observer
export default class SessionInfo extends React.Component<IProps> {
  private startOffsetX = 0;
  private startOffsetY = 0;
  private startCursorX = 0;
  private startCursorY = 0;
  private draggingRight = false;

  @observable accessor formattedDrivers: IDriverInfo[] = [];
  @observable accessor currentLap = INVALID;
  @observable accessor maxLaps = INVALID;
  @observable accessor position = INVALID;
  @observable accessor positionClass = INVALID;
  @observable accessor multiClass = false;
  @observable accessor classDriverCount = INVALID;
  @observable accessor sessionType = INVALID;
  @observable accessor lapTimeCurrentSelf = INVALID;
  @observable accessor lapTimeBestSelf = -1;
  @observable accessor playerCount = INVALID;
  @observable accessor strengthOF = "";
  @observable accessor maxIncidentPoints = -1;
  @observable accessor myCutTrackWarnings = -1;
  @observable accessor actualRoundsLeft = -1;
  @observable accessor bestLapSelf = -1;
  @observable accessor sessionTimeDuration = -1;
  @observable accessor myIncidentPoints = -1;
  @observable accessor completedLaps = -1;
  @observable accessor currentSlotId = -1;
  @observable accessor classPerformanceIndex = -1;
  @observable accessor singleplayerRace = false;
  @observable accessor lapTimePreviousSelf = -1;
  @observable accessor bestSelfSector3 = -1;
  @observable accessor personalBestTime = -1;
  @observable accessor sessionTimeRemaining = INVALID;
  @observable accessor isHillClimb = false;
  @observable accessor isLeaderboard = false;  
  @observable accessor sessionPhase = INVALID;
  //@observable accessor pitState = INVALID;

  constructor(props: IProps) {
    super(props);
    registerUpdate(this.update);

    /*
    // Garante que layout exista
    if (!this.props.settings.layout) {
      this.props.settings.layout = {
        right: { x: 0, y: 0 },
      };
    }
    if (!this.props.settings.layout.right) {
      this.props.settings.layout.right = { x: 0, y: 0 };
    }
    */
  }

  componentWillUnmount() {
    unregisterUpdate(this.update);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  }

  // DRAG RIGHT
  @action
  private onRightMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    hudApp?.setInternalEditing(true);
    const pos = hudApp?.getPositionRelative(e.clientX, e.clientY);
    if (!pos) return;
    const layout = this.props.settings.layout!.right;
    this.draggingRight = true;
    this.startCursorX = pos.x;
    this.startCursorY = pos.y;
    this.startOffsetX = layout.x;
    this.startOffsetY = layout.y;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  };

  @action
  private onMouseMove = (e: MouseEvent) => {
    if (!this.draggingRight) return;
    const pos = hudApp?.getPositionRelative(e.clientX, e.clientY);
    if (!pos) return;
    const dx = pos.x - this.startCursorX;
    const dy = pos.y - this.startCursorY;
    let nextX = this.startOffsetX - dx;
    let nextY = this.startOffsetY + dy;
    nextX = hudApp?.applySnap(nextX) ?? nextX;
    nextY = hudApp?.applySnap(nextY) ?? nextY;
    // Atualiza diretamente layout (única fonte da verdade)
    this.props.settings.layout!.right.x = nextX;
    this.props.settings.layout!.right.y = nextY;
  };

  @action
  private onMouseUp = () => {
    if (!this.draggingRight) return;
    this.draggingRight = false;
    hudApp?.setInternalEditing(false);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };  

  // MAIN UPDATE
  private update = () => {
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
    this.sessionTimeRemaining = showAllMode ? 1 : r3e.data.SessionTimeRemaining;
    this.isLeaderboard = eIsLeaderboard;
    this.isHillClimb = eIsHillClimb;
    this.sessionType = r3e.data.SessionType;
    this.lapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
    this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
    this.completedLaps = r3e.data.CompletedLaps;
    this.currentLap = this.completedLaps + 1;
		this.maxLaps = r3e.data.NumberOfLaps;
		this.position = r3e.data.Position;
		this.positionClass = r3e.data.PositionClass;
    this.playerCount = r3e.data.DriverData.length;
    this.classPerformanceIndex = r3e.data.VehicleInfo.ClassPerformanceIndex;
    this.classDriverCount = 0;
    this.multiClass = false;
    this.singleplayerRace = false;
    this.myIncidentPoints = r3e.data.IncidentPoints !== undefined ? r3e.data.IncidentPoints : -1;
		this.myCutTrackWarnings = r3e.data.CutTrackWarnings !== undefined ? r3e.data.CutTrackWarnings : -1;
    this.formattedDrivers = r3e.data.DriverData.map(this.formatDriverData);
    this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
    this.currentSlotId = eCurrentSlotId;
    this.bestSelfSector3 = r3e.data.SectorTimesBestSelf.Sector3;
    this.sessionTimeDuration = r3e.data.SessionTimeDuration;
    this.sessionPhase = r3e.data.SessionPhase;
    //this.pitState = r3e.data.PitState;
    this.maxIncidentPoints =
			r3e.data.MaxIncidentPoints !== undefined
			? r3e.data.MaxIncidentPoints
			: -1;
    this.actualRoundsLeft = 
          FuelStrategy.RoundsLeft !== null 
          ? Math.round(FuelStrategy.RoundsLeft* 10) / 10 
          : getRoundsLeft(this.lapTimeBestSelf);
  };

  private renderInfoBox(
    value: any,
    label: string,
    color?: string
  ) {
    const showBg =
      this.props.settings.subSettings.showBackground?.enabled;
    return (
      <div
        className={classNames("pbInfoBox", {
          background: showBg,
        })}
      >
        <div
          className={classNames("pbValue", {
            background: showBg,
          })}
          style={{ color: color ?? "#fff" }}
        >
          {value}
        </div>
        <div className="pbLabel">{label}</div>
      </div>
    );
  }

  private shouldRenderItem(item: any) {
    if (showAllMode) return true;
    const subEnabled =
      this.props.settings.subSettings[item.subKey]?.enabled;
    if (!subEnabled) return false;
    if (item.conditions) {
      for (const condition of item.conditions) {
        if (!condition()) return false;
      }
    }
    return true;
  }

  private formatDriverData = (driver: IDriverData): IDriverInfo => {
    const isUser = this.currentSlotId === driver.DriverInfo.SlotId;
    if (
      driver.DriverInfo.ClassPerformanceIndex === this.classPerformanceIndex
    ) {
      this.classDriverCount += 1;
    } else {
      this.multiClass = true;
    }
    if (driver.DriverInfo.UserId === -1) {
      this.singleplayerRace = true;
    }
    const driverData = {
      isUser,
      id: driver.DriverInfo.SlotId,
      classId: driver.DriverInfo.ClassId,
      performanceIndex: driver.DriverInfo.ClassPerformanceIndex,
      position: driver.Place,
      positionClass: driver.PlaceClass,
      lapsDone: driver.CompletedLaps,
      rankingData: getRankingData(driver.DriverInfo.UserId)
    }
    return driverData;
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

  render() {
    /*
    const playerIsAlone = this.playerCount === 1;    
    if (playerIsAlone) {
      return null;
    }
    const willOverlapPitMenu = this.pitState === EPitState.Pitting;
    if (willOverlapPitMenu) {
      return null;
    }
    const onlyShowInRace = this.sessionType !== ESession.Race
    if (onlyShowInRace && !showAllMode) {
      return null;
    }
    */
    const notInRacePhase = this.sessionPhase < ESessionPhase.Countdown;
    if (notInRacePhase) {
      return null;
    }

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
			this.props.settings.subSettings.showIncidentPoints.enabled &&
			(showAllMode ||	(this.sessionType !== 0 && this.sessionType !== 3));
    const warnInc =	showIncPoints && this.myIncidentPoints >= this.maxIncidentPoints * 0.9;
    const { settings } = this.props;
    const layout = settings.layout?.right;
    const x = layout?.x ?? 0;
    const y = layout?.y ?? 0;

    // LEFT DEFINITIONS
    const leftItems = [
      {
        id: "currentlap", 
        subKey: "lapTime", 
        label: _("Lap Time"), 
        value: showAllMode 
          ? "01:48.023" 
          : this.lapTimeCurrentSelf !== INVALID
              ? formatTime(this.lapTimeCurrentSelf, "mm:ss.S")
              : "-:--.---" 
      },
      { 
        id: "lastlap",
        subKey: "showLastLap",
        label: _("Last Lap"),
        value: showAllMode
          ? "01:48.023"
          : this.lapTimePreviousSelf !== -1
              ? formatTime(this.lapTimePreviousSelf, "mm:ss.SSS")
              : "-:--.---",
        color: () => {
          if (showAllMode) return "rgba(255,255,255,1)";
          if (
            (this.sessionType === 2 && this.completedLaps < 1) ||
            (this.sessionType !== 2 && this.lapTimeBestSelf < 0)
          ) {
            return "rgba(255,255,255,1)";
          }
          if (LapEvents.shouldShowLapTime(this.currentSlotId)) {
            return LapEvents.getLapTimeColor(this.currentSlotId);
          }
          return "rgba(255,255,255,1)";
        }
      },      
      {
        id: "bestlap", 
        subKey: "showBestLap", 
        label: _("Best Lap"), 
        value: showAllMode 
          ? "01:48.023" 
          : this.bestSelfSector3 !== -1
            ? formatTime(this.bestSelfSector3, "mm:ss.SSS")
            : "--:--.---" 
      },      
      {
        id: "completed", 
        subKey: "sessionLaps", 
        label: _("Completed Laps"), 
        value: showAllMode 
          ? 6 
          : this.completedLaps , 
        conditions: [() => !this.isLeaderboard]
      },
      { 
        id: "remain", 
        subKey: "sessionLapsRemain", 
        label: this.props.settings.subSettings.sessionLapsRemain.enabled ||
				this.props.settings.subSettings.sessionLapsTotal.enabled
					? this.props.settings.subSettings.sessionLapsTotal.enabled &&
					(this.bestLapSelf > 0 || showAllMode)
					? !this.props.settings.subSettings.sessionLapsRemain.enabled
						? _("Estimated Laps total")
						: _("Est.L. left / Est.L. total")
					: _("Estimated Laps left")
					: "", 
        value: this.props.settings.subSettings.sessionLapsTotal.enabled ||
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
          : this.props.settings.subSettings.sessionLapsTotal.enabled &&
            (this.bestLapSelf > 0 || showAllMode)
            ? `${showAllMode
              ? 12
              : Math.ceil(this.sessionTimeDuration / this.bestLapSelf)
            }`
            : `${showAllMode ? 6 : this.actualRoundsLeft}`
          : "",
          conditions: [
            () => this.actualRoundsLeft > -1,
            () => this.maxLaps == INVALID,
          ]
      },
    ];

    // RIGHT DEFINITIONS
    const rightItems = [
      {
        id: "overallPos",
        subKey: "currentPosition",
        label: _("Position"), 
        value: showAllMode 
          ? "9/12" 
          : `${this.position}/${this.playerCount}`
      },
      {
        id: "classPos", 
        subKey: "currentPosition", 
        label: _("Position Class"), 
        value: showAllMode ? "3/6" : `${this.positionClass}/${this.classDriverCount}`, 
        conditions: [() => this.multiClass]
      },
      {
        id: "sof", 
        subKey:  "showSOF", 
        label: _("Strength of Field"), 
        value: showAllMode 
          ? "2.22K" 
          : this.getStrengthOfField(),
        conditions: [
          () => !this.isHillClimb && !this.isLeaderboard,
          () => !this.singleplayerRace  
        ]
      },
      {
        id: "incidents", 
        subKey: "showIncidentPoints", 
        label: _("Incidents"), 
        value: showAllMode 
          ? "102/200"  
          : this.myIncidentPoints === -1
            ? "N/A"
            : `${this.myIncidentPoints}`+`${this.maxIncidentPoints < 1 ? "" : "/"+this.maxIncidentPoints}`,
        conditions: [() => !this.isLeaderboard],
        color: () => {
          if (warnInc && this.maxIncidentPoints > 1) {
            return "rgb(228, 50, 50)";
          } else {
            return "#fff";
          }
        }
      },
      {
        id: "cuts", 
        subKey: "showCuts", 
        label: _("Track Limits"), 
        value: showAllMode 
          ? "8" 
          : this.myCutTrackWarnings ,
        conditions: [
          () => this.myCutTrackWarnings > -1,
        ]
      },
      {
        id: "time", 
        subKey: "sessionTime", 
        label: this.maxLaps == INVALID
          ? sessionName
          : _('Lap'), 
        value: showAllMode 
          ? "23:32:57" 
          : this.maxLaps == INVALID
            ? formatTime(this.sessionTimeRemaining, "H:mm:ss")
            : `${this.currentLap}/${this.maxLaps}`,
        conditions: [
          () => !this.isLeaderboard,
          () => this.sessionTimeRemaining !== INVALID || this.maxLaps !== INVALID,
        ]
      },
    ];

    return (
      <div
        {...widgetSettings(this.props)}
        className={classNames("sessionInfo", this.props.className)}
      >
        {/* LEFT BLOCK */}
        <div className="pbBlock left">
          {leftItems
            .filter(item => this.shouldRenderItem(item))
            .map(item => (
              <React.Fragment key={item.id}>
                {this.renderInfoBox(
                  item.value,
                  item.label,
                  item.color ? item.color() : undefined
                )}
              </React.Fragment>
            ))}
        </div>

        {/* RIGHT BLOCK */}
        <div
          className="pbBlock right"
          style={{
            right: 0,
            transform: `translate(${-x}px, ${y}px)`,
            position: "absolute",
          }}
          onMouseDown={this.onRightMouseDown}
        >
          {rightItems
            .filter(item => this.shouldRenderItem(item))
            .map(item => (
              <React.Fragment key={item.id}>
                {this.renderInfoBox(
                  item.value,
                  item.label,
                  item.color ? item.color() : undefined
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  }
}
