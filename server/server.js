Posts = new Mongo.Collection("posts");

Meteor.publish("posts", function(){
	return Posts.find({}, {sort: {createdAt: -1}});
});

Meteor.methods({
  addPost: function(title,eligibility,description,location,link) {
    Posts.insert({
        title: title,
        eligibility: eligibility,
        description: description,
        location: location,
        link: link,
        createdAt: new Date() // current time
      });
  }
});