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
      var title = event.target.title.value;
      var eligibility = event.target.eligibility.value;
      var description = event.target.description.value;
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      // Insert a task into the collection
      Posts.insert({
        title: title,
        eligibility: eligibility,
        description: description,
        location: location,
        link: link,
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.title.value= "";
      alert("post added!");
    }

  });
