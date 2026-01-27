import {
	classNames,
	ePlayerIsFocus,
	widgetSettings,
	INVALID
} from './../../lib/utils';
import {
	IWidgetSetting,
	lowPerformanceMode,
	highPerformanceMode,
	showAllMode
} from '../app/app';
import { action, observable } from 'mobx';
import { IAidSettings } from './../../types/r3eTypes';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, nowCheck, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import './aids.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

type AidKey = keyof IAidSettings;

@observer
export default class Aids extends React.Component<IProps, {}> {
	@observable accessor aids: IAidSettings = {
		// ABS; -1 = N/A, 0 = off, 1 = on, 5 = active
		Abs: INVALID,
		// TC; -1 = N/A, 0 = off, 1 = on, 5 = active
		Tc: INVALID,
		// ESP; -1 = N/A, 0 = off, 1 = low, 2 = medium, 3 = high, 5 = active
		Esp: INVALID,
		// Countersteer; -1 = N/A, 0 = off, 1 = on, 5 = active
		Countersteer: INVALID,
		// Cornering; -1 = N/A, 0 = off, 1 = on, 5 = active
		Cornering: INVALID
	};

	@observable accessor lastCheck = 0;
	@observable accessor sessionType = -1;
	@observable accessor playerIsFocus = false;
	@observable accessor sessionPhase = -1;

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
			this.playerIsFocus = ePlayerIsFocus;
			this.lastCheck = nowCheck;
			this.aids = r3e.data.AidSettings;
			this.sessionType = r3e.data.SessionType;
			this.sessionPhase = r3e.data.SessionPhase;
		}
	};

	render() {
	if (
		(this.sessionType === 2 && this.sessionPhase === 1) ||
		(!this.playerIsFocus && !showAllMode) ||
		r3e.data.GameInReplay > 0
	) {
		return null;
	}

	const aidsConfig: {
	key: AidKey;
	class: string;
	icon: string;
	}[] = [
		{ key: 'Abs', class: 'abs', icon: 'abs.svg' },
		{ key: 'Esp', class: 'esp', icon: 'esp.svg' },
		{ key: 'Tc', class: 'tc', icon: 'tc.svg' },
		{ key: 'Countersteer', class: 'countersteer', icon: 'countersteer.svg' },
		{ key: 'Cornering', class: 'cornering', icon: 'cornering.svg' },
	];


	return (
		<div
		{...widgetSettings(this.props)}
		className={classNames(
			'aids',
			this.props.className,
			{
				'layout-vertical':
					this.props.settings.subSettings.verticalLayout.enabled,
				'layout-horizontal':
					!this.props.settings.subSettings.verticalLayout.enabled
			}
		)}
	>
			<div className="inner">
				{aidsConfig.map(aid => {
					const value = this.aids[aid.key];
					const isDisabled = value < 1;
					const isWorking = value >= 5;

					return (
						<div
							key={aid.key}
							className={classNames(
								'aid',
								aid.class,
								{
									'is-disabled': isDisabled,
									'is-active': !isDisabled,
									'is-working': isWorking
								}
							)}
						>
							<SvgIcon
								src={require(`./../../img/icons/${aid.icon}`)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

}
