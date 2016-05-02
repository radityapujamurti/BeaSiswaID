Posts = new Mongo.Collection("posts");
Reviews = new Mongo.Collection("reviews");

Meteor.publish("posts", function(){
	return Posts.find({}, {sort: {createdAt: -1}});
});
Meteor.publish("reviews", function(){
  return Reviews.find({}, {sort: {createdAt: -1}});
});

Meteor.methods({
  addPost: function(title,eligibility,description,deadline,location,link) {
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
        deadline: deadline,
        location: location,
        link: link,
        author: Meteor.user().profile.name,
        verified: isVerified,
        archive: false,
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
        archive: false,
        createdAt: new Date()
    });
  },
  verifyPost: function(id) {
    Posts.update(id,{
          $set: {verified: true}
    });
  },
  deletePost: function(id) {
    Posts.update(id,{
          $set: {archive: true}
    });
  },
  verifyReview: function(id){
    Reviews.update(id,{$set:{verified: true}})
  },
  deleteReview: function(id){
    Reviews.update(id,{
          $set: {archive: true}
        })
  },
  recoverPostsArchive: function(id){
    Posts.update(id,{
          $set: {archive: false}
    });
  },
  deletePostsArchive: function(id){
    Posts.remove(id);
  },
  recoverReviewsArchive: function(id){
    Reviews.update(id,{
          $set: {archive: false}
    });
  },
  deleteReviewsArchive: function(id){
    Reviews.remove(id);
  }
});