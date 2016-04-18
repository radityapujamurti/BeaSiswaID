Posts = new Mongo.Collection("posts");

Meteor.subscribe("posts");

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
          onChange: function(option, checked) {
            var selectedOptions = $('#locationList option:selected').text();
            Session.set('location', selectedOptions);

        }
      });

        $('#contribute-btn').click(function() {
            $('#contributeForm').attr('style','display:block');
            $('#contribute-btn').attr('style','display:none');

        });

        $('#close-btn').click(function() {
            $('#contributeForm').attr('style','display:none');
            $('#contribute-btn').attr('style','display:block');

        });
    });
});

Template.home.helpers({
    posts: function () {
      if(Session.get('location')){
            return Posts.find({location:Session.get('location')},
                              {verified:true}, {sort: {createdAt: -1}});    
      } else {
            return Posts.find({verified:true}, {sort: {createdAt: -1}});    
      }
    }
    
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

Template.admin.events({
    "submit .admin-control": function(event){
      event.preventDefault();
        window.location.href = "/";
    }
})

Meteor.methods({
  addPost: function(title,eligibility,description,location,link) {
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
        location: location,
        link: link,
        author: Meteor.userId(),
        verified: isVerified,
        createdAt: new Date() // current time
      });
  },
  verifyPost: function(id) {
    Posts.update(id,{
          $set: {verified: true}
    });
  },
  deletePost: function(id) {
    Posts.remove(id);
  }
});

