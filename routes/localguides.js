var express = require("express");
var router = express.Router({mergeParams: true});
var ScubaSpot = require("../models/scubaSpot");
var Guide = require("../models/guide");
var middleware = require("../middleware");
//===============
//Guides
//===============
// show - local guides
router.get("/", function(req,res){
	//find the scuba spot with provided provided
	ScubaSpot.findById(req.params.id).populate("localGuides").exec(function(err, foundSpot){
		if(err){
			console.log(err);
		} else {
			//render show template
			res.render("scubagrounds/localGuides",{scubaspot: foundSpot});
		}
	});
});



router.get("/new",middleware.isLoggedIn, function(req,res){
	ScubaSpot.findById(req.params.id,function(err,scubaspot){
		if(err){
			console.log(err);
		} else{
			res.render("scubagrounds/newGuide",{scubaspot: scubaspot});
		};
		
	});
})

router.post("/",middleware.isLoggedIn, function(req,res){
	ScubaSpot.findById(req.params.id,function(err,scubaspot){
		if (err){
			console.log(err);
			redirect("/divingsites/localguides");
		} else {
			Guide.create(req.body.guide,function(err,guide){
				if(err){
					console.log(err);
				} else{
					guide.author.id = req.user._id;
					guide.author.username = req.user.username;
					guide.save();
					scubaspot.localGuides.push(guide);
					scubaspot.save();
					req.flash("success","Added succesfully!");
					res.redirect("/divingsites/"+scubaspot._id+"/localguides");
				}
			});
		}
	});
});

// edit
router.get("/:guide_id/edit",middleware.isLoggedIn, middleware.checkGuideOwnership,function(req,res){
	Guide.findById(req.params.guide_id, function(err,foundGuide){
		res.render("scubagrounds/editGuide",{scubaspot_id: req.params.id, guide:foundGuide});
	});
});

router.put("/:guide_id",middleware.checkGuideOwnership,function(req,res){
	Guide.findOneAndUpdate(req.params.guide_id,req.body.guide,function(err,updatedGuide){
		if (err){
			res.redirect("back");
		} else {
			req.flash("success","Updated successfully.");
			res.redirect("/divingsites/"+req.params.id+"/localguides");
		}
	});
});

// destroy scuba scubagrounds
router.delete("/:guide_id",middleware.isLoggedIn, middleware.checkGuideOwnership,function(req,res){
	Guide.findByIdAndRemove(req.params.guide_id, function(err){
		if (err){
			res.redirect("/divingsites");
		} else {
			req.flash("success","Deleted successfully.");
			res.redirect("/divingsites/"+req.params.id+"/localguides");
		}
	});
});


module.exports = router;