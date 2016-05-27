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
    $('#scholarshipListArea #tabstripNav li').removeClass('active');
    $('#scholarshipListArea #verifiedTabBtn').addClass('active');
  },
  'click #popularTabBtn'(){
    Session.set('tabMode', 'popular');
    $('#scholarshipListArea #tabstripNav li').removeClass('active');
    $('#scholarshipListArea #popularTabBtn').addClass('active');
  },
  'click #freshTabBtn'(){
    Session.set('tabMode', 'fresh');
    $('#scholarshipListArea #tabstripNav li').removeClass('active');
    $('#scholarshipListArea #freshTabBtn').addClass('active');
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



