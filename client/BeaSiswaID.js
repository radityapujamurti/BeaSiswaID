Posts = new Mongo.Collection("posts");

Template.body.helpers({
    posts: function () {
    return Posts.find({}, {sort: {createdAt: -1}});    
    }
  });

Template.body.events({
    "submit .new-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Posts.insert({
        title: text,
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });