export const isDev = process.env.NODE_ENV !== 'production';
import * as Sentry from '@sentry/browser';
import { isObject } from 'lodash-es';
import IShared from './../types/r3eTypes';
import isPlainObject from 'lodash-es/isPlainObject';
import r3e from './r3e';
import speedDate from 'speed-date';

export interface IRatingData {
	UserId: number;
	Username: string;
	Fullname: string;
	Rating: number;
	ActivityPoints: number;
	RacesCompleted: number;
	Reputation: number;
	Country: string;
	Team: string;
}

const fetch = require('node-fetch');
let ePlayerInServer = false;
let ePlayerSlotId = -1;
let ePlayerDriverDataIndex = -1;
let ePlayerIsFocus = false;
let eCurrentSlotId = -1;
let rankData: IRatingData[] = [] as any;
const rankList: number[] = [];

export {
	rankData,
	ePlayerInServer,
	ePlayerSlotId,
	ePlayerDriverDataIndex,
	ePlayerIsFocus,
	eCurrentSlotId
};

export function getSlotIds() {
	let playerInServer = false;
	let playerSlotId = -1;
	let playerDriverDataIndex = -1;
	let playerIsFocus = false;
	let currentSlotId = -1;
	let userId = localStorage.userId ? parseInt(localStorage.userId, 10) : -1;
	if (localStorage.userId && localStorage.userId === '-1') { delete localStorage.userId; }

	if (r3e.data && r3e.data.DriverData && r3e.data.DriverData.length > 0) {
		currentSlotId = r3e.data.VehicleInfo.SlotId;

		if (userId === -1) {
			if (r3e.data.BrakeRaw !== -1) {
				if (r3e.data.VehicleInfo.UserId !== -1) {
					localStorage.userId = r3e.data.VehicleInfo.UserId.toString();
					userId = r3e.data.VehicleInfo.UserId;
				}
				playerInServer = true;
				playerSlotId = currentSlotId;
				playerIsFocus = true;
				for (let i = 0; i < r3e.data.DriverData.length; i++) {
					if (r3e.data.DriverData[i].DriverInfo.SlotId === playerSlotId) {
						playerDriverDataIndex = i;
						break;
					}
				}
			} else {
				playerInServer = false;
				playerSlotId = -1;
				playerIsFocus = false;
			}
		} else if (r3e.data.BrakeRaw !== -1 && userId !== r3e.data.VehicleInfo.UserId && r3e.data.VehicleInfo.UserId > 0) {
			localStorage.userId = r3e.data.VehicleInfo.UserId.toString();
			userId = r3e.data.VehicleInfo.UserId;
			playerInServer = true;
			playerSlotId = currentSlotId;
			playerIsFocus = true;
			for (let i = 0; i < r3e.data.DriverData.length; i++) {
				if (r3e.data.DriverData[i].DriverInfo.SlotId === playerSlotId) {
					playerDriverDataIndex = i;
					break;
				}
			}
		} else if (userId === r3e.data.VehicleInfo.UserId) {
			playerInServer = true;
			playerSlotId = currentSlotId;
			playerIsFocus = true;
			for (let i = 0; i < r3e.data.DriverData.length; i++) {
				if (r3e.data.DriverData[i].DriverInfo.SlotId === playerSlotId) {
					playerDriverDataIndex = i;
					break;
				}
			}
		} else {
			playerIsFocus = false;
			for (let i = 0; i < r3e.data.DriverData.length; i++) {
				if (r3e.data.DriverData[i].DriverInfo.UserId === userId) {
					playerInServer = true;
					playerSlotId = r3e.data.DriverData[i].DriverInfo.SlotId;
					playerDriverDataIndex = i;
					break;
				}
			}
		}
		if (playerSlotId === -1 && r3e.data.GameInReplay > 0 && r3e.data.BrakeRaw !== -1) {
			playerInServer = true;
			playerSlotId = currentSlotId;
			playerIsFocus = true;
			for (let i = 0; i < r3e.data.DriverData.length; i++) {
				if (r3e.data.DriverData[i].DriverInfo.SlotId === playerSlotId) {
					playerDriverDataIndex = i;
					break;
				}
			}
		} /* else {
				for (let i = 0; i < r3e.data.DriverData.length; i++) {
					if (r3e.data.DriverData[i].DriverInfo.SlotId === currentSlotId) {
						playerDriverDataIndex = i;
						break;
					}
				}
			}
		} */
		// if (playerSlotId === -1) { playerSlotId = currentSlotId };
	}
	// showDebugMessageSmall(`playerInServer:${playerInServer ? 'yes' : 'no'} - playerSlotId:${playerSlotId} - playerDriverDataIndex:${playerDriverDataIndex} - currentSlotId:${currentSlotId} - playerIsFocus:${playerIsFocus ? 'yes' : 'no'}`);
	ePlayerInServer = playerInServer;
	ePlayerSlotId = playerSlotId;
	ePlayerDriverDataIndex = playerDriverDataIndex;
	ePlayerIsFocus = playerIsFocus;
	eCurrentSlotId = currentSlotId;
}

