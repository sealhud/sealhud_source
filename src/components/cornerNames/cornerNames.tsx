import {
	classNames,
	// showDebugMessage,
	widgetSettings
} from './../../lib/utils';
import {
	getCornerName,
	getTrackName,
	getLayoutName
} from './../../lib/trackDetails';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode
} from '../app/app';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from './../../translate';
import r3e, {
	registerUpdate,
	unregisterUpdate,
	nowCheck
} from './../../lib/r3e';
import React from 'react';
import './cornerNames.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class CornerNames extends React.Component<IProps, {}> {
	@observable accessor sessionType = -1;
	sessionPhase = -1;
	@observable accessor trackName = '';
	@observable accessor trackLayoutName = '';
	@observable accessor trackLength = 0;
	@observable accessor trackDist = 0;
	@observable accessor cornerName = '';
	@observable accessor details = true;
	@observable accessor corners = true;
	@observable accessor lastCheck = 0;
	@observable accessor lastFastCheck = 0;
	@observable accessor nowTrackId = -1;
	@observable accessor nowLayoutId = -1;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.details =
			this.props.settings.subSettings.trackDetails.enabled;
		this.corners =
			this.props.settings.subSettings.corners.enabled;

		if (
			nowCheck - this.lastFastCheck >= 16
		) {
			this.lastFastCheck = nowCheck;
			if (
				this.details ||
				this.corners
			) {
				this.trackDist = Math.round(r3e.data.LapDistance);
			}
		}
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
				this.nowTrackId === -1 || this.nowLayoutId === -1
			) {
					this.trackName = getTrackName(r3e.data.TrackId);
					this.trackLayoutName = getLayoutName(r3e.data.TrackId, r3e.data.LayoutId);
					this.trackLength = Math.round(r3e.data.LayoutLength);
					this.nowTrackId = r3e.data.TrackId;
					this.nowLayoutId = r3e.data.LayoutId;
			}

			if (
				this.corners
			) {
				this.cornerName = r3e.data.InPitlane === 1
					?	_('PIT-LANE')
					:	getCornerName(r3e.data.LayoutId, this.trackDist);
			}
		}
	}

	render() {
		if (
			this.sessionType === 2 &&
			this.sessionPhase === 1
		) { return null; }
		if (!this.details && !this.corners) {
			return null;
		}

		const widgetProps = widgetSettings(this.props);

		return (
		<div
			className={classNames('cornerNamesContainer', this.props.className, {
			showDetails: this.details && !this.corners,
			showCorners: this.corners && !this.details,
			showBoth: this.details && this.corners,
			theSillyShit: this.props.settings.subSettings.noColors.enabled
			})}
			{...widgetProps}
			style={{
			...widgetProps?.style,
			height:
				this.details && this.corners
				? '110px'
				: (!this.details && this.corners) ||
					(this.details && !this.corners)
				? '55px'
				: '0px', // remove o width fixo
			}}
		>
				{
					this.details && (
						<div className="trackNameTextContainer">
							<div className="trackNameTextText">
								{_('Track:')}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div
							className={classNames('trackNameContainer', {
								isGerman: localStorage.language === 'de',
								isFrench: localStorage.language === 'fr',
								isSpanish: localStorage.language === 'es',
								isPolish: localStorage.language === 'pl'
							})}
						>
							<div className="trackNameText">
								{this.trackName}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div className="layoutNameTextContainer">
							<div className="layoutNameTextText">
								{_('Layout:')}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div
							className={classNames('layoutNameContainer', {
								isGerman: localStorage.language === 'de',
								isFrench: localStorage.language === 'fr',
								isSpanish: localStorage.language === 'es',
								isPolish: localStorage.language === 'pl'
							})}
						>
							<div className="layoutNameText">
								{this.trackLayoutName}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div
							className={classNames('trackLengthTextContainer', {
								isFrench: localStorage.language === 'fr',
								isPolish: localStorage.language === 'pl'
							})}
						>
							<div className="trackLengthText">
								{_('Length:')}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div className="trackLengthContainer">
							<div className="trackLengthNumber">
								{this.trackLength}{' '}{`${'M'}`}{' '}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div
							className={classNames('trackDistTextContainer', {
								isFrench: localStorage.language === 'fr'
							})}
						>
							<div className="trackDistText">
								{_('Dist:')}
							</div>
						</div>
					)
				}
				{
					this.details && (
						<div className="trackDistContainer">
							<div className="trackDistNumber">
								{this.trackDist}{' '}{`${'M'}`}{' '}
							</div>
						</div>
					)
				}
				{
					this.corners && (
						<div className="cornerNameContainer">
							<div className="cornerNameText">
								{this.cornerName}
							</div>
						</div>
					)
				}
			</div>
		);
	}
}
