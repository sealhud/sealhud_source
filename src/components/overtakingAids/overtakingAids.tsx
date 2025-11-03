import {
	classNames,
	widgetSettings
} from './../../lib/utils';
import {
	IWidgetSetting,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './overtakingAids.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class OvertakingAids extends React.Component<IProps, {}> {
	@observable accessor drs = {
		/** If DRS is equipped and allowed */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Equipped: 0,
		/** Got DRS activation left */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Available: 0,
		/** Number of DRS activations left this lap */
		/** Note: In sessions with 'endless' amount of drs activations per lap
		 * this value starts at :max: number */
		/** -1 = N/A */
		NumActivationsLeft: 0,
		/** DRS engaged */
		/** 0 = No, 1 = Yes, -1 = N/A */
		Engaged: 0
	};

	@observable accessor pushToPass = {
		Available: 0,
		Engaged: 0,
		AmountLeft: 0,
		EngagedTimeLeft: 0,
		WaitTimeLeft: 0
	};

	@observable accessor maxP2pTimeLeft = 0;

	@observable accessor maxP2pWaitTimeLeft = 0;

	@observable accessor lastCheck = 0;

	@observable accessor drsEquipped = false;

	@observable accessor drsAvailable = false;

	@observable accessor drsEngaged = false;

	@observable accessor drsNumActivationsLeft = -1;

	@observable accessor drsNumActivationsTotal = -1;

	@observable accessor drsInfinite = false;

	@observable accessor p2pEquipped = false;

	@observable accessor p2pAvailable = false;

	@observable accessor p2pEngaged = false;

	@observable accessor p2pNumActivationsLeft = -1;

	@observable accessor p2pNumActivationsTotal = -1;

	@observable accessor p2pEngagedTimeLeft = -1;

	@observable accessor p2pMaxEngageTime = -1;

	@observable accessor p2pWaitTimeLeft = -1;

	@observable accessor p2pMaxWaitTime = -1;

	infiniteLabel = '∞';

	updateFunc: Function;

	@observable accessor sessionType = -1;

	@observable accessor sessionPhase = -1;

	constructor(props: IProps) {
		super(props);

		this.updateFunc = this.update.bind(this);
		registerUpdate(this.updateFunc);
	}

	componentWillUnmount() {
		unregisterUpdate(this.updateFunc);
	}

	@action
	private update() {
		this.lastCheck = nowCheck;

		this.sessionType = r3e.data.SessionType;
		this.sessionPhase = r3e.data.SessionPhase;
		this.drsEquipped = r3e.data.Drs.Equipped > 0;
		this.drsAvailable = r3e.data.Drs.Available > 0;
		this.drsEngaged = r3e.data.Drs.Engaged > 0;
		this.drsNumActivationsLeft = r3e.data.Drs.NumActivationsLeft;
		this.drsNumActivationsTotal = r3e.data.DrsNumActivationsTotal;
		this.drsInfinite = this.drsNumActivationsLeft > 1000000;

		this.p2pEquipped = r3e.data.PushToPass.Available !== -1;
		this.p2pAvailable = r3e.data.PushToPass.Available === 1;
		this.p2pEngaged = r3e.data.PushToPass.Engaged > 0;
		this.p2pNumActivationsLeft = r3e.data.PushToPass.AmountLeft;
		this.p2pNumActivationsTotal =
			r3e.data.PtPNumActivationsTotal !== undefined
			?	r3e.data.PtPNumActivationsTotal
			:	r3e.data.PtpNumActivationsTotal !== undefined
				?	r3e.data.PtpNumActivationsTotal
				:	-1;
		this.p2pEngagedTimeLeft = r3e.data.PushToPass.EngagedTimeLeft;
		this.p2pWaitTimeLeft = r3e.data.PushToPass.WaitTimeLeft;

		if (this.p2pMaxEngageTime === -1 && this.p2pEngagedTimeLeft > 0) {
			this.p2pMaxEngageTime = Math.round(this.p2pEngagedTimeLeft);
		}
		if (this.p2pMaxEngageTime !== -1 && this.p2pEngagedTimeLeft <= 0) {
			this.p2pMaxEngageTime = -1;
		}
		if (this.p2pMaxWaitTime === -1 && this.p2pWaitTimeLeft > 0) {
			this.p2pMaxWaitTime = Math.round(this.p2pWaitTimeLeft);
		}
		if (this.p2pMaxWaitTime !== -1 && this.p2pWaitTimeLeft <= 0) {
			this.p2pMaxWaitTime = -1;
		}
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		/* if (!ePlayerIsFocus && !showAllMode) {
			return null;
		}*/

		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('overtakingAidsContainer', this.props.className)}
			>
				{(showAllMode || this.drsEquipped) && (
					<div
						className={classNames('drsLabelBox', {
							showP2P: showAllMode || this.p2pEquipped
						})}
						style={{
							background:
								this.drsAvailable || this.drsEngaged
								?	'rgba(0, 130, 0, 0.8)'
								:	'rgba(128, 128, 128, 0.8)'
						}}
					>
						<div className="drsLabelBoxText">
							{`${'DRS'}`}
						</div>
					</div>
				)}
				{(showAllMode || this.drsEquipped) && (
					<div
						className={classNames('drsAmountBox', {
							showP2P: showAllMode || this.p2pEquipped
						})}
						style={{
							background: this.drsEngaged
								?	'rgba(0, 255, 0, 0.8)'
								:	'rgba(0, 0, 0, 0.8)'
						}}
					/>
				)}
				{(showAllMode || this.drsEquipped) && (
					<div
						className={classNames('drsAmountTextBox', {
							showP2P: showAllMode || this.p2pEquipped
						})}
					>
						<div
							className={classNames('drsAmountText', {
								isInfinite: this.drsInfinite
							})}
						>
							{
								this.drsInfinite
								?	this.infiniteLabel
								:	this.drsNumActivationsTotal > 0
									?	`${
											this.drsNumActivationsLeft
										}/${
											this.drsNumActivationsTotal
										}`
									:	this.drsNumActivationsLeft
							}
						</div>
					</div>
				)}
				{(showAllMode || this.p2pEquipped) && (
					<div
						className={classNames('p2pLabelBox', {
							showDRS: showAllMode || this.drsEquipped
						})}
						style={{
							background: this.p2pAvailable
								?	this.p2pNumActivationsTotal > 0
									?	this.p2pNumActivationsLeft > 0
										?	'rgba(0, 130, 0, 0.8)'
										:	this.p2pEngaged
											?	'rgba(0, 130, 0, 0.8)'
											:	'rgba(128, 128, 128, 0.8)'
									:	this.p2pNumActivationsTotal < 0
										?	this.p2pNumActivationsLeft > 0
											?	'rgba(0, 130, 0, 0.8)'
											:	this.p2pEngaged
												?	'rgba(0, 130, 0, 0.8)'
												:	'rgba(128, 128, 128, 0.8)'
										:	'rgba(128, 128, 128, 0)'
								:	'rgba(128, 128, 128, 0.8)'
						}}
					>
						<div className="p2pLabelBoxText">
							{`${'P2P'}`}
						</div>
					</div>
				)}
				{(showAllMode || this.p2pEquipped) && (
					<div
						className={classNames('p2pAmountBox', {
							showDRS: showAllMode || this.drsEquipped
						})}
						style={{
							background: this.p2pEngaged
								?	'rgba(0, 0, 0, 0.8)'
								:	'rgba(0, 0, 0, 0.8)'
						}}
					>
						<div
							className={classNames('p2pTimeBar', {
								showDRS: showAllMode || this.drsEquipped
							})}
							style={{
								background: showAllMode || this.p2pEngaged
									?	'rgba(0, 255, 0, 0.8)'
									:	'rgba(128, 128, 128, 0.8)',
								width: showAllMode
									?	'47px'
									:	this.p2pEngagedTimeLeft > 0
										?	`${
												150 -
												(
													(
														(
															this.p2pMaxEngageTime -
															this.p2pEngagedTimeLeft
														) /
														this.p2pMaxEngageTime
													) *
													150
												)
											}px`
										:	this.p2pWaitTimeLeft > 0
											?	`${
													150 -
													(
														(
															(
																this.p2pMaxWaitTime -
																this.p2pWaitTimeLeft
															) /
															this.p2pMaxWaitTime
														) *
														150
													)
												}px`
											:	'0px'
							}}
						/>
					</div>
				)}
				{(showAllMode || this.p2pEquipped) && (
					<div
						className={classNames('p2pAmountTextBox', {
							showDRS: showAllMode || this.drsEquipped
						})}
					>
						<div className="p2pAmountText">
							{
								showAllMode
								?	`1/29`
								:	this.p2pNumActivationsTotal > 0
									?	`${
											this.p2pNumActivationsLeft
										}/${
											this.p2pNumActivationsTotal
										}`
									:	this.p2pNumActivationsLeft
							}
						</div>
					</div>
				)}
			</div>
		);
	}
}
