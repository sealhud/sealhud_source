import { FuelEvents } from "../../lib/FuelEvents";
import { FuelStrategy } from '../../lib/FuelStrategy'
import { EnergyEvents } from "../../lib/EnergyEvents";
import { EnergyStrategy } from '../../lib/EnergyStrategy'
import {
	widgetSettings,
	classNames,
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
	lowPerformanceMode,
	highPerformanceMode,
	speedInMPH
} from '../app/app';
import { action, observable } from 'mobx';
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

type FuelDetailMode = "details" | "calculator";

interface IFuelDetailState {
  mode: FuelDetailMode;
}


@observer
export default class FuelDetail extends React.Component<IProps, IFuelDetailState> {
	state: IFuelDetailState = {
		mode: "details"
	};
	onRightClick = (e: React.MouseEvent) => {
		e.preventDefault();

		this.setState(prev => ({
			mode: prev.mode === "details" ? "calculator" : "details"
		}));
	};
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor lastCheck = 0;

	@observable accessor fuelPerLap = 0;
	@observable accessor fuelLeft = 0;
	@observable accessor fuelUseActive = false;
	@observable accessor veUseActive = false;
	@observable accessor veLeft = 0;

	constructor(props: IProps) {
		super(props);
		registerUpdate(this.update);
	}	
	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
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
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.fuelLeft = r3e.data.FuelLeft;
			this.fuelPerLap = r3e.data.FuelPerLap;
			this.fuelUseActive = r3e.data.FuelUseActive > 0 && r3e.data.FuelPressure > 0;
			this.veUseActive = r3e.data.VirtualEnergyCapacity > 0;
			this.veLeft = ((r3e.data.VirtualEnergyLeft * 100) / r3e.data.VirtualEnergyCapacity);
		}
	};


	render() {
		if (this.sessionType === 2 && this.sessionPhase === 1) return null;
		
		// HELPERS
		const isNA = (value: unknown) => value === "-" || value === "--:--.--";
		const fuelCellClass = (
			value: string,
			{
				ok,
				need
			}: { ok?: string; need?: string }
			) => {
			if (isNA(value)) return "fueldetail-na";
			if (needsFuel && need) return need;
			return ok ?? "";
		};
		const veCellClass = (
			value: string,
			{
				ok,
				need
			}: { ok?: string; need?: string }
			) => {
			if (isNA(value)) return "fueldetail-na";
			if (needsVE && need) return need;
			return ok ?? "";
		};

		// LAP TIME & SPEED INFO
		const bestLapTimeSelf = FuelEvents.bestLapTimeSec !== null 
			? formatTime(FuelEvents.bestLapTimeSec, 'm:ss.SSS')
			: "--:--.--";
		const avgLapTimeSelf = FuelEvents.avgLapTimeSec !== null 
			? formatTime(FuelEvents.avgLapTimeSec, 'm:ss.SSS')
			: "--:--.--";
		const avgSpeed = FuelEvents.avgSpeedMs !== null
			? mpsToKph(FuelEvents.avgSpeedMs).toFixed() + " km/h"
			: "-";

		// FUEL
		const fuelToEnd = FuelStrategy.FuelToEnd !== null && this.fuelUseActive
			? FuelStrategy.FuelToEnd.toFixed(1)
			: '-';
		const fuelToAdd = FuelStrategy.FuelToAdd !== null && this.fuelUseActive
			? FuelStrategy.FuelToAdd.toFixed(1)
			: '-';
		const fuelToAddRaw = FuelStrategy.FuelToAdd;
		const needsFuel = fuelToAddRaw !== null && fuelToAddRaw > 0;
		const lastLapFuelUsed = FuelEvents.lastLapFuelUsed !== null
			? FuelEvents.lastLapFuelUsed.toFixed(2)
			: '-';
		const avgFuelPerLap = this.fuelUseActive
			? FuelEvents.avgFuelPerLap === null
				? this.fuelPerLap.toFixed(2)
				: FuelEvents.avgFuelPerLap.toFixed(2)
			: '-';
		const fuelLeft = this.fuelUseActive
			? this.fuelLeft.toFixed(1)
			: "-";
		const lapsEstim = this.fuelUseActive
			? FuelEvents.avgFuelPerLap === null
				? (this.fuelLeft / this.fuelPerLap).toFixed(1)
				: (this.fuelLeft / FuelEvents.avgFuelPerLap).toFixed(1)
			: "-";
		const timeEstim = this.fuelUseActive && FuelEvents.avgLapTimeSec !== null
			? FuelEvents.avgFuelPerLap === null
				? formatTime(((this.fuelLeft / this.fuelPerLap)*FuelEvents.avgLapTimeSec), 'H:mm:ss')
				: formatTime(((this.fuelLeft / FuelEvents.avgFuelPerLap)*FuelEvents.avgLapTimeSec), 'H:mm:ss')
			: "--:--.--";

		// VIRTUAL ENERGY
		const veToEnd = EnergyStrategy.veToEndValue !== null && this.veUseActive
			? EnergyStrategy.veToEndValue.toFixed(0)+"%"
			: '-';
		const veToAdd = EnergyStrategy.veToAddValue !== null && this.veUseActive
			? EnergyStrategy.veToAddValue.toFixed(0)+"%"
			: '-';
		const veToAddRaw = EnergyStrategy.veToAddValue;
		const needsVE = veToAddRaw !== null && veToAddRaw > 0;
		const lastLapVeUsed = EnergyEvents.lastLapVEUsed !== null
			? EnergyEvents.lastLapVEUsed.toFixed(1)+"%"
			: '-';
		const avgVePerLap = this.veUseActive && EnergyStrategy.veAvgValue !== null
			? EnergyStrategy.veAvgValue.toFixed(1)+"%"
			: '-';
		const veLeft = EnergyStrategy.veNowValue !== null
			? EnergyStrategy.veNowValue.toFixed(0)+"%"
			: "-";
		const lapsEstimVe = this.veUseActive && EnergyStrategy.veAvgValue !== null
			? (this.veLeft / EnergyStrategy.veAvgValue).toFixed(1)
			: "-";
		const timeEstimVe = this.veUseActive && FuelEvents.avgLapTimeSec !== null && EnergyStrategy.veAvgValue !== null
			? formatTime(((this.veLeft / EnergyStrategy.veAvgValue)*FuelEvents.avgLapTimeSec), 'H:mm:ss')
			: "--:--.--";

		return (
			<div
			{...widgetSettings(this.props)}
			className="fuelDetails"
			onContextMenu={this.onRightClick}
			>

			{this.state.mode === "details" && (
				<div className="fuelTable">

				{/* ROW 1 — OVERVIEW */}
				<div className="fuelRow">
					<div className="cell label span-1">Avg.</div>
					<div className={classNames("cell data span-2",fuelCellClass(avgSpeed, {}))}>
						{avgSpeed}
					</div>
					<div className={classNames("cell data span-2",fuelCellClass(avgLapTimeSelf, {}))}>
						{avgLapTimeSelf}
					</div>
					<div className="cell label span-1">Best</div>
					<div className={classNames("cell data span-2",fuelCellClass(bestLapTimeSelf, {}))}>
						{bestLapTimeSelf}
					</div>
					<div className="cell empty span-1"/>
				</div>

				{/* ROW 2 — HEADER */}
				<div className="fuelRow">
					<div className="cell data span-1" />
					<div className="cell label">Remain</div>
					<div className="cell label">Per Lap</div>
					<div className="cell label">Last Lap</div>
					<div className="cell label">To End</div>
					<div className="cell label">Laps Estim.</div>
					<div className="cell label">Time Estim.</div>
					<div className="cell label">To Add</div>
				</div>

				{/* ROW 3 — FUEL */}
				<div className="fuelRow">
					<div className="cell label">Fuel (L)</div>
					<div className={classNames("cell data",fuelCellClass(fuelLeft, {}))}>
						{fuelLeft}
					</div>
					<div className={classNames("cell data",fuelCellClass(avgFuelPerLap, {}))}>
						{avgFuelPerLap}
					</div>
					<div className={classNames("cell data",fuelCellClass(lastLapFuelUsed, {}))}>
						{lastLapFuelUsed}
					</div>
					<div className={classNames("cell data",fuelCellClass(fuelToEnd, {ok: "fueldetailvalue-ok",need: "fueldetailvalue-need"}))}>
						{fuelToEnd}
					</div>
					<div className={classNames("cell data",fuelCellClass(lapsEstim, {}))}>
						{lapsEstim}
					</div>
					<div className={classNames("cell data",fuelCellClass(timeEstim, {}))}>
						{timeEstim}
					</div>
					<div className={classNames("cell data",fuelCellClass(fuelToAdd, {ok: "fueldetail-ok",need: "fueldetail-need"}))}>
  						{fuelToAdd}
					</div>
				</div>

				{/* ROW 4 — VIRTUAL ENERGY */}
				<div className="fuelRow">
					<div className="cell label">V.E. (%)</div>
					<div className={classNames("cell data",veCellClass(veLeft, {}))}>
						{veLeft}
					</div>
					<div className={classNames("cell data",veCellClass(avgVePerLap, {}))}>
						{avgVePerLap}
					</div>
					<div className={classNames("cell data",veCellClass(lastLapVeUsed, {}))}>
						{lastLapVeUsed}
					</div>
					<div className={classNames("cell data",veCellClass(veToEnd, {ok: "fueldetailvalue-ok",need: "fueldetailvalue-need"}))}>
						{veToEnd}
					</div>
					<div className={classNames("cell data",veCellClass(lapsEstimVe, {}))}>
						{lapsEstimVe}
					</div>
					<div className={classNames("cell data",veCellClass(timeEstimVe, {}))}>
						{timeEstimVe}
					</div>
					<div className={classNames("cell data",veCellClass(veToAdd, {ok: "fueldetail-ok",need: "fueldetail-need"}))}>
  						{veToAdd}
					</div>
				</div>

				</div>
			)}

			{this.state.mode === "calculator" && (
				<div className="fuelCalc">

					{/* ROW 1 — HEADER */}
					<div className="fuelCalcRow">
					<div className="cell label span-2">STINT</div>
					<div className="cell label">FUEL</div>
					<div className="cell label">V.E.</div>
					</div>

					{/* ROW 2 — LAPS */}
					<div className="fuelCalcRow">
					<div className="cell label">LAPS</div>

					<div className="cell data control">
						<div className="ctrlCol">
						<button>-5</button>
						<button>-1</button>
						</div>

						<div className="ctrlValue">0</div>

						<div className="ctrlCol">
						<button>+1</button>
						<button>+5</button>
						</div>
					</div>

					<div className="cell data">--</div>
					<div className="cell data">--</div>
					</div>

					{/* ROW 3 — MINUTES */}
					<div className="fuelCalcRow">
					<div className="cell label">MIN</div>

					<div className="cell data control">
						<div className="ctrlCol">
						<button>-5</button>
						<button>-1</button>
						</div>

						<div className="ctrlValue">0</div>

						<div className="ctrlCol">
						<button>+1</button>
						<button>+5</button>
						</div>
					</div>

					<div className="cell data">--</div>
					<div className="cell data">--</div>
					</div>

					{/* ROW 4 — RESET */}
					<div className="fuelCalcRow">
					<div className="cell data reset span-4">
						RESET
					</div>
					</div>

				</div>
				)}


			</div>
		);
	}

}
