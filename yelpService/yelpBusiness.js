// Tutorial https://github.com/tonybadguy/yelp-fusion

'use strict';
var jsonfile = require("jsonfile");
const yelp = require('yelp-fusion');
const clientId = 'MRz-APojMy5T1OmEZ2b8pQ';
const clientSecret = 'Pnw91OpPAh4gcgI1LsI3kiHbQ0XQBmf6pLLZmVnoh0PG1LeSZi9jEbXRvkWHhH4h';

//file to write to
var file = 'business.json';

//get search term and location from commandline
var searchTerm = process.argv[2];
var place = process.argv[3].replace(/-/gi, ' ');

console.log(searchTerm);
console.log(place);

//searchRequest parameters
const searchRequest = {
  term: searchTerm,
  location: place
};

//search call back
yelp.accessToken(clientId, clientSecret).then(response => {
  //get token for yelp api
  const client = yelp.client(response.jsonBody.access_token);

  //list for result
  var list = [];

  //search for restaurants
  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses;

    //parse json results
    for(var i = 0; i < firstResult.length; i++){
      var obj = firstResult[i];
      var objItem = {id: obj.id, name: obj.name, avatar: obj.image_url, numReview: "", rating:"", images:[""], categories: obj.categories[0].alias,
      coordinates: obj.coordinates, price: obj.price, location: obj.location, phone: obj.display_phone};
    //  console.log(objItem);
      list.push(objItem);
    }

    //write to file
    jsonfile.writeFile(file, list, function (err) {
          console.error(err)
    })

  });
}).catch(e => {
  console.log(e);
});
