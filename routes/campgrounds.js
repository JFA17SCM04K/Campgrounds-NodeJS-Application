//INDEX ROUTE
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'imagerycloud',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    // Get all campgrounds from DB
    //eval(require('locus'));
      var noMatch='';
      var perPage = 8;
      var pageQuery = parseInt(req.query.page);
      var pageNumber = pageQuery ? pageQuery : 1;
    if(req.query.search){
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          //Campground.find({name: regex}, function(err, allCampgrounds){
          Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count().exec(function (err, count) {
              if(err)
              {
                console.log(err);
              } else
              {
                        if(allCampgrounds.length < 1){
                            noMatch = 'No campgrounds match that query. Please try again!';
              }
              res.render("campgrounds/campgrounds",{campground: allCampgrounds, page: 'campgrounds', noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
              }
            });
          });
    }
    else{
        //  Campground.find({}, function(err, allCampgrounds){
          Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count().exec(function (err, count) {
              if(err){
                console.log(err);
              } else {
                res.render("campgrounds/campgrounds",{campground: allCampgrounds, page: 'campgrounds',noMatch: noMatch,current: pageNumber,pages: Math.ceil(count / perPage)});
              }
          });
        });
        }
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req,res){
  console.log("NEW DOUBT");

  //eval(require('locus'));
   var name = req.body.name;

   //var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user._id,
       username: req.user.username
   }

     console.log(req.body);
    geocoder.geocode(req.body.location, function (err, data) {
    console.log('data is'+data)
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;

    cloudinary.uploader.upload(req.file.path, function(result) {
          //add cloudinary url for the image to the campground object under image property
          req.body.image = result.secure_url;
          console.log('secure url is'+result.secure_url)
          //add author to campground
          req.body.author = {
            id: req.user._id,
            username: req.user.username
          }

          var campground = {name:name, image:req.body.image,price:price, description:description, author:author, location: location, lat: lat, lng: lng};
          Campground.create(campground, function(err, campground) {
            if (err) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            res.redirect('/campgrounds/' + campground.id);
          });
    });

  });
});


//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new.ejs");
});

//SHOW ROUTE
router.get("/:id", function(req,res){

    console.log("ID for the clickedd campground is:"+req.params.id);
    //eval(require('locus'));
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){

        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found.");
            res.redirect("back");
        }
        else{
            console.log("found campground is")
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       console.log("Inside the edit route")
       console.log(foundCampground);
       res.render("campgrounds/edit",{campgrounds: foundCampground});
})
});


//UPDATE ROUTE
router.put("/:id", upload.single('image'),function(req, res){

    console.log("location"+req.body.location)
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;

  cloudinary.uploader.upload(req.file.path, function(result) {
        //add cloudinary url for the image to the campground object under image property
        req.body.image = result.secure_url;
        console.log('secure url is'+result.secure_url)
        //add author to campground
        req.body.author = {
          id: req.user._id,
          username: req.user.username
        }
        var newData = {name:req.body.name, image:req.body.image,price:req.body.price, description:req.body.description, author:req.body.author, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground.id);
        });
  });

});
});



//DELETE ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;
