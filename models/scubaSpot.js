var mongoose = require("mongoose");

var scubaSpotSchema = new mongoose.Schema({
	name:String, 
	img:String,
	nation: String,
	region: String,
	desc:String,
	//lat: Number,
    //lng: Number,
	createdAt: { type: String, default: toDateOnly() },
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	comments:[
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

function toDateOnly(){
	var d = new Date().toDateString();
	return d;
}


module.exports = mongoose.model("ScubaSpot",scubaSpotSchema);