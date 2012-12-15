function initDB(){
   try {
        if ( window.openDatabase ) {
            mydb = openDatabase("TACDB2", "1.0", "TAC2", 65536);
            checkIfDBInitialized();
            if ( !mydb ) {
                alert( "Failed to open the database. Have you allocated enough space?" );
            }
        }
    } catch( error ) {
        alert( "Error trying to open database init : " + error );
    }
	
}
function checkIfDBInitialized() {
    mydb.transaction(
                     function(tx) {
                     tx.executeSql( sql.COUNT, [],
                                   function(tx, result) {
                                   // do nothing
                                   },
                                   function( tx, error) {
                                   tx.executeSql( sql.CREATE, [],
                                                 function(result) {
                                                 tx.executeSql( sql.INSERT, [ dataId, "[]" ]);
                                                 });
                                   });
                     });
    check4Data();
}
function check4Data() {
	mydb.transaction(
                     function(tx) {
                     tx.executeSql('SELECT * from users', [], checkResults, 
                                   function( tx, error) {
                                   createTables();
                                   insertData();
                                   });
                     });
}
function checkResults(transaction, results) {

}
createTables = function() {
	try {
        mydb.transaction(
						 function(transaction) {
                         transaction.executeSql('CREATE TABLE IF NOT EXISTS users(userId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName TEXT NOT NULL DEFAULT "", lastName TEXT NOT NULL DEFAULT "", userName TEXT NOT NULL DEFAULT "", password TEXT NOT NULL DEFAULT "", hint TEXT NOT NULL DEFAULT "");', [], nullDataHandler, errorHandler);
						 transaction.executeSql('CREATE TABLE IF NOT EXISTS trucks(TruckId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, truckName TEXT NOT NULL DEFAULT "", unused TEXT NOT NULL DEFAULT "", unused2 TEXT NOT NULL DEFAULT "");', [], nullDataHandler, errorHandler);
                         transaction.executeSql('CREATE TABLE IF NOT EXISTS acType(acId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, acName TEXT NOT NULL DEFAULT "", unused TEXT NOT NULL DEFAULT "", unused2 TEXT NOT NULL DEFAULT "");', [], nullDataHandler, errorHandler);
						 transaction.executeSql('CREATE TABLE IF NOT EXISTS customer(customerId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, customerName TEXT NOT NULL DEFAULT "", customerAddress TEXT NOT NULL DEFAULT "", customerAddress2 TEXT NOT NULL DEFAULT "", customerCity TEXT NOT NULL DEFAULT "", customerState TEXT NOT NULL DEFAULT "", customerZip TEXT NOT NULL DEFAULT "", customerPhone TEXT NOT NULL DEFAULT "", customerPhone2 TEXT NOT NULL DEFAULT "", customerContact TEXT NOT NULL DEFAULT "");', [], nullDataHandler, errorHandler);
                         transaction.executeSql('CREATE TABLE IF NOT EXISTS fuelOp(fuelopId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, tailNumber TEXT NOT NULL DEFAULT "", acId TEXT NOT NULL DEFAULT "", customerId TEXT NOT NULL DEFAULT "", flightNumber TEXT NOT NULL DEFAULT "", startMeter1 TEXT NOT NULL DEFAULT "", startMeter2 TEXT NOT NULL DEFAULT "", notes TEXT NOT NULL DEFAULT "", endMeter1 TEXT NOT NULL DEFAULT "", endMeter2 TEXT NOT NULL DEFAULT "", userId TEXT NOT NULL DEFAULT "", totalGal TEXT NOT NULL DEFAULT "");', [], nullDataHandler, errorHandler);
						 });
	}
    catch(e) {
        return;
	}
	
}
insertData = function() {
    try {
        mydb.transaction(
                         function(transaction) {
                         transaction.executeSql('insert into users (username,password,hint) VALUES (?,?,?);', [username,password,hint], nullDataHandler, errorHandler);
                         });
    }
    catch(e) {
        return;
    }
                         
}
nullDataHandler = function (transaction, results) { }
errorHandler = function (transaction, error) {
	alert(error);
	return true;
}
optionsPage = function(){
    //check that meter reading is a number
    
    //make sure truck number and user are not ---
    
    //else do this
    var truck=document.getElementById("selectTruck");
    var user=document.getElementById("selectUser");
    document.getElementById("optionsTitle").innerHTML ="Truck " + truck.options[truck.selectedIndex].value + " - 204 Gallons on Board - " + user.options[user.selectedIndex].text;
    document.getElementById('startMeter1').value = document.getElementById('meter1Reading').value;
    document.getElementById('startMeter2').value = document.getElementById('meter2Reading').value;
    jQT.goTo('#options','slideleft');
}
compFuelOp = function(){
    
    jQT.goTo('#compFuelOp','slideleft');
}
verify = function(){
    document.getElementById("verifyTitle").innerHTML = "Verify " + document.getElementById('totalGal').value + " total gallons."
    jQT.goTo('#verify','slideleft');
}
record = function(){
    //enter everything into the DB here
    var tailNumber = document.getElementById('tailNumber').value;
    var ac=document.getElementById("acType");
    var acId = ac.options[ac.selectedIndex].value;
    var customer = document.getElementById("selectCustomer");
    var customerId = customer.options[customer.selectedIndex].value;
    var flightNumber = document.getElementById('flightNumber').value;
    var startMeter1 = document.getElementById('startMeter1').value;
    var startMeter2 = document.getElementById('startMeter2').value;
    var notes = document.getElementById('notes').value;
    var endMeter1 = document.getElementById('endMeter1').value;
    var endMeter2 = document.getElementById('endMeter2').value;
    var user = document.getElementById("selectUser");
    var userId = user.options[user.selectedIndex].value;
    var totalGal = document.getElementById('totalGal').value;
    try {
        mydb.transaction(
						 function(transaction) {
                            transaction.executeSql('insert into fuelOp (tailNumber, acId, customerId, flightNumber, startMeter1, startMeter2, notes, endMeter1, endMeter2, userId, totalGal) VALUES (?,?,?,?,?,?,?,?,?,?,?);', [tailNumber, acId, customerId, flightNumber, startMeter1, startMeter2, notes, endMeter1, endMeter2, userId, totalGal], nullDataHandler, errorHandler);
        });
    }
    catch(e) {
        return;
    }

    refresh("Data entered successfully into database.");
}
messages = function(message,nextPage){
    document.getElementById('messageTitle').innerHTML=message;
    document.getElementById('messageLi').innerHTML="<a href=\"javascript:void(0);\" onclick=\"jQT.goTo('#" + nextPage + "','flipright')\" class=\"whiteButton\">OK</a>";
    jQT.goTo('#messagePage','slideup');
}
refresh = function(message){
    document.getElementById('refreshTitle').innerHTML=message;
    document.getElementById('refreshLi').innerHTML="<a href=\"javascript:void(0);\" onclick=\"startOver();\" class=\"whiteButton\">OK</a>";
    jQT.goTo('#refreshPage','slideup');
}
startOver = function(){
    //reset the main div
    document.getElementById("selectTruck").value=0;
    document.getElementById("selectUser").value=0;
    jQT.goTo('#home','flipright');
}
