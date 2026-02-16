declare global {
  interface Window {
    version?: string;
  }
}
import { LapEvents } from "../../lib/LapEvents";
import { PitEvents } from "../../lib/PitEvents";
import { FlagEvents } from "../../lib/FlagEvents";
import { FuelEvents } from "../../lib/FuelEvents";
import { FuelStrategy } from "../../lib/FuelStrategy";
import { EnergyEvents } from "../../lib/EnergyEvents";
import { EnergyStrategy } from "../../lib/EnergyStrategy";
import {
  classNames,
  ePlayerDriverDataIndex,
  ePlayerIsFocus,
  getSlotIds,
  prettyDebugInfo,
  currentFocusIsInput,
  getJason,
  rankData,
  showDebugMessage,
  showDebugMessageSmall,
  INVALID,
} from "../../lib/utils";
import { merge } from "lodash-es";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import _, {
  dynamicTranslate as __,
  setLocale,
  Locales,
} from "./../../translate";
import Aids from "../aids/aids";
import Clock from "../clock/clock";
import CornerNames from "../cornerNames/cornerNames";
import CrewChief from "../crewChief/crewChief";
import Damage from "../damage/damage";
import Flags from "../flags/flags";
import Fuel from "../fuel/fuel";
import FuelDetail from "../fuelDetail/fuelDetail";
import Gforce from "../gforce/gforce";
import Graphs from "../graphs/graphs";
import Info from "../info/info";
import Inputs from "../inputs/inputs";
import InputsGraph from "../inputsGraph/inputsGraph";
import IShared, {
  EControl,
  ESession,
} from "./../../types/r3eTypes";
import Motec from "../motec/motec";
import OvertakingAids from "../overtakingAids/overtakingAids";
import PitLimiter from "../pitLimiter/pitLimiter";
import Pitstop from "../pitstop/pitstop";
import PositionBar from "../positionBar/positionBar";
import SessionInfo from "../sessionInfo/sessionInfo";
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
export interface IWidgetSetting {
  id: string;
  enabled: boolean;
  volume: number;
  duration: number;
  resetIt: boolean;
  zoom: number;
  position: { x: number; y: number };
  layout?: {
    [key: string]: {
      x: number;
      y: number;
    };
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
let speedInKPH = false;
let tempInCelsius = false;
let pressureInPSI = false;
let eDriverNum = 3;
let eGainLossPermanentTower = false;
let eGainLossPermanentBar = false;
let eRankInvert = false;
let eRankInvertRelative = false;
let eLogoUrl = "./../../img/logo.png";
let eResetId = "";
let eIsLeaderboard = false;
let eIsHillClimb = false;
let eIsDynamicBbias = false;
let isMenu = false;
let hudApp: App;
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
  speedInKPH,
  pressureInPSI,
  tempInCelsius,
  eDriverNum,
  eGainLossPermanentTower,
  eGainLossPermanentBar,
  eRankInvert,
  eRankInvertRelative,
  eLogoUrl,
  eIsIngameBrowser,
  eIsLeaderboard,
  eIsHillClimb,
  eIsDynamicBbias,
  hudApp,
};
// Hud Version
const currentVersion = 1.03;

@observer
export default class App extends React.Component<IProps> {
  appRef = React.createRef<HTMLDivElement>();

