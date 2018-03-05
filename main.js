const electron = require('electron');
const url = require('url');
const path = require('path');
const Store = require('./store.js');
const PDFWindow = require('electron-pdf-window')
const {app, BrowserWindow, dialog, ipcMain} = electron;
const os = require('os');

// Properties
const appName = "Esmeraldina";
const inDevelopment = true;
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

})

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
        fullscreen: true,
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

}

function showMainWindow() {
    // Create new window
    mainWindow = new BrowserWindow({
        width: "1280",
        height: "800",
        fullscreen: true,
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