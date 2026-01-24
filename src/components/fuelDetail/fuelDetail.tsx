// Acertar as traduções

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
	speedInKPH,
	blockFuelCalc,
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

@observer
export default class FuelDetail extends React.Component<IProps, {}> {
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor lastCheck = 0;
	@observable accessor displayMessage = '';
	@observable accessor showDeleteAll = false;
	@observable accessor showDeleteCombo = false;
	@observable accessor displayMessageSwitch = false;
	@observable accessor showConfirmButtons = false;
	@observable accessor displayMessageTimer: any = INVALID;
	@observable accessor blockCalc = false;
	@observable accessor fuelCalcBlock = blockFuelCalc;
	@observable accessor fuelCalcEnabled = false;
	@observable accessor setTimeFuel = 0;
	@observable accessor setRoundFuel = 0;
	@observable accessor fuelPerLap = 0;
	@observable accessor fuelLeft = 0;
	@observable accessor fuelUseActive = false;
	@observable accessor veUseActive = false;
	@observable accessor veLeft = 0;
	@observable accessor speedKPH = speedInKPH || false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	@action
	private update = () => {
		
		/*
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
		*/
			this.lastCheck = nowCheck;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.fuelLeft = r3e.data.FuelLeft;
			this.fuelPerLap = r3e.data.FuelPerLap;
			this.fuelUseActive = r3e.data.FuelUseActive > 0 && r3e.data.FuelPressure > 0;
			this.veUseActive = r3e.data.VirtualEnergyCapacity > 0;
			this.veLeft = ((r3e.data.VirtualEnergyLeft * 100) / r3e.data.VirtualEnergyCapacity);
			this.fuelCalcBlock = blockFuelCalc;
			if (this.props.settings.subSettings.clearComboData.enabled) {
				this.clearData(false);
			}
			if (this.props.settings.subSettings.clearAllData.enabled) {
				this.clearData(true);
			}
			this.speedKPH = speedInKPH;
		//}
	};

	// HELPERS

	private isNA(value: unknown) {
		return value === "-" || value === "--:--.--";
	}

	private cellClass(
		value: string,
		needs: boolean,
		ok?: string,
		need?: string
		) {
		if (this.isNA(value)) return "fueldetail-na";
		if (needs && need) return need;
		return ok ?? "";
	}

	// DADOS DE FUEL

	private getFuelDetails() {
		const active = this.fuelUseActive;
		const fuelToAddRaw = FuelStrategy.FuelToAdd;
		const needsFuel = fuelToAddRaw !== null && fuelToAddRaw > 0;

		return {
			fuelLeft: active ? this.fuelLeft.toFixed(1) : "-",
			avgFuelPerLap: active
			? (FuelEvents.avgFuelPerLap ?? this.fuelPerLap).toFixed(2)
			: "-",
			lastLapFuelUsed:
			active && FuelEvents.lastLapFuelUsed !== null
				? FuelEvents.lastLapFuelUsed.toFixed(2)
				: "-",
			fuelToEnd:
			active && FuelStrategy.FuelToEnd !== null
				? FuelStrategy.FuelToEnd.toFixed(1)
				: "-",
			fuelToAdd:
			active && FuelStrategy.FuelToAdd !== null
				? FuelStrategy.FuelToAdd.toFixed(1)
				: "-",
			lapsEstim:
			active
				? (
					this.fuelLeft /
					(FuelEvents.avgFuelPerLap ?? this.fuelPerLap)
				).toFixed(1)
				: "-",
			timeEstim:
			active && FuelEvents.avgLapTimeSec !== null
				? formatTime(
					(this.fuelLeft /
					(FuelEvents.avgFuelPerLap ?? this.fuelPerLap)) *
					FuelEvents.avgLapTimeSec,
					"H:mm:ss"
				)
				: "--:--.--",
			needsFuel
		};
	}

	// DADOS DE VIRTUAL ENERGY

