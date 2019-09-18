const sql = require('mysql');

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
}