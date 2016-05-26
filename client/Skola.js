// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});

Posts = new Mongo.Collection("posts");
Reviews = new Mongo.Collection("reviews");
Admins = new Mongo.Collection("admins");

Meteor.subscribe("posts");
Meteor.subscribe("reviews");
Meteor.subscribe("admins");

Template.post.events({
  'click #verify-btn'(){
    Meteor.call("verifyPost", this._id);   
  },
  'click #delete-btn'(){
    Meteor.call("deletePost", this._id);
  },
  'click #likeBtn'(){
    var user= Meteor.user();
    if(!user){
      alert('Please log in with Facebook');
    } else {
      Meteor.call("likePost", this._id);
    }
  },
  'click #dislikeBtn'(){
    var user= Meteor.user();
    if(!user){
      alert('Please log in with Facebook');
    } else {
      Meteor.call("dislikePost", this._id);
    }
  },
  'click #editPostBtn'(){
    Session.set("editPostMode", true);
    Session.set("editPostId", this._id);
  },
  'click #close-btn'(){
      Session.set("editPostMode", false);
  },
  "submit .edit-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var eligibility = event.target.eligibility.value;
      var description = event.target.description.value;
      var deadline = event.target.deadline.value;
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      Meteor.call("editPost", this._id, title, eligibility, description, deadline, location, link);

      alert("The post has been updated");
      Session.set("editPostMode", false);
  }
});
Template.post.helpers({
  isAdmin: function(){
    Meteor.call("initAdmin");
    if(Admins.find({name:Meteor.user().profile.name})){
      return true;
    }
    else
      return false;
  },
  likeCount: function(){    
      return this.likers.length
  },
  dislikeCount: function(){
      return this.dislikers.length
  },
  isPostOwner: function(){
    return this.author == Meteor.user().profile.name
  },
  isEditPostMode: function(){
    if (Session.get("editPostMode") && (Session.get("editPostId") == this._id))
      return true;
    else
      return false;
  }
});

Template.reviewItem.helpers({
  isPostOwner: function(){
    return this.author == Meteor.user().profile.name
  },
  isEditReviewMode: function(){
  if (Session.get("editReviewMode") && (Session.get("editReviewId") == this._id))
    return true;
  else
    return false;
  }
});
Template.reviewItem.events({
  'click #editReviewBtn'(){
    Session.set("editReviewMode", true);
    Session.set("editReviewId", this._id);
  },
  'click #delete-btn'(){
    Meteor.call("deleteReview", this._id);
  },
  'click #close-btn'(){
    Session.set("editReviewMode", false);
  },
});

Template.reviewItem.rendered = function(){
    $('#locationList').multiselect({
      includeSelectAllOption: true,
      onChange: function(option, checked) {
        var selectedOptions = $('#locationList option:selected').text();
        Session.set('location', selectedOptions);
        $("body, html").animate({ scrollTop: $("#tabstripNav").offset().top + 'px' }, 'medium');
    }
  });
}

Template.addPostForm.rendered = function(){
  $(".new-post #country").countrySelect({
    "defaultCountry": "id",
    "preferredCountries": ["id"]
  });
  $(this.find('[data-toggle="tooltip"]')).tooltip();
  
  //disable the past dates
  var nowTemp = new Date();
  var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
  $('.datepicker').datepicker({
    onRender: function(date) {
    return date.valueOf() < now.valueOf() ? 'disabled' : '';
    }
  });
}

Template.editPostForm.rendered = function(){
  $(".edit-post #country").countrySelect({
    "defaultCountry": "id",
    "preferredCountries": ["id"]
  });
  $(this.find('[data-toggle="tooltip"]')).tooltip();
  
  //disable the past dates
  var nowTemp = new Date();
  var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
  $('.datepicker').datepicker({
    onRender: function(date) {
    return date.valueOf() < now.valueOf() ? 'disabled' : '';
    }
  });
}

Template.addReviewForm.rendered = function(){
  $(".new-review #country").countrySelect();
}

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
  var distinctEntries = _.uniq(Posts.find(
      {
        $and: [{verified:true},
        {archive:false}]
      },
      {
        sort: {location:1}
      } 
        ).fetch().map(function(x){
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
                    {sort: {likersCount: -1}});
            } else {
            return Posts.find(
                    {$and: [
                    {location:Session.get('location')},
                    {archive:false}]}, 
                    {sort: {likersCount: -1}}); 
            }   
          }       
        else {
              return Posts.find({$and: [
                  {archive:false}]}, {sort: {likersCount: -1}});    
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
    },
    
  });

Template.reviewArea.helpers({
    reviews: function(){
      return Reviews.find({$and: [{verified:true},
                    {archive:false}]}, 
                    {sort: {createdAt: -1}});
    },

});

Template.reviewItemExpanded.rendered = function(){ 
  //modify the description text to have new line
  $('.reviewPostExpanded .reviewContent').html($('.reviewPostExpanded .reviewContent').text().replace(/\n\r?/g, '<br />'));
};

//Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-78370613-1', 'auto');
ga('send', 'pageview');