	private getVEDetails() {
		const active = this.veUseActive;
		const veToAddRaw = EnergyStrategy.veToAddValue;
		const needsVE = veToAddRaw !== null && veToAddRaw > 0;

		return {
			veLeft:
			EnergyStrategy.veNowValue !== null
				? EnergyStrategy.veNowValue.toFixed(0) + "%"
				: "-",
			avgVePerLap:
			active && EnergyStrategy.veAvgValue !== null
				? EnergyStrategy.veAvgValue.toFixed(1) + "%"
				: "-",
			lastLapVeUsed:
			EnergyEvents.lastLapVEUsed !== null
				? EnergyEvents.lastLapVEUsed.toFixed(1) + "%"
				: "-",
			veToEnd:
			active && EnergyStrategy.veToEndValue !== null
				? EnergyStrategy.veToEndValue.toFixed(0) + "%"
				: "-",
			veToAdd:
			active && EnergyStrategy.veToAddValue !== null
				? EnergyStrategy.veToAddValue.toFixed(0) + "%"
				: "-",
			lapsEstimVe:
			active && EnergyStrategy.veAvgValue !== null
				? (this.veLeft / EnergyStrategy.veAvgValue).toFixed(1)
				: "-",
			timeEstimVe:
			active &&
			FuelEvents.avgLapTimeSec !== null &&
			EnergyStrategy.veAvgValue !== null
				? formatTime(
					(this.veLeft / EnergyStrategy.veAvgValue) *
					FuelEvents.avgLapTimeSec,
					"H:mm:ss"
				)
				: "--:--.--",
			needsVE
		};
	}	

	@action
	private clearData(allData = false) {
		if (allData) {
			this.displayMessage = _('Really delete ALL data?');
			this.showDeleteAll = true;
			this.showDeleteCombo = false;
		} else {
			this.displayMessage = _('Really delete Combination data?');
			this.showDeleteCombo = true;
			this.showDeleteAll = false;
		}
		this.displayMessageSwitch = true;
		this.showConfirmButtons = true;
	}

	@action
	private cancelClearData = () => {
		this.showDeleteAll = false;
		this.showDeleteCombo = false;
		this.showConfirmButtons = false;
		this.displayMessageSwitch = false;
		clearTimeout(this.displayMessageTimer);
	}

