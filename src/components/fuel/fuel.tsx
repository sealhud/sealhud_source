import { FuelEvents } from "../../lib/FuelEvents";
import { FuelStrategy } from '../../lib/FuelStrategy'
import { EnergyEvents } from "../../lib/EnergyEvents";
import { EnergyStrategy } from '../../lib/EnergyStrategy'
import {
	classNames,
	ePlayerIsFocus,
	showDebugMessageSmall,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './fuel.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Fuel extends React.Component<IProps, {}> {
	@observable accessor vePerLap = 0;
	@observable accessor batteryLeft = 0;
	@observable accessor fuelPerLap = 0;
	@observable accessor fuelLeft = 0;
	@observable accessor fuelUseActive = false;
	@observable accessor veUseActive = false;
	@observable accessor battUseActive = false;
	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor playerIsFocus = false;
	@observable accessor isAI = false;
	@observable accessor lapTimeBestSelf = 0;

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
			this.playerIsFocus = ePlayerIsFocus;
			this.vePerLap = r3e.data.VirtualEnergyPerLap;
			this.batteryLeft = r3e.data.BatterySoC;
			this.fuelPerLap = r3e.data.FuelPerLap;
			this.fuelUseActive = r3e.data.FuelUseActive > 0 && r3e.data.FuelPressure > 0;
			this.veUseActive = r3e.data.VirtualEnergyCapacity > 0;
			this.battUseActive = r3e.data.BatterySoC >= 0;
			this.fuelLeft = r3e.data.FuelLeft;
			this.isAI = r3e.data.ControlType === 1;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
		}
	};

	render() {
		if (this.sessionType === 2 && this.sessionPhase === 1) return null;
		if (
			(!this.playerIsFocus && !this.isAI) &&
			!showAllMode
		) {
			return null;
		}	
		// FUEL
		const FuelToAdd = FuelStrategy.FuelToAdd;
		const needsFuel = FuelToAdd !== null && FuelToAdd > 0;
		const lastLapFuelUsed = FuelEvents.lastLapFuelUsed;
		const avgFuelPerLap = FuelEvents.avgFuelPerLap === null
			? this.fuelPerLap
			: FuelEvents.avgFuelPerLap;
		const fuelStatusClass =
			!this.fuelUseActive || FuelToAdd === null
				? "fuel-na"
				: needsFuel
				? "fuel-need"
				: "fuel-ok";
		const fuelValueClass =
			!this.fuelUseActive
			? "fuel-na"
			: "";

		// VIRTUAL ENERGY
		const VENow = EnergyStrategy.veNowValue;
		const VEToAdd = EnergyStrategy.veToAddValue;
		const needsVE = VEToAdd !== null && VEToAdd > 0;
		const lastLapVEUsed = EnergyEvents.lastLapVEUsed;
		const avgVEPerLap = EnergyStrategy.veAvgValue === null
			? this.vePerLap
			: EnergyStrategy.veAvgValue;
		const veStatusClass =
			VEToAdd === null
				? "fuel-na"
				: needsVE
				? "fuel-need"
				: "fuel-ok";
		const veValueClass =
			!this.veUseActive
			? "fuel-na"
			: "";

		// BATTERY
		const BattToEnd = EnergyStrategy.battToEndValue;
		const avgBattPerLap = EnergyEvents.avgBattPerLap;
		const battStatusClass =
			BattToEnd === null
				? "fuel-na"
				: BattToEnd > 0
				? "fuel-need"
				: "fuel-ok";
		const battValueClass =
			!this.battUseActive
			? "fuel-na"
			: "";

		return (
			<div
			{...widgetSettings(this.props)}
			className={classNames("fuelNew", this.props.className)}
			>

				{/* ROW 1 — LIQUID FUEL */}
				<div className="fuelRow">
					<div className={`fuelCell icon ${fuelStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/fuel_ico.svg")} />
					</div>

					<div className={`fuelCell value ${fuelValueClass}`}>
						{showAllMode
						? "109.5"
						: this.fuelUseActive
							? this.fuelLeft.toFixed(1)
							: "-"}
					</div>

					<div className={`fuelCell value ${fuelValueClass}`}>
						{showAllMode
						? "Ø 2.54"
						: avgFuelPerLap !== null && this.fuelUseActive
							? "Ø " + avgFuelPerLap.toFixed(2)
							: "-"}
					</div>

					<div className={`fuelCell icon ${fuelStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/check_ico.svg")} />
					</div>

					<div className={`fuelCell value ${fuelStatusClass}`}>
						{showAllMode
						? "78.3"
						: FuelToAdd !== null && this.fuelUseActive
							? FuelToAdd.toFixed(1)
							: "-"}
					</div>
				</div>

				{/* ROW 2 — VIRTUAL ENERGY */}
				<div className="fuelRow">
					<div className={`fuelCell icon ${veStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/ve_ico.svg")} />
					</div>

					<div className={`fuelCell value ${veValueClass}`}>
						{showAllMode
						? "83%"
						: VENow !== null && this.veUseActive
							? VENow.toFixed(0) + "%"
							: "-"}
					</div>

					<div className={`fuelCell value ${veValueClass}`}>
						{showAllMode
						? "Ø 5%"
						: avgVEPerLap !== null && this.veUseActive && avgVEPerLap >= 1
							? "Ø " + avgVEPerLap.toFixed(1) + "%"
							: "-"}
					</div>
					
					<div className={`fuelCell icon ${veStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/check_ico.svg")} />
					</div>
					
					<div className={`fuelCell value ${veStatusClass}`}>
						{showAllMode
						? "20%"
						: VEToAdd !== null
							? VEToAdd.toFixed(0) + "%"
							: "-"}
					</div>

				</div>

				{/* ROW 3 — BATTERY */}
				<div className="fuelRow">
					<div className={`fuelCell icon ${battStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/batt_ico.svg")} />
					</div>

					<div className={`fuelCell value ${battValueClass}`}>
						{showAllMode
						? "50%"
						: this.batteryLeft !== null && this.battUseActive
							? this.batteryLeft.toFixed(0) + "%"
							: "-"}
					</div>

					<div className={`fuelCell value ${battValueClass}`}>
						{showAllMode
						? "Ø 9.2%"
						: avgBattPerLap !== null && this.battUseActive
							? "Ø " + avgBattPerLap.toFixed(1) + "%"
							: "-"}
					</div>

					<div className={`fuelCell icon ${battStatusClass}`}>
						<SvgIcon src={require("./../../img/icons/check_ico.svg")} />
					</div>

					<div className={`fuelCell value ${battStatusClass}`}>
						{showAllMode
						? "1%"
						: BattToEnd !== null
							? BattToEnd.toFixed(0) + "%"
							: "-"}
					</div>
				</div>
			</div>
		);
	}
}
