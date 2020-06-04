var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
});

// ===========
// Authen routes
// ===========

// register new user
router.get("/register",function(req,res){
	res.render("register");
});

// post - register new user
router.post("/register",function(req,res){
	User.find({},function(err,allUsers){
		allUsers.forEach(function(user){
			if (req.body.email==user.email){
				res.render("register", { messages: req.flash("error", "Email is already taken!") } );
			}
		});
		var newUser = new User({username:req.body.username,email:req.body.email});
		if (req.body.password == req.body.passsec){
			User.register(newUser,req.body.password,function(err,user){
				if(err){
					req.flash("error",err);
					return res.render("register");
				}
				passport.authenticate("local")(req,res,function(){
					req.flash("success","Welcome to YelpDiving "+user.username+"!");
					res.redirect("/divingsites");
				});
			});
		} else {
			res.render("register", { messages: req.flash("error", "Passwords do not match!") } );
		}
		
		
	});
		
	
});

// about page
router.get("/about", function(req,res){
	res.render("about");
});

// tips page
router.get("/tips", function(req,res){
	res.render("tips");
});

//login
router.get("/login", function(req,res){
	res.render("login");
})
router.post("/login", passport.authenticate("local",{
	successRedirect:"/divingsites",
	failureRedirect:"/login"}),function(req,res){
		alert("The user does not exist!");
});

//logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged out succuessful!")
	res.redirect("/divingsites");
})



module.exports = router;