	@action
		private displayMessageReset = () => {
			this.displayMessageSwitch = false;
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
				}, 2000);
			}
			if (
				!this.fuelCalcEnabled && !this.blockCalc
			) {
				if (
					FuelEvents.avgLapTimeSec === null 
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
			!this.fuelCalcEnabled && !this.blockCalc && !this.fuelCalcBlock
		) {
			if (
					FuelEvents.avgLapTimeSec === null 
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
		let calculated = 0;
		if (FuelEvents.avgLapTimeSec !== null && this.fuelUseActive) {
			const fuelPerLap = FuelEvents.avgFuelPerLap; 
			calculated = this.setRoundFuel * fuelPerLap;
			if (minutes) {
				calculated = fuelPerLap * Math.ceil((this.setTimeFuel * 60) / FuelEvents.avgLapTimeSec);
			}
		}		
		return calculated.toFixed(1) + 'L';
	}

	private getVeNeeded(minutes: boolean) {
		let vecalculated = 0;
		if (FuelEvents.avgLapTimeSec !== null && EnergyEvents.avgVEPerLap !== null && this.veUseActive) {
			const vePerLap = (EnergyEvents.avgVEPerLap)*100 / r3e.data.VirtualEnergyCapacity; 
			vecalculated = this.setRoundFuel * vePerLap;
			if (minutes) {
				vecalculated = vePerLap * Math.ceil((this.setTimeFuel * 60) / FuelEvents.avgLapTimeSec);
			}
		}		
		return vecalculated.toFixed(1) + '%';
	}

	@action
	private clearAllData = () => {
		this.showDeleteAll = false;
		this.showDeleteCombo = false;
		this.showConfirmButtons = false;
		if (FuelEvents.avgLapTimeSec !== null) {
			FuelEvents.clearAllPersisted();
			EnergyEvents.clearAllPersisted();
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
	private clearCombinationData = () => {
		if (FuelEvents.avgLapTimeSec !== null) {
			this.showDeleteAll = false;
			this.showDeleteCombo = false;
			this.showConfirmButtons = false;
			FuelEvents.clearCurrentPersisted();
			EnergyEvents.clearCurrentPersisted();
			showDebugMessage(
				_('Fuel/Lap Tracking data for this Combination got deleted!'),
				3000
			);
		}
		this.displayMessageSwitch = false;
		clearTimeout(this.displayMessageTimer);
	}

	private renderMessageSwitch() {
		return (
			<>
				<div className="ClearData">
					{this.displayMessage}
				</div>
				{
					this.showConfirmButtons &&
					!this.showDeleteCombo &&
					this.showDeleteAll && (
						<button className="confirmYes" onClick={this.clearAllData}>
							{_('YES')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteCombo &&
					this.showDeleteAll && (
						<button className="confirmNo" onClick={this.cancelClearData}>
							{_('NO')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteAll &&
					this.showDeleteCombo &&
					(
						<button className="confirmYes" onClick={this.clearCombinationData}>
							{_('YES')}
						</button>
					)
				}
				{
					this.showConfirmButtons &&
					!this.showDeleteAll &&
					this.showDeleteCombo && (
						<button className="confirmNo" onClick={this.cancelClearData}>
							{_('NO')}
						</button>
					)
				}
			</>
		);
	}

	private renderFuelCalculator () {
		return (
			<>
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

				<div className="VeCalcMinuteNeedBox"/>
				<div className="VeCalcMinuteNeedTextBox">
					<div className="VeCalcMinuteNeedText">
						{_('V.E. needed')}
					</div>
				</div>

				<div className="VeCalcMinuteNeedAmountBox">
					<div className="VeCalcMinuteNeedAmount">
						{this.getVeNeeded(true)}
					</div>
				</div>

				<div className="VeCalcRoundNeedBox"/>
				<div className="VeCalcRoundNeedTextBox">
					<div className="VeCalcRoundNeedText">
						{_('V.E. needed')}
					</div>
				</div>
				<div className="VeCalcRoundNeedAmountBox">
					<div className="VeCalcRoundNeedAmount">
						{this.getVeNeeded(false)}
					</div>
				</div>
			</>
		);
	}

	private renderFuelDetails () {
		FuelEvents.lapStatsTick;
		const fuel = this.getFuelDetails();
		const ve = this.getVEDetails();
		const bestLapTimeSelf =
		FuelEvents.bestLapTimeSec !== null
			? formatTime(FuelEvents.bestLapTimeSec, 'm:ss.SSS')
			: "--:--.--";

		const avgLapTimeSelf =
		FuelEvents.avgLapTimeSec !== null
			? formatTime(FuelEvents.avgLapTimeSec, 'm:ss.SSS')
			: "--:--.--";

		const avgSpeed =
		FuelEvents.avgSpeedMs !== null
			? this.speedKPH
				? mpsToKph(FuelEvents.avgSpeedMs).toFixed() + " km/h"
				: mpsToMph(FuelEvents.avgSpeedMs).toFixed() + " mi/h"
			: "-";
		return (
			<>
				<div className="fuelTable">

					{/* ROW 1 — OVERVIEW */}
					{ this.props.settings.subSettings.showStoredInfo.enabled && (
					<div className="fuelRow">
						<div className="cell label span-1">{_('Avg.')}</div>
						<div className={classNames("cell data span-2",this.cellClass(avgSpeed, false))}>
							{avgSpeed}
						</div>
						<div className={classNames("cell data span-2",this.cellClass(avgLapTimeSelf, false))}>
							{avgLapTimeSelf}
						</div>
						<div className="cell label span-1">{_('Best')}</div>
						<div className={classNames("cell data span-2",this.cellClass(bestLapTimeSelf, false))}>
							{bestLapTimeSelf}
						</div>
					<div className="cell empty span-1" />
					</div>
					) }

					{/* ROW 2 — HEADER */}
					<div className="fuelRow">
					<div className="cell data span-1" />
					<div className="cell label">{_('Remain')}</div>
					<div className="cell label">{_('Per Lap')}</div>
					<div className="cell label">{_('Last Lap')}</div>
					<div className="cell label">{_('To End')}</div>
					<div className="cell label">{_('Laps Estim.')}</div>
					<div className="cell label">{_('Time Estim.')}</div>
					<div className="cell label">{_('To Add')}</div>
					</div>

					{/* ROW 3 — FUEL */}
					<div className="fuelRow">
					<div className="cell label">Fuel (L)</div>

					<div className={classNames("cell data",this.cellClass(fuel.fuelLeft, fuel.needsFuel))}>
						{fuel.fuelLeft}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.avgFuelPerLap, fuel.needsFuel))}>
						{fuel.avgFuelPerLap}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.lastLapFuelUsed, fuel.needsFuel))}>
						{fuel.lastLapFuelUsed}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.fuelToEnd,fuel.needsFuel,"fueldetailvalue-ok","fueldetailvalue-need"))}>
						{fuel.fuelToEnd}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.lapsEstim, fuel.needsFuel))}>
						{fuel.lapsEstim}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.timeEstim, fuel.needsFuel))}>
						{fuel.timeEstim}
					</div>

					<div className={classNames("cell data",this.cellClass(fuel.fuelToAdd,fuel.needsFuel,"fueldetail-ok","fueldetail-need"))}>
						{fuel.fuelToAdd}
					</div>
					</div>

					{/* ROW 4 — VIRTUAL ENERGY */}
					<div className="fuelRow">
					<div className="cell label">V.E. (%)</div>

					<div className={classNames("cell data",this.cellClass(ve.veLeft, ve.needsVE))}>
						{ve.veLeft}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.avgVePerLap, ve.needsVE))}>
						{ve.avgVePerLap}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.lastLapVeUsed, ve.needsVE))}>
						{ve.lastLapVeUsed}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.veToEnd,ve.needsVE,"fueldetailvalue-ok","fueldetailvalue-need"))}>
						{ve.veToEnd}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.lapsEstimVe, ve.needsVE))}>
						{ve.lapsEstimVe}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.timeEstimVe, ve.needsVE))}>
						{ve.timeEstimVe}
					</div>

					<div className={classNames("cell data",this.cellClass(ve.veToAdd,ve.needsVE,"fueldetail-ok","fueldetail-need"))}>
						{ve.veToAdd}
					</div>
					</div>
				</div>
			</>
		);
	}

	render() {
		if (this.sessionType === 2 && this.sessionPhase === 1) return null;
		if (r3e.data.FuelUseActive <= 0 && !showAllMode) return null;

		// ESTADO 1: MENSAGEM
		if (this.displayMessageSwitch) {
			return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelMessageBox', this.props.className, {
					})}
					onWheel={this.onDummy}
					onMouseDown={this.onDummy}
					onMouseUp={this.onDummy}
				>
					{this.renderMessageSwitch()}
				</div>
			);
		}

		// ESTADO 2: CALCULADORA
		if (this.fuelCalcEnabled) {			
			return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelCalc', this.props.className, {
					})}
					onMouseDown={this.onMouseDown}
					onWheel={this.onWheel}
				>
					{this.renderFuelCalculator()}
				</div>
			);
		}

		// ESTADO 3: MOUSEUP: FUEL DETAILS
		if (!this.fuelCalcBlock) {
					return (
				<div
					{...widgetSettings(this.props)}
					className={classNames('fuelDetails', this.props.className, {
					})}
					onMouseUp={this.onMouseUp}
				>
					{this.renderFuelDetails()}
				</div>
			);
		}

		// ESTADO 4: MOUSEDOWN: FUEL DETAILS			
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('fuelDetails', this.props.className, {
				})}
				onMouseDown={this.onMouseDown}
			>
				{this.renderFuelDetails()}
			</div>
		);
		
	}
}
