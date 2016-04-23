Posts = new Mongo.Collection("posts");
Reviews = new Mongo.Collection("reviews");

Meteor.publish("posts", function(){
	return Posts.find({}, {sort: {createdAt: -1}});
});
Meteor.publish("reviews", function(){
  return Reviews.find({}, {sort: {createdAt: -1}});
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
  addReview: function(title,location,content,preview){
    Reviews.insert({
        title: title,
        location: location,
        content: content,
        preview: preview,
        author: Meteor.user().profile.name,
        verified: false,
        createdAt: new Date()
    });
  },
  verifyPost: function(id) {
    Posts.update(id,{
          $set: {verified: true}
    });
  },
  deletePost: function(id) {
    Posts.remove(id);
  },
  verifyReview: function(id){
    Reviews.update(id,{$set:{verified: true}})
  },
  deleteReview: function(id){
    Reviews.remove(id);
  }
});