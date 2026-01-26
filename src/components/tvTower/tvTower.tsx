import { LapEvents } from "../../lib/LapEvents";
import { PitEvents } from "../../lib/PitEvents";
import { FlagEvents } from "../../lib/FlagEvents";
import {
  classNames,
  base64ToString,
  ePlayerSlotId,
  eCurrentSlotId,
  fancyTimeFormatGap,
  formatTime,
  getTimeUntilPit,
  getTimeUntilPitClosed,
  isRange,
  isEven,
  widgetSettings,
  getInitials,
  getRankingData,
  showDebugMessageSmall,
  // resAspect,
  IRatingData,
  INVALID,
  getClassColor,
  computeRealLapDiff
} from "./../../lib/utils";
import {
  ESession,
  IDriverData,
  ICutTrackPenalties,
} from "./../../types/r3eTypes";
import {
  IWidgetSetting,
  lowPerformanceMode,
  highPerformanceMode,
  eLogoUrl,
  // eDriverPitInfo,
  eIsLeaderboard,
  eIsHillClimb,
  eGainLossPermanentTower,
  eRankInvert,
  // IDriverPitInfo,
  showAllMode,
} from "../app/app";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import { times } from "lodash-es";
import _ from "./../../translate";
import r3e, {
  registerUpdate,
  unregisterUpdate,
  nowCheck,
} from "./../../lib/r3e";
import React from "react";
import "./tvTower.scss";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: IWidgetSetting;
}
interface IStartPositions {
  [index: number]: number;
}
interface IDriverInfo {
  isUser: boolean;
  id: number;
  name: string;
  shortName: string;
  performanceIndex: number;
  position: number;
  positionClass: number;
  meta?: IDriverData;
  lapDiff: number;
  diff: string | number;
  manufacturerId: number;
  bestLapTime: number;
  bestLapTimeLeader: number;
  bestLapTimeClass: number;
  pitting: number;
  currentTime: number;
  numPitstops: number;
  mandatoryPit: number;
  classId: number;
  classColor: string;
  tyreChoice: number;
  lapDistance: number;
  logoUrl: string;
  finishStatus: number;
  finishStatusText: string;
  lapPrevious: number;
  lapsDone: number;
  rankingData: IRatingData;
  penalties: ICutTrackPenalties;
}

@observer
export default class TvTower extends React.Component<IProps, {}> {
  @observable accessor drivers: IDriverInfo[] = [];
  @observable accessor currentLap = INVALID;
  @observable accessor maxLaps = INVALID;
  @observable accessor pitState = INVALID;
  @observable accessor sessionPhase = INVALID;
  @observable accessor sessionTimeRemaining = INVALID;
  @observable accessor classDriverCount = INVALID;
  @observable accessor position = INVALID;
  @observable accessor positionClass = INVALID;
  @observable accessor sessionType = INVALID;
  @observable accessor multiClass = false;
  @observable accessor lapTimeCurrentSelf = INVALID;
  @observable accessor playerCount = INVALID;
  @observable accessor addPrefix = false;
  @observable accessor mandatoryServed = false;
  @observable accessor mandatoryActive = false;
  @observable accessor playerPos = -1;
  @observable accessor lastCheck = 0;
  @observable accessor notInRacePhase = true;
  @observable accessor theLogoUrl = "./../../img/logo.png";
  playerPosition = INVALID;
  positionBarCount = 15;
  entryWidth = 148;
  classColorUpdate: number;
  @observable accessor actualFirstLap = false;
  @observable accessor incidentPoints = -1;
  @observable accessor maxIncidentPoints = -1;
  @observable accessor lastIncidentPoints = -1;
  @observable accessor showIncUntil = -1;
  @observable accessor startingLights = -1;
  @observable accessor startPositions: IStartPositions = {};
  @observable accessor singleplayerRace = false;
  @observable accessor classPerformanceIndex = -1;
  @observable accessor pitWindowStatus = -1;
  logoUrlp1 = "https://game.raceroom.com/store/image_redirect?id=";
  logoUrlp2 = "&size=small";
  @observable accessor playerSlotId = -1;
  @observable accessor currentSlotId = -1;
  @observable accessor isLeaderboard = false;
  @observable accessor isHillClimb = false;
  // @observable accessor driverPitInfo: IDriverPitInfo = {};
  // @observable accessor driverDiffs: IDriverDiffs = {};
  @observable accessor gameInReplay = false;
  constructor(props: IProps) {
    super(props);
    registerUpdate(this.update);
    this.forceClassColorUpdate();
    this.classColorUpdate = setInterval(
      this.forceClassColorUpdate,
      10 * 1000,
    ) as any;
  }
  componentWillUnmount() {
    clearInterval(this.classColorUpdate);
    unregisterUpdate(this.update);
  }

