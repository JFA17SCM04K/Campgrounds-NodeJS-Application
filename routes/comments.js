//NEW ROUTE
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {

    //find by id
    Campground.findById(req.params.id, function(err, campground){

        if(err){
            console.log(err);
        }else{
/*            // console.log("DOUBTTT________");
            // console.log("Doubt is"+req.user);*/
            console.log("before rendering the new form")
            console.log(campground);
            res.render("comments/new",{campground:campground});
        }
    })

});

router.post("/", middleware.isLoggedIn, function(req,res){

    console.log("-----------------------------ethee");

    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log("hereeeee---------------------------");
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else{

                    //ADD USERNAME AND ID TO COMMENT
                    console.log("inside the routes/comments file----------");
                    console.log("req.user._id is"+ req.user._id);
                    console.log("req.user.username is"+ req.user.username);
                    console.log(req.user);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log("COMEENT TEXT _____________________");
                    console.log(req.body.comment.text);

                    console.log("talking about the comments model");
                    console.log("Comment.author.id"+comment.author.id);
                    console.log("Comment.author.username"+comment.author.username);
                    console.log("Comment.text"+comment.text);

                    //SAVE THE COMMENT
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //eval(require('locus'));
                    console.log("Comment is"+comment);
                    console.log("Campgrounds ")
                    console.log(campground);
                    console.log("Campground._id");
                    console.log(campground._id);
                    console.log("Latest campground.comment log is here");
                    console.log(comment.text);
                    //eval(require('locus'));
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                    //res.render("campgrounds/show", {campground:campground});

                }
            })
        }
    })
});


//EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error","Comment not found");
                    res.redirect("back");
                }else{
                     res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});
                }
            });
    });
});

//UPDATE/PUT ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            //look at the full route from app.js for the comments model
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


module.exports = router;