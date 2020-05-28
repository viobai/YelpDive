var express = require("express");
var router = express.Router({mergeParams: true});
var ScubaSpot = require("../models/scubaSpot");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//===============
//Comments
//===============
router.get("/new",middleware.isLoggedIn, function(req,res){
	ScubaSpot.findById(req.params.id,function(err,scubaspot){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new",{scubaspot: scubaspot});
		};
		
	});
})

router.post("/",middleware.isLoggedIn, function(req,res){
	ScubaSpot.findById(req.params.id,function(err,scubaspot){
		if (err){
			console.log(err);
			redirect("/divingsites");
		} else {
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					scubaspot.comments.push(comment);
					scubaspot.save();
					req.flash("success","Comment added succesfully!");
					res.redirect("/divingsites/"+scubaspot._id);
				}
			});
		}
	});
});

// edit
router.get("/:comment_id/edit",middleware.isLoggedIn, middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id, function(err,foundComment){
		res.render("comments/edit",{scubaspot_id: req.params.id, comment:foundComment});
	});
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findOneAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if (err){
			res.redirect("back");
		} else {
			req.flash("success","Comment is updated successfully.");
			res.redirect("/divingsites/"+req.params.id);
		}
	});
});

// destroy scuba scubagrounds
router.delete("/:comment_id",middleware.isLoggedIn, middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err){
			res.redirect("/divingsites");
		} else {
			req.flash("success","Comment is deleted successfully.");
			res.redirect("/divingsites/"+req.params.id);
		}
	});
});


module.exports = router;