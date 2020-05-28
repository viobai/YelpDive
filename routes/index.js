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
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	// if(req.body.adminCode === process.env.ADMIN_CODE) {
	// 	newUser.isAdmin = true;
	// }
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