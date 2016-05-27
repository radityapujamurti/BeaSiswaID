Template.post.events({
  'click #verify-btn'(){
    Meteor.call("verifyPost", this._id);   
  },
  'click #delete-btn'(){
    var r = confirm("Confirm to delete this post?");
    if (r == true) {
    Meteor.call("deletePost", this._id);
    } else {
      return;
    }
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