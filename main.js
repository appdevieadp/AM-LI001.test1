const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
    
    // Create new window
    mainWindow = new BrowserWindow({
        width: "1280",
        height: "800",
        center: true,
        title: "Esmeraldina",
        backgroundColor: "#000000",
        webPreferences: {
            plugins: true
        }
    });

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'resources/index.html'),
        protocol: 'file:',
        slashes: true
    }));

})