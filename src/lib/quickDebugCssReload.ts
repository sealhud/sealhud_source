// Quick and dirty way to inject css changes immediately instead of waiting
// for webpack compile to finish. Images will currently fail since we don't
// deal with resolving assets

export default function quickDebugCssReload() {
	if (process.env.NODE_ENV === 'development') {
		const port = Number(process.env.PORT ?? 8070); // fallback = 8070
		const ws = new WebSocket(`ws://localhost:${port + 1}`);

		ws.addEventListener('message', (data) => {
			const css = data.data;

			const style = document.createElement('style');
			style.type = 'text/css';
			style.appendChild(document.createTextNode(css));

			document.head?.appendChild(style);
			setTimeout(() => style.remove(), 3000);
		});
	}
}

