Posts = new Mongo.Collection("posts");

Meteor.publish("posts", function(){
	return Posts.find({}, {sort: {createdAt: -1}});
});

Meteor.methods({
  addPost: function(title,eligibility,description,location,link) {
    var isVerified;
    if(Meteor.userId() == 'DAevKXNQH9FcFKdPH'){
      isVerified = true;
    } else {
      isVerified = false;
    }
    Posts.insert({
        title: title,
        eligibility: eligibility,
        description: description,
        location: location,
        link: link,
        author: Meteor.userId(),
        verified: isVerified,
        createdAt: new Date() // current time
      });
  },
  verifyPost: function(id) {
    Posts.update(id,{
          $set: {verified: true}
    });
  },
  deletePost: function(id) {
    Posts.remove(id);
  }
});