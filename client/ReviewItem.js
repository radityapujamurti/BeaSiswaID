Template.reviewItem.events({
  'click #likeBtn'(){
    var user= Meteor.user();
    if(!user){
      alert('Please log in with Facebook');
    } else {
      Meteor.call("likeReview", this._id);
    }
  },
  'click #dislikeBtn'(){
    var user= Meteor.user();
    if(!user){
      alert('Please log in with Facebook');
    } else {
      Meteor.call("dislikeReview", this._id);
    }
  },
})
Template.reviewItem.helpers({
  isPostOwner: function(){
    return this.author == Meteor.user().profile.name
  },
  isEditReviewMode: function(){
  if (Session.get("editReviewMode") && (Session.get("editReviewId") == this._id))
    return true;
  else
    return false;
  },
  likeCount: function(){    
      return this.likers.length
  },
  dislikeCount: function(){
      return this.dislikers.length
  },
});
Template.reviewItem.events({
  'click #editReviewBtn'(){
    Session.set("editReviewMode", true);
    Session.set("editReviewId", this._id);
  },
  'click #delete-btn'(){
    var r = confirm("Confirm to delete this story?");
    if (r == true) {
      Meteor.call("deleteReview", this._id);
    } else {
      return;
    }
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