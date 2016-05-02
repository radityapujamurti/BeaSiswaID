Template.admin.helpers({
    posts: function () {
       return Posts.find({
        $and: [{verified:false},
                {archive:false}]
              });    
    },
    reviews: function(){
      return Reviews.find({
        $and: [{verified:false},
                {archive:false}]
              }); 
    },
    archivePosts: function(){
      return Posts.find({archive:true});
    },
    archiveReviews: function(){
      return Reviews.find({archive:true});
    },
    displayPosts: function(){
      if(Session.get('adminControl')=='viewPost' || Session.get('adminControl')== null)
        return true;
      else
        return false; 
    },
    displayReviews: function(){
      if(Session.get('adminControl')=='viewReview')
        return true;
      else
        return false; 
    },
    displayArchive: function(){
      if(Session.get('adminControl')=='viewArchive')
        return true;
      else
        return false; 
    }
    
  });
Template.admin.events({
    'click #verifyReviewBtn'(){
      Meteor.call('verifyReview', this._id);
    },
    'click #deleteReviewBtn'(){
      Meteor.call('deleteReview', this._id);
    },
    'click #viewReviewBtn'(){
      Session.set('adminControl', 'viewReview');
    },
    'click #viewPostBtn'(){
      Session.set('adminControl', 'viewPost');
    },
    'click #viewArchiveBtn'(){
      Session.set('adminControl', 'viewArchive');
    },
    'click #recoverArchivePostsBtn'(){
      Meteor.call('recoverPostsArchive', this._id);
    },
    'click #deleteArchivePostsBtn'(){
      Meteor.call('deletePostsArchive', this._id);
    },
    'click #recoverArchiveReviewsBtn'(){
      Meteor.call('recoverReviewsArchive', this._id);
    },
    'click #deleteArchiveReviewsBtn'(){
      Meteor.call('deleteReviewsArchive', this._id);
    },
    "click #viewHomeBtn": function(event){
      event.preventDefault();
        window.location.href = "/";
    }
  });
