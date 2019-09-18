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
    sendToDB(query);
}

function sendToDB(query) {
    var con = sql.createConnection({
        host: "10.0.0.235",
        user: "code",
        password: "DBPASS"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("established connection");
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