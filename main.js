const { app, BrowserWindow, dialog } = require('electron');
const sql = require('mysql');

let win;
var conpool;

function onload() {
    conpool = sql.createPool({
       connectionLimit: 10,
       user: creds.username,
       host: creds.host,
       password: creds.pass,
       database: creds.db,
       dateStrings: 'date'
    });
    updateTotal();
    getDataFromDB();
}

function getInput() {
    let date = document.getElementById("date").value;
    let amt = document.getElementById("time").value;
    let unit = document.getElementById("unit").value;
    let desc = document.getElementById("desc").value;

    if ( unit == "min" ) {
        amt = ((amt / 60.0).toFixed(2)).toString();
    }

    var data = {date: date, amt: amt, desc: desc};
    return data;
}

function buildQuery() {
    var data = getInput();
    let query = "INSERT INTO hours (date, hours, description) VALUES ('" + data.date + "', '" + data.amt + "', '" + data.desc + "');";
    sendToDB(query);
}

function sendToDB(query) {
    conpool.getConnection(function (err, con) {
        if (err) {
            alert(err);
        } else {
            con.query(query, function (err, result) {
                con.release();
                if (err) {
                    alert(err);
                } else {
                    console.log("Query Result: " + result);
                }
            });
        }  
    });
    getDataFromDB();
    updateTotal();
}

function getDataFromDB() {
    conpool.getConnection(function (err, con) {
        if (err) {
            alert(err);
        } else {
            con.query("SELECT * FROM hours;", function (err, result) {
                con.release();
                var table = document.getElementById("datatablebody");
                clearTable();
                for (let i = 0; i < result.length; i++) {         
                    var row = table.insertRow(-1);
                    var date = row.insertCell(0);
                    var time = row.insertCell(1);
                    var desc = row.insertCell(2);

                    date.innerHTML = result[i]["date"];
                    time.innerHTML = result[i]["hours"] + " hrs";
                    desc.innerHTML = result[i]["description"];
                }
            });
        }
    });
}

function updateTotal() {
    var totalhtml = document.getElementById("total");
    conpool.getConnection(function (err, con) {
        if (err) {
            alert(err);
        } else {
            con.query("SELECT SUM(hours) FROM hours;", function (err, result) {
                con.release();
                let sum = result[0]["SUM(hours)"];
                totalhtml.innerHTML = "Total: " + sum + " hours<br>" + (50.0-sum) + " hours to go!";
            });
        }
    });
}

function clearTable() {
    var tablebody = document.getElementById("datatablebody");
    tablebody.innerHTML = "";
}

function clearInputs() {
    var dateinput = document.getElementById("date");
    var timeinput = document.getElementById("time");
    var unitselect = document.getElementById("unit");
    var descinput = document.getElementById("desc");

    dateinput.valueAsDate = null;
    timeinput.value = "";
    unitselect.value = unitselect.options[0].value;
    descinput.value = "";
}

function createWindow() {
    win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    win.loadFile('index.html')
}

app.on("ready", createWindow);