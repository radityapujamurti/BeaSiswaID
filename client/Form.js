
Template.addPostForm.events({
    "submit .new-post": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var description = event.target.description.value;
      var deadline = event.target.deadline.value;
      var location = event.target.location.value;
      var link = event.target.link.value;
 
      // Insert a task into the collection
      Meteor.call("addPost", title, description, deadline, location, link);
 
      // Clear form
      event.target.title.value= "";
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
});

Template.editReviewForm.rendered = function(){
    $(".edit-review #country").countrySelect({
    "defaultCountry": "id",
    "preferredCountries": ["id"]
  });
}
Template.editReviewForm.events({
  "submit .edit-review": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var title = event.target.title.value;
      var location = event.target.location.value;
      var content = event.target.content.value;
      var preview = content.substr(0,100)+'...';

      // Insert a task into the collection
      Meteor.call("editReview", this._id, title, location, content, preview);
 
      alert("Your story has been updated!");
  }
});

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
  $(".new-review #country").countrySelect({
    "defaultCountry": "id",
    "preferredCountries": ["id"]
  });
}


