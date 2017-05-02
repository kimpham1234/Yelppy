var admin = require("firebase-admin");
var serviceAccount = require("./yelpServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yelppy-80fb2.firebaseio.com"
});
var picURL = "https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41"


var restaurantListRef = admin.database().ref("business");
restaurantListRef.once('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		 		   if(childSnapshot.val().images[0]===""){
		 		   		restaurantListRef.child(childSnapshot.key).update({images: [picURL]});
		 		   }
		  });
		 
});