export async function getJason() {
	if (rankList.length === 0) {
		await fetch(`https://corsproxy.io/?${
			encodeURIComponent('https://game.raceroom.com/multiplayer-rating/ratings.json')
		}`, { method: 'GET' })
			.then((res: Response) => res.json())
			.then((json: any[]) => {
				json.forEach((driver: any) => {
					rankList.push(driver.UserId);
				});
			});
	}
	rankData = [];
	for await (const driver of r3e.data.DriverData) {
		const userId = driver.DriverInfo.UserId;

		if (userId !== -1 && rankList.includes(userId)) {
			await fetch(`https://corsproxy.io/?${
				encodeURIComponent(`https://game.raceroom.com/multiplayer-rating/user/${userId}.json`)
			}`)
			.then((resp: Response) => resp.json())
			.then((respa: any) => {
				rankData.push(respa);
			})
		}
	}
}

export function getRankingData(userId: number) {
	if (userId === -1 || rankData.length < 1) {
		return {
			UserId: -1,
			Username: 'none',
			Fullname: 'none',
			Rating: 1500,
			ActivityPoints: 0,
			RacesCompleted: 0,
			Reputation: 0,
			Country: 'none',
			Team: 'none'
		};
	}
	let indexa = -1;
	let i = rankData.length;
	for (i; i--;) {
		if (rankData[i].UserId === userId) {
			indexa = i;
			break;
		}
	}
	if (indexa !== -1) {
		return rankData[indexa];
	}
	return {
		UserId: userId,
		Username: 'none',
		Fullname: 'none',
		Rating: 1500,
		ActivityPoints: 0,
		RacesCompleted: 0,
		Reputation: 0,
		Country: 'none',
		Team: 'none'
	};
}

export function fancyTimeFormatGap(
	tempaSeconds: number,
	onlyminus: number,
	gap: number,
	spacer = false,
	roundDown = true
) {
	let tempSeconds = tempaSeconds;
	if (tempSeconds === 0) {
		return '';
	}
	const wasNegative = tempSeconds < 0 ? true : false;

	tempSeconds = Math.abs(tempSeconds);
	const hrs = ~~(tempSeconds / 3600);
	const mins = ~~((tempSeconds % 3600) / 60);
	const secs = tempSeconds % 60;

	const ret = wasNegative ? '-' : onlyminus !== 1 ? '+' : spacer ? ' ' : '';

	if (hrs > 0) {
		return `${ret}${hrs}h${mins < 10 ? '0' : ''}${mins}`;
	}
	if (mins > 0) {
		return `${
					ret
				}${
					mins
				}:${
					secs < 10 ? '0' : ''
				}${
					gap > 0
					?	roundDown
						?	secs.toFixed(1)
						:	(Math.ceil(secs * 10) / 10).toFixed(1)
					:	secs.toFixed(3)
				}`;
	}

	return `${
		ret
	}${
		gap > 0
		?	roundDown
			?	secs.toFixed(1)
			:	(Math.ceil(secs * 10) / 10).toFixed(1)
		:	secs.toFixed(3)
	}`;
}

export function playSound(path: string, volume?: number) {
	const sound = new Audio(path);
	sound.volume = volume || 1;
	sound.addEventListener('canplaythrough', () => {
		sound.play().catch((e) => {
			console.log(e);
		});
	});
	sound.addEventListener('error', (e) => {
		console.error(`Failed to play: ${path}, because: ${e}`);
	});

	return sound;
}

export function classNames(...names: (string | number | object | undefined)[]) {
	let classes: string[] = [];

	for (const arg of names) {
		if (!arg) {
			continue;
		}

		if (typeof arg === 'string' || typeof arg === 'number') {
			classes.push(arg.toString());
		} else if (Array.isArray(arg)) {
			classes = classes.concat(
				arg.map((className) => {
					return classNames(className);
				})
			);
		} else if (isPlainObject(arg)) {
			classes = classes.concat(
				Object.keys(arg).filter((key) => {
					return (arg as any)[key];
				})
			);
		} else {
			throw new Error('Passed unknown type into classNames');
		}
	}

	return classes.join(' ');
}

export function rpsToRpm(rps: number) {
	return rps * (60 / (Math.PI * 2));
}

export function mpsToKph(mps: number) {
	return mps * 3.6;
}

export function mpsToMph(mps: number) {
	return mps * 2.236936;
}

export function newtonToKg(newton: number) {
	return newton / 9.80665;
}

export function kpaTopsi(kilopascal: number) {
	return kilopascal * 0.145038;
}

export function distance2d(x1: number, y1: number, x2: number, y2: number) {
	const a = x1 - x2;
	const b = y1 - y2;

	return Math.sqrt(a * a + b * b);
}

export function distanceMine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
	const diffX = x1 - x2;
	const diffY = y1 - y2;
	const diffZ = z1 - z2;
	const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) + Math.pow(diffZ, 2));
	return distance;
}

export function toDegrees(angle: number) {
	return angle * (180 / Math.PI);
}

// Required, otherwise we get `Aleksi KÃ¤rkkÃ¤inen` not `Aleksi Kärkkäinen`
function b64DecodeUnicode(str: string, show = false) {
	// If we don't replace we get `URI malformed`
	if (show) { console.log(str); }
	const decoded = atob(str).replace(/ÿ/g, '');
	if (show) { console.log(decoded); }
	let blob = '';
	try {
		blob = decodeURIComponent(
			decoded
				.split('')
				.map((c) => {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
	} catch (error) {}
	if (show) { console.log(blob); }
	return blob;
}

const decodeLookup: { [key: string]: string } = {};
export function base64ToString(str: string, show = false) {
	if (decodeLookup[str]) {
		return decodeLookup[str];
	}
	const decoded = show
		?	b64DecodeUnicode(str, true).replace(/\u0000/g, '')
		:	b64DecodeUnicode(str).replace(/\u0000/g, '');
	decodeLookup[str] = decoded;
	return decoded;
}

const formatTimeReuseDate = new Date();
export function formatTime(
	seconds: number,
	format: string,
	addPlusPrefix = false,
	leadingZero = true
) {
	const prefix = seconds < 0 ? '-' : addPlusPrefix ? '+' : '';
	const ms = Math.abs(seconds * 1000);
	formatTimeReuseDate.setTime(ms);

	if (leadingZero) {
		return prefix + speedDate.UTC.cached(format, formatTimeReuseDate);
	}
	return prefix + speedDate.cached(format, formatTimeReuseDate);
}

export function widgetSettings(props: any, opus = 1) {
	return {
		'data-id': props.settings.id,
		onMouseDown: props.onMouseDown,
		onWheel: props.onWheel,
		style: {
			// Top left origin is required otherwise the drag/movement
			// of widgets will work incorrectly.
			transformOrigin: 'top left',
			transform: `scale(${props.settings.zoom})`,
			top:
				props.settings.position.y !== -1
					? props.settings.position.y
					: undefined,
			left:
				props.settings.position.x !== -1
					? props.settings.position.x
					: undefined,
			opacity: opus
		}
	};
}

export function setupSentry() {
	const dsn = process.env.SENTRY_DSN;
	if (!dsn) {
		return;
	}

	const sentryOptions = {
		dsn: process.env.SENTRY_DSN,
		release: process.env.RELEASE,
		environment: process.env.NODE_ENV,
		blacklistUrls: [/extensions\//i, /^chrome:\/\//i],
		beforeSend: (event: Sentry.Event) => {
			const gameState = JSON.parse(JSON.stringify(r3e.data));

			// Snapshot will be too big with driverData in it.
			delete gameState.DriverData;

			event.extra = {
				gameState
			};

			return event;
		}
	};

	const scope = Sentry.getCurrentScope();
	if (scope) {
		scope.setUser({
			gameVersion: (window as any).version || 'browser',
		});
	}
}

export function setupGoogleAnalytics() {
	const gaKey = process.env.ANALYTICS_KEY;
	if (!gaKey) {
		return;
	}

	window.GoogleAnalyticsObject = 'ga';
	window.ga =
		window.ga ||
		// tslint:disable-next-line:only-arrow-functions
		function() {
			(window.ga!.q = window.ga!.q || []).push(arguments);
		};
	window.ga.l = Date.now();

	const scriptEl = document.createElement('script');
	const gaElems = document.getElementsByTagName('script')[0];
	scriptEl.async = true;
	scriptEl.src = '//www.google-analytics.com/analytics.js';
	if (gaElems.parentNode) {
		gaElems.parentNode.insertBefore(scriptEl, gaElems);
	}

	ga('create', gaKey, 'auto');
	ga('send', 'pageview');
}

export function lerpColor(a: string, b: string, amount: number) {
	const ah = parseInt(a.replace(/#/g, ''), 16);
	const ar = ah >> 16;
	const ag = (ah >> 8) & 0xff;
	const ab = ah & 0xff;
	const bh = parseInt(b.replace(/#/g, ''), 16);
	const br = bh >> 16;
	const bg = (bh >> 8) & 0xff;
	const bb = bh & 0xff;
	const rr = ar + amount * (br - ar);
	const rg = ag + amount * (bg - ag);
	const rb = ab + amount * (bb - ab);

	return (
		'#' +
		(((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
	);
}

const filterBySearch = (search: RegExp, key: string, value: any): Boolean => {
	if (key.match(search)) {
		return true;
	}

	let containsKey = false;
	if (isObject(value)) {
		Object.keys(value).forEach((subKey) => {
			if (filterBySearch(search, subKey, value[subKey])) {
				containsKey = true;
			} else {
				// tslint:disable-next-line:no-dynamic-delete
				delete value[subKey];
			}
		});
	}

	return containsKey;
};

export function prettyDebugInfo(data: IShared, filter: string) {
	const copy = filter ? JSON.parse(JSON.stringify(data)) : data;
	if (filter) {
		const search = new RegExp(filter, 'i');
		filterBySearch(search, '', copy);
	}
	const json = JSON.stringify(copy, null, '  ');

	// Quick and dirty way of replacing the game string to readable format
	return json.replace(/"([a-z0-9]+==)"/gi, (_str, inner) => {
		return `"${base64ToString(inner)}"`;
	});
}

export function currentFocusIsInput() {
	const activeEl = document.activeElement;
	if (activeEl && activeEl.tagName.match(/^(INPUT|TEXTAREA)$/)) {
		return true;
	}

	return false;
}

export function lerp(v0: number, v1: number, alpha: number) {
	return v0 * (1 - alpha) + v1 * alpha;
}

export const INVALID = -1;

const classColorLookup: { [key: number]: string } = {};
export function getClassColor(performanceIndex: number, alpha = 1) {
	if (performanceIndex === INVALID) {
		return '#000';
	}

	if (classColorLookup[performanceIndex]) {
		return classColorLookup[performanceIndex];
	}
	classColorLookup[performanceIndex] = '';

	const classCount = Object.keys(classColorLookup).length;

	const maxHslColorValue = 250;
	const step = maxHslColorValue / Math.max(1, classCount - 1);

	Object.keys(classColorLookup)
		.map(Number)
		.sort((a, b) => {
			return a - b;
		})
		.forEach((index, i) => {
			const offset = step * i;
			classColorLookup[index] = `hsla(${offset}, 100%, 60%, ${alpha})`;
		});

	return classColorLookup[performanceIndex];
}

export function getInitials(name: string) {
	if (name === null) {
		return '';
	}
	const parts = name.split(' ');
	let pLength = parts.length;

	while (
		(
			parts[pLength - 1] !== undefined
		) &&
		parts[pLength - 1].length === 0
	) {
		pLength--;
	}
	// if (parts[pLength -1] === '') pLength--
	let initials = '';
	for (let i = 0; i < pLength; i++) {
		if (i < (pLength - 1)) {
			if (parts[i].length > 0 && parts[i] !== '') {
				initials += parts[i][0] + '. ';
		    }
		} else {
			initials = initials + parts[pLength - 1];
		}
	}
	return initials;
}

export function qs(searchFor: string) {
	const query = window.location.search.substring(1);
	const parms = query.split('&');
	for (let i = 0; i < parms.length; i++) {
		const pos = parms[i].indexOf('=');
		if (pos > 0 && searchFor === parms[i].substring(0, pos)) {
			return parms[i].substring(pos + 1);
		}
	}
	return null;
}

	export function hSLToRGB(hsla: string, alpha = 1, type = 1) {
		// hsla esperado: "hsl(H, S%, L%)" ou "hsla(H, S%, L%, A)"
		const parts = hsla.match(/(\d+\.?\d*)/g);
		if (!parts) return null;

		let h = parseFloat(parts[0]);
		let s = parseFloat(parts[1]) / 100;
		let l = parseFloat(parts[2]) / 100;

		let r: number, g: number, b: number;

		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h / 360 + 1 / 3);
		g = hue2rgb(p, q, h / 360);
		b = hue2rgb(p, q, h / 360 - 1 / 3);

		const rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];

		if (type === 1) return { r: rgb[0], g: rgb[1], b: rgb[2] };
		if (type === 2) return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
		return [...rgb, alpha];
	}


export function showDebugMessage(msg: string, theTimeout = 1000, zIndex = 100) {
	const id = 'tmpMessage';
	const oldEl = document.getElementById(id);
	if (oldEl && oldEl.parentNode) {
		oldEl.parentNode.removeChild(oldEl);
	}

	const el = document.createElement('div');
	el.innerText = msg;
	el.id = id;

	el.style.color = '#fff';
	el.style.fontSize = '50px';
	el.style.position = 'fixed';
	el.style.top = '50%';
	el.style.left = '50%';
	el.style.background = 'rgba(0,0,0,0.6)';
	el.style.textShadow = '2px 2px 0 rgba(0,0,0,0.5)';
	el.style.padding = '0 30px';
	el.style.height = '100px';
	el.style.lineHeight = '100px';
	el.style.textAlign = 'center';
	el.style.borderRadius = '20px';
	el.style.transform = 'translate(-50%, -50%)';
	el.style.zIndex = `${zIndex}`;
	el.style.whiteSpace = 'nowrap';
	document.body.appendChild(el);
	el.classList.add('media-popup');

	setTimeout(() => {
		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}, theTimeout);
}

export function showDebugMessageSmall(
	msg: string,
	theTimeout = 1000,
	shiftDown = 5,
	bHeight = 75,
	lHeight = 75,
	fSize = 24,
	zIndex = 100
) {
	const id = 'tmpMessageSmall';
	const oldEl = document.getElementById(id);
	if (oldEl && oldEl.parentNode) {
		oldEl.parentNode.removeChild(oldEl);
	}

	const el = document.createElement('div');
	el.innerText = msg;
	el.id = id;

	el.style.color = '#fff';
	el.style.fontSize = `${fSize}px`;
	el.style.position = 'fixed';
	el.style.top = `${shiftDown}%`;
	el.style.left = '50%';
	el.style.background = 'rgba(0,0,0,0.6)';
	el.style.textShadow = '2px 2px 0 rgba(0,0,0,0.5)';
	el.style.padding = '0 30px';
	el.style.height = `${bHeight}px`;
	el.style.lineHeight = `${lHeight}px`;
	el.style.textAlign = 'center';
	el.style.borderRadius = '20px';
	el.style.transform = 'translate(-50%, -50%)';
	el.style.zIndex = `${zIndex}`;
	el.style.whiteSpace = 'pre';
	document.body.appendChild(el);
	el.classList.add('media-popup');

	setTimeout(() => {
		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}, theTimeout);
}

export function getRoundsLeft(fastestLapGiven: number) {
	const secsRemain = r3e.data.SessionTimeRemaining;
	const fastestLapLeader = r3e.data.LapTimeBestLeader;
	const fastestLap =
		fastestLapGiven > 0 ?
			fastestLapGiven
			: r3e.data.LapTimeBestSelf > 0 ?
				r3e.data.LapTimeBestSelf
				: fastestLapLeader > 0 ?
					fastestLapLeader
					: -1;
	if (fastestLap <= 0) {
		return -1;
	}
	let roundsLeft = 0;
	let roundsLeftFloat = 0.0;
	let leaderLaps = -1;
	const playerLaps = r3e.data.CompletedLaps;
	let leaderPercent = 0;
	const playerPercent = r3e.data.LapDistanceFraction;
	let timeLeft = 0;

	if (r3e.data.SessionLengthFormat >= 0) {
		if (r3e.data.SessionLengthFormat === 1) {
			const blob = r3e.data.DriverData[0].CompletedLaps + 1;
			roundsLeft = r3e.data.SessionPhase === 6
				? 0
				: r3e.data.NumberOfLaps - blob;
			roundsLeftFloat = roundsLeft + (1 - playerPercent);
		} else if (r3e.data.SessionType !== -1) {
			if (r3e.data.SessionType < 2) {
				roundsLeft = r3e.data.SessionPhase === 6
					? 0
					: Math.floor(secsRemain / fastestLap);
				roundsLeftFloat = roundsLeft + (1 - playerPercent);
			} else if (r3e.data.SessionType === 2) {
				if (r3e.data.SessionPhase === 6) {
					roundsLeft = 0;
					roundsLeftFloat = roundsLeft + (1 - playerPercent);
				} else {
					leaderLaps = r3e.data.DriverData[0].CompletedLaps;
					leaderPercent = r3e.data.DriverData[0].LapDistance / r3e.data.LayoutLength;
					roundsLeft = Math.floor(secsRemain / fastestLap);
					timeLeft = secsRemain - (fastestLap * roundsLeft);
					if (
						leaderLaps > playerLaps &&
						leaderPercent < playerPercent
					) {
						roundsLeft++;
					}
					if (timeLeft > (fastestLapLeader * (1 - leaderPercent))) {
						roundsLeft++;
					}
					roundsLeftFloat = roundsLeft + (1 - playerPercent);
				}
			}
		}
	}
	return Math.round(roundsLeftFloat * 10) / 10;
}

export function getFuelNeeded(toEnd: boolean) {
	const perLap = r3e.data.FuelPerLap;
	if (perLap === -1) {
		return 'N/A';
	}

	const secsRemain = r3e.data.SessionTimeRemaining;
	let fastestLapLeader = r3e.data.LapTimeBestLeader;
	const fastestLap = r3e.data.LapTimeBestSelf;
	if (fastestLap <= 0) {
		return 'N/A';
	}
	if (fastestLapLeader <= 0) {
		fastestLapLeader = fastestLap;
	}
	let roundsLeft = 0;
	let leader = 999;
	let leaderPercent = 0;
	const playerPercent = r3e.data.LapDistanceFraction;
	let timeLeft = 0;

	if (r3e.data.SessionLengthFormat > 0) {
		let blob = 0;
		r3e.data.DriverData.forEach((driver) => {
			const blab = driver.CompletedLaps + 1;
			if (blab != null && blab > blob) {
				blob = blab;
			}
		});
		roundsLeft = r3e.data.SessionPhase === 6
			?	roundsLeft = 0
			:	r3e.data.SessionLengthFormat === 2
					?	roundsLeft = r3e.data.NumberOfLaps - blob + 1
					:	roundsLeft = r3e.data.NumberOfLaps - blob;
	} else {
		r3e.data.DriverData.forEach((driver) => {
			const blib = driver.Place;
			if (blib != null && blib < leader) {
				leader = blib;
				leaderPercent = driver.LapDistance / r3e.data.LayoutLength;
			}
		});
		if (r3e.data.SessionPhase === 6) {
			roundsLeft = 0;
		} else {
			if (fastestLap === 0) {
				return 'N/A';
			}
			roundsLeft = Math.floor(secsRemain / fastestLap);
			timeLeft = secsRemain - (fastestLap * roundsLeft);

			if (r3e.data.SessionType === 2) {
				if (timeLeft >= (fastestLap * (1 - playerPercent))) {
					roundsLeft += 1;
				} else if (timeLeft >= (fastestLapLeader * (1 - leaderPercent))) {
					roundsLeft += 1;
				}
			}
		}
	}

	roundsLeft = Math.ceil(roundsLeft);
	const fuelToEnd = perLap * (roundsLeft + (1 - playerPercent));
	const fuelToAdd = fuelToEnd <= 0 ? 0 : fuelToEnd - r3e.data.FuelLeft;

	if (toEnd) {
		if (fuelToEnd >= 0) {
			return fuelToEnd.toFixed(1).toString();
		}
		return 'N/A';
	}
	if (fuelToAdd !== 0) {
		return fuelToAdd.toFixed(1).toString();
	}
	return 'N/A';
}

export function resAspect(
	srcWidth: number,
	srcHeight: number,
	maxWidth: number,
	maxHeight: number
) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
		width: srcWidth * ratio, height: srcHeight * ratio
	};
}

export function isEven(n: number) {
	return n % 2 === 0;
}

export function isOdd(n: number) {
	return Math.abs(n % 2) === 1;
}

export function isRange(x: number, min: number, max: number) {
	return x >= min && x <= max;
}

export function getTimeUntilPit(lapBased = false) {
	// time based races
	return lapBased
		?	(r3e.data.PitWindowStart - (r3e.data.CompletedLaps + 1)) + 1
		:	Math.floor(r3e.data.SessionTimeRemaining / 60) -
			(
				(r3e.data.SessionTimeDuration / 60) -
				r3e.data.PitWindowStart
			) +	1;
}

export function getTimeUntilPitClosed(lapBased = false) {
	// time based races
	return lapBased
		?	(r3e.data.PitWindowEnd - (r3e.data.CompletedLaps + 1)) + 1
		:	Math.floor(r3e.data.SessionTimeRemaining / 60) -
			(
				(r3e.data.SessionTimeDuration / 60) -
				r3e.data.PitWindowEnd
			) + 1;
}

// Function to export Driver Name and ModelId (This can be used to collect data for new cars. Shortcut: SHIFT+C)
export const collectedModelIds: Array<{ driver: string; modelId: number }> = [];
export function registerCollectedModel(driver: string, modelId: number) {
	if (!collectedModelIds.some(x => x.modelId === modelId)) {
		collectedModelIds.push({ driver, modelId });
	}
}