var middlewareObj = {}
var ScubaSpot = require("../models/scubaSpot");
var Comment = require("../models/comment");

middlewareObj.checkScubaSpotOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		ScubaSpot.findById(req.params.id,function(err,foundSpot){
			if(err){
				res.redirect("back");
			} else {
				if (foundSpot.author.id.equals(req.user._id)){
					next();
				} else {
					res.flash("error","You do not have permission to access this diving spot.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error","Please login first.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error","You do not have permission to access this comment.");
					res.redirect("back");
				}
			}
		});
	} else {
		if (req.isAdmin){
			next();
		}
		req.flash("error","Please login first.");
		res.redirect("back");
	}
}

// check if there is a current user
middlewareObj.isLoggedIn = function(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first!");
	res.redirect("/login");
}


module.exports = middlewareObj;