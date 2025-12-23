import { observer } from "mobx-react";
import { action, observable } from "mobx";
import {
	IWidgetSetting,
} from '../app/app';
import r3e, { registerUpdate, unregisterUpdate, nowCheck } from "../../lib/r3e";
import { widgetSettings } from "../../lib/utils";
import React from "react";
import './inputsGraph.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class InputsGraph extends React.Component<IProps> {
	private get maxHistoryMs() {
		return (this.props.settings.duration ?? 6) * 1000;
	}

	private canvasWidth = 160;
	private canvasHeight = 50;

	@observable accessor throttleHistory: { t: number; v: number }[] = [];
	@observable accessor brakeHistory: { t: number; v: number }[] = [];
	@observable accessor clutchHistory: { t: number; v: number }[] = [];
	@observable accessor sessionPhase = -1;
	@observable accessor sessionType = -1;

	constructor(props: IProps) {
		super(props);
		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.sessionType = r3e.data.SessionType;
		this.sessionPhase = r3e.data.SessionPhase;
		const now = nowCheck;
		// Parâmetro de suavização (1=sem suavizar | 0.1=curva ultra suave)
		const smoothFactor = 0.20;
		const smoothedThrottle =
			this.throttleHistory.length > 0
				? this.throttleHistory[this.throttleHistory.length - 1].v * (1 - smoothFactor) +
				r3e.data.ThrottleRaw * smoothFactor
				: r3e.data.ThrottleRaw;
		const smoothedBrake =
			this.brakeHistory.length > 0
				? this.brakeHistory[this.brakeHistory.length - 1].v * (1 - smoothFactor) +
				r3e.data.BrakeRaw * smoothFactor
				: r3e.data.BrakeRaw;
		const smoothedClutch =
			this.clutchHistory.length > 0
				? this.clutchHistory[this.clutchHistory.length - 1].v * (1 - smoothFactor) +
				r3e.data.ClutchRaw * smoothFactor
				: r3e.data.ClutchRaw;
		this.throttleHistory.push({ t: now, v: smoothedThrottle });
		this.brakeHistory.push({ t: now, v: smoothedBrake });
		this.clutchHistory.push({ t: now, v: smoothedClutch });
		// Mantém somente o tempo configurado na memória
		while (this.throttleHistory.length && now - this.throttleHistory[0].t > this.maxHistoryMs)
			this.throttleHistory.shift();
		while (this.brakeHistory.length && now - this.brakeHistory[0].t > this.maxHistoryMs)
			this.brakeHistory.shift();
		while (this.clutchHistory.length && now - this.clutchHistory[0].t > this.maxHistoryMs)
			this.clutchHistory.shift();
	};

	private renderPath(history: { t: number; v: number }[], color: string) {
		if (history.length < 2) return "";

		const now = nowCheck;
		const points = history.map(h => {
			const age = now - h.t;
			const x = this.canvasWidth - (age / this.maxHistoryMs) * this.canvasWidth;
			const y = this.canvasHeight - h.v * this.canvasHeight;
			return `${x},${y}`;
		});

		return points.join(" ");
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		return (
			<div {...widgetSettings(this.props)} className={`inputsGraph ${this.props.settings.subSettings.showInputMeters?.enabled ? "withMeters" : ""}`}>
				<div className="graphAndMeters">
					<svg
						width={this.canvasWidth}
						height={this.canvasHeight}
						style={{ overflow: "visible" }}
					>
						{/* Linha 75% (mais próxima do topo) */}
						<line
							x1={0}
							y1={this.canvasHeight * 0.25}
							x2={this.canvasWidth}
							y2={this.canvasHeight * 0.25}
							stroke="rgba(255,255,255,0.4)"
							strokeWidth="0.3"
							strokeDasharray="2 3"
						/>

						{/* Linha 50% */}
						<line
							x1={0}
							y1={this.canvasHeight / 2}
							x2={this.canvasWidth}
							y2={this.canvasHeight / 2}
							stroke="rgba(255,255,255,0.5)"
							strokeWidth="0.4"
							strokeDasharray="2 3"
						/>

						{/* Linha 25% (mais próxima do fundo) */}
						<line
							x1={0}
							y1={this.canvasHeight * 0.75}
							x2={this.canvasWidth}
							y2={this.canvasHeight * 0.75}
							stroke="rgba(255,255,255,0.4)"
							strokeWidth="0.3"
							strokeDasharray="2 3"
						/>

						{/* Brake RED */}
						{
							this.props.settings.subSettings.showInputBrake.enabled && (
								<polyline
									fill="none"
									stroke="#cd5c5c"
									strokeWidth="1.5"
									points={this.renderPath(this.brakeHistory, "red")}
								/>
							)
						}
						{/* Throttle GREEN */}
						{
							this.props.settings.subSettings.showInputThrottle.enabled && (
								<polyline
									fill="none"
									stroke="#30b65d"
									strokeWidth="1.5"
									points={this.renderPath(this.throttleHistory, "green")}
								/>
							)
						}
						{/* Clutch GRAY */}
						{
							this.props.settings.subSettings.showInputClutch.enabled && (
								<polyline
									fill="none"
									stroke="#707070"
									strokeWidth="1.5"
									points={this.renderPath(this.clutchHistory, "gray")}
								/>
							)
						}
					</svg>
				
					{/* Input Meters */}
					{this.props.settings.subSettings.showInputMeters?.enabled && (
					<div className="inputsMetersBox" style={{ height: this.canvasHeight }}>
						
						{/* Vertical Pedals (Clutch / Brake / Throttle) */}
						<div className="pedalsGroup">
							<div className="meterGroup">
								<div className="meter clutch" style={{ height: `${r3e.data.ClutchRaw * 100}%` }} />
								<div className="meterLabel">{Math.round(r3e.data.ClutchRaw * 100)}</div>
							</div>							

							<div className="meterGroup">
								<div className="meter brake" style={{ height: `${r3e.data.BrakeRaw * 100}%` }} />
								<div className="meterLabel">{Math.round(r3e.data.BrakeRaw * 100)}</div>
							</div>

							<div className="meterGroup">
								<div className="meter throttle" style={{ height: `${r3e.data.ThrottleRaw * 100}%` }} />
								<div className="meterLabel">{Math.round(r3e.data.ThrottleRaw * 100)}</div>
							</div>
						</div>

						{/* Horizontal Steering Meter */}
							<div className="steeringContainer">
								{/* Left Fill */}
								<div
									className="steeringFill left"
									style={{
										width: r3e.data.SteerInputRaw < 0 
											? `${Math.abs(r3e.data.SteerInputRaw) * 50}%` 
											: "0%"
									}}
								/>
								{/* Right Fill */}
								<div
									className="steeringFill right"
									style={{
										width: r3e.data.SteerInputRaw > 0 
											? `${r3e.data.SteerInputRaw * 50}%` 
											: "0%"
									}}
								/>
								{/* Center Marker */}
								<div className="steeringCenterMark" />
							</div>
						</div>
					)
				}
				</div>
			</div>
		);
	}
}