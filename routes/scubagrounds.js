var express = require("express");
var router = express.Router();
var ScubaSpot = require("../models/scubaSpot");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var axios = require('axios');
var foundArticles = [];


// geocoder activation
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// index page
router.get("/",function(req,res){
	// if search bar is filled
	if(req.query.search && req.query.search != "") {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// Get all campgrounds from DB
		ScubaSpot.find().or([{ 'name': { $regex: regex }}, { 'nation': { $regex: regex }}, { 'region': { $regex: regex }}]).exec(
			function(err, allScubaSpots){
				if(err){
					console.log(err);
				} else {
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
	
});



// create - add new scuba ground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	var newName = req.body.name;
	var newImg = req.body.img;
	var newDesc = req.body.desc;
	var newNation = req.body.nation;
	var newRegion = req.body.region;
	var newRef = req.body.reference;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var location = newName + " " + newNation;
	ScubaSpot.find({},function(err,allScubaSpots){
		if (err){
			console.log(err);
			return res.redirect('back');
		} else {
			allScubaSpots.forEach(function(site){
				if (site.name==newName && site.nation==newNation){
					req.flash('err','This diving site has already been added!');
					return res.redirect("back");
				}
			});
		}
	});
	
	geocoder.geocode(location, function(err,data){
		if (err||!data.length){
			req.flash('err','Invalid address');
			return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var newScubaSpot = {name: newName,img:newImg, nation: newNation, region:newRegion, desc:newDesc, author:author, reference:newRef, lat: lat, lng: lng};
		//create and save to mongoose
		ScubaSpot.create(newScubaSpot,function(err, newSpot){
			if (err){
				req.flash("error","...");
				console.log(err);
			}else{
				req.flash("success","New diving spot is added successfully.");
				res.redirect("/divingsites");
			}
		});
	});
	
});

// adding new scuba ground page
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("scubagrounds/new");
});

// show - more info about one scuba spot
router.get("/:id", function(req,res){
	//find the scuba spot with provided provided
	ScubaSpot.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, foundSpot){
		if(err){
			console.log(err);
		} else {
			if(foundSpot.ratings.length > 0) {
				var ratings = [];
				var length = foundSpot.ratings.length;
				foundSpot.ratings.forEach(function(rating) { 
					ratings.push(rating.rating) 
				});
				var rating = ratings.reduce(function(total, element) {
					return total + element;
				});
				foundSpot.rating = rating / length;
 
				foundSpot.save();
			}
			
			//render show template
			res.render("scubagrounds/show",{scubaspot: foundSpot});
		}
	});
});


// show - recent news
router.get("/:id/recentnews", function(req,res){
	//find the diving spot with provided id
	ScubaSpot.findById(req.params.id, function(err,foundSpot){
		// search news by diving spot name and its nation
		var query = foundSpot.name + " " + foundSpot.nation;
		query = query.split(' ').join('+');
		var url = 'http://newsapi.org/v2/everything?'+"q=" + query + '&sortBy=publishedAt&' + 'apiKey=8af4363721b9402ba4288b068bb6b365';
		axios.get(url).then(response => {
			foundArticles = response.data.articles;
			
			// if no articles exist, search news by nation only
			if (foundArticles.length==0){
				var urlNation = 'http://newsapi.org/v2/everything?'+"q=" +foundSpot.nation + '&sortBy=publishedAt&' + 'apiKey=8af4363721b9402ba4288b068bb6b365';
				axios.get(urlNation).then(response => {
					foundArticles = response.data.articles;
					foundArticles = formatArticles(foundArticles);
					res.render("scubagrounds/recentNews", {scubaspot:foundSpot,articles:foundArticles});
				}).catch(error => {
    				console.log(error);
  				});
			} else {
				foundArticles = formatArticles(foundArticles);
				res.render("scubagrounds/recentNews", {scubaspot:foundSpot,articles:foundArticles});
			}
			
			
  		}).catch(error => {
    		console.log(error);
  		});
		
	});
});

// edit scuba scubagrounds
router.get("/:id/edit",middleware.isLoggedIn, middleware.checkScubaSpotOwnership, function(req,res){
	ScubaSpot.findById(req.params.id, function(err,foundSpot){
		res.render("scubagrounds/edit", {scubaspot:foundSpot});
	});
});

router.put("/:id",middleware.isLoggedIn, middleware.checkScubaSpotOwnership,function(req,res){
	var location = req.body.name + " " + req.body.nation;
	geocoder.geocode(location, function(err,data){
		if (err||!data.length){
			req.flash('err','Invalid address');
			return res.redirect('back');
		}
		
		ScubaSpot.findByIdAndUpdate(req.params.id,req.body.scubaspot,function(err,scubaSpot){
			if (err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success","Update successful!");
				res.redirect("/divingsites/"+ scubaSpot._id);
			}
		});
	});	
});

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

function formatArticles(fa){
	// maximum 10 articles
	if (fa.length>10){
		fa = fa.slice(0,10);
	}

	// replace html tags inside content
	fa.forEach(function(article){
		article.publishedAt = article.publishedAt.replace(/[a-z]/gi, ' ');
		if (article.content){
			article.content = article.content.replace(/<(.|\n)*?>/g, '');
		}
	});
	
	return fa;
}



module.exports = router;