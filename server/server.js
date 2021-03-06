Posts = new Mongo.Collection("posts");
Reviews = new Mongo.Collection("reviews");
Admins = new Mongo.Collection("admins");

Meteor.publish("posts", function(){
	return Posts.find({}, {sort: {createdAt: -1}});
});
Meteor.publish("reviews", function(){
  return Reviews.find({}, {sort: {createdAt: -1}});
});
Meteor.publish("admins", function(){
  return Admins.find();
});

Meteor.methods({
  initAdmin: function(){
      if(Admins.find({})){
        return;
      } else {
        Admins.insert({
          name: 'Made Raditya Pujamurti'
        });
        Admins.insert({
          name: 'Byan'
        });
      }
  },
  addPost: function(title,description,deadline,location,link) {
    var isVerified;
    if(Meteor.userId() == 'TWFHrTkLYzeYDdp88'){
      isVerified = true;
    } else {
      isVerified = false;
    }
    Posts.insert({
        title: title,
        description: description,
        deadline: deadline,
        location: location,
        link: link,
        author: Meteor.user().profile.name,
        verified: isVerified,
        likers: [],
        dislikers: [],
        likersCount: 0,
        archive: false,
        createdAt: new Date() // current time
      });
  },
  editPost: function(id,title,description,deadline,location,link){
    Posts.update(id,{
          $set: {
            title: title,
            description: description,
            deadline: deadline,
            location: location,
            link: link
          }
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
        likers: [],
        dislikers: [],
        archive: false,
        createdAt: new Date()
    });
  },
  editReview: function(id,title,location,content,preview){
    Reviews.update(id,{
          $set: {
            title: title,
            location: location,
            content: content,
            preview: preview
          }
    });
  },
  deleteReview: function(id){
    Reviews.update(id,{
          $set: {archive: true}
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
  },
  likePost: function(postId) {    
    var post = Posts.findOne(postId);
    //if the user already in a disliker array
    if (post.dislikers && _.contains(post.dislikers, this.userId)) {
      Posts.update({      
          _id: postId
        },
        {
          $pull: { //remove the same liker from the array
            dislikers: this.userId
          },
          $addToSet: {
            likers: this.userId
          }
        })
    }  
    else{
        Posts.update({
          _id: postId
        }, {$addToSet: {
          likers: this.userId
        }
      })
    }

    if(_.contains(post.likers, this.userId)){
        //do not update the like count
    } else {
      Posts.update({
          _id: postId },
          {$inc : {likersCount: 1}})
    }
  },

  dislikePost: function(postId) {    
    var post = Posts.findOne(postId);
    //if the user already in a liker array
    if (post.likers && _.contains(post.likers, this.userId)) {
      Posts.update({      
          _id: postId
        },
        {
          $pull: { //remove the disliker from the array
            likers: this.userId
          },
          $addToSet: {
            dislikers: this.userId
          }
        });

      Posts.update({
          _id: postId },
          {$inc : {likersCount: -1}});
    }
    else{
      Posts.update({
        _id: postId
      }, {$addToSet: {
        dislikers: this.userId
        }
      });
    }
  },
  likeReview: function(postId) {    
    var post = Reviews.findOne(postId);
    //if the user already in a disliker array
    if (post.dislikers && _.contains(post.dislikers, this.userId)) {
      Reviews.update({      
          _id: postId
        },
        {
          $pull: { //remove the same liker from the array
            dislikers: this.userId
          },
          $addToSet: {
            likers: this.userId
          }
        })
    }  
    else{
        Reviews.update({
          _id: postId
        }, {$addToSet: {
          likers: this.userId
        }
      })
    }

    if(_.contains(post.likers, this.userId)){
        //do not update the like count
    } else {
      Reviews.update({
          _id: postId },
          {$inc : {likersCount: 1}})
    }
  },

  dislikeReview: function(postId) {    
    var post = Reviews.findOne(postId);
    //if the user already in a liker array
    if (post.likers && _.contains(post.likers, this.userId)) {
      Reviews.update({      
          _id: postId
        },
        {
          $pull: { //remove the disliker from the array
            likers: this.userId
          },
          $addToSet: {
            dislikers: this.userId
          }
        });

      Reviews.update({
          _id: postId },
          {$inc : {likersCount: -1}});
    }
    else{
      Reviews.update({
        _id: postId
      }, {$addToSet: {
        dislikers: this.userId
        }
      });
    }
  },
});