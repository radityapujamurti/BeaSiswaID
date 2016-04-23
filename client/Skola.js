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


Template.home.onRendered(function(){
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
    posts: function () {
      if(Session.get('location')){
        if(Session.get('location') == 'All'){
          return Posts.find({verified:true}, {sort: {createdAt: -1}});
        } else {
        return Posts.find({location:Session.get('location')},
                              {verified:true}, {sort: {createdAt: -1}}); 
        }   
      }       
       else {
            return Posts.find({verified:true}, {sort: {createdAt: -1}});    
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
Template.reviewArea.events({
  
});

Template.admin.helpers({
    posts: function () {
       return Posts.find({verified:false}, {sort: {createdAt: -1}});    
    }
    
  });
Template.admin.onRendered(function(){
    $(document).ready(function(){

    })
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
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      // Insert a task into the collection
      Meteor.call("addPost", title, eligibility, description, location, link);
 
      // Clear form
      event.target.title.value= "";
      alert("post added!");
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
      alert("post added!");
    }
})

Template.admin.events({
    "submit .admin-control": function(event){
      event.preventDefault();
        window.location.href = "/";
    }
})


