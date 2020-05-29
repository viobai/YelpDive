var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
	ScubaSpot  = require("./models/scubaSpot"),
    mongoose   = require("mongoose"),
	flash = require("connect-flash"),
	Comment    = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	User       = require("./models/user"),
	seedDB     = require("./seeds");

var commentRoutes = require("./routes/comments"),
	scubagroundRoutes = require("./routes/scubagrounds"),
	indexRoutes = require("./routes/index");
	

//seedDB();
mongoose.connect("mongodb+srv://ViolaBai:yelpdive@yelpscuba-vou7v.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true,useCreateIndex:true}).then(() => {
	console.log("connected to db!");
}).catch(err => {
	console.log("error", err.message);
});

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//passport config
app.use(require("express-session")({
	secret:"You are the cutest",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/",indexRoutes);
app.use("/divingsites",scubagroundRoutes);
app.use("/divingsites/:id/comments",commentRoutes);






app.listen(process.env.PORT ||3000, function(){ // 
	console.log("The YelpDiving server has started!");
});