const electron = require('electron');
const url = require('url');
const path = require('path');
const Store = require('./store.js');
const PDFWindow = require('electron-pdf-window')
const {app, BrowserWindow, dialog, ipcMain} = electron;
const os = require('os');
const {autoUpdater} = require("electron-updater");

// Properties
const appName = "Esmeraldina";
const inDevelopment = false;
const showDebug = true && inDevelopment;
let mainWindow;
let registrationWindow;

// First instantiate the class
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
      // Save if the product has been registered
      hasBeenRegistered: false
    }
  });

// Listen for app to be ready
app.on('ready', function(){   

    // First we'll get our height and width. This will be the defaults if there wasn't anything saved
    let hasBeenRegistered = store.get('hasBeenRegistered');
    
    if (hasBeenRegistered && !inDevelopment) {
        showMainWindow();
    } else {
        showRegistrationWindow(); 
    }           

     // Set auto updater
     autoUpdater.checkForUpdates();

})

app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('success-registration', function (e, data) {
    if (data == "true") {
        store.set("hasBeenRegistered", true);
        showMainWindow(); 
        mainWindow.once('show', () => {
            registrationWindow.close();
        })   
    }        
})


function showRegistrationWindow() {
    // Create new window
    registrationWindow = new BrowserWindow({
        width: "1280",
        height: "800",
        fullscreen: false,
        fullscreenable: true,
        center: true,
        title: appName + " Registration",
        backgroundColor: "#000000",
        webPreferences: {
            plugins: true
        },
        show: true       
    });              

    // Load html into window
    registrationWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'resources/licence/index.html'),
        protocol: 'file:',
        slashes: true
    }));              

    if (showDebug) {
        registrationWindow.webContents.openDevTools();
    }

    mainWindow = registrationWindow;    

}

function showMainWindow() {
    // Create new window
    mainWindow = new BrowserWindow({
        width: "1280",
        height: "800",
        fullscreen: false,
        fullscreenable: true,
        center: true,
        title: appName,
        backgroundColor: "#000000",
        webPreferences: {
            plugins: true
        },
        show: true
    });

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {

        if (mainWindow.webContents == webContents) {
            // Prevent download
            event.preventDefault();
        
            // Get file URL
            const fileURL = item.getURL()
            
            // Create new window
            let pdfWindow = new PDFWindow({
                width: "1280",
                height: "800",
                backgroundColor: "#000000",
                webPreferences: {
                    plugins: true                    
                }
            });                 

            // Load html into window
            pdfWindow.loadURL(url.format({
                pathname: path.join(fileURL)
            }));  
            
            console.log("PDF Showed")

        }        
        
    })

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'resources/index.html'),
        protocol: 'file:',
        slashes: true
    }));    

    if (showDebug) {
        mainWindow.webContents.openDevTools();
    }    

}


//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });

autoUpdater.on('checking-for-update', () => { 
    console.log("Main Window: " + mainWindow);
    mainWindow.webContents.send('message', "Checking for update");
})
autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({ 
        message: "Se ha detectado una actualización. Se informará cuando esté lista.",
        buttons: ["OK"]
    }, function() {
        // Do nothing
    });
})
autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('message', "Update not available");
})
autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('message', err.toString()); 
    
    dialog.showMessageBox({ 
        message: err.toString(),
        buttons: ["OK"]
    }, function() {
        // Do nothing
    });  
})
autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('message', progressObj.toString());
})
autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox({ 
        message: "Se ha bajado una actualización. Se va a cerrar la aplicación para poder instalar la nueva versión.",
        buttons: ["OK"]
    }, function() {
        autoUpdater.quitAndInstall();  
    });    
})