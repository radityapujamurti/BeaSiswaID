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
  'click #verifiedTabBtn'(){
    Session.set('tabMode', 'verified');
    $('#tabstripNav li').removeClass('active');
    $('#verifiedTabBtn').addClass('active');
  },
  'click #popularTabBtn'(){
    Session.set('tabMode', 'popular');
    $('#tabstripNav li').removeClass('active');
    $('#popularTabBtn').addClass('active');
  },
  'click #freshTabBtn'(){
    Session.set('tabMode', 'fresh');
    $('#tabstripNav li').removeClass('active');
    $('#freshTabBtn').addClass('active');
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
      var tabMode = Session.get('tabMode');

      if(tabMode == 'popular' ){
        if(Session.get('location')){
            if(Session.get('location') == 'All'){
              return Posts.find(
                    {$and: [
                            {archive:false}]}, 
                    {sort: {like: -1}});
            } else {
            return Posts.find(
                    {$and: [
                    {location:Session.get('location')},
                    {archive:false}]}, 
                    {sort: {like: -1}}); 
            }   
          }       
        else {
              return Posts.find({$and: [
                  {archive:false}]}, {sort: {like: -1}});    
        }
      } 
      else if(tabMode == 'fresh') {
          if(Session.get('location')){
            if(Session.get('location') == 'All'){
              return Posts.find(
                    {$and: [
                            {archive:false}]}, 
                    {sort: {createdAt: -1}});
            } else {
            return Posts.find(
                    {$and: [
                    {location:Session.get('location')},
                    {archive:false}]}, 
                    {sort: {createdAt: -1}}); 
            }   
          }       
        else {
              return Posts.find({$and: [
                  {archive:false}]}, {sort: {createdAt: -1}});    
        }
      }
      else { //verified
        if(Session.get('location')){
            if(Session.get('location') == 'All'){
              return Posts.find(
                    {$and: [{verified:true},
                            {archive:false}]}, 
                    {sort: {createdAt: -1}});
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




