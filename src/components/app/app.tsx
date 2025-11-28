declare global {
  interface Window {
    version?: string;
  }
}
import { LapEvents } from "../../lib/LapEvents";
import { PitEvents } from "../../lib/PitEvents";
import {
  classNames,
  base64ToString,
  ePlayerSlotId,
  ePlayerDriverDataIndex,
  ePlayerIsFocus,
  eCurrentSlotId,
  getSlotIds,
  // fancyTimeFormatGap,
  prettyDebugInfo,
  currentFocusIsInput,
  getClassColor,
  getJason,
  // getInitials,
  hSLToRGB,
  rankData,
  showDebugMessage,
  showDebugMessageSmall,
  // IRatingData,
  INVALID,
} from "../../lib/utils";
import { merge } from "lodash-es";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import _, {
  dynamicTranslate as __,
  setLocale,
  Locales,
  getTranslations,
} from "./../../translate";
import Aids from "../aids/aids";
import Clock from "../clock/clock";
import CornerNames from "../cornerNames/cornerNames";
import CrewChief from "../crewChief/crewChief";
import Damage from "../damage/damage";
import Flags from "../flags/flags";
import Fuel from "../fuel/fuel";
import FuelDetail from "../fuelDetail/fuelDetail";
// import getRecordedLapsData from "./../../lib/trackData";
import Gforce from "../gforce/gforce";
import Graphs from "../graphs/graphs";
import Info from "../info/info";
import Inputs from "../inputs/inputs";
import InputsGraph from "../inputsGraph/inputsGraph";
import IShared, {
  ESession,
  EControl,
  IDriverData,
} from "./../../types/r3eTypes";
import Motec from "../motec/motec";
import OvertakingAids from "../overtakingAids/overtakingAids";
// import PerformanceInfo from '../performanceInfo/performanceInfo';
import PitLimiter from "../pitLimiter/pitLimiter";
import Pitstop from "../pitstop/pitstop";
import PositionBar from "../positionBar/positionBar";
import Progress from "../progress/progress";
import r3e, {
  registerUpdate,
  unregisterUpdate,
  nowCheck,
  noData,
} from "./../../lib/r3e";
import React, { ChangeEvent } from "react";
import Spotting from "../spotting/spotting";
import StartingLights from "../startingLights/startingLights";
import "./app.scss";
import SvgIcon from "../svgIcon/svgIcon";
import Tires from "../tires/tires";
import TvTower from "../tvTower/tvTower";

interface IProps {}

interface ISubSettings {
  [key: string]: {
    enabled: boolean;
    text(): string;
  };
}

interface IDriverInfo {
  isUser: boolean;
  id: number;
  userId: number;
  engineState: number;
  name: string;
  modelId: number;
  currentTime: number;
  validLap: number;
  performanceIndex: number;
  bestLapTime: number;
  bestLapTimeLeader: number;
  bestLapTimeClass: number;
  pitting: number;
  classId: number;
  classColor: string;
  lapDistance: number;
  finishStatus: number;
  // speed: number;
  lapPrevious: number;
  // distDiff: number;
  dPos: {
    X: number;
    Y: number;
    Z: number;
  };
}

/*
interface ILastPosVector {
  [index: string]: {
    X: number;
    Y: number;
    Z: number;
  };
}

interface IPitBoxDistances {
  // Index TrackLayoutId
  [index: string]: {
    [index: string]: {
      X: number;
      Y: number;
      Z: number;
    };
  };
}

interface IPitBoxEntrances {
  [index: string]: number;
}

interface ILapData {
  [index: string]: number[][];
}

interface ILapRecords {
  // Index = SlotId
  [index: number]: number[][];
  // 0 - dist array
  // 1 - time array
}
*/

interface IClassLaps {
  // Index = ClassPerformanceIndex
  [index: number]: number;
  // lapTime
}



export interface IDriverPitInfo {
  // Index = SlotId
  [index: number]: number[];
  // 0 - Is In Pit
  // 1 - Is In Pit Start
  // 2 - Pit Enter Time
  // 3 - Pit Stand Time
  // 4 - Pit Start Time
  // 5 - Pit Exit Time
}

export interface IWidgetSetting {
  id: string;
  enabled: boolean;
  volume: number;
  duration: number;
  resetIt: boolean;
  zoom: number;
  position: {
    x: number;
    y: number;
  };
  subSettings: ISubSettings;
  name(): string;
}

let lowPerformanceMode = false;
let highPerformanceMode = false;
let supremePerformance = false;
let showAllMode = false;
let hideWidgets = false;
let blockFuelCalc = false;
let speedInMPH = false;
let eDriverNum = 3;
let eGainLossPermanentTower = false;
let eGainLossPermanentBar = false;
let eRankInvert = false;
let eRankInvertRelative = false;
let eLogoUrl = "./../../img/logo.png";
// let eDriverPitInfo: IDriverPitInfo = {};
let eResetId = "";
let eIsLeaderboard = false;
let eIsHillClimb = false;
let isMenu = false;
const eIsIngameBrowser = window.clientInformation.appVersion
  .toString()
  .match(/64.0/);

export {
  lowPerformanceMode,
  highPerformanceMode,
  supremePerformance,
  showAllMode,
  hideWidgets,
  blockFuelCalc,
  speedInMPH,
  eDriverNum,
  eGainLossPermanentTower,
  eGainLossPermanentBar,
  eRankInvert,
  eRankInvertRelative,
  eLogoUrl,
  // eDriverPitInfo,
  eIsIngameBrowser,
  eIsLeaderboard,
  eIsHillClimb,
};
// Hud Version
const currentVersion = 0.8;

@observer
export default class App extends React.Component<IProps> {
  appRef = React.createRef<HTMLDivElement>();

  @observable accessor playerSlotId = -1;
  @observable accessor playerDriverDataIndex = -1;
  @observable accessor playerIsFocus = false;
  @observable accessor currentSlotId = -1;
  @observable accessor storedVersion = -1;
  @observable accessor replayCheck = true;
  @observable accessor replayReloadDone = false;
  @observable accessor badReplay = false;
  @observable accessor changeLogRead = true;
  @observable accessor changeLogToggled = false;
  @observable accessor trackingString = "";
  @observable accessor tempTrackingString = "";
  @observable accessor driverPitInfo: IDriverPitInfo = {};
  // @observable accessor pitBoxDistances: IPitBoxDistances = {};
  // @observable accessor pitBoxEntrances: IPitBoxEntrances = {};
  // @observable accessor lastPosition: ILastPosVector = {};
  // @observable accessor driverLapRecord: ILapRecords = {};
  // @observable accessor driverRecordedLaps = [[-1], [0], [0], [0]];
  // @observable accessor storedRecordedLaps: ILapData = {};
  @observable accessor classBestLap: IClassLaps = {};
  // @observable accessor currentClassLapData = [[-1], [0], [0], [0]];
  // @observable accessor tempClassLapData = [[-1], [0], [0], [0]];
  @observable accessor drivers: IDriverInfo[] = [];
  // loadTime = Date.now();
  @observable accessor loadTime = Date.now();
  // Deal with centering the main ui so it is always stays 16:9
  @observable accessor aspectHeight: number | null = null;
  @observable accessor hide = localStorage.hideWidgets
    ? localStorage.hideWidgets === "1"
      ? true
      : false
    : false || false;
  @observable accessor resetInterval: ReturnType<typeof setInterval> | null =
    null;
  @observable accessor showEditGrid = false;
  @observable accessor enterPressed = false;
  @observable accessor somethingResetted = false;
  @observable accessor language: string = localStorage.language || "en";
  @observable accessor lowPerfo = localStorage.lowPerformanceMode
    ? localStorage.lowPerformanceMode === "1"
      ? true
      : false
    : false || false;
  @observable accessor highPerfo = localStorage.highPerformanceMode
    ? localStorage.highPerformanceMode === "1"
      ? true
      : false
    : false || false;
  @observable accessor snapOn = localStorage.snapOn
    ? localStorage.snapOn === "1"
      ? true
      : false
    : false || false;
  @observable accessor elBlocko = blockFuelCalc || false;
  @observable accessor mphSpeed = speedInMPH || false;
  @observable accessor showAll = localStorage.showAllMode
    ? localStorage.showAllMode === "1"
      ? true
      : false
    : false || false;
  @observable accessor mouseTimeout: number | null = null;
  @observable accessor clearDataTimer = INVALID;
  @observable accessor hideMouse = false;
  mouseOnTheMove = false;
  @observable accessor lastMousemovement = 0;
  @observable accessor nowMousemovement = 0;
  @observable accessor shiftModifier = false;
  @observable accessor driverNum = localStorage.driverNum
    ? localStorage.driverNum === "1"
      ? 1
      : localStorage.driverNum === "2"
      ? 2
      : localStorage.driverNum === "3"
      ? 3
      : 3
    : 3;
  @observable accessor gainLossPermanentTower =
    localStorage.gainLossPermanentTower
      ? localStorage.gainLossPermanentTower === "1"
        ? true
        : false
      : false || false;
  @observable accessor gainLossPermanentBar = localStorage.gainLossPermanentBar
    ? localStorage.gainLossPermanentBar === "1"
      ? true
      : false
    : false || false;
  @observable accessor rankInvert = localStorage.rankInvert
    ? localStorage.rankInvert === "1"
      ? true
      : false
    : false || false;
  @observable accessor rankInvertRelative = localStorage.rankInvertRelative
    ? localStorage.rankInvertRelative === "1"
      ? true
      : false
    : false || false;
  @observable accessor currentLayout = localStorage.currentLayout
    ? localStorage.currentLayout === "1"
      ? 1
      : localStorage.currentLayout === "2"
      ? 2
      : localStorage.currentLayout === "3"
      ? 3
      : 1
    : 1 || 1;
  @observable accessor lockHud = localStorage.lockHudStatus
    ? localStorage.lockHudStatus === "1"
      ? true
      : false
    : false;
  @observable accessor hLogoUrl =
    this.currentLayout === 1
      ? localStorage.currentLogo || "./../../img/logo.png"
      : this.currentLayout === 2
      ? localStorage.currentLogo2 || "./../../img/logo.png"
      : this.currentLayout === 3
      ? localStorage.currentLogo3 || "./../../img/logo.png"
      : "./../../img/logo.png";
  @observable accessor currentNumDrivers = 0;
  @observable accessor lastNumDrivers = 0;
  @observable accessor throttlePedal = 0;
  @observable accessor brakePedal = 0;
  @observable accessor clutchPedal = 0;
  @observable accessor gameInMenus = false;
  @observable accessor gameInReplay = false;

  // @observable
  // theError = '';

