const {app, BrowserWindow, session} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const fs = require('fs');
const Store = require('./models/store.js');



//console.log('Checking ready: ' + app.isReady());
let mainWindow;

    const store = new Store({
        configName: 'Configs',
        defaults: {
            windowBounds: { width: 1000, Height: 800}
        }
    });


function createWindow (){
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    let ses = session.defaultSession;

    let {width, height} = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: 800,
        minHeight: 317,
        x: winState.x,
        y: winState.y,
        enableRemoteModule: true,
        //frame: false,
       // titleBarStyle: 'hidden',
      //  autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
             webviewTag: true,
            partition: 'SkyNet'},
        
        
        //show: false
    })
    
    //let session = mainWindow.webContents.session;
    //Saves last state of window.
    winState.manage(mainWindow);

    //Uncomment this for release ----------------------------------------
    //mainWindow.setMenuBarVisibility(false);

    mainWindow.on('resize', () => {
        let{ Width, Height} = mainWindow.getBounds();
        store.set('windowBounds', {Width, Height});
    });

    
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('closed', ()=> {
        mainWindow = null
    })
   
}

app.on('before-quit', e => {
    console.app("Preventing app from quitting.")
    e.preventDefault()
    storeUserData()
    app.quit()
    
});



app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
});