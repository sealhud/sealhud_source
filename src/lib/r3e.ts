declare const module: {
  hot?: {
    accept(callback?: () => void): void;
    dispose(callback: () => void): void;
  };
};
import {
	currentFocusIsInput,
	qs,
	// showDebugMessageSmall,
	showDebugMessage
} from './utils';
import {
	lowPerformanceMode,
	highPerformanceMode,
	supremePerformance
} from '../components/app/app';
import { isObject } from 'lodash-es';
import _ from './../translate';
import IShared from './../types/r3eTypes';
import ReconnectingWebSocket from './reconnecting-websocket';
import { collectedModelIds } from './utils';

interface ISharedData {
	data: IShared;
}

const updateQueue: Function[] = [];

// Function to copy/paste DRIVERNAME and CAR MODEL ID (Useful to map new car models. Shortcut: SHIFT+C)
function copyCollectedModelsToClipboard() {
	const json = JSON.stringify(collectedModelIds, null, 2);
	const copyFrom = document.createElement('textarea');
	copyFrom.value = json;
	copyFrom.style.opacity = '0';
	document.body.appendChild(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	document.body.removeChild(copyFrom);
	showDebugMessage(`Model IDs saved to clipboard. (${collectedModelIds.length} entries.)`);
}

export function registerUpdate(func: Function) {
	const index = updateQueue.indexOf(func);
	if (index === -1) {
		updateQueue.push(func);
	} else {
		return;
	}
}

export function unregisterUpdate(func: Function) {
	const index = updateQueue.indexOf(func);
	if (index === -1) {
		return;
	}
	updateQueue.splice(index, 1);
}

// Connect to local websocket server to recieve game data through shared memory
const container: ISharedData = {} as any;

const overrideAddress = qs('ws');
const address = overrideAddress ? overrideAddress : 'localhost:8070';
const ws = new ReconnectingWebSocket(`ws://${address}/r3e`);

let upper = lowPerformanceMode
    ? 33  // low performance
    : highPerformanceMode
        ? 11  // high performance
        : supremePerformance
            ? 1   // Ultra
            : 16; // Normal → 60 FPS
function upDat() {
	upper = lowPerformanceMode
		?	33
		:	highPerformanceMode
			?	11
			:	supremePerformance
				?	1
				:	16;
	if (ws.readyState === WebSocket.OPEN) {
		ws.send('');
	}
	upDatTimeout = setTimeout(upDat, upper);
}
let upDatTimeout: any = -1;

let nowCheck = Date.now();
const nowCheckInt = setInterval(() => {
	nowCheck = Date.now();
}, 1);
let noData = false;
export {
	nowCheck,
	noData
};

function updateAllInQueue() {
	const uQLength = updateQueue.length;
	let i = uQLength;
	for (i; i--;) {
		updateQueue[i]();
	}
}
let nowDriverDataSize = -1;
let lastDriverDataSize = -1;
ws.onmessage = (e) => {
	// Allow the ability to override data for development purposes
	noData = false;
	if (debugData) {
		container.data = debugData;
		updateAllInQueue();
		return;
	}

	const data: IShared = JSON.parse(e.data);
	if (!data.DriverData) {
		lastDriverDataSize = -1;
		noData = true;
		return;
	}

	// showDebugMessage(`${data.DriverData.length}`);
	nowDriverDataSize = data.DriverData.length;
	const driverSizeDiff =
		Math.abs(nowDriverDataSize - lastDriverDataSize);
	if (lastDriverDataSize !== -1 && driverSizeDiff > 0 && driverSizeDiff > 5) {
		noData = true;
		return;
	}
	lastDriverDataSize = nowDriverDataSize;
	container.data = data;
	updateAllInQueue();
};

ws.onconnecting = () => {
	console.info('Connected.');
};

let debugData: any = null;
// Restore cached state incase we had to reload
if (localStorage.stateJson) {
	try {
		debugData = JSON.parse(localStorage.stateJson);
		if (!isObject(debugData)) {
			debugData = null;
		}
	} catch (e) {
		delete localStorage.stateJson;
	}
	showDebugMessage(_('Restored UI'));
}

function setDebugData(stateJson: string) {
	try {
		debugData = JSON.parse(stateJson);
		if (!isObject(debugData)) {
			return;
		}
		localStorage.stateJson = stateJson;
		showDebugMessage(_('Loaded game state from clip board'));
	} catch (e) {}
}

// By pasting in json we will use that as the base for the UI.
// Handy for debugging
// Resume updates by pressing Shift+Space
const handlePaste = (event: ClipboardEvent) => {
	if (event.clipboardData === null) { return; }
	const clipText = event.clipboardData.getData('Text');
	const isSettings = clipText.includes('positionBar');
	if (!isSettings) {
		try {
			setDebugData(clipText);
		} catch (e) {
			console.error(e);
		}
	}
};
document.addEventListener('paste', handlePaste);

const handleDebug = (e: KeyboardEvent) => {
	if (currentFocusIsInput() || ( !e.shiftKey && !e.ctrlKey && !e.altKey )) {
		return;
	}

	if (
		localStorage.lockHudStatus !== undefined &&
		localStorage.lockHudStatus === '0' &&
		e.shiftKey
	) {
		// Press Shift+D to copy data to clipboard
		// Useful for saving edge-cases/bug reports
		if (e.key === 'D' || e.key === 'd') {
			const json = JSON.stringify(container.data || {});

			const copyFrom = document.createElement('textarea');
			copyFrom.value = json;
			copyFrom.style.opacity = '0';
			document.body.appendChild(copyFrom);
			copyFrom.select();
			document.execCommand('copy');
			document.body.removeChild(copyFrom);
			showDebugMessage(_('Saved game state to clip board as JSON'));
		}

		// Press Shift+Space to pause the updates of UI data
		if (e.which === 32) {
			if (debugData) {
				showDebugMessage(_('Unpause UI'));
				delete localStorage.stateJson;
				debugData = null;
				return;
			}
			const stateJson = JSON.stringify(container.data || {});
			setDebugData(stateJson);
			showDebugMessage(_('Pause UI'));
		}

		// Press Shift+C to copy collected car models
		if (e.key === 'C' || e.key === 'c') {
			copyCollectedModelsToClipboard();
		}
	}
};

window.addEventListener('keyup', handleDebug);

if (module.hot) {
	module.hot.dispose(() => {
		// clearInterval(updateInterval);
		clearTimeout(upDatTimeout);
		clearInterval(nowCheckInt);
		document.removeEventListener('paste', handlePaste);
		window.removeEventListener('keyup', handleDebug);
	});
}
upDat();

export default container;