  @action
  private update = () => {
    /*if (
      (highPerformanceMode && nowCheck - this.lastCheck >= 500) ||
      (lowPerformanceMode && nowCheck - this.lastCheck >= 500) ||
      (!lowPerformanceMode &&
        !highPerformanceMode &&
        nowCheck - this.lastCheck >= 500)
    )*/ {
      this.theLogoUrl = eLogoUrl;
      // showDebugMessage(`${this.theLogoUrl}`);
      this.lastCheck = nowCheck;
      this.playerSlotId = ePlayerSlotId;
      this.currentSlotId = eCurrentSlotId;
      this.sessionPhase = r3e.data.SessionPhase;
      this.sessionType = r3e.data.SessionType;
      this.isLeaderboard = eIsLeaderboard;
      this.isHillClimb = eIsHillClimb;
      // this.driverPitInfo = eDriverPitInfo;
      // this.driverDiffs = eDriverDiffs;
      this.gameInReplay = r3e.data.GameInReplay > 0;
      if ((!this.isLeaderboard && !this.isHillClimb) || showAllMode) {
        this.pitState = r3e.data.PitState;
        this.classDriverCount = 0;
        this.multiClass = false;
        this.playerCount = r3e.data.DriverData.length;
        this.mandatoryActive =
          this.pitWindowStatus !== -1 &&
          r3e.data.PitWindowStart !== -1 &&
          r3e.data.PitWindowEnd !== -1;
        this.singleplayerRace = false;

        this.incidentPoints =
          r3e.data.IncidentPoints !== undefined ? r3e.data.IncidentPoints : -1;
        if (
          this.incidentPoints !== -1 &&
          this.incidentPoints !== this.lastIncidentPoints
        ) {
          this.showIncUntil = nowCheck + 5000;
          this.lastIncidentPoints = this.incidentPoints;
        }
        this.maxIncidentPoints = r3e.data.MaxIncidentPoints;

        const driverData = r3e.data.DriverData.map(
          this.formatDriverData,
        ).filter(this.filterDriverData);

        this.calculateDiffs(driverData);

        this.playerPos = this.getPlayerPosition(driverData);
        this.drivers = driverData.map((driver) => {
          delete driver.meta;
          return driver;
        });

        this.currentLap = r3e.data.CompletedLaps + 1;
        this.maxLaps = r3e.data.NumberOfLaps;
        this.sessionTimeRemaining = r3e.data.SessionTimeRemaining;

        this.position = r3e.data.Position;
        this.positionClass = r3e.data.PositionClass;
        this.classPerformanceIndex = r3e.data.VehicleInfo.ClassPerformanceIndex;
        this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
        this.addPrefix = r3e.data.LapTimeBestSelf > -1;
        this.notInRacePhase =
          (this.sessionPhase < 4 && r3e.data.CarSpeed < 5) ||
          this.sessionPhase < 3;
        this.pitWindowStatus = r3e.data.PitWindowStatus;
        this.startingLights = r3e.data.StartLights;
        if (this.sessionType === ESession.Race) {
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
        }
      }
    }
  };

  private getBestLapClass = (driverData: IDriverInfo[], classId: number) => {
    let bestLap = 99999;
    driverData.forEach((driver) => {
      if (
        driver.performanceIndex === classId &&
        driver.bestLapTime > 0 &&
        driver.bestLapTime <= bestLap
      ) {
        bestLap = driver.bestLapTime;
      }
    });
    return bestLap;
  };

  private getPlayerPosition = (driverData: IDriverInfo[]) => {
    let userPosition = 0;
    driverData.forEach((driver, i) => {
      if (driver.id === this.currentSlotId) {
        userPosition = i;
      }
    });
    return userPosition;
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

  const st = PitEvents.getState(driver.DriverInfo.SlotId);
  const veryShortStop =
    st?.timeStopOnSpot != null &&
    st?.timeLeaveSpot != null &&
    (st.timeLeaveSpot - st.timeStopOnSpot) < 2000;
  const finishStatusPatched =
    this.gameInReplay &&
    st &&
    st.inPitlane &&
    veryShortStop &&
    driver.EngineState === 0
      ? 2
      : driver.FinishStatus;
  const finishStatusTextPatched =
    this.gameInReplay &&
    st &&
    st.inPitlane &&
    veryShortStop &&
    driver.EngineState === 0
      ? "DNF"
      : driver.FinishStatus === 0
        ? "running"
        : driver.FinishStatus === 1
          ? "finished"
          : driver.FinishStatus === 2
            ? "DNF"
            : driver.FinishStatus === 3
              ? "DNQ"
              : driver.FinishStatus === 4
                ? "DNS"
                : driver.FinishStatus === 5
                  ? "DQ"
                  : "none";
    const driverData = {
      isUser,
      id: driver.DriverInfo.SlotId,
      classId: driver.DriverInfo.ClassId,
      performanceIndex: driver.DriverInfo.ClassPerformanceIndex,
      name: base64ToString(driver.DriverInfo.Name),
      shortName: getInitials(base64ToString(driver.DriverInfo.Name)),
      position: driver.Place,
      positionClass: driver.PlaceClass,
      meta: driver,
      lapDiff: driver.CompletedLaps - r3e.data.CompletedLaps,
      diff: isUser ? this.getPlayerPositionText() : "",
      manufacturerId: driver.DriverInfo.ManufacturerId,
      bestLapTime: driver.SectorTimeBestSelf.Sector3,
      bestLapTimeLeader: r3e.data.SectorTimesSessionBestLap.Sector3,
      bestLapTimeClass: this.getBestLapClass(
        this.drivers,
        driver.DriverInfo.ClassPerformanceIndex,
      ),
      pitting: driver.InPitlane,
      currentTime: driver.LapTimeCurrentSelf,
      numPitstops: driver.NumPitstops,
      mandatoryPit: driver.PitStopStatus,
      classColor: getClassColor(driver.DriverInfo.ClassPerformanceIndex),
      tyreChoice: driver.TireSubtypeFront,
      lapDistance: driver.LapDistance,
      logoUrl:
        driver.DriverInfo.ManufacturerId > 0
          ? this.logoUrlp1 +
            driver.DriverInfo.ManufacturerId.toString() +
            this.logoUrlp2
          : `${this.logoUrlp1}4596${this.logoUrlp2}`,
      // now using the modern PitEvents logic
      finishStatus: finishStatusPatched,
      finishStatusText: finishStatusTextPatched,
      lapPrevious: driver.SectorTimePreviousSelf.Sector3,
      lapsDone: driver.CompletedLaps,
      rankingData: getRankingData(driver.DriverInfo.UserId),
      penalties: showAllMode
        ? {
            DriveThrough: 1,
            StopAndGo: 0,
            PitStop: 0,
            TimeDeduction: 0,
            SlowDown: 1,
          }
        : driver.Penalties,
    };
    if (isUser) {
      this.mandatoryServed = driver.PitStopStatus === 1;
    }
    return driverData;
  };

  private forceClassColorUpdate() {
    r3e.data.DriverData.forEach((driver) => {
      getClassColor(driver.DriverInfo.ClassPerformanceIndex);
    });
  }

