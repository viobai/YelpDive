var mongoose = require("mongoose");
var ScubaSpot = require("./models/scubaSpot");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cape Kri, Indonesia", 
        img: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Barracuda Point - Sipadan Island", 
        img: "https://images.unsplash.com/photo-1459128806329-1b61d19a0f93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Blue Corner - Palau, Micronesia", 
        img: "https://images.unsplash.com/photo-1516979371633-d578f00fcd6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   ScubaSpot.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
	    Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            // data.forEach(function(seed){
            //     ScubaSpot.create(seed, function(err, scubaSpot){
            //         if(err){
            //             console.log(err)
            //         } else {
            //             console.log("added a campground");
                        // //create a comment
                        // Comment.create(
                        //     {
                        //         text: "This place is great, but I wish there was internet",
                        //         author: "Homer"
                        //     }, function(err, comment){
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             scubaSpot.comments.push(comment);
                        //             scubaSpot.save();
                        //             console.log("Created new comment");
                        //         }
                        //     });
                //     }
                // });
        });
            });
	      
        
    //}); 
    //add a few comments
}
 
module.exports = seedDB;