'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl(currentURL);

  // デベロッパーツールを表示
  // 不要であればコメントアウト
  mainWindow.toggleDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
