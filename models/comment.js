var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	text: String,
	createdAt: { type: String, default: toDateOnly() },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

function toDateOnly(){
	var d = new Date().toDateString();
	return d;
}

module.exports = mongoose.model("Comment",commentSchema);