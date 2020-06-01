var mongoose = require("mongoose");

var scubaSpotSchema = new mongoose.Schema({
	name:String, 
	img:String,
	nation: String,
	region: String,
	lat: number,
	lng: number,
	desc:String,
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