  @observable accessor playerDriverDataIndex = -1;
  @observable accessor playerIsFocus = false;
  @observable accessor storedVersion = -1;
  @observable accessor changeLogRead = true;
  @observable accessor changeLogToggled = false;
  @observable accessor trackingString = "";
  @observable accessor tempTrackingString = "";
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
  @observable accessor tempInCelsius =
  localStorage.tempInCelsius !== undefined
    ? localStorage.tempInCelsius === "1"
    : true;
  @observable accessor speedInKPH =
    localStorage.speedInKPH !== undefined
      ? localStorage.speedInKPH === "1"
      : true;
  @observable accessor pressureInPSI =
    localStorage.pressureInPSI !== undefined
      ? localStorage.pressureInPSI === "1"
      : false;
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
        }
			},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    sessionInfo: {
      id: "sessionInfo",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Session Info"),
      subSettings: {
        showBackground: {
					text: __('Dark Background'),
					enabled: false
				},
        lapTime: {
					text: __('Show Lap-Time'),
					enabled: true
				},
        showLastLap: {
          text: __("Show Last-Lap"),
          enabled: true,
        },
        showBestLap: {
          text: __("Show Best-Lap"),
          enabled: true,
        },
        sessionLapsRemain: {
          text: __("Show Estimated Laps left"),
          enabled: true,
        },
        sessionLaps: {
          text: __("Show Completed Laps"),
          enabled: true,
        },
        sessionLapsTotal: {
          text: __("Show Estimated Laps"),
          enabled: true,
        },
				currentPosition: {
					text: __('Show Current Position'),
					enabled: true
				},
        showSOF: {
          text: __("Show Strength of Field"),
          enabled: true,
        },  
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },          
        showCuts: {
          text: __("Show Track Limits Counter"),
          enabled: false,
        },
				sessionTime: {
					text: __("Show Session-Time"),
					enabled: true,
				}
			},
      position: {
        x: 0,
        y: 70,
      },
      layout: {
        right: {
          x: -1920,
          y: 0,
        }
      }
    },
    positionBarRelative: {
			id: "positionBarRelative",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
				x: 330,
				y: 770,
			}
		},
    tvTower: {
      id: "tvTower",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.9,
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
          enabled: false,
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
        x: 90,
        y: 120,
      },
    },
    progress: {
      id: "progress",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
        x: 0,
        y: -200,
      },
    },
    tires: {
      id: "tires",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
      zoom: 1,
      name: __("Fuel & Lap Details"),
      subSettings: {
        showStoredInfo: {
          text: __("Show Lap Details"),
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
        x: 170,
        y: 950,
      },
    },
    inputsGraph: {
      id: "inputsGraph",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 6,
      zoom: 1,
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
        x: 750,
        y: 960,
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
        x: 820,
        y: 570,
      },
    },
    cornerNames: {
      id: "cornerNames",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.53,
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
        x: 10,
        y: 870,
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
        x: 1410,
        y: 680,
      },
    },
    aids: {
      id: "aids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Car assists"),
      subSettings: {
        verticalLayout: {
          text: __("Vertical Layout"),
          enabled: true,
        },
      },
      position: {
        x: 1050,
        y: 830,
      },
    },
    motec: {
      id: "motec",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
      name: __("Motec"),
      subSettings: {
        plBBlink: {
          text: __("PitLimiter Blink"),
          enabled: true,
        },
      },
      position: {
        x: 1110,
        y: 890,
      },
    },
    inputs: {
      id: "inputs",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
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
        x: 1110,
        y: 1000,
      },
    },
    overtakingAids: {
      id: "overtakingAids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Electronics"),
      subSettings: {},
      position: {
        x: 1110,
        y: 810,
      },
    },
    fuel: {
      id: "fuel",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
      name: __("Consumption"),
      subSettings: {},
      position: {
        x: 1340,
        y: 860,
      },
    },
    gforce: {
      id: "gforce",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("G-Force"),
      subSettings: {},
      position: {
        x: 540,
        y: 630,
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
        x: 700,
        y: 220,
      },
    },
    info: {
      id: "info",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3,
      name: __("Race info"),
      subSettings: {},
      position: {
        x: 40,
        y: 420,
      },
    },
    pitLimiter: {
      id: "pitLimiter",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.4,
      name: __("Pit limiter"),
      subSettings: {},
      position: {
        x: 820,
        y: 280,
      },
    },
    damage: {
      id: "damage",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Damage"),
      subSettings: {},
      position: {
        x: 1340,
        y: 950,
      },
    },
    flags: {
      id: "flags",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3,
      name: __("Flags"),
      subSettings: {},
      position: {
        x: 1230,
        y: 150,
      },
    },
    crewChief: {
      id: "crewChief",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Crew Chief"),
      subSettings: {},
      position: {
        x: 1430,
        y: 150,
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
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Clock"),
      subSettings: {},
      position: {
        x: 1340,
        y: 810,
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
        }
			},
      position: {
        x: INVALID,
        y: INVALID,
      },
    },
    sessionInfo: {
      id: "sessionInfo",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Session Info"),
      subSettings: {
        showBackground: {
					text: __('Dark Background'),
					enabled: false
				},
        lapTime: {
					text: __('Show Lap-Time'),
					enabled: true
				},
        showLastLap: {
          text: __("Show Last-Lap"),
          enabled: true,
        },
        showBestLap: {
          text: __("Show Best-Lap"),
          enabled: true,
        },
        sessionLapsRemain: {
          text: __("Show Estimated Laps left"),
          enabled: true,
        },
        sessionLaps: {
          text: __("Show Completed Laps"),
          enabled: true,
        },    
        sessionLapsTotal: {
          text: __("Show Estimated Laps"),
          enabled: true,
        },    
				currentPosition: {
					text: __('Show Current Position'),
					enabled: true
				},
        showSOF: {
          text: __("Show Strength of Field"),
          enabled: true,
        },  
        showIncidentPoints: {
          text: __("Show Incident Points"),
          enabled: true,
        },          
        showCuts: {
          text: __("Show Track Limits Counter"),
          enabled: false,
        },
				sessionTime: {
					text: __("Show Session-Time"),
					enabled: true,
				}
			},
      position: {
        x: 0,
        y: 70,
      },
      layout: {
        right: {
          x: -1920,
          y: 0,
        }
      }
    },
    positionBarRelative: {
			id: "positionBarRelative",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
				x: 330,
				y: 770,
			}
		},
    tvTower: {
      id: "tvTower",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.9,
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
        x: 90,
        y: 120,
      },
    },
    progress: {
      id: "progress",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
        x: 0,
        y: -200,
      },
    },
    tires: {
      id: "tires",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
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
      zoom: 1,
      name: __("Fuel & Lap Details"),
      subSettings: {
        showStoredInfo: {
          text: __("Show Lap Details"),
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
        x: 170,
        y: 950,
      },
    },
    inputsGraph: {
      id: "inputsGraph",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 6,
      zoom: 1,
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
        x: 750,
        y: 960,
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
        x: 820,
        y: 570,
      },
    },
    cornerNames: {
      id: "cornerNames",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 0.53,
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
        x: 10,
        y: 870,
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
        x: 1410,
        y: 680,
      },
    },
    aids: {
      id: "aids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Car assists"),
      subSettings: {
        verticalLayout: {
          text: __("Vertical Layout"),
          enabled: true,
        },
      },
      position: {
        x: 1050,
        y: 830,
      },
    },
    motec: {
      id: "motec",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
      name: __("Motec"),
      subSettings: {
        plBBlink: {
          text: __("PitLimiter Blink"),
          enabled: true,
        },
      },
      position: {
        x: 1110,
        y: 890,
      },
    },
    inputs: {
      id: "inputs",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
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
        x: 1110,
        y: 1000,
      },
    },
    overtakingAids: {
      id: "overtakingAids",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Electronics"),
      subSettings: {},
      position: {
        x: 1110,
        y: 810,
      },
    },
    fuel: {
      id: "fuel",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.0,
      name: __("Consumption"),
      subSettings: {},
      position: {
        x: 1340,
        y: 860,
      },
    },
    gforce: {
      id: "gforce",
      enabled: false,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("G-Force"),
      subSettings: {},
      position: {
        x: 540,
        y: 630,
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
        x: 700,
        y: 220,
      },
    },
    info: {
      id: "info",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3,
      name: __("Race info"),
      subSettings: {},
      position: {
        x: 40,
        y: 420,
      },
    },
    pitLimiter: {
      id: "pitLimiter",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.4,
      name: __("Pit limiter"),
      subSettings: {},
      position: {
        x: 820,
        y: 280,
      },
    },
    damage: {
      id: "damage",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Damage"),
      subSettings: {},
      position: {
        x: 1340,
        y: 950,
      },
    },
    flags: {
      id: "flags",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1.3,
      name: __("Flags"),
      subSettings: {},
      position: {
        x: 1230,
        y: 150,
      },
    },
    crewChief: {
      id: "crewChief",
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Crew Chief"),
      subSettings: {},
      position: {
        x: 1430,
        y: 150,
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
      enabled: true,
      resetIt: false,
      volume: 0,
      duration: 0,
      zoom: 1,
      name: __("Clock"),
      subSettings: {},
      position: {
        x: 1340,
        y: 810,
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
  @observable accessor tempLowPerfo = false;
  @observable accessor tempHighPerfo = false;
  @observable accessor tempSavePerfo: boolean[] = [];
  @observable accessor debugData: IShared | null = null;
  @observable accessor resetString = _("Reset Settings");
  @observable accessor forceCheck = false;
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
  @observable accessor singleplayerRace = false;
  @observable accessor tractionControlPercentUndefined = true;

  updateFunction: Function | null = null;

  constructor(props: IProps) {
    super(props);

    // If version isn't defined we aren't in game
    if (!window.version) {
      (document.body.parentNode as any)!.classList.add("debug");
    }

    this.handleResize();
    this.recoverSettings();
    hudApp = this;

    setLocale(this.language as Locales);
    lowPerformanceMode = this.lowPerfo;
    highPerformanceMode = this.highPerfo;
    showAllMode = this.showAll;
    hideWidgets = this.hide || this.tempHide;
    blockFuelCalc = this.elBlocko;
    speedInKPH = this.speedInKPH;
    pressureInPSI = this.pressureInPSI;
    tempInCelsius = this.tempInCelsius;
    eDriverNum = this.driverNum;
    eGainLossPermanentTower = this.gainLossPermanentTower;
    eGainLossPermanentBar = this.gainLossPermanentBar;
    eRankInvert = this.rankInvert;
    eRankInvertRelative = this.rankInvertRelative;
    eLogoUrl = this.hLogoUrl;

    window.onerror = () => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };
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
    if (!event.clipboardData) return;
    const clipText = event.clipboardData.getData("Text");
    if (!clipText.includes("positionBar")) return;
    try {
      let savedSettings: any = JSON.parse(clipText);
      Object.keys(savedSettings).forEach((widgetKey) => {
        // Se o widget não existe mais, ignora
        if (!this.settings[widgetKey]) return;
        const currentWidget = this.settings[widgetKey];
        const pastedWidget = savedSettings[widgetKey];
        // Sanitiza subSettings
        if (pastedWidget.subSettings) {
          Object.keys(pastedWidget.subSettings).forEach((subKey) => {
            if (!currentWidget.subSettings[subKey]) {
              delete pastedWidget.subSettings[subKey];
            }
          });
        }
      });
      // Merge seguro
      this.settings = merge(this.settings, savedSettings);
      showDebugMessage(
        _("Received Layout-Settings: Saved to Layout") +
          ` ${this.currentLayout}`,
        5000
      );
      setTimeout(this.timerSaveSettings, 3000);
    } catch (err) {
      showDebugMessage(
        _("Received Layout-Settings: [ERROR] Invalid JSON"),
        5000
      );
    }
  };
  
  @action
  private updatePerformance = () => {
    this.gameInReplay = r3e.data.GameInReplay > 0;
    this.gameInMenus  = r3e.data.GameInMenus > 0;
    const gamePaused  = r3e.data.GamePaused > 0;

    if (this.gameInMenus || gamePaused) {
      return;
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
    this.playerDriverDataIndex = ePlayerDriverDataIndex;
    this.playerIsFocus = ePlayerIsFocus;
    this.sessionType = r3e.data.SessionType;
    LapEvents.update(r3e.data.DriverData); // SHARED LAP EVENTS FOR ALL WIDGETS
    PitEvents.update(r3e.data.DriverData); // PIT EVENTS FOR ALL WIDGETS
    FlagEvents.update(r3e.data.DriverData); // FLAG EVENTS FOR ALL WIDGETS
    FuelEvents.update(); // FUEL EVENTS FOR ALL WIDGETS
    EnergyEvents.update(); // ENERGY STRATEGY FOR ALL WIDGETS
    FuelStrategy.update(); // FUEL STRATEGY FOR ALL WIDGETS
    EnergyStrategy.update(); // ENERGY STRATEGY FOR ALL WIDGETS
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
      if (defaultSettings.layout) {
        setting.layout = JSON.parse(
          JSON.stringify(defaultSettings.layout)
        );
      }
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
        this.forceCheck = true;
      }
    }

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
      eIsDynamicBbias =
        r3e.data.VehicleInfo.ClassId === 13129 ||
        r3e.data.VehicleInfo.ClassId === 10050;
      eIsHillClimb =
        r3e.data.LayoutId === 1682 ||
        r3e.data.LayoutId === 1709 ||
        r3e.data.LayoutId === 2181 ||
        r3e.data.LayoutId === 2214 ||
        r3e.data.LayoutId === 9321 ||
        r3e.data.LayoutId === 9360 ||
        r3e.data.LayoutId === 11859 ||
        r3e.data.LayoutId === 11861;

      // this.runBooboo();
    }
  };  
  
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
      this.toggleLockHud();
    }
    if (!e.shiftKey) {
      this.shiftModifier = false;
    }
  };

  @action
  private parseRankingData = () => {
    // console.log('TRYING TO FETCH RANKING DATA');
    if (rankData.length <= 0 && !showAllMode) {
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
  public getPositionRelative = (x: number, y: number) => {
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
    const layoutKey =
      this.currentLayout === 1
        ? "appSettings"
        : this.currentLayout === 2
        ? "appSettings2"
        : "appSettings3";

    const logoKey =
      this.currentLayout === 1
        ? "currentLogo"
        : this.currentLayout === 2
        ? "currentLogo2"
        : "currentLogo3";

    const raw = localStorage[layoutKey];

    if (!raw) {
      this.resetSettings();
      this.restoreLogo(logoKey);
      return;
    }

    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      this.resetSettings();
      this.restoreLogo(logoKey);
      return;
    }

    if (typeof parsed !== "object" || parsed === null) {
      this.resetSettings();
      this.restoreLogo(logoKey);
      return;
    }

    // Filtragem resiliente
    const safeSettings: any = {};

    Object.keys(parsed).forEach((widgetKey) => {
      if (!this.settings[widgetKey]) return;

      const savedWidget = parsed[widgetKey];
      const defaultWidget = this.settings[widgetKey];

      if (
        !savedWidget ||
        typeof savedWidget !== "object" ||
        !savedWidget.subSettings
      ) {
        return;
      }

      const safeSubSettings: any = {};

      Object.keys(savedWidget.subSettings).forEach((subKey) => {
        if (!defaultWidget.subSettings[subKey]) return;

        safeSubSettings[subKey] = savedWidget.subSettings[subKey];
      });

      safeSettings[widgetKey] = {
        ...savedWidget,
        subSettings: safeSubSettings,
      };
    });

    // Merge final (defaults + safe recovered)
    this.settings = merge(this.settings, safeSettings);

    this.restoreLogo(logoKey);
  };

  private restoreLogo(key: string) {
    this.hLogoUrl = localStorage[key]
      ? localStorage[key]
      : "./../../img/logo.png";

    eLogoUrl = this.hLogoUrl;
  }

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

  // -> these 2 functions are used for drag the right block on sessionInfo
  @action
  public setInternalEditing(state: boolean) {
    if (this.lockHud) return;
    this.showEditGrid = state;
    if (!state) {
      this.saveSettings();
    }
  }

  public applySnap(value: number): number {
    return this.snapOn ? value - (value % 10) : value;
  }
  // -> end

  @action
  private onMouseMove = (e: MouseEvent) => {
    if (this.lockHud) {
      return;
    }
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
  private altTemp = () => {    
    this.tempInCelsius = !this.tempInCelsius;
    localStorage.tempInCelsius = this.tempInCelsius ? "1" : "0";
    tempInCelsius = this.tempInCelsius;
    this.saveSettings();
  };

  @action
  private altSpeed = () => {    
    this.speedInKPH = !this.speedInKPH;
    localStorage.speedInKPH = this.speedInKPH ? "1" : "0";
    speedInKPH= this.speedInKPH;
    this.saveSettings();
  };

  @action
  private altPressure = () => {    
    this.pressureInPSI = !this.pressureInPSI;
    localStorage.pressureInPSI = this.pressureInPSI ? "1" : "0";
    pressureInPSI= this.pressureInPSI;
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
      if (defaultSettings.layout) {
        setting.layout = JSON.parse(
          JSON.stringify(defaultSettings.layout)
        );
      }
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
      r3e.data && !this.gameInMenus &&
      (this.sessionType === ESession.Race || r3e.data.DriverData.length > 0);
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
    
    /*
    // Renders the Hud, no matter what
    const allowRender = r3e.data !== undefined;
    if (!allowRender) {
      setTimeout(() => {
        this.forceUpdate();
      }, 500);
      return null;
    }
    */

    // SPLASH-SCREEN
    if (!this.changeLogRead) {
      return (
        <div
          className="viewport"
          style={{ zoom: this.appZoom }}
        >
          <div className="welcome">

            {/* HEADER */}
            <div className="welcomeHeader">
              <img
                className="welcomeLogo"
                src={require("./../../img/sealhud_logo.png")}
              />
              <div className="welcomeTitles">
                <div className="welcomeVersion">Version {currentVersion}</div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="welcomeContent">

              {/* LEFT */}
              <div className="welcomeLeft">
                <div className="welcomeSectionTitle">
                  Support & Community
                </div>

                <div className="forumBlock">
                  <div className="forumText">
                    For issues, feedback and updates<br />
                    visit the SealHUD forum thread:
                  </div>
                  <img
                    className="forumQR"
                    src={require("./../../img/qr_forum.png")}
                  />
                </div>

                <div className="donationBlock">
                  <div className="donationTitle">Donations</div>
                  <img
                    className="donationIcon"
                    src={require("./../../img/donate.png")}
                  />
                  <img
                    className="donationQR"
                    src={require("./../../img/qr.png")}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="welcomeRight">
                <div className="changeLogTitle">
                  WELCOME TO SEALHUD
                </div>

                <div className="theLog">
                  {this.getChangelog()}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="welcomeClose"
              onClick={this.toggleChangeLog}
            >
              {_("PRESS CLUTCH / BRAKE / THROTTLE OR CLICK TO CONTINUE")}
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
        {this.settings.sessionInfo.enabled && (
          <SessionInfo
            settings={this.settings.sessionInfo}
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel}
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
        {this.settings.info.enabled && (
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

  // Novo SETTINGS
  private getAppSettings() {
    return (
      <div className="settingsRoot">
        {this.renderLeftPanel()}
        {this.renderRightPanel()}
      </div>
    );
  }

  private renderRightPanel() {
    return (
      <div className="settingsRight">
        {Object.keys(this.settings).map((widgetId) => {
          const subSettings = this.settings[widgetId].subSettings;

          if (widgetId !== "manualStart") {
            return this.getWidgetSetting(widgetId, subSettings);
          }

          return null;
        })}
      </div>
    );
  }

  private renderLeftPanel() {
    return (
      <div className="settingsLeft">
        {this.renderHeader()}
        {this.renderLogo()}
        {this.renderChangelogButton()}
        {this.renderLanguageOptions()}
        {this.renderPerformanceOptions()}
        {this.renderGlobalOptions()}
        {this.renderFooterButtons()}
      </div>
    );
  }

  private renderHeader() {
    return (
      <div className="settingsHeader">
        <div className="versionText">
          {_("Current version:")} {currentVersion}
        </div>

        <div
          className="performanceText"
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
          }}
        >
          {_("Updates/sec:")}{" "}
          {this.lowPerfo || this.tempLowPerfo
            ? this.performance > 11
              ? 30
              : this.performance
            : this.tempHighPerfo || this.highPerfo
            ? this.performance > 33
              ? 90
              : this.performance
            : this.performance > 16
            ? 60
            : this.performance}
        </div>
      </div>
    );
  }

  private renderLogo() {
    return (
      <div className="settingsLogo">
        <img
          src={require("./../../img/sealhud_logo.png")}
          alt="SealHUD"
        />
      </div>
    );
  }

  private renderMainButton(
    label: string,
    onClick: () => void,
    active: boolean = false
  ) {
    return (
      <button
        className={classNames("mainButton", { active })}
        onClick={onClick}
      >
        {_(label)}
      </button>
    );
  }

  private renderChangelogButton() {
    return this.renderMainButton(
      "Changelog / Help",
      this.toggleChangeLog
    );
  }

  private renderLanguageOptions() {
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
      <div className="optionGroup">
        <div className="optionLabel">{_("LANGUAGE")}</div>
        <div className="optionBody">
          {Object.keys(languageLookup).map((langKey) => (
            <button
              key={langKey}
              className={classNames("optionButton", {
                active: langKey === this.language,
              })}
              onClick={() => this.setLocale(langKey as Locales)}
            >
              {languageLookup[langKey]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  private renderPerformanceOptions() {
    return (
      <div className="optionGroup">
        <div className="optionLabel">{_("PERFORMANCE")}</div>
        <div className="optionBody">
          <button
            className={classNames("optionButton", { active: this.lowPerfo })}
            onClick={this.togglePerformanceModeLow}
          >
            {_("Low Performance Mode")}
          </button>

          <button
            className={classNames("optionButton", {
              active: !this.lowPerfo && !this.highPerfo,
            })}
            onClick={this.togglePerformanceModeNormal}
          >
            {_("Normal Performance Mode")}
          </button>

          <button
            className={classNames("optionButton", { active: this.highPerfo })}
            onClick={this.togglePerformanceModeHigh}
          >
            {_("High Performance Mode")}
          </button>
        </div>
      </div>
    );
  }

  private renderGlobalOptions() {
    return (
      <div className="optionGroup">
        <div className="optionLabel">{_("GLOBAL OPTIONS")}</div>

        <div className="optionBody rows">
          {/* Speed */}
          <div className="optionRow">
            <span>{_("Speed:")}</span>
            <button
              className={classNames("smallOption", {active: this.speedInKPH,})} onClick={this.altSpeed}>
              km/h
            </button>
            <button
              className={classNames("smallOption", {active: !this.speedInKPH,})} onClick={this.altSpeed}>
              mph
            </button>
          </div>

          {/* Temperature */}
          <div className="optionRow">
            <span>{_("Temperature:")}</span>
            <button
              className={classNames("smallOption", {active: this.tempInCelsius,})} onClick={this.altTemp}>
              ºC
            </button>
            <button
              className={classNames("smallOption", {active: !this.tempInCelsius,})} onClick={this.altTemp}>
              ºF
            </button>
          </div>

          {/* Pressure */}
          <div className="optionRow">
            <span>{_("Pressure:")}</span>
            <button
              className={classNames("smallOption", {active: !this.pressureInPSI,})} onClick={this.altPressure}>
              kPa
            </button>
            <button
              className={classNames("smallOption", {active: this.pressureInPSI,})} onClick={this.altPressure}>
              PSI
            </button>
          </div>

          {/* Grid Snap */}
          <div className="optionRow">
            <span>{_("Snap To Grid:")}</span>
            <button
              className={classNames("smallOption", {active: this.snapOn,})} onClick={this.toggleSnap}>
              ON
            </button>
            <button
              className={classNames("smallOption", {active: !this.snapOn,})} onClick={this.toggleSnap}>
              OFF
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderFooterButtons() {
    return (
      <div className="settingsFooter">
        {this.renderMainButton(
          "Widgets-TEST-Mode",
          this.showAllWidgets,
          this.showAll
        )}

        {this.renderMainButton(
          this.resetString,
          this.changeResetText
        )}

        {this.renderMainButton(
          "Close",
          this.toggleSettings
        )}
      </div>
    );
  }

  // Novo getWidgetSettings
  private renderGenericSubSettings(
    widgetId: string,
    subSettings: ISubSettings
  ) {
    return Object.keys(subSettings).map((subId) => (
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
    ));
  }

  private renderSpottingSettings(subSettings: ISubSettings) {
    return Object.keys(subSettings).map((subId) => {
      // Checkbox: shouldBeep
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
                  this.settings.spotting.enabled,
              })}
            >
              <input
                type="checkbox"
                checked={subSettings[subId].enabled}
                data-name="spotting"
                data-sub-name={subId}
                onChange={this.toggleSubWidget}
              />
              {_(subSettings[subId].text())}
            </label>
          </div>
        );
      }
      // Slider: beepVolume
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
              {`VOL: `}
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
      // beepVolume invisível quando desativado
      if (subId === "beepVolume") {
        return null;
      }
      // fallback genérico (caso apareça algo novo)
      return (
        <div key={subId} className="subWidget">
          <label
            className={classNames("sub", {
              active:
                subSettings[subId].enabled &&
                this.settings.spotting.enabled,
            })}
          >
            <input
              type="checkbox"
              checked={subSettings[subId].enabled}
              data-name="spotting"
              data-sub-name={subId}
              onChange={this.toggleSubWidget}
            />
            {_(subSettings[subId].text())}
          </label>
        </div>
      );
    });
  }

  private renderInputsGraphSettings() {
    return (
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
    );
  }

  private renderPositionBarRelativeSettings(subSettings: ISubSettings) {
    return Object.keys(subSettings).map((subId) => {
      // showRanking + INVERT
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
                  this.settings.positionBarRelative.enabled,
              })}
            >
              <input
                type="checkbox"
                checked={subSettings[subId].enabled}
                data-name="positionBarRelative"
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
                {`INVERT`}
              </button>
            </label>
          </div>
        );
      }
      // numberDrivers quando widget DESATIVADO (cinza)
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
                color: "rgba(170, 170, 170, 1)",
              }}
            >
              {_(subSettings[subId].text())}

              <button
                className="num3"
                style={{
                  border: "1px solid rgba(90, 90, 90, 1)",
                  background:
                    this.driverNum === 3
                      ? "rgba(90, 90, 90, 1)"
                      : undefined,
                }}
                onClick={this.driverNumTo3}
              >
                3
              </button>

              <button
                className="num2"
                style={{
                  border: "1px solid rgba(90, 90, 90, 1)",
                  background:
                    this.driverNum === 2
                      ? "rgba(90, 90, 90, 1)"
                      : undefined,
                }}
                onClick={this.driverNumTo2}
              >
                2
              </button>

              <button
                className="num1"
                style={{
                  border: "1px solid rgba(90, 90, 90, 1)",
                  background:
                    this.driverNum === 1
                      ? "rgba(90, 90, 90, 1)"
                      : undefined,
                }}
                onClick={this.driverNumTo1}
              >
                1
              </button>
            </label>
          </div>
        );
      }
      // numberDrivers quando widget ATIVO
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
                3
              </button>

              <button
                className={classNames("num2", {
                  active: this.driverNum === 2,
                })}
                onClick={this.driverNumTo2}
              >
                2
              </button>

              <button
                className={classNames("num1", {
                  active: this.driverNum === 1,
                })}
                onClick={this.driverNumTo1}
              >
                1
              </button>
            </label>
          </div>
        );
      }
      // fallback (checkbox simples)
      return (
        <div key={subId} className="subWidget">
          <label
            className={classNames("sub", {
              active:
                subSettings[subId].enabled &&
                this.settings.positionBarRelative.enabled,
            })}
          >
            <input
              type="checkbox"
              checked={subSettings[subId].enabled}
              data-name="positionBarRelative"
              data-sub-name={subId}
              onChange={this.toggleSubWidget}
            />
            {_(subSettings[subId].text())}
          </label>
        </div>
      );
    });
  }

  private renderTvTowerSettings(subSettings: ISubSettings) {
    return Object.keys(subSettings).map((subId) => {
      // URL input (Logo)
      if (
        subId === "hLogoUrl" &&
        this.settings.tvTower.subSettings.hLogoUrl.enabled
      ) {
        return (
          <div key={subId} className="subWidget urlInput">
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
      // showRanking + INVERT
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
                  this.settings.tvTower.enabled,
              })}
            >
              <input
                type="checkbox"
                checked={subSettings[subId].enabled}
                data-name="tvTower"
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
                INVERT
              </button>
            </label>
          </div>
        );
      }
      // showPosGainLoss + ALWAYS
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
                  this.settings.tvTower.enabled,
              })}
            >
              <input
                type="checkbox"
                checked={subSettings[subId].enabled}
                data-name="tvTower"
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
                ALWAYS
              </button>
            </label>
          </div>
        );
      }
      // fallback genérico
      return (
        <div key={subId} className="subWidget">
          <label
            className={classNames("sub", {
              active:
                subSettings[subId].enabled &&
                this.settings.tvTower.enabled,
            })}
          >
            <input
              type="checkbox"
              checked={subSettings[subId].enabled}
              data-name="tvTower"
              data-sub-name={subId}
              onChange={this.toggleSubWidget}
            />
            {_(subSettings[subId].text())}
          </label>
        </div>
      );
    });
  }

  private renderPositionBarSettings(subSettings: ISubSettings) {
    return Object.keys(subSettings).map((subId) => {
      // showPosGainLoss + ALWAYS
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
                  this.settings.positionBar.enabled,
              })}
            >
              <input
                type="checkbox"
                checked={subSettings[subId].enabled}
                data-name="positionBar"
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
                ALWAYS
              </button>
            </label>
          </div>
        );
      }
      // fallback genérico
      return (
        <div key={subId} className="subWidget">
          <label
            className={classNames("sub", {
              active:
                subSettings[subId].enabled &&
                this.settings.positionBar.enabled,
            })}
          >
            <input
              type="checkbox"
              checked={subSettings[subId].enabled}
              data-name="positionBar"
              data-sub-name={subId}
              onChange={this.toggleSubWidget}
            />
            {_(subSettings[subId].text())}
          </label>
        </div>
      );
    });
  }
   
  private getWidgetSetting(widgetId: string, subSettings: ISubSettings) {
  const enabled = this.settings[widgetId].enabled;

  return (
    <div
      className={classNames("widget", { active: enabled })}
    >
      {/* HEADER */}
      <div className="widgetHeader">
        <label className="widgetLabel">
          <input
            type="checkbox"
            checked={enabled}
            data-name={widgetId}
            onChange={this.toggleWidget}
          />
          <span className="widgetTitle">
            {this.settings[widgetId].name()}
          </span>
        </label>

        <button
          className="resetWidgetButton"
          data-name={widgetId}
          onClick={this.resetWidget}
        >
          {_("Reset")}
        </button>
      </div>

      <div className="widgetDivider" />

      {/* BODY */}
      <div className="widgetBody">
        {widgetId === "spotting" && subSettings && this.renderSpottingSettings(subSettings)}
        {widgetId === "inputsGraph" && enabled && this.renderInputsGraphSettings()}
        {widgetId === "positionBarRelative" && subSettings && this.renderPositionBarRelativeSettings(subSettings)}
        {widgetId === "tvTower" && subSettings && this.renderTvTowerSettings(subSettings)}
        {widgetId === "positionBar" && subSettings && this.renderPositionBarSettings(subSettings)}
        {widgetId !== "positionBar" &&
          widgetId !== "positionBarRelative" &&
          widgetId !== "tvTower" &&
          widgetId !== "manualStart" &&
          widgetId !== "spotting" &&
          subSettings &&
          this.renderGenericSubSettings(widgetId, subSettings)}
      </div>
    </div>
  );
}


