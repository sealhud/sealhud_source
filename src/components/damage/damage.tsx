import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	INVALID
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

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

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
			this.carDamage = r3e.data.CarDamage;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
		}
	};

	render() {return (
		<div
			{...widgetSettings(this.props)}
			className={classNames("damageNew", this.props.className)}
		>
			<div className="carDamageNew">

			{/* Engine */}
			{(this.carDamage.Engine !== INVALID || showAllMode) && (
				<div
					className={classNames("damageRow", {
					bad: !showAllMode && this.carDamage.Engine < 0.98,
					broken: showAllMode || this.carDamage.Engine < 0.3
					})}
				>
					<div className="damageLabel">{_("Engine")}</div>

					<div className="damageValue">
					{showAllMode
						? "75%"
						: `${Math.round((1 - this.carDamage.Engine) * 100)}%`}
					</div>
				</div>
			)}

			{/* Transmission */}
			{(this.carDamage.Transmission !== INVALID || showAllMode) && (
				<div
					className={classNames("damageRow", {
					bad: showAllMode || this.carDamage.Transmission < 0.98,
					broken: !showAllMode && this.carDamage.Transmission < 0.3
					})}
				>
					<div className="damageLabel">{_("Transmission")}</div>

					<div className="damageValue">
					{showAllMode
						? "49%"
						: `${Math.round((1 - this.carDamage.Transmission) * 100)}%`}
					</div>
				</div>
			)}

			{/* Aerodynamics */}
			{(this.carDamage.Aerodynamics !== INVALID || showAllMode) && (
				<div
					className={classNames("damageRow", {
					bad: !showAllMode && this.carDamage.Aerodynamics < 0.98,
					broken: !showAllMode && this.carDamage.Aerodynamics < 0.3
					})}
				>
					<div className="damageLabel">{_("Aerodynamics")}</div>

					<div className="damageValue">
					{showAllMode
						? "0%"
						: `${Math.round((1 - this.carDamage.Aerodynamics) * 100)}%`}
					</div>
				</div>
			)}

			{/* Suspension */}
			{(this.carDamage.Suspension !== INVALID || showAllMode) && (
				<div
					className={classNames("damageRow", {
					bad: !showAllMode && this.carDamage.Suspension < 0.98,
					broken: !showAllMode && this.carDamage.Suspension < 0.3
					})}
				>
					<div className="damageLabel">{_("Suspension")}</div>

					<div className="damageValue">
					{showAllMode
						? "0%"
						: `${Math.round((1 - this.carDamage.Suspension) * 100)}%`}
					</div>
				</div>
			)}

			</div>
		</div>
		);
	}
}
