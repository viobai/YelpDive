var mongoose = require("mongoose");

var scubaSpotSchema = new mongoose.Schema({
	name:String, 
	img:String,
	nation: String,
	region: String,
	lat: Number,
	lng: Number,
	desc:String,
	reference: String,
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
   ],
	localGuides:[
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Guide"
      }
   ],
	ratings: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Rating"
      }
   ],
   rating: { type: Number, default: 0 }
});

function toDateOnly(){
	var d = new Date().toDateString();
	return d;
}


module.exports = mongoose.model("ScubaSpot",scubaSpotSchema);