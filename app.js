require('dotenv').load();
var  express    =require("express"),
     app        =express(),
     bodyParser =require("body-parser"),
     mongoose   =require("mongoose"),
     flash      =require("connect-flash"),
     passport   =require("passport"),
     LocalStrategy=require("passport-local"),
     methodOverride = require("method-override"),
     Comment    =require("./models/comment"),
     User       =require("./models/user"),
     seedDB     =require("./seeds");

//REQUIRING ROUTES
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");

app.use(express.static(__dirname+"/public"))
var Campground=require("./models/campgrounds")

mongoose.connect("mongodb://localhost/yelp_camp");

app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
//SEEDING THE DATABASE
//seedDB();



app.use(require("express-session")({
    secret:"Once again Rusty is the smartest and the cutest dof of the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");

   next();
});


/*Campground.create(
    {
        name:"hill2",
        image:"http://larsensacehardware.com/lar072/wp-content/uploads/2017/05/camping-2.jpeg",
        description:"hill2 is one of the great campgrounds of the country"
    }, function(err, campground){
        if(err){
            console.log("Something went wrong");
        }else{
            console.log(campground);
        }
    }
    );

Campground.create(
    {
        name:"hill3",
        image:"https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg",
        description:"hill3 is one of the great campgrounds of the country"
    }, function(err, campground){
        if(err){
            console.log("Something went wrong");
        }else{
            console.log(campground);
        }
    }
    );*/

//USING THE ROUTES THAT WE HAVE INCLUDED ABOVE
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Yelp Camp Server has started");
});
