var mongoose=require("mongoose");

var Campground=require("./models/campgrounds.js");
var Comment=require("./models/comment.js");

var data=[
    {
        name:"hi camp",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_fAk0HLLSiMkvgy9w9PxKYWu5TgGK_SKa4k6MkvCRwoGVtmsAaw",
        description:"so much funn"
    },
    {
        name:"hello camp",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC9fek2gUuOXpv2HFOjAhsIAN5v-UDP4t4FWy8kBgc2TbZ55sFgg",
        description:"okayish"
    }
    ];
function seedDB(){
    
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed campgrounds");
        }
    /*        data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }else{
                        
                        Comment.create({
                            text:"great place but i wish there was internet here",
                            author:"Harry"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Campground created");
                            }
                        });
                        
                    }
                });
    });
        }*/
    });
    
    
    }


module.exports=seedDB;