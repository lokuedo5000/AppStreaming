// EventEmitter
const et = require('events');
et.EventEmitter.defaultMaxListeners = 0;

// Electron
const {
  app,
  BrowserWindow,
  webContents,
  Menu,
  ipcMain,
  screen,
  dialog
} = require('electron');

// Importar Expresss
// no

// Aqui los otros Modules
const url = require('url');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Save Info Windows
const WindowStateManager = require('electron-window-state-manager');

// Script Js
const json = require(path.join(__dirname, 'docs', 'js', 'json'));

// Get Json


/*Ready*/
app.on('ready', () => {
  /*Abrir ventana por tamaño default*/
  const winState = new WindowStateManager('win', {
    defaultWidth: 500,
    defaultHeight: 500
  });
  /*Datos de la ventana*/
  win = new BrowserWindow({
    icon: path.join(__dirname, 'docs', 'assets', 'icons', 'win', 'ico#2.ico'),
    width: winState.width,
    height: winState.height,
    'minWidth': 500,
    'minHeight': 500,
    x: winState.x,
    y: winState.y,
    title: 'AppWeb',
    titleBarStyle: 'customButtonsOnHover',
    transparent: true,
    // maximizable: true,
    // resizable: true,
    frame: false,
    show: false,
    webPreferences: {
      // nodeIntegration: true, // is default value after Electron v5
      // contextIsolation: false, // protect against prototype pollution
      // enableRemoteModule: true, // turn off remote
      preload: path.join(__dirname, 'docs', 'js', 'win.js') /* Archivo Preloader /script/reload/win.js */
    }
  });

  /*Add Menu*/
  const menuMainWindow = Menu.buildFromTemplate(templateMenu);
  win.setMenu(menuMainWindow);
  win.setMenuBarVisibility(false);

  // Mediante este evento muestra la ventana principal cuando está cargada y lista para mostrar
  win.once('ready-to-show', () => {
    win.show()
    if (winState.maximized) {
      win.maximize();
    }
    // win.webContents.send('win-action-max', 'min');
  });

  /*Load Url*/
  // win.loadURL('http://' + readPackage.host + ':' + portDefault + '/update');
  // win.on('close', () => {
  //   winState.saveState(win);
  // })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'docs', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('close', () => {
    winState.saveState(win);
    stopTime();
    app.quit();
  })

})

// Verificar Maximize
var timeend = setInterval(function() {
  if (win.isMaximized()) {
    // SetIco
    win.webContents.send('win-action-max', 'min');
  } else {
    // SetIco
    win.webContents.send('win-action-max', 'max');
  }
}, 2000)

function stopTime() {
  clearInterval(timeend);
}



// Win Action
ipcMain.on('win-action', (e, data) => {
  if (data == "minimize") {
    win.minimize();
  } else if (data == "maximize") {
    if (win.isMaximized()) {
      win.unmaximize();
      // SetIco
      win.webContents.send('win-action-max', 'max');
    } else {
      win.maximize();
      // SetIco
      win.webContents.send('win-action-max', 'min');
    }
  } else if (data == "close") {
    app.quit();
  }
})

// Reload
ipcMain.on('win-reload', (e, data) => {
  stopTime();
  app.relaunch()
  app.exit()
})

/*Menu Clear*/
Menu.setApplicationMenu(null);

/*Menu*/
var templateMenu = [{
  label: 'Update',
  accelerator: process.platform == 'darwin' ? 'Comand+R' : 'Ctrl+R',
  click() {
    app.relaunch()
    app.exit()
    //win.webContents.send('reset-app', 'end');
  }
}];

// Reload in Development for Browser Windows
var DevTools = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : true;

if (DevTools) {
  templateMenu.push({
    label: 'DevTools',
    submenu: [{
      label: 'Show/Hide Dev Tools',
      accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }]
  })
}
