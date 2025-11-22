import { configure as mobxConfigure } from 'mobx';
import { isDev /*, setupGoogleAnalytics, setupSentry*/ } from './lib/utils';
import App from './components/app/app';
import quickDebugCssReload from './lib/quickDebugCssReload';
import { createRoot } from 'react-dom/client'; // novo import

mobxConfigure({
  enforceActions: 'observed'
});

// setupGoogleAnalytics();
// setupSentry();

quickDebugCssReload();

const rootName = 'dash';
const existingRoot = document.getElementById(rootName);
const rootEl = existingRoot || document.createElement('div');

if (!existingRoot) {
  rootEl.id = rootName;
  document.body.appendChild(rootEl);
}

// React 18: cria root e renderiza o App
const root = createRoot(rootEl);
root.render(<App />);

// Hot Module Replacement (ignora erro de tipo)
if (isDev) {
  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept();
  }
}