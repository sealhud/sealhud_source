import {
	classNames,
	ePlayerIsFocus,
	formatTime,
	// getPitlaneLength,
	// mpsToKph,
	// showDebugMessageSmall,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { EPitState } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
// import { personalBestTime } from '../fuelDetail/fuelDetail';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './pitstop.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Pitstop extends React.Component<IProps, {}> {
	@observable accessor pitWindowStatus = -1;

	@observable accessor pitState = -1;

	@observable accessor pitMenuState = -1;

	@observable accessor pitWindowStart = -1;

	@observable accessor pitWindowEnd = -1;

	@observable accessor currentLap = -1;

	@observable accessor numberOfLaps = -1;

	@observable accessor sessionTimeRemaining = -1;

	@observable accessor sessionTimeDuration = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor sessionType = -1;

	@observable accessor inPitLane = -1;

	@observable accessor pitMenuStatePenalty = -1;

	@observable accessor mandatoryActive = false;

	@observable accessor pitTotalDuration = -1;

	@observable accessor pitElapsedTime = -1;

	@observable accessor pitTotalMinDuration = -1;

	@observable accessor pitLeftMinDuration = -1;

	@observable accessor pit = {
		preparing: false,
		driverChange: false,
		refueling: false,
		frontTires: false,
		rearTires: false,
		frontWing: false,
		rearWing: false,
		suspension: false
	};

	@observable accessor pitWorkingDriverChange = false;

	@observable accessor pitWorkingRefueling = false;

	@observable accessor pitWorkingFrontTires = false;

	@observable accessor pitWorkingRearTires = false;

	@observable accessor pitWorkingFrontWing = false;

	@observable accessor pitWorkingRearWing = false;

	@observable accessor pitWorkingSuspension = false;

	@observable accessor pitActionDriverChange = false;

	@observable accessor pitActionRefueling = false;

	@observable accessor pitActionFrontTires = false;

	@observable accessor pitActionRearTires = false;

	@observable accessor pitActionFrontWing = false;

	@observable accessor pitActionRearWing = false;

	@observable accessor pitActionSuspension = false;

	@observable accessor carSpeed = 0;

	@observable accessor avgSpeed = -1;

	@observable accessor estimatedPitTime = -1;

	@observable accessor estimatedPosPitExit = -1;

	@observable accessor pitLength = -1;

	@observable accessor inPitSince = -1;

	@observable accessor pitEntryToStop = -1;

	@observable accessor pitDone = {
		driverChange: false,
		refueling: false,
		frontTires: false,
		rearTires: false,
		frontWing: false,
		rearWing: false,
		suspension: false
	};

	@observable accessor mandatoryServed = false;

	@observable accessor lastCheck = 0;

	@observable accessor performanceTime = -1;

	@observable accessor playerIsFocus = false;

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
			this.pitWindowStatus = r3e.data.PitWindowStatus;
			this.pitWindowStart = r3e.data.PitWindowStart;
			this.pitWindowEnd = r3e.data.PitWindowEnd;
			this.currentLap = r3e.data.CompletedLaps + 1;
			this.numberOfLaps = r3e.data.NumberOfLaps;
			this.sessionTimeRemaining = r3e.data.SessionTimeRemaining;
			this.sessionTimeDuration = r3e.data.SessionTimeDuration;
			this.mandatoryActive =
				r3e.data.PitWindowStatus !== -1 &&
				r3e.data.PitWindowStart !== -1 &&
				r3e.data.PitWindowStart !== -1;
			this.sessionPhase = r3e.data.SessionPhase;
			this.sessionType = r3e.data.SessionType;

			this.pitTotalDuration = r3e.data.PitTotalDuration;
			this.pitElapsedTime = r3e.data.PitElapsedTime;
			this.pitTotalMinDuration = r3e.data.PitMinDurationTotal;
			this.pitLeftMinDuration = r3e.data.PitMinDurationLeft;
			this.pitState = r3e.data.PitState;
			this.carSpeed = r3e.data.CarSpeed;
			this.inPitLane = r3e.data.InPitlane;
			this.pitMenuStatePenalty = r3e.data.PitMenuState.Penalty;

			const pitAction = r3e.data.PitAction;
			this.pit = {
				preparing: (pitAction & 1) !== 0,
				driverChange: (pitAction & 4) !== 0,
				refueling: (pitAction & 8) !== 0,
				frontTires: (pitAction & 16) !== 0,
				rearTires: (pitAction & 32) !== 0,
				frontWing: (pitAction & 64) !== 0,
				rearWing: (pitAction & 128) !== 0,
				suspension: (pitAction & 256) !== 0
			};
			if (this.pitState === EPitState.Entered) {

				this.pitWorkingDriverChange = false;
				this.pitWorkingRefueling = false;
				this.pitWorkingFrontTires = false;
				this.pitWorkingRearTires = false;
				this.pitWorkingFrontWing = false;
				this.pitWorkingRearWing = false;
				this.pitWorkingSuspension = false;

				this.pitDone = {
					driverChange: false,
					refueling: false,
					frontTires: false,
					rearTires: false,
					frontWing: false,
					rearWing: false,
					suspension: false
				};
				if (this.inPitSince === -1) {
					this.inPitSince = nowCheck;
					this.pitEntryToStop = -1;
				}
			}
			if (this.inPitLane < 1) {
				this.inPitSince = -1;
			}
			if (r3e.data.PitMenuSelection !== -1 &&
				this.carSpeed > 1
			) {
				this.pitActionDriverChange =
					r3e.data.PitMenuState.DriverChange === 1 ? true : false;
				this.pitActionRefueling =
					r3e.data.PitMenuState.Fuel === 1 ? true : false;
				this.pitActionFrontTires =
					r3e.data.PitMenuState.FrontTires === 1 ? true : false;
				this.pitActionRearTires =
					r3e.data.PitMenuState.RearTires === 1 ? true : false;
				this.pitActionFrontWing =
					r3e.data.PitMenuState.FrontWing === 1 ? true : false;
				this.pitActionRearWing =
					r3e.data.PitMenuState.RearWing === 1 ? true : false;
				this.pitActionSuspension =
					r3e.data.PitMenuState.Suspension === 1 ? true : false;
			}

			if (this.pit.driverChange && !this.pitWorkingDriverChange) {
				this.pitWorkingDriverChange = true;
			}
			if (this.pit.refueling && !this.pitWorkingRefueling) {
				this.pitWorkingRefueling = true;
			}
			if (this.pit.frontTires && !this.pitWorkingFrontTires) {
				this.pitWorkingFrontTires = true;
			}
			if (this.pit.rearTires && !this.pitWorkingRearTires) {
				this.pitWorkingRearTires = true;
			}
			if (this.pit.frontWing && !this.pitWorkingFrontWing) {
				this.pitWorkingFrontWing = true;
			}
			if (this.pit.rearWing && !this.pitWorkingRearWing) {
				this.pitWorkingRearWing = true;
			}
			if (this.pit.suspension && !this.pitWorkingSuspension) {
				this.pitWorkingSuspension = true;
			}

			if (this.pitState === EPitState.Pitting) {
				this.pitDone = {
					driverChange: this.pitWorkingDriverChange && (pitAction & 4) === 0,
					refueling: this.pitWorkingRefueling && (pitAction & 8) === 0,
					frontTires: this.pitWorkingFrontTires && (pitAction & 16) === 0,
					rearTires: this.pitWorkingRearTires && (pitAction & 32) === 0,
					frontWing: this.pitWorkingFrontWing && (pitAction & 64) === 0,
					rearWing: this.pitWorkingRearWing && (pitAction & 128) === 0,
					suspension: this.pitWorkingSuspension && (pitAction & 256) === 0
				};
				if (this.pitEntryToStop === -1) {
					this.pitEntryToStop = (nowCheck - this.inPitSince) / 1000;
					/* showDebugMessageSmall(`Pit Entry to Stop: ${
							Math.abs(
								this.pitTotalDuration -
								Math.round(this.pitTotalDuration)
							)
						}`,
					10000);*/
				}
			}

			this.mandatoryServed = this.pitWindowStatus === 4;

			/* if (this.pitLength === -1) {
				this.pitLength = getPitlaneLength(r3e.data.LayoutId);
			}
			if (r3e.data.LapTimeBestSelf !== -1 || personalBestTime > 0) {
				this.avgSpeed = personalBestTime > 0
					?	r3e.data.LayoutLength / personalBestTime
					:	r3e.data.LayoutLength / r3e.data.LapTimeBestSelf;
				this.calculatePitTime();
			} else {
				this.avgSpeed = -1;
			}*/
		}
		/* if (this.performanceTime === -1) {
			this.performanceTime = nowCheck;
		}
		if (nowCheck !== this.performanceTime) {
			showDebugMessageSmall(
				`UpdateTime: ${
					nowCheck - this.performanceTime
				}`, 1000
			);
			this.performanceTime = nowCheck;
		}*/
		if (showAllMode) {
			this.pitWorkingDriverChange = false;
			this.pitWorkingRefueling = true;
			this.pitWorkingFrontTires = true;
			this.pitWorkingRearTires = true;
			this.pitWorkingFrontWing = true;
			this.pitWorkingRearWing = false;
			this.pitWorkingSuspension = false;
			this.pitActionDriverChange = false;
			this.pitActionRefueling = true;
			this.pitActionFrontTires = true;
			this.pitActionRearTires = true;
			this.pitActionFrontWing = true;
			this.pitActionRearWing = false;
			this.pitActionSuspension = true;
			this.pitDone = {
				driverChange: false,
				refueling: true,
				frontTires: true,
				rearTires: true,
				frontWing: false,
				rearWing: false,
				suspension: false
			};
			this.pit = {
				preparing: false,
				driverChange: false,
				refueling: false,
				frontTires: true,
				rearTires: false,
				frontWing: true,
				rearWing: false,
				suspension: false
			};
		}
	};

	private calculatePitTime() {

		this.estimatedPitTime = -1;
		this.estimatedPosPitExit = -1;
		/* const pitLimit = r3e.data.SessionPitSpeedLimit;
		const pitStopTime = this.pitTotalDuration;
		const pitDriveTime = this.pitLength / pitLimit;
		const pitTotalTime = Math.round((pitStopTime + pitDriveTime) * 1e1) / 1e1;
		showDebugMessageSmall(`Total Pit time: ${pitTotalTime}`, 100);*/
	}

	private getTimeUntilPit(lapBased = false) {
		// time based races
		return lapBased
			?	(this.pitWindowStart - this.currentLap) + 1
			:	Math.floor(this.sessionTimeRemaining / 60) -
				(
					(this.sessionTimeDuration / 60) -
					this.pitWindowStart
				) +	1;
	}

	private getTimeUntilPitClosed(lapBased = false) {
		// time based races
		return lapBased
			?	(this.pitWindowEnd - this.currentLap) + 1
			:	Math.floor(this.sessionTimeRemaining / 60) -
				(
					(this.sessionTimeDuration / 60) -
					this.pitWindowEnd
				) + 1;
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (r3e.data.GameInReplay > 0 && r3e.data.SessionTimeRemaining <= 0) { return null; }
		const invalidStartAndEnd =
			this.pitWindowStart === -1 && this.pitWindowEnd === -1;

		return (
			<div className={classNames('pitstop', this.props.className)}>
				{
					this.props.settings.subSettings.pitWindow.enabled &&
					(
						showAllMode ||
						(
							!invalidStartAndEnd &&
							this.mandatoryActive &&
							!this.mandatoryServed &&
							this.pitWindowStatus > 0 &&
							this.sessionPhase === 5 &&
							this.sessionType === 2 &&
							(
								(
									this.pitWindowStatus === 1 &&
									this.getTimeUntilPit(this.numberOfLaps !== -1) <= 3 &&
									this.getTimeUntilPit(this.numberOfLaps !== -1) >= 1
								) ||
								(
										this.pitWindowStatus <= 3 &&
										this.pitWindowStart > 1
								)
							)
						)
					)
					?
						<div className="pitInfo">
							<div
								className="inner"
								style={{
									background: showAllMode
									?	'rgba(213, 0, 0, 0.6)'
									:	this.pitWindowStatus === 2
										?	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 3
											?	'rgba(100, 221, 23, 0.6)'
											:	'rgba(213, 0, 0, 0.6)'
										:	this.getTimeUntilPit(this.numberOfLaps !== -1) <= 3 &&
											this.getTimeUntilPit(this.numberOfLaps !== -1) >= 1
											?	'rgba(213, 0, 249, 0.6)'
											:	this.pitWindowStatus === 3
												?	'rgba(0, 176, 255, 0.6)'
												:	'rgba(213, 0, 0, 0)'
								}}
							>
								<div className="title">
									{
										showAllMode
										?	_('Pit-Window\ncloses')
										:	this.pitWindowStatus === 2
											?	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 3
												?	_('Pit-Window\nopen for')
												:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 1
													?	_('Pit-Window\ncloses in')
													:	_('Pit-Window\ncloses')
											:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 0 &&
												this.getTimeUntilPit(this.numberOfLaps !== -1) < 1 &&
												this.pitWindowStatus === 3 &&
												!this.mandatoryServed
												?	_('Mandatory\nPit')
												:	this.getTimeUntilPit(this.numberOfLaps !== -1) > 1 &&
													this.getTimeUntilPit(this.numberOfLaps !== -1) <= 3
													?	_('Pit-Window\nopens in')
													:	this.getTimeUntilPit(this.numberOfLaps !== -1) === 1
														?	_('Pit-Window\nopens')
														:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) === 1
															?	_('Pit-Window\ncloses')
															:	null
									}
								</div>
								<div className="left">
									{
										showAllMode
										?	_('after this lap')
										:	this.pitWindowStatus === 2
											?	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 3
												?	_(
														`${
															this.getTimeUntilPitClosed(this.numberOfLaps !== -1)
														} ${
															this.numberOfLaps !== -1
															?	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 1
																?	_('laps')
																:	_('lap')
															:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 1
																?	_('minutes')
																:	_('minute')
														}`
													)
												:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 1
													?	_(
															`${
																this.getTimeUntilPitClosed(this.numberOfLaps !== -1)
															} ${
																this.numberOfLaps !== -1
																?	_('laps')
																:	_('minutes')
															}`
														)
													:	_(
															`${
																this.numberOfLaps !== -1
																?	_('after this lap')
																:	_('in 1 minute')
															}`
														)
											:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) > 0 &&
												this.getTimeUntilPit(this.numberOfLaps !== -1) < 1 &&
												this.pitWindowStatus === 3 &&
												!this.mandatoryServed
												?	_('In Progress')
												:	this.getTimeUntilPit(this.numberOfLaps !== -1) > 1 &&
													this.getTimeUntilPit(this.numberOfLaps !== -1) <= 3
													?	_(
															`${
																this.getTimeUntilPit(this.numberOfLaps !== -1)
															} ${
																this.numberOfLaps !== -1
																?	this.getTimeUntilPit(this.numberOfLaps !== -1) > 1
																	?	_('laps')
																	:	_('lap')
																:	this.getTimeUntilPit(this.numberOfLaps !== -1) > 1
																	?	_('minutes')
																	:	_('minute')
															}`
														)
													:	this.getTimeUntilPit(this.numberOfLaps !== -1) === 1
														?	_(
																`${
																	this.numberOfLaps !== -1
																	?	_('after this lap')
																	:	_('in 1 minute')
																}`
															)
														:	this.getTimeUntilPitClosed(this.numberOfLaps !== -1) === 1
															?	_(
																	`${
																		this.numberOfLaps !== -1
																		?	_('this lap')
																		:	_('in 1 minute')
																	}`
																)
															:	null
									}
								</div>
							</div>
						</div>
					: null
				}
				{
					(
						this.playerIsFocus &&
						!showAllMode &&
						(
							(
								this.sessionType === 2 &&
								this.pitTotalMinDuration === -1
							) ||
							(
								this.sessionType !== 2 &&
								Math.abs(
									this.pitElapsedTime -
									(
										(
											nowCheck -
											this.inPitSince
										) / 1000
									)
								) > 1
							)
						) &&
						this.pitState === EPitState.Pitting && (
							<div
								{...widgetSettings(this.props)}
								className="pitInfoFixed"
							>
								<div className="title">
									<div
										className={classNames('tasks', {
										})}
									>
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										this.pit.preparing && (
											<div className="task">
												{_('Preparing')}
											</div>
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionDriverChange &&
												!this.pitWorkingDriverChange &&
												!this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											) || (
												this.pitActionDriverChange &&
												this.pitWorkingDriverChange &&
												!this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											) || (
												this.pitActionDriverChange &&
												this.pitWorkingDriverChange &&
												this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionRefueling &&
												!this.pitWorkingRefueling &&
												!this.pitDone.refueling && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											) || (
												this.pitActionRefueling &&
												this.pitWorkingRefueling &&
												!this.pitDone.refueling && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionRefueling &&
												this.pitWorkingRefueling &&
												this.pitDone.refueling)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionFrontTires &&
												!this.pitWorkingFrontTires &&
												!this.pitDone.frontTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionFrontTires &&
												this.pitWorkingFrontTires &&
												!this.pitDone.frontTires)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											) || (
												this.pitActionFrontTires &&
												this.pitWorkingFrontTires &&
												this.pitDone.frontTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												(showAllMode ||
												(this.pitActionRearTires &&
												!this.pitWorkingRearTires &&
												!this.pitDone.rearTires)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											) || (
												this.pitActionRearTires &&
												this.pitWorkingRearTires &&
												!this.pitDone.rearTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											) || (
												this.pitActionRearTires &&
												this.pitWorkingRearTires &&
												this.pitDone.rearTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionFrontWing &&
												!this.pitWorkingFrontWing &&
												!this.pitDone.frontWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionFrontWing &&
												this.pitWorkingFrontWing &&
												!this.pitDone.frontWing)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											) || (
												this.pitActionFrontWing &&
												this.pitWorkingFrontWing &&
												this.pitDone.frontWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionRearWing &&
												!this.pitWorkingRearWing &&
												!this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											) || (
												this.pitActionRearWing &&
												this.pitWorkingRearWing &&
												!this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											) || (
												this.pitActionRearWing &&
												this.pitWorkingRearWing &&
												this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionSuspension &&
												!this.pitWorkingSuspension &&
												!this.pitDone.suspension && (
													<div className="task">
														{_('Suspension')}
													</div>
												)
											) || (
												this.pitActionSuspension &&
												this.pitWorkingSuspension &&
												!this.pitDone.suspension && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite'
														}}
													>
														{_('Suspension')}
													</div>
												)
											) || (
												this.pitActionSuspension &&
												this.pitWorkingSuspension &&
												this.pitDone.suspension && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)'
														}}
													>
														{_('Suspension')}
													</div>
												)
											)
										)}
									</div>
								</div>
								<div className="barContainer">
								<div
									className="bar"
									style={{
										width: `${
											showAllMode
											?	65
											:	this.pitTotalMinDuration > 0
												?	100 - (
														(
															(
																this.pitElapsedTime -
																this.pitEntryToStop
															) /
															(
																this.pitTotalDuration -
																this.pitEntryToStop
															)
														) *
														100
													)
												:	100 - (
														(
															this.pitElapsedTime /
															this.pitTotalDuration
														) *
														100
													)
										}%`
									}}
								/>
								</div>
								<div className="totalTime">
									{_('Pit Total')}{': '}
									<span className="mono">
										{
											formatTime(
												this.pitTotalDuration, 'm:ss'
											)
										}
									</span>
									{' '}/{' '}
									{_('Pit Remain')}:{' '}
									<span className="mono">
										{
											formatTime(
												(
													this.pitTotalDuration -
													this.pitElapsedTime
												), 'm:ss'
											)
										}
									</span>
								</div>
							</div>
						)
					)
				}
				{
					(
						showAllMode && (
							<div
								{...widgetSettings(this.props)}
								className="pitInfoFixed"
							>
								<div className="title">
									<div
										className={classNames('tasks', {
										})}
									>
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										this.pit.preparing && (
											<div className="task">
												{_('Preparing')}
											</div>
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionDriverChange &&
												!this.pitWorkingDriverChange &&
												!this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											) || (
												this.pitActionDriverChange &&
												this.pitWorkingDriverChange &&
												!this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											) || (
												this.pitActionDriverChange &&
												this.pitWorkingDriverChange &&
												this.pitDone.driverChange && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Driver Change')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionRefueling &&
												!this.pitWorkingRefueling &&
												!this.pitDone.refueling && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											) || (
												this.pitActionRefueling &&
												this.pitWorkingRefueling &&
												!this.pitDone.refueling && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionRefueling &&
												this.pitWorkingRefueling &&
												this.pitDone.refueling)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language === 'fr'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Refueling')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionFrontTires &&
												!this.pitWorkingFrontTires &&
												!this.pitDone.frontTires && (
													<div
														className="task"
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionFrontTires &&
												this.pitWorkingFrontTires &&
												!this.pitDone.frontTires)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											) || (
												this.pitActionFrontTires &&
												this.pitWorkingFrontTires &&
												this.pitDone.frontTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front tires')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												(showAllMode ||
												(this.pitActionRearTires &&
												!this.pitWorkingRearTires &&
												!this.pitDone.rearTires)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											) || (
												this.pitActionRearTires &&
												this.pitWorkingRearTires &&
												!this.pitDone.rearTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											) || (
												this.pitActionRearTires &&
												this.pitWorkingRearTires &&
												this.pitDone.rearTires && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear tires')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionFrontWing &&
												!this.pitWorkingFrontWing &&
												!this.pitDone.frontWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											) || (
												(showAllMode ||
												(this.pitActionFrontWing &&
												this.pitWorkingFrontWing &&
												!this.pitDone.frontWing)) && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											) || (
												this.pitActionFrontWing &&
												this.pitWorkingFrontWing &&
												this.pitDone.frontWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Front wing')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionRearWing &&
												!this.pitWorkingRearWing &&
												!this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											) || (
												this.pitActionRearWing &&
												this.pitWorkingRearWing &&
												!this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											) || (
												this.pitActionRearWing &&
												this.pitWorkingRearWing &&
												this.pitDone.rearWing && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)',
															padding: localStorage.language ===  'pt' ||
																localStorage.language === 'fr' || localStorage.language === 'es' || localStorage.language === 'pl'
																?	'1px 10px 13px'
																:	undefined
														}}
													>
														{_('Rear wing')}
													</div>
												)
											)
										)}
										{!this.props.settings.subSettings.pitTimeOnly.enabled &&
										!this.pit.preparing && (
											(
												this.pitActionSuspension &&
												!this.pitWorkingSuspension &&
												!this.pitDone.suspension && (
													<div className="task">
														{_('Suspension')}
													</div>
												)
											) || (
												this.pitActionSuspension &&
												this.pitWorkingSuspension &&
												!this.pitDone.suspension && (
													<div
														className={classNames('task', {
														})}
														style={{
															animation: 'blinkero 0.5s linear infinite'
														}}
													>
														{_('Suspension')}
													</div>
												)
											) || (
												this.pitActionSuspension &&
												this.pitWorkingSuspension &&
												this.pitDone.suspension && (
													<div
														className={classNames('task', {
														})}
														style={{
															border: '2px solid #fff',
															background: 'rgba(0, 230, 0, 0.7)'
														}}
													>
														{_('Suspension')}
													</div>
												)
											)
										)}
									</div>
								</div>
								<div className="barContainer">
									{
										(
											showAllMode ||
											Math.abs(
												this.pitElapsedTime -
												(
													(
														nowCheck -
														this.inPitSince
													) / 1000
												)
											) > 1
										) && (
											<div
												className="bar"
												style={{
													width: `${
														showAllMode
														?	65
														:	this.pitTotalMinDuration > 0
															?	100 - (
																	(
																		(
																			this.pitElapsedTime -
																			this.pitEntryToStop
																		) /
																		(
																			this.pitTotalDuration -
																			this.pitEntryToStop
																		)
																	) *
																	100
																)
															:	100 - (
																	(
																		this.pitElapsedTime /
																		this.pitTotalDuration
																	) *
																	100
																)
													}%`
												}}
											/>
										)
									}
								</div>
							</div>
						)
					)
				}
				{
					(
						showAllMode ||
						(
							this.sessionType === 2 &&
							this.inPitLane > 0 &&
							this.pitTotalMinDuration !== -1 &&
							this.pitLeftMinDuration >= 0 &&
							this.pitMenuStatePenalty < 1
						)
					) && (
						<div
							{...widgetSettings(this.props)}
							className="pitMinInfoFixed"
						>
							<div className="pitMinBarContainer">
								<div
									className="minBar"
									style={{
										width: `${showAllMode
											?	45
											:	100 - (
													(
														(
															this.pitTotalMinDuration -
															this.pitLeftMinDuration
														) /
														this.pitTotalMinDuration
													) *
													100
												)}%`
									}}
								/>
							</div>
							<div
								className="minPitTime"
								style={{
										color: this.pitLeftMinDuration > 0
											?	'white'
											:	'rgb(0, 255, 0)'
								}}
							>
								{`${
									(this.pitLeftMinDuration > 0 || showAllMode)
									?	_('Minimum Pit time remain')
									:	_('Minimum Pit time served!')
								}`}{`${
									(this.pitLeftMinDuration > 0 || showAllMode)
									?	': '
									:	''
								}`}
								<span className="mono">
									{showAllMode
										?	'0:35'
										:	this.pitLeftMinDuration > 0
											?	formatTime(this.pitLeftMinDuration, 'm:ss')
											:	' '
									}
								</span>
							</div>
						</div>
					)
				}
				{
					showAllMode && (
						<div className="pitMenuInfoBox">
							<div className="pitMenuInfoText">
							{_('PIT MENU APPEARS HERE')}
							</div>
						</div>
					)
				}
			</div>
		);
	}
}
