
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res, next){
  var listing = req.listing;
  /* Replace the article's properties with the new properties found in req.body */
  /* save the coordinates (located in req.results if there is an address property) */
  /* Save the article */
  Listing.findOneAndUpdate(
	  {_id: listing._id}, 
	  {code: req.body.code,
	  name: req.body.name,
	  address: req.body.address,
	  coordinates: {latitude: req.results.lat, longitute: req.results.lng}},
	  function(err, l){
		if(err){
			res.status(400).send(err);
		}else{
			Listing.findById(l._id, function(err, l){
				if(err){
					res.status(400).send(err);
				}else{
					res.json(l);
				}
			});
		}
		
	  });

};

/* Delete a listing */
exports.delete = function(req, res, next) {
  var listing = req.listing;
  /* Remove the article */
  Listing.findOneAndRemove({code: listing.code}, function(err, listing){
  	if(err){
		res.status(400).send(err);
		console.log(err);
	}else{
		res.status(200);
		next();
	}
  });
  
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res, next) {
  Listing.find({}, null, {sort: {code: 1}}, function(err, listing){
  	if(err){
		res.status(400).send(err);
	}else{
		res.json(listing);
	}
  });
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};