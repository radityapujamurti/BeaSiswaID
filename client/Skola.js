Posts = new Mongo.Collection("posts");
Reviews = new Mongo.Collection("reviews");

Meteor.subscribe("posts");
Meteor.subscribe("reviews");

Template.post.events({
  'click #verify-btn'(){
    Meteor.call("verifyPost", this._id);   
  },
  'click #delete-btn'(){
    Meteor.call("deletePost", this._id);
  }
});
Template.post.helpers({
  isAdmin(){
    return Meteor.userId() == "DAevKXNQH9FcFKdPH";
  }
})

Template.reviewItem.onRendered(function(){
  $(document).ready(function() {
        $('#locationList').multiselect({
          includeSelectAllOption: true,
          onChange: function(option, checked) {
            var selectedOptions = $('#locationList option:selected').text();
            Session.set('location', selectedOptions);
        }
      });
    });
});

Template.addPostForm.onRendered(function(){
  $(".new-post #country").countrySelect();
});
Template.addReviewForm.onRendered(function(){
  $(".new-review #country").countrySelect();
});

Template.home.events({
  'click #contribute-btn'(){
      Session.set('contributeBtnClicked', false );
  },
  'click #close-btn'(){
      Session.set('contributeBtnClicked', true );
  },
  'click #addReviewBtn'(){
    Session.set('showAddReview', false);
  },
  'click #reviewCloseBtn'(){
    Session.set('showAddReview', true);
  },
  'click .reviewTitle'(){
    Session.set('reviewIDToBeDisplayed', this._id);
  },
  'click #expandedReview-close-btn'(){
      Session.set('reviewIDToBeDisplayed', null );
  },
})

Template.home.helpers({
  locationItems: function(){
  var distinctEntries = _.uniq(Posts.find({$and: [{verified:true},
                {archive:false}]}).fetch().map(function(x){
    return x.location;
  }),true);
  return distinctEntries;
  },
    posts: function () {
      if(Session.get('location')){
        if(Session.get('location') == 'All'){
          return Posts.find({$and: [{verified:true},
                {archive:false}]}, {sort: {createdAt: -1}});
        } else {
        return Posts.find(
                {$and: [{verified:true},
                {location:Session.get('location')},
                {archive:false}]}, 
                {sort: {createdAt: -1}}); 
        }   
      }       
       else {
            return Posts.find({$and: [{verified:true},
                {archive:false}]}, {sort: {createdAt: -1}});    
      }
    },
    expandReview: function(){
      if(Session.get('reviewIDToBeDisplayed')){
        return true;
      } else {
        return false;
      }
    },
    reviews: function(){
      return Reviews.find({_id:Session.get('reviewIDToBeDisplayed')});
    },
    displayContributeBtn(){
      if(Session.get('contributeBtnClicked') == null)
        return true;
      return Session.get('contributeBtnClicked');
    },
    displayAddReviewBtn(){
      if(Session.get('showAddReview') == null)
        return true;
      return Session.get('showAddReview');
    }
    
  });

Template.reviewArea.helpers({
    reviews: function(){
      return Reviews.find({verified:true}, {createdAt: -1});
    },

});

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
  });

Template.addPostForm.onRendered(function(){
  $(document).ready(function(){
       $('.datepicker').datepicker();
    });
});

Template.addPostForm.events({
    "submit .new-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var eligibility = event.target.eligibility.value;
      var description = event.target.description.value;
      var deadline = event.target.deadline.value;
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      // Insert a task into the collection
      Meteor.call("addPost", title, eligibility, description, deadline, location, link);
 
      // Clear form
      event.target.title.value= "";
      event.target.eligibility.value= "";
      event.target.description.value= "";
      event.target.deadline.value= "";
      event.target.location.value= "";
      event.target.link.value= "";

      alert("Thank you! Your post will be reviewed.");

    }
  });
Template.addReviewForm.events({
  "submit .new-review": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var location = event.target.location.value;
      var content = event.target.content.value;
      var preview = content.substr(0,100)+'...';

      // Insert a task into the collection
      Meteor.call("addReview", title, location, content, preview);
 
      // Clear form
      event.target.title.value= "";
      event.target.location.value= "";
      event.target.content.value= "";
      alert("Thank you! Your story will be reviewed.");
    }
})

Template.admin.events({
    "click #viewHomeBtn": function(event){
      event.preventDefault();
        window.location.href = "/";
    }
})

