# Campgrounds-NodeJS-Application
YelpCamp is an online social media aimed at sharing different campgrounds across the world. It is implemented using RESTful routing following an MVC architecture. It has three modules namely – User, Campgrounds and Comments. MongoDB is used for storing the schemas of all the three modules. YelpCamp involves implementing the CRUD operations on all its modules. 

FUNCTIONALITY:

•	User can sign-up and create an account on YelpCamp. The user can be the admin of YelpCamp if and only if he/she knows the secret code (that is predefined in the code) for being an admin. 
•	As a user he/she can perform CRUD operations on the campgrounds and comments added by him/her only. While an admin has the authority to perform CRUD operations on all the campgrounds and comments, whether or not the admin is the author of that campground or comment.

Additionally, this app is equipped with features like –
•	Authentication:
Authentication confirms that a user is who they claim to be. For example, when a user logs into his account on YelpCamp, then YelpCamp can verify that it is you and not an attacker trying to trick.

•	Authorization:
Another way of handling the security concerns is Authorization. Authorization defines whether a user is allowed to do something. YelpCamp may authorize you to delete any campground or any comment. Also, every user has the authority to delete only his/her campground or comment. 
This is implemented using session management that ties authentication and authorization together. Middlewares have been handy in checking for the authorization while the flash messages have been used for displaying the messages to the user.

•	Flash Messages:
This module provides a way to set one-time notifications to be displayed during or after processing a request. Also, it finds usage in error handling of the application. If the user is not signed in and tries to add a new campground then a flash message saying “You need to be logged in to do that” is displayed along with redirecting the user to the sign-up page OR a non-admin user tries to delete/edit a comment of any other user then a flash message saying “you are not authorized to do that” pops up on the page.

•	Google Maps Location:
While adding a new campground location of the campground is one of the input parameters for the user. Now, using the google map API, the latitude and longitude of the location is determined and then given as inputs to the google map and thus plotting a google map for the campground.

•	Time Since Created (using MomentJS):
MomentJS is used to determine the time elapsed since a comment to the campground is made.

•	Fuzzy Search:
User can search for a particular campground by matching the name of the campground with the search argument.

•	Image Upload:
User can upload image of the campground that he wants to display. This is done using ‘Cloudinary’ which is a cloud-based image and video management solution. It enables users to upload and deliver images to YelpCamp with the goal of improving performance.

