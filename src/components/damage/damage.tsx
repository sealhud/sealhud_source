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

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (!this.playerIsFocus && !showAllMode) {
			return null;
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('damage', this.props.className)}
			>
				<div className="carDamage">
					{/* Engine damage */}
					{(this.carDamage.Engine !== INVALID || showAllMode) && (
						<div
							className={classNames('part engine', {
								bad: !showAllMode && this.carDamage.Engine < 0.98,
								broken: showAllMode || this.carDamage.Engine < 0.5
							})}
						>
							<div className="label">{_('Engine')}</div>
							<div className="barContainer">
								<div
									className="bar"
									style={{
										width: showAllMode
											?	`49%`
											:	`${this.carDamage.Engine * 100}%`
									}}
								/>
							</div>
						</div>
					)}

					{/* Transmission damage */}
					{(this.carDamage.Transmission !== INVALID || showAllMode) && (
						<div
							className={classNames('part transmission', {
								bad: showAllMode || this.carDamage.Transmission < 0.98,
								broken: !showAllMode && this.carDamage.Transmission < 0.5
							})}
						>
							<div className="label">{_('Transmission')}</div>
							<div className="barContainer">
								<div
									className="bar"
									style={{
										width: showAllMode
											?	`75%`
											:	`${this.carDamage.Transmission * 100}%`
									}}
								/>
							</div>
						</div>
					)}

					{/* Aerodynamics damage */}
					{(this.carDamage.Aerodynamics !== INVALID || showAllMode) && (
						<div
							className={classNames('part aerodynamics', {
								bad: !showAllMode && this.carDamage.Aerodynamics < 0.98,
								broken: !showAllMode && this.carDamage.Aerodynamics < 0.5
							})}
						>
							<div className="label">{_('Aerodynamics')}</div>
							<div className="barContainer">
								<div
									className="bar"
									style={{
										width: showAllMode
											?	`100%`
											:	`${this.carDamage.Aerodynamics * 100}%`
									}}
								/>
							</div>
						</div>
					)}

					{/* Suspension damage */}
					{(this.carDamage.Suspension !== INVALID || showAllMode) && (
						<div
							className={classNames('part suspension', {
								bad: !showAllMode && this.carDamage.Suspension < 0.98,
								broken: !showAllMode && this.carDamage.Suspension < 0.5
							})}
						>
							<div className="label">{_('Suspension')}</div>
							<div className="barContainer">
								<div
									className="bar"
									style={{
										width: showAllMode
											?	`100%`
											:	`${this.carDamage.Suspension * 100}%`
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
