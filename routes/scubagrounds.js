var express = require("express");
var router = express.Router();
var ScubaSpot = require("../models/scubaSpot");
var middleware = require("../middleware");

// index page
router.get("/",function(req,res){
	// if search bar is filled
	if(req.query.search && req.xhr) {
		console.log("query");
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// Get all campgrounds from DB
		ScubaSpot.find({name: regex}, function(err, allScubaSpots){
			if(err){
				console.log(err);
			} else {
				// res.status(200).json(allScubaSpots);
				res.render("scubagrounds/index",{scubaSpots:allScubaSpots});
			}
		});
	// search bar is empty
	} else {
		ScubaSpot.find({},function(err,allScubaSpots){
			if(err){
				console.log(err);
			} else {
				if(req.xhr) {
					res.json(allScubaSpots);
				} else {
					// res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
					res.render("scubagrounds/index",{scubaSpots:allScubaSpots});
				}
			}
		});
	}
	// ScubaSpot.find({},function(err,allScubaSpots){
	// 	if(err){
	// 		console.log(err)
	// 	} else {
	// 		res.render("scubagrounds/index",{scubaSpots:allScubaSpots});
	// 	}
	// })
});

// create - add new scuba ground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	var newName = req.body.name;
	var newImg = req.body.img;
	var newDesc = req.body.desc;
	var newNation = req.body.nation;
	var newRegion = req.body.region;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newScubaSpot = {name: newName,img:newImg, nation: newNation, region:newRegion, desc:newDesc, author:author};
	//create and save to mongoose
	ScubaSpot.create(newScubaSpot,function(err, newSpot){
		if (err){
			console.log(err);
		}else{
			req.flash("success","New diving spot is added successfully.");
			res.redirect("/divingsites");
		}
	})
});

// adding new scuba ground page
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("scubagrounds/new");
});

// show - more info about one scuba spot
router.get("/:id", function(req,res){
	//find the scuba spot with provided provided
	ScubaSpot.findById(req.params.id).populate("comments").exec(function(err, foundSpot){
		if(err){
			console.log(err);
		} else {
			//render show template
			res.render("scubagrounds/show",{scubaspot: foundSpot});
		}
	});
});

// edit scuba scubagrounds
router.get("/:id/edit",middleware.isLoggedIn, middleware.checkScubaSpotOwnership, function(req,res){
	ScubaSpot.findById(req.params.id, function(err,foundSpot){
		res.render("scubagrounds/edit", {scubaspot:foundSpot});
	});
});

router.put("/:id",middleware.isLoggedIn, middleware.checkScubaSpotOwnership,function(req,res){
	ScubaSpot.findByIdAndUpdate(req.params.id,req.body.scubaspot,function(err,scubaSpot){
		if (err){
			res.redirect("divingsites");
		} else {
			req.flash("success","Update successful!");
			res.redirect("/divingsites/"+ req.params.id);
		}
	})
})

// destroy scuba scubagrounds
router.delete("/:id",middleware.checkScubaSpotOwnership,function(req,res){
	ScubaSpot.findByIdAndRemove(req.params.id,function(err){
		if (err){
			res.redirect("/divingsites");
		} else {
			req.flash("success","Delete successful.");
			res.redirect("/divingsites");
		}
	});
});

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;