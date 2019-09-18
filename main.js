const { app, BrowserWindow } = require('electron');
const sql = require('mysql');

var con;

function onload() {
    con = sql.createConnection({host: creds.host, user: creds.username, password: creds.pass, database: creds.db});
    updateTotal();
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
    con.connect(function (err) {
        if (err) throw err;
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Query Result: " + result);
        });
    });
}

function getDataFromDB() {
    con.connect(function(err) {
        if (err) throw err;
        conn.query("SELECT * FROM hours;", function (err, result) {
            return result;
        });
    });
}

function updateTotal() {
    var sum = 0.0;
    var table = document.getElementById("datatable");
    var totalhtml = document.getElementById("total");
    for (var i = 1; i < table.rows.length; i++)
    {
        sum += parseFloat(table.rows[i].cells[1].innerHTML.split(" ")[0]);
    }

    totalhtml.innerHTML = "Total: " + sum + " hours<br>" + (50.0-sum) + " to go!";
}

function createWindow () {
    let win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    win.loadFile('index.html')
}

app.on("ready", createWindow);