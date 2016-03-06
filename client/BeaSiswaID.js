Posts = new Mongo.Collection("posts");

Template.home.helpers({
    posts: function () {
    return Posts.find({}, {sort: {createdAt: -1}});    
    }
  });

Template.addPostForm.events({
    "submit .new-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.title.value;
      console.log(text);
 
      // Insert a task into the collection
      Posts.insert({
        title: text,
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.title.value= "";
      alert("post added!");
    }
  });