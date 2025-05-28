const path = require('path');
const electron = require('electron');
const Store = require('electron-store');
const windowStateKeeper = require('electron-window-state');

const WINDOW_WIDTH = 670;
const WINDOW_HEIGHT = 550;

const { app, BrowserWindow } = electron;
let mainWindow = null;

app.on('ready', () => {
  Store.initRenderer();

  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT
  });

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow);

  // load the HTML file
  const htmlFile = path.join('file://', __dirname, 'index.html');
  mainWindow.loadURL(htmlFile);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
});
