import {
	base64ToString,
	classNames,
	distance2d,
	ePlayerIsFocus,
	eCurrentSlotId,
	mpsToKph,
	showDebugMessageSmall,
	toDegrees,
	widgetSettings,
	INVALID,
	getClassColor
} from '../../lib/utils';
import {
	IWidgetSetting,
	eIsLeaderboard,
	eIsHillClimb,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { IDriverData } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from '../../lib/r3e';
import React from 'react';
import './spotting.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

interface IDriver {
	x: number;
	y: number;
	distance: number;
	slot: number;
	isUser: boolean;
	isClose: boolean;
	isFront: boolean;
	name: string;
	angle: number;
	classPerformanceIndex: number;
}

interface IWarning {
	slot: number;
	name: string;
	distance: number;
}

interface IWarnings {
	left: IWarning;
	right: IWarning;
}

@observer
export default class Spotting extends React.Component<IProps, {}> {
	@observable accessor drivers: IDriver[] = [];

	@observable accessor speed = 0;

	@observable accessor startLights = -1;

	@observable accessor controlType = INVALID;

	@observable accessor warning: IWarnings = {
		left: { slot: INVALID, name: '', distance: 0 },
		right: { slot: INVALID, name: '', distance: 0 }
	};

	@observable accessor lastCheck = 0;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	@observable accessor notInRacePhase = true;

	audio = new Audio();

	// Required otherwise there are issues with
	// The play() request was interrupted by a call to pause()
	// https://goo.gl/LdLk22
	audioIsPlaying = false;

	audioContext = new AudioContext();
	mediaElementSource = this.audioContext.createMediaElementSource(this.audio);
	stereoPanner = this.audioContext.createStereoPanner();

	driverPosition: IDriver | null = null;

	closeDistance = 16;
	minTriggerSpeed = 10;
	scale = 5;

	@observable accessor playerIsFocus = false;

	@observable accessor currentSlotId = -1;

	@observable accessor isLeaderboard = false;

	@observable accessor isHillClimb = false;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

		this.mediaElementSource.connect(this.stereoPanner);
		this.stereoPanner.connect(this.audioContext.destination);

		this.audio.src = require('./../../sounds/beep.wav');

		this.audio.onplaying = () => {
			this.audioIsPlaying = true;
		};

		this.audio.onpause = () => {
			this.audioIsPlaying = false;
		};
	}
	componentWillUnmount() {
		unregisterUpdate(this.update);
		this.audioContext.close();
	}

	@action
	private update = () => {
		/*if (
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
		)*/ {
			this.notInRacePhase =
				(
					r3e.data.SessionPhase < 4 &&
					r3e.data.CarSpeed < 5
				) ||
				r3e.data.SessionPhase < 3;

			this.lastCheck = nowCheck;
			this.isLeaderboard = eIsLeaderboard;
			this.isHillClimb = eIsHillClimb;
			this.playerIsFocus = ePlayerIsFocus;
			this.currentSlotId = eCurrentSlotId;
			this.speed = mpsToKph(r3e.data.CarSpeed);
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
			const driver = this.getDrivers();
			this.drivers = driver.slice().sort((a: IDriver, b: IDriver) => a.distance - b.distance);

			this.controlType = r3e.data.ControlType;
			this.startLights = r3e.data.StartLights;
			this.updateSounds();
		}
	};

	private getGapToPlayer(lapDist: number): number {
		if (lapDist === INVALID) {
			return 0;
		}
		const trackDist = r3e.data.LayoutLength;
		const playerDist = r3e.data.LapDistance;
		let distToPlayer = playerDist - lapDist;

		if (distToPlayer < -(trackDist / 2)) {
			distToPlayer = distToPlayer + trackDist;
		}
		if (distToPlayer > (trackDist / 2)) {
			distToPlayer = distToPlayer - trackDist;
		}
		return parseFloat((distToPlayer * -1).toFixed(3));
	}

	private getDrivers = () => {
		const playerX = r3e.data.CarCgLocation.X * -1;
		const playerY = r3e.data.CarCgLocation.Z;

		const rotation = toDegrees(r3e.data.CarOrientation.Yaw * -1);

		return r3e.data.DriverData.filter((driver) => {
			return driver.DriverInfo.SlotId !== INVALID;
		})
			.filter((driver) => {
				return this.isCloseToPlayer(driver);
			})
			.map((driver) => {
				const opponentX = driver.Position.X * -1;
				const opponentY = driver.Position.Z;
				const isUser =
					driver.DriverInfo.SlotId === this.currentSlotId;
				const driverGap = this.getGapToPlayer(driver.LapDistance);
				const distance = distance2d(
					playerX,
					playerY,
					opponentX,
					opponentY
				);
				const angle = this.getAngle(
					playerX,
					opponentX,
					playerY,
					opponentY,
					rotation
				);
				const data = {
					distance,
					isUser,
					angle,
					x: opponentX,
					y: opponentY,
					slot: driver.DriverInfo.SlotId,
					isClose: distance < this.closeDistance,
					isFront: r3e.data.GameInReplay > 0
						?	false
						:	(this.isLeaderboard || this.isHillClimb)
							?	false
							:	driverGap >= 3,
					name: base64ToString(driver.DriverInfo.Name),
					classPerformanceIndex:
						driver.DriverInfo.ClassPerformanceIndex
				};

				if (isUser) {
					this.driverPosition = data;
				}
				return data;
			});
	};

	private isCloseToPlayer(driver: IDriverData) {
		const playerInPit = r3e.data.InPitlane;
		const opponentInPit = driver.InPitlane;
		const driverGapNoAbs = this.getGapToPlayer(driver.LapDistance);
		const driverGap = Math.abs(driverGapNoAbs);
		if (
			playerInPit !== opponentInPit ||
			driverGap > 20
		) {
			return false;
		}
		const playerX = r3e.data.CarCgLocation.X * -1;
		const playerY = r3e.data.CarCgLocation.Z;
		const opponentX = driver.Position.X * -1;
		const opponentY = driver.Position.Z;
		const distance = distance2d(playerX, playerY, opponentX, opponentY);
		const isFront = r3e.data.GameInReplay > 0
			?	false
			:	(this.isLeaderboard || this.isHillClimb)
				?	false
				:	driverGapNoAbs >= 3;

		if (
			!this.isLeaderboard &&
			!this.isHillClimb &&
			r3e.data.GameInReplay <= 0 &&
			!this.props.settings.subSettings.warnFront.enabled &&
			isFront
		) {
			return false;
		}
		return distance < this.closeDistance;
	}

	private getAngle(
		playerX: number,
		opponentX: number,
		playerY: number,
		opponentY: number,
		rotation: number
	) {
		return (
			((Math.atan2(opponentY - playerY, opponentX - playerX) * 180) /
				Math.PI +
				rotation +
				360 +
				90) %
			360
		);
	}

	private updateSounds() {
		// Reset
		this.warning.left.slot = INVALID;
		this.warning.right.slot = INVALID;

		this.drivers.forEach((driver) => {
			// const isFront = !this.isDriverBehind(driver);
			if (
				driver.isUser ||
				(
					!this.isLeaderboard &&
					!this.isHillClimb &&
					r3e.data.GameInReplay <= 0 &&
					!this.props.settings.subSettings.warnFront.enabled &&
					driver.isFront
				)
			) {
				return;
			}
			const minLeftAngle = 215;
			const maxLeftAngle = 325;
			const minRightAngle = 35;
			const maxRightAngle = 145;

			if (driver.angle > minLeftAngle && driver.angle < maxLeftAngle) {
				this.warning.left = {
					name: driver.name,
					slot: driver.slot,
					distance: driver.distance
				};
			}

			if (driver.angle > minRightAngle && driver.angle < maxRightAngle) {
				this.warning.right = {
					name: driver.name,
					slot: driver.slot,
					distance: driver.distance
				};
			}
		});

		const hasCarOnLeft = this.warning.left.slot !== INVALID;
		const hasCarOnRight = this.warning.right.slot !== INVALID;
		const fastEnough = this.speed > this.minTriggerSpeed;

		if ((hasCarOnLeft || hasCarOnRight) && fastEnough) {
			const closestDistance = Math.min(
				this.warning.left.distance,
				this.warning.right.distance
			);

			const volumeBeep = this.props.settings.volume;
			const beepAmount = 1 - closestDistance / this.closeDistance;
			this.audio.volume = Math.max(0, Math.min(volumeBeep, beepAmount * (volumeBeep / 10)));

			const minPlaybackRate = 0.1;
			const maxPlaybackRate = 10;

			const playbackRateModifier = 2;
			this.audio.playbackRate = Math.min(
				Math.max(minPlaybackRate, beepAmount * playbackRateModifier),
				maxPlaybackRate
			);

			if (hasCarOnLeft && hasCarOnRight) {
				this.stereoPanner.pan.value = 0;
			} else if (hasCarOnLeft) {
				this.stereoPanner.pan.value = -1;
			} else if (hasCarOnRight) {
				this.stereoPanner.pan.value = 1;
			}

			if (
				this.playerIsFocus &&
				r3e.data.GameInReplay <= 0 &&
				!this.isLeaderboard &&
				!this.isHillClimb &&
				this.props.settings.subSettings.shouldBeep.enabled &&
				this.audio.paused &&
				this.audioContext.state !== 'suspended' &&
				!this.audioIsPlaying
			) {
				// tslint:disable-next-line:no-empty
				this.audio.play().catch(() => {});
			}
		}
	}

	private getMapRotation() {
		const rotation = r3e.data.CarOrientation.Yaw * -1;
		// return {transform: `translate(-50%, -50%)`};
		return {
			transform: `rotate(${rotation}rad) translate(-50%, -50%)`
		};
	}

	private isDriverBehind(driver: IDriver) {
		if (!this.driverPosition) {
			return true;
		}
		const scale = this.scale;
		// const playerX = this.driverPosition.x * scale;
		const playerY = this.driverPosition.y * scale;
		// const rotation = r3e.data.CarOrientation.Yaw;
		// const containerWidth = 500;
		const containerHeight = 500;
		// const left = driver.x * scale - playerX + containerWidth / 2;
		const top = driver.y * scale - playerY + containerHeight / 2;
		return top > 250;
	}

	private rotatedPosition(pLeft: number, pTop: number, oLeft: number, oTop: number, angle: number) {
		// 1
		const x = pLeft - oLeft;
		const y = pTop - oTop;

		// 2
		const xRot = x * Math.cos(angle) - y * Math.sin(angle);
		const yRot = x * Math.sin(angle) + y * Math.cos(angle);

		// 3
		const pLeftRot = xRot + oLeft;
		const pTopRot = yRot + oTop;

		return {left: pLeftRot, top: pTopRot};
	}

	private getDriverStyle(driver: IDriver) {
		if (!this.driverPosition) {
			return {
				top: 0,
				left: 0,
				opacity: 0,
				transform: ''
			};
		}
		const scale = this.scale;
		const playerX = this.driverPosition.x * scale;
		const playerY = this.driverPosition.y * scale;
		const containerWidth = 500;
		const containerHeight = 500;
		const left = driver.x * scale - playerX + containerWidth / 2;
		const top = driver.y * scale - playerY + containerHeight / 2;

		const rotation = r3e.data.CarOrientation.Yaw;
		const opacity = 1 - Math.min(1, driver.distance / 20);
		const transform = `rotate(${rotation}rad) translate(-50%, -50%)`;
		// const blob = this.rotatedPosition(playerX, playerY, left, top, rotation);
		// showDebugMessageSmall(`${blob.left} - ${blob.top}`);
		// const transform = `translate(-50%, -50%)`;
		return {
			top,
			left,
			opacity,
			transform,
			background: getClassColor(driver.classPerformanceIndex)
		};
	}

	@action
	private hoverShow(e: React.MouseEvent) {
		const blobT = (e.currentTarget as HTMLDivElement).style.top;
		const blobL = (e.currentTarget as HTMLDivElement).style.left;
		showDebugMessageSmall(
			`${
				blobT
			} / ${
				blobL
			}`
		);
	}

	render() {
		if (
			(
				this.sessionType === 2 &&
				(
					this.sessionPhase === 1 ||
					this.startLights < 6
				)
			) ||
			this.drivers.length < 1 ||
			this.notInRacePhase
		) { return null; }
		if (!this.props.settings.subSettings.shouldOnlyBeep.enabled) {
			const ohPacity = (showAllMode || !this.props.settings.subSettings.autoHide.enabled)
				?	1
				:	this.drivers.length > 1
					// tslint:disable-next-line:binary-expression-operand-order
					?	Math.min(1, (1 * ((16 - this.drivers[1].distance) / 3)))
					:	1;
			return (
				<div
					{...widgetSettings(this.props, ohPacity)}
					className={classNames('spottingContainer', {
						shouldShow: !!this.drivers.length || showAllMode,
						danger:
							this.warning.left.slot !== INVALID ||
							this.warning.right.slot !== INVALID,
						someoneClose:
							this.drivers.length > 1,
						noneClose:
							!!this.drivers.length,
						autoHide: showAllMode
							?	false
							:	this.props.settings.subSettings.autoHide.enabled
					})}
				>
					{this.sessionPhase !== INVALID && (
						<div
							className={classNames('spotting', this.props.className)}
							style={{ ...this.getMapRotation() }}
							// onClick={this.hoverShow}
						>
							{this.drivers.map((driver, i) => {
								if (
									driver.isUser ||
									this.props.settings.subSettings.warnFront.enabled ||
									(
										!this.props.settings.subSettings.warnFront.enabled &&
										!driver.isFront
									)
								) {
									return (
										<div
											key={`${driver.slot}-${i}`}
											onClick={this.hoverShow}
											style={{
												...this.getDriverStyle(driver)
											}}
											className={classNames('driver', {
												isUser: driver.isUser,
												isClose: driver.isClose
											})}
										/>
									);
								}
								return null;
							})}
						</div>
					)}
					<div
						className="warning left"
						style={{
							opacity: this.warning.left.slot !== INVALID ? 0.6 : 0
						}}
					/>
					<div
						className="warning right"
						style={{
							opacity: this.warning.right.slot !== INVALID ? 0.6 : 0
						}}
					/>
				</div>
			);
		}
		return null;
	}
}
