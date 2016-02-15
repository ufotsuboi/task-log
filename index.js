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
require('crash-reporter').start();

let mainWindow = null;
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.dock.hide();
app.on('ready', () => {
  var appIcon = new Tray(__dirname + '/icon.png');
  var contextMenu = Menu.buildFromTemplate([
    {label: 'スタート', accelerator: 'Command+S', click: () => {
      mainWindow.webContents.send('menu-start');
    }},
    {label: 'ストップ', accelerator: 'Command+L', click: () => {
      mainWindow.webContents.send('menu-stop');
    }},
    {label: '終了', accelerator: 'Command+Q', click: () => {
      app.quit();
    }},
  ]);
  appIcon.setContextMenu(contextMenu);

  globalShortcut.register('ctrl+s', () => {
    mainWindow.webContents.send('menu-start');
  });
  globalShortcut.register('ctrl+l', () => {
    mainWindow.webContents.send('menu-stop');
  });

  mainWindow = new BrowserWindow({width: 800, height: 600, show: false});
  mainWindow.loadUrl(currentURL);

  // デベロッパーツールを表示
  // 不要であればコメントアウト
  mainWindow.toggleDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});
