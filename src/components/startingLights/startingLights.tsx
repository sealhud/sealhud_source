import {
	classNames,
	showDebugMessageSmall,
	widgetSettings,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	eIsHillClimb,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
// import { eFormationLap } from '../manualStart/manualStart';
import { ESession } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import { times } from 'lodash-es';
import r3e, { registerUpdate, unregisterUpdate, nowCheck } from '../../lib/r3e';
import React from 'react';
import './startingLights.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class StartingLights extends React.Component<IProps, {}> {
	@observable accessor startLights = INVALID;

	@observable accessor lightCount = 5;
	@observable accessor goneGreen = 1;
	@observable accessor wentGreen = 1;
	@observable accessor nowGreen = 0;
	@observable accessor isRace = false;
	@observable accessor lastCheck = 0;
	@observable accessor isGridStage = false;
	@observable accessor gridTimerText = '';
	// @observable accessor 
	// manualFormation = eFormationLap || -1;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor isHillClimb = false;

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
			nowCheck - this.lastCheck >= 1
		) {
			this.lastCheck = nowCheck;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.isRace = this.sessionType === ESession.Race;
			this.isHillClimb = eIsHillClimb;
			this.isGridStage = this.isRace && this.sessionPhase === 1;
			// this.manualFormation = eFormationLap;
			// if (this.manualFormation === -1) {
			if (this.isGridStage) {
				const gTime = Math.floor(r3e.data.SessionTimeRemaining);
				this.gridTimerText =
					`SealHUD Started - Grid Formation\nForced Race Start in: ${
						Math.floor(r3e.data.SessionTimeRemaining)
					}s`;
				if (gTime > 0) { showDebugMessageSmall(this.gridTimerText, 60, 36, 100, 50, 36); }
			}
			this.startLights = r3e.data.StartLights;
			if (this.startLights < 6) {
				this.goneGreen = 0;
				this.wentGreen = 0;
				this.nowGreen = 0;
			}
			if (this.startLights >= 6 && this.goneGreen === 0) {
				this.goneGreen = 1;
				this.nowGreen = nowCheck;
			}
			if (
				this.goneGreen > 0 &&
				this.wentGreen === 0 &&
				(nowCheck - this.nowGreen) >= 3000
				) {
					this.wentGreen = 1;
			}
			// }
		}
	}

	render() {
		const gameInReplay = r3e.data.GameInReplay > 0;
		const driverDataPlace =
			r3e.data
			?	r3e.data.DriverData
				?	r3e.data.DriverData[0]
					?	r3e.data.DriverData[0].Place
					:	-1
				:	-1
			:	-1;
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			(
				!this.isRace &&
				!this.isHillClimb &&
				!showAllMode
			) ||
			(
				(this.isRace || this.isHillClimb) &&
				this.startLights >= 6 &&
				this.wentGreen === 1
			) ||
			(
				gameInReplay &&
				(
					driverDataPlace === -1 ||
					(
						driverDataPlace !== -1 &&
						this.startLights === 0
					)
				)
			)
		) {
			return null;
		}

		return (
			<div
				className={classNames('startingLights', this.props.className)}
			>
				<div
					className="inner"
					{...widgetSettings(this.props)}
				>
					{times(this.lightCount).map((i: number) => {
						return (
							<div
								key={`light-${i}`}
								className={classNames('light', {
									active: showAllMode
										?	true
										:	this.startLights > i,
									green: showAllMode
										?	false
										:	this.startLights > this.lightCount
								})}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}
