import {
	classNames,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	showAllMode,
	eIsDynamicBbias
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './overtakingAids.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class OvertakingAids extends React.Component<IProps, {}> {
	@observable accessor drs = {
		/** If DRS is equipped and allowed */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Equipped: 0,
		/** Got DRS activation left */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Available: 0,
		/** Number of DRS activations left this lap */
		/** Note: In sessions with 'endless' amount of drs activations per lap
		 * this value starts at :max: number */
		/** -1 = N/A */
		NumActivationsLeft: 0,
		/** DRS engaged */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Engaged: 0
	};

	@observable accessor pushToPass = {
		Available: 0,
		Engaged: 0,
		AmountLeft: 0,
		EngagedTimeLeft: 0,
		WaitTimeLeft: 0
	};

	@observable accessor maxP2pTimeLeft = 0;
	@observable accessor maxP2pWaitTimeLeft = 0;
	@observable accessor lastCheck = 0;
	@observable accessor drsEquipped = false;
	@observable accessor drsAvailable = false;
	@observable accessor drsEngaged = false;
	@observable accessor drsNumActivationsLeft = -1;
	@observable accessor drsNumActivationsTotal = -1;
	@observable accessor drsInfinite = false;
	@observable accessor p2pEquipped = false;
	@observable accessor p2pAvailable = false;
	@observable accessor p2pEngaged = false;
	@observable accessor p2pAsOvertake = false;
	@observable accessor p2pNumActivationsLeft = -1;
	@observable accessor p2pNumActivationsTotal = -1;
	@observable accessor p2pEngagedTimeLeft = -1;
	@observable accessor p2pMaxEngageTime = -1;
	@observable accessor p2pWaitTimeLeft = -1;
	@observable accessor p2pMaxWaitTime = -1;
	infiniteLabel = '∞';
	updateFunc: Function;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor engineMap = 0;
	@observable accessor absLevel = 0;
	@observable accessor tcLevel = 0;
	@observable accessor brakeBias = 0;
	@observable accessor waterTemp = 0;
	@observable accessor headLights = -1;

	constructor(props: IProps) {
		super(props);

		this.updateFunc = this.update.bind(this);
		registerUpdate(this.updateFunc);
	}

	componentWillUnmount() {
		unregisterUpdate(this.updateFunc);
	}

	@action
	private update() {
		this.lastCheck = nowCheck;
		this.sessionType = r3e.data.SessionType;
		this.sessionPhase = r3e.data.SessionPhase;
		this.drsEquipped = r3e.data.Drs.Equipped > 0;
		this.drsAvailable = r3e.data.Drs.Available > 0;
		this.drsEngaged = r3e.data.Drs.Engaged > 0;
		this.drsNumActivationsLeft = r3e.data.Drs.NumActivationsLeft;
		this.drsNumActivationsTotal = r3e.data.DrsNumActivationsTotal;
		this.drsInfinite = this.drsNumActivationsLeft > 1000000;
		this.p2pEquipped = r3e.data.PushToPass.Available !== -1;
		this.p2pAvailable = r3e.data.PushToPass.Available === 1;
		this.p2pAsOvertake = r3e.data.VehicleInfo.ClassPerformanceIndex === 4;
		this.p2pEngaged = r3e.data.PushToPass.Engaged > 0;
		this.p2pNumActivationsLeft = r3e.data.PushToPass.AmountLeft;
		this.p2pNumActivationsTotal =
			r3e.data.PtPNumActivationsTotal !== undefined
			?	r3e.data.PtPNumActivationsTotal
			:	r3e.data.PtpNumActivationsTotal !== undefined
				?	r3e.data.PtpNumActivationsTotal
				:	-1;
		this.p2pEngagedTimeLeft = r3e.data.PushToPass.EngagedTimeLeft;
		this.p2pWaitTimeLeft = r3e.data.PushToPass.WaitTimeLeft;

		if (this.p2pMaxEngageTime === -1 && this.p2pEngagedTimeLeft > 0) {
			this.p2pMaxEngageTime = Math.round(this.p2pEngagedTimeLeft);
		}
		if (this.p2pMaxEngageTime !== -1 && this.p2pEngagedTimeLeft <= 0) {
			this.p2pMaxEngageTime = -1;
		}
		if (this.p2pMaxWaitTime === -1 && this.p2pWaitTimeLeft > 0) {
			this.p2pMaxWaitTime = Math.round(this.p2pWaitTimeLeft);
		}
		if (this.p2pMaxWaitTime !== -1 && this.p2pWaitTimeLeft <= 0) {
			this.p2pMaxWaitTime = -1;
		}
		this.engineMap = r3e.data.EngineMapSetting;
		this.absLevel = r3e.data.AbsSetting;
		if (!eIsDynamicBbias || r3e.data.BrakeRaw === 0) {
			this.brakeBias = Math.round((100 - 100 * r3e.data.BrakeBias) * 10) / 10;
		}	
		this.tcLevel = r3e.data.TractionControlSetting;
		this.waterTemp = r3e.data.EngineTemp;
		this.headLights = r3e.data.HeadLights;
	}

	private roundTemp(num: number): number {
		return Number(num.toFixed(0));
	}

	render() {		
		let p2pLabel = this.p2pAsOvertake ? "Overtake" : "P2P";
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		/* if (!ePlayerIsFocus && !showAllMode) {
			return null;
		}*/

		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('electronicsContainer', this.props.className)}
			>
				{/* TOP ROW — electronics */}
				<div className="electronicsTopRow">
					<div className={classNames("electronicsBox", {disabled: this.engineMap === -1})}>
						EM{this.engineMap !== -1 ? ` ${this.engineMap}` : ""}
					</div>

					<div className={classNames("electronicsBox", {disabled: this.brakeBias === -1})}>
						BB{this.brakeBias !== -1 ? ` ${this.brakeBias}%` : ""}
					</div>

					<div className={classNames("electronicsBox", {disabled: this.absLevel === -1})}>
						ABS{this.absLevel !== -1 ? ` ${this.absLevel}` : ""}
					</div>

					<div className={classNames("electronicsBox", {disabled: this.tcLevel === -1})}>
						TC{this.tcLevel !== -1 ? ` ${this.tcLevel}` : ""}
					</div>
				</div>

				{/* MIDDLE ROW — info */}
				<div className="electronicsMidRow">

					{/* WaterTemperature */}
					{
						<div className="infoBox">
							<span
								className={classNames("label", {
								"temp-ok": this.waterTemp < 95,
								"temp-warn": this.waterTemp >= 95 && this.waterTemp < 104,
								"temp-hot": this.waterTemp >= 104,
								disabled: this.waterTemp < 60 && !showAllMode
								})}
							>
								<SvgIcon
								className="icon"
								src={require("./../../img/icons/watertemp.svg")}
								/>
							</span>
							{this.props.settings.subSettings.tempCelsius.enabled
							? this.roundTemp(this.waterTemp) + '°C'
							: this.roundTemp((this.waterTemp*1.8)+32) + '°F'
							}
						</div>
					}
					{/* HeadLights */}
					{
						<div className="infoBox">
							<span
								className={classNames("label", {
								"headlights-on": this.headLights === 1,
								"headlights-flashing": this.headLights === 2
								})}
							>
								<SvgIcon
								className="icon"
								src={require("./../../img/icons/headlights.svg")}
								/>
							</span>
						</div>
					}					
				</div>

				{/* BOTTOM ROW — overtaking aids */}
				<div className="electronicsBottomRow">
					{/* DRS */}
					{
						<div
						className={classNames("electronicsBigBox", {
							available: this.drsAvailable || showAllMode,
							active: this.drsEngaged
						})}
						>
							<span className={classNames("label", {disabled: this.drsEquipped === false && !showAllMode})}>DRS</span>
							{this.drsEquipped === true && (<span className="value">
							{this.drsInfinite
								? this.infiniteLabel
								: this.drsNumActivationsTotal > 0
								? `${this.drsNumActivationsLeft}/${this.drsNumActivationsTotal}`
								: this.drsNumActivationsLeft}
							</span>)}
						</div>
					}
					{/* PUSH TO PASS */}
					{
						<div
						className={classNames("electronicsBigBox", {
							available: this.p2pAvailable,
							active: this.p2pEngaged || showAllMode
						})}
						>
							<span className={classNames("label", {disabled: this.p2pEquipped === false && !showAllMode})}>{p2pLabel}</span>
							{this.p2pEquipped === true && (<span className="value">
							{this.p2pNumActivationsTotal > 0
								? `${this.p2pNumActivationsLeft}/${this.p2pNumActivationsTotal}`
								: !this.p2pAsOvertake
									? this.p2pNumActivationsLeft
									: ""}
							</span>)}
						</div>
					}
				</div>

			</div>
		);
	}
}