  private calculateDiffs(drivers: IDriverInfo[]) {
    const isRace = this.sessionType === ESession.Race;

    if (isRace) {
      this.calculateDiffsRace(drivers);
    } else {
      this.calculateDiffsQualify(drivers);
    }
  }

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
      const diff = driver.meta
        ? driver.meta.SectorTimeBestSelf.Sector3 - userBestSector
        : 0;
      driver.diff =
        diff > 60
          ? formatTime(diff, "m:ss.SSS", this.addPrefix)
          : formatTime(diff, "s.SSS", this.addPrefix);
    });
  }

  /*
  private computeRealLapDiff = (
    meLaps: number,
    meDist: number,
    otherLaps: number,
    otherDist: number,
  ) => {
    let lapDiff = meLaps - otherLaps;
    if (lapDiff < 0 && otherDist < meDist) lapDiff++;
    else if (lapDiff > 0 && meDist < otherDist) lapDiff--;
    return lapDiff;
  };
  */

  // TV Tower: Calculate Gaps Between Drivers (Race)
  private roundGap(gap: number): number {
    return Number(gap.toFixed(1)); // arredonda corretamente para 1 decimal
  }
  private calculateDiffsRace(drivers: IDriverInfo[]) {
    const playerPos = this.position;
    const user = drivers[playerPos - 1];
    // limpa o diff do jogador
    if (user) {
      user.diff = "";
    }
    const userLapDist = user?.meta?.LapDistance ?? 0;
    const userLapsDone = user?.lapsDone ?? 0;
    // ========= PILOTOS À FRENTE =========
    const driversInfront = drivers.slice(0, playerPos - 1).reverse();
    let accumulatedFront = 0;
    driversInfront.forEach((driver) => {
      const otherDist = driver.meta?.LapDistance ?? 0;
      const otherLaps = driver.lapsDone ?? 0;
      const lapDiff = computeRealLapDiff(
        userLapsDone,
        userLapDist,
        otherLaps,
        otherDist,
      );
      accumulatedFront += driver.meta?.TimeDeltaBehind ?? 0;
      const gapRounded = this.roundGap(accumulatedFront);
      if (lapDiff === 0) {
        driver.diff =
          gapRounded > 60
            ? formatTime(-gapRounded, "m:ss.S")
            : formatTime(-gapRounded, "s.S");
      } else {
        const stored = Math.abs(lapDiff);
        driver.diff = `-${stored} lap${stored > 1 ? "s" : ""}`;
      }
    });
    // ========= PILOTOS ATRÁS =========
    const driversBehind = drivers.slice(playerPos);
    let accumulatedBehind = 0;
    driversBehind.forEach((driver) => {
      const otherDist = driver.meta?.LapDistance ?? 0;
      const otherLaps = driver.lapsDone ?? 0;
      const lapDiff = computeRealLapDiff(
        userLapsDone,
        userLapDist,
        otherLaps,
        otherDist,
      );
      accumulatedBehind += driver.meta?.TimeDeltaFront ?? 0;
      const gapRounded = this.roundGap(accumulatedBehind);
      if (lapDiff === 0) {
        driver.diff =
          gapRounded > 60
            ? formatTime(gapRounded, "m:ss.S", true)
            : formatTime(gapRounded, "s.S", true);
      } else {
        const stored = Math.abs(lapDiff);
        driver.diff = `+${stored} lap${stored > 1 ? "s" : ""}`;
      }
    });
    this.playerPosition = playerPos;
  }

  private getPlayerPositionText(): string {
    const isntRace = this.sessionType !== ESession.Race;
    if (isntRace) {
      const bestTime = r3e.data.SectorTimesBestSelf.Sector3;
      return bestTime !== INVALID
        ? bestTime > 60
          ? formatTime(Math.max(0, bestTime), "m:ss.SSS")
          : formatTime(Math.max(0, bestTime), "s.SSS")
        : "-";
    }

    const lapTime = r3e.data.LapTimeCurrentSelf;
    return lapTime !== INVALID
      ? lapTime > 60
        ? formatTime(Math.max(0, lapTime), "m:ss.SSS")
        : formatTime(Math.max(0, lapTime), "s.SSS")
      : "-";
  }

  private getFlagColor(): string {
    const flags = FlagEvents.getFlags();
    
    if (!flags) {
        return require("./../../img/transparent.svg");
    }

    if (FlagEvents.isYellow()) {
        return require("./../../img/yellow.svg");
    }
    if (FlagEvents.whiteReason() > 0) {
        return require("./../../img/white.svg");
    }
    if (FlagEvents.isBlue()) {
        return require("./../../img/blue.svg");
    }
    if (FlagEvents.isBlack()) {
        return require("./../../img/black.svg");
    }
    if (FlagEvents.isGreen()) {
        return require("./../../img/green.svg");
    }
    if (FlagEvents.isCheckered()) {
        return require("./../../img/checkered.svg");
    }
    if (FlagEvents.blackAndWhiteReason() > 0) {
        return require("./../../img/diagonal.svg");
    }

    return require("./../../img/transparent.svg");
  }


  render() {
    if (
      (this.sessionType === 2 && this.sessionPhase === 1) ||
      ((this.isLeaderboard || this.isHillClimb) && !showAllMode)
    ) {
      return null;
    }
    if (this.notInRacePhase) {
      return null;
    }

    let sessionName = "";
    switch (this.sessionType) {
      case 0:
        sessionName = _("Practice");
        break;
      case 1:
        sessionName = _("Qualifying");
        break;
      case 2:
        sessionName = _("Race");
        break;
      case 3:
        sessionName = _("Warmup");
        break;
    }

    const showRD =
      (!this.singleplayerRace || showAllMode) &&
      this.props.settings.subSettings.showRanking.enabled;
    const timeUntilClosed = getTimeUntilPitClosed(this.maxLaps !== INVALID);
    const timeUntilPit = getTimeUntilPit(this.maxLaps !== INVALID);
    return (
      <div
        className={classNames("tvTowerContainer", {
          shouldShow: !!this.drivers.length,
          longNamesCont: this.props.settings.subSettings.showLongNames.enabled,
          carLogosCont: this.props.settings.subSettings.showCarLogos.enabled,
          tireInfoCont: this.props.settings.subSettings.showTireInfo.enabled,
          multiClassCont:
            this.multiClass &&
            !this.props.settings.subSettings.showOwnClassOnly.enabled,
          showRankCont: showRD,
        })}
        {...widgetSettings(this.props)}
      >
        {this.sessionPhase !== INVALID && (
          <div className={classNames("tvTower", this.props.className)}>
            {times(0).map((i: number) => {
              return <div key={`empty-${i}`} className="player" />;
            })}
            {this.sessionTimeRemaining !== INVALID ||
            this.maxLaps !== INVALID ? (
              <div>
                {/*Show Logo*/}
                {this.props.settings.subSettings.showLogo.enabled && (
                  <div
                    className="header"
                    style={{
                      borderBottom: "1px solid white",
                    }}
                  >
                    <img
                      className="headerIcon"
                      src={
                        this.theLogoUrl === "./../../img/logo.png"
                          ? require("./../../img/logo.png")
                          : this.theLogoUrl
                      }
                      width="153"
                      height="37"
                    />
                  </div>
                )}

                {/*Show Session Info*/}
                {this.props.settings.subSettings.showSessionInfo.enabled &&
                  ((this.maxLaps === INVALID && (
                    <div className="standingsSessionInfo">
                      <div className="standingsSessionInfoText">
                        <span className="sessionNameText">
                          {sessionName.substr(0, 1)}
                          {`${" / "}`}
                          <div className="sessionRemainHours">
                            {formatTime(this.sessionTimeRemaining, "H")}
                          </div>
                          <div className="sessionRemainHoursText">
                            {`${"H"}`}
                          </div>
                          <div className="sessionRemainMinutes">
                            {formatTime(this.sessionTimeRemaining, "mm")}
                          </div>
                          <div className="sessionRemainMinutesText">
                            {`${"M"}`}
                          </div>
                          <div className="sessionRemainSeconds">
                            {formatTime(this.sessionTimeRemaining, "ss")}
                          </div>
                          <div className="sessionRemainSecondsText">
                            {`${"S"}`}
                          </div>
                        </span>
                      </div>
                      <img
                        className="sessionFlags"
                        src={this.getFlagColor()}
                        width="68"
                        height="42"
                      />
                    </div>
                  )) ||
                    (this.maxLaps !== INVALID && (
                      <div className="standingsSessionInfo">
                        <div className="standingsSessionInfoText">
                          <span className="sessionNameText">
                            {sessionName.substr(0, 1)}
                            {`${" / "}`}
                            <div className="sessionRemainHours">
                              {_("Lap")}
                              {`${" "}`}
                              {this.currentLap}
                              {`${"/"}`}
                              {this.maxLaps}
                            </div>
                          </span>
                        </div>
                        <img
                          className="sessionFlags"
                          src={this.getFlagColor()}
                          width="68"
                          height="42"
                        />
                      </div>
                    )))}

                {/*Show Pit Window*/}
                {this.props.settings.subSettings.showPitWindow.enabled &&
                (showAllMode ||
                  (this.mandatoryActive &&
                    !this.mandatoryServed &&
                    this.pitWindowStatus > 0 &&
                    this.sessionPhase === 5 &&
                    this.sessionType === ESession.Race &&
                    ((this.pitWindowStatus === 1 &&
                      isRange(timeUntilPit, 1, 3)) ||
                      isRange(this.pitWindowStatus, 2, 3)))) ? (
                  <div
                    className="mandatoryPitHeader"
                    style={{
                      background:
                        showAllMode || this.pitWindowStatus === 2
                          ? timeUntilClosed > 3
                            ? "rgba(44, 194, 39, 0.8)"
                            : "rgba(172, 0, 0, 0.8)"
                          : isRange(timeUntilPit, 1, 3)
                            ? "rgba(170, 25, 196, 0.8)"
                            : this.pitWindowStatus === 3
                              ? "rgba(21, 74, 219, 0.8)"
                              : "rgba(172, 0, 0, 0.8)",
                    }}
                  >
                    <div className="ticker">
                    <div className="tickerContent">
                    {showAllMode || this.pitWindowStatus === 2 ? (
                      timeUntilClosed > 3 ? (
                        <div className="mandatoryPitHeaderText">
                          {`${_("Pit-Window open for")} ${timeUntilClosed} ${
                            this.maxLaps !== INVALID
                              ? getTimeUntilPitClosed(true) > 1
                                ? _("laps")
                                : _("lap")
                              : timeUntilClosed > 1
                                ? _("minutes")
                                : _("minute")
                          }`}
                        </div>
                      ) : (
                        <div className="mandatoryPitHeaderText">
                          {getTimeUntilPitClosed(true) > 1
                            ? `${_(
                                "Pit-Window closes in",
                              )} ${timeUntilClosed} ${
                                this.maxLaps !== INVALID
                                  ? _("laps")
                                  : _("minutes")
                              }`
                            : `${_("Pit-Window closes")} ${
                                this.maxLaps !== INVALID
                                  ? _("after this lap")
                                  : _("in 1 minute")
                              }`}
                        </div>
                      )
                    ) : timeUntilClosed > 0 &&
                      timeUntilPit < 1 &&
                      this.pitWindowStatus === 3 &&
                      !this.mandatoryServed ? (
                      <div className="mandatoryPitHeaderText">
                        {_("Mandatory Pit In Progress")}
                      </div>
                    ) : isRange(timeUntilPit, 2, 3) ? (
                      <div className="mandatoryPitHeaderText">
                        {`${_("Pit-Window opens in")} ${timeUntilPit} ${
                          this.maxLaps !== INVALID
                            ? timeUntilPit > 1
                              ? _("laps")
                              : _("lap")
                            : timeUntilPit > 1
                              ? _("minutes")
                              : _("minute")
                        }`}
                      </div>
                    ) : timeUntilPit === 1 ? (
                      <div className="mandatoryPitHeaderText">
                        {`${_("Pit-Window opens")} ${
                          this.maxLaps !== INVALID
                            ? _("after this lap")
                            : _("in 1 minute")
                        }`}
                      </div>
                    ) : timeUntilClosed === 1 ? (
                      <div className="mandatoryPitHeaderText">
                        {`${_("Pit-Window closes")} ${
                          this.maxLaps !== INVALID
                            ? _("this lap")
                            : _("in 1 minute")
                        }`}
                      </div>
                    ) : null}
                  </div>
                  </div>
                </div>
                ) : null}
              </div>
            ) : null
            }

            
            {this.drivers.map((player, i) => {
              return (
                <PositionEntry
                  key={`${player.id}-${i}`}
                  player={player}
                  settings={this.props.settings}
                  pitWindow={timeUntilPit}
                  driverCount={this.playerCount}
                  classPlayerCount={this.classDriverCount}
                  isMulti={this.multiClass}
                  // playerPitInfo={eDriverPitInfo}
                  // playerDiffs={this.driverDiffs}
                  showIncUntil={this.showIncUntil}
                  playerSlotId={this.playerSlotId}
                  singleplayerRace={this.singleplayerRace}
                  position={this.position}
                  positionClass={this.positionClass}
                  sessionType={this.sessionType}
                  sessionPhase={this.sessionPhase}
                  incidentPoints={this.incidentPoints}
                  maxIncidentPoints={this.maxIncidentPoints}
                  classPerformanceIndex={this.classPerformanceIndex}
                  isLeaderboard={this.isLeaderboard}
                  isHillClimb={this.isHillClimb}
                  startingLights={this.startingLights}
                  startPosition={this.startPositions}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

interface IEntryProps extends React.HTMLAttributes<HTMLDivElement> {
  player: IDriverInfo;
  settings: IWidgetSetting;
  pitWindow: number;
  driverCount: number;
  classPlayerCount: number;
  isMulti: boolean;
  // playerPitInfo: IDriverPitInfo;
  // playerDiffs: IDriverDiffs;
  showIncUntil: number;
  playerSlotId: number;
  singleplayerRace: boolean;
  position: number;
  positionClass: number;
  sessionType: number;
  sessionPhase: number;
  incidentPoints: number;
  maxIncidentPoints: number;
  classPerformanceIndex: number;
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
  /*
  private renderPlayerNameLong(name: string) {
    const firstInitial = name.substr(0, 1).toUpperCase() + ". ";
    const parts = name.split(" ");
    const lastNames = parts.slice(1);
    const retName = lastNames.map((item) => item.toUpperCase());
    return firstInitial + retName.toString().replace(",", " ").substr(0, 3);
  }
    */
  private renderPlayerNameShort(name: string) {
    const parts = name.split(" ");
    const lastNames = parts.slice(1);
    const retName = lastNames.map((item) => item.toUpperCase());
    return retName.toString().replace(",", " ").substr(0, 3);
  }
  private getTyre(tyreChoice: number) {
    if (showAllMode) {
      return require("./../../img/hard.svg");
    }
    /* if (tyreChoice === -1) {
			return require('./../../img/transparent.png');
		}*/
    if (tyreChoice <= 0) {
      return require("./../../img/primary.svg");
    }
    if (tyreChoice === 1) {
      return require("./../../img/alternate.svg");
    }
    if (tyreChoice === 2) {
      return require("./../../img/soft.svg");
    }
    if (tyreChoice === 3) {
      return require("./../../img/medium.svg");
    }
    if (tyreChoice === 4) {
      return require("./../../img/hard.svg");
    }
    return require("./../../img/transparent.svg");
  }

  /*
  private hexToRGB(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha > 0) {
      return `rgba(${r >= 0 ? r : 0}, ${g >= 0 ? g : 0}, ${
        b >= 0 ? b : 0
      }, ${alpha}) 5px solid`;
    }
    return `rgba(${r >= 0 ? r : 0}, ${g >= 0 ? g : 0}, ${
      b >= 0 ? b : 0
    }, ${alpha}) 5px solid`;
  }
  */

  private getStartEnd(theEnd: boolean) {
    const classOnly = this.props.settings.subSettings.showOwnClassOnly.enabled;
    const driverPos = classOnly
      ? this.props.positionClass
      : this.props.position;
    const driverCount = classOnly
      ? this.props.classPlayerCount
      : this.props.driverCount;
    const start =
      driverPos <= 3
        ? 4
        : driverCount - driverPos >= 3
          ? driverPos > 5
            ? driverPos === 6
              ? driverPos - 2
              : driverPos - 3
            : 4
          : driverPos - (3 - (driverCount - driverPos) + 3);
    const end = start + 6;
    if (theEnd) {
      return end;
    }
    return start;
  }

  render() {
    const isLeaderboard = this.props.isLeaderboard;
    const isHillClimb = this.props.isHillClimb;
    const sessionType = this.props.sessionType;
    const sessionPhase = this.props.sessionPhase;
    const gameInReplay = r3e.data.GameInReplay > 0;
    if (
      (sessionType === 2 && sessionPhase === 1) ||
      ((isLeaderboard || isHillClimb) && !showAllMode)
    ) {
      return null;
    }
    const player = this.props.player;
    // const playerDiffs = this.props.playerDiffs;      
    /*
    const playerPitInfo =
    gameInReplay &&
    ((r3e.data.SessionTimeDuration !== -1 &&
      r3e.data.SessionTimeRemaining <= 0) ||
      (r3e.data.NumberOfLaps !== -1 &&
        r3e.data.CompletedLaps >= r3e.data.NumberOfLaps * 0.9))
      ? {}
      : this.props.playerPitInfo;
    */
    const playerSlotId = this.props.playerSlotId;
    const classOnly = this.props.settings.subSettings.showOwnClassOnly.enabled;
    let showIt = false;

    let sessionName = "";
    switch (sessionType) {
      case 0:
        sessionName = _("Practice");
        break;
      case 1:
        sessionName = _("Qualifying");
        break;
      case 2:
        sessionName = _("Race");
        break;
      case 3:
        sessionName = _("Warmup");
        break;
    }

    const myIncidentPoints =
      this.props.incidentPoints !== undefined ? this.props.incidentPoints : -1;
    const maxIncidentPoints =
      this.props.maxIncidentPoints !== undefined
        ? this.props.maxIncidentPoints
        : -1;
    const showIncUntil = this.props.showIncUntil;

    const showIncPoints =
      this.props.settings.subSettings.showIncidentPoints.enabled &&
      maxIncidentPoints !== -1 &&
      sessionName !== "Practice" &&
      sessionName !== "Warmup" &&
      player.id !== -1 &&
      player.id === playerSlotId &&
      showIncUntil - nowCheck >= 0;
    const warnInc =
      showIncPoints && myIncidentPoints >= maxIncidentPoints * 0.9;
    const classPerformanceIndex = this.props.classPerformanceIndex;
    const position = this.props.position;
    const positionClass = this.props.positionClass;
    const startPositions = this.props.startPosition;
    const startingLights = this.props.startingLights;
    const gainLossPermanentTower = eGainLossPermanentTower;
    const startPosition = showAllMode
      ? isEven(position)
        ? position + 1
        : position - 1
      : startPositions[player.id] === undefined
        ? -1
        : startPositions[player.id];
    const showGainLoss =
      this.props.settings.subSettings.showPosGainLoss.enabled &&
      ((sessionType === ESession.Race &&
        player.finishStatus < 2 &&
        startingLights === 6 &&
        startPosition !== -1 &&
        (player.lapsDone > 0 &&
          LapEvents.shouldShowLapTime(player.id) ||
          gainLossPermanentTower)) ||
        showAllMode);
    const posGainedLost =
      startPosition !== -1 ? Math.abs(startPosition - player.position) : -1;

    if (this.props.settings.subSettings.showFullGrid.enabled) {
      showIt = true;
    }
    if (
      (classOnly && player.positionClass < 4) ||
      (!classOnly && player.position < 4)
    ) {
      showIt = true;
    }

    if (
      (!classOnly &&
        player.position <= this.getStartEnd(true) &&
        player.position >= this.getStartEnd(false)) ||
      (classOnly &&
        player.positionClass <= this.getStartEnd(true) &&
        player.positionClass >= this.getStartEnd(false))
    ) {
      showIt = true;
    }
    if (classOnly && player.performanceIndex !== classPerformanceIndex) {
      showIt = false;
    }
    if (
      (!this.props.settings.subSettings.showStoppedCars.enabled ||
        !this.props.settings.subSettings.showFullGrid.enabled) &&
      player.finishStatus > 1
    ) {
      showIt = false;
    }
    // const borderColor = this.hexToRGB(player.classColor, 0.8);
    const singleplayerRace = this.props.singleplayerRace;
    const showRD =
      (showAllMode || !singleplayerRace) &&
      this.props.settings.subSettings.showRanking.enabled;

    return showIt ? (
      // Player Name AND Position
      <div
        className={classNames("player", {
          isUser: player.isUser,
          lapping: player.lapDiff < 0,
          sameLap: player.lapDiff === 0,
          lapped: player.lapDiff > 0,
        })}        
        style={{
          // YellowFlag mark
          background: FlagEvents.shouldHighlight(player.id)
            ? "rgba(65, 65, 3, 0.8)"
            : undefined,
          color: FlagEvents.shouldHighlight(player.id) 
            ? "Yellow" 
            : undefined,
        }}
      >
        <div className="position" 
        style={{
          color: FlagEvents.shouldHighlight(player.id) 
            ? "Yellow" 
            : undefined,
        }}
        >
          {this.props.settings.subSettings.showOverallPos.enabled
            ? player.position
            : player.positionClass}
        </div>

        {/*Show Gained/Lost positions*/}
        {showGainLoss && (
          <div className="gainLossImg">
            {posGainedLost > 0 && (
              <img
                src={
                  startPosition - player.position > 0
                    ? require("./../../img/posGain.svg")
                    : require("./../../img/posLoss.svg")
                }
                width="14"
                height="14"
              />
            )}
          </div>
        )}
        {showGainLoss && (
          <div
            className="positionGainLoss"
            style={{
              color: "rgba(255, 255, 255, 1)",
              background:
                posGainedLost > 0 ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.9",
              width: posGainedLost > 0 ? "17px" : "30px",
              textAlign: posGainedLost > 0 ? "right" : "center",
            }}
          >
            {posGainedLost > 0 ? posGainedLost : "-"}
          </div>
        )}

        {/*Show Long Names*/}
        <div className="name">
        {this.props.settings.subSettings.showLongNames.enabled
          ? player.shortName
          : // ?	this.renderPlayerNameLong(player.name)
            this.renderPlayerNameShort(player.name)}
        </div>
        {showRD && (
          <div
            className="rankData"
            style={{
              background: eRankInvert ? undefined : "rgba(255, 255, 255, 1)",
              color: eRankInvert ? undefined : "rgba(0, 0, 0, 1)",
              fontWeight: eRankInvert ? undefined : "bold",
            }}
          >
            {`${
              showAllMode ? 2.22 : (player.rankingData.Rating / 1000).toFixed(2)
            }K | ${
              showAllMode ? 94.6 : player.rankingData.Reputation.toFixed(1)
            }`}
          </div>
        )}

        {/*Show Car Logos*/}
        {this.props.settings.subSettings.showCarLogos.enabled && (
          <div className="manufacturerIcon">
            <img src={player.logoUrl} />
          </div>
        )}

        {/*Show Tire Info*/}
        {this.props.settings.subSettings.showTireInfo.enabled && (
          <div className="tyreChoiceContainer">
            <img
              className="tyreChoice"
              src={this.getTyre(player.tyreChoice)}
              width="19"
              height="19"
            />
          </div>
        )}

        {/*Show Last Laps & Gaps Between drivers*/}
        {showIt && (
        <div
          className={classNames("diff")}
          style={{
            color:
              // --- PRIORIDADE 1: Popup de LastLap (via LapEvents) ---
              this.props.settings.subSettings.showLastLaps.enabled &&
              LapEvents.shouldShowLapTime(player.id) &&
              !(
                (sessionType === ESession.Race && player.lapsDone < 1) ||
                (sessionType !== ESession.Race && player.bestLapTime < 0)
              )
                ? LapEvents.getLapTimeColor(player.id)

                // --- PRIORIDADE 2: WarnInc Points (mantido igual) ---
                : warnInc && showIncPoints
                ? "rgba(255, 0, 0, 1)"

                // --- PRIORIDADE 3: Yellow Highlight ---
                : FlagEvents.shouldHighlight(player.id)
                ? "yellow"

                // --- PRIORIDADE 4: Gap normal ---
                : "rgba(255, 255, 255, 1)",
          }}
          >
          {
            // ==================== TEXTO EXIBIDO ====================
            player.finishStatus > 1
              ? `Lap ${player.lapsDone + 1}`
              : showIncPoints
                ? maxIncidentPoints > 0
                  ? `${myIncidentPoints}/${maxIncidentPoints}`
                  : myIncidentPoints

                // ========= PRIORIDADE 1 — Popup de Laptime (via LapEvents) =========
                : this.props.settings.subSettings.showLastLaps.enabled &&
                  LapEvents.shouldShowLapTime(player.id) &&
                  !(
                    (sessionType === ESession.Race && player.lapsDone < 1) ||
                    (sessionType !== ESession.Race && player.bestLapTime < 0)
                  )
                ? LapEvents.getLapTimeFormatted(player.id)

                // ========= PRIORIDADE 2 — Exibir gap / yellow highlight =========
                : player.diff
          }
          </div>
        )}

        {/*Mandatory Pit Badge*/}
        {(showAllMode ||
          (player.finishStatus < 2 &&
            sessionType === ESession.Race &&
            // sessionPhase === 5 &&
            player.mandatoryPit !== -1 &&
            this.props.pitWindow <= 0)) && (
          <div
            className="pitMandatoryIndicator"
            style={{
              display: "inline-block",
              background:
                player.numPitstops > 0 && player.mandatoryPit === 2
                  ? "rgba(40, 168, 53, 0.9)"
                  : "rgba(214, 21, 21, 0.9)",
              width: "5px",
              height: "23px",
              lineHeight: "23px",
              verticalAlign: "top",
            }}
          />
        )}

        {/*Player Finish Status*/}
        {player.finishStatus === 1 ||
        (sessionType !== ESession.Race &&
          player.pitting &&
          sessionPhase === 6) ? (
          <div className="cheqFlag">
            <img
              className="cheqFlagImg"
              src={require("./../../img/checkered.svg")}
              width="25"
              height="20"
            />
          </div>
        ) : null}
        {player.finishStatus > 1 && (
          <div
            className="noFinish"
            style={{
              display: "inline-block",
              position: "relative",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              width: "25px",
              height: "23px",
              textAlign: "center",
              lineHeight: "23px",
              verticalAlign: "top",
              textShadow:
                "2px 2px 2px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.9)",
            }}
          >
            {player.finishStatusText}
          </div>
        )}

        {/*Class Only*/}
        {showIt && !classOnly && this.props.isMulti && (
          <div
            className="classStyle"
            style={{
              borderLeft: `7px solid ${player.classColor}`,
            }}
          />
        )}

        {/*Show Best Lap*/}
        {showIt && sessionType === ESession.Race && (
          <div
            className="bestLap"
            style={{
              borderLeft:
                player.bestLapTime !== -1
                  ? player.bestLapTimeLeader === player.bestLapTime
                    ? "rgba(213, 0, 249, 0.8) 5px solid"
                    : player.bestLapTime === player.bestLapTimeClass
                      ? `${player.classColor} 5px solid`
                      : "rgba(0, 0, 0, 0) 5px solid"
                  : "rgba(0, 0, 0, 0) 5px solid",
            }}
          />
        )}

        {/*Show Pit Status / Show Pit Times*/}
        {(() => {
          // Atalhos e segurança
          if (
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
          const pitTotal = st?.pitTotalDuration ?? null;
          const spotDuration = st?.spotDuration ?? null;
          // Configs
          const showPitTime = this.props.settings.subSettings.showPitTime.enabled;
          const autoHide = this.props.settings.subSettings.autoHidePitTime.enabled;
          const showPenalties = this.props.settings.subSettings.showPenalties.enabled;
          const showAll = showAllMode;
          // Aux
          const exitRecent = exitTs ? now - exitTs <= 7500 : false;
          const shouldShowExitTimes = exitTs
            ? autoHide
              ? exitRecent
              : (!showPenalties || exitRecent)
            : false;

          // ---------- CASE A: currently in pits (or forced showAllMode) ----------
          if (inPit || showAll) {
            // decide whether to render times or just badge (original logic used playerPitInfo[2] >= 0)
            const haveEnter = enterTs !== null;
            const showTimesNow = showPitTime && (showAll || (haveEnter && sessionType === ESession.Race));
            // background selection: entering (blue), stopped (red), leaving/clean (green)
            const bg =
              sessionType !== ESession.Race
              ? "rgba(4, 132, 192, 0.9)"
              : showAll || (stopTs && stopTs > 0)
                ? showAll || (leaveTs && leaveTs > 0)
                  ? "rgba(40, 168, 53, 0.8)" // leaving
                  : "rgba(204, 90, 49, 0.8)" // stopped
                : "rgba(4, 132, 192, 0.9)";   // entering
            // compute lane time and spot time similarly to original behavior
            const laneTime =
              enterTs !== null ? (showAll ? 52.9 : (now - enterTs) / 1000) : null;
            if (showTimesNow) {
              return (
                <div
                  className={classNames("pitting", { noShadow: false })}
                  style={{ background: bg, color: "#fff", width: "25px" }}
                >
                  <div className="pittinga">PIT</div>
                  <div className={classNames("pittime", { noShadow: false })}>
                    {showAll ? (
                      52.9
                    ) : laneTime !== null ? (
                      fancyTimeFormatGap(laneTime, 1, 1, false, true)
                    ) : (
                      // fallback similar to original (if no enter ts) show nothing or 0
                      fancyTimeFormatGap(0, 1, 1, false, true)
                    )}
                  </div>
                  <div
                    className={classNames("pittimea", {
                      noShadow: showAll ? false : !(stopTs && stopTs > 0),
                    })}
                    style={{
                      color:
                        showAll || (stopTs && stopTs > 0)
                          ? showAll || (leaveTs && leaveTs > 0)
                            ? "rgba(109, 255, 123)"
                            : "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0)",
                      background:
                        showAll || (stopTs && stopTs > 0)
                          ? "rgba(12, 64, 141, 0.9)"
                          : "rgba(0, 100, 255, 0)",
                    }}
                  >
                    {showAll || (stopTs && stopTs > 0) ? (
                      showAll || !(leaveTs && leaveTs > 0) ? (
                        showAll ? (
                          13.5
                        ) : (
                          fancyTimeFormatGap((now - (stopTs as number)) / 1000, 1, 1, false, true)
                        )
                      ) : (
                        fancyTimeFormatGap(((leaveTs as number) - (stopTs as number)) / 1000, 1, 1, false, true)
                      )
                    ) : (
                      "|"
                    )}
                  </div>
                </div>
              );
            } else {
              // in pits but no time should be shown -> show only badge
              return (
                <div
                  className={classNames("pitting", { noShadow: false })}
                  style={{
                    background: bg,
                    color: "#fff",
                    width: "25px",
                  }}
                >
                  <div className="pittinga">PIT</div>
                </div>
              );
            }
          } // end inPit

          // ---------- CASE B: mandatory pit logic (shown when NOT in pits) ----------
          if (
            sessionType === ESession.Race &&
            (player.mandatoryPit !== -1 || (gameInReplay && sessionType === ESession.Race))
          ) {
            // cor: green (feito), red (pendente)
            const isGreen = player.mandatoryPit === 2;
            const bg = isGreen ? "rgba(40, 168, 53, 0.8)" : "rgba(204, 90, 49, 0.8)";
            // narrowing explícito
            const hasExit = exitTs != null;
            const hasEnter = enterTs != null;
            // tempos sempre calculados de forma segura
            const total =
              pitTotal ??
              (hasEnter && hasExit ? (exitTs! - enterTs!) / 1000 : null);
            const spot =
              spotDuration ??
              (stopTs && leaveTs ? (leaveTs - stopTs) / 1000 : null);
            // --- MOSTRAR TEMPOS (e badge juntos) ---
            if (hasExit && shouldShowExitTimes) {
              return (
                <div
                  className={classNames("pitting", { noShadow: false })}
                  style={{ background: bg, color: "rgba(255,255,255,1)", width: "25px" }}                >
                  {/* BADGE SEMPRE IMEDIATO */}
                  <div className="pittinga">{player.numPitstops}</div>
                  {/* TEMPO TOTAL */}
                  <div className={classNames("pittime", { noShadow: false })}>
                    {total != null
                      ? fancyTimeFormatGap(total, 1, 1, false, true)
                      : fancyTimeFormatGap(0, 1, 1, false, true)}
                  </div>
                  {/* TEMPO DE SPOT */}
                  <div
                    className={classNames("pittimea", { noShadow: !spot })}
                    style={{
                      color: spot != null ? "rgba(29, 143, 40)" : "rgba(0,221,23,0)",
                      background: spot != null
                        ? "rgba(13, 82, 185, 0.8)"
                        : "rgba(0,100,255,0)"
                    }}
                  >
                    {spot != null
                      ? fancyTimeFormatGap(spot, 1, 1, false, true)
                      : "|"}
                  </div>
                </div>
              );
            }
            // --- MOSTRAR APENAS O BADGE ---
            if (player.numPitstops > 0) {
              return (
                <div
                  className={classNames("pitting", { noShadow: false })}
                  style={{ background: bg, color: "rgba(255,255,255,1)", width: "25px" }}
                >
                  <div className="pittinga">{player.numPitstops}</div>
                </div>
              );
            }
            return null;
          }

          // ---------- CASE C: regular post-pit display for normal races ----------
          if (sessionType === ESession.Race && player.numPitstops > 0) {
            if (showPitTime && exitTs && (autoHide ? exitRecent : (!showPenalties || exitRecent))) {
              const total = pitTotal ?? (enterTs ? (exitTs - enterTs) / 1000 : null);
              const spot = spotDuration ?? (stopTs && leaveTs ? (leaveTs - stopTs) / 1000 : null);
              return (
                <div className={classNames("pitting", { noShadow: false })} style={{ background: "rgba(40, 168, 53, 0.8)", color: "rgba(255,255,255,1)", width: "25px" }}>
                  <div className="pittinga">{player.numPitstops}</div>
                  <div className={classNames("pittime", { noShadow: false })}>
                    {total ? fancyTimeFormatGap(total, 1, 1, false, true) : fancyTimeFormatGap(0, 1, 1, false, true)}
                  </div>
                  <div className={classNames("pittimea", { noShadow: !spot })} style={{ color: spot ? "rgba(29, 143, 40)" : "rgba(0,221,23,0)", background: spot ? "rgba(13, 82, 185, 0.8)" : "rgba(0,100,255,0)" }}>
                    {spot ? fancyTimeFormatGap(spot, 1, 1, false, true) : "|"}
                  </div>
                </div>
              );
            } else {
              return (
                <div className={classNames("pitting", { noShadow: false })} style={{ background: "rgba(40, 168, 53, 0.8)", color: "rgba(255,255,255,1)", width: "25px" }}>
                  <div className="pittinga">{player.numPitstops}</div>
                </div>
              );
            }
          }
          return null;
        })()}

        {/*Show Penalties*/}
        {this.props.settings.subSettings.showPenalties.enabled &&
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

        {/*Finish Info*/}
        {showIt &&
          (player.finishStatus > 1 ? (
            <div className="notFinishBlock">{"|"}</div>
          ) : null)}
        </div>
      ) : !this.props.settings.subSettings.showFullGrid.enabled &&
      ((classOnly &&
        player.performanceIndex === classPerformanceIndex &&
        positionClass > 6 &&
        player.positionClass === 4) ||
        (!classOnly && position > 6 && player.position === 4)) ? (
      <div className="podiumSeparator">{"|"}</div>
    ) : null;
  }
}
