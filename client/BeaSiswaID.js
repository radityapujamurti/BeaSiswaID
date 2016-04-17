Posts = new Mongo.Collection("posts");

Meteor.subscribe("posts");

Template.home.onRendered(function(){
  $(document).ready(function() {
        $('#locationList').multiselect({
          onChange: function(option, checked) {
            var selectedOptions = $('#locationList option:selected').text();
            Session.set('location', selectedOptions);

        }
      });
    });
});

Template.home.helpers({
    posts: function () {
      if(Session.get('location')){
            return Posts.find({location:Session.get('location')}, {sort: {createdAt: -1}});    
      } else {
            return Posts.find({}, {sort: {createdAt: -1}});    
      }
    }
    
  });

Template.home.events({
  "change .locationList": function (event){
    // alert("yo");
    // event.preventDefault();
    // var text = event.target.value;
    // alert(text);

  }
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
    },

    "submit .admin-control": function(event){
      event.preventDefault();
        window.location.href = "/";
    }

  });

Meteor.methods({
  addPost: function(title,eligibility,description,location,link) {
    Posts.insert({
        title: title,
        eligibility: eligibility,
        description: description,
        location: location,
        link: link,
        createdAt: new Date() // current time
      });
  }
});