private getChangelog() {
  return (
  <div className="">
    <span style={{fontSize: "27px",}}>
      {`${"VERSION "}`+currentVersion}
    </span>
{`
FEBRUARY 17, 2026


PLEASE READ:
-------------------------
After the SealHUD 1.0 update, some widgets became too large, too small or are not showing up. 
To fix this, use the button 'RESET SETTINGS' (settings menu) and all widgets will be repositioned correctly.


WHAT'S NEW:
-------------------------
WIDGETS:
- All widgets: Background colors have been slightly darkened for better visibility in VR.
- Position Bar: This widget has been split into two separate widgets: POSITION BAR and SESSION INFO.
- Session Info: The widget now includes two information blocks (left and right), which can be moved and positioned freely.
- Session Info: Added an option to display a dark background to improve text contrast.
- Session Info: Added an option to enable/disable the Track Limits Counter.
- MoTeC: The RPM bar has been moved to the top of the widget.
- Damage: The widget is now displayed even when the damage option is set to DISABLED for the session.

TRANSLATIONS:
- French: "Throttle" has been changed to "accélérateur" (thanks to Mat Blanchard).


Thanks for using SealHUD. Thanks for driving RaceRoom.
Drive safe.
Diego Junges


THANK YOU:
-------------------------
• Mad Day Man: for creating and designing the prototype of this layout. I'm happy to be able to bring many of your ideas to "code".
• Pedro Santana: for all the help from the beginning, back when we thought we were going to spend the rest of our lives collecting data.
• Leonardo Santana: for teaching me how to use GitHub =)
• Georg Ortner & KW Studios: for assisting and encouraging this project, providing all the means for us to expand the HUD's functionalities! 
• Many others that welcomed SealHud since day one, and pushed me to fix things and add new features: 
  Maskerader, S3MØG, Jos Snijder, Mike Kara, Spidybite, ShortyBuzzGER, Niismo, Shay, Marcus, 
  and so so many others (too many people, BUT THANK YOU!) 


SUPPORTERS:
-------------------------
• Christian Birkenbach
• Martin Prinda
• Rado Obrtal
• Alexander Samardzic
• Martin Decker
• Marcus Stoffels
• Stuart Tennant
• Donald Hunter
• Hans-Jörg Mächler
• Jos Snijder

If you encounter any sort of problems, have questions or suggestions, feel free to post in the Forum-Thread!

Thanks for using SealHUD! Thanks for driving RaceRoom!
Diego Junges



`}

<span style={{fontSize: "27px",}}>
  {`${"COMPLETE CHANGELOG:"}`}
</span>

{`
PAST CHANGES (since v.1.00)


VERSION 1.02
-------------------------
- Pit Limiter: Widget has been redesigned.
- Fuel Details: Lap times were being recorded incorrectly in some cases. Fixed.
- Ratings and SoF: Data was frozen due to the RaceRoom browser's caching system. SealHUD is again obtaining data directly from the
  RaceRoom API, but with some code improvements to make lightier than before (8KB max.).
  (Thanks Steven Savino and Samuel Travieso for reporting)

VERSION 1.01
-------------------------
- Fuel Details: V.E. consumption for last lap was not being converted to %. Fixed. (thanks I ///M Back for report this)
- Translations: 'km/h' and 'mph' are the international standards, so any 'KpH' and 'MPH' were removed. (thanks Linx-ESP)
- Delta: A few color changes to make it less green.
- Motec: RPM bar is fixed.
- Performance: Created a mirrored database for user's standings, updated every 3 hours.

VERSION 1.00
-------------------------
- Entirely redesigned Widgets: Motec, Fuel & Lap Details, Damage, Inputs, Race Info, Clock, CrewChief, and Delta.
- New interface for the settings screen and widget selection.
- Units for temperature, pressure, and speed are now defined globally in the settings screen.
- Widget drag grid is now CSS-based (lighter and cleaner).
- New widgets added: ELECTRONICS and CONSUMPTION.
- Removed widgets: P2P/DRS and FUEL.
- Fuel & Lap Details: Now also displays virtual energy consumption data.
- Fuel & Lap Details: Calculator now includes virtual energy estimates.
- Fuel & Lap Details: Fixed a bug that caused some laps not to be recorded.
- Motec: Now correctly displays gears for all vehicles, including trucks.
- Motec: RPM bar temporarily removed.
- Electronics (new):
  Displays water temperature conditions, headlight status, engine map, brake bias, ABS, and TC.
  Also shows overtaking assists such as DRS, Push To Pass, and Overtake (used by Formula X22 and others).
- Consumption (new):
  Provides a vehicle consumption overview, with support for liquid fuel, virtual energy, and battery.
  Displays available amount, per-lap average, and estimated requirement to reach the finish.
- Race Info: Added display of brake cooling water consumption (used by trucks).
- CrewChief: Now displays your team name.
- Driving Aids: Allows switching between HORIZONTAL and VERTICAL modes.
- Inputs Graph: Line smoothing reduced for more accurate telemetry representation.
- Performance: All fuel, virtual energy, and battery consumption calculations were rebuilt from scratch. 
  They are now centralized, executed once, and shared across widgets for better performance and consistency.
`}


    </div>
    );
  }

}