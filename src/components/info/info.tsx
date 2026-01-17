import {
	classNames,
	ePlayerIsFocus,
	INVALID,
	showDebugMessageSmall,
	// showDebugMessage,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	eIsLeaderboard,
	eIsHillClimb,
	eIsHyperCar,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { ESession, ICutTrackPenalties } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import _ from './../../translate';
import getPitEntrance from './../../lib/trackDetails';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './info.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Info extends React.Component<IProps, {}> {
	@observable accessor currentLapValid = INVALID;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor completedLaps = 0;
	@observable accessor lapTimeBestSelf = INVALID;
	@observable accessor penaltyLap = -1;
	@observable accessor maxIncidentPoints = -1;
	@observable accessor myIncidentPoints = -1;
	@observable accessor showIncidentsUntil = -1;
	@observable accessor penalties: ICutTrackPenalties = {
		DriveThrough: 0,
		StopAndGo: 0,
		PitStop: 0,
		TimeDeduction: 0,
		SlowDown: 0
	};
	@observable accessor eValues: { [key: string]: number }  = {
		PitLimiter: -99,
		TractionControl: -99,
		BrakeBias: -99,
		Abs: -99,
		EngineMap: -99,
		HeadLights: -99,
		WaterLeft: -99
	};
	@observable accessor eTimes: { [key: string]: number } = {
		PitRequest: -1,
		PitLimiter: -1,
		TractionControl: -1,
		BrakeBias: -1,
		Abs: -1,
		EngineMap: -1,
		HeadLights: -1,
		WaterLeft: -1
	};
	eTexts: { [key: string]: string }  = {
		PitRequest: _('Pit-Stop requested'),
		PitLimiter: _('Pit limiter'),
		TractionControl: _('Traction Control:'),
		BrakeBias: _('Brake Bias:'),
		Abs: ('ABS:'),
		EngineMap: _('Engine Map:'),
		HeadLights: _('HeadLights:'),
		WaterLeft: _('Remaining Water:')
	};
	@observable accessor penaltyTimes: ICutTrackPenalties = {
		DriveThrough: 0,
		StopAndGo: 0,
		PitStop: 0,
		TimeDeduction: 0,
		SlowDown: 0,
	};
	// Declara o timer para cumprir slowdown
	slowDownStartTime = 0; // slowdown start timestamp
	slowDownRemaining = 60; // slowdown timer seconds to countdown	
	slowDownPaused = false; // pause countdown
	slowDownPauseTime = 0;	
	penaltyTexts: { [key: string]: string } = {
	DriveThrough: _('Drive Through Penalty'),
	StopAndGo: _('Stop And Go Penalty'),
	PitStop: _('Pit Stop Penalty'),
	TimeDeduction: _('Time Deduction Penalty'),
	SlowDown: _('Slow Down Penalty')
	};
	@observable accessor penaltyLaps = {
		DriveThrough: -1,
		StopAndGo: -1
	};
	@observable accessor notInRace = false;
	@observable accessor hasValidLap = true;
	@observable accessor showLapInvalid = true;
	@observable accessor showNextLapInvalid = false;
	@observable accessor lastCheck = 0;
	@observable accessor playerIsFocus = false;
	@observable accessor isLeaderboard = false;
	@observable accessor isHillClimb = false;
	@observable accessor lapDistance = -1;
	@observable accessor pitEntrance = -1;
	@observable accessor pitDistance = -1;

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
				nowCheck - this.lastCheck >= 33
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastCheck >= 266
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			)
		) {
			this.lastCheck = nowCheck;
			this.playerIsFocus = ePlayerIsFocus;
			this.currentLapValid = r3e.data.CurrentLapValid;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.isLeaderboard = eIsLeaderboard;
			this.isHillClimb = eIsHillClimb;
			this.penalties = showAllMode
				?	{
						DriveThrough: 1,
						StopAndGo: 0,
						PitStop: 0,
						TimeDeduction: 0,
						SlowDown: 0
					}
				:	r3e.data.Penalties;
			// Corrige comportamento DriveThrough: RaceRoom envia 0=ativo, -1=inativo
			if (this.penalties && this.penalties.DriveThrough !== undefined) {
				this.penalties.DriveThrough = this.penalties.DriveThrough === 0 ? 1 : 0;
			}	
			this.completedLaps = r3e.data.CompletedLaps;
			this.lapTimeBestSelf = r3e.data.LapTimeBestSelf;
			this.notInRace = this.sessionType !== ESession.Race;
			this.hasValidLap =
			(
				this.currentLapValid > 0 &&
				(
					this.completedLaps > 0 ||
					this.isLeaderboard ||
					r3e.data.LapValidState === 0
				)
			) ||
			(
				this.sessionType === ESession.Qualify &&
				this.lapTimeBestSelf === INVALID
			) ||
			this.isHillClimb;
			this.showLapInvalid = this.notInRace && !this.hasValidLap;
			this.showNextLapInvalid = this.notInRace && r3e.data.LapValidState === 2;
			this.lapDistance = r3e.data.LapDistance;
			this.pitEntrance = getPitEntrance(r3e.data.TrackId, r3e.data.LayoutId);
			this.pitDistance = this.lapDistance > this.pitEntrance
				? Math.ceil(this.pitEntrance + (r3e.data.LayoutLength - this.lapDistance))
				: Math.ceil(this.pitEntrance - this.lapDistance);

			if (
				this.penalties.DriveThrough > 0 &&
				this.penaltyLaps.DriveThrough === -1
			) {
				this.penaltyLaps.DriveThrough = this.completedLaps;
			}
			if (
				this.penaltyLaps.DriveThrough !== -1 &&
				this.penalties.DriveThrough <= 0
			) {
				this.penaltyLaps.DriveThrough = -1;
			}
			if (
				this.penalties.StopAndGo > 0 &&
				this.penaltyLaps.StopAndGo === -1
			) {
				this.penaltyLaps.StopAndGo = this.completedLaps;
			}
			if (
				this.penaltyLaps.StopAndGo !== -1 &&
				this.penalties.StopAndGo <= 0
			) {
				this.penaltyLaps.StopAndGo = -1;
			}

			if (
				this.penalties.DriveThrough > 0 &&
				this.penaltyTimes.DriveThrough === 0
			) {
				this.penaltyTimes.DriveThrough =
					showAllMode
					?	1
					:	r3e.data.DriverData[r3e.data.Position - 1].PenaltyReason;
			}
			if (
				this.penalties.DriveThrough <= 0 &&
				this.penaltyTimes.DriveThrough !== 0
			) {
				this.penaltyTimes.DriveThrough = 0;
			}
			if (
				this.penalties.StopAndGo > 0 &&
				this.penaltyTimes.StopAndGo === 0
			) {
				this.penaltyTimes.StopAndGo =
					r3e.data.DriverData[r3e.data.Position - 1].PenaltyReason;
			}
			if (
				this.penalties.StopAndGo <= 0 &&
				this.penaltyTimes.StopAndGo !== 0
			) {
				this.penaltyTimes.StopAndGo = 0;
			}
			if (
				this.penalties.PitStop > 0 &&
				this.penaltyTimes.PitStop === 0
			) {
				this.penaltyTimes.PitStop =
					r3e.data.DriverData[r3e.data.Position - 1].PenaltyReason;
			}
			if (
				this.penalties.PitStop <= 0 &&
				this.penaltyTimes.PitStop !== 0
			) {
				this.penaltyTimes.PitStop = 0;
			}
			if (
				this.penalties.TimeDeduction > 0 &&
				this.penaltyTimes.TimeDeduction === 0
			) {
				this.penaltyTimes.TimeDeduction =
					r3e.data.DriverData[r3e.data.Position - 1].PenaltyReason;
			}
			if (
				this.penalties.TimeDeduction <= 0 &&
				this.penaltyTimes.TimeDeduction !== 0
			) {
				this.penaltyTimes.TimeDeduction = 0;
			}
			if (
				this.penalties.SlowDown > 0 &&
				this.penaltyTimes.SlowDown === 0
			) {
				this.penaltyTimes.SlowDown =
					r3e.data.DriverData[r3e.data.Position - 1].PenaltyReason;
			}
			if (
				this.penalties.SlowDown <= 0 &&
				this.penaltyTimes.SlowDown !== 0
			) {
				this.penaltyTimes.SlowDown = 0;
			}

			// Atualiza status do SlowDown (60s)
			// RaceRoom envia SlowDown = -1 quando inativo
			if (r3e?.data?.Penalties?.SlowDown !== -1) {
				// Se o timer ainda não foi iniciado
				if (!this.slowDownStartTime) {
					this.slowDownStartTime = Date.now();
					this.slowDownRemaining = 60;
					this.slowDownPaused = false;
					this.slowDownPauseTime = 0;
				} else {
					// Se o jogador entrou no pitlane → pausa o timer
					if (r3e?.data?.InPitlane === 1) {
						if (!this.slowDownPaused) {
							this.slowDownPaused = true;
							this.slowDownPauseTime = Date.now();
						}
					}
					// Caso contrário, retoma o timer, ajustando o tempo pausado
					else {
						if (this.slowDownPaused) {
							this.slowDownPaused = false;
							this.slowDownStartTime += Date.now() - this.slowDownPauseTime;
						}
					}
					// Atualiza o tempo restante apenas se não estiver pausado
					if (!this.slowDownPaused) {
						this.slowDownRemaining = Math.max(
							0,
							60 - (Date.now() - this.slowDownStartTime) / 1000
						);
					}
				}
			} else {
				// SlowDown inativo → reseta tudo
				this.slowDownStartTime = 0;
				this.slowDownRemaining = 60;
				this.slowDownPaused = false;
			}

			// Electronic Changes
			this.eTimes.PitRequest = r3e.data.PitState === 1 &&	r3e.data.InPitlane < 1	? nowCheck + 1000 :	0;
			const tControl = r3e.data.TractionControlSetting;
			if (
				 tControl !== this.eValues.TractionControl || showAllMode
			) {
				if (this.eValues.TractionControl !== -99) {
					this.eTimes.TractionControl = nowCheck + 5000;
				}
				this.eValues.TractionControl = showAllMode
				?	3
				:	tControl;
			}

			if (!eIsHyperCar || r3e.data.BrakeRaw === 0) {
				const bBias = Math.round((100 - 100 * r3e.data.BrakeBias)*10) / 10;
				if (
					bBias !== this.eValues.BrakeBias
				) {
					if (this.eValues.BrakeBias !== -99) {
						this.eTimes.BrakeBias = nowCheck + 5000;
					}
					this.eValues.BrakeBias = bBias;
				}
			}

			const abs = r3e.data.AbsSetting;
			if (
				 abs !== this.eValues.Abs
			) {
				if (this.eValues.Abs !== -99) {
					this.eTimes.Abs = nowCheck + 5000;
				}
				this.eValues.Abs = abs;
			}

			const waterLeft = Math.round((r3e.data.WaterLeft)*10)/10;
			if (
				 waterLeft !== this.eValues.WaterLeft
			) {
				if (this.eValues.WaterLeft !== -99) {
					this.eTimes.WaterLeft = nowCheck + 5000;
				}
				this.eValues.WaterLeft = waterLeft;
			}

			const pitLimiter = r3e.data.PitLimiter;
			// Liga o aviso enquanto PitLimiter estiver ativo
			if (pitLimiter === 1) {
				if (this.eValues.PitLimiter !== 1) {
					// Ativou agora → mostra imediatamente
					this.eTimes.PitLimiter = Infinity; // Fica sempre visível
				}
			} else {
				// Desligou → some imediatamente
				this.eTimes.PitLimiter = 0;
			}
			this.eValues.PitLimiter = pitLimiter;


			let headLights: any = r3e.data.HeadLights;
			switch (headLights) {
				case 0:
					headLights = "Off";
					break;
				case 1:
					headLights = "On";
					break;
				case 2:
					headLights = "Flash";
					break;
			}
			if (
				 headLights !== this.eValues.HeadLights
			) {
				if (this.eValues.HeadLights !== -99) {
					this.eTimes.HeadLights = nowCheck + 5000;
				}
				this.eValues.HeadLights = headLights;
			}

			const eMap = r3e.data.EngineMapSetting;
			if (
				 eMap !== this.eValues.EngineMap
			) {
				if (this.eValues.EngineMap !== -99) {
					this.eTimes.EngineMap = nowCheck + 5000;
				}
				this.eValues.EngineMap = eMap;
			}
			this.maxIncidentPoints = r3e.data.MaxIncidentPoints !== undefined
				?	r3e.data.MaxIncidentPoints
				:	-1;
			if (r3e.data.IncidentPoints && r3e.data.IncidentPoints !== this.myIncidentPoints) {
				this.myIncidentPoints = r3e.data.IncidentPoints;
				this.showIncidentsUntil = nowCheck + 5000;
			}
		}
	};

	private getPenaltyReason(pType: string, pReason: number) {
		let reasonText = '';
		switch (pType) {
			case 'DriveThrough':
				switch (pReason) {
					case 1:
						reasonText =
							_('Reason: Track Limits Abuse');
						break;
					case 2:
						reasonText =
							_('Reason: Speeding in the Pitlane');
						break;
					case 3:
						reasonText =
							_('Reason: False Start');
						break;
					case 4:
						reasonText =
							_('Reason: Ignoring Blue Flags');
						break;
					case 5:
						reasonText =
							_('Reason: Driving too slow');
						break;
					case 6:
						reasonText =
							_('Reason: Illegally Passing before Green');
						break;
					case 7:
						reasonText =
							_('Reason: Illegally Passing before the Finish');
						break;
					case 8:
						reasonText =
							_('Reason: Illegally Passing before the Pit Entrance');
						break;
					case 9:
						reasonText =
							_('Reason: Ignoring Slow Down Warnings');
						break;
					case 10:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				break;
			case 'StopAndGo':
				switch (pReason) {
					case 2:
						reasonText =
							_('Reason: Track Limits Abuse');
						break;
					case 3:
						reasonText =
							_('Reason: Overtaking under Yellow');
						break;
					case 4:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				break;
			case 'PitStop':
				switch (pReason) {
					case 1:
						reasonText =
							_('Reason: Ignoring Mandatory Pit-Stop');
						break;
					case 2:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				break;
			case 'TimeDeduction':
				switch (pReason) {
					case 1:
						reasonText =
							_('Reason: Mandatory Pit-Stop taken outside Pit-Window');
						break;
					case 2:
						reasonText =
							_('Reason: Ignoring the minimum Pit-Stop duration');
						break;
					case 3:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				break;
			case 'SlowDown':
				switch (pReason) {
					case 1:
						reasonText =
							_('Reason: Track Limits Abuse');
						break;
					case 2:
						reasonText =
							_('Reason: Multiple Track Limit Abuse');
						break;
					case 3:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				// Mostra o tempo para devolver (give back)
				if (r3e?.data?.Penalties?.SlowDown && r3e.data.Penalties.SlowDown > 0) {
				reasonText += ` (${r3e.data.Penalties.SlowDown.toFixed(2)}s.) | `;
				}
				// Mostra o temporizador de 60s
				if (this.slowDownStartTime) {
				reasonText += `${_('Serve within')} ${this.slowDownRemaining.toFixed(0)}s.`;
				}
				break;
			case 'Disqualify':
				switch (pReason) {
					case 0:
						reasonText =
							_('Reason: False Start');
						break;
					case 1:
						reasonText =
							_('Reason: Speeding in the Pitlane');
						break;
					case 2:
						reasonText =
							_('Reason: Driving the wrong Way');
						break;
					case 3:
						reasonText =
							_('Reason: Entering Pit under Red');
						break;
					case 4:
						reasonText =
							_('Reason: Exiting Pits under Red');
						break;
					case 5:
						reasonText =
							_('Reason: Ignoring the Driver Change');
						break;
					case 6:
						reasonText =
							_('Reason: Multiple Drive Through Penalties in 1 Lap');
						break;
					case 8:
						reasonText =
							_('Reason: Ignoring Drive Through Penalty');
						break;
					case 9:
						reasonText =
							_('Reason: Ignoring Stop and Go Penalty');
						break;
					case 10:
						reasonText =
							_('Reason: Ignoring Pit-Stop Penalty');
						break;
					case 11:
						reasonText =
							_('Reason: Ignoring Time Penalty');
						break;
					case 12:
						reasonText =
							_('Reason: Excessive Cutting of the Track');
						break;
					case 13:
						reasonText =
							_('Reason: Ignoring Blue Flags');
						break;
					case 14:
						reasonText =
							_('Reason: Accumulating the Maximum Number of Penalties Permitted');
						break;
				}
				break;
		}
		return reasonText;
	}

	private formatPenaltyText(penaltyKey: string): string {
		const baseText =
			this.penaltyTexts[penaltyKey] || penaltyKey;

		const reason =
			this.getPenaltyReason(
				penaltyKey,
				this.penaltyTimes[penaltyKey]
			);

		if (penaltyKey !== 'DriveThrough' && penaltyKey !== 'StopAndGo') {
			return `${baseText}\n${reason}`;
		}

		const lapsLeft =
			(this.penaltyLaps[penaltyKey] + 3) - this.completedLaps;

		const serveText =
			lapsLeft > 1 ? _('Serve within') : _('Serve');

		const lapText =
			lapsLeft > 1
				? `${lapsLeft} ${_('laps')}`
				: _('this lap');

		return `${baseText}\n${reason}\n${serveText} ${lapText}`;
	}

	render() {
		const isGoing = r3e.data.CarSpeed > 3 && r3e.data.CarSpeed.toString().indexOf('E') === -1;
		const showIncPoints =
			showAllMode ||
			(
				this.playerIsFocus &&
				this.maxIncidentPoints > 0 &&
				this.showIncidentsUntil >= nowCheck &&
				this.sessionType !== 0 &&
				this.sessionType !== 3
			);
		const warnInc =
			showIncPoints &&
			this.myIncidentPoints >= (this.maxIncidentPoints * 0.9);

		const isCountdown =
			this.sessionType === ESession.Race &&
			this.sessionPhase === 1;

		const isPlayerActive =
			this.playerIsFocus || isCountdown;

		return (
			<div
				className={classNames('info', this.props.className)}
				{...widgetSettings(this.props)}
				>
				{Object.keys(this.penalties)
					.filter((penaltyKey) => this.penalties[penaltyKey] > 0)
					.map((penaltyKey) => {
					if (!isPlayerActive) return null;
					return (
						<div key={penaltyKey} className="warning">
						<span className="icon">
							<SvgIcon src={require('./../../img/icons/warning.svg')} />
						</span>
						<span className="text">
							{this.formatPenaltyText(penaltyKey)}
						</span>
						</div>
					);
					})}

				{(this.showLapInvalid || showAllMode) && (
					<div className="warning">
					<span className="icon">
						<SvgIcon src={require('./../../img/icons/warning.svg')} />
					</span>
					<span className="text">
						{_('This lap will not count')}
					</span>
					</div>
				)}

				{(this.showNextLapInvalid || showAllMode) && (
					<div className="warning">
					<span className="icon">
						<SvgIcon src={require('./../../img/icons/warning.svg')} />
					</span>
					<span className="text">
						{_('Next lap will not count')}
					</span>
					</div>
				)}

				{Object.keys(this.eTimes)
					.filter((eKey) => this.eTimes[eKey] >= nowCheck)
					.map((eKey) => {
					if (!isPlayerActive) return null;
					return (
						<div key={eKey} className="warning">
						<span className="icon">
							<SvgIcon src={require('./../../img/icons/info.svg')} />
						</span>
						<span className="text">
							{eKey === 'PitRequest'
							? this.pitDistance <= 500
								? `${_('Pit-Stop requested - Pit In')}: ${this.pitDistance}m`
								: `${_('Pit-Stop requested - Pit In')}`
							: eKey === 'PitLimiter'
								? this.eTexts[eKey]
								: eKey === 'TractionControl' && (isGoing || showAllMode)
								? <span>
									{this.eTexts[eKey]}{' '}
									<span className="value">
										{this.eValues[eKey]} [{showAllMode ? 60 : Math.round(r3e.data.TractionControlPercent)}%]
									</span>
								</span>
								: eKey === 'WaterLeft'
									? <span>
										{this.eTexts[eKey]}{' '}
										<span className="value">
											{this.eValues[eKey]}{eKey === 'WaterLeft' ? ' L' : ''}
										</span>
									</span>
									: <span>
										{this.eTexts[eKey]}{' '}
										<span className="value">
											{this.eValues[eKey]}{eKey === 'BrakeBias' ? '%' : ''}
										</span>
									</span>
							}
						</span>
						</div>
					);
					})}

				{showIncPoints && (
					<div
					className="warning"
					style={{
						color: warnInc ? 'rgb(255,0,0)' : 'rgb(255,255,255)'
					}}
					>
					<span className="icon">
						<SvgIcon
						src={
							warnInc
							? require('./../../img/icons/warning.svg')
							: require('./../../img/icons/info.svg')
						}
						/>
					</span>
					<span className="text">
						{_('Incidents')}{': '}
						<span className="value"> 
							{showAllMode ? 135 : this.myIncidentPoints === -1 ? 0 : this.myIncidentPoints
							} / {showAllMode ? 200 : this.maxIncidentPoints}
						</span>
					</span>
					</div>
				)}
			</div>
		);
	}
}
