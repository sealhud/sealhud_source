import {
	classNames,
	distance2d,
	mpsToKph,
	mpsToMph,
	// showDebugMessageSmall,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	speedInKPH,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from './../../translate';
import getPitBoxSpot from './../../lib/pitBoxData';
import getPitEntrance from './../../lib/trackDetails';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './pitLimiter.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

interface IPosVec {
	X: number;
	Y: number;
	Z: number;
}

@observer
export default class PitLimiter extends React.Component<IProps, {}> {
	@observable accessor inPitLane = 0;
	@observable accessor pitlaneMax = 0;
	@observable accessor speed = 0;
	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor speedKPH = speedInKPH || false;
	@observable accessor lapDistance = -1;
	@observable accessor pitEntrance = -1;
	@observable accessor pitDistance = -1;
	@observable accessor pitState = -1;
	@observable accessor pitMenuSelection = -1;
	@observable accessor nowPos: IPosVec = {
		X: -1,
		Y: -1,
		Z: -1
	};
	@observable accessor lastPos: IPosVec = {
		X: -1,
		Y: -1,
		Z: -1
	};
	@observable accessor pitBoxSpotPos: IPosVec = {
		X: -1,
		Y: -1,
		Z: -1
	};
	@observable accessor pitMaxDistance = -1;
	@observable accessor pitBoxSpotDistance = -1;
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
				nowCheck - this.lastCheck >= 133
			) ||
			(
				!lowPerformanceMode &&
				!highPerformanceMode &&
				nowCheck - this.lastCheck >= 66
			)
		) {
			this.lastCheck = nowCheck;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			this.inPitLane = r3e.data.InPitlane;
			this.lapDistance = r3e.data.LapDistance;
			this.speedKPH = speedInKPH;
			this.pitState = r3e.data.PitState;
			if (this.pitState === 1) {
				this.pitEntrance = getPitEntrance(r3e.data.TrackId, r3e.data.LayoutId);
				this.pitDistance =
					this.lapDistance > this.pitEntrance
					?	Math.ceil(this.pitEntrance + (r3e.data.LayoutLength - this.lapDistance))
					:	Math.ceil(this.pitEntrance - this.lapDistance);
				this.speed = !this.speedKPH ? mpsToMph(r3e.data.CarSpeed) : mpsToKph(r3e.data.CarSpeed);
				this.pitlaneMax = !this.speedKPH ? mpsToMph(r3e.data.SessionPitSpeedLimit) : mpsToKph(r3e.data.SessionPitSpeedLimit);
			}
			if (this.inPitLane < 1 && this.pitMaxDistance !== -1) {
				this.pitMaxDistance = -1;
			}
			if (this.inPitLane) {
				this.pitMenuSelection = r3e.data.PitMenuSelection;
				this.speed = !this.speedKPH ? mpsToMph(r3e.data.CarSpeed) : mpsToKph(r3e.data.CarSpeed);
				this.pitlaneMax = !this.speedKPH ? mpsToMph(r3e.data.SessionPitSpeedLimit) : mpsToKph(r3e.data.SessionPitSpeedLimit);
				if (this.pitState === 2 && this.pitMenuSelection !== 1) {
					this.nowPos = r3e.data.CarCgLocation;
					this.pitBoxSpotPos = getPitBoxSpot(r3e.data.LayoutId, r3e.data.VehicleInfo.SlotId);
					this.pitBoxSpotDistance = distance2d(
						this.nowPos.X * -1,
						this.nowPos.Z,
						this.pitBoxSpotPos.X * -1,
						this.pitBoxSpotPos.Z
					);
					if (this.pitMaxDistance === -1) {
						this.pitMaxDistance = this.pitBoxSpotDistance;
					}
				}
			}
		}
	};

	getBarWidth = (minus = false) => {
		// this.currentDifference
		let proc = Math.min(
			((this.pitBoxSpotDistance / this.pitMaxDistance) * 100) + 2,
			90
		);
		if (minus) { proc -= 1; }
		return `${showAllMode
			?	90
			:	proc}%`;
	};
	getGreenWidth = () => {
		const proc = Math.min(
			((4 / this.pitMaxDistance) * 100) + 2,
			10
		);
		return `${showAllMode
			?	5
			:	proc}%`;
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (
			this.inPitLane !== 1 &&
			this.pitState !== 1 &&
			!showAllMode
		) {
			return null;
		}
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('pitLimiter', this.props.className, {
					warning: showAllMode || this.speed > this.pitlaneMax + 1,
					shouldShow:
						showAllMode ||
						(
							this.inPitLane === 1 &&
							this.speed >= 1
						) ||
						(
							this.inPitLane < 1 &&
							this.pitState === 1 &&
							this.pitDistance <= 250 &&
							this.speed >= 1
						)
				})}
			>
				<div className="max">
					<div className="label">
						{_('In Pit Lane')}
					</div>

					<div className="speedSign">
						<div className="speedValue mono">
							{this.pitlaneMax.toFixed(0)}
						</div>
						<div className="speedUnit">
							{
								!this.speedKPH
								? 'mph'
								: 'km/h'
							}
						</div>
					</div>
				</div>
				<div className="current">
					{_('Current speed')}:{' '}
					<span className="mono">{showAllMode
						?	(this.pitlaneMax + 1).toFixed(0)
						:	this.speed.toFixed(0)}</span>{' '}
					{
						`${
							!this.speedKPH
							?	'mph'
							:	'km/h'
						}`
					}
				</div>
				{
					(
						showAllMode ||
						(
							this.inPitLane < 1 &&
							this.pitState === 1 &&
							this.pitDistance <= 250 &&
							this.speed >= 1
						)
					) &&
					(
						<div
							className="boxEntranceDistance"
							style={{
								padding: '5px'
							}}
						>
							{_('Pit-Entrance')}:{' '}
							<span className="mono">
								{
									showAllMode
									?	123
									:	this.pitDistance
								}
							</span>
							{`${'m'}`}
						</div>
					)
				}
				{
					(
						showAllMode ||
						this.pitState === 2
					) &&
					(
						<div
							className="spotDistance"
						>
							{_('Pit-Spot in')}:{' '}
							<span className="mono">
								{
									showAllMode
									?	200
									:	this.pitBoxSpotDistance >= 1
										?	Math.floor(this.pitBoxSpotDistance)
										:	0
								}
							</span>
							{`${'m'}`}
						</div>
					)
				}
				{
					(
						showAllMode ||
						this.pitState === 2
					) &&
					(
						<div
							className="DistBar"
							style={{
								display: 'block',
								width: '110%',
								height: '11px',
								left: '50%',
								transform: 'translate(-50%, 0)',
								top: '5px',
								backgroundColor: 'rgba(0, 0, 0, 0)',
								overflow: 'hidden',
								position: 'relative'
							}}
						>
							<div
								className="FullDistBar"
								style={{
									display: 'block',
									width: this.getBarWidth(true),
									height: '1px',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									backgroundColor: '#202020',
									overflow: 'hidden',
									position: 'relative',
								}}
							/>
							<div
								className="GreenDistBar"
								style={{
									display: 'block',
									width: this.getGreenWidth(),
									height: '9px',
									borderRadius: '3px',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									backgroundColor: 'rgb(19, 19, 19)',
									overflow: 'hidden',
									position: 'absolute'
								}}
							/>
							<div
								className="MovingBlocks"
								style={{
									display: 'block',
									borderRight: '1px solid #202020',
									borderLeft: '1px solid #202020',
									borderRadius: '0px',
									width: this.getBarWidth(),
									height: '5px',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									backgroundColor: 'rgba(255, 255, 255, 0)',
									overflow: 'hidden',
									position: 'absolute'
								}}
							/>
						</div>
					)
				}
			</div>
		);
	}
}
