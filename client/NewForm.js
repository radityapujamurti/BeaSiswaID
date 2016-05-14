Template.addPostForm.onRendered(function(){
  $(document).ready(function(){
       $('.datepicker').datepicker({
         minDate:Date.now,
       });
    });
});

Template.addPostForm.events({
    "submit .new-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var eligibility = event.target.eligibility.value;
      var description = event.target.description.value;
      var deadline = event.target.deadline.value;
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      // Insert a task into the collection
      Meteor.call("addPost", title, eligibility, description, deadline, location, link);
 
      // Clear form
      event.target.title.value= "";
      event.target.eligibility.value= "";
      event.target.description.value= "";
      event.target.deadline.value= "";
      event.target.location.value= "";
      event.target.link.value= "";

      alert("Thank you! Your post will be reviewed.");

    }
  });
Template.addReviewForm.events({
  "submit .new-review": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var location = event.target.location.value;
      var content = event.target.content.value;
      var preview = content.substr(0,100)+'...';

      // Insert a task into the collection
      Meteor.call("addReview", title, location, content, preview);
 
      // Clear form
      event.target.title.value= "";
      event.target.location.value= "";
      event.target.content.value= "";
      alert("Thank you! Your story will be reviewed.");
    }
})