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
          includeSelectAllOption: true,
          onChange: function(option, checked) {
            var selectedOptions = $('#locationList option:selected').text();
            Session.set('location', selectedOptions);
        }
      });
    });
});
Template.home.events({
  'click #contribute-btn'(){
      Session.set('contributeBtnClicked', false );
  },
  'click #close-btn'(){
      Session.set('contributeBtnClicked', true );
  },
})
Template.home.helpers({
    posts: function () {
      if(Session.get('location')){
        if(Session.get('location') == 'All'){
          return Posts.find({verified:true}, {sort: {createdAt: -1}});
        } else {
        return Posts.find({location:Session.get('location')},
                              {verified:true}, {sort: {createdAt: -1}}); 
        }   
      }       
       else {
            return Posts.find({verified:true}, {sort: {createdAt: -1}});    
      }
    },
    displayContributeBtn(){
      if(Session.get('contributeBtnClicked') == null)
        return true;
      return Session.get('contributeBtnClicked');
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

Template.addPostForm.onRendered(function(){
  $(document).ready(function(){
       $('.datepicker').datepicker();
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