  @observable accessor defaultsettings: { [key: string]: IWidgetSetting } = {
    positionBar: {
      id: "positionBar",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Position Bar"),
      subSettings: {
        showStandings: {
          text: __("Show Standings"),
          enabled: true,
        },
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },
        showPosGainLoss: {
          text: __("Show Positions Gain/Loss"),
          enabled: true,
        },
        showPitStatus: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showPitTime: {
          text: __("Show Pit-Times"),
          enabled: true,
        },
        autoHidePitTime: {
          text: __("Auto-Hide Pit-Times"),
          enabled: true,
        },
        showPenalties: {
          text: __("Show Penalties"),
          enabled: true,
        },
        showLastLaps: {
          text: __("Show Last-Lap-Times"),
          enabled: true,
        },
				lapTime: {
					text: __('Show Lap-Time'),
					enabled: true
				},
				currentPosition: {
					text: __('Show Current Position'),
					enabled: true
				},
        sessionLaps: {
          text: __("Show Completed Laps"),
          enabled: true,
        },
        sessionLapsRemain: {
          text: __("Show Estimated Laps left"),
          enabled: true,
        },
        sessionLapsTotal: {
          text: __("Show Estimated Laps"),
          enabled: true,
        },
        showSOF: {
          text: __("Show Strength of Field"),
          enabled: true,
        },
        showLastLap: {
          text: __("Show Last-Lap"),
          enabled: true,
        },
        showBestLap: {
          text: __("Show Best-Lap"),
          enabled: true,
        },        
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },
				sessionTime: {
					text: __("Show Session-Time"),
					enabled: true,
				}
			},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    positionBarRelative: {
			id: "positionBarRelative",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.97,
      name: __("Relative"),
			subSettings: {
        showAllSessions: {
          text: __("Show in all Sessions"),
          enabled: true,
        },
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },
        showGapsInSeconds: {
          text: __("Show Gaps in Seconds"),
          enabled: true,
        },
        showCarNames: {
          text: __("Show Car Names"),
          enabled: true,
        },
        showCarLogos: {
          text: __("Show Manufacturer Logos"),
          enabled: false,
        },
        showClassLogos: {
          text: __("Show Class Logos"),
          enabled: true,
        },
        showPitStops: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showRanking: {
          text: __("Show Ranking Data"),
          enabled: true,
        },
        numberDrivers: {
          text: __("Drivers Ahead/Behind"),
          enabled: true,
        }
      },
			position: {
				x: 1324,
				y: 917,
			}
		},
    tvTower: {
      id: "tvTower",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.6999999999999997,
      name: __("TV Tower"),
      subSettings: {
        showLogo: {
          text: __("Show Logo"),
          enabled: true,
        },
        showSessionInfo: {
          text: __("Show Session Info"),
          enabled: true,
        },
        showLongNames: {
          text: __("Show full Lastname"),
          enabled: true,
        },
        showCarLogos: {
          text: __("Show Manufacturer Logos"),
          enabled: true,
        },
        showTireInfo: {
          text: __("Show Tire Infos"),
          enabled: true,
        },
        showPitWindow: {
          text: __("Show Pit-Window Info"),
          enabled: true,
        },
        showPitStatus: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showPitTime: {
          text: __("Show Pit-Times"),
          enabled: true,
        },
        autoHidePitTime: {
          text: __("Auto-Hide Pit-Times"),
          enabled: true,
        },
        showPenalties: {
          text: __("Show Penalties"),
          enabled: true,
        },
        showLastLaps: {
          text: __("Show Last-Lap-Times"),
          enabled: true,
        },
        showRanking: {
          text: __("Show Ranking Data"),
          enabled: true,
        },
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },
        showOwnClassOnly: {
          text: __("Show only Own Class"),
          enabled: false,
        },
        showFullGrid: {
          text: __("Show full Driver Grid"),
          enabled: true,
        },
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },
        showPosGainLoss: {
          text: __("Show Positions Gain/Loss"),
          enabled: true,
        },
        showStoppedCars: {
          text: __("Show Stopped Drivers"),
          enabled: true,
        },
        hLogoUrl: {
          text: __("Change Logo URL"),
          enabled: false,
        },
      },
      position: {
        x: 1,
        y: 1,
      },
    },
    progress: {
      id: "progress",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.9099999999999999,
      name: __("Delta"),
      subSettings: {
        deltaText: {
          text: __("Delta text"),
          enabled: true,
        },
        deltaBars: {
          text: __("Delta bars"),
          enabled: true,
        },
        deltaNextPosition: {
          text: __("Next position"),
          enabled: true,
        },
        estimatedLapTime: {
          text: __("Estimated lap time"),
          enabled: true,
        },
        estimatedPosition: {
          text: __("Estimated position"),
          enabled: true,
        },
        lastLap: {
          text: __("Last Lap"),
          enabled: true,
        },
        sectorsAsTime: {
          text: __("Show Sectors as time"),
          enabled: true,
        },
        deltaInRace: {
          text: __("Delta to Best-Lap in Race"),
          enabled: true,
        },
        hideInRace: {
          text: __("Hide in race"),
          enabled: false,
        },
      },
      position: {
        x: 87,
        y: -246,
      },
    },
    tires: {
      id: "tires",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.06,
      name: __("Tires"),
      subSettings: {
        showDetails: {
          text: __("Show Inner & Outer"),
          enabled: true,
        },
        showTempNumbers: {
          text: __("Show Tire-Temp numbers"),
          enabled: true,
        },
        showCelsius: {
          text: __("Tire-Temp in Celsius"),
          enabled: true,
        },
        showWearNumbers: {
          text: __("Show Tire-Wear numbers"),
          enabled: true,
        },
        showWearPerLap: {
          text: __("Show Tire-Wear per Lap"),
          enabled: true,
        },
        showWearLaps: {
          text: __("Show Tire Est. Laps-Left"),
          enabled: true,
        },
        showPressureNumbers: {
          text: __("Show Tire-Pressure numbers"),
          enabled: true,
        },
        showPsi: {
          text: __("Tire-Pressure in PSI"),
          enabled: false,
        },
      },
      position: {
        x: 5,
        y: 960,
      },
    },
    fuelDetail: {
      id: "fuelDetail",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.5999999999999996,
      name: __("Fuel & Lap Details"),
      subSettings: {
        showStoredInfo: {
          text: __("Show Lap Details"),
          enabled: true,
        },
        showFuelTime: {
          text: __("Show Estimate Time"),
          enabled: true,
        },
        clearAnySession: {
          text: __("Auto-Clear Data on Session-Change"),
          enabled: false,
        },
        clearRaceSession: {
          text: __("Auto-Clear Data for Race-Session"),
          enabled: false,
        },
        clearComboData: {
          text: __("Clear this Combo Stored Data"),
          enabled: false,
        },
        clearAllData: {
          text: __("Clear all Stored Data"),
          enabled: false,
        },
      },
      position: {
        x: 376,
        y: 962,
      },
    },
    pitstop: {
      id: "pitstop",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.6899999999999997,
      name: __("Pitstop"),
      subSettings: {
        pitWindow: {
          text: __("Show Pit-Window"),
          enabled: true,
        },
        pitTimeOnly: {
          text: __("Show Pit-Time only"),
          enabled: false,
        },
      },
      position: {
        x: 1412,
        y: 676,
      },
    },
    spotting: {
      id: "spotting",
      enabled: true,
      resetIt: false,
      volume: 0.5,
      duration: 0,
      zoom: 1.9400000000000008,
      name: __("Spotting / Radar"),
      subSettings: {
        shouldBeep: {
          text: __("Should beep"),
          enabled: true,
        },
        beepVolume: {
          text: __("VOL:"),
          enabled: true,
        },
        shouldOnlyBeep: {
          text: __("No Radar - Beep only"),
          enabled: false,
        },
        warnFront: {
          text: __("Warn Front"),
          enabled: false,
        },
        autoHide: {
          text: __("Auto Hide"),
          enabled: true,
        },
      },
      position: {
        x: 825,
        y: 803,
      },
    },
    motec: {
      id: "motec",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Motec"),
      subSettings: {
        plBlink: {
          text: __("PitLimiter Blink"),
          enabled: true,
        },
        plBBlink: {
          text: __("Background Blinking"),
          enabled: true,
        },
        showECU: {
          text: __("Show Electronics"),
          enabled: true,
        },
        showTCPercent: {
          text: __("Show TC in percent if available"),
          enabled: true,
        },
        showMPH: {
          text: __("Speed in MPH"),
          enabled: false,
        },
      },
      position: {
        x: 1745,
        y: 917,
      },
    },
    cornerNames: {
      id: "cornerNames",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.5299999999999998,
      name: __("Track Info"),
      subSettings: {
        trackDetails: {
          text: __("Track Name & Details"),
          enabled: true,
        },
        corners: {
          text: __("Show Corner Names"),
          enabled: true,
        },
        noColors: {
          text: __("Just-White"),
          enabled: true,
        },
      },
      position: {
        x: 2,
        y: 892,
      },
    },
    inputs: {
      id: "inputs",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Inputs"),
      subSettings: {
        showInputNumbers: {
          text: __("Show Numbers"),
          enabled: true,
        },
        steeringInput: {
          text: __("Steering wheel"),
          enabled: true,
        },
      },
      position: {
        x: 1670,
        y: 917,
      },
    },
    inputsGraph: {
      id: "inputsGraph",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 6,
      zoom: 1.85,
      name: __("Inputs Graph"),
      subSettings: {
        showInputThrottle: {
          text: __("Throttle"),
          enabled: true,
        },
        showInputBrake: {
          text: __("Brake"),
          enabled: true,
        },
        showInputClutch: {
          text: __("Clutch"),
          enabled: false,
        },
        showInputMeters: {
          text: __("Input Meters"),
          enabled: false,
        },
      },
      position: {
        x: 400,
        y: 800,
      },
    },
    fuel: {
      id: "fuel",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Fuel"),
      subSettings: {},
      position: {
        x: 1883,
        y: 917,
      },
    },
    gforce: {
      id: "gforce",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.1800000000000002,
      name: __("G-Force"),
      subSettings: {},
      position: {
        x: 1157,
        y: 962,
      },
    },
    aids: {
      id: "aids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.95,
      name: __("Car assists"),
      subSettings: {},
      position: {
        x: 150,
        y: 962,
      },
    },
    overtakingAids: {
      id: "overtakingAids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("P2P/DRS"),
      subSettings: {},
      position: {
        x: 1669,
        y: 837,
      },
    },
    startingLights: {
      id: "startingLights",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.95,
      name: __("Race start lights"),
      subSettings: {},
      position: {
        x: 702,
        y: 227,
      },
    },
    info: {
      id: "info",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3600000000000003,
      name: __("Race info"),
      subSettings: {},
      position: {
        x: 17,
        y: 408,
      },
    },
    pitLimiter: {
      id: "pitLimiter",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6800000000000006,
      name: __("Pit limiter"),
      subSettings: {},
      position: {
        x: 820,
        y: 227,
      },
    },
    damage: {
      id: "damage",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.1500000000000001,
      name: __("Damage"),
      subSettings: {},
      position: {
        x: 367,
        y: 1098,
      },
    },
    flags: {
      id: "flags",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.4400000000000004,
      name: __("Flags"),
      subSettings: {},
      position: {
        x: 1218,
        y: 121,
      },
    },
    crewChief: {
      id: "crewChief",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.03,
      name: __("Crew Chief"),
      subSettings: {},
      position: {
        x: 1719,
        y: 273,
      },
    },
    graphs: {
      id: "graphs",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Telemetry"),
      subSettings: {},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    clock: {
      id: "clock",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.5000000000000004,
      name: __("Clock"),
      subSettings: {},
      position: {
        x: 1755,
        y: 140,
      },
    },
  };

  @observable accessor settings: { [key: string]: IWidgetSetting } = {
    positionBar: {
      id: "positionBar",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Position Bar"),
      subSettings: {
        showStandings: {
          text: __("Show Standings"),
          enabled: true,
        },
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },        
        showPosGainLoss: {
          text: __("Show Positions Gain/Loss"),
          enabled: true,
        },
        showPitStatus: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showPitTime: {
          text: __("Show Pit-Times"),
          enabled: true,
        },
        autoHidePitTime: {
          text: __("Auto-Hide Pit-Times"),
          enabled: true,
        },
        showPenalties: {
          text: __("Show Penalties"),
          enabled: true,
        },
        showLastLaps: {
          text: __("Show Last-Lap-Times"),
          enabled: true,
        },
				lapTime: {
					text: __('Show Lap-Time'),
					enabled: true
				},
				currentPosition: {
					text: __('Show Current Position'),
					enabled: true
				},
        sessionLaps: {
          text: __("Show Completed Laps"),
          enabled: true,
        },
        sessionLapsRemain: {
          text: __("Show Estimated Laps left"),
          enabled: true,
        },
        sessionLapsTotal: {
          text: __("Show Estimated Laps"),
          enabled: true,
        },
        showSOF: {
          text: __("Show Strength of Field"),
          enabled: true,
        },
        showLastLap: {
          text: __("Show Last-Lap"),
          enabled: true,
        },
        showBestLap: {
          text: __("Show Best-Lap"),
          enabled: true,
        },
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },
				sessionTime: {
					text: __("Show Session-Time"),
					enabled: true,
				}
			},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    positionBarRelative: {
			id: "positionBarRelative",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.97,
      name: __("Relative"),
			subSettings: {   
        showAllSessions: {
          text: __("Show in all Sessions"),
          enabled: true,
        },     
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },
        showGapsInSeconds: {
          text: __("Show Gaps in Seconds"),
          enabled: true,
        },    
        showCarNames: {
          text: __("Show Car Names"),
          enabled: true,
        },
        showCarLogos: {
          text: __("Show Manufacturer Logos"),
          enabled: false,
        },
        showClassLogos: {
          text: __("Show Class Logos"),
          enabled: true,
        },
        showPitStops: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showRanking: {
          text: __("Show Ranking Data"),
          enabled: true,
        },
        numberDrivers: {
          text: __("Drivers Ahead/Behind"),
          enabled: true,
        }
      },
			position: {
				x: 1324,
				y: 917,
			}
		},
    tvTower: {
      id: "tvTower",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.6999999999999997,
      name: __("TV Tower"),
      subSettings: {
        showLogo: {
          text: __("Show Logo"),
          enabled: true,
        },
        showSessionInfo: {
          text: __("Show Session Info"),
          enabled: true,
        },
        showLongNames: {
          text: __("Show full Lastname"),
          enabled: true,
        },
        showCarLogos: {
          text: __("Show Manufacturer Logos"),
          enabled: true,
        },
        showTireInfo: {
          text: __("Show Tire Infos"),
          enabled: true,
        },
        showPitWindow: {
          text: __("Show Pit-Window Info"),
          enabled: true,
        },
        showPitStatus: {
          text: __("Show Pit-Status"),
          enabled: true,
        },
        showPitTime: {
          text: __("Show Pit-Times"),
          enabled: true,
        },
        autoHidePitTime: {
          text: __("Auto-Hide Pit-Times"),
          enabled: true,
        },
        showPenalties: {
          text: __("Show Penalties"),
          enabled: true,
        },
        showLastLaps: {
          text: __("Show Last-Lap-Times"),
          enabled: true,
        },
        showRanking: {
          text: __("Show Ranking Data"),
          enabled: true,
        },
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },
        showOwnClassOnly: {
          text: __("Show only Own Class"),
          enabled: false,
        },
        showFullGrid: {
          text: __("Show full Driver Grid"),
          enabled: true,
        },
        showOverallPos: {
          text: __("Show Overall Positions"),
          enabled: true,
        },
        showPosGainLoss: {
          text: __("Show Positions Gain/Loss"),
          enabled: true,
        },
        showStoppedCars: {
          text: __("Show Stopped Drivers"),
          enabled: true,
        },
        hLogoUrl: {
          text: __("Change Logo URL"),
          enabled: false,
        },
      },
      position: {
        x: 1,
        y: 1,
      },
    },
    progress: {
      id: "progress",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.9099999999999999,
      name: __("Delta"),
      subSettings: {
        deltaText: {
          text: __("Delta text"),
          enabled: true,
        },
        deltaBars: {
          text: __("Delta bars"),
          enabled: true,
        },
        deltaNextPosition: {
          text: __("Next position"),
          enabled: true,
        },
        estimatedLapTime: {
          text: __("Estimated lap time"),
          enabled: true,
        },
        estimatedPosition: {
          text: __("Estimated position"),
          enabled: true,
        },
        lastLap: {
          text: __("Last Lap"),
          enabled: true,
        },
        sectorsAsTime: {
          text: __("Show Sectors as time"),
          enabled: true,
        },
        deltaInRace: {
          text: __("Delta to Best-Lap in Race"),
          enabled: true,
        },
        hideInRace: {
          text: __("Hide in race"),
          enabled: false,
        },
      },
      position: {
        x: 87,
        y: -246,
      },
    },
    tires: {
      id: "tires",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.06,
      name: __("Tires"),
      subSettings: {
        showDetails: {
          text: __("Show Inner & Outer"),
          enabled: true,
        },
        showTempNumbers: {
          text: __("Show Tire-Temp numbers"),
          enabled: true,
        },
        showCelsius: {
          text: __("Tire-Temp in Celsius"),
          enabled: true,
        },
        showWearNumbers: {
          text: __("Show Tire-Wear numbers"),
          enabled: true,
        },
        showWearPerLap: {
          text: __("Show Tire-Wear per Lap"),
          enabled: true,
        },
        showWearLaps: {
          text: __("Show Tire Est. Laps-Left"),
          enabled: true,
        },
        showPressureNumbers: {
          text: __("Show Tire-Pressure numbers"),
          enabled: true,
        },
        showPsi: {
          text: __("Tire-Pressure in PSI"),
          enabled: false,
        },
      },
      position: {
        x: 5,
        y: 960,
      },
    },
    fuelDetail: {
      id: "fuelDetail",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.5999999999999996,
      name: __("Fuel & Lap Details"),
      subSettings: {
        showStoredInfo: {
          text: __("Show Lap Details"),
          enabled: true,
        },
        showFuelTime: {
          text: __("Show Estimate Time"),
          enabled: true,
        },
        clearAnySession: {
          text: __("Auto-Clear Data on Session-Change"),
          enabled: false,
        },
        clearRaceSession: {
          text: __("Auto-Clear Data for Race-Session"),
          enabled: false,
        },
        clearComboData: {
          text: __("Clear this Combo Stored Data"),
          enabled: false,
        },
        clearAllData: {
          text: __("Clear all Stored Data"),
          enabled: false,
        },
      },
      position: {
        x: 376,
        y: 962,
      },
    },
    pitstop: {
      id: "pitstop",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.6899999999999997,
      name: __("Pitstop"),
      subSettings: {
        pitWindow: {
          text: __("Show Pit-Window"),
          enabled: true,
        },
        pitTimeOnly: {
          text: __("Show Pit-Time only"),
          enabled: false,
        },
      },
      position: {
        x: 1412,
        y: 676,
      },
    },
    spotting: {
      id: "spotting",
      enabled: true,
      resetIt: false,
      volume: 0.5,
      duration: 0,
      zoom: 1.9400000000000008,
      name: __("Spotting / Radar"),
      subSettings: {
        shouldBeep: {
          text: __("Should beep"),
          enabled: true,
        },
        beepVolume: {
          text: __("VOL:"),
          enabled: true,
        },
        shouldOnlyBeep: {
          text: __("No Radar - Beep only"),
          enabled: false,
        },
        warnFront: {
          text: __("Warn Front"),
          enabled: false,
        },
        autoHide: {
          text: __("Auto Hide"),
          enabled: true,
        },
      },
      position: {
        x: 825,
        y: 803,
      },
    },
    motec: {
      id: "motec",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Motec"),
      subSettings: {
        plBlink: {
          text: __("PitLimiter Blink"),
          enabled: true,
        },
        plBBlink: {
          text: __("Background Blinking"),
          enabled: true,
        },
        showECU: {
          text: __("Show Electronics"),
          enabled: true,
        },
        showTCPercent: {
          text: __("Show TC in percent if available"),
          enabled: true,
        },
        showMPH: {
          text: __("Speed in MPH"),
          enabled: false,
        },
      },
      position: {
        x: 1745,
        y: 917,
      },
    },
    cornerNames: {
      id: "cornerNames",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.5299999999999998,
      name: __("Track Info"),
      subSettings: {
        trackDetails: {
          text: __("Track Name & Details"),
          enabled: true,
        },
        corners: {
          text: __("Show Corner Names"),
          enabled: true,
        },
        noColors: {
          text: __("Just-White"),
          enabled: true,
        },
      },
      position: {
        x: 2,
        y: 892,
      },
    },
    inputs: {
      id: "inputs",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Inputs"),
      subSettings: {
        showInputNumbers: {
          text: __("Show Numbers"),
          enabled: true,
        },
        steeringInput: {
          text: __("Steering wheel"),
          enabled: true,
        },
      },
      position: {
        x: 1670,
        y: 917,
      },
    },
    inputsGraph: {
      id: "inputsGraph",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 6,
      zoom: 1.85,
      name: __("Inputs Graph"),
      subSettings: {
        showInputThrottle: {
          text: __("Throttle"),
          enabled: true,
        },
        showInputBrake: {
          text: __("Brake"),
          enabled: true,
        },
        showInputClutch: {
          text: __("Clutch"),
          enabled: false,
        },
        showInputMeters: {
          text: __("Input Meters"),
          enabled: false,
        },
      },
      position: {
        x: 1750,
        y: 800,
      },
    },
    fuel: {
      id: "fuel",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6300000000000006,
      name: __("Fuel"),
      subSettings: {},
      position: {
        x: 1883,
        y: 917,
      },
    },
    gforce: {
      id: "gforce",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.1800000000000002,
      name: __("G-Force"),
      subSettings: {},
      position: {
        x: 1157,
        y: 962,
      },
    },
    aids: {
      id: "aids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.95,
      name: __("Car assists"),
      subSettings: {},
      position: {
        x: 150,
        y: 962,
      },
    },
    overtakingAids: {
      id: "overtakingAids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("P2P/DRS"),
      subSettings: {},
      position: {
        x: 1669,
        y: 837,
      },
    },
    startingLights: {
      id: "startingLights",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.95,
      name: __("Race start lights"),
      subSettings: {},
      position: {
        x: 702,
        y: 227,
      },
    },
    info: {
      id: "info",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3600000000000003,
      name: __("Race info"),
      subSettings: {},
      position: {
        x: 17,
        y: 408,
      },
    },
    pitLimiter: {
      id: "pitLimiter",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.6800000000000006,
      name: __("Pit limiter"),
      subSettings: {},
      position: {
        x: 820,
        y: 227,
      },
    },
    damage: {
      id: "damage",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.1500000000000001,
      name: __("Damage"),
      subSettings: {},
      position: {
        x: 367,
        y: 1098,
      },
    },
    flags: {
      id: "flags",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.4400000000000004,
      name: __("Flags"),
      subSettings: {},
      position: {
        x: 1218,
        y: 121,
      },
    },
    crewChief: {
      id: "crewChief",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.03,
      name: __("Crew Chief"),
      subSettings: {},
      position: {
        x: 1719,
        y: 273,
      },
    },
    graphs: {
      id: "graphs",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Telemetry"),
      subSettings: {},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    clock: {
      id: "clock",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.5000000000000004,
      name: __("Clock"),
      subSettings: {},
      position: {
        x: 1755,
        y: 140,
      },
    },
  };

  @observable accessor logoUrlEdit = false;
  @observable accessor settingsOpacity = 0;
  @observable accessor showSettings = false;
  @observable accessor showRanking = false;
  @observable accessor tempHide = false;
  @observable accessor debugFilter = "";
  @observable accessor appZoom = 1;
  @observable accessor performanceTime = -1;
  @observable accessor performance = -1;
  @observable accessor performanceTick: number[] = [];
  @observable accessor lastPerformance = -1;
  @observable accessor lastRecordUpdate = 0;
  @observable accessor nowTrackId = -1;
  @observable accessor nowLayoutId = -1;
  @observable accessor lastCheck = -1;
  // @observable accessor lastDiffCheck = 0;
  // @observable accessor updateDiffs = true;
  @observable accessor tempLowPerfo = false;
  @observable accessor tempHighPerfo = false;
  @observable accessor tempSavePerfo: boolean[] = [];
  @observable accessor debugData: IShared | null = null;
  @observable accessor resetString = _("Reset Settings");
  @observable accessor nowDriverDataSize = -1;
  @observable accessor forceCheck = false;
  @observable accessor lastDriverDataSize = -1;
  @observable accessor slowDiff = -1;
  @observable accessor lapStartTime = -1;
  @observable accessor oneRefresh = false;

  currentCursorWidgetOffset: null | {
    x: number;
    y: number;
    id: string;
  } = null;

  @observable accessor parseRankingDataTimeout: ReturnType<
    typeof setTimeout
  > | null = null;
  @observable accessor sessionType = -1;
  @observable accessor sessionPhase = -1;
  @observable accessor singleplayerRace = false;
  @observable accessor bestLapTimeLeader = -1;
  @observable accessor lapTimeCurrentSelf = -1;
  @observable accessor lapDistance = -1;
  @observable accessor layoutLength = -1;
  @observable accessor lapTimePreviousSelf = -1;
  @observable accessor tractionControlPercentUndefined = true;
  @observable accessor pitStoppedTime = -1;

  updateFunction: Function | null = null;

  constructor(props: IProps) {
    super(props);

    // If version isn't defined we aren't in game
    if (!window.version) {
      (document.body.parentNode as any)!.classList.add("debug");
    }

    this.handleResize();
    this.recoverSettings();

    setLocale(this.language as Locales);
    lowPerformanceMode = this.lowPerfo;
    highPerformanceMode = this.highPerfo;
    showAllMode = this.showAll;
    hideWidgets = this.hide || this.tempHide;
    blockFuelCalc = this.elBlocko;
    speedInMPH = this.mphSpeed;
    eDriverNum = this.driverNum;
    eGainLossPermanentTower = this.gainLossPermanentTower;
    eGainLossPermanentBar = this.gainLossPermanentBar;
    eRankInvert = this.rankInvert;
    eRankInvertRelative = this.rankInvertRelative;
    eLogoUrl = this.hLogoUrl;

    // if (localStorage.theError !== undefined) {
    // this.theError = localStorage.theError;
    // }

    // Deal with errors by clearing app settings, hopefully it solves the issue...
    window.onerror = () => {
      /* (msg, url, lineNo, columnNo, error) => {
			showDebugMessage(`waaaaaaaaaaaaaaaaaaaaaaaaaaah! ${
				msg
			} ${
				url
			} ${
				lineNo
			} ${
				columnNo
			} ${
				error
			}`);
			showDebugMessage('waaaaaaaaaaaaaaaaaaaaaaaaaaah!');*/
      // delete localStorage.appSettings;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // console.log('Waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah!');
    };

    /* window.onerror = () => {
			delete localStorage.appSettings;

			setTimeout(() => {
				window.location.reload();
			}, 3000);
		}; */
    registerUpdate(this.updatePerformance);
  }

  componentDidMount() {
    window.addEventListener("keypress", this.onKeyPress);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keyup", this.showKey);
    window.addEventListener("keydown", this.shiftKeyDown);
    window.addEventListener("keyup", this.shiftKeyUp);
    document.addEventListener("paste", this.handlePaste);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.onKeyPress);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keyup", this.showKey);
    window.removeEventListener("keydown", this.shiftKeyDown);
    window.removeEventListener("keyup", this.shiftKeyUp);
    document.removeEventListener("paste", this.handlePaste);
    unregisterUpdate(this.updatePerformance);
  }

  @action
  private handlePaste = (event: ClipboardEvent) => {
    if (!event.clipboardData) {
      return;
    }
    const clipText = event.clipboardData.getData("Text");
    const isSettings = clipText.includes("positionBar");
    if (isSettings) {
      let savedSettings: any = JSON.parse(clipText);
      savedSettings = JSON.parse(clipText);
      let hasFaulty = false;
      Object.keys(savedSettings).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
          hasFaulty = true;
        }
        Object.keys(savedSettings[key].subSettings).forEach((keya) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              this.settings[key].subSettings,
              keya
            )
          ) {
            hasFaulty = true;
          }
        });
      });
      if (hasFaulty) {
        showDebugMessage(
          _("Received Layout-Settings: [ERROR] Data was corrupt"),
          5000
        );
      } else {
        this.settings = merge(this.settings, savedSettings);
        showDebugMessage(
          _("Received Layout-Settings: Saved to Layout") +
            ` ${this.currentLayout}`,
          5000
        );
        setTimeout(this.timerSaveSettings, 3000);
      }
    }
  };
  
  @action
  private updatePerformance = () => {
    this.gameInReplay = r3e.data.GameInReplay > 0;
    this.gameInMenus = r3e.data.GameInMenus > 0;
    if (this.gameInMenus) {
      return; // não atualiza nada quando está no menu
    }
    const showAtAll =
      r3e.data && !this.gameInMenus && r3e.data.DriverData.length > 0;
    const driverDataPlace = r3e.data
      ? r3e.data.DriverData
        ? r3e.data.DriverData[0]
          ? r3e.data.DriverData[0].Place
          : -1
        : -1
      : -1;
    getSlotIds();
    if (localStorage.gainLossPermanentTower === undefined) {
      this.toggleGainLossPermanentTower();
    }
    this.playerSlotId = ePlayerSlotId;
    this.playerDriverDataIndex = ePlayerDriverDataIndex;
    this.playerIsFocus = ePlayerIsFocus;
    this.currentSlotId = eCurrentSlotId;
    this.sessionType = r3e.data.SessionType;
    this.sessionPhase = r3e.data.SessionPhase;
    this.bestLapTimeLeader = r3e.data.SectorTimesSessionBestLap.Sector3;
    this.lapTimeCurrentSelf = r3e.data.LapTimeCurrentSelf;
    this.lapDistance = r3e.data.LapDistance;
    this.layoutLength = r3e.data.LayoutLength;
    LapEvents.update(r3e.data.DriverData); // SHARED LAP EVENTS FOR ALL WIDGETS -> ChatGPT Idea =)
    PitEvents.update(r3e.data.DriverData); // PIT EVENTS FOR ALL WIDGETS
    this.lapTimePreviousSelf = r3e.data.LapTimePreviousSelf;
    this.tractionControlPercentUndefined =
      r3e.data.TractionControlPercent === undefined;

    if (!eIsIngameBrowser) {
      if (
        !showAtAll ||
        this.gameInMenus ||
        (this.gameInReplay &&
          (driverDataPlace === -1 || this.sessionType !== 2) &&
          this.playerDriverDataIndex === -1)
      ) {
        this.oneRefresh = true;
      } else if (this.oneRefresh) {
        this.oneRefresh = false;
        this.hide = true;
        window.location.reload();
      }
    }

    if (localStorage.language === undefined) {
      localStorage.language = "en";
    }
    if (localStorage.lockHudStatus === undefined) {
      localStorage.lockHudStatus = "0";
      this.lockHud = false;
    }
    if (r3e.data.ControlType === EControl.Player) {
      this.throttlePedal = r3e.data.ThrottleRaw;
      this.brakePedal = r3e.data.BrakeRaw;
      this.clutchPedal = r3e.data.ClutchRaw;
    } else {
      this.throttlePedal = r3e.data.Throttle;
      this.brakePedal = r3e.data.Brake;
      this.clutchPedal = r3e.data.Clutch;
    }
    if (
      this.changeLogToggled ||
      (!this.changeLogRead &&
        (this.gameInReplay ||
          this.clutchPedal > 0.1 ||
          this.brakePedal > 0.1 ||
          this.throttlePedal > 0.1))
    ) {
      this.changeLogRead = !this.changeLogRead;
      localStorage.changeLogRead = this.changeLogRead ? "1" : "0";
      this.changeLogToggled = false;
    }
    if (localStorage.changeLogRead === undefined) {
      localStorage.changeLogRead = "0";
      this.changeLogRead = false;
    } else {
      this.changeLogRead = localStorage.changeLogRead === "1";
    }
    if (localStorage.currentVersion === undefined) {
      localStorage.currentVersion = "0";
      this.storedVersion = 0;
    } else {
      this.storedVersion = parseFloat(localStorage.currentVersion);
    }
    if (this.storedVersion !== currentVersion) {
      localStorage.changeLogRead = "0";
      this.changeLogRead = false;
      localStorage.currentVersion = currentVersion.toString();
    }
    // localStorage.changeLogRead = '0';
    this.forceCheck = false;
    this.nowDriverDataSize = r3e.data.DriverData.length;
    const driverSizeDiff = Math.abs(
      this.nowDriverDataSize - this.lastDriverDataSize
    );
    if (driverSizeDiff > 0 && driverSizeDiff < 10) {
      this.lastDriverDataSize = this.nowDriverDataSize;
      this.forceCheck = true;
    }
    this.currentNumDrivers = r3e.data.NumCars;

    if (localStorage.stateJson) {
      showDebugMessage(
        _(`UI is paused! Press SHIFT+SPACEBAR to Unpause`),
        1000,
        -1
      );
    }
    if (showAllMode) {
      showDebugMessage(
        _(`Widgets-TEST-Mode Active!
				Disable in Settings or press SHIFT+DOWNARROW`),
        1000,
        -1
      );
    }
    if (this.enterPressed) {
      this.hLogoUrl =
        this.hLogoUrl === "none" || this.hLogoUrl === ""
          ? "./../../img/logo.png"
          : this.hLogoUrl;
      eLogoUrl = this.hLogoUrl;
      if (this.currentLayout === 1) {
        localStorage.currentLogo = this.hLogoUrl;
      } else if (this.currentLayout === 2) {
        localStorage.currentLogo2 = this.hLogoUrl;
      } else if (this.currentLayout === 3) {
        localStorage.currentLogo3 = this.hLogoUrl;
      }
      this.enterPressed = false;
      this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
      this.logoUrlEdit = false;
      this.saveSettings();
    }

    if (eResetId !== "") {
      const setting = this.settings[eResetId];
      const defaultSettings = this.defaultsettings[eResetId];
      setting.position.x = defaultSettings.position.x;
      setting.position.y = defaultSettings.position.y;
      setting.volume = defaultSettings.volume;
      setting.zoom = defaultSettings.zoom;

      Object.keys(setting.subSettings).forEach((keya) => {
        const subSetting = setting.subSettings[keya];
        const defaultSubSetting = defaultSettings.subSettings[keya];
        subSetting.enabled = defaultSubSetting.enabled;
      });

      if (eResetId === "tvTower") {
        this.hLogoUrl = "./../../img/logo.png";
        eLogoUrl = this.hLogoUrl;
        if (this.currentLayout === 1) {
          localStorage.currentLogo = this.hLogoUrl;
        } else if (this.currentLayout === 2) {
          localStorage.currentLogo2 = this.hLogoUrl;
        } else if (this.currentLayout === 3) {
          localStorage.currentLogo3 = this.hLogoUrl;
        }
        if (this.rankInvert) {
          this.toggleRankInvert();
        }
        if (this.gainLossPermanentTower) {
          this.toggleGainLossPermanentTower();
        }
      }
      if (eResetId === "positionBar" && this.gainLossPermanentBar) {
        this.toggleGainLossPermanentBar();
      }
      if (eResetId === "positionBarRelative") {
        if (this.rankInvertRelative) {
          this.toggleRankInvertRelative();
        }
        if (this.driverNum !== 3) {
          this.driverNumTo3();
        }
      }
      this.enterPressed = false;
      this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
      this.logoUrlEdit = false;
      eResetId = "";
      this.saveSettings();
    }

    const diff = nowCheck - this.lastPerformance;
    if (diff <= 1000) {
      this.performanceTick.push(nowCheck - this.performanceTime);
    }
    if (diff > 1000) {
      let sum = 0;
      const aL = this.performanceTick.length;
      this.performanceTick.forEach((tick) => {
        sum += tick;
      });
      this.performance = Math.round((1000 / (sum / aL)) * 10) / 10;
      this.lastPerformance = nowCheck;
      this.performanceTick = [];
    }
    this.performanceTime = nowCheck;
    if (
      !this.tempHighPerfo &&
      r3e.data.StartLights > -1 &&
      r3e.data.StartLights < 6
    ) {
      this.tempHighPerfo = true;
      this.tempSavePerfo[0] = lowPerformanceMode;
      this.tempSavePerfo[1] = highPerformanceMode;
      highPerformanceMode = false;
      lowPerformanceMode = false;
      supremePerformance = true;
    }
    if (
      this.tempHighPerfo &&
      (r3e.data.StartLights >= 6 || r3e.data.StartLights === -1)
    ) {
      this.tempHighPerfo = false;
      lowPerformanceMode = this.tempSavePerfo[0];
      highPerformanceMode = this.tempSavePerfo[1];
      supremePerformance = false;
    }

    if (this.nowTrackId !== r3e.data.TrackId) {
      this.nowTrackId = -1;
    }
    if (this.nowLayoutId !== r3e.data.LayoutId) {
      this.nowLayoutId = -1;
    }
    if (this.nowTrackId === -1) {
      this.trackingString = "";
      if (r3e.data.TrackId !== -1) {
        this.nowTrackId = r3e.data.TrackId;
        this.nowLayoutId = r3e.data.LayoutId;
        this.tempTrackingString = `${r3e.data.TrackId}_${r3e.data.LayoutId}_7982`;
        //this.tempClassLapData = getRecordedLapsData(this.tempTrackingString);
        //this.driverRecordedLaps = getRecordedLapsData(this.tempTrackingString);
        this.forceCheck = true;
      }
    }
    /*
    this.updateDiffs = false;
    if (nowCheck - this.lastDiffCheck >= 500 || this.forceCheck) {
      this.updateDiffs = true;
      this.lastDiffCheck = nowCheck;
    }*/

    if (
      (highPerformanceMode && nowCheck - this.lastCheck >= 11) ||
      (lowPerformanceMode && nowCheck - this.lastCheck >= 33) ||
      (!lowPerformanceMode &&
        !highPerformanceMode &&
        nowCheck - this.lastCheck >= 66) // || this.updateDiffs
    ) {
      // showDebugMessageSmall(`${this.trackingString}`);
      this.singleplayerRace = false;
      this.lastCheck = nowCheck;

      const driverData = r3e.data.DriverData.map(this.formatDriverData);
      this.drivers = driverData.map((driver) => {
        return driver;
      });
      if (
        (this.currentNumDrivers !== this.lastNumDrivers ||
          this.lastNumDrivers === 0) &&
        this.drivers.length &&
        !this.singleplayerRace
      ) {
        this.lastNumDrivers = this.currentNumDrivers;
        getJason();
      }
      if (
        !this.singleplayerRace &&
        rankData.length <= 0 &&
        this.parseRankingDataTimeout === null
      ) {
        this.parseRankingDataTimeout = setTimeout(this.parseRankingData, 5000);
      }
      eIsLeaderboard =
        r3e.data.SessionLengthFormat === -1 &&
        r3e.data.RaceSessionMinutes.Race1 === -1 &&
        r3e.data.RaceSessionMinutes.Race2 === -1 &&
        r3e.data.RaceSessionMinutes.Race3 === -1 &&
        r3e.data.RaceSessionLaps.Race1 === -1 &&
        r3e.data.RaceSessionLaps.Race2 === -1 &&
        r3e.data.RaceSessionLaps.Race3 === -1 &&
        r3e.data.SessionTimeDuration === -1 &&
        r3e.data.SessionTimeRemaining === -1;
      eIsHillClimb =
        r3e.data.LayoutId === 1682 ||
        r3e.data.LayoutId === 1709 ||
        r3e.data.LayoutId === 2181 ||
        r3e.data.LayoutId === 2214 ||
        r3e.data.LayoutId === 9321 ||
        r3e.data.LayoutId === 9360 ||
        r3e.data.LayoutId === 11859 ||
        r3e.data.LayoutId === 11861    
        ;

      // this.runBooboo();
      // this.getClassBestLaps(this.drivers);
      // this.updateDriverTimes();
      // this.updateLapRecordTimes();
    }
  };

  private formatDriverData = (driver: IDriverData): IDriverInfo => {
    const isUser = this.currentSlotId === driver.DriverInfo.SlotId;
    if (driver.DriverInfo.UserId === -1) {
      this.singleplayerRace = true;
    }
    const driverData = {
      isUser,
      id: driver.DriverInfo.SlotId,
      userId: driver.DriverInfo.UserId,
      engineState: driver.EngineState,
      name: base64ToString(driver.DriverInfo.Name),
      modelId: driver.DriverInfo.ModelId,
      currentTime: driver.LapTimeCurrentSelf,
      validLap: driver.CurrentLapValid,
      performanceIndex: driver.DriverInfo.ClassPerformanceIndex,
      bestLapTime: driver.SectorTimeBestSelf.Sector3,
      bestLapTimeLeader: this.bestLapTimeLeader,
      bestLapTimeClass:
        this.classBestLap[driver.DriverInfo.ClassPerformanceIndex] !== undefined
          ? this.classBestLap[driver.DriverInfo.ClassPerformanceIndex]
          : 9999,
      pitting: driver.InPitlane,
      classId: driver.DriverInfo.ClassId,
      classColor: getClassColor(driver.DriverInfo.ClassPerformanceIndex),
      lapDistance: driver.LapDistance,
      finishStatus:
        this.gameInReplay &&
        driver.InPitlane &&
        this.driverPitInfo[driver.DriverInfo.SlotId] !== undefined &&
        Math.abs(
          this.driverPitInfo[driver.DriverInfo.SlotId][2] -
            this.driverPitInfo[driver.DriverInfo.SlotId][3]
        ) < 2000 &&
        driver.EngineState === 0
          ? 2
          : driver.FinishStatus,
      speed: driver.CarSpeed,
      lapPrevious: driver.SectorTimePreviousSelf.Sector3,
      //distDiff: isUser ? 0 : driver.InPitlane ? 0 : 0, // this.getGapToPlayer(driver.LapDistance),
      /*timeDiff: isUser
        ? 0
        : this.driverRecordedLaps !== undefined
        ? this.driverRecordedLaps[0][0] !== -1
          ? this.updateDiffs
            ? this.getTimeToPlayer(driver.LapDistance)
            : this.getLastTimeDiff(this.drivers, driver.DriverInfo.SlotId)
          : 0
        : 0,
        */
      dPos: driver.Position,
    };
    return driverData;
  };
  
  /*
  private getClassBestLaps = (driverData: IDriverInfo[]) => {
    driverData.forEach((driver) => {
      if (this.classBestLap[driver.performanceIndex] === undefined) {
        this.classBestLap[driver.performanceIndex] = 9999;
      } else if (
        driver.bestLapTime > 0 &&
        driver.bestLapTime <= this.classBestLap[driver.performanceIndex]
      ) {
        this.classBestLap[driver.performanceIndex] = driver.bestLapTime;
      }
    });
  };
  */
  
  /* --- TESTAR V 0.9
  private updateDriverTimes() {
  if (!this.drivers.length) return;
  this.drivers.forEach((driver) => {
    // --- PIT INFO -----------------------------------------------------
    if (this.sessionType === ESession.Race && this.driverPitInfo[driver.id] !== undefined) {

      // Was in Pits on Start
      if (this.driverPitInfo[driver.id][1] < 0 && driver.pitting === 0) {
        this.driverPitInfo[driver.id][1] = 0;
        this.driverPitInfo[driver.id][0] = 0;
        return;
      }
      // Re-Enters pits
      if (
        this.driverPitInfo[driver.id][1] > 0 &&
        this.driverPitInfo[driver.id][0] === 0 &&
        driver.pitting
      ) {
        this.driverPitInfo[driver.id][2] = nowCheck;
        this.driverPitInfo[driver.id][3] = -1;
        this.driverPitInfo[driver.id][4] = -1;
        this.driverPitInfo[driver.id][5] = -1;
      }

      // Enters the Pit
      if (
        this.driverPitInfo[driver.id][0] === 0 &&
        this.driverPitInfo[driver.id][1] !== -1 &&
        driver.pitting &&
        driver.finishStatus === 0
      ) {
        this.driverPitInfo[driver.id][0] = 1;
        this.driverPitInfo[driver.id][2] = nowCheck;
      }
      // Stops on Spot
      if (
        this.driverPitInfo[driver.id][0] > 0 &&
        this.driverPitInfo[driver.id][3] < 0 &&
        driver.pitting &&
        driver.finishStatus === 0 &&
        (driver.speed <= 0.05 || driver.speed.toString().indexOf("E") > -1)
      ) {
        this.driverPitInfo[driver.id][3] = nowCheck;
      }
      // Starts from Spot
      if (
        this.driverPitInfo[driver.id][0] > 0 &&
        this.driverPitInfo[driver.id][3] > 0 &&
        this.driverPitInfo[driver.id][4] < 0 &&
        driver.pitting &&
        driver.finishStatus === 0 &&
        driver.speed >= 1 &&
        driver.speed.toString().indexOf("E") < 0
      ) {
        this.driverPitInfo[driver.id][4] = nowCheck;
      }
      // Stops again before exit (Miss-Spot)
      if (
        this.driverPitInfo[driver.id][0] > 0 &&
        this.driverPitInfo[driver.id][3] > 0 &&
        this.driverPitInfo[driver.id][4] > 0 &&
        driver.pitting &&
        driver.finishStatus === 0 &&
        (driver.speed <= 0.05 || driver.speed.toString().indexOf("E") > -1)
      ) {
        this.driverPitInfo[driver.id][4] = -1;
      }
      // Exits Pits
      if (
        this.driverPitInfo[driver.id][0] > 0 &&
        !driver.pitting &&
        this.driverPitInfo[driver.id][5] < 0 &&
        driver.finishStatus === 0
      ) {
        this.driverPitInfo[driver.id][0] = 0;
        this.driverPitInfo[driver.id][5] = nowCheck;
        this.driverPitInfo[driver.id][1]++;
      }
    } else {
      this.driverPitInfo[driver.id] = [0, -1, -1, -1, -1, -1];
    }
  });
  // Mantém somente o que ainda é consumido
  eDriverPitInfo = this.driverPitInfo;
}
*--------/
  
  /*
  private updateLapRecordTimes() {
    let checkNeeded = false;
    if (
      (highPerformanceMode && nowCheck - this.lastRecordUpdate >= 15) ||
      (lowPerformanceMode && nowCheck - this.lastRecordUpdate >= 66) ||
      (!lowPerformanceMode &&
        !highPerformanceMode &&
        nowCheck - this.lastRecordUpdate >= 32)
    ) {
      checkNeeded = true;
      this.lastRecordUpdate = nowCheck;
    }
    if (!checkNeeded) {
      return;
    }
    if (!this.drivers.length) {
      return;
    }
    let needStoring = false;
    this.drivers.forEach((driver) => {
      if (this.driverLapRecord[driver.id] !== undefined) {
        if (
          driver.finishStatus < 1 &&
          driver.currentTime >= 0 &&
          driver.validLap &&
          driver.pitting < 1 &&
          this.playerSlotId !== -1 &&
          driver.id === this.playerSlotId
        ) {
          let aLength = this.driverLapRecord[driver.id][0].length;
          const storeTime =
            driver.lapPrevious > 0
              ? driver.lapPrevious
              : this.lapTimePreviousSelf > 0
              ? this.lapTimePreviousSelf
              : 0;
          if (
            nowCheck - this.driverLapRecord[driver.id][2][0] > 5500 &&
            driver.lapDistance < 51 &&
            driver.lapDistance > 2 &&
            storeTime > 0
          ) {
            if (aLength > 10 && this.driverLapRecord[driver.id][0][1] < 100) {
              this.driverLapRecord[driver.id][0].push(this.layoutLength);
              this.driverLapRecord[driver.id][1].push(storeTime);
              if (
                this.playerSlotId === driver.id &&
                (this.driverRecordedLaps[0][0] === -1 ||
                  this.driverRecordedLaps[0][0] > storeTime ||
                  this.driverRecordedLaps[1][0] === 0)
              ) {
                this.driverRecordedLaps[0][0] = storeTime;
                this.driverRecordedLaps[1][0] = 1;
                this.driverRecordedLaps[2] = this.driverLapRecord[
                  driver.id
                ][0].map((x) => x);
                this.driverRecordedLaps[3] = this.driverLapRecord[
                  driver.id
                ][1].map((x) => x);

                let tString = "";
                if (
                  r3e.data.TrackId !== -1 &&
                  r3e.data.LayoutId !== -1 &&
                  driver.classId !== -1
                ) {
                  tString = `${r3e.data.TrackId}_${r3e.data.LayoutId}_${driver.classId}`;
                }
                if (tString !== "") {
                  this.storedRecordedLaps[tString] = this.driverRecordedLaps;
                  needStoring = false; // true;
                }
              }
            }
            this.driverLapRecord[driver.id][0] = [0];
            this.driverLapRecord[driver.id][1] = [0];
            this.driverLapRecord[driver.id][0].push(driver.lapDistance);
            this.driverLapRecord[driver.id][1].push(driver.currentTime);
            this.driverLapRecord[driver.id][2][0] = nowCheck + 5000;
            aLength = 2;
            this.lapStartTime = -1;
          }
          if (
            aLength &&
            driver.lapDistance > this.driverLapRecord[driver.id][0][aLength - 1]
          ) {
            this.driverLapRecord[driver.id][0].push(driver.lapDistance);
            this.driverLapRecord[driver.id][1].push(driver.currentTime);
            if (this.lapStartTime === -1) {
              this.lapStartTime = nowCheck - driver.currentTime;
            }
          }
        } else if (
          this.playerSlotId !== -1 &&
          driver.id === this.playerSlotId &&
          this.driverLapRecord[driver.id][2][0] !== -1
        ) {
          this.driverLapRecord[driver.id] = [[0], [0], [-1]];
        }
      } else {
        this.driverLapRecord[driver.id] = [[0], [0], [-1]];
      }
    });
    if (needStoring) {
      localStorage.StoredRecordedLaps = JSON.stringify(
        this.storedRecordedLaps,
        null,
        "  "
      );
    }
  }
  */

  // Shortcut keys
  private showKey = (e: KeyboardEvent) => {
    if (!this.lockHud) {
      if (e.key === "ArrowRight" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        if (this.currentLayout === 1) {
          this.toggleLayout2();
        } else if (this.currentLayout === 2) {
          this.toggleLayout3();
        } else if (this.currentLayout === 3) {
          this.toggleLayout1();
        }
      } else if (e.key === "ArrowLeft" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        if (this.currentLayout === 1) {
          this.toggleLayout3();
        } else if (this.currentLayout === 2) {
          this.toggleLayout1();
        } else if (this.currentLayout === 3) {
          this.toggleLayout2();
        }
      } else if (e.key === "ArrowUp" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        this.toggleHide();
      } else if (e.key === "ArrowDown" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        this.showAllWidgets();
      } else if (e.key === "F1" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        this.copyLayoutToClipboard();
      } else if (e.key === "F5" && e.shiftKey) {
        // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
        window.location.reload();
      }
    }
    if (
      (e.key === "L" || e.key === "l") &&
      e.shiftKey &&
      e.ctrlKey &&
      e.altKey
    ) {
      // showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);
      this.toggleLockHud();
      /*} else {
			showDebugMessage(`Key: ${e.key} | Code: ${e.code}`);*/
    }
    if (!e.shiftKey) {
      this.shiftModifier = false;
    }
  };

  @action
  private parseRankingData = () => {
    // console.log('TRYING TO FETCH RANKING DATA');
    if (rankData.length <= 0) {
      getJason();
    }
    if (rankData.length <= 0) {
      this.parseRankingDataTimeout = setTimeout(this.parseRankingData, 5000);
    }
  };

  @action
  private checkMouseMove = () => {
    // sempre limpa o timeout primeiro
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    // condição de mouse parado
    if (
      Math.abs(this.nowMousemovement - this.lastMousemovement) < 100 ||
      this.lastMousemovement === this.nowMousemovement
    ) {
      this.lastMousemovement = this.nowMousemovement;
      this.mouseOnTheMove = false;
      this.hideMouse = true;
      this.settingsOpacity = 0;
    }
    // se não está oculto — programa o timer novamente
    if (!this.hideMouse) {
      this.lastMousemovement = this.nowMousemovement;
      this.mouseTimeout = window.setTimeout(this.checkMouseMove, 3000);
    }
  };

  private shiftKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      this.shiftModifier = true;
    }
  };

  private shiftKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      this.shiftModifier = false;
    }
  };

  private onKeyPress = (e: KeyboardEvent) => {
    if (this.lockHud) {
      return;
    }
    if (currentFocusIsInput() && e.key === "Enter" && this.logoUrlEdit) {
      this.enterPressed = true;
      return;
    }

    if (e.key === "I" && e.shiftKey) {
      if (this.updateFunction) {
        unregisterUpdate(this.updateFunction);
        this.updateFunction = null;
        this.setData(true);
      } else {
        this.updateFunction = this.setData.bind(this);
        registerUpdate(this.updateFunction);
      }
    }
  };
  // Ajustado para aceitar qualquer resolução
  private getPositionRelative = (x: number, y: number) => {
    if (!this.appRef.current) {
      return { x: 0, y: 0 };
    }

    const offset = this.appRef.current.getBoundingClientRect();

    return {
      x: (x - offset.left) / this.appZoom,
      y: (y - offset.top) / this.appZoom,
    };
  };

  private copyLayoutToClipboard() {
    const json = JSON.stringify(this.settings, null, "  ");
    const copyFrom = document.createElement("textarea");
    copyFrom.value = json;
    copyFrom.style.opacity = "0";
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    document.body.removeChild(copyFrom);
    showDebugMessage(_("Saved Layout-Settings to Clipboard"), 3000);
  }
  // Ajustado para aceitar qualquer resolução
  @action
  private onMouseDown = (e: React.MouseEvent) => {
    const widgetId = this.getWidgetId(e);

    if (!widgetId) {
      return;
    }
    if (this.lockHud && e.button !== 2) {
      return;
    }
    if (e.button === 2) {
      if (widgetId && widgetId === "fuelDetail") {
        this.elBlocko = false;
        blockFuelCalc = this.elBlocko;
      }
      return;
    }
    this.elBlocko = true;
    blockFuelCalc = this.elBlocko;

    if (this.lockHud) {
      return;
    }
    this.showEditGrid = true;

    const widgetEl = e.currentTarget as HTMLDivElement;
    const widgetOffset = widgetEl.getBoundingClientRect();

    const cursorPosition = this.getPositionRelative(e.clientX, e.clientY);

    // Need to scale these with zoom to get proper values
    const correctedOffset = this.getPositionRelative(
      widgetOffset.left,
      widgetOffset.top
    );

    this.currentCursorWidgetOffset = {
      id: widgetId,
      x: correctedOffset.x - cursorPosition.x,
      y: correctedOffset.y - cursorPosition.y,
    };
  };

  @action
  private onMouseDowna = (e: React.MouseEvent) => {
    if (this.lockHud) {
      return;
    }
    const widgetId = this.getWidgetId(e);
    if (!widgetId) {
      return;
    }
    this.showEditGrid = true;

    const widgetEl = e.currentTarget as HTMLDivElement;
    const widgetOffset = widgetEl.getBoundingClientRect();

    const cursorPosition = this.getPositionRelative(e.clientX, e.clientY);

    // Need to scale these with zoom to get proper values
    const correctedOffset = this.getPositionRelative(
      widgetOffset.left * (this.appZoom / 2),
      widgetOffset.top * (this.appZoom / 2)
    );

    this.currentCursorWidgetOffset = {
      id: widgetId,
      x: correctedOffset.x - cursorPosition.x,
      y: correctedOffset.y - cursorPosition.y,
    };
  };

  @action
  private onWheel = (e: React.WheelEvent) => {
    if (this.lockHud) {
      return;
    }
    const widgetId = this.getWidgetId(e);
    if (!widgetId) {
      return;
    }
    const diff =
      e.deltaY < 0
        ? this.shiftModifier
          ? 0.2
          : 0.01
        : this.shiftModifier
        ? -0.2
        : -0.01;
    this.settings[widgetId].zoom = this.settings[widgetId].zoom + diff;
    this.settings[widgetId].zoom = Math.max(
      0.1,
      Math.min(3, this.settings[widgetId].zoom)
    );
    this.saveSettings();
  };

  @action
  private onMouseUp = () => {
    setTimeout(() => {
      this.elBlocko = false;
      blockFuelCalc = this.elBlocko;
    }, 1000);
    if (this.lockHud) {
      return;
    }
    this.currentCursorWidgetOffset = null;
    this.showEditGrid = false;
  };

  @action
  private timerSaveSettings = () => {
    this.saveSettings();
  };

  private saveSettings() {
    if (this.currentLayout === 1) {
      localStorage.appSettings = JSON.stringify(this.settings, null, "  ");
    } else if (this.currentLayout === 2) {
      localStorage.appSettings2 = JSON.stringify(this.settings, null, "  ");
    } else if (this.currentLayout === 3) {
      localStorage.appSettings3 = JSON.stringify(this.settings, null, "  ");
    }
  }

  @action
  private recoverSettings = () => {
    let savedSettings: any = {};
    if (this.currentLayout === 1) {
      if (localStorage.appSettings) {
        savedSettings = JSON.parse(localStorage.appSettings);
        let hasFaulty = false;
        Object.keys(savedSettings).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
            hasFaulty = true;
          }
          Object.keys(savedSettings[key].subSettings).forEach((keya) => {
            if (this.settings[key] === undefined) {
              hasFaulty = true;
            } else if (
              !Object.prototype.hasOwnProperty.call(
                this.settings[key].subSettings,
                keya
              )
            ) {
              hasFaulty = true;
            } else if (keya === "showMPH") {
              this.mphSpeed = savedSettings[key].subSettings[keya].enabled;
              speedInMPH = this.mphSpeed;
            }
          });
        });
        if (hasFaulty) {
          this.resetSettings();
        } else {
          this.settings = merge(this.settings, savedSettings);
        }
      } else {
        this.resetSettings();
      }
      this.hLogoUrl = localStorage.currentLogo
        ? localStorage.currentLogo
        : (this.hLogoUrl = "./../../img/logo.png");
      eLogoUrl = this.hLogoUrl;
    } else if (this.currentLayout === 2) {
      if (localStorage.appSettings2) {
        savedSettings = JSON.parse(localStorage.appSettings2);
        let hasFaulty = false;
        Object.keys(savedSettings).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
            hasFaulty = true;
          }
          Object.keys(savedSettings[key].subSettings).forEach((keya) => {
            if (this.settings[key] === undefined) {
              hasFaulty = true;
            } else if (
              !Object.prototype.hasOwnProperty.call(
                this.settings[key].subSettings,
                keya
              )
            ) {
              hasFaulty = true;
            } else if (keya === "showMPH") {
              this.mphSpeed = savedSettings[key].subSettings[keya].enabled;
              speedInMPH = this.mphSpeed;
            }
          });
        });
        if (hasFaulty) {
          this.resetSettings();
        } else {
          this.settings = merge(this.settings, savedSettings);
        }
      } else {
        this.resetSettings();
      }
      this.hLogoUrl = localStorage.currentLogo2
        ? localStorage.currentLogo2
        : (this.hLogoUrl = "./../../img/logo.png");
      eLogoUrl = this.hLogoUrl;
    } else if (this.currentLayout === 3) {
      if (localStorage.appSettings3) {
        savedSettings = JSON.parse(localStorage.appSettings3);
        let hasFaulty = false;
        Object.keys(savedSettings).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
            hasFaulty = true;
          }
          Object.keys(savedSettings[key].subSettings).forEach((keya) => {
            if (this.settings[key] === undefined) {
              hasFaulty = true;
            } else if (
              !Object.prototype.hasOwnProperty.call(
                this.settings[key].subSettings,
                keya
              )
            ) {
              hasFaulty = true;
            } else if (keya === "showMPH") {
              this.mphSpeed = savedSettings[key].subSettings[keya].enabled;
              speedInMPH = this.mphSpeed;
            }
          });
        });
        if (hasFaulty) {
          this.resetSettings();
        } else {
          this.settings = merge(this.settings, savedSettings);
        }
      } else {
        this.resetSettings();
      }
      this.hLogoUrl = localStorage.currentLogo3
        ? localStorage.currentLogo3
        : (this.hLogoUrl = "./../../img/logo.png");
      eLogoUrl = this.hLogoUrl;
    }
  };

  @action
  private setData = (clear = false) => {
    this.debugData = !clear ? r3e.data : null;
  };

  @action
  private changeLogoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    this.hLogoUrl =
      value === "none" || value === "" ? "./../../img/logo.png" : value;
    eLogoUrl = this.hLogoUrl;
    if (this.currentLayout === 1) {
      localStorage.currentLogo = this.hLogoUrl;
    } else if (this.currentLayout === 2) {
      localStorage.currentLogo2 = this.hLogoUrl;
    } else if (this.currentLayout === 3) {
      localStorage.currentLogo3 = this.hLogoUrl;
    }
    if (this.enterPressed) {
      this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
      this.logoUrlEdit = false;
      this.enterPressed = false;
    }
    this.saveSettings();
  };

  @action
  private emptyUrl = () => {
    this.hLogoUrl = "";
    this.logoUrlEdit = true;
  };

  @action
  private onMouseMove = (e: MouseEvent) => {
    if (this.lockHud) {
      return;
    }
    // showDebugMessage(`${this.hLogoUrl}`);

    // const x1 = e.clientX;
    // const x2 = 0;
    this.nowMousemovement = e.clientX + e.clientY;

    if (
      Math.abs(this.lastMousemovement - this.nowMousemovement) > 100 ||
      this.mouseOnTheMove
    ) {
      this.lastMousemovement = this.nowMousemovement;
      this.hideMouse = false;
      if (this.mouseTimeout) {
        clearTimeout(this.mouseTimeout);
      }
      this.mouseTimeout = window.setTimeout(this.checkMouseMove, 3000);
    }

    /* const diff = Math.max(0, 1 - Math.pow(Math.max(0, (x1 - x2)) / 100, 7));
		this.settingsOpacity = 1;// diff;
		if (this.settingsOpacity === 0) {
			clearTimeout(this.mouseTimeout);
			this.hideMouse = false;
		} */

    this.settingsOpacity = 1; // diff;

    const cursorOffset = this.currentCursorWidgetOffset;
    if (!cursorOffset || !cursorOffset.id) {
      return;
    }

    const widgetId = cursorOffset.id;
    const widgetSettings = this.settings[widgetId];

    const cursorPosition = this.getPositionRelative(e.clientX, e.clientY);

    // Apply offset so widgets don't move relative to cursor start
    widgetSettings.position.x = cursorPosition.x + cursorOffset.x;
    widgetSettings.position.y = cursorPosition.y + cursorOffset.y;

    // Snap to 10px grid
    widgetSettings.position.x -= this.snapOn
      ? widgetSettings.position.x % 10
      : widgetSettings.position.x % 1;
    widgetSettings.position.y -= this.snapOn
      ? widgetSettings.position.y % 10
      : widgetSettings.position.y % 1;

    this.saveSettings();
  };

  @action
  private toggleWidget = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.getAttribute("data-name");
    if (!name) {
      return;
    }
    this.settings[name].enabled = !this.settings[name].enabled;
    this.saveSettings();
  };

  @action
  private zoomWidget = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.getAttribute("data-name");
    if (!name) {
      return;
    }
    this.settings[name].zoom = parseFloat(e.target.value);
    this.saveSettings();
  };

  @action
  private resetWidget(e: React.MouseEvent) {
    const name = e.currentTarget.getAttribute("data-name");
    if (!name) {
      eResetId = "";
      return;
    }
    eResetId = name;
    return;
  }

  @action
  private toggleSubWidget = (e: ChangeEvent) => {
    this.hLogoUrl =
      this.hLogoUrl === "none" || this.hLogoUrl === ""
        ? "./../../img/logo.png"
        : this.hLogoUrl;
    eLogoUrl = this.hLogoUrl;
    this.logoUrlEdit = false;
    const name = e.target.getAttribute("data-name");
    const subName = e.target.getAttribute("data-sub-name");
    if (!name || !subName) {
      return;
    }
    const subSettings = this.settings[name].subSettings;
    if (!subSettings) {
      return;
    }

    subSettings[subName].enabled = !subSettings[subName].enabled;

    if (subName === "clearComboData" || subName === "clearAllData") {
      setTimeout(() => {
        subSettings[subName].enabled = false;
      }, 100);
      this.showSettings = !this.showSettings;
      return;
    }
    if (subName === "showMPH") {
      this.mphSpeed = subSettings[subName].enabled;
      speedInMPH = this.mphSpeed;
    }
    this.saveSettings();
  };

  @action
  private showAllWidgets = () => {
    this.showAll = !this.showAll;
    showAllMode = this.showAll;
    localStorage.showAllMode = showAllMode ? "1" : "0";
    if (showAllMode) {
      this.hide = false;
      hideWidgets = this.hide;
      localStorage.hideWidgets = "0";
    }
    this.saveSettings();
    window.location.reload();
  };

  @action
  private toggleChangeLog = () => {
    this.changeLogToggled = true;
    window.location.reload();
  };

  @action
  private togglePerformanceModeLow = () => {
    this.lowPerfo = true;
    this.highPerfo = false;
    lowPerformanceMode = this.lowPerfo;
    highPerformanceMode = this.highPerfo;
    localStorage.lowPerformanceMode = lowPerformanceMode ? "1" : "0";
    localStorage.highPerformanceMode = highPerformanceMode ? "1" : "0";
    this.saveSettings();
  };

  @action
  private togglePerformanceModeNormal = () => {
    this.lowPerfo = false;
    this.highPerfo = false;
    lowPerformanceMode = this.lowPerfo;
    highPerformanceMode = this.highPerfo;
    localStorage.lowPerformanceMode = lowPerformanceMode ? "1" : "0";
    localStorage.highPerformanceMode = highPerformanceMode ? "1" : "0";
    this.saveSettings();
  };

  @action
  private togglePerformanceModeHigh = () => {
    this.lowPerfo = false;
    this.highPerfo = true;
    lowPerformanceMode = this.lowPerfo;
    highPerformanceMode = this.highPerfo;
    localStorage.lowPerformanceMode = lowPerformanceMode ? "1" : "0";
    localStorage.highPerformanceMode = highPerformanceMode ? "1" : "0";
    this.saveSettings();
  };

  @action
  private toggleSnap = () => {
    this.snapOn = !this.snapOn;
    localStorage.snapOn = this.snapOn ? "1" : "0";
    this.saveSettings();
  };

  @action
  private toggleLayout1 = () => {
    this.currentLayout = 1;
    localStorage.currentLayout = "1";
    showDebugMessage(_("Restored Layout 1"), 1000);
    this.recoverSettings();
    this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
  };

  @action
  private toggleLayout2 = () => {
    this.currentLayout = 2;
    localStorage.currentLayout = "2";
    showDebugMessage(_("Restored Layout 2"), 1000);
    this.recoverSettings();
    this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
  };

  @action
  private toggleLayout3 = () => {
    this.currentLayout = 3;
    localStorage.currentLayout = "3";
    showDebugMessage(_("Restored Layout 3"), 1000);
    this.recoverSettings();
    this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
  };

  @action
  private toggleGainLossPermanentBar = () => {
    this.gainLossPermanentBar = !this.gainLossPermanentBar;
    eGainLossPermanentBar = this.gainLossPermanentBar;
    localStorage.gainLossPermanentBar = this.gainLossPermanentBar ? "1" : "0";
    this.saveSettings();
  };

  @action
  private toggleGainLossPermanentTower = () => {
    this.gainLossPermanentTower = !this.gainLossPermanentTower;
    eGainLossPermanentTower = this.gainLossPermanentTower;
    localStorage.gainLossPermanentTower = this.gainLossPermanentTower
      ? "1"
      : "0";
    this.saveSettings();
  };

  @action
  private toggleRankInvert = () => {
    this.rankInvert = !this.rankInvert;
    eRankInvert = this.rankInvert;
    localStorage.rankInvert = this.rankInvert ? "1" : "0";
    this.saveSettings();
  };

  @action
  private toggleRankInvertRelative = () => {
    this.rankInvertRelative = !this.rankInvertRelative;
    eRankInvertRelative = this.rankInvertRelative;
    localStorage.rankInvertRelative = this.rankInvertRelative ? "1" : "0";
    this.saveSettings();
  };

  @action
  private driverNumTo1 = () => {
    this.driverNum = 1;
    eDriverNum = this.driverNum;
    localStorage.driverNum = "1";
    this.saveSettings();
  };

  @action
  private driverNumTo2 = () => {
    this.driverNum = 2;
    eDriverNum = this.driverNum;
    localStorage.driverNum = "2";
    this.saveSettings();
  };

  @action
  private driverNumTo3 = () => {
    this.driverNum = 3;
    eDriverNum = this.driverNum;
    localStorage.driverNum = "3";
    this.saveSettings();
  };

  @action
  private changeBeepVolume = (e: ChangeEvent<HTMLInputElement>) => {
    this.settings.spotting.volume = parseFloat(e.target.value);
    this.saveSettings();
  };

  @action
  private changeGraphDuration = (e: ChangeEvent<HTMLInputElement>) => {
    this.settings.inputsGraph.duration = parseFloat(e.target.value);
    this.saveSettings();
  };

  @action
  private changeResetText = () => {
    if (this.resetString === `${_("Reset Settings")}`) {
      clearInterval(this.resetInterval!);
      this.resetString = `!!! ${_("Click again to confirm Layout reset")} !!!`;
      this.resetInterval = setInterval(this.clearResetInterval, 5000);
    } else {
      clearInterval(this.resetInterval!);
      this.resetString = _("Layout reseted!");
      this.resetInterval = setInterval(this.clearResetInterval, 5000);
      this.resetSettings();
    }
  };

  @action
  private clearResetInterval = () => {
    clearInterval(this.resetInterval!);
    this.resetString = _("Reset Settings");
  };

  @action
  private resetSettings = () => {
    Object.keys(this.settings).forEach((key) => {
      const setting = this.settings[key];
      const defaultSettings = this.defaultsettings[key];
      setting.position.x = defaultSettings.position.x;
      setting.position.y = defaultSettings.position.y;
      setting.volume = defaultSettings.volume;
      setting.zoom = defaultSettings.zoom;
      setting.enabled = defaultSettings.enabled;
      Object.keys(setting.subSettings).forEach((keya) => {
        const subSetting = setting.subSettings[keya];
        const defaultSubSetting = defaultSettings.subSettings[keya];
        subSetting.enabled = defaultSubSetting.enabled;
      });
    });
    if (this.currentLayout === 1) {
      delete localStorage.appSettings;
      this.hLogoUrl = "./../../img/logo.png";
      eLogoUrl = this.hLogoUrl;
      delete localStorage.currentLogo;
    } else if (this.currentLayout === 2) {
      delete localStorage.appSettings2;
      this.hLogoUrl = "./../../img/logo.png";
      eLogoUrl = this.hLogoUrl;
      delete localStorage.currentLogo2;
    } else if (this.currentLayout === 3) {
      delete localStorage.appSettings3;
      this.hLogoUrl = "./../../img/logo.png";
      eLogoUrl = this.hLogoUrl;
      delete localStorage.currentLogo3;
    }
    delete localStorage.gainLossPermanentTower;
    delete localStorage.gainLossPermanentBar;
    this.saveSettings();
  };

  @action
  private handleResize = () => {
    const widthRatio = window.innerWidth / 1920;
    const heightRatio = window.innerHeight / 1080;
    const ratio = Math.min(widthRatio, heightRatio);
    this.appZoom = ratio;
  };

  @action
  private updateDebugFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.debugFilter = e.target.value;
  };

  @action
  private clearDebugFilter = () => {
    this.debugFilter = "";
  };

  @action
  private toggleSettings = () => {
    this.showSettings = !this.showSettings;
    this.settings.tvTower.subSettings.hLogoUrl.enabled = false;
  };

  @action
  private toggleHide = () => {
    this.hide = !this.hide;
    hideWidgets = this.hide;
    localStorage.hideWidgets = hideWidgets ? "1" : "0";
    this.saveSettings();
  };
  
  @action
  private toggleLockHud = () => {
    this.lockHud = !this.lockHud;
    localStorage.lockHudStatus = this.lockHud ? "1" : "0";
    this.saveSettings();
    if (this.lockHud) {
      showDebugMessage(
        `!!! ${_(
          "UI IS NOW LOCKED - UNLOCK WITH CTRL+ALT+SHIFT+L !!!\n\t\t\t\tNO FURTHER MESSAGES"
        )}`,
        5000
      );
    } else {
      showDebugMessage(`!!! ${_("UI IS NOW UNLOCKED")} !!!`, 5000);
    }
  };

  @action
  private setLocale = (lang: Locales) => {
    setLocale(lang);
    this.language = lang;
    localStorage.language = lang;
    clearInterval(this.resetInterval!);
    this.resetInterval = setInterval(this.clearResetInterval, 10);
  };

  private getWidgetId(e: React.MouseEvent | React.WheelEvent) {
    return (e.currentTarget as HTMLDivElement).getAttribute("data-id");
  }
  private getClassName(e: React.MouseEvent | React.WheelEvent) {
    return (e.currentTarget as HTMLDivElement).className;
  }

  render() {
    const driverDataPlace = r3e.data
      ? r3e.data.DriverData
        ? r3e.data.DriverData[0]
          ? r3e.data.DriverData[0].Place
          : -1
        : -1
      : -1;
    if (localStorage.gameInMenus && !isMenu) {
      isMenu = true;
      window.location.reload();
    }
    if (!this.gameInMenus) {
      isMenu = false;
    }
    const showAtAll =
      r3e.data &&
      !this
        .gameInMenus /* && (!this.gameInReplay || this.sessionType === ESession.Race) */ &&
      r3e.data.DriverData.length > 0;
    const versionMisMatch =
      // r3e.data.VersionMinor !== process.env.SHARED_MEMORY_VERSION_MINOR ||
      r3e.data !== undefined &&
      r3e.data.VersionMajor !== Number(process.env.SHARED_MEMORY_VERSION_MAJOR);
    const showNoData = noData;
    if ((r3e.data === undefined || versionMisMatch) && eIsIngameBrowser) {
      setTimeout(() => {
        this.forceUpdate();
      }, 100);

      if (nowCheck - this.loadTime < 2000) {
        return null;
      }
      return (
        <div className="help">
          {versionMisMatch && (
            <div className="versionMismatch">{_("Version mismatch")}!</div>
          )}
          {_("SealHud Start-Parameter set correctly")}
          <div className="fillor">{`${"INVISIBLE_FILLER"}`}</div>
          <div className="noData">{_("NO Data-Feed detected")}</div>
          <br />
          {_("You need to download/run dash.exe")}
          <br />
          {_("Visit the Forum-Thread to Download")}
          <br />
          <br />
          {_("Or enable this option in Crew-Chief:")}
          <div className="ccOption">{_("Enable WebHud integration")}</div>
        </div>
      );
    }

    if (r3e.data !== undefined && this.tractionControlPercentUndefined) {
      setTimeout(() => {
        this.forceUpdate();
      }, 100);

      if (nowCheck - this.loadTime < 2000) {
        return null;
      }
      return (
        <div className="help">
          {_("SealHud Start-Parameter set correctly")}
          <div className="fillor">{`${"INVISIBLE_FILLER"}`}</div>
          <div className="noData" style={{}}>
            {_("Your dash.exe is OUTDATED")}
          </div>
          <br />
          {_("You need to re-download dash.exe")}
          <br />
          {_("Visit the Forum-Thread to Download")}
        </div>
      );
    }

    if (
      (!eIsIngameBrowser && (!showAtAll || showNoData)) ||
      (this.gameInReplay &&
        (driverDataPlace === -1 || this.sessionType !== 2) &&
        this.playerDriverDataIndex === -1)
    ) {
      setTimeout(() => {
        this.forceUpdate();
      }, 1000);
      if (nowCheck - this.loadTime > 2000) {
        return <div>{`${""}`}</div>;
      }
      return null;
    }
    // SPLASH-SCREEN
    if (!this.changeLogRead) {
      return (
        <div
          className="viewport"
          style={{
            zoom: this.appZoom,
          }}
        >
          <div className="changelog">
            <div className="sealLogo">
              <img
                className="oh_logo"
                src={require("./../../img/sealhud_logo.png")}
              />
            </div>
            <div className="sealTitle">{`${" Welcome to SealHud "}`}</div>
            <div className="sealVersion">{`Version: ${currentVersion}`}</div>
            <div className="forumTitle">
              {`${"For issues and bugs, visit the\nSealHud forum thread:"}`}
            </div>
            <img
              className="forumQRImg"
              src={require("./../../img/qr_forum.png")}
            />
            <div className="line" />
            <div className="payPal_1">{`Donations:`}</div>
            <div className="coffeePot">
              <img
                className="coffeePotImg"
                src={require("./../../img/donate.png")}
              />
            </div>
            <img className="paypalQRImg" src={require("./../../img/qr.png")} />
            <div className="changeLogTitle">{`${"CHANGELOG"}`}</div>
            <div className="theLog">
              <b>
                <span
                  style={{
                    textDecoration: "underline",
                    fontSize: "26px",
                  }}
                >
                  {`${"November 23, 2025"}`}
                </span>
              </b>
              <br />
              <ul>

                <li>
                  {`${"Position Bar, TV Tower and Relative timings:"}`}
                  <br />
                  {`${"HUGE amount of work went into getting this to work correctly. Now, the gaps between drivers are identical to those in RaceRoom telemetry. Furthermore, there's no more delay in generating times, as everything is done in 'live mode'. We also no longer need to collect track data for this! \õ/"}`}
                  <br />
                </li>
                <br />

                <li>
                  {`${"Performance modes:"}`}
                  <br />
                  {`${"Fixed! They simply weren't working and it made no difference which one you chose. Now you can select one of the 3 available modes: Low Performance (15 fps), Normal (30 fps) and High Performance (60 fps)."}`}
                  <br />
                </li>
                <br />

                <li>
                  {`${"Inputs Graph Widget:"}`}
                  <br />
                  {`${"Now user can change the duration time telemetry data will be kept."}`}
                  <br />
                  {`${"Included 'input meters' option, for clutch, brake, throttle and steering wheel. This option extends the widget."}`}
                  <br />
                </li>
                <br />

                <li>
                  {`${"Position Bar:"}`}
                  <br />
                  {`${"'Show penalties' option included. This will show penalties for all drivers in the field."}`}
                  <br />
                  {`${"'Show Positions Gain/Loss' option included. "}`}
                  <br />
                  {`${"'Show Pit-Status' option included. This will show the number of pit stops for all drivers."}`}
                  <br />
                </li>
                <br />

                <li>
                  {`${"TV Tower:"}`}
                  <br />
                  {`${"'Show penalties' option included. This will show penalties for all drivers in the field."}`}
                  <br />
                  {`${"'Show Positions Gain/Loss' option included."}`}
                  <br />
                </li>
                <br />

                <li>
                  {`${"Translations:"}`}
                  <br />
                  {`${"Added and fixed a bunch of things."}`}
                  <br />
                </li>

              </ul>
              <b>{`${"--------------------------------------------------- CHANGELOG END ---------------------------------------------------"}`}</b>
              <br />
              <br />
              {`${"If you encounter any sort of problems, have questions or suggestions, feel free to post in the Forum-Thread!"}`}
              <br />
              {`${"HUGE THANKS to everyone on the forum who has been reporting bugs and helping improve SealHud."}`}
              <br />
              <br />
              {`${'**ATTENTION**: Starting December 1, 2025, SealHud will ONLY be available at https://sealhud.github.io/. The "dsjunges83" repository will no longer work. Make sure you set the correct parameter in the Steam launcher:'}`}
              <br />
              {`${"-webHudUrl=https://sealhud.github.io/"}`}
              <br />
              <br />
              {`${"SealHud is free to use and it´s a fork from OtterHud."}`}
              <br />
              <br />
              {`${"Thanks for using this hud! And thanks for driving RaceRoom!"}`}
              <br />
              {`${"The SealHUD Team & its collaborators!"}`}
              <br />
              {`${"• Diego Junges"}`}
              <br />
              {`${"• Pedro Santana"}`}
              <br />
              {`${"• Leonardo Santana"}`}
              <br />
              {`${"• Florian (Mad Day Man)"}`}
              <br />
              <br />
              {`${"Special thanks to ChatGPT and CoPilot, who help us REALLY a lot."}`}
              <br />
            </div>
            <div
              className="gotIt"
              onClick={this.toggleChangeLog}
              style={{
                lineHeight: localStorage.language === "de" ? "52px" : "42px",
                fontSize: localStorage.language === "de" ? "40px" : "42px",
              }}
            >
              {_("PRESS CLUTCH / BRAKE / THROTTLE - OR CLICK HERE - TO CLOSE")}
            </div>
          </div>
        </div>
      );
    }

    return (
      (showNoData && null) || (
        <div
          className="viewport"
          style={{
            zoom: this.appZoom,
          }}
        >
          <main
            ref={this.appRef}
            className={classNames("app", { hide: this.hide || this.tempHide })}
          >
            {!eIsIngameBrowser && this.lastCheck === nowCheck && (
              <div className="invisPlaceholder">{`${" "}`}</div>
            )}
            {this.getWidgets()}

            {this.showSettings && this.getAppSettings()}

            <div
              style={{
                opacity: this.hideMouse ? 0 : this.settingsOpacity,
              }}
              className={classNames("toggleSettings", {
                hideIcon: this.hideMouse || this.lockHud,
              })}
              onClick={this.toggleSettings}
            >
              <SvgIcon src={require("./../../img/icons/cog.svg")} />
            </div>
            <div
              style={{
                opacity: this.hideMouse ? 0 : this.settingsOpacity,
              }}
              className={classNames("toggleVisibility", {
                hideIcon: this.hideMouse || this.lockHud,
              })}
              onClick={this.toggleHide}
            >
              <SvgIcon src={require("./../../img/icons/eye.svg")} />
            </div>
            <div
              style={{
                opacity: this.hideMouse ? 0 : this.settingsOpacity,
              }}
              className={classNames("toggleLayout1", {
                hideIcon: this.hideMouse || this.lockHud,
                active: this.currentLayout === 1,
              })}
              onClick={this.toggleLayout1}
            >
              {`${"L1"}`}
            </div>
            <div
              style={{
                opacity: this.hideMouse ? 0 : this.settingsOpacity,
              }}
              className={classNames("toggleLayout2", {
                hideIcon: this.hideMouse || this.lockHud,
                active: this.currentLayout === 2,
              })}
              onClick={this.toggleLayout2}
            >
              {`${"L2"}`}
            </div>
            <div
              style={{
                opacity: this.hideMouse ? 0 : this.settingsOpacity,
              }}
              className={classNames("toggleLayout3", {
                hideIcon: this.hideMouse || this.lockHud,
                active: this.currentLayout === 3,
              })}
              onClick={this.toggleLayout3}
            >
              {`${"L3"}`}
            </div>
            {(this.lockHud && (
              <div
                style={{
                  opacity: this.hideMouse ? 0 : this.settingsOpacity,
                }}
                className={classNames("lockHud", {
                  hideIcon: this.hideMouse || this.lockHud,
                  active: this.lockHud,
                })}
                onClick={this.toggleLockHud}
              >
                <SvgIcon src={require("./../../img/icons/locked.svg")} />
              </div>
            )) ||
              (!this.lockHud && (
                <div
                  style={{
                    opacity: this.hideMouse ? 0 : this.settingsOpacity,
                  }}
                  className={classNames("lockHud", {
                    hideIcon: this.hideMouse || this.lockHud,
                    active: this.lockHud,
                  })}
                  onClick={this.toggleLockHud}
                >
                  <SvgIcon src={require("./../../img/icons/unlocked.svg")} />
                </div>
              ))}
          </main>
          {this.debugData && this.getDebug()}
          {this.showEditGrid && <div className="editGrid" />}
        </div>
      )
    );
  }

  private getDebug() {
    return (
      <div
        className={classNames("debug", {
          hide: this.hide || this.tempHide,
        })}
      >
        <input
          value={this.debugFilter}
          onChange={this.updateDebugFilter}
          // tslint:disable-next-line:max-line-length
          placeholder={_("Type to filter keys")}
        />
        <div className="clear" onClick={this.clearDebugFilter}>
          {`${"X"}`}
        </div>
        <pre className="debugInfo">
          {prettyDebugInfo(this.debugData!, this.debugFilter)}
        </pre>
      </div>
    );
  }

  private getWidgets() {
    return (
      <div className="widgets">
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.gforce.enabled && (
            <Gforce
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.gforce}
            />
          )}
        {this.settings.positionBar.enabled && (
          <PositionBar
            settings={this.settings.positionBar}
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            relative={false}
          />
        )}
        {this.settings.positionBarRelative.enabled && (
          <PositionBar
            settings={this.settings.positionBarRelative}
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            relative={true}
          />
        )}

        {this.settings.motec.enabled && (
          <Motec
            settings={this.settings.motec}
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
          />
        )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.progress.enabled && (
            <Progress
              settings={this.settings.progress}
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
            />
          )}
        {this.settings.spotting.enabled && (
          <Spotting
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.spotting}
          />
        )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.aids.enabled && (
            <Aids
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.aids}
            />
          )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.crewChief.enabled && (
            <CrewChief
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.crewChief}
            />
          )}
        {this.settings.overtakingAids.enabled && (
          <OvertakingAids
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.overtakingAids}
          />
        )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.damage.enabled && (
            <Damage
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.damage}
            />
          )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.tires.enabled && (
            <Tires
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.tires}
            />
          )}
        {this.settings.inputs.enabled && (
          <Inputs
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.inputs}
          />
        )}
        {this.settings.inputsGraph?.enabled && (
          <InputsGraph
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.inputsGraph}
          />
        )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.fuel.enabled && (
            <Fuel
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.fuel}
            />
          )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.fuelDetail.enabled && (
            <FuelDetail
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.fuelDetail}
            />
          )}
        {this.settings.clock.enabled && (
          <Clock
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.clock}
          />
        )}
        {this.settings.cornerNames.enabled && (
          <CornerNames
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.cornerNames}
          />
        )}
        {this.settings.tvTower.enabled && (
          <TvTower
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.tvTower}
          />
        )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.info.enabled && (
            <Info
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.info}
            />
          )}
        {this.playerIsFocus &&
          !this.gameInReplay &&
          this.settings.pitstop.enabled && (
            <Pitstop
              onMouseDown={this.onMouseDown}
              onWheel={this.onWheel}
              settings={this.settings.pitstop}
            />
          )}
        {this.settings.startingLights.enabled && (
          <StartingLights
            onMouseDown={this.onMouseDowna}
            onWheel={this.onWheel}
            settings={this.settings.startingLights}
          />
        )}
        {this.settings.pitLimiter.enabled && (
          <PitLimiter
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.pitLimiter}
          />
        )}
        {this.settings.flags.enabled && (
          <Flags
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
            settings={this.settings.flags}
          />
        )}
        {this.settings.graphs.enabled && (
          <Graphs opacity={this.settingsOpacity} />
        )}
      </div>
    );
  }

  private getAppSettings() {
    return (
      <div className="settings">
        <div
          className="versionNumber"
          style={{
            padding: "0px",
            textAlign: "left",
          }}
        >
          {_("Current version:")} {currentVersion}
        </div>
        <button
          className={classNames("buttonSnap", {
            active: this.snapOn,
          })}
          onClick={this.toggleSnap}
        >
          {this.snapOn
            ? _("Snap To Grid Enabled")
            : _("Snap To Grid Disabled")}
        </button>
        <button className="toggleChangeLog" onClick={this.toggleChangeLog}>
          {_("Changelog / Help")}
        </button>

        <div className="sealhud_logo">
          <img
            className="oh_logo"
            src={require("./../../img/sealhud_logo.png")}
          />
        </div>
        <div
          className="performance"
          style={{
            color:
              ((this.tempLowPerfo || this.lowPerfo) && this.performance < 10) ||
              (!this.tempLowPerfo &&
                (this.highPerfo || this.tempHighPerfo) &&
                this.performance < 50) ||
              (!this.tempLowPerfo &&
                !this.tempHighPerfo &&
                !this.lowPerfo &&
                !this.highPerfo &&
                this.performance < 25)
                ? "red"
                : "lime",
            padding: currentVersion < 1.16 ? "15px" : "0px",
          }}
        >
          {_("Updates/sec:")}{" "}
          {this.lowPerfo || this.tempLowPerfo
            ? this.performance > 15
              ? 15
              : this.performance
            : this.tempHighPerfo || this.highPerfo
            ? this.performance > 60
              ? 60
              : this.performance
            : this.performance > 30
            ? 30
            : this.performance}
        </div>

        {Object.keys(this.settings).map((widgetId) => {
          const subSettings = this.settings[widgetId].subSettings;
          if (widgetId !== "manualStart") {
            return this.getWidgetSetting(widgetId, subSettings);
          }
          return null;
        })}

        <div className="languages">
          {Object.keys(getTranslations()).map((langKey) => {
            const languageLookup: { [key: string]: string } = {
              de: _("German"),
              en: _("English"),
              fr: _("French"),
              pt: _("Portuguese"),
              es: _("Spanish"),
              it: _("Italian"),
              pl: _("Polish"),
            };
            return (
              <div
                key={langKey}
                className={classNames("language", {
                  active: langKey === this.language,
                })}
                onClick={() => {
                  this.setLocale(langKey as Locales);
                }}
              >
                {languageLookup[langKey]}
              </div>
            );
          })}
        </div>
        <button
          className={classNames("buttona", {
            active: this.showAll,
          })}
          onClick={this.showAllWidgets}
        >
          {_("Widgets-TEST-Mode")}
        </button>
        <button
          className={classNames("buttonb", {
            active: this.lowPerfo,
          })}
          onClick={this.togglePerformanceModeLow}
        >
          {_("Low Performance Mode")}
        </button>
        <button
          className={classNames("buttonc", {
            active: !this.lowPerfo && !this.highPerfo,
          })}
          onClick={this.togglePerformanceModeNormal}
        >
          {_("Normal Performance Mode")}
        </button>
        <button
          className={classNames("buttond", {
            active: this.highPerfo,
          })}
          onClick={this.togglePerformanceModeHigh}
        >
          {_("High Performance Mode")}
        </button>
        <button className="button_reset" onClick={this.changeResetText}>
          {_(this.resetString)}
        </button>
        <button className="button_close" onClick={this.toggleSettings}>
          {_("Close")}
        </button>
      </div>
    );
  }

  private getWidgetSetting(widgetId: string, subSettings: ISubSettings) {
    return (
      <div
        key={widgetId}
        className={classNames("widget", {
          active: this.settings[widgetId].enabled,
        })}
      >
        <label
          className={classNames("main", {
            active: this.settings[widgetId].enabled,
          })}
        >
          <span className="text">{this.settings[widgetId].name()}</span>
          <input
            type="checkbox"
            checked={this.settings[widgetId].enabled}
            data-name={widgetId}
            onChange={this.toggleWidget}
          />
        </label>
        <button
          className="resetWidgetButton"
          data-name={widgetId}
          onClick={this.resetWidget}
        >
          {_("Reset")}
        </button>
        {widgetId === "spotting" &&
          subSettings &&
          Object.keys(subSettings).map((subId) => {
            if (
              subId === "shouldBeep" &&
              this.settings.spotting.enabled &&
              this.settings.spotting.subSettings.shouldBeep.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className={classNames("sub", {
                      active:
                        subSettings[subId].enabled &&
                        this.settings[widgetId].enabled,
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={subSettings[subId].enabled}
                      data-name={widgetId}
                      data-sub-name={subId}
                      onChange={this.toggleSubWidget}
                    />
                    {_(subSettings[subId].text())}
                  </label>
                </div>
              );
            }
            if (
              subId === "beepVolume" &&
              this.settings.spotting.enabled &&
              this.settings.spotting.subSettings.shouldBeep.enabled
            ) {
              return (
                <div key="beepVolume" className="subWidget">
                  <label
                    className="sub"
                    style={{
                      border: "2px solid rgba(90, 90, 90, 0)",
                      color: "white",
                    }}
                  >
                    {`${"VOL: "}`}
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={this.settings.spotting.volume}
                      data-name="spotting"
                      onChange={this.changeBeepVolume}
                    />
                    <div
                      className="barValue"
                      style={{
                        marginLeft:
                          this.settings.spotting.volume === 1 ? "1px" : "5px",
                      }}
                    >
                      {`${Math.round(this.settings.spotting.volume * 100)}%`}
                    </div>
                  </label>
                </div>
              );
            }
            if (
              subId === "beepVolume" &&
              (!this.settings.spotting.enabled ||
                !this.settings.spotting.subSettings.shouldBeep.enabled)
            ) {
              return null;
            }
            return (
              <div key={subId} className="subWidget">
                <label
                  className={classNames("sub", {
                    active:
                      subSettings[subId].enabled &&
                      this.settings[widgetId].enabled,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={subSettings[subId].enabled}
                    data-name={widgetId}
                    data-sub-name={subId}
                    onChange={this.toggleSubWidget}
                  />
                  {_(subSettings[subId].text())}
                </label>
              </div>
            );
          })}

        {/*Slider de ajuste de duração Inputs Graph*/}
        {widgetId === "inputsGraph" && this.settings.inputsGraph.enabled && (
          <div key="graphDuration" className="subWidget">
            <label
              className="sub"
              style={{
                border: "2px solid rgba(90, 90, 90, 0)",
                color: "white",
              }}
            >
              {`Time:`}
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={this.settings.inputsGraph.duration}
                data-name="inputsGraph"
                onChange={this.changeGraphDuration}
              />
              <div
                className="barValue"
                style={{
                  marginLeft:
                    this.settings.inputsGraph.duration === 1 ? "1px" : "5px",
                }}
              >
                {`${this.settings.inputsGraph.duration} s`}
              </div>
            </label>
          </div>
        )}
        {widgetId === "positionBarRelative" &&
          subSettings &&
          Object.keys(subSettings).map((subId) => {
            if (
              subId === "showRanking" &&
              this.settings.positionBarRelative.enabled &&
              this.settings.positionBarRelative.subSettings.showRanking.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className={classNames("sub", {
                      active:
                        subSettings[subId].enabled &&
                        this.settings[widgetId].enabled,
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={subSettings[subId].enabled}
                      data-name={widgetId}
                      data-sub-name={subId}
                      onChange={this.toggleSubWidget}
                    />
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("rankInvert", {
                        active: this.rankInvertRelative,
                      })}
                      onClick={this.toggleRankInvertRelative}
                    >
                      {`${"INVERT"}`}
                    </button>
                  </label>
                </div>
              );
            }
            if (
              subId === "numberDrivers" &&
              !this.settings.positionBarRelative.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className="sub"
                    style={{
                      border: "2px solid rgba(90, 90, 90, 0)",
                      color: "rgba(170, 170, 170, 1",
                    }}
                  >
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("num3", {
                        active: false,
                      })}
                      style={{
                        border: "1px solid rgba(90, 90, 90, 1)",
                        background:
                          this.driverNum === 3
                            ? "rgba(90, 90, 90, 1)"
                            : undefined,
                      }}
                      onClick={this.driverNumTo3}
                    >
                      {`${"3"}`}
                    </button>
                    <button
                      className={classNames("num2", {
                        active: false,
                      })}
                      style={{
                        border: "1px solid rgba(90, 90, 90, 1)",
                        background:
                          this.driverNum === 2
                            ? "rgba(90, 90, 90, 1)"
                            : undefined,
                      }}
                      onClick={this.driverNumTo2}
                    >
                      {`${"2"}`}
                    </button>
                    <button
                      className={classNames("num1", {
                        active: false,
                      })}
                      style={{
                        border: "1px solid rgba(90, 90, 90, 1)",
                        background:
                          this.driverNum === 1
                            ? "rgba(90, 90, 90, 1)"
                            : undefined,
                      }}
                      onClick={this.driverNumTo1}
                    >
                      {`${"1"}`}
                    </button>
                  </label>
                </div>
              );
            }
            if (
              subId === "numberDrivers" &&
              this.settings.positionBarRelative.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className="sub"
                    style={{
                      border: "2px solid rgba(90, 90, 90, 0)",
                      color: "white",
                    }}
                  >
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("num3", {
                        active: this.driverNum === 3,
                      })}
                      onClick={this.driverNumTo3}
                    >
                      {`${"3"}`}
                    </button>
                    <button
                      className={classNames("num2", {
                        active: this.driverNum === 2,
                      })}
                      onClick={this.driverNumTo2}
                    >
                      {`${"2"}`}
                    </button>
                    <button
                      className={classNames("num1", {
                        active: this.driverNum === 1,
                      })}
                      onClick={this.driverNumTo1}
                    >
                      {`${"1"}`}
                    </button>
                  </label>
                </div>
              );
            }
            return (
              <div key={subId} className="subWidget">
                <label
                  className={classNames("sub", {
                    active:
                      subSettings[subId].enabled &&
                      this.settings[widgetId].enabled,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={subSettings[subId].enabled}
                    data-name={widgetId}
                    data-sub-name={subId}
                    onChange={this.toggleSubWidget}
                  />
                  {_(subSettings[subId].text())}
                </label>
              </div>
            );
          })}
        {widgetId === "tvTower" &&
          subSettings &&
          Object.keys(subSettings).map((subId) => {
            if (
              this.settings.tvTower.subSettings.hLogoUrl.enabled &&
              subId === "hLogoUrl"
            ) {
              return (
                <div
                  key={subId}
                  className={classNames("subWidget", {
                    urlInput: true,
                  })}
                >
                  <label className="sub">
                    {_(subSettings[subId].text())}
                    <input
                      type="text"
                      className="urlInput"
                      value={
                        this.hLogoUrl === "" && !this.logoUrlEdit
                          ? `${_("Current Logo:")} ${this.hLogoUrl} - ${_(
                              "Click here to change"
                            )}`
                          : this.logoUrlEdit
                          ? this.hLogoUrl
                          : `${_("Current Logo:")} ${this.hLogoUrl} - ${_(
                              "Click here to change"
                            )}`
                      }
                      onChange={this.changeLogoUrl}
                      onClick={this.emptyUrl}
                    />
                  </label>
                </div>
              );
            }
            if (
              subId === "showRanking" &&
              this.settings.tvTower.enabled &&
              this.settings.tvTower.subSettings.showRanking.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className={classNames("sub", {
                      active:
                        subSettings[subId].enabled &&
                        this.settings[widgetId].enabled,
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={subSettings[subId].enabled}
                      data-name={widgetId}
                      data-sub-name={subId}
                      onChange={this.toggleSubWidget}
                    />
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("rankInvert", {
                        active: this.rankInvert,
                      })}
                      onClick={this.toggleRankInvert}
                    >
                      {`${"INVERT"}`}
                    </button>
                  </label>
                </div>
              );
            }
            if (
              subId === "showPosGainLoss" &&
              this.settings.tvTower.enabled &&
              this.settings.tvTower.subSettings.showPosGainLoss.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className={classNames("sub", {
                      active:
                        subSettings[subId].enabled &&
                        this.settings[widgetId].enabled,
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={subSettings[subId].enabled}
                      data-name={widgetId}
                      data-sub-name={subId}
                      onChange={this.toggleSubWidget}
                    />
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("gainLossPermanentTower", {
                        active: this.gainLossPermanentTower,
                      })}
                      onClick={this.toggleGainLossPermanentTower}
                    >
                      {`${"ALWAYS"}`}
                    </button>
                  </label>
                </div>
              );
            }
            return (
              <div key={subId} className="subWidget">
                <label
                  className={classNames("sub", {
                    active:
                      subSettings[subId].enabled &&
                      this.settings[widgetId].enabled,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={subSettings[subId].enabled}
                    data-name={widgetId}
                    data-sub-name={subId}
                    onChange={this.toggleSubWidget}
                  />
                  {_(subSettings[subId].text())}
                </label>
              </div>
            );
          })}
        {widgetId === "positionBar" &&
          subSettings &&
          Object.keys(subSettings).map((subId) => {
            if (
              subId === "showPosGainLoss" &&
              this.settings.positionBar.enabled &&
              this.settings.positionBar.subSettings.showPosGainLoss.enabled
            ) {
              return (
                <div key={subId} className="subWidget">
                  <label
                    className={classNames("sub", {
                      active:
                        subSettings[subId].enabled &&
                        this.settings[widgetId].enabled,
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={subSettings[subId].enabled}
                      data-name={widgetId}
                      data-sub-name={subId}
                      onChange={this.toggleSubWidget}
                    />
                    {_(subSettings[subId].text())}
                    <button
                      className={classNames("gainLossPermanentBar", {
                        active: this.gainLossPermanentBar,
                      })}
                      onClick={this.toggleGainLossPermanentBar}
                    >
                      {`${"ALWAYS"}`}
                    </button>
                  </label>
                </div>
              );
            }
            return (
              <div key={subId} className="subWidget">
                <label
                  className={classNames("sub", {
                    active:
                      subSettings[subId].enabled &&
                      this.settings[widgetId].enabled,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={subSettings[subId].enabled}
                    data-name={widgetId}
                    data-sub-name={subId}
                    onChange={this.toggleSubWidget}
                  />
                  {_(subSettings[subId].text())}
                </label>
              </div>
            );
          })}
        {widgetId !== "positionBar" &&
          widgetId !== "positionBarRelative" &&
          widgetId !== "tvTower" &&
          widgetId !== "manualStart" &&
          widgetId !== "spotting" &&
          subSettings &&
          Object.keys(subSettings).map((subId) => {
            return (
              <div key={subId} className="subWidget">
                <label
                  className={classNames("sub", {
                    active:
                      subSettings[subId].enabled &&
                      this.settings[widgetId].enabled,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={subSettings[subId].enabled}
                    data-name={widgetId}
                    data-sub-name={subId}
                    onChange={this.toggleSubWidget}
                  />
                  {_(subSettings[subId].text())}
                </label>
              </div>
            );
          })}
      </div>
    );
  }
}
