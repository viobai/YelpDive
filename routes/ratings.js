var express = require("express");
var router  = express.Router({mergeParams: true});
var ScubaSpot = require("../models/scubaSpot");
var Rating = require("../models/rating");
var middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	ScubaSpot.findById(req.params.id, function(err, scubaspot) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
			if (req.body.rating && req.body.rating != 0){
				Rating.create(req.body.rating, function(err, rating) {
					if(err) {
						console.log(err);
					}
					rating.author.id = req.user._id;
					rating.author.username = req.user.username;
					rating.save();
					scubaspot.ratings.push(rating);
					scubaspot.save();
					req.flash("success", "Successfully added rating");
				});
			}
				
		} else {
				req.flash("error", "Please select a rating");
		}
		res.redirect('/divingsites/' + scubaspot._id);
	});
});

router.put('/:rating_id', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	if (req.body.rating && req.body.rating != 0){
	Rating.findByIdAndUpdate(req.params.rating_id,req.body.rating, function(err, updatedRating) {
		if (err){
				req.flash("error", err.message);
				res.redirect("back");
		} else {
			req.flash("success","Update successful!");
			res.redirect("/divingsites/"+ req.params.id);
		}
	});
	}
});

module.exports = router;