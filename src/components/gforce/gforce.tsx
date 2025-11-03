import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	distance2d,
	INVALID
} from '../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { ITireData } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import { times } from 'lodash-es';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './gforce.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Gforce extends React.Component<IProps, {}> {
	@observable accessor gForceHistory = [
		{
			x: 0,
			y: 0,
			z: 0
		}
	];

	@observable accessor maxGforce = 0;

	maxHistoryStates = 20;
	frameCount = 0;

	@observable accessor wheelGrip: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};

	@observable accessor lastCheck = 0;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

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
				nowCheck - this.lastCheck >= 16
			) ||
			(
				lowPerformanceMode &&
				nowCheck - this.lastCheck >= 133
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			)
		) {
			this.lastCheck = nowCheck;
			this.playerIsFocus = ePlayerIsFocus;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.wheelGrip = r3e.data.TireGrip;

			const newNode = {
				x: r3e.data.Player.LocalGforce.X * -1,
				y: r3e.data.Player.LocalGforce.Z,
				z: 0
			};

			const distance = distance2d(0, 0, newNode.x, newNode.y);
			this.maxGforce = Math.min(
				5,
				Math.ceil(Math.max(this.maxGforce, distance))
			);

			// Only add to history every so often
			if (this.frameCount > 5) {
				this.frameCount = 0;
				this.gForceHistory.push(newNode);
				if (this.gForceHistory.length > this.maxHistoryStates) {
					this.gForceHistory = this.gForceHistory.slice(1);
				}
				// Always update the last not to keep it current
			} else {
				this.gForceHistory[this.gForceHistory.length - 1] = newNode;
			}

			if (!lowPerformanceMode) {
				this.frameCount += 1;
			} else {
				this.frameCount += 10;
			}
		}
	};

	private getPointPosition = (point: { x: number; y: number }, i: number) => {
		const maxGforce = this.maxGforce;
		const x = 50 - (Math.min(maxGforce, point.x) / maxGforce) * 50;
		const y = 50 - (Math.min(maxGforce, point.y) / maxGforce) * 50;
		const opacity = (i + 1) / this.maxHistoryStates;
		return {
			opacity: opacity === 1 ? 1 : opacity / 4,
			top: isNaN(y) ? 50 : y,
			left: isNaN(x) ? 50 : x
		};
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			(
				this.sessionPhase === INVALID ||
				!this.playerIsFocus ||
				r3e.data.ControlType !== 0
			) && !showAllMode
		) {
			return null;
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('gforce', this.props.className)}
			>
				<div className="line-vertical line-top" />
				<div className="line-vertical line-bottom" />
				<div className="line-horizontal line-right" />
				<div className="line-horizontal line-left" />
				{times(this.maxGforce).map((i: number) => {
					const step = 100 / this.maxGforce;
					const size = step * (i + 1);
					return (
						<div
							key={size}
							className="ring"
							style={{
								width: `${size}%`,
								height: `${size}%`
							}}
						/>
					);
				})}
				<div className="letter">{`${'G'}`}</div>
				{this.gForceHistory.map((point, i) => {
					return (
						<div
							key={i}
							className="point"
							style={this.getPointPosition(point, i)}
						/>
					);
				})}
				<div
					className="gripLevel fl"
					style={{
						opacity: 1 - this.wheelGrip.FrontLeft
					}}
				/>
				<div
					className="gripLevel fr"
					style={{
						opacity: 1 - this.wheelGrip.FrontRight
					}}
				/>
				<div
					className="gripLevel rl"
					style={{
						opacity: 1 - this.wheelGrip.RearLeft
					}}
				/>
				<div
					className="gripLevel rr"
					style={{
						opacity: 1 - this.wheelGrip.RearRight
					}}
				/>
			</div>
		);
	}
}
