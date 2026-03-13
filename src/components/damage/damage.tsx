import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	INVALID,
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { ICarDamage } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, { registerUpdate, nowCheck, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import './damage.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

type DamageKey = keyof ICarDamage;

@observer
export default class Damage extends React.Component<IProps, {}> {
	@observable accessor carDamage: ICarDamage = {
		Engine: INVALID,
		Transmission: INVALID,
		Aerodynamics: INVALID,
		Suspension: INVALID,
		Unused1: INVALID,
		Unused2: INVALID
	};

	@observable accessor playerIsFocus = false;
	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor label = 1;

	constructor(props: IProps) {
		super(props);
		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	private damageItems = [
		{ label: "Engine", key: "Engine" as DamageKey },
		{ label: "Transmission", key: "Transmission" as DamageKey },
		{ label: "Aerodynamics", key: "Aerodynamics" as DamageKey },
		{ label: "Suspension", key: "Suspension" as DamageKey }
	];

	private damageIcons: Record<string, string> = {
		Engine: "Engine.svg",
		Transmission: "Transmission.svg",
		Aerodynamics: "Aero.svg",
		Suspension: "Suspension.svg"
	};

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
			this.carDamage = r3e.data.CarDamage;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
		}
	};

	private renderDamageRow(label: string, value: number) {
		const integrity = value;
		const damagePercent = Math.round((1 - integrity) * 100);
		const showBars = this.props.settings.subSettings.showBars.enabled;
		const showIcons = this.props.settings.subSettings.showIcons.enabled;
		let demoIntegrity = integrity;
		if (showAllMode) {
			if (label === "Engine") demoIntegrity = 0.75;
			if (label === "Transmission") demoIntegrity = 0;
		}

		return (
			<div
				className={classNames("damageRow", {
					na: value === INVALID,
					bad: (showAllMode && label === "Engine") || value < 0.98,
					broken: (showAllMode && label === "Transmission") || value < 0.3
				})}
			>
				<div
					className={classNames("damageLabel", {
						damageLabelIcon: showIcons
					})}
				>
					{showIcons ? (
						<div className={`damageIcon`}>
							<SvgIcon src={require(`./../../img/icons/${this.damageIcons[label]}`)}/>
						</div>
					) : (
						_(label)
					)}
				</div>

				<div className="damageValue">
					{value === INVALID ? (
						"N/A"
					) : showBars ? (
						<div className="damageBar">
							<div
								className="damageFill"
								style={{ width: `${demoIntegrity * 100}%` }}
							/>
						</div>
					) : (
						showAllMode && label === "Engine"
							? "75%"
							: showAllMode && label === "Transmission"
								? "100%"
								: `${damagePercent}%`
					)}
				</div>
			</div>
		);
	}

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames("damageNew", this.props.className)}
			>
				<div className="carDamageNew">
					{this.damageItems.map(item =>
						this.renderDamageRow(
							item.label,
							this.carDamage[item.key]
						)
					)}
				</div>
			</div>
		);
	}
}
