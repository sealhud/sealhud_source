import {
	IWidgetSetting,
	// lowPerformanceMode,
	// highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { classNames, INVALID, widgetSettings } from './../../lib/utils';
import { IFlags } from './../../types/r3eTypes';
import { FlagEvents } from "../../lib/FlagEvents";
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, { registerUpdate, nowCheck, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import './flags.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Flags extends React.Component<IProps, {}> {
	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor sessionPhase = -1;
	@observable accessor flags: IFlags | null = null;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	flagText = (): { BlackAndWhite: Record<number, string> } => {
		return {
			BlackAndWhite: {
				1: _('Blue flag 1st warning'),
				2: _('Blue flag 2nd warning'),
				3: _('Wrong way'),
				4: _('Cutting track'),
			},
		};
	};

	@action
	private update = () => {
		/*
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
		) 
		*/
		{
			this.lastCheck = nowCheck;
			this.flags = FlagEvents.getFlags();
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
		}
	};

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		const active = 1;
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames('flags', this.props.className)}
			>
				{this.flags?.Black === active && (
					<div className="flag black">
						<div className="flagBlock" />
						<div className="text">{_('Black flag')}</div>
					</div>
				)}

				{(this.flags?.Yellow === active || showAllMode) && (
					<div className="flag yellow">
						<div className="flagBlock" />
						<div className="text">{_('Hazard on the track')}</div>
					</div>
				)}

				{(this.flags?.Blue === active || showAllMode) && (
					<div className="flag blue">
						<div className="flagBlock" />
						<div className="text">
							{_('Yield to the car behind')}
						</div>
					</div>
				)}

				{this.flags?.Green === active && (
					<div className="flag green">
						<div className="flagBlock" />
						<div className="text">{_('Go!')}</div>
					</div>
				)}

				{this.flags?.Checkered === active && (
					<div className="flag checkered">
						<div className="flagBlock" />
						<div className="text">
							{_('Checkered flag: Last lap!')}
						</div>
					</div>
				)}

				{this.flags?.BlackAndWhite !== undefined &&
				this.flags?.BlackAndWhite > 0 && (
					<div className="flag blackAndWhite">
						<div className="flagBlock" />
						<div className="text">
							{this.flagText().BlackAndWhite[
								this.flags?.BlackAndWhite as number
							]}
						</div>
					</div>
				)}

				{this.flags?.White !== undefined &&
				this.flags.White > 0 && (
					<div className="flag white">
						<div className="flagBlock" />
						<div className="text">{_('Slow cars ahead')}</div>
					</div>
				)}
			</div>
		);
	}
}