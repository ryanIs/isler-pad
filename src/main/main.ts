/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import fs from 'fs'
import { jsonc } from 'jsonc'
var exec = require('child_process').exec;

import MainWebSocket from './websocket';

// isWebsocketHost determines if the host machine running this application is the host or client.
let isWebsocketHost: boolean = false

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ 
    // console.log(error)
    // console.log(stderr)
    callback(stdout); 
  });
};

function sendAutoHotKey(argA, callback) {
  let myExecutionStr = `AutoHotkey.exe send.ahk "${argA}"`
  console.log(myExecutionStr)
  execute(myExecutionStr, stdout => callback(stdout))
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('get-settings-json', async (event, arg) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  event.reply('get-settings-json', settingsJSON);
});

ipcMain.on('system-send-key', async (event, arg) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  // event.reply('get-settings-json', settingsJSON);
  // sendAutoHotKey(arg.command, arg.callback)
  console.log(arg)
  sendAutoHotKey(
    arg, 
    (o) => { console.log('ahk response:'); console.log(o); }, // ignoring callback function for now
  )
});

ipcMain.on('system-net-send-key', async (event, arg) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  // event.reply('get-settings-json', settingsJSON);
  // sendAutoHotKey(arg.command, arg.callback)
  // console.log('hiff mom!!!!!!!!!!!!!!!!!!')

  mainWebSocket.send('system-send-key ^!p');


  // sendAutoHotKey(
  //   arg,
  //   () => {
  //     console.log(arg);
  //   } // ignoring callback function for now
  // );
});


let mainWebSocket

// initSystem will load up the web socket with the JSON data. (now that settingsJSON is ready with the connection info.)
// It will also load up general system things as well.
const initSystem = () => {
  let myHost: string = 'localhost'
  let myPort: number = 43591
  let isHost: boolean = false

  if(settingsJSON != null && settingsJSON.default != null && settingsJSON.default.system != null) {
    myHost = settingsJSON.default.system.networkHostName || myHost
    myPort = settingsJSON.default.system.networkPort || myPort
    isHost = settingsJSON.default.system.isNetworkHost || isHost
  }
  
  mainWebSocket = new MainWebSocket(myHost, myPort, isHost);
  mainWebSocket.initWebsocket();
  mainWebSocket.onData(webSocketDataHandler)
  
}

const webSocketDataHandler = (data, isHost: boolean) => {
  let dataStr = String(data)
  // console.log(dataStr)
  if(data != null) {

    // todo: setup forloop to run through generics like these
    if(dataStr.indexOf('system-send-key') != -1) {
      let keyArg = dataStr.split('system-send-key ')[1]
      // console.log(ipcMain)

      ipcMain.emit('system-send-key', {}, keyArg)

      // sendAutoHotKey(keyArg, 
      //     () => {}
      //   )
    }

  }
}


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};


var settingsJSON: any

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  let FSRawData: string = fs.readFileSync( path.join(__dirname, 'settings.jsonc'), {encoding: 'utf8', flag: 'r'} );
  try {
    settingsJSON = jsonc.parse(FSRawData)
    initSystem()
  } catch(e) {
    console.log('ERROR PARSING SETTINGS JSON!!')
  }
  // console.log(settingsJSON);

  let mainWindowWidth: number = 1500
  let mainWindowHeight: number = 1028
  // let electrionWindowTitle: string = 'Isler Pad'

  if(settingsJSON != null && settingsJSON.default != null && settingsJSON.default.system != null) {
    mainWindowWidth = settingsJSON.default.system.electrionWindowWidth || mainWindowWidth
    mainWindowHeight = settingsJSON.default.system.electrionWindowHeight || mainWindowHeight
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: mainWindowWidth,
    height: mainWindowHeight,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


// todo: net (setup so this same app can be host and client)

// run sendkey.bat
//   sendkey will send keyboard shortcuts to the machine running this program


// let readline = require('readline');

// readline.emitKeypressEvents(process.stdin);

// process.stdin.on('keypress', (ch, key) => {
//   console.log('got "keypress"', ch, key);
//   if (key && key.ctrl && key.name == 'c') {
//     process.stdin.pause();
//   }
// });

// process.stdin.setRawMode(true);

// const os = require('os')


// module.exports.getGitUser = function(callback){
//   execute("git config --global user.name", function(name){
//       execute("git config --global user.email", function(email){
//           callback({ name: name.replace("\n", ""), email: email.replace("\n", "") });
//       });
//   });
// };


// const { fork } = require('child_process');
// fork(path.join(__dirname, 'send.ahk'), ['args'], {
// 	stdio: 'pipe'
// });

// const { fork } = require('child_process');
// fork(path.join(__dirname, 'child.js'), ['args'], {
// 	stdio: 'pipe'
// });




