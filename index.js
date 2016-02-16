'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;

// 起動 URL
var currentURL = 'file://' + __dirname + '/index.html';

// クラッシュレポート
//require('crash-reporter').start();

let mainWindow = null;
let forceQuit = false;

app.dock.hide();
app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', function () {
  mainWindow = null;
});


app.on('ready', () => {
  var appIcon = new Tray(__dirname + '/icon.png');
  var contextMenu = Menu.buildFromTemplate([
    {label: 'レポート', accelerator: 'Command+L', click: () => {
      mainWindow.show();
    }},
    {label: '隠す', accelerator: 'Command+H', click: () => {
      mainWindow.hide();
    }},
    {label: '終了', accelerator: 'Command+Q', click: () => {
      globalShortcut.unregisterAll();
      app.quit();
    }},
  ]);
  appIcon.setContextMenu(contextMenu);

  globalShortcut.register('ctrl+1', () => {
    mainWindow.webContents.send('menu-start', 1);
  });
  globalShortcut.register('ctrl+2', () => {
    mainWindow.webContents.send('menu-start', 2);
  });
  globalShortcut.register('ctrl+3', () => {
    mainWindow.webContents.send('menu-start', 3);
  });
  globalShortcut.register('ctrl+0', () => {
    mainWindow.webContents.send('menu-stop');
    mainWindow.reload();
  });

  mainWindow = new BrowserWindow({width: 800, height: 600, show: false});
  mainWindow.loadURL(currentURL);

  mainWindow.on('close', e => {
    if (!forceQuit) {
      e.preventDefault();
      mainWindow.hide();
    } else {
      mainWindow = null;
    }
  });

  app.on('before-quit', function (e) {
    forceQuit = true;
  });
});
