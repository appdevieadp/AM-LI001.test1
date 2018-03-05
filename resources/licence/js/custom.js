const electron = require('electron');
const {ipcRenderer} = electron;
const os = require('os');

function registerLicence() {
    const licence = document.getElementById("licence").value;
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {        
        if (this.readyState == 4 && this.status == 200) { 
            if (this.responseText == "true") {
                ipcRenderer.send('success-registration', this.responseText);
            } else {
                document.getElementById("response").innerHTML = this.responseText;
            }                      
       } else if (this.readyState == 4 && this.status != 200) { 
            document.getElementById("response").innerHTML = "Error. Por favor asegurece de tener Internet. Si el problema continúa favor comunicarse con ANISA, Inc.";
       }
    };

    xhttp.open("POST", "http://159.65.179.184/register?licence=" + licence + "&other=" + os.hostname());
    xhttp.send();

}