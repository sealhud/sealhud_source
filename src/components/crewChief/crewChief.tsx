import {
	classNames,
	widgetSettings,
	getInitials,
	base64ToString,
	getRankingData,
	rankData	
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, { registerUpdate, nowCheck, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import ReconnectingWebSocket from '../../lib/reconnecting-websocket';
import './crewChief.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class CrewChief extends React.Component<IProps, {}> {
	@observable accessor driverName = '';
	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor isActive = false;
	@observable accessor teamName: string | null = null;
	pingInterval: any;

	cachedNames: any = {};
	ws: ReconnectingWebSocket;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

		this.ws = new ReconnectingWebSocket('ws://localhost:8071/crewchief');
		this.ws.reconnectInterval = 10000;
		this.ws.onmessage = (e) => {
			const data: {
				channelOpen: boolean;
			} = JSON.parse(e.data);
			this.setActive(data.channelOpen);
		};

		this.pingInterval = setInterval(() => {
			// Each time we send the server a message it will respond with the data
			if (this.ws.readyState !== WebSocket.OPEN) {
				return;
			}
			this.ws.send('');
		}, 133);
	}

	componentWillUnmount() {
		this.ws.close();
		clearInterval(this.pingInterval);
		unregisterUpdate(this.update);
	}

	formatName(name: string) {
		if (this.cachedNames[name]) {
			return this.cachedNames[name];
		}
		this.cachedNames[name] = name
			.toString()
			.replace(/(.)[^ ]*? (.*)/, '$1. $2');
		return this.cachedNames[name];
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
			if (
				this.driverName === '' &&
				r3e.data.BrakeRaw !== -1 &&
				r3e.data.DriverData[r3e.data.Position - 1] !== undefined
			) {
				this.driverName = getInitials(
					base64ToString(
						r3e.data.DriverData[r3e.data.Position - 1]
						.DriverInfo.Name
					)
				);
			}

			// já pegou o team? não faz mais nada
			if (this.teamName !== null) return;

			const driver =
				r3e.data.DriverData[r3e.data.Position - 1];

			if (!driver) return;

			const userId = driver.DriverInfo.UserId;
			if (userId === -1) return;

			// ranking ainda não carregou
			if (rankData.length === 0) return;

			const ranking = getRankingData(userId);

			if (ranking.Team !== 'none') {
				this.teamName = ranking.Team;
			}
		}
	};

	@action
	private setActive = (active: boolean) => {
		this.isActive = active;
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if ((!this.isActive || r3e.data.GameInReplay > 0) && !showAllMode) {
			return null;
		}

		return (
			<div
			{...widgetSettings(this.props)}
			className={classNames('crewChief', this.props.className, 'enter')}
			>
			<div className="accentBar" />

			<div className="driverName">
				{showAllMode ? 'S. BELLOF' : this.driverName}
			</div>

			<div className="waveContainer">
				<img
				className="waveForm"
				src={require('./../../img/radio.gif')}
				/>
			</div>

			<div className="meta">
				{this.teamName ?? _('Team Radio')}
			</div>
			</div>
		);
	}
}
