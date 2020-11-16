const { app, BrowserWindow, ipcMain } = require('electron');
const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
const path = require('path');
const isDev = require('electron-is-dev');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const getIcon = () => {
    if (process.platform === 'win32')
        return `${path.join(__dirname, '/icons/icon.ico')}`;
    if (process.platform === 'darwin')
        return `${path.join(__dirname, '/icons/icon.icns')}`;
    return `${path.join(__dirname, '/icons/16x16.png')}`;
};

let mainWindow;

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        title: 'Mnogo.uz 1.1.0',
        width: 1280,
        height: 720,
        minWidth: 340,
        minHeight: 220,
        frame: false,
        show: false,
        focusable: true,
        fullscreenable: false,
        icon: getIcon(),
        backgroundColor: '#282c34',
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );

    mainWindow.setAlwaysOnTop(false);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.webContents.send(
            'urlOpen',
            '',
            'Mnogo.uz',
            'http://video.mnogo.uz/',
        );
        if (isDev) {
            installExtension(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS);
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('on-top-browser', (event, id, args) => {
    mainWindow.setAlwaysOnTop(args);
});

ipcMain.on('on-devtools', (event, id) => {
    mainWindow.openDevTools();
});

ipcMain.on('channalOne', (event, args) => {
    console.log(args);
    event.sender.send('channalOne', 'Message resieved on the main process');
});
