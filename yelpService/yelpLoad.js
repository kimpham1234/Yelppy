var admin = require("firebase-admin");
var serviceAccount = require("./yelpServiceAccount.json");
var json = require("./business.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yelppy-80fb2.firebaseio.com"
});

dbRef = admin.database().ref("business");

for(var i = 0; i < json.length; i++){
	var key = dbRef.push().key;
	dbRef.child(key).set(json[i]);
}
